import React from "react";
import { Stack } from "expo-router";

const layout = () => {
  return (
    <Stack>
      <Stack.Screen
        name="sign_in/[account_type]"
        options={{ headerShown: false }}
      />
      <Stack.Screen name="sign_up" options={{ headerShown: false }} />
    </Stack>
  );
};

export default layout;
