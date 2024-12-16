const {sql} = require('../config/db.js');

// Endpoint para obtener los datos de cada producto activo
exports.obtenerProductos = async (req, res) => {
    try{
        const resultado = await sql.query('SELECT * FROM productosActivos');
        res.json(resultado.recordset);
    } catch (e){
        res.status(500).send('No se han podido recuperar productos.');
    }
}

exports.insertarProducto = async (req, res) => {
    try {

    } catch (e){

    }
}