import { gql } from "@apollo/client";

const USUARIO_QUERY = gql`
query Usuarios {
    usuarios {
        id
        nombre_usuario
        password
        isAdmin
    }
}
`;

export default USUARIO_QUERY;
