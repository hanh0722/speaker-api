import { Types, Document } from 'mongoose';

export interface AddressInfoUser {
  place: string;
  full_name: string;
  phone_number: string;
  address: string;
  city: string;
  zip_code: string;
  country: string;
}
export interface AddressUser extends AddressInfoUser {
  is_default: boolean;
}
export interface AddressHandler {
  object_id: Types.ObjectId,
  info: AddressUser
}