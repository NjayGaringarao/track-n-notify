import { View, Text, Image, ScrollView } from "react-native";
import React, { useState } from "react";
import { confirmAction } from "@/util/common";
import { useGlobalContext } from "@/context/GlobalProvider";
import { signOut } from "@/services/auth";
import Toast from "react-native-toast-message";
import Button from "@/components/Button";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import color from "@/constants/color";
import StudentData from "@/components/ui/me/StudentData";
import AdminData from "@/components/ui/me/AdminData";
import image from "@/constants/image";
import Ionicons from "@expo/vector-icons/Ionicons";
import ProfileSection from "@/components/ui/me/ProfileSection";
import LoginCredentials from "@/components/ui/me/LoginCredentials";
import GuardianData from "@/components/ui/me/GuardianData";

const me = () => {
  const { user, isInternetConnection, resetGlobalState } = useGlobalContext();
  const [isLoading, setIsLoading] = useState(false);

  const signOutHandle = async () => {
    try {
      if (
        !(await confirmAction(
          "Confirm Logout",
          "Are you sure you want to log out? You can log back in anytime."
        ))
      ) {
        return;
      }
      setIsLoading(true);
      await signOut(resetGlobalState);
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
            <View className="flex-row py-2 w-full justify-between items-center border-b-2 border-white">
              <Text className="text-2xl text-white font-medium">
                USER SETTINGS
              </Text>
              <Ionicons name="settings-sharp" size={48} color={color.white} />
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
              ) : null}
              <LoginCredentials />
            </ScrollView>
          </View>

          <View className="absolute bottom-0 w-full">
            <View className="absolute w-full h-full bg-white opacity-80"></View>
            <View className="w-full items-end px-4 py-4">
              <Button
                handlePress={signOutHandle}
                isLoading={!isInternetConnection}
              >
                <View className="flex-row justify-center items-center gap-2">
                  <FontAwesome5
                    name="power-off"
                    size={24}
                    color={color.uBlack}
                  />
                  <Text className="text-lg font-semibold text-uBlack">
                    Sign Out
                  </Text>
                </View>
              </Button>
            </View>
          </View>
        </View>
      )}
    </View>
  );
};

export default me;
