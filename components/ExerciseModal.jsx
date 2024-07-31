import { View, Text, Alert } from "react-native";
import React, { useState } from "react";
import FormField from "./FormField";
import { Modal } from "react-native";
import CustomButton from "./CustomButton";
import { ID } from "react-native-appwrite";
import { createExercise } from "../lib/appwrite";
import { KeyboardAvoidingView, Platform } from "react-native";

const ExerciseModal = ({ visibility, onClose, addExercise }) => {
  const [exercise, setExercise] = useState({
    name: "",
    sets: null,
    reps: null,
    weight: null,
    exerciseId: "",
  });
  const submit = async () => {
    if (
      exercise.name == "" ||
      exercise.sets == null ||
      exercise.reps == null ||
      exercise.weight == null
    ) {
      Alert.alert("Error", "Please fill in all fields");
    }
    addExercise(exercise);
    setExercise({
      name: "",
      sets: null,
      reps: null,
      weight: null,
      exerciseId: "",
    });
    onClose();
  };
  return (
    <View>
      <Modal visible={visibility} animationType="slide">
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
          <View className=" justify-center p-3 bg-primary h-full">
            <View>
              <FormField
                title="Exercise Name"
                handleChangeText={(e) =>
                  setExercise({ ...exercise, name: e, exerciseId: ID.unique() })
                }
              />
              <FormField
                title="Sets"
                handleChangeText={(e) => setExercise({ ...exercise, sets: e })}
              />
              <FormField
                title="Reps"
                handleChangeText={(e) => setExercise({ ...exercise, reps: e })}
              />
              <FormField
                title="Weight"
                handleChangeText={(e) =>
                  setExercise({ ...exercise, weight: e })
                }
              />
            </View>

            <View className="flex-row justify-between">
              <CustomButton
                title="Close"
                handlePress={onClose}
                containerStyles="p-1 mt-3 bg-gray-400 p-5"
              />
              <CustomButton
                title="Add"
                handlePress={submit}
                containerStyles="mt-3 bg-purple-200 p-5"
                textStyles="text-white"
              />
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </View>
  );
};

export default ExerciseModal;
