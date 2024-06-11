import { gql } from "@apollo/client";

const MESA_QUERY = gql`
query Mesas {
    mesas {
        id
        nro
        capacidad
        disponible
    }
}
`;

export default MESA_QUERY;
