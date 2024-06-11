// Definición de la interfaz PedidoInput
export const PlatoInput = {
    cantidad: "number",
    nombre: "string"
};

// Definición de la interfaz BebidaInput
export const BebidaInput = {
    cantidad: "number",
    nombre: "string"
};
export const PedidoInput = {
    nro_pedido: "string",
    id_mesero: "string",
    nro_mesa: "number",
    nombre_comensal: "string",
    fecha: "string",
    hora: "string",
    estado: "boolean",
    plato: [PlatoInput],
    bebida: [BebidaInput],
    extras: "string"
};

// Definición de la interfaz PlatoInput

