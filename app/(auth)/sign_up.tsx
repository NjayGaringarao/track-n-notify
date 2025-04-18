import { View, Text, Image, ScrollView, Alert } from "react-native";
import React, { useRef, useState } from "react";
import image from "@/constants/image";
import ItemPicker from "@/components/ItemPicker";
import { Picker } from "@react-native-picker/picker";
import TextBox from "@/components/TextBox";
import Button from "@/components/Button";
import Loading from "@/components/Loading";
import color from "@/constants/color";
import Toast from "react-native-toast-message";
import { isEmailExisting, isUserIdExisting } from "@/services/credentials";
import { regex } from "@/constants/regex";
import { router } from "expo-router";
import { signIn, signUp } from "@/services/auth";
import { confirmAction } from "@/util/common";
import { AdminInfo, SecurityInfo, StudentInfo } from "@/services/types/model";
import { useGlobalContext } from "@/context/GlobalProvider";
import { signInUser } from "@/services/appwrite";

const sign_up = () => {
  const { initializeGlobalState } = useGlobalContext();
  const [accountType, setAccountType] = useState("STUDENT");
  const [isLoading, setIsLoading] = useState(false);
  const scrollViewRef = useRef<ScrollView | null>(null);
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
    $id: "",
    dep_prog: "CCIT-BSCS",
    year_level: "FIRST",
    guardian_name: "",
  });

  const [adminForm, setAdminForm] = useState<AdminInfo>({
    $id: "",
    department: "REGISTRAR",
  });

  const [securityForm, setSecurityForm] = useState<SecurityInfo>({
    $id: "",
    type: "GATE-KEEPER",
  });

  const clearHandle = () => {
    scrollViewRef.current?.scrollTo({ y: 0, animated: true });
    setNameForm({
      first: "",
      middle: "",
      last: "",
    });
    setCredentialForm({
      identifier: "",
      email: "",
      password: "",
      confPassword: "",
    });
    setStudentForm({
      $id: "",
      dep_prog: "CCIT-BSCS",
      year_level: "FIRST",
      guardian_name: "",
    });
    setAdminForm({
      $id: "",
      department: "REGISTRAR",
    });

    setSecurityForm({
      $id: "",
      type: "GATE-KEEPER",
    });
    setAccountType("STUDENT");
  };

  const validateInput = async () => {
    if (!nameForm.last.length || !nameForm.first.length) {
      Toast.show({
        type: "error",
        text1: "Incomplete Name",
        text2: "Please fillout first and last name.",
        visibilityTime: 5000,
      });
      return false;
    }

    if (accountType == "STUDENT" && studentForm.$id.length != 11) {
      Toast.show({
        type: "error",
        text1: "Invalid Student ID",
        text2: "Please provide your valid student ID.",
        visibilityTime: 5000,
      });
      return false;
    }

    if (accountType == "ADMINISTRATOR" && adminForm.$id.length == 0) {
      Toast.show({
        type: "error",
        text1: "Invalid Employee ID",
        text2: "Please provide your valid employee ID.",
        visibilityTime: 5000,
      });
      return false;
    }

    if (accountType == "SECURITY" && securityForm.$id.length == 0) {
      Toast.show({
        type: "error",
        text1: "Invalid Employee ID",
        text2: "Please provide your valid employee ID.",
        visibilityTime: 5000,
      });
      return false;
    }

    if (!regex.email.test(credentialForm.email)) {
      Toast.show({
        type: "error",
        text1: "Invalid Email",
        text2: "Please provide your valid email.",
        visibilityTime: 5000,
      });
      return false;
    }

    if (!regex.password.test(credentialForm.password)) {
      Toast.show({
        type: "error",
        text1: "Weak Password",
        text2:
          "Password should be more than 8 characters long containing alphanumeric and other special characters (_!@#$%^&.,). It should also not be the same with the old password",
        visibilityTime: 5000,
      });
      return false;
    }

    if (credentialForm.password !== credentialForm.confPassword) {
      Toast.show({
        type: "error",
        text1: "Unmatched password",
        text2: "Make sure that confirm password matches your given password.",
        visibilityTime: 5000,
      });
      return false;
    }

    if (
      await isUserIdExisting(
        accountType === "STUDENT"
          ? studentForm.$id
          : accountType === "ADMINISTRATOR"
          ? adminForm.$id
          : accountType === "SECURITY"
          ? securityForm.$id
          : ""
      )
    ) {
      Toast.show({
        type: "error",
        text1: "ID Already Used",
        text2: "Using the same ID for multiple account is not allowed.",
        visibilityTime: 5000,
      });
      return false;
    }

    if (await isEmailExisting(credentialForm.email)) {
      Toast.show({
        type: "error",
        text1: "Email Already Used",
        text2: "Please try again with different email.",
        visibilityTime: 5000,
      });
      return false;
    }
    return true;
  };

  const signUpHandle = async () => {
    if (
      !(await confirmAction(
        "Confirm Sign Up",
        "Are you sure you want to proceed with the provided information?"
      ))
    ) {
      return;
    }
    try {
      setIsLoading(true);
      if (!(await validateInput())) throw "EXIT";

      await signUp({
        role: accountType,
        role_info:
          accountType === "STUDENT"
            ? studentForm
            : accountType === "ADMINISTRATOR"
            ? adminForm
            : securityForm,
        name: [nameForm.first, nameForm.middle, nameForm.last],
        email: credentialForm.email,
        password: credentialForm.password,
      });

      Toast.show({
        type: "success",
        text1: "Sign Up Success",
        text2: "You are automatically signed in to Track n Notify.",
        visibilityTime: 5000,
      });
      clearHandle();

      try {
        await signInUser(credentialForm.email, credentialForm.password);
        await initializeGlobalState();
      } catch (error) {
        Toast.show({
          type: "error",
          text1: "Sign In Failed",
          text2: `${error}`,
        });
        router.back();
      }
    } catch (error) {
      if (error !== "EXIT") {
        Toast.show({
          type: "error",
          text1: "Sign Up Failed",
          text2: `${error}`,
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View className="flex-1 justify-center items-center">
      <Image
        className="h-full w-full"
        source={image.school_bg}
        resizeMode="cover"
      />
      <View className="absolute h-full w-full bg-primary opacity-50" />
      <View className="absolute h-full w-full justify-center items-center">
        {/** Branding */}

        <View className="flex-row p-4 my-4 bg-white rounded-xl items-center gap-4">
          <Image
            className="w-10 h-10"
            source={image.qr_sample}
            resizeMode="contain"
          />
          <Text className="text-3xl text-primary font-black">
            Track N' Notify
          </Text>
        </View>

        {/** Form */}
        <View className="w-11/12">
          <View className="absolute h-full w-full bg-black opacity-60 rounded-xl" />
          <View className="w-full p-4 gap-4">
            <View className="w-full flex-row items-center gap-2">
              <Text className="text-primary text-xl font-semibold">
                Sign Up as
              </Text>
              <ItemPicker
                value={accountType}
                onChange={(e) => setAccountType(e)}
                containerStyle="flex-1 border-2 border-primary rounded-xl bg-white"
              >
                <Picker.Item label="Student" value="STUDENT" />
                <Picker.Item label="Security" value="SECURITY" />
                <Picker.Item label="Administrator" value="ADMINISTRATOR" />
              </ItemPicker>
            </View>
            <ScrollView
              className="w-full border-t-2 border-b-2 py-4 border-primary h-[70vh]"
              ref={scrollViewRef}
              contentContainerStyle={{
                alignItems: "flex-start",
                flexDirection: "column",
                gap: 8,
              }}
            >
              {/* Name Section */}
              <View className="w-full">
                <Text className="text-xl font-black text-white my-2">NAME</Text>
                <View className="w-full pl-4 gap-2 border-secondary">
                  <TextBox
                    textValue={nameForm.last}
                    title="Surname"
                    placeholder="DELA CRUZ"
                    handleChangeText={(e) =>
                      setNameForm({ ...nameForm, last: e.toUpperCase() })
                    }
                    titleTextStyles="text-white"
                  />

                  <TextBox
                    textValue={nameForm.first}
                    title="First Name"
                    placeholder="JUAN"
                    handleChangeText={(e) =>
                      setNameForm({ ...nameForm, first: e.toUpperCase() })
                    }
                    titleTextStyles="text-white"
                  />

                  <TextBox
                    textValue={nameForm.middle}
                    title="Middle Name (Optional)"
                    placeholder="SANTOS"
                    handleChangeText={(e) =>
                      setNameForm({ ...nameForm, middle: e.toUpperCase() })
                    }
                    titleTextStyles="text-white"
                  />
                </View>
              </View>

              {/* Student Forms */}
              {accountType === "STUDENT" && (
                <View className="w-full mt-4">
                  <Text className="text-xl font-black text-white my-2">
                    STUDENT DETAILS
                  </Text>
                  <View className="w-full pl-4 gap-2">
                    <TextBox
                      textValue={studentForm.$id}
                      title="Student ID"
                      placeholder="xx-x-x-xxxx"
                      handleChangeText={(e) =>
                        setStudentForm({ ...studentForm, $id: e })
                      }
                      titleTextStyles="text-white"
                    />
                    <View className="w-full">
                      <Text className="text-white">
                        Set Department - Program
                      </Text>
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
                      <Text className="text-white">Set Year Level</Text>
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
                </View>
              )}

              {/* Admin Forms */}
              {accountType === "ADMINISTRATOR" && (
                <View className="w-full mt-4">
                  <Text className="text-xl font-black text-white my-2">
                    {accountType.concat(" DETAILS")}
                  </Text>
                  <View className="w-full pl-4 gap-2">
                    <TextBox
                      textValue={adminForm.$id}
                      title="Employee ID"
                      placeholder="xx-x-x-xxxx"
                      handleChangeText={(e) =>
                        setAdminForm({ ...adminForm, $id: e })
                      }
                      titleTextStyles="text-white"
                    />
                    <View className="w-full">
                      <Text className="text-white">Set Department</Text>
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
                </View>
              )}

              {/* Security Forms */}
              {accountType === "SECURITY" && (
                <View className="w-full mt-4">
                  <Text className="text-xl font-black text-white my-2">
                    {accountType.concat(" DETAILS")}
                  </Text>
                  <View className="w-full pl-4 gap-2">
                    <TextBox
                      textValue={securityForm.$id}
                      title="Employee ID"
                      placeholder="xx-x-x-xxxx"
                      handleChangeText={(e) =>
                        setSecurityForm({ ...securityForm, $id: e })
                      }
                      titleTextStyles="text-white"
                    />
                  </View>
                </View>
              )}

              {/* Credential Section */}
              <View className="w-full mt-4">
                <Text className="text-xl font-black text-white my-2">
                  CREDENTIALS
                </Text>
                <View className="w-full pl-4 gap-2">
                  <TextBox
                    textValue={credentialForm.email}
                    title="Email"
                    placeholder="example@prmsu.edu.ph"
                    handleChangeText={(e) =>
                      setCredentialForm({ ...credentialForm, email: e })
                    }
                    titleTextStyles="text-white"
                  />
                  <TextBox
                    textValue={credentialForm.password}
                    title="Password"
                    placeholder="********"
                    handleChangeText={(e) =>
                      setCredentialForm({ ...credentialForm, password: e })
                    }
                    isPassword
                    titleTextStyles="text-white"
                  />
                  <TextBox
                    textValue={credentialForm.confPassword}
                    title="Confirm Password"
                    placeholder="********"
                    handleChangeText={(e) =>
                      setCredentialForm({
                        ...credentialForm,
                        confPassword: e,
                      })
                    }
                    isPassword
                    titleTextStyles="text-white"
                  />
                </View>
              </View>
              <View className="flex-row items-center gap-2 mt-4 mb-16">
                <View className="flex-1">
                  <Button
                    title="Sign Up"
                    handlePress={signUpHandle}
                    containerStyles=""
                  />
                </View>
                <Button
                  title="Clear Form"
                  textStyles="text-white"
                  handlePress={clearHandle}
                  containerStyles="w-32 bg-transparent border border-primary"
                />
              </View>
            </ScrollView>
          </View>
          {isLoading && (
            <View className="absolute h-full w-full items-center justify-center">
              <View className="absolute h-full w-full bg-black opacity-80 rounded-xl" />
              <View>
                <Loading
                  loadingPrompt="Creating Account"
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

export default sign_up;
