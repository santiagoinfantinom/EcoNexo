const fs = require('fs');
const path = require('path');

/**
 * Automatización periódica de actualizaciones de KPIs
 * Ejecutar con: node scripts/automate_kpis_update.js [--schedule "0 0 * * *"]
 * 
 * Niveles de actividad:
 * - ALTA (>= 50 registros): cada 24h
 * - MEDIA (10-49): cada 48h
 * - BAJA (< 10): cada 7 días
 */

const TEMPLATES_DIR = path.resolve(__dirname, '../project_templates');
const STATE_FILE = path.resolve(__dirname, '.kpi_update_state.json');

// Leer/guardar estado
function loadState() {
  if (fs.existsSync(STATE_FILE)) {
    return JSON.parse(fs.readFileSync(STATE_FILE, 'utf8'));
  }
  return {};
}

function saveState(state) {
  fs.writeFileSync(STATE_FILE, JSON.stringify(state, null, 2), 'utf8');
}

// Detectar nivel de actividad
function getActivityLevel(volunteerCount, favoriteCount, eventCount, reviewCount) {
  const totalActivity = (volunteerCount || 0) + (favoriteCount || 0) + (eventCount || 0) + (reviewCount || 0);
  if (totalActivity >= 50) return 'HIGH';
  if (totalActivity >= 10) return 'MEDIUM';
  return 'LOW';
}

// Calcular próxima actualización
function getNextUpdateTime(activityLevel) {
  const now = Date.now();
  let interval;
  
  switch (activityLevel) {
    case 'HIGH':
      interval = 24 * 60 * 60 * 1000; // 24 horas
      break;
    case 'MEDIUM':
      interval = 48 * 60 * 60 * 1000; // 48 horas
      break;
    case 'LOW':
      interval = 7 * 24 * 60 * 60 * 1000; // 7 días
      break;
    default:
      interval = 7 * 24 * 60 * 60 * 1000;
  }
  
  return now + interval;
}

// Generar reporte
function generateReport(state) {
  const lines = [];
  lines.push('# Reporte de Automatización de KPIs');
  lines.push('');
  lines.push(`**Fecha:** ${new Date().toISOString()}`);
  lines.push('');
  lines.push('## Estado de proyectos');
  lines.push('');
  lines.push('| Proyecto | Nivel de Actividad | Próxima Actualización | Última Actualización |');
  lines.push('|----------|-------------------|----------------------|----------------------|');
  
  Object.entries(state).forEach(([projectId, info]) => {
    const actLevel = info.activityLevel || 'DESCONOCIDO';
    const nextUpdate = info.nextUpdate ? new Date(info.nextUpdate).toLocaleDateString('es-ES') : 'N/A';
    const lastUpdate = info.lastUpdate ? new Date(info.lastUpdate).toLocaleDateString('es-ES') : 'Nunca';
    lines.push(`| ${projectId} | ${actLevel} | ${nextUpdate} | ${lastUpdate} |`);
  });
  
  lines.push('');
  lines.push('## Recomendaciones');
  lines.push('');
  lines.push('- **Proyectos ALTA actividad:** actualizar diariamente');
  lines.push('- **Proyectos MEDIA actividad:** actualizar cada 2 días');
  lines.push('- **Proyectos BAJA actividad:** actualizar semanalmente');
  lines.push('');
  
  return lines.join('\n');
}

// Función principal
async function main() {
  const args = process.argv.slice(2);
  const shouldSchedule = args.includes('--schedule');
  const cronPattern = args[args.indexOf('--schedule') + 1] || '0 0 * * *';
  
  console.log('🔄 Automatización de KPIs iniciada...');
  console.log('');
  
  // Cargar estado
  let state = loadState();
  
  // Simular lecturas de actividad (en producción, esto vendría de Supabase)
  const files = fs.readdirSync(TEMPLATES_DIR).filter(f => f.endsWith('.md') && f !== 'index.md');
  
  for (const file of files) {
    const projectId = file.replace('.md', '');
    const filePath = path.join(TEMPLATES_DIR, file);
    const content = fs.readFileSync(filePath, 'utf8');
    
    // Extraer KPIs del archivo
    const volMatch = content.match(/Voluntarios registrados: (\d+|TODO)/);
    const favMatch = content.match(/Favoritos.*?: (\d+|TODO)/);
    const evtMatch = content.match(/Eventos.*?: (\d+|TODO)/);
    const revMatch = content.match(/Valoración media.*?: ([\d.]+|TODO)/);
    
    const volunteerCount = volMatch && volMatch[1] !== 'TODO' ? parseInt(volMatch[1]) : 0;
    const favoriteCount = favMatch && favMatch[1] !== 'TODO' ? parseInt(favMatch[1]) : 0;
    const eventCount = evtMatch && evtMatch[1] !== 'TODO' ? parseInt(evtMatch[1]) : 0;
    const reviewCount = revMatch && revMatch[1] !== 'TODO' ? (parseFloat(revMatch[1]) * 3) : 0; // estimación
    
    const activityLevel = getActivityLevel(volunteerCount, favoriteCount, eventCount, reviewCount);
    const nextUpdate = getNextUpdateTime(activityLevel);
    
    state[projectId] = {
      activityLevel,
      nextUpdate,
      lastUpdate: Date.now(),
      metrics: { volunteerCount, favoriteCount, eventCount }
    };
  }
  
  // Guardar estado
  saveState(state);
  
  // Generar reporte
  const report = generateReport(state);
  const reportFile = path.join(__dirname, '../.kpi_update_report.md');
  fs.writeFileSync(reportFile, report, 'utf8');
  
  console.log('✅ Automatización completada');
  console.log(`📊 Reporte guardado en: ${reportFile}`);
  console.log('');
  
  // Info de scheduling
  if (shouldSchedule) {
    console.log('📅 Para scheduling automático, usa cron o task scheduler:');
    console.log('');
    console.log('**Linux/macOS (crontab):**');
    console.log(`${cronPattern} cd /Users/santiago/econexo && node scripts/fill_project_kpis.js >> logs/kpi_update.log 2>&1`);
    console.log('');
    console.log('**Windows (Task Scheduler):**');
    console.log('Crear tarea con acción: node scripts/fill_project_kpis.js');
    console.log('Triggers: Según nivel de actividad del proyecto');
  }
  
  // Resumen
  const activityStats = Object.values(state).reduce((acc, val) => {
    acc[val.activityLevel] = (acc[val.activityLevel] || 0) + 1;
    return acc;
  }, {});
  
  console.log('📈 Resumen:');
  console.log(`  - Alta actividad: ${activityStats['HIGH'] || 0} proyectos`);
  console.log(`  - Actividad media: ${activityStats['MEDIUM'] || 0} proyectos`);
  console.log(`  - Baja actividad: ${activityStats['LOW'] || 0} proyectos`);

  // ---- Alerting integration ----
  // Send a summary alert when there are HIGH activity projects or if all projects are LOW.
  const alertDry = args.includes('--alert-dry');
  const alertEndpoint = process.env.ALERTS_ENDPOINT || 'http://localhost:3000/api/alerts/send';
  const apiKey = process.env.ALERTS_API_KEY;

  const highCount = activityStats['HIGH'] || 0;
  const lowCount = activityStats['LOW'] || 0;
  const total = Object.values(state).length;

  let shouldAlert = false;
  if (highCount > 0) shouldAlert = true;
  if (lowCount === total && total > 0) shouldAlert = true; // all low

  if (shouldAlert) {
    const subject = `KPIs: ${highCount} HIGH / ${lowCount} LOW (${total})`;
    const messageLines = [];
    messageLines.push(`Resumen de automatización: ${new Date().toLocaleString('es-ES')}`);
    messageLines.push('');
    messageLines.push(`Proyectos con ALTA actividad: ${highCount}`);
    messageLines.push(`Proyectos con BAJA actividad: ${lowCount}`);
    messageLines.push('');
    messageLines.push('Revisa el reporte generado en .kpi_update_report.md');
    const message = messageLines.join('\n');

    const payload = { subject, message, channels: ['slack'] };

    if (alertDry) {
      console.log('🔔 Alert (dry-run) payload:');
      console.log(JSON.stringify(payload, null, 2));
    } else {
      try {
        console.log('🔔 Enviando alerta a', alertEndpoint);
        const res = await fetch(alertEndpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            ...(apiKey ? { 'x-alerts-api-key': apiKey } : {})
          },
          body: JSON.stringify(payload)
        });
        const body = await res.json().catch(() => ({}));
        console.log('Alert response:', res.status, body);
      } catch (err) {
        console.error('Failed to send alert:', err);
      }
    }
  } else {
    console.log('No alert conditions met — no alert sent.');
  }
}

main().catch(err => {
  console.error('Error:', err);
  process.exit(1);
});
