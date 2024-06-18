import { gql } from "@apollo/client";

const FACTURA_QUERY = gql`
    query GetFacturasEntreFechas ($fechaInicio : String!, $fechaFin: String!, $page: Int!, $size: Int!) {
        getFacturasEntreFechas(fechaInicio: $fechaInicio, fechaFin: $fechaFin, page: $page, size: $size) {
            paginaInfo {
                totalPaginas
                totalElementos
                paginaActual
                pageSize
            }
            facturas {
                nro
                total
                fecha
                id_usuario {
                    id
                    nombre_usuario
                    email
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
                }
           }
    }
}

`;

export default FACTURA_QUERY;