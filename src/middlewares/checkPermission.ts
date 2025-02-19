import { NextResponse } from 'next/server';
import User from '../models/user.models';
import Role from '../models/Role';
import Permission from '../models/UserPermission';
import userModel from '../models/user.models';
import dbConnect from '../lib/dbConnect';
import mongoose from 'mongoose';

export const checkPermission = async (req: Request) => {
  await dbConnect()
  // console.log('request=======', req)
  const { userId, permissionName } = await req.json(); // Extract userId from the request body
  console.log('userId==', userId)
  try {
    console.log('in try')
    // Fetch the user and populate their role and permissions
    // const user = userModel.findById(userId.toString())
    // .populate({
    //   path: 'role',
    //   populate: { path: 'permissions' }  // Populates both role and its permissions
    // })

    const user = await User.aggregate([
      // Match the user by userId
      { $match: { _id: new mongoose.Types.ObjectId(userId) } },

      // Lookup the role associated with the user
      {
        $lookup: {
          from: 'roles', // The 'roles' collection (make sure the collection name is correct)
          localField: 'role', // The field in 'users' that refers to 'role'
          foreignField: '_id', // The field in 'roles' that matches the 'role' field in 'users'
          as: 'role'
        }
      },

      // Unwind the role array to get a single document
      { $unwind: '$role' },

      // // Lookup permissions associated with the role
      {
        $lookup: {
          from: 'permissions', // The 'permissions' collection
          localField: 'role.permissions', // The 'permissions' field in 'role' which is an array
          foreignField: '_id', // The field in 'permissions' that matches the role's permission IDs
          as: 'role.permissions'
        }
      },

      // Project (shape) the resulting data, returning only the needed fields
      {
        $project: {
          _id: 1,
          role: 1, // Include role and its permissions
        }
      }
    ]);

    // console.log('user===', user)
    if (!user || user.length === 0 || !user[0].role) {
      return NextResponse.json({ message: 'Access denied. User not found or no role assigned to user.' }, { status: 403 });
    }

    const hasPermission = user[0].role.permissions.some(permission => {
      // console.log('permission.name===', permission.name === permissionName)
      return permission.name === permissionName
    });
    // console.log('hasPermission===', hasPermission, permissionName)
    if (!hasPermission) {
      return NextResponse.json({ message: 'Access denied. You do not have the required permission.' }, { status: 403 });
    }

    // Return true if the user has the required permission
    return {success:true, user:user[0]};

  } catch (error) {
    // Handle server errors
    return NextResponse.json({ message: 'Server error', error: error.message }, { status: 500 });
  }
};
