import React, { useState } from 'react';
import { useQuery } from '@apollo/client';
import { CircularProgress, Container, Typography, Grid, Card, CardContent, Button, TextField } from '@mui/material';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import FACTURA_QUERY from 'src/graphql/factura_fecha_query'; // Asegúrate de importar tu consulta GraphQL
import USUARIO_QUERY from 'src/graphql/usuario_query'; // Asegúrate de importar tu consulta GraphQL

const Reportes = () => {
    const [reporteSeleccionado, setReporteSeleccionado] = useState(null);
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [page, setPage] = useState(0); // Estado para el número de página actual
    const [size, setSize] = useState(10); // Tamaño de la página, inicialmente 10
    const { loading: loadingUsers, error: errorUsers, data: dataUsers } = useQuery(USUARIO_QUERY, {
        skip: reporteSeleccionado !== 'usuarios',
    });
    const { loading: loadingFacturas, error: errorFacturas, data: dataFacturas, refetch } = useQuery(FACTURA_QUERY, {
        variables: {
            fechaInicio: startDate,
            fechaFin: endDate,
            page: page,
            size: size
        },
        skip: reporteSeleccionado !== 'facturas',
    });

    const handleSelectReporte = (reporte) => {
        setReporteSeleccionado(reporte);
    };

    const handleFilterByDate = () => {
        setPage(0); // Reiniciar la página a 0 al filtrar por fechas
        refetch(); // Volver a cargar los datos con las nuevas fechas
    };

    const generatePDFF = (data) => {
        const doc = new jsPDF();
        doc.text('Reporte', 10, 10);
        doc.autoTable({
            head: [['Nro', 'Total', 'Fecha', 'Administrador', 'Comensal']],
            body: data.map(factura => [factura.nro, factura.total, factura.fecha, factura.id_usuario.nombre_usuario, factura.pedido.nombre_comensal]),
        });
        const totalFacturas = data.reduce((total, factura) => total + factura.total, 0);
        doc.autoTable({
            body: [['', '', '', 'Total (Bs):', totalFacturas]],
        });
        doc.save('reporte_facturas.pdf');
    };
    const generatePDF = (data) => {
        const doc = new jsPDF();
        doc.text('Reporte de Usuarios', 10, 10);
        // Genera la tabla de usuarios
        doc.autoTable({
            head: [['ID', 'Nombre', 'Rol']],
            body: data.map(user => [user.id, user.nombre_usuario, user.isAdmin ? 'Administrador' : 'Mesero']),
        });
        // Guarda el PDF con un nombre único
        doc.save('reporte_usuarios.pdf');
    };
    const renderFacturas = () => {
        if (loadingFacturas) return <CircularProgress />;
        if (errorFacturas) return <Typography>Error al cargar facturas: {errorFacturas.message}</Typography>;

        const facturas = dataFacturas.getFacturasEntreFechas.facturas;

        return (
            <>
                <Grid container spacing={4}>
                    {facturas.map((factura) => (
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
                <Button variant="contained" color="primary" onClick={() => generatePDFF(facturas)}>Generar PDF</Button>
                {/* Mostrar controles de paginación */}
                {dataFacturas && (
                    <div style={{ marginTop: '20px', textAlign: 'center' }}>
                        <Button
                            variant="contained"
                            color="primary"
                            disabled={page === 0}
                            onClick={() => setPage(page - 1)}
                        >
                            Anterior
                        </Button>
                        <Button
                            variant="contained"
                            color="primary"
                            disabled={facturas.length < size}
                            onClick={() => setPage(page + 1)}
                        >
                            Siguiente
                        </Button>
                    </div>
                )}
            </>
        );
    };
    const renderUsers = () => {
        if (loadingUsers) return <CircularProgress />;
        if (errorUsers) return <Typography>Error al cargar usuarios: {errorUsers.message}</Typography>;

        return (
            <>
                <Grid container spacing={4}>
                    {dataUsers.getUsers.map((user) => (
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
                <Button variant="contained" color="primary" onClick={() => generatePDF(dataUsers.getUsers)}>Generar PDF</Button>
            </>
        );
    };

    return (
        <Container>
            <Typography variant="h4" gutterBottom>Generar Reportes</Typography>
            <Button variant="contained" color="primary" onClick={() => handleSelectReporte('facturas')}>Reporte de Facturas</Button>
            <Button variant="contained" color="primary" onClick={() => handleSelectReporte('usuarios')}>Reporte de Usuarios</Button>
            {reporteSeleccionado === 'usuarios' && renderUsers()}
            {reporteSeleccionado === 'facturas' && (
                <Grid container spacing={4} style={{ marginTop: '20px' }}>
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
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    label="Tamaño de página"
                                    type="number"
                                    value={size}
                                    onChange={(e) => setSize(parseInt(e.target.value))}
                                    InputLabelProps={{ shrink: true }}
                                />
                            </Grid>
                            <Button variant="contained" color="primary" style={{ boxSizing: 5 }} onClick={() => handleFilterByDate()}>Filtrar por fecha</Button>
                            {renderFacturas()}
                        </>
                    )}
                </Grid>
            )}
        </Container>
    );

};

export default Reportes;