import React from 'react';
import { FormControl, FormControlLabel, FormLabel, Radio, RadioGroup } from '@mui/material';
import { useAtom } from 'jotai';
import { CustomerEmailFilter, customerPageEmailFilterAtom } from '../../../store/Global';

export default function CustomerPageEmailFilter() {
    const [emailFilter, setEmailFilter] = useAtom(customerPageEmailFilterAtom);

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setEmailFilter(event.target.value as CustomerEmailFilter);
    };

    return (
        <FormControl component="fieldset">
            <FormLabel component="legend" id="email-filter-label">E-Mail-Filter</FormLabel>
            <RadioGroup value={emailFilter} onChange={handleChange} aria-labelledby="email-filter-label">
                <FormControlLabel value="all" control={<Radio size="small" />} label="Alle" />
                <FormControlLabel value="with_email" control={<Radio size="small" />} label="Mit E-Mail" />
                <FormControlLabel value="without_email" control={<Radio size="small" />} label="Ohne E-Mail" />
            </RadioGroup>
        </FormControl>
    );
}
