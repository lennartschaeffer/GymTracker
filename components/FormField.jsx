import { View, Text, TextInput, TouchableOpacity } from "react-native";
import { Image } from "react-native";
import { useState } from "react";
import React from "react";
import icons from "../constants/icons";

const FormField = ({
  title,
  value,
  placeholder,
  handleChangeText,
  textStyles,
}) => {
  const [showPass, setShowPass] = useState(false);
  return (
    <View className="space-y-2">
      <Text className="text-base text-gray-100 font-pmedium">{title}</Text>
      <View className="border-2 border-black-500 rounded-2xl focus:border-secondary-100 items-center w-full h-16 px-4 bg-black-100 
      flex-row
      ">
        <TextInput
          className="flex-1 text-white font-psemibold text-base"
          value={value}
          placeholder={placeholder}
          placeholderTextColor="#FFF"
          onChangeText={handleChangeText}
          secureTextEntry={title === "Password" && !showPass}
        />
        {title === "Password" && (
          <TouchableOpacity onPress={() => setShowPass(!showPass)}>
            <Image source={!showPass ? icons.eye : icons.eyeHide} className="w-6 h-6" resizeMode="contain" />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

export default FormField;
