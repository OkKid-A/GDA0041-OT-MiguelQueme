interface User {
    id_usuario: number;
    correo: string;
    nombre: string;
    apellido: string;
    telefono: string;
    fecha_nacimiento: Date;
    rol: string;
    cliente: string;
    estado: string;
}

export default User;