export type StudentInfo = {
  $id: string;
  dep_prog: string;
  year_level: string;
  guardian_name?: string;
  guardian_salutation?: string;
  guardian_cn?: string;
  isInside?: boolean;
};

export type AdminInfo = {
  $id: string;
  department: string;
};

export type SecurityInfo = {
  $id: string;
  type: string;
};

export type UserCredentials = {
  id: string;
  email: string;
  role: string;
};

export type User = {
  id: string;
  name: [string, string?, string];
  picture_id?: string;
  student_info?: StudentInfo;
  admin_info?: AdminInfo;
  security_info?: SecurityInfo;
};

export type Log = {
  id: string;
  log_time: Date;
  isInside: boolean;
  user_info: User;
  dep_prog: string;
};
