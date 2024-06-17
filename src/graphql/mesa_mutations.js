import { gql } from "@apollo/client";

const MESA_MUTATION = gql`
    mutation CreateMesa($id_usuario: String!, $nro: Int!, $capacidad: Int!, $disponible: Boolean!){
        createMesa(id_usuario: $id_usuario, nro: $nro, capacidad: $capacidad, disponible: $disponible) {
            id
            nro
            capacidad
            disponible
            usuario {
                id
                nombre_usuario
                password
                role
            }
        }
    }
`;

export default MESA_MUTATION;
