import { View, Text, Image, FlatList } from "react-native";
import React, { useEffect } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { useGlobalContext } from "../../context/globalprovider";
import { useState } from "react";
import { getAllWorkouts } from "../../lib/appwrite";
import useAppwrite from "../../lib/useAppwrite";
import WorkoutCard from "../../components/WorkoutCard";
import { RefreshControl } from "react-native";
import { icons } from "../../constants";
import CustomButton from "../../components/CustomButton";
import { router } from "expo-router";

const Home = () => {
  const { isLoggedIn, user } = useGlobalContext();
  const [refreshing, setRefreshing] = useState(false);
  const { data: workouts, refetch } = useAppwrite(() =>
    getAllWorkouts(user.$id)
  );

  const onRefresh = async () => {
    console.log("refreshing!!!");
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };

  return (
    <SafeAreaView className="bg-primary h-full">
      <View className="w-full justify-center items-center min-h-[75vh] px-4 my-6">
        <Text className="font-psemibold text-purple-100 text-4xl">
          Welcome Back, {user?.username}!
        </Text>
        <FlatList
          data={workouts}
          keyExtractor={(item) => item.$id}
          renderItem={({ item, index }) => (
            <WorkoutCard
              index={index}
              title={item.title}
              date={item.date}
              exercises={item.exercises}
              workoutId={item.$id}
            />
          )}
          ListEmptyComponent={() => (
            <View className="mt-5 flex-1">
              <View className="items-center gap-6 mb-6">
                <Text className="text-2xl text-white font-psemibold">
                  No workouts found...
                </Text>
                <Image source={icons.confused} className="w-32 h-32 " />
              </View>
              <View className="flex-row items-center w-full bg-purple-100 justify-center rounded-xl">
                <CustomButton title="Lets Work" 
                handlePress={() => router.push('/workouts')}
                /> 
                <Image source={icons.rightArrow} className="w-6 h-6 ml-2"/>
              </View>
            </View>
          )}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        />
        <Text className="text-white text-lg font-pregular">
          Pull Down to Refresh...
        </Text>
        <Image source={icons.refresh} />
      </View>
    </SafeAreaView>
  );
};

export default Home;
