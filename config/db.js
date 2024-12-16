const sql = require("mssql");


// Ingresa los datos de tu base de datos
const config = {
    user: 'SA',
    password: 'Hura2341',
    server: 'localhost',
    database: 'GDA0041_OT_MiguelQueme',
    options: {
        encrypt: true,
        trustServerCertificate: true
    },
};

async function conectarDB(){
    try{
        await sql.connect(config);
        console.log('Conectado exitosamente a la DB');
    } catch(e){
        console.error('Conexion fallida: ' + e.message);
    }
}

module.exports = {
    sql,
    conectarDB
};