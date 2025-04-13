import { ISignUp } from "@/services/types/interface";
import {
  _executeFunction,
  getDocument,
  signInUser,
  signOutUser,
} from "./appwrite";
import { env } from "@/constants/env";
import { AdminInfo, SecurityInfo, StudentInfo } from "@/services/types/model";

export const signUp = async ({
  role,
  role_info,
  name,
  email,
  password,
}: ISignUp) => {
  try {
    if (role === "STUDENT") {
      const result = await _executeFunction(
        env.FUNCTION_ACCOUNT,
        "createStudentAccount",
        {
          id: role_info.$id,
          name: name,
          dep_prog: (role_info as StudentInfo).dep_prog,
          year_level: (role_info as StudentInfo).year_level,
          email: email,
          password: password,
        }
      );
      if (result.responseStatusCode != 200) throw Error("a");
    } else if (role === "ADMINISTRATOR") {
      const result = await _executeFunction(
        env.FUNCTION_ACCOUNT,
        "createAdministratorAccount",
        {
          id: role_info.$id,
          name: name,
          department: (role_info as AdminInfo).department,
          email: email,
          password: password,
        }
      );
      if (result.responseStatusCode != 200) throw Error("a");
    } else {
      const result = await _executeFunction(
        env.FUNCTION_ACCOUNT,
        "createSecurityAccount",
        {
          id: role_info.$id,
          name: name,
          type: (role_info as SecurityInfo).type,
          email: email,
          password: password,
        }
      );
      if (result.responseStatusCode != 200) throw Error("a");
    }
  } catch (error) {
    console.log("auth.signUp : ", error);
    throw Error("There was a problem creating your account.");
  }
};

export const signIn = async (
  role: string,
  user_id: string,
  password: string,
  initializeGlobalState: () => Promise<void>
) => {
  try {
    const credential = await getDocument(
      env.DATABASE_PRIMARY,
      env.COLLECTION_USER_CREDENTIALS,
      user_id
    );

    if (credential.role != role) throw "NOT-MATCHED";
    const session = await signInUser(credential.email, password);
    await initializeGlobalState();
    return session;
  } catch (error) {
    if (
      error ==
      "AppwriteException: Document with the requested ID could not be found."
    ) {
      throw "The provided ID is not used in a registered account.";
    } else if (error == "NOT-MATCHED") {
      throw "ID does not matched with the role.";
    } else if (
      error ==
        "AppwriteException: Invalid credentials. Please check the email and password." ||
      "AppwriteException: Invalid `password` param: Password must be between 8 and 256 characters long."
    ) {
      throw "Incorrect password.";
    } else {
      console.log("auth.studentSignIn : ", error);
      throw "There was a problem signing in to your account.";
    }
  }
};

export const signOut = async (resetGlobalState: () => void) => {
  try {
    await signOutUser();
    await resetGlobalState();
  } catch (error) {
    console.log("auth.signOutUser : ", error);
    throw "There is a problem logging out your account.";
  }
};
