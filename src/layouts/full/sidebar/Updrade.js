import React from 'react';



export const Upgrade = () => {
    const localData = window.localStorage.getItem('loggedFocusEvent');
    const localDataParsed = localData ? JSON.parse(localData) : null;
    const token = localDataParsed ? JSON.parse(localDataParsed.token) : null;
    if (token) {
        return <></>;
    }
    return (
        // <Box
        //     display={'flex'}
        //     alignItems="center"
        //     gap={2}
        //     sx={{ m: 3, p: 3, bgcolor: `${'primary.light'}`, borderRadius: '8px' }}
        // >
        //     <>
        //         <Box textAlign="center" p={3} boxShadow={5} borderRadius={8} bgcolor="info.main" color="white">
        //             <Typography variant="h6" mb={2}>¡Obtén Acceso Ilimitado!</Typography>
        //             <Typography variant="body1" mb={2}>Desbloquea funciones exclusivas con nuestro plan premium.</Typography>
        //             {!isLoggedIn && (
        //                 <Link to="/auth/register" style={{ textDecoration: 'none' }}>
        //                     <Button color="primary" variant="contained" size="small">
        //                         Registrarse Ahora
        //                     </Button>
        //                 </Link>
        //             )}

        //             {/* Si el usuario ha iniciado sesión, muestra el botón de actualizar */}
        //             {isLoggedIn && (
        //                 <Button color="primary" target="_blank" href="/suscripcion" variant="contained" size="small">
        //                     Actualizar Ahora
        //                 </Button>
        //             )}
        //             <Box mt={2}>
        //                 <img alt="Beneficios Premium" src={img1} width={100} />
        //             </Box>
        //         </Box>

        //     </>
        // </Box>
        <></>
    );
};
