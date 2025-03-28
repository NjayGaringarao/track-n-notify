import { View, Text, Image } from "react-native";
import React, { useState } from "react";
import { confirmAction } from "@/util/common";
import { useGlobalContext } from "@/context/GlobalProvider";
import { signOut } from "@/services/auth";
import { router } from "expo-router";
import Toast from "react-native-toast-message";
import Button from "@/components/Button";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import color from "@/constants/color";
import StudentUI from "@/components/ui/me/StudentUI";
import AdminUI from "@/components/ui/me/AdminUI";
import SecurityUI from "@/components/ui/me/SecurityUI";
import image from "@/constants/image";

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
          {user.labels[0] === "STUDENT" ? (
            <StudentUI />
          ) : user.labels[0] === "ADMINISTRATOR" ? (
            <AdminUI />
          ) : (
            <SecurityUI />
          )}
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
