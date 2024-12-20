const {sql} = require('../config/db.js');

// Endpoint para obtener los datos de toda categoria
exports.obtenerCategorias = async (req, res) => {
    const userId = req.user.id_usuario; // Confirmamos que el token exista en la request

    if (!userId) {
        return res.status(401).send('No autorizado: No has iniciado sesion.');
    }

    try{
        const resultado = await sql.query('SELECT * FROM categoriasTodas');
        res.json(resultado.recordset);
    } catch (e){
        res.status(404).send('Error al recuperar todas las categorias: '+e.message);
    }
};

// Endpoint para obtener los datos de cada categorias activo
exports.obtenerCategoriasActivas = async (req, res) => {
    const userId = req.user.id_usuario; // Confirmamos que el token exista en la request

    if (!userId) {
        return res.status(401).send('No autorizado: No has iniciado sesion.');
    }

    try{
        const resultado = await sql.query('SELECT * FROM categoriasActivas');
        res.json(resultado.recordset);
    } catch (e){
        res.status(404).send('Error al recuperar categorias activas: '+e.message);
    }
};

// Endpoint para obtener los datos de solo una categoria
exports.obtenerCategoriaPorId = async (req, res) => {
    const id_categoria = req.params.id;
    const userId = req.user.id_usuario;

    if (!userId) {
        return res.status(401).send('No autorizado: No has iniciado sesion.');
    }

    try {
        const resultado = await sql.query(`
            EXEC seleccionarCategoria 
                @id_categoria = ${id_categoria}
        `)
        res.json(resultado.recordset);
    } catch (e) {
        res.status(404).send('Error al recuperar la categoria: '+e.message);
    }
};

// Endpoint para insertar una categoria
exports.insertarCategoriaProducto = async (req, res) => {
    const { nombre, id_estado } = req.body;
    const userId = req.user.id_usuario;

    if (!userId) {
        return res.status(401).send('No autorizado: No has iniciado sesion.');
    }

    try {
        const result = await sql.query(`
      EXEC actualizarCategoriaProducto 
        @nombre = '${nombre}', 
        @id_estado = ${id_estado}, 
        @id_usuario = ${userId};
    `);
        // Obtener el id_categoria del resultado
        const id_categoria = result.recordset[0].id_categoria;

        res.status(201).json({ id_categoria, message: 'Categoría de producto creada exitosamente' });
    } catch (err) {
        res.status(500).json({ message: 'Error al crear la categoría de producto', error: err.message });
    }
};

// Endpoint para actualizar una categoria
exports.editarCategoria = async (req, res) => {
    const id_categoria = req.params.id;
    const { nombre, id_estado,fecha_creacion } = req.body;
    const userId = req.user.id_usuario;

    if (!userId) {
        return res.status(401).send('No autorizado: No has iniciado sesion.');
    }

    try {
        const result = await sql.query(`
          EXEC actualizarCategoriaProducto 
            @id_categoria = ${id_categoria}, 
            @nombre = ${nombre ? `'${nombre}'` : 'NULL'}, 
            @fecha_creacion = ${fecha_creacion ? `'${fecha_creacion}'` : 'NULL'}, 
            @id_estado = ${id_estado !== undefined ? id_estado : 'NULL'},
       `);
        res.status(201).json( 'Categoría de producto editada exitosamente' );
    } catch (err) {
        res.status(500).json({ message: 'Error al editar la categoría de producto', error: err.message });
    }
};

// Endpoint para inactivar una categoria

exports.desactivarCategoria = async (req, res) => {
    const id_categoria = req.params.id;
    const userId = req.user.id_usuario;

    if (!userId) {
        return res.status(401).send('No autorizado: No has iniciado sesion.');
    }

    try {
        const result = await sql.query(`
            EXEC inactivarCategoria 
                @id_categoria = ${id_categoria};
        `);
        res.status(201).send('Categoria desactivada con exito.');
    } catch (err) {
        res.status(500).send('Error al intentar desactivar el producto: '+err.message);
    }
}
