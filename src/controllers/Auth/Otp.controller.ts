import dbConnect from '../../lib/dbConnect';
import Otp from '../../models/otp.models';
import userModel from '../../models/user.models';
import { CustomError } from '../../utils/error';
import crypto from 'crypto';  // Used to generate a secure OTP
import jwt from 'jsonwebtoken';

// import bcrypt from 'bcryptjs';

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
        return new Response(JSON.stringify({ success: true, message: otp, statusCode: 200 })); // Return a resolved promise
    } catch (error) {
        throw new CustomError('Error generating OTP', 500);
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
        let role = "670e9e162e9fdbc45821253a";
        // console.log('user===', user, appName, role, mobileNumber)

        if (!user) {
            // 3. If user does not exist, create a new user with the mobileNumber
            console.log('user is ', user, typeof (mobileNumber))
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
                throw new CustomError(err, 400)
            }
        }
        console.log('user==', user)
        const users = await userModel.aggregate([
            { $match: { mobileNumber } }, // Match user by username
            {
                $lookup: {
                    from: 'roles', // Collection name for the Role model
                    localField: 'role', // Field in the User collection
                    foreignField: '_id', // Field in the Role collection
                    as: 'roleData', // Output array field
                },
            },
            {
                $unwind: { path: '$roleData', preserveNullAndEmptyArrays: true }, // Unwind roleData
            },
            {
                $lookup: {
                    from: 'permissions', // Collection name for the Permission model
                    localField: 'roleData.permissions', // Field in the Role collection
                    foreignField: '_id', // Field in the Permission collection
                    as: 'permissionsData', // Output array field
                },
            },
        ]);

        const userObj = users[0]; // Get the first (and ideally only) user
        const payload = {
            id: userObj._id,
            // username: user.username,
            role: userObj.roleData.name, // Ensure role is populated
            permissions: userObj.permissionsData.map((perm: any) => perm.name), // Extract permission names
        };

        // Generate the JWT token
        const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '24h' });
        // Return success response with token and user info

        // 5. Respond with the updated user profile
        return new Response(
            JSON.stringify({
                message: 'Login successful',
                authToken:token,
                user: {
                    id: userObj._id,
                    // username: user.username,
                    role: userObj.roleData.name,
                    permissions: userObj.permissionsData.map((perm: any) => perm.name),
                },
                status:true
            }),
            { status: 200, headers: { 'Content-Type': 'application/json' } }
        );

    } catch (error) {
        // res.status(500).json({ message: 'Error verifying OTP', error });
        throw new CustomError('Error verifying OTP ' + error, 500)
    }
}




