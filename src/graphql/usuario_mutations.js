import { gql } from "@apollo/client";

const USUARIO_MUTATION = gql`
    mutation CreateUsuario($nombreUsuario: String!, $password: String!, $admin: Boolean!){
        createUsuario(nombreUsuario: $nombreUsuario, password: $password, admin: $admin) {
            id
            nombre_usuario
            password
            isAdmin
        }
    }
`;

export default USUARIO_MUTATION;