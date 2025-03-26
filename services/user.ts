import { env } from "@/constants/env";
import { getDocument } from "./appwrite";
import { User, UserCredentials } from "./types/model";
import { toUserCredential, toUserInfo } from "@/util/dataTransferObject";

export const getUserInfo = async (user_id: string): Promise<User> => {
  try {
    const result = await getDocument(
      env.DATABASE_PRIMARY,
      env.COLLECTION_USER,
      user_id
    );

    return toUserInfo(result);
  } catch (error) {
    console.log(`user.getUserInfo : ${error}`);
    throw error;
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
