import { TouchableOpacity, View, Image, Modal } from "react-native";
import React, { useEffect, useState } from "react";
import { User } from "@/services/types/model";
import { getImagePreview } from "@/services/common";
import { generateAvatar } from "@/services/appwrite";
import WebView from "react-native-webview";
import { getHTMLImageRender } from "@/util/common";
import Button from "./Button";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import color from "@/constants/color";

interface IProfilePictureType {
  userInfo: User;
  onPress?: () => void;
  onLongPress?: () => void;
  containerStyle?: string;
  imageStyle?: string;
}

const ProfilePicture = ({
  userInfo,
  containerStyle,
  imageStyle,
}: IProfilePictureType) => {
  const [imagePreview, setImagePreview] = useState<string>(
    generateAvatar(`${userInfo.name[0]} ${userInfo.name[2]}`)
  );
  const [isImageModalVisible, setIsImageModalVisible] = useState(false);

  const onPressHandle = () => {
    setIsImageModalVisible(true);
  };

  useEffect(() => {
    const initialize = async () => {
      if (userInfo.picture_id && userInfo.picture_id.length > 19) {
        setImagePreview(getImagePreview(userInfo.picture_id, 10));
      } else {
        setImagePreview(
          generateAvatar(`${userInfo.name[0]} ${userInfo.name[2]}`)
        );
      }
    };

    initialize();
  }, [userInfo]);

  return (
    <>
      <TouchableOpacity
        onPress={onPressHandle}
        className={`border rounded-md h-32 w-32 bg-primary shadow-md shadow-black items-center justify-center ${containerStyle}`}
      >
        <Image
          className={`w-20 h-20 bg-black rounded-full ${imageStyle}`}
          source={{ uri: imagePreview }}
        />
      </TouchableOpacity>
      {isImageModalVisible && (
        <Modal
          visible={isImageModalVisible}
          transparent={false}
          animationType="slide"
          onRequestClose={() => setIsImageModalVisible(false)}
        >
          <TouchableOpacity
            className="flex-1 absolute items-center"
            onPress={() => setIsImageModalVisible(false)}
          />
          <View className="bg-black w-full h-full relative">
            <WebView
              originWhitelist={["*"]}
              source={{
                html: getHTMLImageRender(imagePreview),
              }}
              scalesPageToFit={true}
              bounces={true}
              showsVerticalScrollIndicator={false}
            />
            <View className="absolute top-0 w-full h-16 bg-black opacity-70" />
            <Button
              handlePress={() => setIsImageModalVisible(false)}
              containerStyles="absolute top-5 left-0 bg-transparent"
            >
              <MaterialIcons
                name="keyboard-backspace"
                size={32}
                color={color.white}
              />
            </Button>
          </View>
        </Modal>
      )}
    </>
  );
};

export default ProfilePicture;
