import {
  Client,
  Account,
  ID,
  Avatars,
  Databases,
  Storage,
  Messaging,
  Functions,
  Flag,
  Browser,
  ExecutionMethod,
} from "react-native-appwrite";

const client = new Client();

class AppwriteService {
  account;
  avatars;
  database;
  functions;
  storage;
  messaging;

  constructor() {
    client
      .setEndpoint(process.env.EXPO_PUBLIC_APPWRITE_ENDPOINT!)
      .setPlatform(process.env.EXPO_PUBLIC_APPWRITE_PLATFORM!)
      .setProject(process.env.EXPO_PUBLIC_APPWRITE_PROJECT!);
    this.account = new Account(client);
    this.avatars = new Avatars(client);
    this.database = new Databases(client);
    this.functions = new Functions(client);
    this.storage = new Storage(client);
    this.messaging = new Messaging(client);
  }
}

const appwriteService = new AppwriteService();

export const createUserAccount = async (
  username: string,
  email: string,
  password: string
) => {
  try {
    const userAccount = await appwriteService.account.create(
      ID.unique(),
      email,
      password,
      username
    );
    return userAccount;
  } catch (error) {
    console.log("appwrite.createUserAccount : ", error);
  }
};

export const updatePassword = async (
  oldPassword: string,
  newPassword: string
) => {
  try {
    return await appwriteService.account.updatePassword(
      newPassword,
      oldPassword
    );
  } catch (error) {
    console.log(`appwrite._updatePassword : ${error}`);
    if (
      error ==
        "AppwriteException: Invalid `oldPassword` param: Password must be between 8 and 256 characters long." ||
      error ==
        "AppwriteException: Invalid credentials. Please check the email and password."
    ) {
      throw Error("Incorrect old password.");
    } else {
      throw Error("There was a problem updating your password");
    }
  }
};

export const signInUser = async (email: string, password: string) => {
  try {
    const session = await appwriteService.account.createEmailPasswordSession(
      email,
      password
    );
    return session;
  } catch (error) {
    console.log("appwrite.signInUser : ", error);
  }
};

export const getSession = async () => {
  try {
    const res = await appwriteService.account.getSession("current");
    return res;
  } catch (error) {
    console.log(`appwrite.getSession : ${error}`);
    throw error;
  }
};

export const signOutUser = async () => {
  try {
    return appwriteService.account.deleteSession("current");
  } catch (error) {
    console.log("appwrite.signOutUser : ", error);
  }
};

export const getCurrentUser = async () => {
  try {
    return await appwriteService.account.get();
  } catch (error) {
    if (
      error == "AppwriteException: User (role: guests) missing scope (account)"
    ) {
      console.log("No Logged In Account");
    } else {
      console.log("appwrite.getCurrentUser : ", error);
    }
  }
};
export const createDocument = async (
  DATABASE_ID: string,
  COLLECTION_ID: string,
  document_id: string | undefined,
  data: object
) => {
  try {
    const result = await appwriteService.database.createDocument(
      DATABASE_ID,
      COLLECTION_ID,
      document_id || ID.unique(),
      data
    );
    return result;
  } catch (error) {
    console.log("appwrite.createDocument : ", error);
  }
};
export const getDocument = async (
  DATABASE_ID: string,
  COLLECTION_ID: string,
  document_id: string
) => {
  try {
    const result = await appwriteService.database.getDocument(
      DATABASE_ID,
      COLLECTION_ID,
      document_id
    );
    return result;
  } catch (error) {
    console.log("appwrite.getDocument : ", error);
    throw error;
  }
};

export const listDocuments = async (
  DATABASE_ID: string,
  COLLECTION_ID: string,
  query?: string[]
) => {
  try {
    const documentList = await appwriteService.database.listDocuments(
      DATABASE_ID,
      COLLECTION_ID,
      query
    );
    return documentList;
  } catch (error) {
    console.log("appwrite.listDocuments : ", error);
    throw error;
  }
};

export const updateDocument = async (
  DATABASE_ID: string,
  COLLECTION_ID: string,
  document_ID: string,
  data: object
) => {
  try {
    const result = await appwriteService.database.updateDocument(
      DATABASE_ID,
      COLLECTION_ID,
      document_ID,
      data
    );
    return result;
  } catch (error) {
    console.log(`appwrite.updateDocument : ${error}`);
    throw error;
  }
};

export const generateQR = (student_id: string) => {
  try {
    const result = appwriteService.avatars.getQR(
      student_id, // text
      300 // size (optional)
    );

    return result.href;
  } catch (error) {
    console.log("appwrite.generateQR : ", error);
  }
};

export const _executeFunction = async (
  FUNCTION_ID: string,
  operation: string,
  parameter: object
) => {
  const bodyRequest = {
    operation: operation,
    parameter: parameter,
  };

  const result = await appwriteService.functions.createExecution(
    FUNCTION_ID,
    JSON.stringify(bodyRequest),
    false,
    undefined,
    ExecutionMethod.POST
  );

  return result;
};

export const getFilePreview = (
  BUCKET_ID: string,
  file_ID: string,
  quality?: number,
  width?: number,
  height?: number
) => {
  try {
    const preview_src = appwriteService.storage.getFilePreview(
      BUCKET_ID,
      file_ID,
      width,
      height,
      undefined,
      quality
    );
    return preview_src;
  } catch (error) {
    console.log(`appwrite.getFilePreview : ${error}`);
    throw error;
  }
};

export const uploadFile = async (
  BUCKET_ID: string,
  asset: {
    name: string;
    type: string;
    size: number;
    uri: string;
  },
  file_ID?: string
) => {
  console.log(asset.uri);
  try {
    const uploadedFile = await appwriteService.storage.createFile(
      BUCKET_ID,
      file_ID ? file_ID : ID.unique(),
      asset
    );
    return uploadedFile;
  } catch (error) {
    console.log(`appwrite.uploadFile : ${error}`);
    throw error;
  }
};

export const updateFile = async (
  BUCKET_ID: string,
  file_ID: string,
  data: {
    name?: string;
    permissions?: string[];
  }
) => {
  try {
    await appwriteService.storage.updateFile(
      BUCKET_ID,
      file_ID,
      data.name,
      data.permissions
    );
  } catch (error) {
    console.log(`appwrite.updateFile : ${error}`);
  }
};

export const deleteFile = async (BUCKET_ID: string, file_ID: string) => {
  try {
    await appwriteService.storage.deleteFile(BUCKET_ID, file_ID);
  } catch (error) {
    console.log(`appwrite.deleteFile : ${error}`);
    throw error;
  }
};

export const generateAvatar = (username: string) => {
  return appwriteService.avatars.getInitials(username).href;
};
