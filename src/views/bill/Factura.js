import React from 'react';
import { useQuery } from '@apollo/client';
import {
    Card, CardContent, Typography, CardActions, Button, Grid, CircularProgress, Container,
    Dialog,
    DialogContent,
    DialogTitle,
    DialogActions
} from '@mui/material';
import FACTURA_QUERY from 'src/graphql/factura_query';
import { useState } from 'react';
import handleGenerarFactura from './pdf';

const Factura = () => {
    const { loading, error, data } = useQuery(FACTURA_QUERY);
    const [pedidoSeleccionado, setPedidoSeleccionado] = useState(null);
    const [nroS, setNroS] = useState(null);

    const [open, setOpen] = useState(false);
    const handleClickOpen = (pedido, nro) => {
        setPedidoSeleccionado(pedido);
        setNroS(nro);
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
        setPedidoSeleccionado(null);
    };
    if (loading) return <CircularProgress />;
    if (error) return <p>Error: {error.message}</p>;
    return (
        <Container>
            <Grid container spacing={4}>
                {data.getFacturas.map((factura) => (
                    <Grid item xs={12} sm={6} md={4} key={factura.nro}>
                        <Card>
                            <CardContent>
                                <Typography variant="h6" component="div">
                                    Factura Nro: {factura.nro}
                                </Typography>
                                <Typography color="textSecondary">
                                    Total: ${factura.total}
                                </Typography>
                                <Typography color="textSecondary">
                                    Fecha: {factura.fecha}
                                </Typography>
                                <Typography variant="body2">
                                    Administrador Encargado : {factura.id_usuario.nombre_usuario}
                                </Typography>
                                <Typography variant="body2">
                                    Nombre del Comensal: {factura.pedido.nombre_comensal}
                                </Typography>
                                <Typography variant="body2">
                                    Nro de Mesa: {factura.pedido.nro_mesa}
                                </Typography>
                                <Typography variant="body2">
                                    Estado: {factura.pedido.estado ? 'Entregado' : 'Pendiente'}
                                </Typography>
                            </CardContent>
                            <CardActions>
                                <Button size="small" onClick={() => handleClickOpen(factura.pedido, factura.nro)}>Ver Detalles</Button>
                            </CardActions>
                        </Card>
                    </Grid>
                ))}
            </Grid>
            <Dialog open={open} onClose={handleClose} aria-labelledby="pedido-dialog-title">
                <DialogTitle id="pedido-dialog-title">Detalles del Pedido</DialogTitle>
                <DialogContent>
                    {pedidoSeleccionado && (
                        <>
                            <Typography>Nro Pedido: {pedidoSeleccionado.nro_pedido}</Typography>
                            <Typography>Fecha: {pedidoSeleccionado.fecha} {pedidoSeleccionado.hora}</Typography>
                            <Typography>Nombre del Comensal: {pedidoSeleccionado.nombre_comensal}</Typography>
                            <Typography>Estado: {pedidoSeleccionado.estado ? 'Entregado' : 'Pendiente'}</Typography>
                            {/* Mapeo de Platos */}
                            <Typography variant="h6" gutterBottom>Platos:</Typography>
                            {pedidoSeleccionado.plato.map((item, index) => (
                                <Typography key={index}>{item.cantidad} x {item.nombre}</Typography>
                            ))}

                            {/* Mapeo de Bebidas */}
                            <Typography variant="h6" gutterBottom>Bebidas:</Typography>
                            {pedidoSeleccionado.bebida.map((item, index) => (
                                <Typography key={index}>{item.cantidad} x {item.nombre}</Typography>
                            ))}
                            <Typography>Extras: {pedidoSeleccionado.extras}</Typography>
                        </>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} color="primary">Cerrar</Button>
                    <Button onClick={() => handleGenerarFactura(pedidoSeleccionado, nroS)} color="primary">Generar Factura</Button>

                </DialogActions>
            </Dialog>
        </Container>
    );
};

export default Factura;
