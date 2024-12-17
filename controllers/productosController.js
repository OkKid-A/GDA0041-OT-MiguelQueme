const {sql} = require('../config/db.js');

// Obtiene los datos de cada producto activo
exports.obtenerProductos = async (req, res) => {
    const userId = req.user.userId; // Confirmamos que el token exista en la request

    if (!userId) {
        return res.status(401).send('No autorizado: No has iniciado sesion.');
    }

    try{
        const resultado = await sql.query('SELECT * FROM productosActivos');
        res.json(resultado.recordset);
    } catch (e){
        res.status(404).send('Error al recuperar productos activos: '+e.message);
    }
}

exports.obtenerProductoPorId = async (req, res) => {
    const id_producto = req.params.id;
    const userId = req.user.userId; // Confirmamos que el token exista en la request

    if (!userId) {
        return res.status(401).send('No autorizado: No has iniciado sesion.');
    }

    try {
        const resultado = await sql.query(`
            EXEC seleccionarProducto 
                @id_producto= ${id_producto}
        `)
    } catch (e) {
        res.status(404).send('Error al recuperar el producto: '+e.message);
    }
}

exports.insertarProducto = async (req, res) => {
    const { nombre, marca, codigo, stock, precio, fecha_creacion, foto, id_categoria, id_estado } = req.body;
    const userId = req.user.userId; // Confirmamos que el token exista en la request

    if (!userId) {
        return res.status(401).send('No autorizado: No has iniciado sesion.');
    }

    try {
        const result = await sql.query(`
      EXEC insertarProducto 
        @nombre = '${nombre}', 
        @marca = '${marca}', 
        @codigo = '${codigo}', 
        @stock = ${stock}, 
        @precio = ${precio}, 
        @fecha_creacion = '${fecha_creacion}', 
        @foto = ${foto ? `'${foto}'` : 'NULL'}, 
        @id_categoria = ${id_categoria}, 
        @id_usuario = ${userId}, 
        @id_estado = ${id_estado};
    `);
        res.status(201).send('Producto creado ');
    } catch (err) {
        res.status(500).send('Server Error');
    }
};

exports.editarProducto = async (req, res) => {
    const id_producto = req.params.id;
    const { nombre, marca, codigo, stock, precio, fecha_creacion, foto, id_categoria, id_estado } = req.body;
    const userId = req.user.userId;

    if (!userId) {
        return res.status(401).send('No autorizado: No has iniciado sesion.');
    }

    try {
        const result = await sql.query(`
          EXEC actualizarProducto
            @id_producto = ${id_producto}, 
            @nombre = ${nombre ? `'${nombre}'` : 'NULL'}, 
            @marca = ${marca ? `'${marca}'` : 'NULL'}, 
            @codigo = ${codigo ? `'${codigo}'` : 'NULL'}, 
            @stock = ${stock !== undefined ? stock : 'NULL'}, 
            @precio = ${precio !== undefined ? precio : 'NULL'}, 
            @fecha_creacion = ${fecha_creacion ? `'${fecha_creacion}'` : 'NULL'}, 
            @foto = ${foto ? `'${foto}'` : 'NULL'}, 
            @id_categoria = ${id_categoria !== undefined ? id_categoria : 'NULL'}, 
            @id_usuario = ${userId}, 
            @id_estado = ${id_estado !== undefined ? id_estado : 'NULL'};
        `);
        res.status(201).send('Producto actualizado con exito.');
    } catch (err) {
        res.status(500).send('Error al intentar actualizar el producto: '+err.message);
    }
};

exports.desactivarProducto = async (req, res) => {
    const id_producto = req.params.id;
    const userId = req.user.userId;

    if (!userId) {
        return res.status(401).send('No autorizado: No has iniciado sesion.');
    }

    try {
        const result = await sql.query(`
            EXEC inactivarProducto 
                @id_producto = ${id_producto};
        `);
        res.status(201).send('Producto inactivado con exito.');
    } catch (err) {
        res.status(500).send('Error al intentar actualizar el producto: '+err.message);
    }
};

