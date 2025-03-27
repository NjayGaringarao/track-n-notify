import { View, Text, Image } from "react-native";
import React from "react";
import image from "@/constants/image";
import { useGlobalContext } from "@/context/GlobalProvider";
import StudentUI from "@/components/ui/home/StudentUI";
import AdminUI from "@/components/ui/home/AdminUI";
import SecurityUI from "@/components/ui/home/SecurityUI";

const home = () => {
  const { user } = useGlobalContext();
  return (
    <View className="h-full w-full">
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
        </View>
      )}
    </View>
  );
};

export default home;
