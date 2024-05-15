import { resend } from "@/lib/resend";
import ResetPasswordEmail from "../../emails/ResetPasswordEmail"
import { ApiResponse } from '@/types/ApiResponse';

export async function sendResetPasswordEmail(
  email: string,
  username: string,
  resetPasswordCode: string
): Promise<ApiResponse> { //return type
  try {
    await resend.emails.send({
      from: 'Acme <onboarding@resend.dev>', // for using  our personal choice email you have to verify your email through resend
      to: email,
      subject: 'Feedonymous Reset Password Code',
      react: ResetPasswordEmail({ username, otp: resetPasswordCode }),
    });
    return { success: true, message: 'Reset Password email sent successfully.' };
  } catch (emailError) {
    console.error('Error sending Reset Password  email:', emailError);
    return { success: false, message: 'Failed to send Reset Password  email.' };
  }
}