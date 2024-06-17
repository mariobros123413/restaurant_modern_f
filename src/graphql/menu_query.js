import { gql } from "@apollo/client";

const MENU_QUERY = gql`
    query GetAllMenus {
    getAllMenus {
        id
        fecha
        usuario {
            id
            nombre_usuario
            email
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

export default MENU_QUERY;
