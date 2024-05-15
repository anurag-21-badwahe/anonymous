import { Message } from "@/models/Usermsg";

export interface ApiResponse {
  success: boolean;
  message: string;
  isAcceptingMessages?: boolean; // ? shows optional
  messages?: Array<Message>
};