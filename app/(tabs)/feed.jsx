import { View, Text, TouchableOpacity, Image } from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { icons } from "../../constants";
import { Modal } from "react-native";
import { useState } from "react";
import CustomButton from "../../components/CustomButton";
import FormField from "../../components/FormField";
import ContentUpload from "../../components/ContentUpload";
import { FlatList } from "react-native";
import useAppwrite from "../../lib/useAppwrite";
import { getAllPosts } from "../../lib/appwrite";
import { RefreshControl } from "react-native";
import PhotoUpload from "../../components/PhotoUpload";
import Post from "../../components/Post";
import VideoUpload from "../../components/VideoUpload";

const Feed = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [photoModalVisible, setPhotoModalVisible] = useState(false);
  const [videoModalVisible, setVideoModalVisible] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const { data: posts, refetch, loading } = useAppwrite(getAllPosts);

  const onRefresh = async () => {
    console.log("refreshing!!!");
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };

  return (
    <SafeAreaView className="bg-primary h-full p-2">
      <View className="w-full justify-center items-center min-h-[75vh] px-4 my-6">
        <View className="flex-row gap-12 items-end">
          <Text className="text-4xl text-purple-100 font-psemibold">
            My Feed
          </Text>
          <View className="flex-row items-center gap-2">
            <TouchableOpacity
              onPress={() => setPhotoModalVisible(true)}
              className="bg-purple-100 rounded-full p-1"
            >
              <Image source={icons.image} className="w-8 h-8" />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setVideoModalVisible(true)}
              className="bg-purple-100 rounded-full p-1"
            >
              <Image source={icons.video} className="w-8 h-8" />
            </TouchableOpacity>
          </View>
        </View>
        <FlatList
          className="w-full mt-3"
          data={posts}
          keyExtractor={(item) => item.$id}
          renderItem={({ item, index }) => (
            <Post post={item} isLoading={loading} />
          )}
          ListEmptyComponent={() => (
            <View className="mt-5 flex-1">
              <View className="items-center gap-6 mb-6">
                <Text className="text-2xl text-white font-psemibold">
                  No Posts found...
                </Text>
                <Image source={icons.confused} className="w-32 h-32 " />
              </View>
              <Text className="text-md text-white text-center font-pregular">
                  Use the buttons in the top right to post a photo or video of your workout!
                </Text>
            </View>
          )}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        />
        <PhotoUpload
          modalVisible={photoModalVisible}
          onClose={() => setPhotoModalVisible(!photoModalVisible)}
        />
        <VideoUpload
          modalVisible={videoModalVisible}
          onClose={() => setVideoModalVisible(!videoModalVisible)}
        />
        <View className="p-2 flex-col justify-center items-center">
          <Text className="text-white text-lg font-pregular ">
            Pull Down to Refresh...
          </Text>
          <Image source={icons.refresh} />
        </View>
      </View>
    </SafeAreaView>
  );
};

export default Feed;
