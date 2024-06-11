import React, { useState } from 'react';
import { useQuery } from '@apollo/client';
import { Container, Typography, Button, Grid, Card, CardContent, CircularProgress } from '@mui/material';
import FACTURA_QUERY from 'src/graphql/factura_query';
import USUARIO_QUERY from 'src/graphql/usuario_query';
import jsPDF from 'jspdf';
import { TextField } from '@mui/material';

const Reportes = () => {
    const [reporteSeleccionado, setReporteSeleccionado] = useState(null);
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');

    const { loading: loadingUsers, error: errorUsers, data: dataUsers } = useQuery(USUARIO_QUERY, {
        skip: reporteSeleccionado !== 'usuarios',
    });
    const { loading: loadingFacturas, error: errorFacturas, data: dataFacturas } = useQuery(FACTURA_QUERY, {
        skip: reporteSeleccionado !== 'facturas',
    });

    const handleSelectReporte = (reporte) => {
        setReporteSeleccionado(reporte);
    };
    const handleFilterByDate = () => {
        renderFacturas();
    };

    const generatePDF = (data) => {
        const doc = new jsPDF();
        doc.text('Reporte', 10, 10);
        // Genera la tabla
        doc.autoTable({
            head: [['ID', 'Nombre', 'Rol']],
            body: data.map(user => [user.id, user.nombre_usuario, user.isAdmin ? 'Administrador' : 'Mesero']),
        });
        // Guarda el PDF con un nombre único
        doc.save('reporte_usuarios.pdf');
    };
    const generatePDFF = (data) => {
        const doc = new jsPDF();
        doc.text('Reporte', 10, 10);
        // Genera la tabla
        doc.autoTable({
            head: [['Nro', 'Total', 'Fecha', 'Administrador', 'Comensal']],
            body: data.map(user => [user.nro, user.total, user.fecha, user.id_usuario.nombre_usuario, user.pedido.nombre_comensal]),
        });
        // Calcula la suma total de las facturas
        const totalFacturas = data.reduce((total, factura) => total + factura.total, 0);
        // Agrega una fila adicional con la suma total
        doc.autoTable({
            body: [['', '', '', 'Total (Bs):', totalFacturas]],
        });
        // Guarda el PDF con un nombre único
        doc.save('reporte_facturas.pdf');
    };


    const renderUsers = () => {
        if (loadingUsers) return <CircularProgress />;
        if (errorUsers) return <Typography>Error al cargar usuarios: {errorUsers.message}</Typography>;

        return (
            <>
                <Grid container spacing={4}>
                    {dataUsers.usuarios.map((user) => (
                        <Grid item xs={12} sm={6} md={4} key={user.id}>
                            <Card>
                                <CardContent>
                                    <Typography variant="h5">ID: {user.id}</Typography>
                                    <Typography>Nombre: {user.nombre_usuario}</Typography>
                                    <Typography>Rol: {user.isAdmin ? 'Administrador' : 'Mesero'}</Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
                <Button variant="contained" color="primary" onClick={() => generatePDF(dataUsers.usuarios)}>Generar PDF</Button>
            </>
        );
    };
    const renderFacturas = () => {
        if (loadingFacturas) return <CircularProgress />;
        if (errorFacturas) return <Typography>Error al cargar facturas: {errorFacturas.message}</Typography>;

        // Filtrar facturas por fecha
        const filteredFacturas = dataFacturas.facturas.filter(factura => {
            const facturaDate = new Date(factura.fecha);
            return facturaDate >= new Date(startDate) && facturaDate <= new Date(endDate);
        });

        return (
            <>
                <Grid container spacing={4}>
                    {filteredFacturas.map((factura) => (
                        <Grid item xs={12} sm={6} md={4} key={factura.nro}>
                            <Card>
                                <CardContent>
                                    <Typography variant="h5">Factura Nro: {factura.nro}</Typography>
                                    <Typography>Total: ${factura.total}</Typography>
                                    <Typography>Fecha: {factura.fecha}</Typography>
                                    <Typography>Usuario: {factura.id_usuario.nombre_usuario}</Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
                <Button variant="contained" color="primary" onClick={() => generatePDFF(filteredFacturas)}>Generar PDF</Button>
            </>
        );
    };

    return (
        <Container>
            <Typography variant="h4" gutterBottom>Generar Reportes</Typography>
            <Button variant="contained" color="primary" onClick={() => handleSelectReporte('usuarios')}>Reporte de Usuarios</Button>
            <Button variant="contained" color="secondary" onClick={() => handleSelectReporte('facturas')}>Reporte de Facturas</Button>
            <Grid container spacing={4} style={{ marginTop: '20px' }}>
                {reporteSeleccionado === 'usuarios' && renderUsers()}
                {reporteSeleccionado === 'facturas' && (
                    <>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                label="Fecha de inicio"
                                type="date"
                                value={startDate}
                                onChange={(e) => setStartDate(e.target.value)}
                                InputLabelProps={{ shrink: true }}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                label="Fecha de fin"
                                type="date"
                                value={endDate}
                                onChange={(e) => setEndDate(e.target.value)}
                                InputLabelProps={{ shrink: true }}
                            />
                        </Grid>
                        <Button variant="contained" color="primary" onClick={() => handleFilterByDate()}>Filtrar por fecha</Button>
                        {renderFacturas()}
                    </>
                )}
            </Grid>
        </Container>
    );
};
export default Reportes;
