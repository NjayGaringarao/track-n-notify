import { UserCredentials, User } from "@/services/types/model";
import { GlobalContextInterface } from "./context";

export const emptyUserInfo: User = {
  id: "",
  name: ["", "", ""],
};

export const emptyUserCredential: UserCredentials = {
  id: "",
  email: "",
  role: "",
};

export const defaultValue: GlobalContextInterface = {
  setUser: (e) => {},
  setUserInfo: (e) => {},
  setUserCredential: (e) => {},
  refreshUserRecord: async ({}) => Promise.resolve(),
  resetGlobalState: () => {},
  initializeGlobalState: async () => {},
  user: null,
  userInfo: emptyUserInfo,
  userCredential: emptyUserCredential,
  fcmToken: undefined,
  isLoading: false,
  isInternetConnection: null,
};
