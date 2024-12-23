import dbConnect from '../../../lib/dbConnect';
import Country from '../../../models/location.models';


export const addCity = async(req:Request) =>{
    dbConnect()
    const { stateId, cityName } = await req.json();

    // Validate input
    if (!stateId || !cityName) {
        // return res.status(400).json({ success: false, message: 'Country ID and State Name are required' });
        return new Response(JSON.stringify({message:'State ID and City Name are required', statusCode:400,success:false}));
    }

    try {
        // Find the country by ID
        const country = await Country.findOne({ 'states._id': stateId });

        if (!country) {
            // return res.status(404).json({ success: false, message: 'Country not found' });
            return new Response(JSON.stringify({message:'State not found', statusCode:400,success:false}));
        }

        // Find the state within the country's states array
        const state = country.states.id(stateId);

        if (!state) {
            // return res.status(404).json({ success: false, message: 'State not found' });
            return new Response(JSON.stringify({message:'State not found', statusCode:400,success:false}));
        }

        // Check if the city already exists
        const cityExists = state.cities.some((city:any) => city.name.toLowerCase() === cityName.toLowerCase());
        if (cityExists) {
            // return res.status(400).json({ success: false, message: 'City already exists' });
            return new Response(JSON.stringify({message:'City already exists', statusCode:400,success:false}));
        }

        // Add the new city to the state's cities array
        state.cities.push({ name: cityName, areas: [] });
        await country.save();

        // return res.status(201).json({
        //     success: true,
        //     message: 'City added successfully',
        //     country,
        // });
        return new Response(JSON.stringify({
            success: true,
            message: 'City added successfully',
            country,
        }));
    } catch (error) {
        console.error(error);
        // return res.status(500).json({ success: false, message: 'Server error', error });
        return new Response(JSON.stringify({message:'Server error ',error, statusCode:500,success:false}));
    }
}