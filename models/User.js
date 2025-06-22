import mongoose from 'mongoose'

const UserSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, default: "user" },
    accessCodeUsed: { type: mongoose.Schema.Types.ObjectId, ref: 'AccessCode', default: null }
})

export const User = mongoose.models.User || mongoose.model('User', UserSchema)