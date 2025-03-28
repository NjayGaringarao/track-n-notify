import { View, Text, Image, TouchableOpacity } from "react-native";
import React from "react";
import image from "@/constants/image";
import { useGlobalContext } from "@/context/GlobalProvider";
import { router } from "expo-router";
import { generateQR } from "@/services/appwrite";
import ProfilePicture from "@/components/ProfilePicture";

const StudentUI = () => {
  const { user, userInfo } = useGlobalContext();
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
          <Text>
            Status:{" "}
            {userInfo.student_info.isLoggedIn
              ? "INSIDE THE CAMPUS"
              : "OUTSIDE THE CAMPUS"}
          </Text>
        </View>
        <ProfilePicture userInfo={userInfo} />
      </View>
      <View className="w-full border rounded-md py-2 bg-primary shadow-md shadow-black justify-center items-center">
        <Text className="text-2xl font-semibold text-uBlack">
          {userInfo.id}
        </Text>
        <Text className="text-base text-uGray">Student Number</Text>
      </View>
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
