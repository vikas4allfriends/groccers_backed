import dbConnect from '../../lib/dbConnect';
import Otp from '../../models/otp.models';
import userModel from '../../models/user.models';
import { CustomError } from '../../utils/error';
import crypto from 'crypto';  // Used to generate a secure OTP

export const generateOtp = async (req: Request) => {
    dbConnect()
    const { mobileNumber } = await req.json();

    if (!mobileNumber) {
      return new Response(JSON.stringify({ success: true, message: 'Phone number is required', statusCode: 400 })); // Return a resolved promise
    }

    try {
      // 1. Generate a 6-digit OTP
      const otp = crypto.randomInt(100000, 999999).toString();

      // 2. Define the OTP expiration time (e.g., 5 minutes from now)
      const expiresAt = new Date();
      expiresAt.setMinutes(expiresAt.getMinutes() + 50);  // Set expiration time to 5 minutes in the future

      // 3. Check if an OTP already exists for this phone number, and remove it
      await Otp.deleteOne({ mobileNumber });

      // 4. Create a new OTP record and save it to the database
      const newOtp = new Otp({
        mobileNumber,
        otp,
        expiresAt,
      });

      await newOtp.save();

      // 5. Return success message (you can integrate SMS sending here later)
      // res.status(200).json({ 
      //   message: 'OTP generated successfully',
      //   otp,  // For development purposes, return the OTP (in production, do not expose the OTP!)
      // });
      return new Response(JSON.stringify({ success: true, message: 'OTP generated successfully', statusCode: 200, data:otp })); // Return a resolved promise
    } catch (error) {
      throw new CustomError( 'Error generating OTP', 500 );
    }
}  

export const verifyOtp = async (req: Request) => {
    dbConnect()
    const { mobileNumber, otp, appName, firstName } = await req.json();

    if (!mobileNumber || !otp) {
        // return res.status(400).json({ message: 'Phone number and OTP are required' });
        return new Response(JSON.stringify({ success: true, message: 'Phone number and OTP are required', statusCode: 200 })); // Return a resolved promise
    }

    try {
        // 1. Verify the OTP using the mobileNumber
        const otpRecord = await Otp.findOne({
            mobileNumber,
            otp,
            expiresAt: { $gt: new Date() },  // Ensure OTP is not expired
        });

        if (!otpRecord) {
            // return res.status(400).json({ message: 'Invalid or expired OTP' });
            return new Response(JSON.stringify({ success: true, message: 'Invalid or expired OTP', statusCode: 200 })); // Return a resolved promise
        }

        // 2. Check if a user profile exists for the phone number
        let user = await userModel.findOne({ mobileNumber });
        let role = appName==="UserApp" && "670e9e162e9fdbc45821253a";
        // console.log('user===', user, appName, role, mobileNumber)
        if (!user) {
            // 3. If user does not exist, create a new user with the mobileNumber
            console.log('user is ', user, typeof(mobileNumber))
            // await userModel.create({ mobileNumber, role, firstName });
            
            // let savedUser = await newUser.save();
            // console.log('create user==', savedUser)
            try {
                const newUser = new userModel({
                    mobileNumber,
                    role
                })
                let savedUser = await newUser.save();
                console.log('User saved successfully:', savedUser);
            } catch (err) {
                // console.error('Error saving user:', err);
                throw new CustomError(err,400)
            }
        } else {
            // 4. If user exists, update the mobileNumber (if necessary)
            console.log('first')
            user.mobileNumber = mobileNumber;
            user.role = role;
            await user.save();
        }

        // 5. Respond with the updated user profile
        return new Response(JSON.stringify({ success: true, message: 'OTP verified and phone number updated successfully', statusCode: 200 })); // Return a resolved promise
        // Optionally, delete the OTP after successful verification
        // await Otp.deleteOne({ _id: otpRecord._id });

    } catch (error) {
        // res.status(500).json({ message: 'Error verifying OTP', error });
        throw new CustomError('Error verifying OTP', 500)
    }
}


 
