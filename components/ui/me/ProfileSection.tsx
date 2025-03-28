import React, { useEffect, useState, useRef } from "react";
import { View, Text } from "react-native";
import TextBox from "@/components/TextBox";
import Button from "@/components/Button";
import ProfilePicturePicker from "@/components/ProfilePicturePicker";
import { ImagePickerAsset } from "expo-image-picker";
import Loading from "@/components/Loading";
import { updateProfile } from "@/services/user";
import { confirmAction } from "@/util/common";
import { useGlobalContext } from "@/context/GlobalProvider";
import { Ionicons } from "@expo/vector-icons";
import Toast from "react-native-toast-message";
import color from "@/constants/color";

const ProfileSection = () => {
  const { userInfo, refreshUserRecord, isInternetConnection } =
    useGlobalContext();
  const [isModified, setIsModified] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [newProfilePicture, setNewProfilePicture] = useState<
    ImagePickerAsset | undefined
  >();
  const [nameForm, setNameForm] = useState({
    first: "",
    middle: "",
    last: "",
  });
  const profilePickerRef = useRef<{ clear: () => void }>(null);

  const clearHandle = () => {
    if (userInfo.name) {
      setNameForm({
        first: userInfo.name[0] ? userInfo.name[0] : "",
        middle: userInfo.name[1] ? userInfo.name[1] : "",
        last: userInfo.name[2] ? userInfo.name[2] : "",
      });
    }
    clearProfilePicture();
  };

  const clearProfilePicture = () => {
    profilePickerRef.current?.clear();
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
        !(await updateProfile(
          userInfo.id,
          [nameForm.first, nameForm.middle, nameForm.last],
          newProfilePicture
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
  }, [userInfo]);

  useEffect(() => {
    if (userInfo.name) {
      if (
        nameForm.first !== userInfo.name[0] ||
        nameForm.middle !== userInfo.name[1] ||
        nameForm.last !== userInfo.name[2] ||
        newProfilePicture
      ) {
        setIsModified(true);
      } else {
        setIsModified(false);
      }
    }
  }, [nameForm, newProfilePicture]);

  useEffect(() => {
    setIsLoading(false);
  }, [userInfo]);

  return (
    <View className="gap-2 mt-6">
      <View>
        <View className="w-full flex-row gap-4">
          <View className="justify-center items-center gap-1">
            <ProfilePicturePicker
              ref={profilePickerRef}
              userInfo={userInfo}
              setNewProfilePicture={(e) => setNewProfilePicture(e)}
              newProfilePicture={newProfilePicture}
              containerStyle=" shadow-lg shadow-black"
              imageStyle="h-32 w-32 rounded-3xl"
            />
            <Text className="text-sm font-semibold">{userInfo.id}</Text>
          </View>

          <View className="flex-1 gap-2">
            <TextBox
              textValue={nameForm.last}
              title="Surname"
              placeholder="DELA CRUZ"
              handleChangeText={(e) =>
                setNameForm({ ...nameForm, last: e.toUpperCase() })
              }
              titleTextStyles="text-uBlack"
            />

            <TextBox
              textValue={nameForm.first}
              title="First Name"
              placeholder="JUAN"
              handleChangeText={(e) =>
                setNameForm({ ...nameForm, first: e.toUpperCase() })
              }
              titleTextStyles="text-uBlack"
            />

            <TextBox
              textValue={nameForm.middle}
              title="Middle Name (Optional)"
              placeholder="SANTOS"
              handleChangeText={(e) =>
                setNameForm({ ...nameForm, middle: e.toUpperCase() })
              }
              titleTextStyles="text-uBlack"
            />
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
      </View>
      {isLoading && (
        <View className="absolute h-full w-full items-center justify-center">
          <View className="absolute h-full w-full bg-black opacity-80 rounded-xl" />
          <View>
            <Loading
              loadingPrompt="Updating Profile"
              loadingColor={color.primary}
            />
          </View>
        </View>
      )}
    </View>
  );
};

export default ProfileSection;
