import React, { useState } from 'react';
import Popup from 'reactjs-popup';
import { useDispatch, useSelector } from 'react-redux';
import { useFetcher, useNavigate } from 'react-router-dom';
import Draggable from 'react-draggable';
import {
    Card,
    CardContent,
    Typography,
    CardActions,
    IconButton,
    Table,
    TableBody,
    TableRow,
    TableCell,
    Menu,
    MenuItem,
    CardMedia,
    Button,
} from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';
import CloseIcon from '@mui/icons-material/Close';
import ReplayIcon from '@mui/icons-material/Replay';
import PublishIcon from '@mui/icons-material/Publish';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import PendingIcon from '@mui/icons-material/Pending';
import Padlock from '@mui/icons-material/Lock';

import { useTranslation } from './LocalizationProvider';
import RemoveDialog from './RemoveDialog';
import PositionValue from './PositionValue';
import { useDeviceReadonly } from '../util/permissions';
import usePositionAttributes from '../attributes/usePositionAttributes';
import { devicesActions } from '../../store';
import { useCatch, useCatchCallback } from '../../reactHelper';
import { useAttributePreference } from '../util/preferences';

import ShareIcon from '@mui/icons-material/Share';
import ShareLocationIcon from '@mui/icons-material/ShareLocation';
import LoupeIcon from '@mui/icons-material/Loupe';
import AnchorIcon from '@mui/icons-material/Anchor';

import ModalPopup from '../../ModoalPopup/ModoalPopup';

const useStyles = makeStyles((theme) => ({
    card: {
        pointerEvents: 'auto',
        width: theme.dimensions.popupMaxWidth,
    },
    media: {
        height: theme.dimensions.popupImageHeight,
        display: 'flex',
        justifyContent: 'flex-end',
        alignItems: 'flex-start',
    },
    mediaButton: {
        color: theme.palette.primary.contrastText,
        mixBlendMode: 'difference',
    },
    header: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: theme.spacing(1, 1, 0, 2),
    },
    content: {
        paddingTop: theme.spacing(1),
        paddingBottom: theme.spacing(1),
        maxHeight: theme.dimensions.cardContentMaxHeight,
        overflow: 'auto',
    },
    delete: {
        color: theme.palette.error.main,
    },
    icon: {
        width: '25px',
        height: '25px',
        filter: 'brightness(0) invert(1)',

    },
    table: {
        '& .MuiTableCell-sizeSmall': {
            paddingLeft: 0,
            paddingRight: 0,
        },
    },
    cell: {
        borderBottom: 'none',
        width: '80px'
    },

    cell2: {
        borderBottom: 'none',
    },
    actions: {
        justifyContent: 'space-between',
    },
    trbooton: {
        borderBottom: '0px'
    },
    root: ({ desktopPadding }) => ({
        pointerEvents: 'none',
        position: 'fixed',
        zIndex: 5,
        left: '50%',
        [theme.breakpoints.up('md')]: {
            left: `calc(50% + ${desktopPadding} / 2)`,
            bottom: theme.spacing(3),
        },
        [theme.breakpoints.down('md')]: {
            left: '50%',
            bottom: `calc(${theme.spacing(3)} + ${theme.dimensions.bottomBarHeight}px)`,
        },
        transform: 'translateX(-50%)',
    }),
}));

const StatusRow = ({ name, content }) => {
    const classes = useStyles();

    return (
        <TableRow>
            <TableCell className={classes.cell}>
                <Typography variant="body2">{name}</Typography>
            </TableCell>
            <TableCell className={classes.cell2}>
                <Typography variant="body2" color="textSecondary">{content}</Typography>
            </TableCell>
        </TableRow>
    );
};

const StatusCard = ({ deviceId, position, onClose, disableActions, desktopPadding = 0 }) => {
    const classes = useStyles({ desktopPadding });
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const t = useTranslation();

    const deviceReadonly = useDeviceReadonly();

    const device = useSelector((state) => state.devices.items[deviceId]);

    const deviceImage = device?.attributes?.deviceImage;

    const positionAttributes = usePositionAttributes(t);
    const positionItems = useAttributePreference('positionItems', 'speed,address,totalDistance,course');

    const [anchorEl, setAnchorEl] = useState(null);

    const [removing, setRemoving] = useState(false);

    const [popupa, Popupa] = useState(null);
    
    const handleRemove = useCatch(async (removed) => {
        if (removed) {
            const response = await fetch('/api/devices');
            if (response.ok) {
                dispatch(devicesActions.refresh(await response.json()));
            } else {
                throw Error(await response.text());
            }
        }
        setRemoving(false);
    });

    const handleGeofence = useCatchCallback(async () => {
        const newItem = {
            name: '',
            area: `CIRCLE (${position.latitude} ${position.longitude}, 10)`,
        };
        const response = await fetch('/api/geofences', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newItem),
        });
        if (response.ok) {
            const item = await response.json();
            const permissionResponse = await fetch('/api/permissions', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ deviceId: position.deviceId, geofenceId: item.id }),
            });
            if (!permissionResponse.ok) {
                throw Error(await permissionResponse.text());
            }
            navigate(`/settings/geofence/${item.id}`);
        } else {
            throw Error(await response.text());
        }
    }, [navigate, position]);

    const Compatilhar = () => {
        let latitude = (position.latitude) ? position.latitude : null;
        let longitude = (position.longitude) ? position.longitude : null;

        window.open(`https://www.google.com/maps/search/?api=1&query=${latitude}%2C${longitude}`, '_blank');
    }
   
    const PopupAncora = useCatch(async () => {
        const response = await fetch(`/api/geofences?deviceId=${device.id}`, {
            headers: { "Content-Type": "application/json" }
        });        

        let ancora = false;

        const geofences = await response.json();

        for (let index = 0; index < geofences.length; index++) {
            if (geofences[index].name == `Ancora (${device.name})`) {
                ancora = geofences[index];
            }
        }

        if (ancora) {
            return Popupa(
                modalDelArcora
            );
        }

        return Popupa(
            modalCriarArcora 
        );
    })

    const closeAncora = () => {
        Popupa();
    }

    const modalCriarArcora = () => {
        let titulo = 'CRIAR ÂNCORA';

        let body = (<><p>Deseja criar uma âncora para o dispositivo <b>{device.name}?</b> <br></br><br></br> Selecione o perímetro desejado abaixo:</p>

            <Table size="small" className="w-100">
                <TableBody>
                    <TableRow className={classes.trbooton}>
                        <TableCell className={classes.trbooton}><input type="radio" id="mt" name="mt" value="5" className="m-2" />5mt</TableCell>
                        <TableCell className={classes.trbooton}><input type="radio" id="mt" name="mt" value="10" className="m-2" />10mt</TableCell>
                        <TableCell className={classes.trbooton}><input type="radio" id="mt" name="mt" value="20" className="m-2" />20mt</TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell className={classes.trbooton}><input type="radio" id="mt" name="mt" value="50" className="m-2" />50mt</TableCell>
                        <TableCell className={classes.trbooton}><input type="radio" id="mt" name="mt" value="100" className="m-2" />100mt</TableCell>
                        <TableCell className={classes.trbooton}><input type="radio" id="mt" name="mt" value="200" className="m-2" />200mt</TableCell>
                    </TableRow>
                </TableBody>
            </Table></>
        );

        let button = <Button className="btn btn-primary" onClick={CeiarAncora}>Criar Ancora</Button>;
        let Close = <samp className='buttonClose' onClick={closeAncora}>&times;</samp>;

        return ModalPopup(titulo, body, button, Close);
    }

    const modalDelArcora = () => {

        let titulo = 'Âncora';
        let body = <span>Existir uma Âncora ativa para o dispositivo <b>{device.name}</b></span>;
        let button = <Button className="btn btn-primary" onClick={EcluirAncora}>Excluir Ancora</Button>;
        let Close = <samp className='buttonClose' onClick={closeAncora}>&times;</samp>;

        return ModalPopup(titulo, body, button, Close);
    }

    const EcluirAncora = useCatchCallback(async () => {
        const response = await fetch(`/api/geofences?deviceId=${device.id}`, {
            headers: { "Content-Type": "application/json" }
        });        

        const geofences = await response.json();

        let ancoradel;

        for (let index = 0; index < geofences.length; index++) {
            if (geofences[index].name == `Ancora (${device.name})`) {
                ancoradel = geofences[index];
            }
        }
        
        const delgeofences = await fetch(`/api/geofences/${ancoradel.id}`, {
            method: 'DELETE',
            headers: { "Content-Type": "application/json" }
        });

        if (delgeofences.ok) {
            let titulo = 'Âncora';
            let body = <span>Âncora Excluida com Sucesso </span>;
            let button = <Button className="btn btn-primary" onClick={closeAncora}>ok</Button>;
            let Close = <samp className='buttonClose' onClick={closeAncora}>&times;</samp>;

            return Popupa(
                ModalPopup(titulo, body, button, Close)
            );
        }

    }, [navigate, position]);

    const CeiarAncora = useCatchCallback(async () => {
        const metros = document.getElementsByName("mt");

        let mt = 5;

        for (let i = 0; i < metros.length; i++) {
            if (metros[i].checked)
                mt = metros[i].value;
        }

        const newItem = {
            name: 'Ancora (' + (device.name) + ')',
            area: `CIRCLE (${position.latitude} ${position.longitude}, ${mt})`,
        };

        const response = await fetch('/api/geofences', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newItem),
        });

        if (response.ok) {
            const item = await response.json();
            const permissionResponse = await fetch('/api/permissions', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ deviceId: position.deviceId, geofenceId: item.id }),
            });
            if (!permissionResponse.ok) {
                throw Error(await permissionResponse.text());
            }

            navigate(`/geofences/`);
        } else {
            throw Error(await response.text());
        }

    }, [navigate, position]);

    return (        <>
            {popupa}
            <div className={classes.root}>
            
                {device && (
                    <Draggable
                        handle={`.${classes.media}, .${classes.header}`}
                    >
                        <Card elevation={3} className={classes.card}>
                            {deviceImage ? (
                                <CardMedia
                                    className={classes.media}
                                    image={`/api/media/${device.uniqueId}/${deviceImage}`}
                                >
                                    <IconButton
                                        size="small"
                                        onClick={onClose}
                                        onTouchStart={onClose}
                                    >
                                        <CloseIcon fontSize="small" className={classes.mediaButton} />
                                    </IconButton>
                                </CardMedia>
                            ) : (
                                <div className={classes.header}>
                                    <Typography variant="body2" color="textSecondary">
                                        {device.name}
                                    </Typography>
                                    <IconButton
                                        size="small"
                                        onClick={onClose}
                                        onTouchStart={onClose}
                                    >
                                        <CloseIcon fontSize="small" />
                                    </IconButton>
                                </div>
                            )}
                            {position && (
                                <CardContent className={classes.content}>
                                    <Table size="small" classes={{ root: classes.table }}>
                                        <TableBody>
                                            {positionItems.split(',').filter((key) => position.hasOwnProperty(key) || position.attributes.hasOwnProperty(key)).map((key) => (
                                                <StatusRow
                                                    key={key}
                                                    name={positionAttributes.hasOwnProperty(key) ? positionAttributes[key].name : key}
                                                    content={(
                                                        <PositionValue
                                                            position={position}
                                                            property={position.hasOwnProperty(key) ? key : null}
                                                            attribute={position.hasOwnProperty(key) ? null : key}
                                                        />
                                                    )}
                                                />
                                            ))}
                                        </TableBody>
                                    </Table>
                                </CardContent>
                            )}
                            <CardActions classes={{ root: classes.actions }} disableSpacing>
                                <IconButton
                                    color="secondary"
                                    onClick={(e) => setAnchorEl(e.currentTarget)}
                                    disabled={!position}
                                >
                                    <PendingIcon />
                                </IconButton>

                                <IconButton
                                    onClick={Compatilhar}
                                >
                                    <ShareIcon />
                                </IconButton>

                                <IconButton
                                    onClick={() => navigate('/replay')}
                                    disabled={disableActions || !position}
                                >
                                    <ReplayIcon />
                                </IconButton>
                                <IconButton
                                    onClick={() => navigate(`/settings/device/${deviceId}/command`)}
                                    disabled={disableActions}
                                >
                                    <PublishIcon />
                                </IconButton>

                                <IconButton
                                    onClick={PopupAncora}
                                >
                                    <AnchorIcon />
                                </IconButton>

                                {/* Button Bloqueio é Desbloqueio */}
                                <IconButton
                                    onClick={() => bloaqueio(deviceId)}
                                    disabled={disableActions || deviceReadonly}
                                >
                                    <Padlock />

                                </IconButton>

                                <IconButton
                                    onClick={() => navigate(`/settings/device/${deviceId}`)}
                                    disabled={disableActions || deviceReadonly}
                                >
                                    <EditIcon />
                                </IconButton>

                                {/* <IconButton
                                    onClick={() => setRemoving(true)}
                                    disabled={disableActions || deviceReadonly}
                                    className={classes.delete}
                                >
                                    <DeleteIcon />
                                </IconButton> */}
                            </CardActions>
                        </Card>
                    </Draggable>
                )}
            </div>
            {position && (
                <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={() => setAnchorEl(null)}>
                    <MenuItem onClick={() => navigate(`/position/${position.id}`)}><Typography color="secondary">{t('sharedShowDetails')}</Typography></MenuItem>
                    <MenuItem onClick={handleGeofence}>{t('sharedCreateGeofence')}</MenuItem>
                    <MenuItem component="a" target="_blank" href={`https://www.google.com/maps/search/?api=1&query=${position.latitude}%2C${position.longitude}`}>{t('linkGoogleMaps')}</MenuItem>
                    <MenuItem component="a" target="_blank" href={`http://maps.apple.com/?ll=${position.latitude},${position.longitude}`}>{t('linkAppleMaps')}</MenuItem>
                    <MenuItem component="a" target="_blank" href={`https://www.google.com/maps/@?api=1&map_action=pano&viewpoint=${position.latitude}%2C${position.longitude}&heading=${position.course}`}>{t('linkStreetView')}</MenuItem>
                </Menu>
            )}
            <RemoveDialog
                open={removing}
                endpoint="devices"
                itemId={deviceId}
                onResult={(removed) => handleRemove(removed)}
            />
        </>
    );
};

export default StatusCard;
