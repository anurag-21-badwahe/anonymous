import dbConnect from '@/lib/dbConnect';
import UserModel from '@/models/Usermsg';
import bcrypt from 'bcryptjs';

export async function POST(request: Request) {
  // Connect to the database
  await dbConnect();

  try {
    const { username, newPassword } = await request.json();
    const decodedUsername = decodeURIComponent(username);
    const user = await UserModel.findOne({ username: decodedUsername });

    if (!user) {
      return Response.json(
        { success: false, message: 'User not found' },
        { status: 404 }
      );
    }

    // Update the user's password
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();

    return Response.json(
      { success: true, message: 'Password updated successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error updating password:', error);
    return Response.json(
      { success: false, message: 'Error updating password' },
      { status: 500 }
    );
  }
}
