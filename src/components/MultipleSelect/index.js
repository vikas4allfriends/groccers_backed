//import liraries
import * as React from 'react';
import Chip from '@mui/material/Chip';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';

// create a component
const MultipleSelect = ({ options, setFieldValue, selectedValues  }) => {
    console.log('MultipleSelect options==', options)

    const handleChange = (event, newValue) => {
        console.log('handleChange newValue--', newValue)
        setFieldValue("permissions", newValue); // Update Formik state
    };

    return (
        <Autocomplete
            multiple
            id="tags-outlined"
            options={options || []}
            value={selectedValues} // Controlled component
            getOptionLabel={(option) => option.label}
            // defaultValue={options.length > 0 ? [options[0]] : []}
            onChange={handleChange}
            // filterSelectedOptions
            renderInput={(params) => (
                <TextField
                    {...params}
                    label="filterSelectedOptions"
                    placeholder="Permissions"
                    size='small'
                />
            )}
        />
    );
};

//make this component available to the app
export default React.memo(MultipleSelect);
