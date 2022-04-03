export interface UserRequest {
  username: string;
  password: string;
  phone: string;
  email: string;
  validate_info: string;
  name: string;
  role: "admin" | "user";
  otp: number;
  info: string
}

export interface UserHandler {
  _id: string;
  username: string;
  name: string;
  password: string;
  role: "admin" | "user";
  is_validation: boolean;
  createdAt: string;
  updatedAt: string;
  validate_info?: {
    otp?: number | string;
    token_email?: string;
    time_expiration: number;
  };
  info: string;
  _doc: UserHandler;
}
