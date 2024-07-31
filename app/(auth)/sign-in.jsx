import { View, Text, ScrollView, Image } from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { images } from "../../constants";
import FormField from "../../components/FormField";
import { useState } from "react";
import CustomButton from "../../components/CustomButton";
import { Link, router } from "expo-router";
import { getCurrentUser, signIn } from "../../lib/appwrite";
import { Alert } from "react-native";
import { useGlobalContext } from "../../context/globalprovider";
const SignIn = () => {

  const [form, setForm] = useState({ email: "", password: "" });

  const [isSubmitting, setSubmitting] = useState(false);
  const {setUser, setIsLoggedIn} = useGlobalContext();

  const submit = async () => {
    if (form.email === "" || form.password === "") {
      Alert.alert("Error", "Please fill in all fields");
    }

    setSubmitting(true);

    try {
      await signIn(form.email, form.password);
      const result = await getCurrentUser();
      setUser(result);
      setIsLoggedIn(true);
      
      router.replace("/home");
    } catch (error) {
      Alert.alert("Error", error.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <View>
      <SafeAreaView className="bg-primary h-full">
        <ScrollView>
          <View className="w-full justify-center min-h-[85vh] px-4 my-6">
            <Image source={images.workout} className="w-32 h-32" />
            <Text className="font-bold text-white text-2xl mt-2 mb-4">
              Log In to GymNetwork
            </Text>
            <FormField
              title="Email"
              value={form.email}
              handleChangeText={(e) => setForm({ ...form, email: e })}
              otherStyles="mt-7"
              keyboardType="email-address"
            />
            <FormField
              title="Password"
              value={form.password}
              handleChangeText={(e) => setForm({ ...form, password: e })}
              otherStyles="mt-7"
            />

            <CustomButton
              title="Sign In"
              handlePress={submit}
              containerStyles="mt-7"
              isLoading={isSubmitting}
            />

            <View className="flex-row justify-center gap-2 mt-5">
              <Text className="text-white font-pregular ">Dont have an account?</Text>
              <Link href="/sign-up" className="font-psemibold text-secondary-100">Sign Up</Link>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
};

export default SignIn;
