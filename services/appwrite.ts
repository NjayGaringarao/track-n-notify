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
    console.log("appwrite.getCurrentUser : ", error);
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

export const generateQR = (student_id: string) => {
  try {
    const result = appwriteService.avatars.getQR(
      student_id, // text
      300 // size (optional)
    );

    console.log(result.href);
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
