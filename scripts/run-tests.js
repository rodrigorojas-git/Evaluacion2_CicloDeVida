/**
 * Ejecuta las pruebas unitarias con Jest, obtiene el porcentaje de cobertura
 * y muestra por pantalla:
 *   1) Las pruebas que fallan
 *   2) El codigo que no esta cubierto por pruebas
 *   3) La cobertura total
 *
 * Uso:  npm run test:report
 */
const { spawnSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const raiz = process.cwd();

// Limpia resultados anteriores para no leer datos viejos
['test-results.json', 'coverage'].forEach((p) => {
  fs.rmSync(path.join(raiz, p), { recursive: true, force: true });
});

console.log('=== EJECUTANDO PRUEBAS UNITARIAS CON COBERTURA ===\n');

const run = spawnSync(
  'npx',
  [
    'jest',
    '--coverage',
    '--verbose',
    '--coverageReporters=text',
    '--coverageReporters=lcov',
    '--coverageReporters=json',
    '--coverageReporters=json-summary',
    '--json',
    '--outputFile=test-results.json'
  ],
  { stdio: 'inherit', shell: true }
);

// 1) Pruebas que fallan
console.log('\n=== PRUEBAS QUE FALLAN ===');
if (fs.existsSync('test-results.json')) {
  const r = JSON.parse(fs.readFileSync('test-results.json', 'utf8'));
  let fallas = 0;
  r.testResults.forEach((suite) => {
    const archivo = path.relative(raiz, suite.name);
    suite.assertionResults
      .filter((t) => t.status === 'failed')
      .forEach((t) => {
        fallas++;
        console.log(`FALLA: ${archivo} -> ${t.fullName}`);
      });
    if (suite.status === 'failed' && suite.assertionResults.length === 0) {
      fallas++;
      console.log(`ERROR EN SUITE: ${archivo}`);
    }
  });
  if (fallas === 0) console.log('Ninguna prueba falla.');
  console.log(
    `Total: ${r.numTotalTests} | Pasan: ${r.numPassedTests} | Fallan: ${r.numFailedTests}`
  );
} else {
  console.log('No se genero test-results.json (revisa que Jest este instalado: npm install).');
}

// 2) Codigo no cubierto
console.log('\n=== CODIGO NO CUBIERTO POR PRUEBAS ===');
if (fs.existsSync('coverage/coverage-final.json')) {
  const cov = JSON.parse(fs.readFileSync('coverage/coverage-final.json', 'utf8'));
  let hayNoCubierto = false;
  for (const [file, d] of Object.entries(cov)) {
    const lineas = [
      ...new Set(
        Object.entries(d.s)
          .filter(([, hits]) => hits === 0)
          .map(([id]) => d.statementMap[id].start.line)
      )
    ].sort((a, b) => a - b);
    if (lineas.length) {
      hayNoCubierto = true;
      console.log(`${path.relative(raiz, file)} -> lineas sin cubrir: ${lineas.join(', ')}`);
    }
  }
  if (!hayNoCubierto) console.log('Todo el codigo analizado esta cubierto por pruebas.');
} else {
  console.log('No se genero el reporte de cobertura.');
}

// 3) Cobertura total
console.log('\n=== COBERTURA TOTAL ===');
if (fs.existsSync('coverage/coverage-summary.json')) {
  const t = JSON.parse(fs.readFileSync('coverage/coverage-summary.json', 'utf8')).total;
  console.log(
    `Sentencias: ${t.statements.pct}% | Ramas: ${t.branches.pct}% | ` +
      `Funciones: ${t.functions.pct}% | Lineas: ${t.lines.pct}%`
  );
}

process.exit(run.status === null ? 1 : run.status);
