import dbConnect from '../../lib/dbConnect';
import Country from '../../models/location.models';
import { CustomError } from '../../utils/error';


export const addServiceArea = async (req: Request) => {
    dbConnect()
    const { countryName, stateName, cityName, areaName } = await req.json();

    if (!countryName || !stateName || !cityName || !areaName) {
        return new Response(JSON.stringify({ message: 'All fields are required', statusCode: 400, success: false }));
    }

    try {
        // Find the country
        const country = await Country.findOne({ name: countryName });
        if (!country) return new Response(JSON.stringify({ message: 'Country not found', statusCode: 404, success: false }));

        // Find the state within the country
        const state = country.states.find((state: any) => state.name === stateName);
        if (!state) return new Response(JSON.stringify({ message: 'State not found', statusCode: 404, success: false }));

        // Find the city within the state
        const city = state.cities.find((city: any) => city.name === cityName);
        if (!city) return new Response(JSON.stringify({ message: 'City not found', statusCode: 404, success: false }));
        // return res.status(404).json({ success: false, message: 'City not found' });


        // Check if the area already exists
        const areaExists = city.areas.some((area: any) => area.name === areaName);
        if (areaExists) {
            // return res.status(400).json({ success: false, message: 'Area already exists' });
            return new Response(JSON.stringify({ message: 'Area already exists', statusCode: 400, success: false }))
        }

        // Add the new area
        city.areas.push({ name: areaName });
        await country.save();

        return new Response(JSON.stringify({ message: 'Area added successfully', statusCode: 200, success: true }))
    } catch (error) {
        console.error(error);
        // return res.status(500).json({ success: false, message: 'Server error' });
        return new Response(JSON.stringify({ message: 'Server error', statusCode: 500, success: false }))
    }
}