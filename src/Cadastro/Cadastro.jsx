import React, { useEffect, useState } from 'react';
import {
    Accordion,
    AccordionSummary,
    AccordionDetails,
    Typography,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    FormControlLabel,
    Checkbox,
    FormGroup,
    TextField,
    Button,
} from '@mui/material';


const Cadastro = () => {

    const [item, setItem] = useState();
    const [device, setDevice] = useState();
    const [token, setToken] = useState();

    console.log(token);

    const conect = async () => {
        const response = await fetch(`http://localhost:8082/api/session?token=${process.env.TOKENAPI}`);
        const setCookieHeader = response.headers.get('set-cookie');

        console.log(setCookieHeader);
    }

    const deviceFind = async () => {
        await conect();
        // const response = await fetch(`/api/devices?uniqueId=${item.name}`);

        setDevice(token);
    }

    return (
        <><div>
            <TextField
                value={item && item.name || ''}
                onChange={(event) => setItem({ ...item, name: event.target.value })}
                label={'ok'}
            />

            <Button
                type="button"
                color="primary"
                variant="contained"
                onClick={deviceFind}
            >
                {'buscar'}
            </Button>
        </div>
        </>
    );
}

export default Cadastro;