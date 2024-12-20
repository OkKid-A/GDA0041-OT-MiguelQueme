const {sql} = require('../config/db.js');

exports.obtenerEstados = async (req, res) => {
    const userId = req.user.id_usuario; // Confirmamos que el token exista en la request

    if (!userId) {
        return res.status(401).send('No autorizado: No has iniciado sesion.');
    }

    try{
        const resultado = await sql.query('SELECT * FROM estadosTodos');
        res.json(resultado.recordset);
    } catch (err){
        res.status(404).send('Error al recuperar productos activos: '+err.message);
    }
};

exports.insertarEstado = async (req, res) => {
    const { nombre} = req.body;
    const userId = req.user.id_usuario; // Confirmamos que el token exista en la request

    if (!userId) {
        return res.status(401).send('No autorizado: No has iniciado sesion.');
    }

    try {
        const resultado = await sql.query(`
            EXEC insertarEstado
            @nombre = '${nombre}';
        `);
        // Obtenemos el id_estado del nuevo estado
        const id_estado = resultado.recordset[0].id_estado;
        res.status(201).send({id_estado,message:'Estado creado exitosamente'});
    } catch (err) {
        res.status(500).send('Error al insertar el producto: '+err.message);
    }
};

exports.editarEstado = async (req, res) => {
    const { nombre} = req.body;
    const userId = req.user.id_usuario; // Confirmamos que el token exista en la request
    const id_estado = req.params.id;

    if (!userId) {
        return res.status(401).send('No autorizado: No has iniciado sesion.');
    }

    try{
        const resultado = await sql.query(`
            EXEC actualizarEstado
            @id_estado = '${id_estado}'
            @nombre = '${nombre}';
        `);
        res.status(201).send({id_estado,message:'Estado editado exitosamente'});
    } catch (err) {
        res.status(500).send('Error al actualizar el estado: '+err.message);
    }
};
