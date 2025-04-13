import { View, Text } from "react-native";
import React, { useEffect, useState } from "react";
import ItemPicker from "@/components/ItemPicker";
import { useGlobalContext } from "@/context/GlobalProvider";
import { Picker } from "@react-native-picker/picker";
import Button from "@/components/Button";
import Toast from "react-native-toast-message";
import { confirmAction } from "@/util/common";
import { updateAdminData } from "@/services/user";
import Loading from "@/components/Loading";
import color from "@/constants/color";

const AdminData = () => {
  const { userInfo, isInternetConnection, refreshUserRecord } =
    useGlobalContext();
  const [isModified, setIsModified] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [adminForm, setAdminForm] = useState({
    department: userInfo.admin_info?.department!,
  });

  const clearHandle = () => {
    setAdminForm({
      department: userInfo.admin_info?.department!,
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
      if (!(await updateAdminData(userInfo.id, adminForm.department))) {
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
    if (userInfo.admin_info) {
      if (adminForm.department !== userInfo.admin_info.department) {
        setIsModified(true);
      } else {
        setIsModified(false);
      }
    }
  }, [adminForm]);

  useEffect(() => {
    setAdminForm({
      department: userInfo.admin_info?.department!,
    });
  }, [userInfo]);

  return (
    <View className="w-full mb-6">
      <Text className="text-xl text-uBlack font-black my-2">
        ADMIN INFORMATION
      </Text>
      <View className="gap-2">
        <View className="w-full">
          <Text className="text-uBlack">Set Department</Text>
          <ItemPicker
            value={adminForm.department}
            onChange={(value) =>
              setAdminForm({ ...adminForm, department: value })
            }
            containerStyle="flex-1 border-2 border-primary rounded-xl bg-white"
          >
            <Picker.Item label="CCIT Faculty" value="CCIT" />
            <Picker.Item label="CTE Faculty" value="CTE" />
            <Picker.Item label="CBAPA Faculty" value="CBAPA" />
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
              loadingPrompt="Updating Admin Information"
              loadingColor={color.primary}
            />
          </View>
        </View>
      )}
    </View>
  );
};

export default AdminData;
