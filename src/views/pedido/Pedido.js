import React, { useState, useEffect } from 'react';
import PageContainer from 'src/components/container/PageContainer';
import DashboardCard from '../../components/shared/DashboardCard';
import { Typography, Button, TextField, Card, CardContent, CardActions, Dialog, DialogTitle, DialogContent, Snackbar, DialogActions } from '@mui/material';
import api from 'src/axiosInstance';
import { jsPDF } from "jspdf";
import 'jspdf-autotable';
import FACTURA_MUTATION from 'src/graphql/factura_mutations';
import { useMutation } from '@apollo/client';
const Pedido = () => {
  const [precios, setPrecios] = useState([]);
  const [preciosb, setPreciosb] = useState([]);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [openModal, setOpenModal] = useState(false);
  const [pedidoSeleccionado, setPedidoSeleccionado] = useState(null);
  const [createFactura] = useMutation(FACTURA_MUTATION);
  const [preciosCompletos, setPreciosCompletos] = useState(false);
  const [preciosCompletosb, setPreciosCompletosb] = useState(false);
  const [pedidos, setPedidos] = useState([]);
  const [pageSizeInput, setPageSizeInput] = useState(''); // Estado para el input de tamaño de página

  var [paginaInfo, setPaginaInfo] = useState({
    totalPaginas: 0,
    totalElementos: 0,
    paginaActual: 0,
    pageSize: 10, // Tamaño de página predeterminado
  });

  const handleOpenModal = (pedido) => {
    setPedidoSeleccionado(pedido);
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
  };
  useEffect(() => {
    obtenerPedidos(0);
  }, []);

  const obtenerPedidos = async (page) => {
    try {
      console.log("Pagina que necesito : " + paginaInfo.pageSize);

      const response = await api.get(`/pedido/paginacion?page=${page}&size=${paginaInfo.pageSize}`);
      setPedidos(response.data.data); // Aquí asumo que la API devuelve un objeto con 'data' como arreglo de pedidos
      setPaginaInfo((prevPaginaInfo) => ({
        ...prevPaginaInfo,
        totalPaginas: response.data.paginaInfo.totalPaginas,
        totalElementos: response.data.paginaInfo.totalElementos,
        paginaActual: response.data.paginaInfo.paginaActual,
      }));
    } catch (error) {
      console.error('Error al obtener pedidos:', error);
    }
  };
  const handlePaginaAnterior = () => {
    if (paginaInfo.paginaActual > 0) {
      obtenerPedidos(parseInt(paginaInfo.paginaActual) - 1); // Restar 1 a la página actual
    }
  };

  const handlePaginaSiguiente = () => {
    if (paginaInfo.paginaActual < parseInt(paginaInfo.totalPaginas) - 1) {
      obtenerPedidos(parseInt(paginaInfo.paginaActual) + 1); // Sumar 1 a la página actual
    }
  };
  const handlePageSizeChange = (event) => {
    setPageSizeInput(event.target.value);
  };

  const handleSubmitPageSize = () => {
    if (pageSizeInput.trim() !== '') {
      const newPageSize = parseInt(pageSizeInput, 10); // Convertir a número
      if (!isNaN(newPageSize) && newPageSize > 0) {
        console.log(newPageSize)
        setPaginaInfo((prevPaginaInfo) => ({
          ...prevPaginaInfo,
          pageSize: newPageSize,
        }));
        console.log(paginaInfo.pageSize)

        obtenerPedidos(0); // Volver a obtener los pedidos con la nueva página 0
      } else {
        console.error('Tamaño de página no válido');
      }
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
        const precio = parseFloat(precios[index]); 
        const total = cantidad * precio;
        return { ...item, precio, total }; 
      });

      const bebidasConPrecio = bebidas.map((item, index) => {
        const cantidad = item.cantidad;
        const precio = parseFloat(preciosb[index]);
        const total = cantidad * precio;
        return { ...item, precio, total }; 
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
          id_usuario: "8102396616383947215",
          total: totalGeneral,
          fecha: fechaActual,
          pedido: pedido
        }
      });
      const doc = new jsPDF();
      let yPos = 20;
      doc.text(`Detalles del Pedido : ${response.data.createFactura.nro}`, 10, 10);
      doc.setFontSize(12);

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
        {/* <Button color="primary" variant="contained" size="large" onClick={handleOpenCreate}>
          Registrar Pedido +
        </Button> */}
        {/* Bucle para mostrar tarjetas de eventos */}
        {pedidos.map((pedido) => (
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
        {/* Controles de paginación */}
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
      </DashboardCard>


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
                    value={precios[index] ?? ''}
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
                    value={preciosb[index] ?? ''}
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

export default Pedido;