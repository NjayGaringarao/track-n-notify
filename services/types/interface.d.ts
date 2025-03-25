import { SecurityInfo, AdminInfo, StudentInfo } from "./model";

export interface ISignUp {
  role: string;
  role_info: StudentInfo | AdminInfo | SecurityInfo;
  name: [string, string?, string];
  email: string;
  password: string;
}
