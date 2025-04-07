import { SplashScreen, Stack } from "expo-router";
import React, { useEffect } from "react";
import "../global.css";
import Toast from "react-native-toast-message";
import customToastConfig from "@/lib/toastConfig";
import GlobalProvider from "@/context/GlobalProvider";
import { SafeAreaView } from "react-native-safe-area-context";
import { useFonts } from "expo-font";

export default function RootLayout() {
  const [loaded] = useFonts({
    Digital: require("@/assets/fonts/digital-7/digital-7(mono).ttf"),
    Mono: require("@/assets/fonts/SpaceMono-Regular.ttf"),
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

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
