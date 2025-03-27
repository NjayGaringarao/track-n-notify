import { Text, View, Image, TouchableOpacity } from "react-native";
import image from "@/constants/image";
import icon from "@/constants/icon";
import "@/constants/color";
import color from "@/constants/color";
import { router } from "expo-router";
import { useGlobalContext } from "@/context/GlobalProvider";
import Loading from "@/components/Loading";
export default function Index() {
  const { isLoading } = useGlobalContext();
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

        {/** Options */}
        <View className="w-11/12 mb-12">
          <View className="absolute h-full w-full bg-black opacity-60 rounded-xl" />
          <View className="w-full p-4 gap-4">
            <Text className="text-primary text-2xl font-semibold">Sign In</Text>
            <View className="w-full flex-row justify-between">
              <TouchableOpacity
                className="w-[48%] h-28 bg-primary rounded-lg justify-center items-center"
                onPress={() => router.push("/(auth)/sign_in/STUDENT")}
              >
                <Image
                  className="h-14 w-14"
                  source={icon.student}
                  tintColor={color.uBlack}
                />
                <Text className="text-lg text-uBlack font-semibold">
                  Student
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                className="w-[48%] h-28 bg-primary rounded-lg justify-center items-center"
                onPress={() => router.push("/(auth)/sign_in/SECURITY")}
              >
                <Image
                  className="h-14 w-14"
                  source={icon.security_post}
                  tintColor={color.uBlack}
                />
                <Text className="text-lg text-uBlack font-semibold">
                  Security
                </Text>
              </TouchableOpacity>
            </View>
            <View className="w-full flex-row justify-between">
              <TouchableOpacity
                className="w-[48%] h-28 bg-primary rounded-lg justify-center items-center"
                onPress={() => router.push("/(auth)/sign_in/ADMINISTRATOR")}
              >
                <Image
                  className="h-14 w-14"
                  source={icon.admin}
                  tintColor={color.uBlack}
                />
                <Text className="text-lg text-uBlack font-semibold">
                  Administrator
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                className="w-[48%] h-28 bg-primary rounded-lg justify-center items-center"
                onPress={() => router.push("/(auth)/sign_up")}
              >
                <Image
                  className="h-14 w-14"
                  source={icon.no_account}
                  tintColor={color.uBlack}
                />
                <Text className="text-lg text-uBlack font-semibold">
                  No Account?
                </Text>
              </TouchableOpacity>
            </View>
          </View>
          {isLoading && (
            <View className="absolute h-full w-full items-center justify-center">
              <View className="absolute h-full w-full bg-black opacity-70 rounded-xl" />
              <View>
                <Loading loadingPrompt="Loading" loadingColor={color.primary} />
              </View>
            </View>
          )}
        </View>
      </View>
    </View>
  );
}
