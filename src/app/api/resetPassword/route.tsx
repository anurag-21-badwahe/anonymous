import dbConnect from '@/lib/dbConnect';
import UserModel from '@/models/Usermsg';  // Ensure this path is correct
import { sendResetPasswordEmail } from '@/helpers/sendResetPasswordEmail';

export async function POST(request: Request) {
  await dbConnect();

  try {
    const { email } = await request.json();
    // console.log("Received email:", email);
    // console.log("Received username:", username);

    // Find the user by email and username and ensure they are verified
    const existingUser = await UserModel.findOne({ email,isVerified: true });

    const username = existingUser?.username || ""

    if (!existingUser) {
      return new Response(
        JSON.stringify({
          success: false,
          message: 'User not found or not verified.',
        }),
        { status: 404 }
      );
    }

    // Generate a reset password code
    const resetPasswordCode = Math.floor(100000 + Math.random() * 900000).toString();

    // Set an expiration date for the reset code (1 hour from now)
    const expiryDate = new Date();
    expiryDate.setHours(expiryDate.getHours() + 1);

    // Update the user document with the reset code and expiration date
    existingUser.resetPasswordCode = resetPasswordCode;
    existingUser.resetPasswordCodeExpiry = expiryDate;

    await existingUser.save();

    // Send the reset password email
    const emailResponse = await sendResetPasswordEmail(email,username,resetPasswordCode);

    if (!emailResponse.success) {
      return new Response(
        JSON.stringify({
          success: false,
          message: emailResponse.message,
        }),
        { status: 500 }
      );
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Reset password email sent successfully.',
        username
      }),
      { status: 200 }
    );

  } catch (error) {
    console.error('Error resetting password:', error);
    return new Response(
      JSON.stringify({
        success: false,
        message: 'Error resetting password.',
      }),
      { status: 500 }
    );
  }
}
