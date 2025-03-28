import { View, Text, ScrollView, Image } from "react-native";
import React, { useState } from "react";
import { StudentInfo } from "@/services/types/model";
import { useGlobalContext } from "@/context/GlobalProvider";
import ProfileSection from "./ProfileSection";
import Ionicons from "@expo/vector-icons/Ionicons";
import color from "@/constants/color";

const StudentUI = () => {
  const { userInfo } = useGlobalContext();
  const [accountType, setAccountType] = useState("STUDENT");
  const [isLoading, setIsLoading] = useState(false);
  const [nameForm, setNameForm] = useState({
    first: "",
    middle: "",
    last: "",
  });
  const [credentialForm, setCredentialForm] = useState({
    identifier: "",
    email: "",
    password: "",
    confPassword: "",
  });

  const [studentForm, setStudentForm] = useState<StudentInfo>({
    id: "",
    dep_prog: "CCIT-BSCS",
    guardian_info: [],
    year_level: "FIRST",
    isLoggedIn: true,
  });
  return (
    <View className="flex-1 mx-6">
      {/** Header */}
      <View className="flex-row py-4 w-full justify-between items-center border-b-2 border-white">
        <Text className="text-2xl text-white">USER SETTINGS</Text>
        <Ionicons name="settings-sharp" size={48} color={color.uBlack} />
      </View>
      <ScrollView
        className="w-full"
        contentContainerStyle={{
          alignItems: "stretch",
          justifyContent: "center",
          gap: 24,
        }}
      >
        <ProfileSection />
      </ScrollView>
    </View>
  );
};

export default StudentUI;
