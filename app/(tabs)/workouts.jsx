import { View, Text, Modal, TouchableOpacity, Alert } from "react-native";
import React, { useEffect, useState } from "react";
import CustomButton from "../../components/CustomButton";
import { SafeAreaView } from "react-native-safe-area-context";
import { ScrollView } from "react-native";
import { Pressable } from "react-native";
import { icons } from "../../constants";
import { Image } from "react-native";
import FormField from "../../components/FormField";
import DateTimePicker from "react-native-ui-datepicker";
import dayjs from "dayjs";
import ExerciseModal from "../../components/ExerciseModal";
import { router } from "expo-router";
import { useGlobalContext } from "../../context/globalprovider";
import {
  createExercise,
  createWorkout,
  deleteExercise,
} from "../../lib/appwrite";
import ExercisesDisplay from "../../components/ExercisesDisplay";
import * as Animatable from "react-native-animatable";

const Workouts = () => {
  const { user } = useGlobalContext();
  const [showExerciseModal, setShowExerciseModal] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [date, setDate] = useState(dayjs());
  const [workout, setWorkout] = useState({
    title: "",
    date: "",
    exercises: [],
  });
  const [uploading, setUploading] = useState(false);
  const [exerciseList, setExerciseList] = useState([]);

  const clearWorkout = async () => {
    setWorkout({ title: "", date: "", exercises: [] });
    setExerciseList([]);
  };

  const submit = async () => {
    if(exerciseList.length == 0){
      Alert.alert('Error','bro, are you trying to upload a workout with no exercises')
      return;
    }
    if(!workout.title || !workout.date) Alert.alert('Error','please enter a caption and a date')
      
    setUploading(true);
    try {
      //upload exercises first
      for (var ex of exerciseList) {
        await createExercise(ex);
      }
      //upload workout
      await createWorkout({ ...workout, userId: user.$id });
      router.push("/home");
    } catch (err) {
      console.log(err);
    } finally {
      setWorkout({ title: "", date: "", exercises: [] });
      setExerciseList([]);
      setUploading(false);
      Alert.alert("Success", "Workout Submitted ;)");
    }
  };

  const handleDeleteExercise = (ex) => {
    //remove the id from workout list of id's
    const index = workout.exercises.indexOf(ex.exerciseId);
    const newArray = [
      ...workout.exercises.slice(0, index),
      ...workout.exercises.slice(index + 1),
    ];
    setWorkout({ ...workout, exercises: newArray });

    //remove from exerciseList used to display
    const idx = exerciseList.indexOf(ex);
    const newExList = [
      ...exerciseList.splice(0, idx),
      ...exerciseList.splice(idx + 1),
    ];
    setExerciseList(newExList);
    Alert.alert("Success", "exercise deleted");
  };

  const addExercise = (exercise) => {
    setWorkout((prevWorkout) => ({
      ...prevWorkout,
      exercises: [...prevWorkout.exercises, exercise.exerciseId],
    }));
    setExerciseList([...exerciseList, exercise]);
  };

  const closeExerciseModal = () => {
    setShowExerciseModal(false);
  };

  useEffect(() => {
    setWorkout({ ...workout, date: date.format("DD/MM/YYYY").toString() });
  }, [date]);

  return (
    <SafeAreaView className="bg-primary h-full">
      <ScrollView>
        <View className="w-full items-start justify-center min-h-[85vh] px-4">
          <View className="flex-row gap-10 mb-5">
            <Text className="text-4xl text-purple-100 font-psemibold">
              Log A Workout
            </Text>
            <TouchableOpacity
              onPress={clearWorkout}
              className="bg-purple-100 rounded-full"
            >
              <Image source={icons.refresh} className="w-10 h-10" />
            </TouchableOpacity>
          </View>
          <Animatable.View
            animation="fadeInUp"
            duration={1000}
            delay={200}
            className="w-full"
          >
            <View className="bg-purple-100 p-3 rounded-lg">
              <FormField
                title="Workout Title"
                placeholder="Enter Workout Title..."
                handleChangeText={(e) => setWorkout({ ...workout, title: e })}
                value={workout.title}
                textStyles="font-semibold text-2xl"
              />
            </View>
          </Animatable.View>
          <Animatable.View
            animation="fadeInUp"
            duration={1000}
            delay={400}
            className="w-full"
          >
            <View className="bg-purple-100  flex-col justify-start p-5 rounded-lg mt-3">
              <View className="border-b-4">
                <Text className="text-base text-gray-100 font-pmedium">
                  Date
                </Text>
              </View>
              <View className="flex-row gap-5 mt-1">
                <TouchableOpacity
                  className="bg-black-200 p-1 rounded-lg"
                  onPress={() => setModalVisible(true)}
                >
                  <Image
                    source={icons.calendar}
                    className="w-6 h-6 bg-gray-700"
                  />
                </TouchableOpacity>
                <Text className="text-base text-gray-100 font-pmedium">
                  {workout.date}
                </Text>
              </View>
            </View>
          </Animatable.View>
          <Animatable.View
            animation="fadeInUp"
            duration={1000}
            delay={800}
            className="w-full"
          >
            <View className="items center bg-purple-100 p-3 w-full rounded-lg mt-3 ">
              {exerciseList.map((exercise, key) => {
                return (
                  <ExercisesDisplay
                    key={key}
                    exercise={exercise}
                    deleteExercise={handleDeleteExercise}
                  />
                );
              })}
              <CustomButton
                title="Add Exercise"
                handlePress={() => setShowExerciseModal(true)}
                containerStyles="mt-5 bg-black-100"
                textStyles="text-white"
              />
            </View>
          </Animatable.View>
          <ExerciseModal
            visibility={showExerciseModal}
            onClose={closeExerciseModal}
            addExercise={addExercise}
          />
          <Animatable.View
            animation="fadeInUp"
            duration={1000}
            delay={1000}
            className="w-full"
          >
            <CustomButton
              title="Submit Workout"
              handlePress={submit}
              isLoading={uploading}
              containerStyles="w-full mt-5 bg-purple-200"
              textStyles="text-white"
            />
          </Animatable.View>
          <Modal
            animationType="slide"
            visible={modalVisible}
            transparent={true}
            onRequestClose={() => {
              setModalVisible(!modalVisible);
            }}
          >
            <View className="flex justify-center items-center h-full">
              <View className="bg-white h-auto w-72 rounded-lg p-4 ">
                <View className="flex flex-col items-center justify-center">
                  <DateTimePicker
                    mode="single"
                    date={date}
                    onChange={(params) => setDate(params.date)}
                  />
                  <CustomButton
                    handlePress={() => setModalVisible(false)}
                    title="Save"
                    containerStyles="p-1 w-full"
                  />
                </View>
              </View>
            </View>
          </Modal>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Workouts;
