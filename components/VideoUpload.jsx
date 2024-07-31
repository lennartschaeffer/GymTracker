import { View, Text, Modal, TouchableOpacity, Image } from "react-native";
import React from "react";
import FormField from "./FormField";
import CustomButton from "./CustomButton";
import { icons } from "../constants";
import { useState } from "react";
import { Video, ResizeMode } from "expo-av";
import { Alert } from "react-native";
import { createPost } from "../lib/appwrite";
import { useGlobalContext } from "../context/globalprovider";
import * as ImagePicker from "expo-image-picker";
import { useEffect } from "react";
import { ActivityIndicator } from "react-native";

const VideoUpload = ({ modalVisible, onClose }) => {
  const { user } = useGlobalContext();
  const [uploading, setUploading] = useState(false);
  const [loadDisplay, setLoadDisplay] = useState();
  const [form, setForm] = useState({
    title: "",
    video: null,
  });

  const openPicker = async (selectType) => {
    console.log("picekr clicked");
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes:
        selectType === "image"
          ? ImagePicker.MediaTypeOptions.Images
          : ImagePicker.MediaTypeOptions.Videos,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      if (selectType === "video") {
        setForm({ ...form, video: result.assets[0] });
      }
    }
  };

  const submit = async () => {
    setUploading(true);

    try {
      await createPost({
        ...form,
        userId: user.$id,
      });
      Alert.alert("Success", "Post uploaded successfully!");
      onClose();
    } catch (err) {
      Alert.alert("error", err.message);
    } finally {
      setForm({
        title: "",
        video: null,
      });
      setUploading(false);
    }
  };

  useEffect(() => {
    setLoadDisplay(
        uploading && <ActivityIndicator size="large" color="#FFFFFF" />
    );
  }, [uploading]);


  return (
    <Modal animationType="slide" visible={modalVisible}>
      <View className="flex justify-center h-full bg-primary p-8">
        <View className="flex flex-col  ">
          <Text className="text-xl font-psemibold text-white">
            Upload a Video
          </Text>
          <Text className="text-md font-pregular text-white">
            Show your friends what you've accomplished!
          </Text>
          <Text className="text-md font-pregular text-white mb-5">
         You cannot upload files larger than 50MB!
         </Text>
          <FormField
            title="Add a Caption..."
            handleChangeText={(e) => setForm({ ...form, title: e })}
          />
          <Text className="text-base text-gray-100 font-pmedium">
            Upload Video
          </Text>
          {form.video ? (
            <Video
              source={{ uri: form.video.uri }}
              resizeMode={ResizeMode.COVER}
              className="w-full h-64 rounded-2xl"
            />
          ) : (
            <View className="h-40 bg-black-100 justify-center items-center mt-3">
              <View className="w-48 h-14 justify-center items-center">
                <TouchableOpacity
                  onPress={() => openPicker("video")}
                  className="bg-black p-2 w-14 rounded-full "
                >
                  <Image source={icons.upload} className="w-10 h-10" />
                </TouchableOpacity>
              </View>
            </View>
          )}
          {loadDisplay}
          <View className="flex-row mt-5 justify-between">
            
            <CustomButton
              title="Close"
              containerStyles="p-3 bg-gray-500"
              handlePress={onClose}
            />
            <CustomButton
              title="Post"
              handlePress={submit}
              containerStyles="bg-purple-200 p-3"
              textStyles="text-white"
              isLoading={uploading}
            />
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default VideoUpload;
