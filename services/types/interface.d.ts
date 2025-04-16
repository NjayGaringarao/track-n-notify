import { SecurityInfo, AdminInfo, StudentInfo, Log, User } from "./model";

export interface ISignUp {
  role: string;
  role_info: StudentInfo | AdminInfo | SecurityInfo;
  name: [string, string?, string];
  email: string;
  password: string;
}

export interface ILogItem {
  id: string;
  name: [string, string?, string];
  user_info: User;
  logs: Log[];
}
