import dbConnect from '../../lib/dbConnect';
import Roles from '../../models/role.models';
import { CustomError } from '../../utils/error';


export const createRole = async(req:Request) =>{
    dbConnect()
        const { permissions, name } = await req.json();
        
        if(!permissions || !name) {
            console.log("role permissions and role name are required fields")
            throw new CustomError("role permissions and role name are required fields", 400)
        }

        const newRole = new Roles({
            name,
            permissions,
        });

        await newRole.save();
        return new Response(JSON.stringify({message:'Role created successfully', statusCode:200,success:true}))

}