import mongoose from 'mongoose'

const AccessCodeSchema = new mongoose.Schema({
  code: { type: String, required: true, unique: true },
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  usedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
  createdAt: { type: Date, default: Date.now }
})

export const AccessCode = mongoose.models.AccessCode || mongoose.model('AccessCode', AccessCodeSchema)