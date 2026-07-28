const { Pool } = require('pg');
const pool = new Pool({
  connectionString: 'postgresql://postgres:admin@refind-db.postgres.database.azure.com:5432/refind?sslmode=require'
});

async function verificar() {
  try {
    console.log('=== USUARIOS ===');
    const users = await pool.query('SELECT id, nombre, correo, id_rol FROM usuarios ORDER BY id');
    users.rows.forEach(u => console.log(`  [${u.id}] ${u.nombre} - ${u.correo} (rol: ${u.id_rol})`));

    console.log('\n=== OBJETOS ===');
    const objs = await pool.query(`
      SELECT o.id, o.titulo, o.estado, o.ubicacion, u.nombre as usuario 
      FROM objetos o 
      INNER JOIN usuarios u ON o.id_usuario = u.id 
      WHERE o.activo = TRUE 
      ORDER BY o.id
    `);
    objs.rows.forEach(o => console.log(`  [${o.id}] ${o.titulo} (${o.estado}) - ${o.ubicacion} - por: ${o.usuario}`));

    console.log('\n=== COMENTARIOS ===');
    const comments = await pool.query('SELECT COUNT(*) as total FROM comentarios');
    console.log(`  Total: ${comments.rows[0].total}`);

    console.log('\n=== MENSAJES ===');
    const msgs = await pool.query('SELECT COUNT(*) as total FROM mensajes');
    console.log(`  Total: ${msgs.rows[0].total}`);

    console.log('\n=== ESTADISTICAS ===');
    const stats = await pool.query(`
      SELECT 
        (SELECT COUNT(*) FROM usuarios WHERE activo = TRUE) as usuarios,
        (SELECT COUNT(*) FROM objetos WHERE activo = TRUE) as objetos,
        (SELECT COUNT(*) FROM objetos WHERE activo = TRUE AND estado = 'encontrado') as encontrados,
        (SELECT COUNT(*) FROM objetos WHERE activo = TRUE AND estado = 'perdido') as perdidos
    `);
    const s = stats.rows[0];
    console.log(`  Usuarios activos: ${s.usuarios}`);
    console.log(`  Objetos totales: ${s.objetos}`);
    console.log(`  Encontrados: ${s.encontrados}`);
    console.log(`  Perdidos: ${s.perdidos}`);
  } catch (err) {
    console.error('Error:', err.message);
  } finally {
    await pool.end();
  }
}
verificar();
