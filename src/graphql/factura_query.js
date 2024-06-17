import { gql } from "@apollo/client";

const FACTURA_QUERY = gql`
    query GetFacturas {
        getFacturas {
            nro
            total
            fecha
            id_usuario {
                id
                nombre_usuario
                password
                role
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