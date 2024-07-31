import { View, Text, SafeAreaView, Image } from "react-native";
import { useGlobalContext } from "../../context/globalprovider";
import { TouchableOpacity } from "react-native";
import { icons } from "../../constants";
import React from "react";
import { signOut } from "../../lib/appwrite";
import { router } from "expo-router";

const Profile = () => {
  const { user, setUser, setIsLoggedIn } = useGlobalContext();

  console.log(user?.avatar);

  const logout = async () => {
    await signOut();
    setUser(null);
    setIsLoggedIn(false);
    router.replace("/sign-in");
  };

  let date = user?.$createdAt ? new Date(user.$createdAt) : new Date();
  let formattedDate = date.toISOString().split("T")[0];
  return (
    <SafeAreaView className="bg-primary h-full">
      <View className="w-full justify-start items-center min-h-[85vh] px-4 my-6">
        <View className="flex flex-col items-center justify-center gap-3">
          <Image
            source={{uri : user?.avatar}}
            className="w-32 h-32 rounded-full"
          />
          <View className="flex-row items-center justify-center gap-3">
            <Text className="font-psemibold text-purple-100 text-3xl">
              {user?.username}
            </Text>
          </View>
        </View>
        <View className="h-50 bg-purple-100 items-start mt-10 rounded-lg p-5">
          <View className="flex-col gap-5">
            <View className="border-b-2 flex-row justify-between">
              <Text className="font-psemibold text-lg">Name:</Text>
              <Text className="font-pregular text-lg">{user?.username}</Text>
            </View>
            <View className="border-b-2 flex-row justify-between">
              <Text className="font-psemibold text-lg">Email:</Text>
              <Text className="font-pregular text-lg">{user?.email}</Text>
            </View>
            <View className="border-b-2 flex-row justify-between">
              <Text className="font-psemibold text-lg">Joined On:</Text>
              <Text className="font-pregular text-lg">{formattedDate}</Text>
            </View>
          </View>
        </View>
        <View className="mt-5">
          <TouchableOpacity
            onPress={logout}
            className="bg-red-700 h-12 w-32 rounded-lg items-center justify-center"
          >
            <Text className="font-psemibold text-xl">Logout</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default Profile;
