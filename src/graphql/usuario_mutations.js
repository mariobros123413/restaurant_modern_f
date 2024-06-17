import { gql } from "@apollo/client";

const USUARIO_MUTATION = gql`
    mutation CreateUsuario($usuario: NewUser!){
        createUsuario(usuario: $usuario) {
            id
            nombre_usuario
            email
            password
            role
        }
    }
`;

export default USUARIO_MUTATION;