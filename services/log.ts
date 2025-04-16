import { env } from "@/constants/env";
import { listDocuments } from "./appwrite";
import { Query } from "react-native-appwrite";
import { toLogItem, toLogList } from "@/util/dataTransferObject";

export const getLogListItem = async (department: string, date: Date) => {
  try {
    // Clone the date to avoid mutation
    const localDate = new Date(date);

    // Manually adjust for UTC+8
    const startOfDay = new Date(
      localDate.getFullYear(),
      localDate.getMonth(),
      localDate.getDate(),
      -8,
      0,
      0,
      0 // UTC time equivalent of 00:00 PH time
    ).toISOString();

    const endOfDay = new Date(
      localDate.getFullYear(),
      localDate.getMonth(),
      localDate.getDate(),
      16,
      0,
      0,
      0 // UTC time equivalent of 24:00 PH time
    ).toISOString();

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
