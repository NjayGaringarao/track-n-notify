import { Modal, TouchableOpacity, View, Image } from "react-native";
import React, {
  useEffect,
  useState,
  useImperativeHandle,
  forwardRef,
} from "react";
import { ImagePickerAsset, launchImageLibraryAsync } from "expo-image-picker";
import { convertToBase64, getHTMLImageRender } from "@/util/common";
import WebView from "react-native-webview";
import Button from "./Button";
import color from "@/constants/color";
import { getImagePreview } from "@/services/common";
import { User } from "@/services/types/model";
import { generateAvatar } from "@/services/appwrite";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";

interface ProfilePicturePickerType {
  containerStyle?: string;
  userInfo: User;
  imageStyle?: string;
  setNewProfilePicture: (image: ImagePickerAsset | undefined) => void;
  newProfilePicture: ImagePickerAsset | undefined;
}

const ProfilePicturePicker = forwardRef(
  (
    {
      containerStyle,
      userInfo,
      setNewProfilePicture,
      newProfilePicture,
      imageStyle,
    }: ProfilePicturePickerType,
    ref
  ) => {
    const [pickerImage, setPickerImage] = useState<
      ImagePickerAsset | undefined
    >();
    const [imageSource, setImageSource] = useState<string | undefined>();
    const [isImagePreviewVisible, setIsImagePreviewVisible] = useState(false);

    const clearHandle = () => {
      setPickerImage(undefined);
      setImageSource(
        userInfo.picture_id
          ? getImagePreview(userInfo.picture_id)
          : generateAvatar(`${userInfo.name[0]} ${userInfo.name[2]}`)
      );
      setNewProfilePicture(undefined);
    };

    const pickImagehandle = async (): Promise<void> => {
      const result = await launchImageLibraryAsync({
        mediaTypes: "images",
        quality: 1,
        allowsEditing: true,
        allowsMultipleSelection: false,
      });

      if (!result.canceled && result.assets) {
        setPickerImage(result.assets[0]);
      } else {
        console.log("Image picker was canceled or no assets selected.");
      }
    };

    useEffect(() => {
      const changeSourceHandle = async () => {
        if (pickerImage) {
          setImageSource(await convertToBase64(pickerImage.uri));
          setNewProfilePicture(pickerImage);
        }
      };

      changeSourceHandle();
    }, [pickerImage]);

    // Expose the clearHandle function to the parent via ref
    useImperativeHandle(ref, () => ({
      clear: clearHandle,
    }));

    return (
      <>
        <TouchableOpacity
          onPress={() => setIsImagePreviewVisible(true)}
          onLongPress={pickImagehandle}
          className={`${containerStyle}`}
        >
          <Image className={imageStyle} source={{ uri: imageSource }} />
          <View className="absolute -top-2 -right-2 gap-2">
            {!!newProfilePicture && (
              <TouchableOpacity
                className="bg-gray-400 border-2 border-gray-400 rounded-full overflow-hidden"
                onPress={clearHandle}
              >
                <MaterialCommunityIcons
                  name="window-close"
                  size={24}
                  color={color.uBlack}
                />
              </TouchableOpacity>
            )}
            <TouchableOpacity
              className="bg-panel rounded-lg overflow-hidden shadow shadow-black"
              onPress={pickImagehandle}
            >
              <FontAwesome5
                name="exchange-alt"
                size={24}
                color={color.uBlack}
              />
            </TouchableOpacity>
          </View>
        </TouchableOpacity>

        {isImagePreviewVisible && (
          <Modal
            visible={isImagePreviewVisible}
            transparent={false}
            animationType="slide"
            onRequestClose={() => setIsImagePreviewVisible(false)}
          >
            <TouchableOpacity
              className="flex-1 absolute items-center"
              onPress={() => setIsImagePreviewVisible(false)}
            />
            <View className="bg-black w-full h-full relative">
              <WebView
                originWhitelist={["*"]}
                source={{
                  html: getHTMLImageRender(imageSource!),
                }}
                scalesPageToFit={true}
                bounces={true}
                showsVerticalScrollIndicator={false}
              />
              <View className="absolute top-0 w-full h-16 bg-black opacity-70" />
              <Button
                handlePress={() => setIsImagePreviewVisible(false)}
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
  }
);

export default ProfilePicturePicker;
