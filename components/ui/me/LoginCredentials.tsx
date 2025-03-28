import { View, Text } from "react-native";
import React, { useState } from "react";
import { useGlobalContext } from "@/context/GlobalProvider";
import TextBox from "@/components/TextBox";
import { regex } from "@/constants/regex";
import Button from "@/components/Button";
import Loading from "@/components/Loading";
import color from "@/constants/color";
import { confirmAction } from "@/util/common";
import Toast from "react-native-toast-message";
import { updatePassword } from "@/services/appwrite";
import AntDesign from "@expo/vector-icons/AntDesign";

const LoginCredentials = () => {
  const { userCredential, isInternetConnection } = useGlobalContext();
  const [isLoading, setIsLoading] = useState(false);
  const [form, setForm] = useState({
    oldPassword: "",
    newPassword: "",
    confPassword: "",
  });

  const [inputValidity, setInputValidity] = useState({
    newPassword: false,
    confPassword: true,
  });

  const [promptVisibility, setPromptVisibility] = useState({
    newPassword: false,
    confPassword: true,
  });

  const oldPasswordTextChangeHandle = (password: string) => {
    setForm({ ...form, oldPassword: password });

    setInputValidity((prev) => ({
      ...prev,
      newPassword:
        regex.password.test(password) && form.oldPassword != password,
    }));
  };

  const newPasswordTextChangeHandle = (password: string) => {
    !promptVisibility.newPassword &&
      setPromptVisibility({ ...promptVisibility, newPassword: true });

    setForm({ ...form, newPassword: password });

    setInputValidity((prev) => ({
      ...prev,
      newPassword:
        regex.password.test(password) && form.oldPassword != password,
      confPassword: password === form.confPassword,
    }));
  };

  const confTextChangeHandle = (text: string) => {
    setForm({ ...form, confPassword: text });
    setInputValidity({
      ...inputValidity,
      confPassword: text === form.newPassword,
    });
  };

  const resetHandle = () => {
    setForm({
      oldPassword: "",
      newPassword: "",
      confPassword: "",
    });
    setInputValidity({
      newPassword: false,
      confPassword: true,
    });
    setPromptVisibility({
      newPassword: false,
      confPassword: true,
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

      await updatePassword(form.oldPassword, form.newPassword);

      Toast.show({
        type: "success",
        text1: "Update Success",
        text2: `Successfully changed your password.`,
      });
      resetHandle();
    } catch (error) {
      Toast.show({
        type: "error",
        text1: "Update Failed",
        text2: `${error}`,
      });
      resetHandle();
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View className="w-full mb-6">
      <View className="flex-row gap-2 items-center">
        <Text className="text-xl text-uBlack font-black my-2">
          LOGIN CREDENTIALS
        </Text>
      </View>
      <View className="w-full">
        <View className="w-full gap-2">
          <TextBox
            title="Role"
            textValue={userCredential.role.toUpperCase()}
            placeholder="Unset"
            handleChangeText={() => {}}
            isDisabled
          />
          <TextBox
            title="Email"
            textValue={userCredential.email}
            placeholder="Unset"
            handleChangeText={() => {}}
            isDisabled
            isPassword
          />
          <TextBox
            title={
              userCredential.role === "admin" ? "Employee ID" : "Student Number"
            }
            textValue={userCredential.id}
            placeholder="Unset"
            handleChangeText={() => {}}
            isDisabled
            isPassword
          />
          <View className="w-full gap-2">
            <Text className="text-base text-uGray font-semibold -mb-1">
              Change Password
            </Text>
            <TextBox
              textValue={form.oldPassword}
              placeholder="Old Password"
              handleChangeText={oldPasswordTextChangeHandle}
              titleTextStyles="text-uBlack"
              isPassword
            />
            <View className="w-full">
              <TextBox
                textValue={form.newPassword}
                placeholder="New Password"
                handleChangeText={newPasswordTextChangeHandle}
                titleTextStyles="text-uBlack"
                isPassword
              />
              <Text
                className={`mt-1 text-xs text-red-600 font-semibold text-right ${
                  !(!inputValidity.newPassword && promptVisibility.newPassword)
                    ? "hidden"
                    : "visible"
                }`}
                style={{ lineHeight: 12 }}
              >
                *Password should be more than 8 characters long containing
                alphanumeric and other special characters{" (_!@#$%^&.,) "}. It
                should also not be the same with the old password
              </Text>
            </View>
            <View className="w-full">
              <TextBox
                textValue={form.confPassword}
                placeholder="Confirm Password"
                handleChangeText={confTextChangeHandle}
                titleTextStyles="text-uBlack"
                isPassword
              />
              <Text
                className={`mt-1 text-xs text-red-600 font-semibold text-right ${
                  inputValidity.confPassword ? "hidden" : "visible"
                }`}
                style={{ lineHeight: 12 }}
              >
                *Password does not match.
              </Text>
            </View>
            <View className="self-end flex-row gap-1 mt-1">
              {Object.values(form).some((value) => value.trim().length > 0) && (
                <>
                  <Button
                    title="Update"
                    handlePress={updateHandle}
                    isLoading={
                      isLoading ||
                      !Object.values(inputValidity).every(Boolean) ||
                      !isInternetConnection ||
                      form.oldPassword.length < 8
                    }
                    containerStyles="bg-uBlack py-1"
                    textStyles="text-white"
                  />
                  <Button
                    title="Reset"
                    handlePress={resetHandle}
                    containerStyles="ml-2 py-1 border border-uBlack bg-transparent"
                    textStyles="text-uBlack"
                  />
                </>
              )}
            </View>
          </View>
        </View>
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

export default LoginCredentials;
