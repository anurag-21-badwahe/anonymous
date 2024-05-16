import { Message } from "@/models/Usermsg";

export interface ApiResponse {
  success: boolean;
  message: string;
  username:string;
  isAcceptingMessages?: boolean; // ? shows optional
  messages?: Array<Message>
};