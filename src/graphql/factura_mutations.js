import { gql } from "@apollo/client";

const FACTURA_MUTATION = gql`
    mutation CreateFactura($id_usuario: String!, $total: Float!, $fecha: String!, $pedido: PedidoInput!){
        createFactura(id_usuario: $id_usuario, total: $total, fecha: $fecha, pedido: $pedido) {
            nro
            total
            fecha
            id_usuario {
                id
                nombre_usuario
                password
                isAdmin
            }
            pedido {
                nro_pedido
                id_mesero
                nro_mesa
                nombre_comensal
                fecha
                hora
                estado
                extras
            }
        }
    }
`;

export default FACTURA_MUTATION;
