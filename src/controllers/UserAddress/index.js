import dbConnect from '../../lib/dbConnect';
import { checkUserRoleAndPermission } from '../../middlewares/checkUserRoleAndPermission';
import UserAddress from '../../models/UserAddress.models';

export const AddAddress = async (req) => {
    try {

        const roleCheck = await checkUserRoleAndPermission(['Admin', 'Customer'], ['AddItem', 'CancelOrder'])(req);

        if (roleCheck instanceof Response) {
            return roleCheck;
        }

        const UserId = roleCheck.user._id.toString(); // User ID from request params
        console.log('UserId--', UserId)


        const body = await req.json();
        const { fullName, mobileNumber, houseNumber, addressLine1, addressLine2, country, state, city, locality, street, pinCode, isDefault } = body;
        console.log(fullName, mobileNumber, houseNumber, addressLine1, addressLine2, country, state, city, locality, street, pinCode)
        if (!UserId || !fullName || !mobileNumber || !houseNumber || !addressLine1 || !country || !state || !city || !pinCode) {
            return new Response(
                JSON.stringify({ success: false, message: "All required fields must be provided." }),
                { status: 400 }
            );
        }

        // If isDefault is true, unset any existing default addresses for the user
        if (isDefault) {
            await Address.updateMany({ UserId }, { $set: { isDefault: false } });
        }

        // Check the existing addresses for the user
        const existingAddresses = await UserAddress.find({ UserId });

        const address = new UserAddress({
            UserId,
            fullName,
            mobileNumber,
            houseNumber,
            addressLine1,
            addressLine2,
            country,
            state,
            city,
            locality,
            street,
            pinCode,
            isDefault: existingAddresses.length === 0, // Set isDefault to true if this is the first address
        });

        const savedAddress = await address.save();
        return new Response(
            JSON.stringify({ success: true, message: "Address added successfully.", savedAddress }),
            { status: 201 }
        );
    } catch (error) {
        console.error("Error in Add Address API:", error);
        return new Response(
            JSON.stringify({ success: false, message: "Internal server error. " + error }),
            { status: 500 }
        );
    }
};

export async function UpdateAddress(request) {
    try {
        await dbConnect();

        const body = await request.json();
        const { addressId, fullName, mobileNumber, houseNumber, addressLine1, addressLine2, country, state, city, locality, street, pinCode, isDefault } = body;

        if (!addressId) {
            return new Response(
                JSON.stringify({ success: false, message: "Address ID is required." }),
                { status: 400 }
            );
        }

        // If isDefault is true, unset any existing default addresses for the user
        if (isDefault) {
            const address = await Address.findById(addressId);
            await Address.updateMany({ UserId: address.UserId }, { $set: { isDefault: false } });
        }

        const updatedAddress = await Address.findByIdAndUpdate(
            addressId,
            { fullName, mobileNumber, houseNumber, addressLine1, addressLine2, country, state, city, locality, street, pinCode, isDefault },
            { new: true }
        );

        return new Response(
            JSON.stringify({ success: true, message: "Address updated successfully.", updatedAddress }),
            { status: 200 }
        );
    } catch (error) {
        console.error("Error in Update Address API:", error);
        return new Response(
            JSON.stringify({ success: false, message: "Internal server error." }),
            { status: 500 }
        );
    }
}

export async function DeleteAddress(request) {
    try {
        await dbConnect();

        // const { searchParams } = new URL(request.url);
        // const addressId = searchParams.get("addressId");
        const addressId = await request.json();

        if (!addressId) {
            return new Response(
                JSON.stringify({ success: false, message: "Address ID is required." }),
                { status: 400 }
            );
        }

        await Address.findByIdAndDelete(addressId);

        return new Response(
            JSON.stringify({ success: true, message: "Address deleted successfully." }),
            { status: 200 }
        );
    } catch (error) {
        console.error("Error in Delete Address API:", error);
        return new Response(
            JSON.stringify({ success: false, message: "Internal server error." }),
            { status: 500 }
        );
    }
}

export async function GetAllAddress(req) {
    try {

        const roleCheck = await checkUserRoleAndPermission(['Admin', 'Customer'], ['AddItem', 'CancelOrder'])(req);

        if (roleCheck instanceof Response) {
            return roleCheck;
        }

        const userId = roleCheck.user._id.toString(); // User ID from request params
        console.log('userId--->>', userId)
        if (!userId) {
            return new Response(
                JSON.stringify({ success: false, message: "User ID is required." }),
                { status: 400 }
            );
        }

        // Fetch all addresses for the user
        const addresses = await UserAddress.find({ UserId: userId });
        console.log('addresses==', addresses)
        if (!addresses || addresses.length === 0) {
            return new Response(
                JSON.stringify({ success: true, message: "No addresses found for this user.", addresses: [] }),
                { status: 200 }
            );
        }

        return new Response(
            JSON.stringify({ success: true, addresses }),
            { status: 200 }
        );
    } catch (error) {
        console.error("Error in Get Addresses API:", error);
        return new Response(
            JSON.stringify({ success: false, message: "Internal server error." }),
            { status: 500 }
        );
    }
}
