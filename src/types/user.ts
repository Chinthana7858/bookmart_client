
export interface SignUpFormData {
  name: string;
  email: string;
  password: string;
  phone_country_code?: string;
  phone_number?: string;
  birthday?: string;
  gender?: Gender | "";
  primary_address?: UserAddressInput;
}

export interface SignInFormData {
  email: string;
  password: string;
}

export type User = {
  id: number;
  name: string;
  email: string;
  address?: string | null;
  phone_country_code?: string | null;
  phone_number?: string | null;
  birthday?: string | null;
  gender?: Gender | null;
  role: "user" | "admin";
  addresses?: UserAddress[];
};

export type Gender =
  | "male"
  | "female"
  | "non_binary"
  | "prefer_not_to_say"
  | "other";

export type UserAddress = {
  id: number;
  user_id: number;
  label: string;
  recipient_name?: string | null;
  phone_country_code?: string | null;
  phone_number?: string | null;
  line1: string;
  line2?: string | null;
  city: string;
  state?: string | null;
  postal_code?: string | null;
  country: string;
  is_default: boolean;
  created_at: string;
  updated_at?: string | null;
};

export type UserAddressInput = {
  label: string;
  recipient_name?: string;
  phone_country_code?: string;
  phone_number?: string;
  line1: string;
  line2?: string;
  city: string;
  state?: string;
  postal_code?: string;
  country: string;
  is_default?: boolean;
};

export type UserProfileUpdate = {
  name: string;
  address?: string;
  phone_country_code?: string;
  phone_number?: string;
  birthday?: string;
  gender?: Gender | "";
};
