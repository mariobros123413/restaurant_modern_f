import { gql } from "@apollo/client";

const MESA_BY_NRO_QUERY = gql`
  query Mesas {
    mesas {
      id
      nro
      capacidad
      disponible
    }
    mesaByNro(nro: $nro) {
      id
      nro
      capacidad
      disponible
    }
  }
`;

export default MESA_BY_NRO_QUERY;
