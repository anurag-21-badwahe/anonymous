import { Message } from "@/modals/Usermsg";

export interface ApiResponse {
  success: boolean;
  message: string;
  isAcceptingMessages?: boolean; // ? shows optional
  messages?: Array<Message>
};