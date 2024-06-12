import { gql } from "@apollo/client";

const MENU_MUTATION = gql`
    mutation CreateMenu($id_usuario: String!, $fecha: String!, $plato: [PlatoInput!]!, $bebida: [BebidaInput!]!){
        createMenu(id_usuario: $id_usuario, fecha: $fecha, plato: $plato, bebida: $bebida) {
            id
            fecha
            usuario {
                id
                nombre_usuario
                password
                isAdmin
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

export default MENU_MUTATION;
