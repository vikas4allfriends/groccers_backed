import dbConnect from '../../lib/dbConnect';
import Country from '../../models/location.models';
import { type NextRequest } from 'next/server'

export const fetchAllCountries = async (req: Request) => {
  try {
    await dbConnect();
    const countries = await Country.find({ isActive: true }).select('_id name');
    return new Response(JSON.stringify({ success: true, data: countries }), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ success: false, message: 'Error fetching countries', error: error.message }), { status: 500 });
  }
}

export const fetchStatesByCountryId = async (req: NextRequest) => {
  // const { countryId } = await req.json();
  // const { countryId, stateName } = await req.query;
  const searchParams = req.nextUrl.searchParams
  const countryId = searchParams.get('countryId')
  console.log('countryId===', countryId)
  try {
    await dbConnect();
    const country = await Country.findById(countryId).select('states');
    if (!country) {
      return new Response(JSON.stringify({ success: false, message: 'Country not found' }), { status: 404 });
    }
    const states = country.states.filter(state => state.isActive);
    return new Response(JSON.stringify({ success: true, data: states }), { status: 200 });
  } catch (error) {
    console.log('error==', error)
    return new Response(JSON.stringify({ success: false, message: 'Error fetching states', error: error.message }), { status: 500 });
  }
}

export const fetchCitiesByStateId = async (req: NextRequest) => {
  const searchParams = req.nextUrl.searchParams
  const countryName = searchParams.get('countryId')
  const stateName  = searchParams.get('stateName')
  // console.log('stateName==', stateName)
  try {
    // Find the country by name
    const country = await Country.findOne({ name: countryName }).select('states');
    if (!country) {
      return new Response(JSON.stringify({ success: false, message: 'Country not found' }), { status: 404 });
    }

    // Find the state by name within the country
    const state = country.states.find(state => state.name === stateName && state.isActive);
    if (!state) {
      return new Response(JSON.stringify({ success: false, message: 'State not found' }), { status: 404 });
    }

    // Filter active cities within the state
    const cities = state.cities.filter(city => city.isActive);
    return new Response(JSON.stringify({ success: true, data: cities }), { status: 200 });
  } catch (error) {
    return new Response(
      JSON.stringify({
        success: false,
        message: 'Error fetching cities',
        error: error.message,
      }),
      { status: 500 }
    );
  }
}

export const fetchLocalitiesByCityId = async (req: NextRequest) => {
  // const { countryId, stateName, cityName } = await req.json();
  const searchParams = req.nextUrl.searchParams
  const countryName = searchParams.get('countryId')
  const stateName  = searchParams.get('stateName')
  const cityName  = searchParams.get('cityName')

  try{
    // Find the country by name
    const country = await Country.findOne({ name: countryName }).select('states');
    if (!country) {
      return new Response(JSON.stringify({ success: false, message: 'Country not found' }), { status: 404 });
    }

    // Find the state by name within the country
    const state = country.states.find(state => state.name === stateName && state.isActive);
    if (!state) {
      return new Response(JSON.stringify({ success: false, message: 'State not found' }), { status: 404 });
    }

    // Find the city by name within the state
    const city = state.cities.find(city => city.name === cityName && city.isActive);
    if (!city) {
      return new Response(JSON.stringify({ success: false, message: 'City not found' }), { status: 404 });
    }

    // Filter active localities within the city
    const localities = city.localities.filter(locality => locality.isActive !== false);

    return new Response(JSON.stringify({ success: true, data: localities }), { status: 200 });
  } catch (error) {
    return new Response(
      JSON.stringify({
        success: false,
        message: 'Error fetching localities',
        error: error.message,
      }),
      { status: 500 }
    );
  }
}