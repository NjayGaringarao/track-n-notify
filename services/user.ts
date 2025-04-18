import { env } from "@/constants/env";
import {
  getDocument,
  updateFile,
  uploadFile,
  updateDocument,
  deleteFile,
  _executeFunction,
} from "./appwrite";
import { User, UserCredentials } from "./types/model";
import { toUserCredential, toUserInfo } from "@/util/dataTransferObject";
import { ImagePickerAsset } from "expo-image-picker";
import { Models } from "react-native-appwrite";

export const getUserInfo = async (user_id: string): Promise<User> => {
  try {
    const result = await getDocument(
      env.DATABASE_PRIMARY,
      env.COLLECTION_USER,
      user_id
    );

    return toUserInfo(result);
  } catch (error) {
    if (
      error ==
      "AppwriteException: Document with the requested ID could not be found."
    ) {
      throw "User ID is not registered in Track n' Notify";
    } else {
      console.log(`user.getUserInfo : ${error}`);
      throw error;
    }
  }
};

export const getUserCredential = async (
  user_id: string
): Promise<UserCredentials> => {
  try {
    const result = await getDocument(
      env.DATABASE_PRIMARY,
      env.COLLECTION_USER_CREDENTIALS,
      user_id
    );

    return toUserCredential(result);
  } catch (error) {
    console.log(`user.getUserCredential : ${error}`);
    throw error;
  }
};

export const updateProfile = async (
  user_id: string,
  name: [string | undefined, string | undefined, string | undefined],
  newProfilePicture?: ImagePickerAsset
) => {
  let pictureFile: Models.File | undefined = undefined;
  try {
    if (newProfilePicture) {
      pictureFile = await uploadFile(env.BUCKET_IMAGE, {
        name: newProfilePicture.fileName!,
        type: newProfilePicture.mimeType!,
        size: newProfilePicture.fileSize!,
        uri: newProfilePicture.uri!,
      });

      const execution = await updateDocument(
        env.DATABASE_PRIMARY,
        env.COLLECTION_USER,
        user_id,
        {
          picture_id: pictureFile.$id,
          name: name,
        }
      );

      await updateFile(env.BUCKET_IMAGE, pictureFile.$id, {
        name: `User Image ${user_id}`,
      });

      return execution;
    } else {
      return await updateDocument(
        env.DATABASE_PRIMARY,
        env.COLLECTION_USER,
        user_id,
        {
          name: name,
        }
      );
    }
  } catch (error) {
    console.log(`ERROR : (userServices.ts => updateProfile) :: ${error}`);

    await deleteFile(env.BUCKET_IMAGE, pictureFile?.$id!).catch();
    throw error;
  }
};

export const updateStudentData = async (
  user_id: string,
  dep_prog: string,
  year_level: string
) => {
  try {
    const result = await updateDocument(
      env.DATABASE_PRIMARY,
      env.COLLECTION_STUDENT_INFO,
      user_id,
      {
        dep_prog: dep_prog,
        year_level: year_level,
      }
    );

    return result;
  } catch (error) {
    console.log(`user.updateStudentData : ${error}`);
    throw error;
  }
};

export const updateGuardianData = async (
  user_id: string,
  name: string,
  salutation: string,
  contact_number: string
) => {
  try {
    return await updateDocument(
      env.DATABASE_PRIMARY,
      env.COLLECTION_STUDENT_INFO,
      user_id,
      {
        guardian_name: name,
        guardian_salutation: salutation,
        guardian_cn: contact_number,
      }
    );
  } catch (error) {
    console.log(`user.updateGuardianData : ${error}`);
    throw error;
  }
};

export const updateStudentStatus = async (
  user_id: string,
  isInside: boolean,
  time: Date,
  dep_prog: string
) => {
  try {
    const result = await _executeFunction(
      env.FUNCTION_INOUT,
      "updateStudentStatus",
      {
        id: user_id,
        isInside: isInside,
        log_time: time,
        dep_prog: dep_prog,
      }
    );

    if (result.responseStatusCode != 200) throw "a";
  } catch (error) {
    console.log(`user.updateStudentStatus : ${error}`);
    throw error;
  }
};

export const updateAdminData = async (user_id: string, department: string) => {
  try {
    const result = await updateDocument(
      env.DATABASE_PRIMARY,
      env.COLLECTION_ADMIN_INFO,
      user_id,
      {
        department: department,
      }
    );
    return result;
  } catch (error) {
    console.log(`user.updateAdminStatus : ${error}`);
    throw error;
  }
};
