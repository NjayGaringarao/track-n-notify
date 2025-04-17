import { View, Text, Image, TouchableOpacity, Pressable } from "react-native";
import React, { useEffect, useState } from "react";
import image from "@/constants/image";
import { useGlobalContext } from "@/context/GlobalProvider";
import { generateQR } from "@/services/appwrite";
import ProfilePicture from "@/components/ProfilePicture";
import { Foundation, MaterialCommunityIcons } from "@expo/vector-icons";
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
      <View className="flex-row py-2 w-full justify-between items-center border-b-2 border-white">
        <Text className="text-2xl text-white font-medium">
          STUDENT INFORMATION
        </Text>
        <Image
          source={image.prmsu}
          className="w-14 h-14"
          resizeMode="contain"
        />
      </View>

      <View className="flex-row w-full my-10 text-base justify-between items-center">
        <View className="">
          <Text className="text-base text-uBlack font-medium">
            {userInfo.id}
          </Text>
          <Text className="text-xl text-black font-semibold">
            {`${userInfo.name[0]} ${userInfo.name[2]}`}
          </Text>
          <Text>{`${userInfo.student_info.dep_prog} | ${userInfo.student_info.year_level} YEAR`}</Text>
        </View>
        <ProfilePicture userInfo={userInfo} />
      </View>

      <TouchableOpacity
        onPress={refreshHandle}
        disabled={!isInternetConnection}
        className="w-full rounded-md bg-primary shadow-md shadow-black overflow-hidden"
      >
        {!isLoading ? (
          <View className="flex-row justify-between items-center py-8 px-6">
            <View className="flex-row gap-2 items-center">
              <MaterialCommunityIcons
                name={
                  userInfo.student_info.isInside
                    ? "border-outside"
                    : "border-inside"
                }
                size={56}
                color={color.uBlack}
              />
              <View className="">
                <Text className="text-3xl font-black text-uBlack">
                  {userInfo.student_info.isInside ? "INSIDE" : "OUTSIDE"}
                </Text>
                <Text className="text-sm text-uGray -mt-1">
                  Student Campus Location
                </Text>
              </View>
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

      <View className="flex-1 flex-row items-center justify-between gap-2">
        <Text
          className="flex-1 text-uBlack font-medium text-lg"
          style={{ lineHeight: 20 }}
        >
          Allow the security personnel to scan the QR Code to update your campus
          location. Your guardian will be notified of any changes.
        </Text>
        <View className="bg-primary h-1/2 w-1/2 p-4 rounded-md shadow-md shadow-black overflow-hidden ">
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
