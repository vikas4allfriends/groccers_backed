import dbConnect from '../../../lib/dbConnect';
import Country from '../../../models/location.models';


export const addLocality = async(req:Request) =>{
    dbConnect()
    const { cityId, localityName   } = await req.json();

    // Validate input
    if (!cityId || !localityName ) {        // return res.status(400).json({ success: false, message: 'City ID and Area Name are required' });
        return new Response(JSON.stringify({message:'City ID and Locality Name are required', statusCode:400,success:false}));
    }

    try {
        // Find the country containing the city
        const country = await Country.findOne({ 'states.cities._id': cityId });

        if (!country) {
            return new Response(JSON.stringify({message:'City not found', statusCode:400,success:false}));
            // return res.status(404).json({ success: false, message: 'City not found' });
        }

        // Find the state containing the city
        const state = country.states.find((state:any) =>
            state.cities.some((city:any) => city._id.toString() === cityId)
        );

        if (!state) {
            return new Response(JSON.stringify({message:'City not found', statusCode:400,success:false}));
            // return res.status(404).json({ success: false, message: 'City not found' });
        }

        // Find the city within the state's cities array
        const city = state.cities.id(cityId);

        if (!city) {
            return new Response(JSON.stringify({message:'City not found', statusCode:400,success:false}));
            // return res.status(404).json({ success: false, message: 'City not found' });
        }

        // Check if the area already exists
        const areaExists = city.localities.some((locality:any) => locality.name.toLowerCase() === localityName.toLowerCase());
        if (areaExists) {
            return new Response(JSON.stringify({message:'Area already exists', statusCode:400,success:false}));
            // return res.status(400).json({ success: false, message: 'Area already exists' });
        }

        // Check if the locality already exists
        const localityExists = city.localities.some((locality:any) => locality.name.toLowerCase() === localityName.toLowerCase());
        if (localityExists) {
            return new Response(JSON.stringify({message:'Area already exists', statusCode:400,success:false}));
        }

        // Add the new locality to the city's localities array
        city.localities.push({ name: localityName });
        await country.save();

        // return res.status(201).json({
        //     success: true,
        //     message: 'Area added successfully',
        //     country,
        // });
        return new Response(JSON.stringify({
            success: true,
            message: 'Locality  added successfully',
            country,
        }));
    } catch (error) {
        console.error(error);
        return new Response(JSON.stringify({message:'Server error '+ error, statusCode:500,success:false}));
        // return res.status(500).json({ success: false, message: 'Server error', error });
    }
}