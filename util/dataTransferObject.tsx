import { ILogItem } from "@/services/types/interface";
import { Log, User, UserCredentials } from "@/services/types/model";
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

export const toLogList = (documents: Models.Document[]): Log[] => {
  const logList: Log[] = [];

  documents.forEach((document) => {
    logList.push(toLog(document));
  });

  return logList;
};

export const toLog = (document: Models.Document): Log => {
  return {
    id: document.$id,
    log_time: document.log_time,
    isInside: document.isInside,
    user_info: toUserInfo(document.user_info),
    dep_prog: document.dep_prog,
  };
};

export const toLogItem = (logs: Log[]): ILogItem[] => {
  const uniqueUserInfoMap = new Map<string, User>();
  const logItem: ILogItem[] = [];

  logs.forEach((log) => {
    if (!uniqueUserInfoMap.has(log.user_info.id)) {
      uniqueUserInfoMap.set(log.user_info.id, log.user_info);
    }
  });

  const userList = Array.from(uniqueUserInfoMap.values());

  userList.forEach((user) => {
    const _logs: Log[] = [];
    _logs.push(...logs.filter((log) => log.user_info.id === user.id));
    logItem.push({
      id: user.id,
      name: user.name,
      user_info: user,
      logs: _logs,
    });
  });

  return logItem;
};
