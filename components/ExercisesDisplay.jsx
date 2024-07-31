import { View, Text } from "react-native";
import React from "react";
import { TouchableOpacity, Image } from "react-native";
import { icons } from "../constants";

const ExercisesDisplay = ({ exercise, deleteExercise }) => {
  console.log(exercise.exerciseId);
  return (
    <View>
      <View className="border-b-2 mb-2">
        <Text className="text-base text-gray-100 font-pmedium">
          {exercise.name}
        </Text>
      </View>
      <View className="flex-row justify-between">
        <View className="flex-row justify-start overflow-auto gap-5 items-center mb-3">
          <View>
            <Text className="text-base text-gray-100 font-pmedium">Sets</Text>
            <Text className="text-md text-gray-200">{exercise.sets}</Text>
          </View>
          <View>
            <Text className="text-base text-gray-100 font-pmedium">Reps</Text>
            <Text className="text-md text-gray-200">{exercise.reps}</Text>
          </View>
          <View>
            <Text className="text-base text-gray-100 font-pmedium">Weight</Text>
            <Text className="text-md text-gray-200">{exercise.weight}</Text>
          </View>
        </View>
        <TouchableOpacity className="p-1 rounded-full mt-1" onPress={() => deleteExercise(exercise)}>
          <Image source={icons.trash} className="w-6 h-6" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default ExercisesDisplay;
