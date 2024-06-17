import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import { useMutation } from '@apollo/client';
import { TextField, Button, Grid, Typography, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import MENU_UPDATE_MUTATION from 'src/graphql/menu_update_mutations';

const UpdateMenu = ({ menu, open, onClose }) => {
    const defaultValues = menu ? {
        id: menu.id,
        fecha: menu.fecha,
        platos: menu.plato.map(plato => ({ nombre: plato.nombre, cantidad: plato.cantidad })),
        bebidas: menu.bebida.map(bebida => ({ nombre: bebida.nombre, cantidad: bebida.cantidad })),
    } : {};
    const { control, handleSubmit, reset } = useForm({ defaultValues });

    const [updateMenu, { loading, error }] = useMutation(MENU_UPDATE_MUTATION, {
        onCompleted: () => {
            reset();
            onClose();
        },
    });

    const onSubmit = (data) => {
        const { fecha, platos, bebidas } = data;
        const platoInput = platos.map(plato => ({ nombre: plato.nombre, cantidad: parseInt(plato.cantidad) }));
        const bebidaInput = bebidas.map(bebida => ({ nombre: bebida.nombre, cantidad: parseInt(bebida.cantidad) }));

        updateMenu({ variables: { id: menu.id, fecha, plato: platoInput, bebida: bebidaInput } });
    };

    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle>Actualizar Menú</DialogTitle>
            <DialogContent>
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <Controller
                            name="fecha"
                            control={control}
                            render={({ field }) => <TextField {...field} label="Fecha (dd-MM-yyyy)" fullWidth />}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <Typography variant="subtitle1" component="div">
                            Platos
                        </Typography>
                    </Grid>
                    <Grid item xs={12}>
                        <Controller
                            name="platos"
                            control={control}
                            render={({ field }) => (
                                <Grid container spacing={2}>
                                    {field.value.map((plato, index) => (
                                        <Grid container item spacing={2} key={index}>
                                            <Grid item xs={6}>
                                                <TextField
                                                    label="Nombre del Plato"
                                                    value={plato.nombre}
                                                    onChange={(e) => {
                                                        const newPlatos = [...field.value];
                                                        newPlatos[index].nombre = e.target.value;
                                                        field.onChange(newPlatos);
                                                    }}
                                                    fullWidth
                                                />
                                            </Grid>
                                            <Grid item xs={6}>
                                                <TextField
                                                    label="Cantidad"
                                                    value={plato.cantidad}
                                                    onChange={(e) => {
                                                        const newPlatos = [...field.value];
                                                        newPlatos[index].cantidad = e.target.value;
                                                        field.onChange(newPlatos);
                                                    }}
                                                    fullWidth
                                                />
                                            </Grid>
                                        </Grid>
                                    ))}
                                    <Button
                                        onClick={() => field.onChange([...field.value, { nombre: '', cantidad: '' }])}
                                    >
                                        Añadir Plato
                                    </Button>
                                </Grid>
                            )}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <Typography variant="subtitle1" component="div">
                            Bebidas
                        </Typography>
                    </Grid>
                    <Grid item xs={12}>
                        <Controller
                            name="bebidas"
                            control={control}
                            render={({ field }) => (
                                <Grid container spacing={2}>
                                    {field.value.map((bebida, index) => (
                                        <Grid container item spacing={2} key={index}>
                                            <Grid item xs={6}>
                                                <TextField
                                                    label="Nombre de la Bebida"
                                                    value={bebida.nombre}
                                                    onChange={(e) => {
                                                        const newBebidas = [...field.value];
                                                        newBebidas[index].nombre = e.target.value;
                                                        field.onChange(newBebidas);
                                                    }}
                                                    fullWidth
                                                />
                                            </Grid>
                                            <Grid item xs={6}>
                                                <TextField
                                                    label="Cantidad"
                                                    value={bebida.cantidad}
                                                    onChange={(e) => {
                                                        const newBebidas = [...field.value];
                                                        newBebidas[index].cantidad = e.target.value;
                                                        field.onChange(newBebidas);
                                                    }}
                                                    fullWidth
                                                />
                                            </Grid>
                                        </Grid>
                                    ))}
                                    <Button
                                        onClick={() => field.onChange([...field.value, { nombre: '', cantidad: '' }])}
                                    >
                                        Añadir Bebida
                                    </Button>
                                </Grid>
                            )}
                        />
                    </Grid>
                </Grid>
                {error && <Typography color="error">{error.message}</Typography>}
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} color="secondary">
                    Cancelar
                </Button>
                <Button onClick={handleSubmit(onSubmit)} color="primary" variant="contained" disabled={loading}>
                    Actualizar Menú
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default UpdateMenu;
