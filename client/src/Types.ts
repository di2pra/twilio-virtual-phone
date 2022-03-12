import { Call } from "@twilio/voice-sdk";

export type CallMetadata = {
  type: Call.CallDirection;
  from: string;
  to: string;
  status: string;
}

export interface IAppPhoneNumber {
  phone_id: number;
  alias: string;
  number: string;
  created_on: Date;
}

export interface IMessage {
  message_id: number;
  from_number: string;
  from_phone_id: number | null;
  to_number: string;
  to_phone_id: number | null;
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

export type IPhoneNumber = IAppPhoneNumber & ITwilioPhoneNumber;