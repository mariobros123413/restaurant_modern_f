import React, { useState, useEffect } from 'react';
import { Typography, Button, TextField, Card, CardContent, CardActions, Dialog, DialogTitle, DialogContent, DialogContentText, Modal, Snackbar, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import PageContainer from 'src/components/container/PageContainer';
import DashboardCard from '../../components/shared/DashboardCard';
import './evento.css';
import { useMutation, useQuery } from '@apollo/client';
import MESA_QUERY from 'src/graphql/mesa_query';
import MESA_MUTATION from 'src/graphql/mesa_mutations';
import MESA_UPDATE_MUTATION from 'src/graphql/mesa_update_mutation';
import MESA_DELETE_MUTATION from 'src/graphql/mesa_delete_mutation';

const Mesa = () => {
    const [open, setOpen] = useState(false);
    const [openElim, setOpenElim] = useState(false);
    const [openEdit, setOpenEdit] = useState(false);
    const [disponibleEdited, setDisponibleEdited] = useState(true);

    const [nombre, setNombre] = useState('');
    const [descripcion, setDescripcion] = useState('');
    const [eventoAEliminar, setEventoAEliminar] = useState(null);
    ////////////////////////////////<EDITED>
    const [nombreEdited, setNombreEdited] = useState('');
    const [descripcionEdited, setDescripcionEdited] = useState('');
    ///////////////////////////////</EDITED>
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    // const localData = window.localStorage.getItem('loggedFocusEvent');
    // const localDataParsed = JSON.parse(localData);
    // const token = JSON.parse(localDataParsed.token);
    const handleDisponibleChange = (event) => {
        setDisponibleEdited(event.target.value === 'true');
    };

    const [mesas, setMesas] = useState([]);
    const { loading, error, data } = useQuery(MESA_QUERY);
    const [createMesa] = useMutation(MESA_MUTATION);
    const [updateMesa, {refetch}] = useMutation(MESA_UPDATE_MUTATION);
    const [deleteMesa] = useMutation(MESA_DELETE_MUTATION);

    useEffect(() => {
        if (data) {
            console.log(data.getMesas); // Aquí puedes trabajar con los datos obtenidos
            setMesas(data.getMesas);
        }
    }, [data]);
    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error.message}</p>;

    const handleClose = () => setOpen(false);
    const handleOpenCreate = () => setOpen(true);

    const handleCloseElim = () => setOpenElim(false);
    const handleOpenElim = (idevento) => {
        setOpenElim(true);
        // Aquí puedes almacenar el id del evento que se eliminará, ya sea en el estado o en una variable de referencia
        // Puedes usar la función setEventoAEliminar o useRef según tus necesidades
        setEventoAEliminar(idevento);
    };
    const handleCloseEdit = () => setOpenEdit(false);
    const handleOpenEdit = (mesa) => {
        setOpenEdit(true);
        setNombreEdited(mesa.nro);
        setDescripcionEdited(mesa.capacidad);
        setDisponibleEdited(mesa.disponible);
    };
    const handleNombreChange = (event) => {
        const { value } = event.target;
        if (value === '' || /^[0-9]+$/.test(value)) {
            setNombre(value);
        }
    };
    const handleDescripcionChange = (event) => {
        const { value } = event.target;
        if (value === '' || /^[0-9]+$/.test(value)) {
            setDescripcion(value);
        }
    };
    /////////////////////////<EDITED>
    const handleDescripcionEDited = (event) => {
        const { value } = event.target;
        if (value === '' || /^[0-9]+$/.test(value)) {
            setDescripcionEdited(value);
        }
    };

    const handleCreateMesa = async () => {

        try {
            const response = await createMesa({
                variables: {
                    id_usuario: "8102396616383947215", // Suponiendo que el ID del usuario viene del evento seleccionado
                    nro: parseInt(nombre, 10), // Suponiendo que estás usando nombreEdited como número
                    capacidad: parseInt(descripcion, 10), // Asegúrate de convertirlo a Int
                    disponible: true // Convierte la disponibilidad a booleano
                }
            });
            if (response.data.createMesa == null)
                throw new Error("Mesa existente");

            setSnackbarMessage('Mesa creada correctamente');
            setSnackbarOpen(true);
            setOpen(false);
            window.location.reload()
            console.log('Mesa creada:', response.data.createMesa);
        } catch (error) {
            console.error('Error al crear la mesa:', error.message);
            if (error.graphQLErrors) {
                error.graphQLErrors.forEach(({ message, locations, path }) =>
                    console.error(`[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`)
                );
            }
            setSnackbarMessage('Error al crear la mesa');
            setSnackbarOpen(true);
            window.location.reload()
        }

    };
    const handleUpdateEvento = async () => {
        try {
            const response = await updateMesa({
                variables: {
                    nro: parseInt(nombreEdited, 10), // Suponiendo que estás usando nombreEdited como número
                    capacidad: parseInt(descripcionEdited, 10), // Asegúrate de convertirlo a Int
                    disponible: disponibleEdited  // Convierte la disponibilidad a booleano
                }
            });
            await refetch();
            setSnackbarMessage('Mesa actualizada correctamente');
            setSnackbarOpen(true);
            setOpenEdit(false);
            console.log('Mesa creada:', response.data.updateMesaByNro);
            
        } catch (error) {
            console.error('Error al crear la mesa:', error.message);
            if (error.graphQLErrors) {
                error.graphQLErrors.forEach(({ message, locations, path }) =>
                    console.error(`[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`)
                );
            }
            window.location.reload()
            setSnackbarMessage('Error al actualizar la mesa');
            setSnackbarOpen(true);
        }
    };
    const handleElimEvento = async () => {
        try {
            const response = await deleteMesa({
                variables: {
                    id: eventoAEliminar
                }
            });
            setSnackbarMessage('Mesa eliminada correctamente');
            setSnackbarOpen(true);
            setOpenElim(false);
            window.location.reload()
            console.log('Mesa eliminada:', response.data.deleteMesa);
        } catch (error) {
            console.error('Error al eliminar la mesa:', error.message);
            if (error.graphQLErrors) {
                error.graphQLErrors.forEach(({ message, locations, path }) =>
                    console.error(`[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`)
                );
            }
            setSnackbarMessage('Error al eliminar la mesa');
            setSnackbarOpen(true);
            window.location.reload()
        }
    };
    return (
        <PageContainer title="Tus Mesas" description="">
            <DashboardCard title="Tus Mesas">
                <Button color="primary" variant="contained" size="large" onClick={handleOpenCreate}>
                    Crear Mesa +
                </Button>
                {/* Bucle para mostrar tarjetas de eventos */}
                {Array.isArray(mesas) ? (
                    mesas.map((mesa) => (
                        <Card key={mesa.id} style={{ marginTop: '16px' }} >
                            <CardContent>
                                <Typography variant="h5" component="div">
                                    Número de Mesa : {mesa.nro}
                                </Typography>
                                <Typography color="textSecondary">
                                    Capacidad : {mesa.capacidad}
                                </Typography>
                                <Typography color="textSecondary">
                                    Disponible: {mesa.disponible ? 'Está disponible' : 'No está disponible'}
                                </Typography>
                                {/* Puedes agregar más detalles del evento aquí */}
                            </CardContent>
                            <CardActions>
                                <Button size="small" onClick={() => handleOpenElim(mesa.id)}>Eliminar</Button>
                                <Button size="small" onClick={() => handleOpenEdit(mesa)}>
                                    Actualizar datos
                                </Button>
                            </CardActions>
                        </Card>
                    ))) : (
                    <Typography color="textSecondary">
                        No creaste eventos
                    </Typography> //en hackathono hice el else, revisar
                )}
            </DashboardCard>

            {open && (
                <div className="modal-background">
                    <div className="modal-content">
                        <Typography variant="h5" gutterBottom>
                            Crea una Mesa
                        </Typography>
                        <TextField
                            label="Número de Mesa"
                            fullWidth
                            variant="outlined"
                            margin="normal"
                            value={nombre}
                            onChange={handleNombreChange}
                        />
                        <TextField
                            label="Capacidad"
                            multiline
                            fullWidth
                            variant="outlined"
                            margin="normal"
                            value={descripcion}
                            onChange={handleDescripcionChange}
                        />
                        <Button variant="contained" color="primary" onClick={handleCreateMesa} style={{ marginTop: 16 }}>
                            Crear mesa
                        </Button>
                        <Button variant="contained" color="warning" onClick={handleClose} style={{ marginTop: 16, marginLeft: 20 }}>
                            Cancelar
                        </Button>

                    </div>
                </div>
            )}
            {openElim && (
                <Dialog open={openElim} onClose={handleCloseElim} aria-labelledby="draggable-dialog-title">
                    <DialogTitle id="draggable-dialog-title">
                        Confirmar Eliminación
                    </DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            ¿Estás seguro de que deseas eliminar este elemento? Esta acción no se puede deshacer.
                        </DialogContentText>
                    </DialogContent>
                    <CardActions>
                        <Button autoFocus onClick={handleCloseElim} color="primary">
                            Cancelar
                        </Button>
                        <Button onClick={handleElimEvento} color="primary">
                            Eliminar
                        </Button>
                    </CardActions>
                </Dialog>
            )}
            {openEdit && (
                <Modal open={openEdit} onClose={handleCloseEdit} aria-labelledby="draggable-dialog-title">
                    <div className="modal-background">
                        <div className="modal-content">
                            <Typography variant="h5" gutterBottom>
                                Detalles de la Mesa
                            </Typography>
                            <TextField
                                label="Número de Mesa"
                                fullWidth
                                variant="outlined"
                                margin="normal"
                                value={nombreEdited}
                            />
                            <TextField
                                label="Capacidad de la Mesa"
                                multiline
                                rows={4}
                                fullWidth
                                variant="outlined"
                                margin="normal"
                                value={descripcionEdited}
                                onChange={handleDescripcionEDited}
                            />
                            <FormControl fullWidth variant="outlined" margin="normal">
                                <InputLabel id="disponible-select-label">Disponibilidad</InputLabel>
                                <Select
                                    labelId="disponible-select-label"
                                    value={disponibleEdited.toString()}
                                    onChange={handleDisponibleChange}
                                    label="Disponibilidad"
                                >
                                    <MenuItem value="true">Disponible</MenuItem>
                                    <MenuItem value="false">No Disponible</MenuItem>
                                </Select>
                            </FormControl>
                            {/* Agrega más detalles del evento aquí */}
                            <Button variant="contained" color="secondary" onClick={handleUpdateEvento} style={{ marginTop: 16 }}>
                                Actualizar Mesa
                            </Button>
                            <Button
                                variant="contained"
                                color="primary"
                                onClick={handleCloseEdit}
                                style={{ marginTop: 16, marginLeft: 20 }}
                            >
                                Cerrar
                            </Button>

                        </div>
                    </div>
                </Modal>
            )}
            <Snackbar
                open={snackbarOpen}
                autoHideDuration={6000} // Duración en milisegundos que estará abierto el Snackbar
                onClose={() => setSnackbarOpen(false)}
                message={snackbarMessage}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'right',
                }}
            />
        </PageContainer>
    );
};

export default Mesa;