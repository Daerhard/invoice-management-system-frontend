import * as React from 'react';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
import { useAtom } from 'jotai/index';
import { businessCustomerSelectAtom } from '../../../store/Global';

export default function BusinessCustomerFilter() {
    const [onlyBusinessCustomers, setOnlyBusinessCustomers] = useAtom(businessCustomerSelectAtom);

    const handleSwitchChange = React.useCallback(
        (event: React.ChangeEvent<HTMLInputElement>) => {
            setOnlyBusinessCustomers(event.target.checked);
        },
        [setOnlyBusinessCustomers]
    );

    return (
        <FormGroup>
            <FormControlLabel
                control={
                    <Switch
                        checked={onlyBusinessCustomers}
                        onChange={handleSwitchChange}
                    />
                }
                label="nur gewerbliche Händler"
            />
        </FormGroup>
    );
}
