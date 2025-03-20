import { View, Text } from "react-native";
import React, { useEffect, useState } from "react";
import { useGlobalSearchParams } from "expo-router";

const sign_in = () => {
  const [accountType, setAccountType] = useState("");
  const searchParams = useGlobalSearchParams();

  useEffect(() => {
    if (searchParams) {
      setAccountType(searchParams.account_type.toString());
    }
  }, [searchParams]);

  return (
    <View className="flex-1 justify-center items-center">
      <Text className="text-2xl">{accountType}</Text>
    </View>
  );
};

export default sign_in;
