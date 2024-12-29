import sql from 'mssql';

// Ingresa los datos de tu base de datos
const config = {
    user: 'SA',
    password: 'Hura2341',
    server: 'localhost',
    database: 'GDA0044_OT_MiguelQueme',
    options: {
        encrypt: true,
        trustServerCertificate: true
    },
};

// Generamos una conexion singleton para mantener una sola conexion abierta hacia la db
let pool;

async function conectarDB() {
    if (!pool) { //Si la conexion no ha sido creada la creamos, si ya existe usamos la misma conexion
        try {
            pool = await sql.connect(config);
            console.log('Conectado exitosamente a la DB');
        } catch (e) {
            console.error('Conexion fallida: ' + e.message);
            pool = null;
        }
    }
    return pool;
}

export { sql, conectarDB };
