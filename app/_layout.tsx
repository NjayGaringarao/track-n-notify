import { Stack } from "expo-router";
import React from "react";
import "../global.css";
import Toast from "react-native-toast-message";
import customToastConfig from "@/lib/toastConfig";
import GlobalProvider from "@/context/GlobalProvider";
import { SafeAreaView } from "react-native-safe-area-context";

export default function RootLayout() {
  return (
    <SafeAreaView className="flex flex-1">
      <GlobalProvider>
        <Stack>
          <Stack.Screen name="index" options={{ headerShown: false }} />
          <Stack.Screen name="(auth)" options={{ headerShown: false }} />
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        </Stack>
      </GlobalProvider>
      <Toast config={customToastConfig} />
    </SafeAreaView>
  );
}
