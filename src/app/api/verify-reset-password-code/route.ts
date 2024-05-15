import dbConnect from '@/lib/dbConnect';
import UserModel from '@/models/Usermsg';

export async function POST(request: Request) {
  // Connect to the database
  await dbConnect();

  try {
    const { username, code } = await request.json();
    // console.log("Username",username)
    const decodedUsername = decodeURIComponent(username);
    const user = await UserModel.findOne({ username: decodedUsername });

    if (!user) {
      return Response.json(
        { success: false, message: 'User not found' },
        { status: 404 }
      );
    }

    // Check if the code is correct and not expired
    const isCodeValid = user.resetPasswordCode === code;
    const resetPasswordCodeExpiry = user.resetPasswordCodeExpiry;
    const isCodeNotExpired = new Date() < new Date(resetPasswordCodeExpiry);
    // console.log(resetPasswordCodeExpiry);
    

    if (isCodeValid && isCodeNotExpired) {
      // Update the user's verification status
      user.isVerified = true;
      await user.save();

      return Response.json(
        { success: true, message: 'OTP Matched Successfully successfully' },
        { status: 200 }
      );
    } else if (!isCodeNotExpired) {
      // Code has expired
      return Response.json(
        {
          success: false,
          message:
            'Reset Password code has expired. Please resubmit to get a new code.',
        },
        { status: 400 }
      );
    } else {
      // Code is incorrect
      return Response.json(
        { success: false, message: 'Incorrect reset password code' },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error('Error matching otp user:', error);
    return Response.json(
      { success: false, message: 'Error matching otp user' },
      { status: 500 }
    );
  }
}