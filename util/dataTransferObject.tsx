import { User, UserCredentials } from "@/services/types/model";
import { Models } from "react-native-appwrite";

export const toUserInfo = (document: Models.Document): User => {
  return {
    id: document.$id,
    name: document.name,
    picture_id: document.picture_id,
    admin_info: document.admin_info,
    student_info: document.student_info,
    security_info: document.security_info,
  };
};

export const toUserCredential = (
  document: Models.Document
): UserCredentials => {
  return {
    id: document.$id,
    email: document.email,
    role: document.role,
  };
};
