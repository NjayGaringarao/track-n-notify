import { Stack } from "expo-router";
import React from "react";
import "../global.css";
import Toast from "react-native-toast-message";
import customToastConfig from "@/lib/toastConfig";

export default function RootLayout() {
  return (
    <>
      <Stack>
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="(auth)" options={{ headerShown: false }} />
      </Stack>
      <Toast config={customToastConfig} />
    </>
  );
}
