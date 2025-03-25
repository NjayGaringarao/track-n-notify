export type StudentInfo = {
  id: string;
  dep_prog: string;
  year_level: string;
};

export type AdminInfo = {
  id: string;
  department: string;
};

export type SecurityInfo = {
  id: string;
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
  address: [string?, string?, string?, string?];
  dob: Date;
};
