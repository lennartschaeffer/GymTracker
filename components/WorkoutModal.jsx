import { View, Text, Alert } from "react-native";
import React, { useEffect, useState } from "react";
import Modal from "react-native-modal";
import CustomButton from "./CustomButton";
import { deleteWorkout } from "../lib/appwrite";
import ExercisesDisplay from "./ExercisesDisplay";

const WorkoutModal = ({ visibility, onClose, exerciseList, title, workoutId }) => {

  console.log(exerciseList);

  const handleDeleteWorkout = async () => {
    try{
      await deleteWorkout(workoutId);
    }catch(err){
      Alert.alert('There was an error deleting your workout')
      console.log(err)
    }
    finally{
      Alert.alert("Success", "Workout Deleted ;)");
      onClose();
    }
  }
 
  return (
    <View>
      <Modal isVisible={visibility} animationType="slide">
        <View className="items center bg-primary p-5 rounded-lg">
          <Text className="font-psemibold text-2xl mb-3 text-white">{title}</Text>
          {exerciseList.map((exercise, key) => {
            return (
              <ExercisesDisplay key={key} exercise={exercise}/>
            );
          })}
          <CustomButton
          title="Delete Workout"
          containerStyles="mb-4 mt-4 bg-red-600"
          handlePress={handleDeleteWorkout}
          />
          <CustomButton title="Close" handlePress={onClose} containerStyles="bg-gray-400"/>
        </View>
      </Modal>
    </View>
  );
};

export default WorkoutModal;
