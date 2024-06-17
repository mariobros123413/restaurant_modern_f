import { gql } from "@apollo/client";

const MESA_UPDATE_MUTATION = gql`
    mutation UpdateMesaByNro($nro: Int!, $capacidad: Int!, $disponible: Boolean!){
        updateMesaByNro(nro: $nro, capacidad: $capacidad, disponible: $disponible) {
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

export default MESA_UPDATE_MUTATION;
