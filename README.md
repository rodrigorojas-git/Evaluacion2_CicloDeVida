# Integration Solutions - Calidad de software

Proyecto con pruebas unitarias (Jest), cobertura de codigo y analisis de seguridad
(SonarCloud, Snyk, npm audit y GitHub Advanced Security).

## Ejecutar localmente

```bash
npm install
npm test               # ejecuta las pruebas
npm run test:report    # pruebas + fallas + codigo no cubierto + % de cobertura
npm run audit:security # npm audit
```

## Integraciones

- **GitHub Actions**: `.github/workflows/quality.yml` ejecuta pruebas, `npm audit`, Snyk y SonarCloud en cada push.
- **Secrets requeridos** (Settings > Secrets and variables > Actions): `SONAR_TOKEN` y `SNYK_TOKEN`.
- **Dependabot**: `.github/dependabot.yml`.
