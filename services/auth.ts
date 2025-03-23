import { ISignUp } from "@/types/interface";
import { _executeFunction, listDocuments } from "./appwrite";
import { env } from "@/constants/env";
import { AdminInfo, SecurityInfo, StudentInfo } from "@/types/model";
import { Query } from "react-native-appwrite";

export const isUserIdExisting = async (user_id: string) => {
  try {
    const result = await listDocuments(
      env.DATABASE_PRIMARY,
      env.COLLECTION_USER_CREDENTIALS,
      [Query.equal("$id", user_id)]
    );

    return !!result.total;
  } catch (error) {
    console.log("auth.isUserIdExisting : ", error);
    throw Error("There was a problem checking if credentials existing.");
  }
};

export const isEmailExisting = async (email: string) => {
  try {
    const result = await listDocuments(
      env.DATABASE_PRIMARY,
      env.COLLECTION_USER_CREDENTIALS,
      [Query.equal("email", email)]
    );

    return !!result.total;
  } catch (error) {
    console.log("auth.isEmailExisting : ", error);
    throw Error("There was a problem checking if credentials existing.");
  }
};

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
          id: role_info.id,
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
          id: role_info.id,
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
          id: role_info.id,
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
