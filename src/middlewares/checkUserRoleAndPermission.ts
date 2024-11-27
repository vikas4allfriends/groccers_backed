import jwt from 'jsonwebtoken';
import User from '../models/user.models'; // Adjust path to your User model
import mongoose from 'mongoose';
import dbConnect from '../lib/dbConnect';

export const checkUserRoleAndPermission = (requiredRoles: string[] = [], requiredPermissions: string[] = []) => {
    return async (req: Request) => {
        try {
            await dbConnect();
            const authHeader = req.headers.get('authorization');
            if (!authHeader || !authHeader.startsWith('Bearer ')) {
                return new Response(JSON.stringify({ message: 'Access token is missing' }), { status: 401 });
            }

            const token = authHeader.split(' ')[1];
            const decodedToken: any = jwt.verify(token, process.env.JWT_SECRET);

            // Extract user ID from token payload
            const userId = decodedToken.id;

            // Use aggregation pipeline to fetch user with role and permissions
            const users = await User.aggregate([
                { $match: { _id: new mongoose.Types.ObjectId(userId) } },
                {
                    $lookup: {
                        from: 'roles',
                        localField: 'role',
                        foreignField: '_id',
                        as: 'roleData',
                    },
                },
                { $unwind: '$roleData' },
                {
                    $lookup: {
                        from: 'permissions',
                        localField: 'roleData.permissions',
                        foreignField: '_id',
                        as: 'permissionsData',
                    },
                },
            ]);

            const user = users[0];
            if (!user) {
                return new Response(JSON.stringify({ message: 'User not found or unauthorized' }), { status: 401 });
            }

            // Check if user has a role
            if (!user.roleData || !user.roleData.name) {
                return new Response(JSON.stringify({ message: 'Forbidden: User has no assigned role' }), { status: 403 });
            }

            // Check if requiredRoles is provided (non-empty array) and if user's role matches any of the required roles
            if (requiredRoles.length > 0 && !requiredRoles.includes(user.roleData.name)) {
                return new Response(JSON.stringify({ message: 'Forbidden: Insufficient role' }), { status: 403 });
            }

            // Check if user's permissions contain at least one required permission (if permissions are required)
            const userPermissions = user.permissionsData.map((perm: any) => perm.name);
            // console.log('userPermissions===', userPermissions)
            const hasPermission = requiredPermissions.length === 0 || requiredPermissions.some(permission => userPermissions.includes(permission));

            if (!hasPermission) {
                return new Response(JSON.stringify({ message: 'Forbidden: Insufficient permissions' }), { status: 403 });
            }

            // If all checks pass, return the user object
            return { user };

        } catch (error) {
            console.error('Error in role/permission check:', error);
            return new Response(JSON.stringify({ message: 'Invalid token or unauthorized' }), { status: 401 });
        }
    };
};
