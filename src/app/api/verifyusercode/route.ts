import dbConnect from "@/lib/dbConnect";
import UserModel from "@/modals/Usermsg";
import { z } from "zod";

const VerifyCodeSchema = z.object({
  username: z.string(),
  code: z.string(),
});

export async function POST(request: Request) {
  await dbConnect();

  try {
   // Parse the request body
   const requestBody = await request.json();
        
   // Validate the request body against the schema
   const validationResult = VerifyCodeSchema.safeParse(requestBody);

   // Check if validation succeeded
   if (!validationResult.success) {
       // If validation fails, return a 400 response with error details
       return new Response(
           JSON.stringify({ success: false, message: 'Invalid request body', errors: validationResult.error.errors }),
           { status: 400, headers: { 'Content-Type': 'application/json' } }
       );
   }

   // Destructure the validated data
   const { username, code } = validationResult.data;
    const decodedUsername = decodeURIComponent(username);
    const user = await UserModel.findOne({ username: decodedUsername });

    if (!user) {
      return Response.json(
        {
          success: false,
          message: "User Not Found",
        },
        { status: 500 }
      );
    }

    const isCodeValid = user.verifyCode === code;
    const isCodeNotExpired = new Date(user.verifyCodeExpiry) > new Date();

    if (isCodeValid && isCodeNotExpired) {
      // Update the user's verification status
      user.isVerified = true;
      await user.save();

      return Response.json(
        { success: true, message: "Account verified successfully" },
        { status: 200 }
      );
    } else if (!isCodeNotExpired) {
      // Code has expired
      return Response.json(
        {
          success: false,
          message:
            "Verification code has expired. Please sign up again to get a new code.",
        },
        { status: 400 }
      );
    } else {
      // Code is incorrect
      return Response.json(
        { success: false, message: "Incorrect verification code" },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error("Error Verifying User", error);
    return Response.json(
      {
        success: false,
        message: "Error Verifying User",
      },
      { status: 500 }
    );
  }
}
