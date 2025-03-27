import { View, Text } from "react-native";
import React, { useState } from "react";
import { confirmAction } from "@/util/common";
import { useGlobalContext } from "@/context/GlobalProvider";
import { signOut } from "@/services/auth";
import { router } from "expo-router";
import Toast from "react-native-toast-message";
import Button from "@/components/Button";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import color from "@/constants/color";

const me = () => {
  const { userInfo, isInternetConnection, resetGlobalState } =
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
      <Text>Me</Text>
      <Button handlePress={signOutHandle} isLoading={!isInternetConnection}>
        <FontAwesome5 name="power-off" size={24} color={color.uBlack} />
      </Button>
    </View>
  );
};

export default me;
