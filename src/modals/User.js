import mongoose from "mongoose"
const { Schema, model } = mongoose;

const userSchema = new Schema({
    username: {
        type: String,
        required: [true, "Username is required"],
        unique: true,
    },
    name: {
        type: String,
        required: [true, "Name is required"],
    },
    email: {
        type: String,
        required: [true, "Email is required"],
        unique: true,
    },
    profilepic: {
        type: String,
    },
    coverpic: {
        type: String,
    }
}, {
    timestamps: true 
});

const User = mongoose.models.users || mongoose.model("users", userSchema);

export default User;
