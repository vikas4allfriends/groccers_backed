import dbConnect from '../../../lib/dbConnect';
import Country from '../../../models/location.models';


export const addState = async(req:Request) =>{
    dbConnect()
    const { countryId, stateName } = await req.json();

    // Validate input
    if (!countryId || !stateName) {
        // return res.status(400).json({ success: false, message: 'Country ID and State Name are required' });
        return new Response(JSON.stringify({message:'Country ID and State Name are required', statusCode:400,success:false}));
    }

    try {
        // Find the country by ID
        const country = await Country.findById(countryId);

        if (!country) {
            // return res.status(404).json({ success: false, message: 'Country not found' });
            return new Response(JSON.stringify({message:'Country not found', statusCode:400,success:false}));
        }

        // Check if the state already exists
        const stateExists = country.states.some((state) => state.name.toLowerCase() === stateName.toLowerCase());
        if (stateExists) {
            // return res.status(400).json({ success: false, message: 'State already exists' });
            return new Response(JSON.stringify({message:'State already exists', statusCode:400,success:false}));
        }

        // Add the new state
        country.states.push({ name: stateName, cities: [] });
        await country.save();

        // return res.status(201).json({ success: true, message: 'State added successfully', country });
        return new Response(JSON.stringify({message:'State added successfully', country, statusCode:201,success:true}));
    } catch (error) {
        console.error(error);
        // return res.status(500).json({ success: false, message: 'Server error', error });
        return new Response(JSON.stringify({message:'Server error', statusCode:500,success:false}));
    }
}