import mongoose, { Schema, Document } from 'mongoose';

// Define the interface for a MeasuringUnit document
export interface IMeasuringUnit extends Document {
    Name: string;
    Description:string;
    IsActive: boolean;
    IsDeleted: boolean;
    CreatedById: mongoose.Schema.Types.ObjectId;  // Reference to the user/admin who created it
    LastUpdatedById: mongoose.Schema.Types.ObjectId;  // Reference to the user/admin who last updated it
}

// Define the MeasuringUnit schema
const MeasuringUnitSchema: Schema<IMeasuringUnit> = new mongoose.Schema({
    Name: {
        type: String,
        required: true,
        unique: true // Ensure the unit name is unique
    },
    Description: {
        type: String,
    },
    IsActive: {
        type: Boolean,
        default: true
    },
    IsDeleted: {
        type: Boolean,
        default: false
    },
    CreatedById: {
        type: mongoose.Schema.Types.ObjectId,
        required: true // Reference to the user/admin who created the unit
    },
    LastUpdatedById: {
        type: mongoose.Schema.Types.ObjectId,
        required: true // Reference to the user/admin who last updated the unit
    }
}, {
    timestamps: true  // Automatically add createdAt and updatedAt fields
});

// Create or retrieve the MeasuringUnit model
const MeasuringUnit = mongoose.models.MeasuringUnit || mongoose.model<IMeasuringUnit>('MeasuringUnit', MeasuringUnitSchema);

export default MeasuringUnit;
