import { StatusBar } from 'expo-status-bar';
import {Image, Text, View } from 'react-native';
import { Link } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ScrollView } from 'react-native';
import { images } from '../constants';
import CustomButton from '../components/CustomButton';
import { Redirect, router } from 'expo-router';
import { useGlobalContext } from '../context/globalprovider';
export default function App() {

  const {isLoading, isLoggedIn} = useGlobalContext();
  console.log("logged in from INDEX"+isLoggedIn);

  if(!isLoading && isLoggedIn){
    return <Redirect href='/home'/>
  }

  return (
    <SafeAreaView className="bg-primary h-full">
      <ScrollView contentContainerStyle={{height:'100%'}}>
        <View className="w-full justify-center items-center min-h-[85vh] p-4">
            <Image source={images.workout}
            className="w-32 h-32"
            />
            <Text className="font-psemibold text-white text-4xl"> Gym Tracker</Text>
            <Text className="font-pregular text-red-400 mt-2">Riverview's #1 Workout Tracker</Text>
            <CustomButton
            title="Continue With Email"
            handlePress={() => router.push('/sign-in')}
            containerStyles="w-full mt-7"
            />
        </View>
      </ScrollView>
      <StatusBar backgroundColor='#161622' style='light'/>
    </SafeAreaView> 
  );
}


