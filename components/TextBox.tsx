import Ionicons from "@expo/vector-icons/Ionicons";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  TextInputProps,
} from "react-native";
import React, { useState } from "react";
import color from "@/constants/color";

interface TextBoxProps extends TextInputProps {
  title?: string;
  titleTextStyles?: string;
  textValue: string;
  textInputStyles?: string;
  handleChangeText: (text: string) => void;
  isPassword?: boolean;
  placeholderValue?: string;
  placeholderTextStyles?: string;
  containerStyles?: string;
  boxStyles?: string;
  isDisabled?: boolean;
}

const FormField: React.FC<TextBoxProps> = ({
  title,
  titleTextStyles,
  textValue,
  textInputStyles,
  handleChangeText,
  isPassword,
  placeholderValue,
  placeholderTextStyles,
  containerStyles = "",
  boxStyles = "",
  maxLength,
  isDisabled = false,
  ...props
}) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <View className={containerStyles}>
      <Text className={`${titleTextStyles} ${title ? "" : "hidden"}`}>
        {title}
      </Text>
      <View className="w-full">
        <View
          className={` px-4 h-10 bg-white rounded-lg border-2 border-primary ${boxStyles} flex-row`}
        >
          <TextInput
            className={`flex-1 text-uBlack font-medium ${
              isPassword ? "mr-10" : ""
            } ${textInputStyles}`}
            value={textValue}
            placeholder={placeholderValue}
            placeholderTextColor={color.uGrayLight}
            onChangeText={handleChangeText}
            secureTextEntry={isPassword && !showPassword}
            style={{
              textAlignVertical: "center",
              letterSpacing: 1,
            }}
            {...props}
            maxLength={maxLength}
          />
        </View>
        {!!isDisabled && (
          <View className="absolute w-full h-full bg-secondary opacity-10 rounded-xl" />
        )}
        {isPassword && (
          <TouchableOpacity
            onPress={() => setShowPassword(!showPassword)}
            className="absolute right-4 bottom-2"
          >
            <Ionicons
              name={showPassword ? "eye-off" : "eye"}
              size={24}
              color={color.uBlack}
            />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

export default FormField;
