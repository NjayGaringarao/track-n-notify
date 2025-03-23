import React from "react";
import { View } from "react-native";
import { Picker } from "@react-native-picker/picker";
import color from "@/constants/color";

type PickerProps = {
  value: string;
  onChange: (value: string) => void;
  containerStyle?: string;
  children:
    | React.ReactElement<typeof Picker.Item>
    | React.ReactElement<typeof Picker.Item>[];
};

const ItemPicker: React.FC<PickerProps> = ({
  value,
  onChange,
  containerStyle,
  children,
}) => {
  return (
    <View className={`justify-center h-10 ${containerStyle}`}>
      <Picker
        selectedValue={value}
        onValueChange={onChange}
        dropdownIconColor={color.uBlack}
        mode="dropdown"
      >
        {children}
      </Picker>
    </View>
  );
};

export default ItemPicker;
