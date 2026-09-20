<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

<p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>

<p align="center">
  <a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
  <a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
  <a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/dm/@nestjs/common.svg" alt="NPM Downloads" /></a>
  <a href="https://discord.gg/G7Qnnhy" target="_blank"><img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord"/></a>
</p>

---

# VidalStore - BFF (Backend for Frontend)

Capa BFF que actúa como intermediario entre el API Gateway y los microservicios.

## 🏗️ Arquitectura
┌─────────────────────┐


│ Angular (Front) │

└──────────┬──────────┘

│

▼

┌─────────────────────┐

│ API Gateway │ ← Valida token contra JWKS

└──────────┬──────────┘

│

▼

┌─────────────────────┐

│ BFF │ ← Este repositorio

│ - Autoriza por grupos

│ - Enruta a microservicios

└──────────┬──────────┘

│

▼

┌─────────────────────┐

│ Microservicios │ ← Catálogo, Biblioteca, Compras, Licencias

└─────────────────────┘

## 📋 Requisitos

- Node.js 18+
- npm o yarn

## 🚀 Instalación

```bash
$ npm install
```

## ⚙️ Variables de entorno

Copiar `.env.example` a `.env` y ajustar valores:

```bash
$ cp .env.example .env
```

**Variables requeridas**:

```env
PORT=8080
NODE_ENV=development

# Cognito configuration
COGNITO_REGION=us-east-1
COGNITO_USER_POOL_ID=us-east-1_example
COGNITO_APP_CLIENT_ID=example-client-id
COGNITO_ISSUER=[https://cognito-idp.us-east-1.amazonaws.com/us-east-1_example](https://cognito-idp.us-east-1.amazonaws.com/us-east-1_example)
COGNITO_JWKS_URI=[https://cognito-idp.us-east-1.amazonaws.com/us-east-1_example/.well-known/jwks.json](https://cognito-idp.us-east-1.amazonaws.com/us-east-1_example/.well-known/jwks.json)

# Microservice URLs
CATALOG_SERVICE_URL=http://localhost:3002
LIBRARY_SERVICE_URL=http://localhost:3003
PURCHASE_SERVICE_URL=http://localhost:3003
LICENSES_SERVICE_URL=http://localhost:3003
AUDIT_SERVICE_URL=http://localhost:3003

# Internal settings
CACHE_TTL_SECONDS=300
```

## 🎯 Compilar y ejecutar

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## 🧪 Ejecutar pruebas

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## 📡 Endpoints

El BFF expone los mismos endpoints que los microservicios, pero con autorización por grupos:

| Método | Ruta | Descripción | Autorización |
|--------|------|-------------|--------------|
| `GET` | `/v1/catalogo` | Lista todos los juegos | `jugadores`, `editores`, `administradores` |
| `POST` | `/v1/catalogo` | Crea nuevo juego | `editores`, `administradores` |
| `PUT` | `/v1/catalogo/:id` | Actualiza juego | `editores`, `administradores` |
| `GET` | `/v1/biblioteca` | Lista biblioteca del usuario | `jugadores` |
| `POST` | `/v1/compras` | Crea nueva licencia | `jugadores` |
| `GET` | `/v1/licencias` | Lista todas las licencias | `administradores` |
| `DELETE` | `/v1/licencias/:id` | Revoca licencia | `administradores` |
| `GET` | `/v1/auditoria` | Historial de revocaciones | `administradores` |

## 🔐 Flujo de autenticación y autorización

### 1. API Gateway valida el token

- Firma criptográfica
- Emisor (`iss`)
- Vigencia (`exp`, `nbf`)
- Tipo de token (`token_use = access`)
- `client_id`

### 2. BFF autoriza por grupo

- Lee `cognito:groups` del token
- Verifica si el grupo tiene permiso para la ruta
- Retorna `403 Forbidden` si el rol no alcanza

### 3. Microservicio entrega datos

- Recibe petición del BFF
- Entrega datos filtrados

## 📊 Códigos de respuesta

| Código | Significado | Cuándo se usa |
|--------|-------------|---------------|
| `200 OK` | Éxito | Lectura exitosa |
| `201 Created` | Recurso creado | POST exitoso |
| `204 No Content` | Sin contenido | DELETE exitoso |
| `401 Unauthorized` | No autenticado | Token ausente o inválido |
| `403 Forbidden` | No autorizado | Rol insuficiente |
| `404 Not Found` | No encontrado | Recurso no existe |
| `500 Internal Server Error` | Error del servidor | Excepción no manejada |

## 🔒 Seguridad

- ✅ No commitear `.env` con valores reales
- ✅ No commitear credenciales de AWS
- ✅ Validar token en Gateway (autenticación)
- ✅ Autorizar por `cognito:groups` en BFF (autorización)
- ✅ No configurar CORS en el BFF (solo en Gateway)

## 📦 Scripts disponibles

```bash
$ npm run build        # Compilar TypeScript
$ npm run start:dev    # Levantar en desarrollo
$ npm run start:prod   # Levantar en producción
$ npm test             # Ejecutar pruebas unitarias
$ npm run test:e2e     # Ejecutar pruebas e2e
$ npm run lint         # Ejecutar linter
```

## 🆚 Diferencia entre Gateway y BFF

| Capa | Responsabilidad | Tecnologías |
|------|----------------|-------------|
| **API Gateway** | Autenticación (validar token) | NestJS + JWKS |
| **BFF** | Autorización (verificar grupos) | NestJS + Guards |

## 📚 Recursos

- Visit the [NestJS Documentation](https://docs.nestjs.com) to learn more about the framework.
- For questions and support, please visit our [Discord channel](https://discord.gg/G7Qnnhy).

## 🤝 Soporte

Nest is an MIT-licensed open source project. It can grow thanks to the sponsors and support by the amazing backers. If you'd like to join them, please [read more here](https://docs.nestjs.com/support).

## 📄 Licencia

Nest is [MIT licensed](https://github.com/nestjs/nest/blob/master/LICENSE).

---

<p align="center">
  <a href="https://nestjs.com/" target="_blank"><img src="https://img.shields.io/badge/nestjs-%23E0234E.svg?style=for-the-badge&logo=nestjs&logoColor=white" alt="NestJS" /></a>
  <a href="https://www.typescriptlang.org/" target="_blank"><img src="https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" /></a>
  <a href="https://nodejs.org/" target="_blank"><img src="https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white" alt="Node.js" /></a>
</p>

<p align="center">Proyecto académico DUOC UC - DSY1107 - Desarrollo Cloud Native I</p>