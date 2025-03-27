import { TouchableOpacity, View, Image } from "react-native";
import React, { useEffect, useState } from "react";
import { User } from "@/services/types/model";
import { getImagePreview } from "@/services/common";
import { generateAvatar } from "@/services/appwrite";

interface IProfilePictureType {
  userInfo: User;
  onPress?: () => void;
  onLongPress?: () => void;
  containerStyle?: string;
  imageStyle?: string;
}

const ProfilePicture = ({
  userInfo,
  onPress,
  onLongPress,
  containerStyle,
  imageStyle,
}: IProfilePictureType) => {
  const [imagePreview, setImagePreview] = useState<string>(
    generateAvatar(`${userInfo.name[0]} ${userInfo.name[2]}`)
  );

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

  if (onLongPress || onPress) {
    return (
      <TouchableOpacity
        onPress={onPress}
        onLongPress={onLongPress}
        className={`border rounded-md h-32 w-32 bg-primary shadow-md shadow-black items-center justify-center ${containerStyle}`}
      >
        <Image
          className={`w-20 h-20 bg-black rounded-full ${imageStyle}`}
          source={{ uri: imagePreview }}
        />
      </TouchableOpacity>
    );
  } else {
    return (
      <View
        className={`border rounded-md h-32 w-32 bg-primary shadow-md shadow-black items-center justify-center ${containerStyle}`}
      >
        <Image
          className={`w-20 h-20 bg-black rounded-full ${imageStyle}`}
          source={{ uri: imagePreview }}
        />
      </View>
    );
  }
};

export default ProfilePicture;
