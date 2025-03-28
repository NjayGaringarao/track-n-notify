import { View, Text, Image, ScrollView } from "react-native";
import React, { useState } from "react";
import { confirmAction } from "@/util/common";
import { useGlobalContext } from "@/context/GlobalProvider";
import { signOut } from "@/services/auth";
import { router } from "expo-router";
import Toast from "react-native-toast-message";
import Button from "@/components/Button";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import color from "@/constants/color";
import StudentData from "@/components/ui/me/StudentData";
import AdminData from "@/components/ui/me/AdminData";
import SecurityData from "@/components/ui/me/SecurityData";
import image from "@/constants/image";
import Ionicons from "@expo/vector-icons/Ionicons";
import ProfileSection from "@/components/ui/me/ProfileSection";
import LoginCredentials from "@/components/ui/me/LoginCredentials";
import GuardianData from "@/components/ui/me/GuardianData";

const me = () => {
  const { user, userInfo, isInternetConnection, resetGlobalState } =
    useGlobalContext();
  const [isLoading, setIsLoading] = useState(false);

  const signOutHandle = async () => {
    try {
      if (
        !(await confirmAction(
          "Confirm Logout",
          "You won't recieve a notification while being logged out."
        ))
      ) {
        return;
      }
      setIsLoading(true);
      await signOut(resetGlobalState);
      router.navigate("/");
    } catch (error) {
      Toast.show({
        type: "error",
        text1: "Signout Failed",
        text2: `There was an error signing out your account.`,
      });
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <View>
      <Image
        source={image.radiant_bg}
        className="h-full w-full"
        resizeMode="cover"
      />
      {user && (
        <View className="absolute w-full h-full">
          <View className="flex-1 mx-6">
            {/** Header */}
            <View className="flex-row py-4 w-full justify-between items-center border-b-2 border-white">
              <Text className="text-2xl text-white">USER SETTINGS</Text>
              <Ionicons name="settings-sharp" size={48} color={color.uBlack} />
            </View>
            <ScrollView
              className="w-full"
              contentContainerStyle={{
                alignItems: "stretch",
                justifyContent: "center",
                gap: 24,
              }}
            >
              <ProfileSection />
              {user.labels[0] === "STUDENT" ? (
                <View className="gap-6">
                  <StudentData />
                  <GuardianData />
                </View>
              ) : user.labels[0] === "ADMINISTRATOR" ? (
                <AdminData />
              ) : (
                <SecurityData />
              )}
              <LoginCredentials />
            </ScrollView>
          </View>

          <View className="w-full items-end px-4 py-1 border border-t border-primary">
            <Button
              handlePress={signOutHandle}
              isLoading={!isInternetConnection}
            >
              <View className="flex-row justify-center items-center gap-2">
                <FontAwesome5 name="power-off" size={24} color={color.uBlack} />
                <Text className="text-lg font-semibold text-uBlack">
                  Sign Out
                </Text>
              </View>
            </Button>
          </View>
        </View>
      )}
    </View>
  );
};

export default me;
