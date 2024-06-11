import { gql } from "@apollo/client";

const USUARIO_DELETE_MUTATION = gql`
    mutation DeleteUsuario($id: ID!){
        deleteUsuario(id: $id)
    }
`;

export default USUARIO_DELETE_MUTATION;
