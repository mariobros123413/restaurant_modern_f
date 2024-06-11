import jsPDF from 'jspdf';
import 'jspdf-autotable';

const handleGenerarFactura = async (pedidoSeleccionado, id_factura) => {
    try {
        const platos = pedidoSeleccionado.plato;
        const bebidas = pedidoSeleccionado.bebida;

        const headers = ['Cantidad', 'Nombre'];
        const doc = new jsPDF();
        let yPos = 20;

        doc.text(`Detalles del Pedido : ${id_factura}`, 10, 10);
        doc.setFontSize(12);
        doc.text(`Nro Mesa: ${pedidoSeleccionado.nro_mesa}`, 10, yPos);
        yPos += 10;
        doc.text(`Nombre del Comensal: ${pedidoSeleccionado.nombre_comensal}`, 10, yPos);
        yPos += 10;
        doc.text(`Fecha: ${pedidoSeleccionado.fecha} ${pedidoSeleccionado.hora}`, 10, yPos);
        yPos += 10;
        yPos += 10;
        doc.text('Platos:', 8, yPos);
        yPos += 10;
        doc.autoTable({
            startY: yPos,
            head: [headers],
            body: platos.map(item => [item.cantidad, item.nombre]),
        });
        yPos = doc.autoTable.previous.finalY + 5;
        // Agregar bebidas a la tabla
        yPos = doc.autoTable.previous.finalY + 10;
        doc.text('Bebidas:', 10, yPos);
        yPos += 10;
        doc.autoTable({
            startY: yPos,
            head: [headers],
            body: bebidas.map(item => [item.cantidad, item.nombre]),
        });
        yPos = doc.autoTable.previous.finalY + 5;
        yPos = doc.autoTable.previous.finalY + 10;

        doc.save(`factura_${id_factura}.pdf`);
    } catch (error) {
        console.error('Error al generar factura:', error.message);
    }
};

export default handleGenerarFactura;
