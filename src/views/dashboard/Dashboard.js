import React from 'react';
import DashboardCard from '../../components/shared/DashboardCard';
import PageContainer from 'src/components/container/PageContainer';
import { Box, Typography } from '@mui/material';

const Dashboard = () => {
  const localData = window.localStorage.getItem('loggedFocusEvent');
  
  if (localData === null) {
    return (
      <PageContainer title="Bienvenido a nuestro Dashboard" description="Bienvenido a nuestro servicio">
        <Box>
          <Typography variant="h5">
            Inicia sesión para ver este Dashboard
          </Typography>
          {/* Puedes agregar más contenido o enlaces de registro aquí */}
        </Box>
      </PageContainer>
    );
  }

  return (
    <DashboardCard title="Bienvenido al Dashboard">
      <iframe
        src="https://diagramapy-v1-10.onrender.com/"
        title="Dashboard"
        width="100%"
        height="800px"
        frameBorder="0"
      />
    </DashboardCard>
  )
};

export default Dashboard;
