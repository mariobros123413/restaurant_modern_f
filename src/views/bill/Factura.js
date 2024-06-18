import React, { useEffect } from 'react';
import { useQuery } from '@apollo/client';
import {
    Card, CardContent, Typography, CardActions, Button, Grid, CircularProgress, Container,
    Dialog,
    DialogContent,
    DialogTitle,
    DialogActions,
    TextField
} from '@mui/material';
import FACTURA_QUERY from 'src/graphql/factura_query';
import { useState } from 'react';
import handleGenerarFactura from './pdf';

const Factura = () => {
    const [page, setPage] = useState(0); // Estado para el número de página actual
    const [pageSize, setPageSize] = useState(1); // Tamaño de página predeterminado
    const [pedidoSeleccionado, setPedidoSeleccionado] = useState(null);
    const [nroS, setNroS] = useState(null);
    const [open, setOpen] = useState(false);
    const [pageSizeInput, setPageSizeInput] = useState(''); // Estado para el input de tamaño de página

    const { loading, error, data } = useQuery(FACTURA_QUERY, {
        variables: { page, size: pageSize },
    });

    useEffect(() => {
        if (data && data.getFacturasS && data.getFacturasS.paginaInfo) {
            setPaginaInfo({
                totalPaginas: data.getFacturasS.paginaInfo.totalPaginas,
                totalElementos: data.getFacturasS.paginaInfo.totalElementos,
                paginaActual: data.getFacturasS.paginaInfo.paginaActual,
                pageSize: pageSize,
            });
        }
    }, [data, pageSize]);
    var [paginaInfo, setPaginaInfo] = useState({
        totalPaginas: 0,
        totalElementos: 0,
        paginaActual: 0,
        pageSize: 5, // Tamaño de página predeterminado
    });
    const handleClickOpen = (pedido, nro) => {
        setPedidoSeleccionado(pedido);
        setNroS(nro);
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
        setPedidoSeleccionado(null);
    };
    const handlePaginaAnterior = () => {
        if (page > 0) {
            setPage(page - 1);
        }
    };

    const handlePaginaSiguiente = () => {
        if (data.getFacturasS.paginaInfo.paginaActual < data.getFacturasS.paginaInfo.totalPaginas - 1) {
            setPage(page + 1);
        }
    };
    const handlePageSizeChange = (event) => {
        setPageSizeInput(event.target.value);
    };

    const handleSubmitPageSize = () => {
        if (pageSizeInput.trim() !== '') {
            const newPageSize = parseInt(pageSizeInput, 10);
            if (!isNaN(newPageSize) && newPageSize > 0) {
                setPageSize(newPageSize);
                setPage(0); // Reiniciar a la página 0 al cambiar el tamaño de página
            } else {
                console.error('Tamaño de página no válido');
            }
        }
    };
    if (loading) return <CircularProgress />;
    if (error) return <p>Error: {error.message}</p>;
    return (
        <Container>
            <TextField
                label="Tamaño de página"
                variant="outlined"
                type="number"
                value={pageSizeInput}
                onChange={handlePageSizeChange}
                style={{ marginRight: '10px' }}
            />
            <Button variant="contained" color="primary" onClick={handleSubmitPageSize}>
                Aplicar
            </Button>
            <Grid container spacing={4}>
                {data.getFacturasS.facturas.map((factura) => (
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
            {paginaInfo && (
                <div style={{ marginTop: '16px', textAlign: 'center' }}>
                    <Button disabled={paginaInfo.paginaActual === 0} onClick={handlePaginaAnterior}>
                        Anterior
                    </Button>
                    <Typography style={{ margin: '0 16px', display: 'inline-block' }}>
                        Página {parseInt(paginaInfo.paginaActual) + 1} de {paginaInfo.totalPaginas}
                    </Typography>
                    <Button disabled={paginaInfo.paginaActual === paginaInfo.totalPaginas - 1} onClick={handlePaginaSiguiente}>
                        Siguiente
                    </Button>
                </div>
            )}
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
