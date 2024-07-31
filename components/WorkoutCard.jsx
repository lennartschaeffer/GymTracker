import { View, Text } from "react-native";
import React, { useState } from "react";
import CustomButton from "./CustomButton";
import WorkoutModal from "./WorkoutModal";
import { Image } from "react-native";
import { icons } from "../constants";
import * as Animatable from 'react-native-animatable';
const WorkoutCard = ({ index, title, date, exercises, workoutId }) => {

  
  const [showModal, setShowModal] = useState(false);
  
  const closeModal = () => {
    setShowModal(false);
  };

  return (
    <Animatable.View 
    animation="fadeInUp"
    duration={1000}
    delay={index * 200}
    >
    <View className="bg-purple-100 w-80 p-2 rounded-lg mt-4">
      <View className="flex-col justify-between items-start mb-3 gap-2">
        <Text className="text-2xl text-white font-psemibold">{title}</Text>
        <View className="flex-row items-center ">
        <Image source={icons.calendar} className="w-6 h-6"/>
        <Text className="text-lg text-white">&nbsp;{date}</Text>
        </View>
        
      </View>
      <CustomButton
        title="View Workout"
        handlePress={() => setShowModal(true)}
        containerStyles="bg-black-100"
        textStyles="text-gray-100"
      />
      <WorkoutModal visibility={showModal} onClose={closeModal} exerciseList={exercises} title={title} workoutId={workoutId}/>
    </View>
    </Animatable.View>
  );
};

export default WorkoutCard;
