import React, { useState, useEffect } from 'react';
import PageContainer from 'src/components/container/PageContainer';
import DashboardCard from '../../components/shared/DashboardCard';
import { Typography, Button, TextField, Card, CardContent, CardActions, Dialog, DialogTitle, DialogContent, DialogContentText, Snackbar, DialogActions } from '@mui/material';
import api from 'src/axiosInstance';
import { jsPDF } from "jspdf";
import 'jspdf-autotable';
import FACTURA_MUTATION from 'src/graphql/factura_mutations';
import { useMutation } from '@apollo/client';
const Asistencia = () => {

  const localData = window.localStorage.getItem('loggedFocusEvent');
  const localDataParsed = JSON.parse(localData);
  const userData = JSON.parse(localDataParsed.token);
  const [asistencias, setAsistencias] = useState([]);
  const [precios, setPrecios] = useState([]);
  const [preciosb, setPreciosb] = useState([]);

  const [open, setOpen] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const handleClose = () => setOpen(false);
  const [codigo, setCodigo] = useState('');
  const [openElim, setOpenElim] = useState(false);
  const handleCloseElim = () => setOpenElim(false);
  const [openModal, setOpenModal] = useState(false);
  const [pedidoSeleccionado, setPedidoSeleccionado] = useState(null);
  const [createFactura] = useMutation(FACTURA_MUTATION);
  const [preciosCompletos, setPreciosCompletos] = useState(false);
  const [preciosCompletosb, setPreciosCompletosb] = useState(false);

  const handleOpenModal = (pedido) => {
    setPedidoSeleccionado(pedido);
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
  };
  const handleActualizarCuenta = async () => {
    try {
      // Usa el id del evento almacenado para hacer la solicitud de eliminación
      // await api.delete(`/evento/eliminarEvento/${eventoAEliminar}`);
      setOpenElim(false); // Cierra el diálogo después de eliminar con éxito
      obtenerAsistencias();
    } catch (error) {
      console.error('Error al eliminar evento:', error);
    }
  };
  const handleCodigoChange = (event) => {
    setCodigo(event.target.value);
  };
  useEffect(() => {
    obtenerAsistencias();
  }, []);
  const obtenerAsistencias = async () => {
    try {
      const response = await api.get(`/pedido`);

      setAsistencias(response.data);
    } catch (error) {
      console.error('Error al obtener eventos:', error);
    }
  };
  const parsePlato = (platoString) => {
    try {
      // Eliminar corchetes y espacios al inicio y final de la cadena
      // eslint-disable-next-line
      const matches = platoString.match(/\{cantidad:\s*\d+,\s*nombre:\s*[^\}]+\}/g);

      // Crear un array para almacenar los objetos de plato
      const platoObj = [];

      // Iterar sobre cada coincidencia
      matches.forEach(match => {
        // Usar expresión regular para extraer la cantidad y el nombre del plato de la coincidencia actual
        // eslint-disable-next-line
        const itemMatch = /\{cantidad:\s*(\d+),\s*nombre:\s*([^\}]+)\}/.exec(match);
        if (itemMatch) {
          // Obtener la cantidad y el nombre del plato
          const cantidad = parseInt(itemMatch[1], 10); // Convertir la cantidad a entero
          const nombre = itemMatch[2].trim(); // Eliminar espacios alrededor del nombre

          // Agregar el objeto de plato al array
          platoObj.push({ nombre, cantidad });
        }
      });
      return platoObj;
    } catch (error) {
      console.error('Error al parsear el plato:', error);
      return [];
    }
  };


  const handleCreateAsistencia = async () => {
    if (!codigo) {
      // Si algún campo está vacío, muestra un Snackbar de error
      setSnackbarMessage('Todos los campos son obligatorios');
      setSnackbarOpen(true);
      return;
    }

    const horaActual = new Date().toLocaleTimeString();
    try {
      await api.post('/evento/ingresarEvento', {
        codigo: codigo,
        horallegada: horaActual,
        idusuario: userData.id,
        iscamarografo: userData.iscamarografo,
      });

      // Si la solicitud fue exitosa, mostrar un mensaje de éxito
      setSnackbarMessage('Has ingresado al evento');
      setSnackbarOpen(true);

      // Cerrar el modal y actualizar las asistencias
      setOpen(false);
      obtenerAsistencias();
    } catch (error) {
      // Si hay un error, mostrar un mensaje de error
      setSnackbarMessage('Error al unirse al evento, necesita estar invitado');
      setSnackbarOpen(true);
    }
  };

  const handleGenerarFactura = async () => {
    try {
      const platos = parsePlato(pedidoSeleccionado.plato);
      const bebidas = parsePlato(pedidoSeleccionado.bebida);
      const fechaActual = new Date().toISOString().split('T')[0];
      const pedido = {
        nro_pedido: pedidoSeleccionado.nro_pedido.toString(),
        id_mesero: pedidoSeleccionado.id_mesero.toString(),
        nro_mesa: pedidoSeleccionado.nro_mesa,
        nombre_comensal: pedidoSeleccionado.nombre_comensal,
        fecha: pedidoSeleccionado.fecha,
        hora: pedidoSeleccionado.hora,
        estado: pedidoSeleccionado.estado,
        plato: platos,
        bebida: bebidas,
        extras: pedidoSeleccionado.extras
      };



      // Encabezado de la tabla
      const headers = ['Cantidad', 'Nombre', 'Precio', 'Total'];

      const platosConPrecio = platos.map((item, index) => {
        const cantidad = item.cantidad;
        const precio = parseFloat(precios[index]); // Obtener el precio del input
        const total = cantidad * precio;
        return { ...item, precio, total }; // Agregar precio y total al objeto del plato
      });

      // Recorrer las bebidas (si es necesario) y calcular el total por cada una
      const bebidasConPrecio = bebidas.map((item, index) => {
        const cantidad = item.cantidad;
        const precio = parseFloat(precios[index]); // Obtener el precio del input
        const total = cantidad * precio;
        return { ...item, precio, total }; // Agregar precio y total al objeto del plato    
      });
      // Calcular el total de todos los platos
      const totalPlatos = platosConPrecio.reduce((total, plato) => total + (plato.cantidad * plato.precio), 0);

      // Calcular el total de todas las bebidas
      const totalBebidas = bebidasConPrecio.reduce((total, bebida) => total + (bebida.cantidad * bebida.precio), 0);

      // Sumar los totales de platos y bebidas para obtener el total general
      const totalGeneral = totalPlatos + totalBebidas;
      console.log("TOTAL : " + totalGeneral)
      const response = await createFactura({
        variables: {
          id_usuario: "666751c4b3bf20449ba12ec0",
          total: totalGeneral,
          fecha: fechaActual,
          pedido: pedido
        }
      });
      const doc = new jsPDF();
      let yPos = 20;

      doc.text(`Detalles del Pedido : ${response.data.createFactura.nro}`, 10, 10);
      doc.setFontSize(12);
      console.log("response : " + response.data.createFactura.nro)


      // Agregar platos a la tabla
      doc.text('Platos:', 10, yPos);
      yPos += 10;
      doc.autoTable({
        startY: yPos,
        head: [headers],
        body: platosConPrecio.map(item => [item.cantidad, item.nombre, item.precio, item.total]),
      });
      yPos = doc.autoTable.previous.finalY + 5;

      doc.autoTable({
        startY: yPos,
        body: [['', '', 'Total de Platos:', totalPlatos.toFixed(2)]],
      });
      // Agregar bebidas a la tabla
      yPos = doc.autoTable.previous.finalY + 10;
      doc.text('Bebidas:', 10, yPos);
      yPos += 10;
      doc.autoTable({
        startY: yPos,
        head: [headers],
        body: bebidasConPrecio.map(item => [item.cantidad, item.nombre, item.precio, item.total]),
      });
      yPos = doc.autoTable.previous.finalY + 5;
      doc.autoTable({
        startY: yPos,
        body: [['', '', 'Total de Bebidas:', totalBebidas.toFixed(2)]],
      });

      yPos = doc.autoTable.previous.finalY + 10;
      doc.autoTable({
        startY: yPos,
        body: [['', '', 'Total General:', totalGeneral.toFixed(2)]],
      });
      doc.save(`factura ${response.data.createFactura.nro}.pdf`);
    } catch (error) {
      console.error('Error al crear la mesa:', error.message);
      if (error.graphQLErrors) {
        error.graphQLErrors.forEach(({ message, locations, path }) =>
          console.error(`[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`)
        );
      }
      setSnackbarMessage('Error al generar la factura');
      setSnackbarOpen(true);
    }

  };
  const handlePrecioChange = (value, index) => {
    const newPrecios = [...precios];
    newPrecios[index] = value;
    setPrecios(newPrecios);
    const todosCompletos = newPrecios.every(precios => precios !== '');
    setPreciosCompletos(todosCompletos);
  };
  const handlePrecioChangeb = (value, index) => {
    const newPrecios = [...preciosb];
    newPrecios[index] = value;
    setPreciosb(newPrecios);
    const todosCompletos = newPrecios.every(preciosb => preciosb !== '');
    setPreciosCompletosb(todosCompletos);
  };
  return (
    <PageContainer title="Pedidos" description="recuerda tus asistencias">

      <DashboardCard title="Tus Pedidos">
        {/* <Button color="primary" variant="contained" size="large" onClick={handleOpenCreate}>
          Registrar Pedido +
        </Button> */}
        {/* Bucle para mostrar tarjetas de eventos */}
        {asistencias.map((pedido) => (
          <Card key={pedido.nro_pedido} style={{ marginTop: '16px' }} >
            <CardContent>
              <Typography variant="h5" component="div">
                Nro Pedido : {pedido.nro_pedido}
              </Typography>
              <Typography color="textSecondary">
                Fecha : {pedido.fecha} {pedido.hora}
              </Typography>
              <Typography color="textSecondary">
                Nombre del Comensal : {pedido.nombre_comensal}
              </Typography>
              <Typography color="textSecondary">
                Estado: {pedido.estado ? 'Entregado' : 'Pendiente'}
              </Typography>
              {/* Puedes agregar más detalles del evento aquí */}
            </CardContent>
            <CardActions>
              <Button onClick={() => handleOpenModal(pedido)}>
                Ver detalles
              </Button>
            </CardActions>
          </Card>
        ))}
      </DashboardCard>
      {open && (
        <div className="modal-background">
          <div className="modal-content">
            <Typography variant="h5" gutterBottom>
              Registrar tu asistencia a un evento
            </Typography>
            <TextField
              label="Código proporcionado en el evento"
              fullWidth
              variant="outlined"
              margin="normal"
              value={codigo}
              onChange={handleCodigoChange}
            />
            <Button variant="contained" color="primary" onClick={handleCreateAsistencia} style={{ marginTop: 16 }}>
              Unirse al Evento
            </Button>
            <Button variant="contained" color="warning" onClick={handleClose} style={{ marginTop: 16, marginLeft: 20 }}>
              Cancelar
            </Button>

          </div>
        </div>
      )}
      {openElim && (
        <Dialog open={openElim} onClose={handleCloseElim} aria-labelledby="draggable-dialog-title">
          <DialogTitle style={{ cursor: 'move' }} id="draggable-dialog-title">
            Actualiza tu Cuenta a Fotógrafo!!
          </DialogTitle>
          <DialogContent>
            <DialogContentText>
              Necesitas actualizar tu cuenta a Fotógrafo para poder subir fotos y empezar con tu negocio de Fotógrafo en nuestra página.
            </DialogContentText>
          </DialogContent>
          <CardActions>
            <Button autoFocus onClick={handleCloseElim} color="primary">
              Cerrar
            </Button>
            <Button onClick={handleActualizarCuenta} color="primary">
              Actualízate
            </Button>
          </CardActions>
        </Dialog>
      )}


      <Dialog
        open={openModal}
        onClose={handleCloseModal}
        aria-labelledby="draggable-dialog-title"
        PaperProps={{
          style: {
            minWidth: '400px', // Ancho mínimo del diálogo
            maxWidth: '80%', // Ancho máximo del diálogo
          },
        }}
      >
        {/* Contenido del modal con los detalles del pedido */}
        {pedidoSeleccionado && (
          <>
            <DialogTitle id="draggable-dialog-title">
              Detalles del Pedido
            </DialogTitle>
            <DialogContent>
              <Typography variant="h3" gutterBottom>Nro Pedido: {pedidoSeleccionado.nro_pedido}</Typography>
              <Typography variant="h6" gutterBottom>Fecha: {pedidoSeleccionado.fecha} {pedidoSeleccionado.hora}</Typography>
              <Typography variant="h6" gutterBottom>Nombre del Comensal: {pedidoSeleccionado.nombre_comensal}</Typography>
              <Typography variant="h6" gutterBottom>Estado: {pedidoSeleccionado.estado ? 'Entregado' : 'Pendiente'}</Typography>
              {/* Convertir plato y bebida de string a objetos */}
              <Typography variant="h3" gutterBottom >Platos :</Typography>

              {pedidoSeleccionado.plato && parsePlato(pedidoSeleccionado.plato).map((item, index) => (
                <div key={index}>
                  <Typography variant="h6" gutterBottom>{item.cantidad}  X  {item.nombre}</Typography>
                  {/* Input para el precio manual */}
                  <TextField
                    label="Precio"
                    variant="outlined"
                    type="number"
                    InputProps={{ inputProps: { min: 0 } }}
                    // Aquí puedes manejar el estado del precio y actualizarlo según sea necesario
                    value={precios[index]}
                    onChange={(e) => handlePrecioChange(e.target.value, index)}
                    required
                  />
                </div>
              ))}
              <Typography variant="h3" gutterBottom >Bebidas :</Typography>
              {pedidoSeleccionado.bebida && parsePlato(pedidoSeleccionado.bebida).map((item, index) => (
                <div key={index}>
                  <Typography variant="h6" gutterBottom key={index}>Bebida: {item.cantidad}  X  {item.nombre}</Typography>
                  <TextField
                    label="Precio"
                    variant="outlined"
                    type="number"
                    InputProps={{ inputProps: { min: 0 } }}
                    // Aquí puedes manejar el estado del precio y actualizarlo según sea necesario
                    value={preciosb[index]}
                    onChange={(e) => handlePrecioChangeb(e.target.value, index)}
                    required
                  />
                </div>
              ))}
              <Typography variant="h4" gutterBottom>Extras: {pedidoSeleccionado.extras}</Typography>
            </DialogContent>
            <DialogActions>
              {(preciosCompletos && preciosCompletosb) ? null : (
                <Typography variant="body2" color="error">¡Por favor, complete todos los precios antes de generar la factura!</Typography>
              )}
              <Button
                variant="contained"
                color="primary"
                onClick={handleGenerarFactura}
                disabled={!preciosCompletos && !preciosCompletosb} // Desactiva el botón si los precios no están completos
              >Generar Factura</Button>
            </DialogActions>

          </>
        )}
      </Dialog>

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

export default Asistencia;