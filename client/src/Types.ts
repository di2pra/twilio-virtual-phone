import { Call } from "@twilio/voice-sdk";

export type CallMetadata = {
  type: Call.CallDirection;
  from: string;
  to: string;
  status: string;
}