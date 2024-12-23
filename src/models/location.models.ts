import mongoose from 'mongoose';

const LocalitySchema = new mongoose.Schema({
    name: { type: String, required: true }, // Only name field for localities
});

const CitySchema = new mongoose.Schema({
    name: { type: String, required: true },
    localities: [LocalitySchema],
    isActive: { type: Boolean, default: true },
});

const StateSchema = new mongoose.Schema({
    name: { type: String, required: true },
    cities: [CitySchema],
    isActive: { type: Boolean, default: true },
});

const CountrySchema = new mongoose.Schema({
    name: { type: String, required: true },
    states: [StateSchema],
    isActive: { type: Boolean, default: true },
});

export default mongoose.models.Country || mongoose.model('Country', CountrySchema);
