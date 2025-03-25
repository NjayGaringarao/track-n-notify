import { _executeFunction, listDocuments } from "./appwrite";
import { env } from "@/constants/env";
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
