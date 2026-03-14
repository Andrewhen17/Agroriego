const router = require('express').Router();
const { getPool, sql } = require('../db');
const { verificarToken } = require('../middleware/auth');

router.get('/', verificarToken, async (req, res) => {
    try {
        const pool = await getPool();
        const result = await pool.request()
            .query(`SELECT a.*, p.nombre AS nombre_predio
              FROM AreaRiego a
              JOIN Predio p ON a.id_predio = p.id_predio`);
        res.json(result.recordset);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.get('/:id/telemetria', verificarToken, async (req, res) => {
    const { desde, hasta } = req.query;
    try {
        const pool = await getPool();

        let query = `SELECT TOP 100 * FROM LecturaTelemetria
                 WHERE id_area = @id`;
        if (desde && hasta) {
            query = `SELECT * FROM LecturaTelemetria
               WHERE id_area = @id
               AND fecha_hora BETWEEN @desde AND @hasta`;
        }

        const request = pool.request()
            .input('id', sql.VarChar, req.params.id);

        if (desde && hasta) {
            request
                .input('desde', sql.DateTime, new Date(desde))
                .input('hasta', sql.DateTime, new Date(hasta));
        }

        const result = await request.query(query + ' ORDER BY fecha_hora DESC');
        res.json(result.recordset);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.put('/:id/config', verificarToken, async (req, res) => {
    const { capacidad_campo, punto_marchitez, estatus_activo,
        nombre, tipo_cultivo, tipo_tierra, tamano_hectareas } = req.body;
    try {
        const pool = await getPool();
        await pool.request()
            .input('id', sql.VarChar, req.params.id)
            .input('cap', sql.Decimal(5, 2), capacidad_campo)
            .input('mar', sql.Decimal(5, 2), punto_marchitez)
            .input('est', sql.Bit, estatus_activo)
            .input('nombre', sql.VarChar, nombre)
            .input('cultivo', sql.VarChar, tipo_cultivo)
            .input('tierra', sql.VarChar, tipo_tierra)
            .input('tam', sql.Decimal(8, 2), tamano_hectareas)
            .query(`UPDATE AreaRiego
              SET capacidad_campo = @cap,
                  punto_marchitez = @mar,
                  estatus_activo  = @est,
                  nombre          = @nombre,
                  tipo_cultivo    = @cultivo,
                  tipo_tierra     = @tierra,
                  tamano_hectareas = @tam
              WHERE id_area = @id`);
        res.json({ ok: true });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;