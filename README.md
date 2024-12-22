# GDA0041-OT-MiguelQueme

Proyecto generado para la segunda fase del Desafio Web 360. Consta de una API para el manejo de una tienda en linea, hecho a base de
Node.js y Express.

## Table of Contents.
- [Instalación](#instalación)
- [Uso](#uso)
- [API Endpoints](#resumen-de-api-endpoints)


## Instalación.

### Requisitos.
- Node.js
- SQL Server

### Setup.
1. Clona el repositorio:
   ```bash
   git clone https://github.com/OkKid-A/GDA0041-OT-MiguelQueme.git
   cd GDA0041-OT-MiguelQueme

2. Instala las dependencias:
    ``` bash
   npm install

3. Configura la conexion a base de datos en `/config.db.js`:
    ```bash
    const config = {
        user: 'tu-usuario',
        password: 'tu-contraseña-aqui',
        server: 'localhost',
        database: 'GDA0041_OT_MiguelQueme',
        options: {
        encrypt: true,
        trustServerCertificate: true
    }
   };

4. Inicia el servidor:
   ```bash
    npm start

## Uso.
Podrás acceder a la API a traves del puerto `3000`

    http://localhost:3000/

### Resumen de API Endpoints.

#### Manejo de sesiones de usuario.
- **Login**: `POST /auth/login`
- **Logout**: `POST /auth/logout`

#### Rutas principales.

| Objeto     | Endpoint    | Descripción                                                                 |
|------------|-------------|-----------------------------------------------------------------------------|
| Categorías | /categorias | Categorías a la que pertenecen los productos.                               |
| Productos  | /productos  | Maneja los productos que se venderán a los usuarios.                        |
| Usuarios   | /usuarios   | Utilizado por los operadores para manejar usuarios.                         |
| Clientes   | /clientes   | Empresas a las que pueden pertenecer los usuarios si no son independientes. |
| Estados    | /estados    | Estados posibles de las entidades, principalmente Activo e Inactivo.        |
| Ordenes    | /ordenes    | Maestro detalle para el registro de ordenes.                                |

