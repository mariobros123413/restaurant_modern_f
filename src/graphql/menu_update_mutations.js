import { gql } from "@apollo/client";

const MENU_UPDATE_MUTATION = gql`
    mutation UpdateMenu($id: ID!, $fecha: String!, $plato: [PlatoInput!]!, $bebida: [BebidaInput!]!){
        updateMenu(id: $id, fecha: $fecha, plato: $plato, bebida: $bebida) {
            id
            fecha
            usuario {
                id
                nombre_usuario
                password
                role
            }
            plato {
                cantidad
                nombre
            }
            bebida {
                cantidad
                nombre
            }
        }    
    }
`;

export default MENU_UPDATE_MUTATION;
