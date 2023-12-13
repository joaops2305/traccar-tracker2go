import React from 'react';

import { useParams } from 'react-router-dom';
import {
    Accordion,
    AccordionSummary,
    AccordionDetails,
    Typography,
    Container,
    TextField,
    Button,
} from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';
import SettingsMenu from '../settings/components/SettingsMenu';
import PageLayout from '../common/components/PageLayout';
import { preparse } from "dayjs/locale/ar";
import { useCatch } from '../reactHelper';

import OnlinePredictionIcon from '@mui/icons-material/OnlinePrediction';

const WhatsApp = () => {
    const useStyles = makeStyles((theme) => ({
        container: {
            marginTop: theme.spacing(2),
        },
        details: {
            display: 'flex',
            flexDirection: 'column',
            gap: theme.spacing(2),
            paddingBottom: theme.spacing(3),
        },
        iframe: {
            width: '100%',
            height: '100%',
            border: '0px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px'
        }
    }));

    const classes = useStyles();

    const urlObject = process.env.WHAST_APIHOST + '/' + process.env.INSTANCE_WHATS + '/' + process.env.CONECKEY;

    return (
        <PageLayout menu={<SettingsMenu />} breadcrumbs={['settingsTitle', 'settingsUsers']}>

            <iframe id='iframe' className={classes.iframe} src={urlObject} ></iframe>

        </PageLayout>
    );
}


export default WhatsApp;