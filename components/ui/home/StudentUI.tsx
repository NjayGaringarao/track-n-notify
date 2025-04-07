import { View, Text, Image, TouchableOpacity, Pressable } from "react-native";
import React, { useEffect, useState } from "react";
import image from "@/constants/image";
import { useGlobalContext } from "@/context/GlobalProvider";
import { generateQR } from "@/services/appwrite";
import ProfilePicture from "@/components/ProfilePicture";
import { Foundation } from "@expo/vector-icons";
import color from "@/constants/color";
import Loading from "@/components/Loading";
import Toast from "react-native-toast-message";

const StudentUI = () => {
  const { user, userInfo, isInternetConnection, refreshUserRecord } =
    useGlobalContext();
  const [isLoading, setIsLoading] = useState(true);

  const refreshHandle = async () => {
    try {
      setIsLoading(true);
      await refreshUserRecord({ info: true });
    } catch (error) {
      Toast.show({
        type: "error",
        text1: "Fetch Failed",
        text2: "There was a problem fetching student status.",
      });
    }
  };

  useEffect(() => {
    setIsLoading(false);
  }, [userInfo]);

  return user && userInfo.student_info ? (
    <View className="flex-1 mx-6">
      {/** Header */}
      <View className="flex-row py-4 w-full justify-between items-center border-b-2 border-white">
        <Text className="text-2xl text-white">STUDENT INFORMATION</Text>
        <Image
          source={image.prmsu}
          className="w-14 h-14"
          resizeMode="contain"
        />
      </View>

      <View className="flex-row w-full my-10 text-base justify-between items-center">
        <View className="gap-2">
          <Text>Student Number: {userInfo.id}</Text>
          <Text>
            Name:{" "}
            {userInfo.name[1]
              ? `${userInfo.name[0]} ${userInfo.name[1]} ${userInfo.name[2]}`
              : `${userInfo.name[0]} ${userInfo.name[2]}`}
          </Text>
          <Text>
            Department: {userInfo.student_info.dep_prog.split(" - ")[0]}
          </Text>
          <Text>
            Program: {userInfo.student_info.dep_prog.split(" - ")[1]} -{" "}
            {userInfo.student_info.year_level} YEAR
          </Text>
        </View>
        <ProfilePicture userInfo={userInfo} />
      </View>
      <TouchableOpacity
        onPress={refreshHandle}
        disabled={!isInternetConnection}
        className="w-full border rounded-md bg-primary shadow-md shadow-black overflow-hidden"
      >
        {!isLoading ? (
          <View className="flex-row justify-between items-center py-4 px-6">
            <View className="-gap-2">
              <Text className="text-2xl font-semibold text-uBlack ">
                {userInfo.student_info.isLoggedIn
                  ? "INSIDE THE CAMPUS"
                  : "OUTSIDE THE CAMPUS"}
              </Text>
              <Text className="text-base text-uGray">Current Status</Text>
            </View>

            <Foundation name="refresh" size={44} color={color.uBlack} />
          </View>
        ) : (
          <View className="w-full h-24 items-center justify-center">
            <View className="absolute h-full w-full bg-black opacity-80 " />
            <View>
              <Loading
                loadingPrompt="Loading Student Status"
                loadingColor={color.primary}
              />
            </View>
          </View>
        )}
      </TouchableOpacity>
      <View className="flex-1 items-center justify-center">
        <View className="bg-primary h-72 w-72 p-4 rounded-2xl shadow-md shadow-black overflow-hidden ">
          <Image
            source={{ uri: generateQR(user.$id) }}
            resizeMode="contain"
            className="bg-primary h-full w-full"
          />
        </View>
      </View>
    </View>
  ) : null;
};

export default StudentUI;
