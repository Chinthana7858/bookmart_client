
export interface SignUpFormData {
  name: string;
  email: string;
  password: string;
  address: string;
  role: string;
}

export interface SignInFormData {
  email: string;
  password: string;
}

export type User = {
  id: number;
  name: string;
  email: string;
  address: string;
  role: string;
};
