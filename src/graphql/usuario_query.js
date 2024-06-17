import { gql } from "@apollo/client";

const USUARIO_QUERY = gql`
query GetUsers {
    getUsers {
        id
        nombre_usuario
        email
        password
        role
    }
}
`;

export default USUARIO_QUERY;
