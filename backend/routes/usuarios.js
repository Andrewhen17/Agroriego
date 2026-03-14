const router = require('express').Router();
const { getPool, sql } = require('../db');
const { verificarToken } = require('../middleware/auth');

router.get('/', verificarToken, async (req, res) => {
    try {
        const pool = await getPool();
        const result = await pool.request()
            .query('SELECT id_usuario, email, nombre_completo, rol FROM Usuario');
        res.json(result.recordset);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.post('/', verificarToken, async (req, res) => {
    const { email, password_hash, nombre_completo, rol } = req.body;
    try {
        const pool = await getPool();
        await pool.request()
            .input('email', sql.VarChar, email)
            .input('pass', sql.VarChar, password_hash)
            .input('nombre', sql.VarChar, nombre_completo)
            .input('rol', sql.VarChar, rol)
            .query(`INSERT INTO Usuario (email, password_hash, nombre_completo, rol)
              VALUES (@email, @pass, @nombre, @rol)`);
        res.json({ ok: true });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.delete('/:id', verificarToken, async (req, res) => {
    try {
        const pool = await getPool();
        await pool.request()
            .input('id', sql.Int, req.params.id)
            .query('DELETE FROM Usuario WHERE id_usuario = @id');
        res.json({ ok: true });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;