import { View, Text } from "react-native";
import React, { useEffect, useState } from "react";
import ItemPicker from "@/components/ItemPicker";
import { useGlobalContext } from "@/context/GlobalProvider";
import { Picker } from "@react-native-picker/picker";
import Button from "@/components/Button";
import Toast from "react-native-toast-message";
import { confirmAction } from "@/util/common";
import { updateStudentData } from "@/services/user";
import Loading from "@/components/Loading";
import color from "@/constants/color";

const StudentData = () => {
  const { userInfo, isInternetConnection, refreshUserRecord } =
    useGlobalContext();
  const [isModified, setIsModified] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [studentForm, setStudentForm] = useState({
    dep_prog: userInfo.student_info?.dep_prog!,
    year_level: userInfo.student_info?.year_level!,
  });

  const clearHandle = () => {
    setStudentForm({
      dep_prog: userInfo.student_info?.dep_prog!,
      year_level: userInfo.student_info?.year_level!,
    });
  };

  const updateHandle = async () => {
    if (
      !(await confirmAction(
        "Confirm Changes",
        "Save changes that you've made?"
      ))
    )
      return;
    try {
      setIsLoading(true);
      if (
        !(await updateStudentData(
          userInfo.id,
          studentForm.dep_prog,
          studentForm.year_level
        ))
      ) {
        throw Error;
      }
      Toast.show({
        type: "success",
        text1: "Update Success",
        text2: "Changes successfully applied.",
      });

      await refreshUserRecord({
        info: true,
      });
    } catch (error) {
      Toast.show({
        type: "failed",
        text1: "Update Failed",
        text2: "There was an error updating your profile",
      });
      clearHandle();
    }
  };

  useEffect(() => {
    clearHandle();
    setIsLoading(false);
  }, [userInfo]);

  useEffect(() => {
    if (userInfo.student_info) {
      if (
        studentForm.dep_prog !== userInfo.student_info.dep_prog ||
        studentForm.year_level !== userInfo.student_info.year_level
      ) {
        setIsModified(true);
      } else {
        setIsModified(false);
      }
    }
  }, [studentForm]);

  useEffect(() => {
    setStudentForm({
      dep_prog: userInfo.student_info?.dep_prog!,
      year_level: userInfo.student_info?.year_level!,
    });
  }, [userInfo]);
  return (
    <View className="w-full mb-6">
      <Text className="text-xl text-uBlack font-black my-2">
        STUDENT INFORMATION
      </Text>
      <View className="gap-2">
        <View className="w-full">
          <Text className="text-uBlack">Set Department - Program</Text>
          <ItemPicker
            value={studentForm.dep_prog}
            onChange={(value) =>
              setStudentForm({ ...studentForm, dep_prog: value })
            }
            containerStyle="flex-1 border-2 border-primary rounded-xl bg-white"
          >
            <Picker.Item label="CCIT - BSCS" value="CCIT-BSCS" />
            <Picker.Item label="CTE - BSED" value="CTE-BSED" />
            <Picker.Item label="CTE - BEED" value="CTE-BEED" />
            <Picker.Item label="CBAPA - BSBA" value="CBAPA-BSBA" />
          </ItemPicker>
        </View>

        <View className="w-full">
          <Text className="text-uBlack">Set Year Level</Text>
          <ItemPicker
            value={studentForm.year_level}
            onChange={(value) =>
              setStudentForm({ ...studentForm, year_level: value })
            }
            containerStyle="flex-1 border-2 border-primary rounded-xl bg-white"
          >
            <Picker.Item label="First Year" value="FIRST" />
            <Picker.Item label="Second Year" value="SECOND" />
            <Picker.Item label="Third Year" value="THIRD" />
            <Picker.Item label="Fourth Year" value="FOURTH" />
            <Picker.Item label="Fifth Year" value="FIFTH" />
          </ItemPicker>
        </View>
      </View>
      {isModified ? (
        <View className="self-end mt-2 flex-row">
          <Button
            title="Update"
            handlePress={updateHandle}
            containerStyles="bg-uBlack py-1"
            isLoading={!isInternetConnection}
            textStyles="text-white"
          />
          <Button
            title="Reset"
            handlePress={clearHandle}
            containerStyles="ml-2 py-1 border border-uBlack bg-transparent"
            textStyles="text-uBlack"
          />
        </View>
      ) : null}
      {isLoading && (
        <View className="absolute h-full w-full items-center justify-center">
          <View className="absolute h-full w-full bg-black opacity-80 rounded-xl" />
          <View>
            <Loading
              loadingPrompt="Updating Student Information"
              loadingColor={color.primary}
            />
          </View>
        </View>
      )}
    </View>
  );
};

export default StudentData;
