import { gql } from "@apollo/client";

const FACTURA_QUERY = gql`
    query Facturas {
        facturas {
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
                plato {
                    cantidad
                    nombre
                }
                bebida {
                    cantidad
                    nombre
                }
            }
        }
    }
`;

export default FACTURA_QUERY;