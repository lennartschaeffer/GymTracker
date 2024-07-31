import { View, Text, TouchableOpacity } from "react-native";
import React from "react";
import { Image } from "react-native";
import { deleteFile, deletePost, getUser } from "../lib/appwrite";
import { useState, useEffect } from "react";
import { icons } from "../constants";
import { ActivityIndicator } from "react-native";
import { Video } from "expo-av";
import { ResizeMode } from "expo-av";
import CustomButton from "./CustomButton";
import { useRef } from "react";
import { useGlobalContext } from "../context/globalprovider";
import { Modal } from "react-native";
import { Alert } from "react-native";

const Post = ({ post }) => {
  const userInfo = useGlobalContext()
  const [user, setUser] = useState(null);
  const [postLoading, setPostLoading] = useState(false);
  const [status, setStatus] = useState({});
  const [loadDisplay, setLoadDisplay] = useState();
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);

  const url = post?.photoUrl;

  const video = useRef(null);

  const postLoadStart = () => {
    console.log("post loading..");
    setPostLoading(true);
  };
  const postLoadFinish = () => {
    console.log("post complete!");
    setPostLoading(false);
  };

  let date = post.$createdAt.substring(0, post.$createdAt.indexOf("T"));
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userData = await getUser(post?.creator?.$id);
        setUser(userData);
      } catch (error) {
        console.error("Error fetching user:", error);
      }
    };

    fetchUserData();
  }, []);

  useEffect(() => {
    setLoadDisplay(
      postLoading && <ActivityIndicator size="large" color="#000000" />
    );
  }, [postLoading]);

  const showDeletePost = () => {
    console.log('del post')
    setDeleteModalVisible(true);
  }

  const closeDeletePost = () => {
    setDeleteModalVisible(false);
  }

  const deleteDoc = async () => {
    try{
      await deletePost(post?.$id);
      if(post?.photoUrl){
        const filesIndex = url.indexOf("/files/");
        const previewIndex = url.indexOf("/preview");
        const filteredString = url.substring(filesIndex + "/files/".length, previewIndex);
        console.log(filteredString); 
        try{
          await deleteFile(filteredString);
        }catch(err){
          Alert.alert('Error','Couldnt remove file from storage bucket')
        }
      }
      Alert.alert('Success','Post Deleted')
    }catch(err){
      Alert.alert('Error','Couldnt delete post')
    }finally{
      setDeleteModalVisible(false);
    }
   
  }

  return (
    <View className="w-full h-90 bg-purple-100 p-4 d-flex justify-center items-center mt-2 rounded-2xl">
      <View className="w-full justify-content-start p-1">
        <View className="flex-row items-center w-full gap-2 ">
          <Image
            source={{ uri: user?.avatar }}
            className="w-12 h-12 rounded-full bg-black-100 mb-1"
          />
          <Text className="text-2xl font-semibold">{user?.username}</Text>
          
        </View>
      </View>
      <View className="w-full">
        {loadDisplay}
        {post.photoUrl && (
          <Image
            source={{ uri: post.photoUrl }}
            className="h-80 w-full rounded-2xl"
            onLoadStart={postLoadStart}
            onLoadEnd={postLoadFinish}
          />
        )}
        {post.videoUrl && (
          <View>
            <Video
              ref={video}
              source={{ uri: post.videoUrl }}
              className="w-full h-64 rounded-2xl"
              useNativeControls
              resizeMode={ResizeMode.CONTAIN}
              isLooping
              onLoadStart={postLoadStart}
              onLoad={postLoadFinish}
              onPlaybackStatusUpdate={(status) => setStatus(() => status)}
            />
            <TouchableOpacity
              onPress={() =>
                status.isPlaying
                  ? video.current.pauseAsync()
                  : video.current.playAsync()
              }
              className="p-2 w-full items-center rounded-2xl mt-1 mb-1"
            >
              {status.isPlaying ? (
                <Image source={icons.pause} className="w-8 h-8" />
              ) : (
                <Image source={icons.play} className="w-8 h-8" />
              )}
            </TouchableOpacity>
          </View>
        )}
      </View>
      <View className="flex-row items-start mb-3 w-full">
        <Text className="font-psemibold">{user?.username}&nbsp;</Text>
        <Text className="font-pregular text-left w-3/5">
          {post.title ? post.title : "i didnt put a caption cuz im stupid"}
        </Text>
      </View>
      <View className="flex-row w-full items-center justify-between border-t-2">
        <View className="flex-row gap-2">
        <Image source={icons.calendar} className="w-4 h-4" />
        <Text className="font-pregular">{date}</Text>
        </View>
        {post?.creator?.$id === userInfo?.user?.$id && (
            <TouchableOpacity className="p-1 rounded-full mt-1"
              onPress={showDeletePost}
            >
              <Image source={icons.trash} className="w-6 h-6" />
            </TouchableOpacity>
          )}
      </View>
      <Modal visible={deleteModalVisible} animationType="slide" transparent={true}>
        <View className="h-full justify-center items-center bg-red-400">
        <View className="items center bg-primary p-5 rounded-lg">
          <Text className="font-psemibold text-2xl mb-3 text-white">Delete Post?</Text>
          <CustomButton
          title={<Image source={icons.trash} className="w-6 h-6"/>}
          containerStyles="mb-4 mt-4 bg-red-600"
          handlePress={deleteDoc}
          />
          <CustomButton title="Close" handlePress={closeDeletePost} containerStyles="bg-gray-400" />
        </View>
        </View>
        
      </Modal>
      </View>
  );
};

export default Post;
