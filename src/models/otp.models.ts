import mongoose from 'mongoose';

const otpSchema = new mongoose.Schema({
  mobileNumber: {
    type: String,
    required: true,
    unique: false,  // Phone numbers may appear multiple times as OTPs are generated
  },
  otp: {
    type: String,
    required: true,
  },
  expiresAt: {
    type: Date,
    required: true,  // The OTP will expire at this date/time
  },
  createdAt: {
    type: Date,
    default: Date.now,  // The time when the OTP was created
    expires: 300,       // Optional: Set TTL (e.g., 5 minutes = 300 seconds) if you want automatic removal
  },
});

const Otp = mongoose.models.Otp || mongoose.model('Otp', otpSchema);
export default Otp;
