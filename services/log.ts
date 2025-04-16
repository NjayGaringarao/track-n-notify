import { env } from "@/constants/env";
import { listDocuments } from "./appwrite";
import { Query } from "react-native-appwrite";
import { toLogItem, toLogList } from "@/util/dataTransferObject";

export const getLogListItem = async (department: string, date: Date) => {
  try {
    const startOfDay = new Date(date.setUTCHours(0, 0, 0, 0)).toISOString();
    const endOfDay = new Date(date.setUTCHours(24, 0, 0, 0)).toISOString();

    const documents = await listDocuments(
      env.DATABASE_PRIMARY,
      env.COLLECTION_LOG,
      [
        Query.greaterThanEqual("log_time", startOfDay),
        Query.lessThan("log_time", endOfDay),
        Query.contains("dep_prog", department),
      ]
    );

    const logList = toLogList(documents.documents);

    return toLogItem(logList);
  } catch (error) {
    console.log(`log.getLog : ${error}`);
    throw error;
  }
};
