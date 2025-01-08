import dbConnect from '../../../lib/dbConnect';
import Country from '../../../models/location.models';


export const addCountry = async(req:Request) =>{
    await dbConnect()
    const { countryName } = await req.json();
        console.log('countryName===', countryName)
        // Validate input
        if (!countryName) {
            // return res.status(400).json({ success: false, message: 'Country name is required' });
            return new Response(JSON.stringify({message:'Country name is required', statusCode:400,success:false}));
        }

        try {
            // Check if the country already exists
            const existingCountry = await Country.findOne({ name: countryName });
            if (existingCountry) {
                // return res.status(400).json({ success: false, message: 'Country already exists' });
                return new Response(JSON.stringify({message:'Country already exists', statusCode:400,success:false}));
            }

            // Create a new country
            const newCountry = await Country.create({ name: countryName, states: [] });

            return new Response(JSON.stringify({
                success: true,
                message: 'Country added successfully',
                country: newCountry,
            }));
        } catch (error) {
            console.error(error);
            return new Response(JSON.stringify({message:'Server error', statusCode:500,success:false}));
        }
}