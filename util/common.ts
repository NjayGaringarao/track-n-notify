import { Alert } from "react-native";

export const confirmAction = (title: string, message: string) => {
  return new Promise((resolve) => {
    Alert.alert(
      title,
      message,
      [
        {
          text: "Yes",
          onPress: () => resolve(true),
        },
        {
          text: "No",
          onPress: () => resolve(false),
        },
      ],
      { cancelable: false }
    );
  });
};
