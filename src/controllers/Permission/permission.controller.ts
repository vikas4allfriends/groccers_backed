import dbConnect from '../../lib/dbConnect';
import Permissions from '../../models/userPermissions.models';
import { CustomError } from '../../utils/error';

export const Permission = async (req: Request) => {
    dbConnect()
    try {
        const { description, name } = await req.json();
        const newPermissions = new Permissions({
            name,
            description,
        });

        await newPermissions.save();
        return new Response(JSON.stringify({ status: "success", message: "Permission created successfully", statusCode: 200 }))
    } catch (error) {
        throw new CustomError("Error while creating permission", 400)
    }
}