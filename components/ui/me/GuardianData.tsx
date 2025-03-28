import { View, Text } from "react-native";
import React, { useEffect, useState } from "react";
import { useGlobalContext } from "@/context/GlobalProvider";
import TextBox from "@/components/TextBox";
import Button from "@/components/Button";
import Loading from "@/components/Loading";
import color from "@/constants/color";
import { confirmAction } from "@/util/common";
import Toast from "react-native-toast-message";

const GuardianData = () => {
  const { userInfo, isInternetConnection } = useGlobalContext();
  const [isModified, setIsModified] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [guardianForm, setGuardianForm] = useState({
    name: userInfo.student_info?.guardian_info.name,
    contact_number: userInfo.student_info?.guardian_info.contact_number,
  });

  const clearHandle = () => {
    setGuardianForm({
      name: userInfo.student_info?.guardian_info.name,
      contact_number: userInfo.student_info?.guardian_info.contact_number,
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

      await Toast.show({
        type: "success",
        text1: "Update Success",
        text2: `Successfully updated your G/P Information.`,
      });
      clearHandle();
    } catch (error) {
      Toast.show({
        type: "error",
        text1: "Update Failed",
        text2: `${error}`,
      });
      clearHandle();
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (
      userInfo &&
      userInfo.student_info &&
      userInfo.student_info.guardian_info
    ) {
      if (
        guardianForm.name !== userInfo.student_info.guardian_info.name ||
        guardianForm.contact_number !==
          userInfo.student_info.guardian_info.contact_number
      ) {
        setIsModified(true);
      } else {
        setIsModified(false);
      }
    }
  }, [guardianForm]);

  useEffect(() => {
    clearHandle();
  }, [userInfo]);

  return (
    <View className="w-full mb-6">
      <Text className="text-xl text-uBlack font-black my-2">
        PARENT/GUARDIAN INFORMATION
      </Text>
      <View className="gap-2">
        <TextBox
          textValue={guardianForm.name!}
          title="Full Name"
          placeholder="JUAN A. DELA CRUZ"
          handleChangeText={(e) =>
            setGuardianForm({ ...guardianForm, name: e.toUpperCase() })
          }
          titleTextStyles="text-uBlack"
        />
        <TextBox
          textValue={guardianForm.contact_number!}
          title="Mobile Number"
          placeholder="09123456789"
          handleChangeText={(e) =>
            setGuardianForm({
              ...guardianForm,
              contact_number: e.toUpperCase(),
            })
          }
          titleTextStyles="text-uBlack"
        />
      </View>
      {isModified ? (
        <View className="self-end mt-2 flex-row">
          <Button
            title="Update"
            handlePress={updateHandle}
            containerStyles="bg-uBlack py-1"
            isLoading={
              !isInternetConnection ||
              !(
                guardianForm.contact_number &&
                guardianForm.contact_number.length == 11
              ) ||
              isNaN(Number(guardianForm.contact_number))
            }
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

export default GuardianData;
