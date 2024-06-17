import { gql } from '@apollo/client';

const UPDATE_USUARIO_MUTATION = gql`
  mutation UpdateUsuario($usuario: NewUser!) {
    updateUsuario(usuario: $usuario) {
      id
      nombre_usuario
      email
      password
      role
    }
  }
`;

export default UPDATE_USUARIO_MUTATION;
