// src/pages/Menu.js
import React, { useState } from 'react';
import { useQuery } from '@apollo/client';
import { Button, Card, CardContent, Typography,  Snackbar, Grid, } from '@mui/material';
import PageContainer from 'src/components/container/PageContainer';
import DashboardCard from 'src/components/shared/DashboardCard';
import { makeStyles } from '@mui/styles';
import MENU_QUERY from 'src/graphql/menu_query';
import { format } from 'date-fns';
import CreateMenu from './CrearMenu';
import UpdateMenu from './UpdateMenu';

const useStyles = makeStyles({
    card: {
        marginBottom: 16,
    },
    cardContent: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
    },
    title: {
        fontSize: 14,
    },
    pos: {
        marginBottom: 12,
    },
    item: {
        marginBottom: 8,
    },
    centeredCard: {
        display: 'flex',
        justifyContent: 'center',
        marginBottom: 32,
    },
    createButton: {
        display: 'flex',
        justifyContent: 'center',
        marginTop: 32,
    },
    modal: {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 400,
        bgcolor: 'background.paper',
        boxShadow: 24,
        p: 4,
    },
});

const Menu = () => {
    const classes = useStyles();
    const { loading, error, data } = useQuery(MENU_QUERY);
    const [snackbarMessage, ] = useState('');
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [openUpdateMenu, setOpenUpdateMenu] = useState(false); // Estado para controlar la apertura del diálogo UpdateMenu

    const [, setMenuToUpdate] = useState('');
    const handleOpenDialog = () => {
        setDialogOpen(true);
    };
    const handleCloseDialog = () => {
        setDialogOpen(false);
    };
    const todayDate = format(new Date(), 'dd-MM-yyyy');
    const todayMenu = data?.getAllMenus?.find((menu) => menu.fecha === todayDate);

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error.message}</p>;

    const handleCloseSnackbar = () => {
        setSnackbarOpen(false);
    };

    const handleOpenUpdateMenu = (menu) => {
        setMenuToUpdate(menu);
        setOpenUpdateMenu(true);
    };
    return (
        <PageContainer title="Menu de hoy" description="Lista de Menus">
            <DashboardCard title="Menu de hoy">
                {!loading && !error && (
                    <>
                        {todayMenu ? (
                            <div className={classes.centeredCard}>
                                <Card className={classes.card}>
                                    <CardContent className={classes.cardContent}>
                                        <Typography variant="h5" component="div">
                                            Menú del {todayMenu.fecha}
                                        </Typography>
                                        <Typography className={classes.pos} color="textSecondary">
                                            Usuario: {todayMenu.usuario.nombre_usuario}
                                        </Typography>
                                        <Typography variant="body2" component="div">
                                            <strong>Platos:</strong>
                                            {todayMenu.plato.map((plato, index) => (
                                                <div key={index} className={classes.item}>
                                                    {plato.nombre} - {plato.cantidad}
                                                </div>
                                            ))}
                                        </Typography>
                                        <Typography variant="body2" component="div">
                                            <strong>Bebidas:</strong>
                                            {todayMenu.bebida.map((bebida, index) => (
                                                <div key={index} className={classes.item}>
                                                    {bebida.nombre} - {bebida.cantidad}
                                                </div>
                                            ))}
                                        </Typography>
                                        <Button onClick={() => handleOpenUpdateMenu(todayMenu)} color="primary" variant="contained">
                                            Actualizar Menú
                                        </Button>

                                    </CardContent>
                                </Card>
                            </div>
                        ) : (
                            <div className={classes.createButton}>
                                <Button size="large" color="primary" variant="contained" onClick={handleOpenDialog}>
                                    Crear Menú
                                </Button>
                            </div>
                        )}
                    </>
                )}
            </DashboardCard>
            <DashboardCard title="Menús Anteriores">
                <Grid container spacing={3}>
                    {data?.getAllMenus
                        ?.filter((menu) => menu.fecha !== todayDate)
                        .map((menu) => (
                            <Grid item xs={12} sm={6} md={4} key={menu.id}>
                                <Card className={classes.card}>
                                    <CardContent className={classes.cardContent}>
                                        <Typography variant="h5" component="div">
                                            Menú del {menu.fecha}
                                        </Typography>
                                        <Typography className={classes.pos} color="textSecondary">
                                            Usuario: {menu.usuario.nombre_usuario}
                                        </Typography>
                                        <Typography variant="body2" component="div">
                                            <strong>Platos:</strong>
                                            {menu.plato.map((plato, index) => (
                                                <div key={index} className={classes.item}>
                                                    {plato.nombre} - {plato.cantidad}
                                                </div>
                                            ))}
                                        </Typography>
                                        <Typography variant="body2" component="div">
                                            <strong>Bebidas:</strong>
                                            {menu.bebida.map((bebida, index) => (
                                                <div key={index} className={classes.item}>
                                                    {bebida.nombre} - {bebida.cantidad}
                                                </div>
                                            ))}
                                        </Typography>
                                    </CardContent>
                                </Card>
                            </Grid>
                        ))}
                </Grid>
            </DashboardCard>
            <Snackbar
                open={snackbarOpen}
                autoHideDuration={6000}
                onClose={handleCloseSnackbar}
                message={snackbarMessage}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'right',
                }}
            />
            <CreateMenu open={dialogOpen} onClose={handleCloseDialog} />
            <UpdateMenu menu={todayMenu} open={openUpdateMenu} onClose={() => setOpenUpdateMenu(false)} />

        </PageContainer>
    );
};

export default Menu;