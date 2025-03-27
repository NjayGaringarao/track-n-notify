import { View, Text, Image } from "react-native";
import React, { useEffect, useState } from "react";
import { useGlobalSearchParams } from "expo-router";
import TextBox from "@/components/TextBox";
import image from "@/constants/image";
import color from "@/constants/color";
import Button from "@/components/Button";
import Loading from "@/components/Loading";
import Toast from "react-native-toast-message";
import { signIn } from "@/services/auth";
import { useGlobalContext } from "@/context/GlobalProvider";

const sign_in = () => {
  const { initializeGlobalState } = useGlobalContext();
  const [accountType, setAccountType] = useState("");
  const [identifierPrompt, setIdentifierPrompt] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [form, setForm] = useState({
    user_id: "",
    password: "",
  });
  const searchParams = useGlobalSearchParams();

  const signInHandle = async () => {
    try {
      setIsLoading(true);

      await signIn(
        accountType,
        form.user_id,
        form.password,
        initializeGlobalState
      );
    } catch (error) {
      Toast.show({
        type: "error",
        text1: "Login Failed",
        text2: `${error}`,
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (searchParams.account_type) {
      const _accountType = searchParams.account_type.toString();
      setAccountType(_accountType);
      if (_accountType === "STUDENT") {
        setIdentifierPrompt("Student Number");
      } else {
        setIdentifierPrompt("Employee Number");
      }
    }
  }, [searchParams]);

  return (
    <View className="flex-1 justify-center items-center">
      <Image
        className="h-full w-full"
        source={image.school_bg}
        resizeMode="cover"
      />
      <View className="absolute h-full w-full bg-primary opacity-50" />
      <View className="absolute h-full w-full justify-between items-center">
        {/** Branding */}
        <View className="flex-1 items-center justify-center">
          <View className="p-6 bg-white rounded-xl items-center justify-center gap-4">
            <Image
              className="w-40 h-40"
              source={image.qr_sample}
              resizeMode="contain"
            />
            <Text className="text-3xl text-primary font-black">
              Track N' Notify
            </Text>
          </View>
        </View>

        {/** Form */}
        <View className="w-11/12 mb-12">
          <View className="absolute h-full w-full bg-black opacity-60 rounded-xl" />
          <View className="w-full p-4 gap-4">
            <Text className="text-primary text-2xl font-semibold">{`Sign in as ${
              accountType.charAt(0).toUpperCase() +
              accountType.toLowerCase().slice(1)
            }`}</Text>
            <View className="w-full gap-6">
              <TextBox
                title={identifierPrompt}
                textValue={form.user_id}
                handleChangeText={(e) => setForm({ ...form, user_id: e })}
                titleTextStyles="text-white"
              />
              <TextBox
                title="Password"
                textValue={form.password}
                handleChangeText={(e) => setForm({ ...form, password: e })}
                titleTextStyles="text-white"
                isPassword
              />
              <Button
                title="Sign In"
                handlePress={signInHandle}
                containerStyles="mt-4"
                isLoading={!form.password.length || !form.user_id.length}
              />
            </View>
          </View>
          {isLoading && (
            <View className="absolute h-full w-full items-center justify-center">
              <View className="absolute h-full w-full bg-black opacity-70 rounded-xl" />
              <View>
                <Loading
                  loadingPrompt="Signing in"
                  loadingColor={color.primary}
                />
              </View>
            </View>
          )}
        </View>
      </View>
    </View>
  );
};

export default sign_in;
