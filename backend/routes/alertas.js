const router = require('express').Router();
const { getPool, sql } = require('../db');
const { verificarToken } = require('../middleware/auth');

router.get('/', verificarToken, async (req, res) => {
    try {
        const pool = await getPool();
        const result = await pool.request()
            .query(`SELECT a.*, ar.nombre AS nombre_area
              FROM Alerta a
              JOIN AreaRiego ar ON a.id_area = ar.id_area
              ORDER BY a.fecha_generacion DESC`);
        res.json(result.recordset);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.patch('/:id/leer', verificarToken, async (req, res) => {
    try {
        const pool = await getPool();
        await pool.request()
            .input('id', sql.BigInt, req.params.id)
            .query(`UPDATE Alerta
              SET leida = 1,
                  fecha_lectura = GETDATE()
              WHERE id_alerta = @id`);
        res.json({ ok: true });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;