import { Models } from "react-native-appwrite";
import { Dispatch, SetStateAction } from "react";
import { UserCredentials, User } from "@/services/types/model";

export interface RefreshUserRecordType {
  info?: boolean;
}

export interface GlobalContextInterface {
  setUser: Dispatch<SetStateAction<Models.User<Models.Preferences> | null>>;
  setUserInfo: Dispatch<SetStateAction<User>>;
  setUserCredential: Dispatch<SetStateAction<UserCredential>>;
  resetGlobalState: () => void;
  refreshUserRecord: (e: RefreshUserRecordType) => Promise<void>;
  initializeGlobalState: () => Promise<void>;
  user: Models.User<Models.Preferences> | null;
  userInfo: User;
  userCredential: UserCredentialType;
  fcmToken?: string;
  isLoading: boolean;
  isInternetConnection: boolean | null;
}
