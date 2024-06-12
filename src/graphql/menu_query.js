import { gql } from "@apollo/client";

const MENU_QUERY = gql`
    query Menus {
        menus {
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

export default MENU_QUERY;
