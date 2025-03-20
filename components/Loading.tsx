import { View, Text, ActivityIndicator } from "react-native";
import React from "react";
import color from "@/constants/color";

type LoadingType = {
  containerStyles?: string;
  loadingPrompt: string;
  loadingColor?: string;
};

const Loading = ({
  containerStyles,
  loadingPrompt,
  loadingColor,
}: LoadingType) => {
  return (
    <View
      className={`flex-1 items-center justify-center bg-transparent flex-row space-x-2 gap-2 ${containerStyles}`}
    >
      <Text
        className=" text-2xl font-semibold"
        style={{ color: loadingColor ? loadingColor : color.primary }}
      >
        {loadingPrompt}
      </Text>
      <ActivityIndicator
        color={loadingColor ? loadingColor : color.primary}
        size="large"
      />
    </View>
  );
};

export default Loading;
