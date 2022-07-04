import { Call } from "@twilio/voice-sdk";

export type CallMetadata = {
  type: Call.CallDirection;
  from: string;
  to: string;
  status: string;
}

export interface IMessage {
  message_id: number;
  from_number: string;
  from_sid: string | null;
  to_number: string;
  to_sid: string | null;
  body: string;
  created_on: Date;
}

export interface IConversation {
  contact_number: string;
  body: string;
  created_on: Date;
}

export interface ICall {
  call_id: number;
  from_number: string;
  from_phone_id: number | null;
  to_number: string;
  to_phone_id: number | null;
  created_on: Date;
}

export interface IConfig {
  twimlApp: IApplication;
}

export interface IApplication {
  friendlyName: string;
  dateCreated: Date;
  voiceUrl: string;
  smsUrl: string;
  dateUpdated: Date;
  sid: string;
}

export interface ITwilioPhoneNumber {
  friendlyName: string;
  phoneNumber: string;
  dateCreated: Date;
  dateUpdated: Date;
  smsApplicationSid: string;
  voiceApplicationSid: string;
  sid: string;
}

export interface IUser {
  name: string;
  email: string;
}

export interface IAccount {
  account_id: number;
  username: string;
  account_sid: string;
  api_key: string;
  api_secret: string;
  twiml_app_sid: string;
  created_on: Date;
  updated_on: Date;
}