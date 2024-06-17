import { gql } from "@apollo/client";

const MESA_QUERY = gql`
query GetMesas {
    getMesas {
        id
        nro
        capacidad
        disponible
    }
}
`;

export default MESA_QUERY;
