import { gql } from "@apollo/client";

const MESA_DELETE_MUTATION = gql`
    mutation DeleteMesa($id: ID!){
        deleteMesa(id: $id)
    }
`;

export default MESA_DELETE_MUTATION;
