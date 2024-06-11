import { gql } from "@apollo/client";

const USUARIO_UPDATE_MUTATION = gql`
    mutation UpdateUsuario($id:ID!, $nombre_usuario: String!, $password: String!, $isAdmin: Boolean!){
        updateUsuario(id: $id, nombre_usuario: $nombre_usuario, password: $password, isAdmin: $isAdmin) {
            id
            nombre_usuario
            password
            isAdmin
        }
    }
`;

export default USUARIO_UPDATE_MUTATION;