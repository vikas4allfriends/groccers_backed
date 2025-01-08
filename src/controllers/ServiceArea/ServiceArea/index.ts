import dbConnect from '../../../lib/dbConnect';
import Country from '../../../models/location.models';
import ServiceArea from '../../../models/ServiceArea.models';


export const addServiceArea = async (req: Request) => {
    dbConnect()
    const { localityId, deliveryCharge } = await req.json();

    // Validate input
    if (!localityId || deliveryCharge === undefined || null) {
        return new Response(JSON.stringify({ message: 'Locality ID and Delivery Charge are required', statusCode: 400, success: false }));
    }

    try {
        // Validate if the localityId exists in the Country schema
        const country = await Country.findOne({ 'states.cities.localities._id': localityId });

        if (!country) {
            return new Response(JSON.stringify({ message: 'Locality not found', statusCode: 404, success: false }));
        }

        // Check if the service area already exists
        const existingServiceArea = await ServiceArea.findOne({ localityId });

        if (existingServiceArea) {
            // return res.status(400).json({
            //     success: false,
            //     message: 'Service Area for this locality already exists',
            // });
            return new Response(JSON.stringify({ message: 'Service Area for this locality already exists', statusCode: 400, success: false }));
        }

        // Create a new service area
        const serviceArea = await ServiceArea.create({
            localityId,
            deliveryCharge,
        });

        // return res.status(201).json({
        //     success: true,
        //     message: 'Service Area added successfully',
        //     serviceArea,
        // });
        return new Response(JSON.stringify({ message: 'Service Area added successfully', serviceArea, statusCode: 200, success: true }));
    } catch (error) {
        console.error(error);
        return new Response(JSON.stringify({ message: 'Server error ' + error, statusCode: 500, success: false }));
        // return res.status(500).json({ success: false, message: 'Server error', error });
    }
}

export const SearchServiceArea = async (req: Request) => {
    dbConnect()
    try {
        const serviceAreas = await ServiceArea.aggregate([
            {
                $lookup: {
                    from: 'countries', // Country collection
                    let: { localityId: '$localityId' },
                    pipeline: [
                        { $unwind: '$states' },
                        { $unwind: '$states.cities' },
                        { $unwind: '$states.cities.localities' },
                        {
                            $match: {
                                $expr: { $eq: ['$states.cities.localities._id', '$$localityId'] },
                            },
                        },
                        {
                            $project: {
                                country: '$name',
                                state: '$states.name',
                                city: '$states.cities.name',
                                locality: '$states.cities.localities.name',
                            },
                        },
                    ],
                    as: 'locationDetails',
                },
            },
            { $unwind: '$locationDetails' },
            {
                $project: {
                    country: '$locationDetails.country',
                    state: '$locationDetails.state',
                    city: '$locationDetails.city',
                    locality: '$locationDetails.locality',
                    deliveryCharge: '$deliveryCharge',
                },
            },
        ]);

        if (!serviceAreas.length) {
            return new Response(
                JSON.stringify({
                    success: false,
                    message: 'No service areas found',
                    statusCode: 404,
                }),
                { status: 404 }
            );
        }
        // console.log('serviceAreas===', serviceAreas)
        return new Response(
            JSON.stringify({
                success: true,
                serviceAreas,
                statusCode: 200,
            }),
            { status: 200 }
        );
    } catch (error) {
        console.error(error);
        return new Response(
            JSON.stringify({
                success: false,
                message: 'Server error',
                error: error.message,
                statusCode: 500,
            }),
            { status: 500 }
        );
    }
}
