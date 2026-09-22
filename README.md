# VidalStore — BFF (Backend for Frontend)

Capa intermedia **Backend for Frontend** de la plataforma **VidalStore**. Se ubica entre el API Gateway y los microservicios: recibe las peticiones autenticadas, **autoriza por grupo de Cognito** (`cognito:groups`) y las enruta a los microservicios de catálogo y biblioteca, reenviando la identidad del usuario en headers.

VidalStore vende **licencias de uso de videojuegos digitales**: el usuario compra juegos del catálogo y obtiene licencias en su biblioteca, mientras los administradores gestionan catálogo, licencias y auditoría.

## Arquitectura

```text
Navegador (Angular)  :4200
      │
      ▼
API Gateway (NestJS) :8080   ← valida el JWT contra el JWKS de Cognito
      │  Authorization + x-user-sub + x-user-groups
      ▼
BFF (NestJS)         :3000   ← este repositorio (autoriza por grupos y enruta)
      │
      ▼
Catálogo  :8001 ─────┘   GET/POST/PUT /v1/catalogo
Biblioteca :3003 ─────┘   biblioteca, compras, licencias y auditoría
```

> El BFF no configura CORS: el CORS lo gestiona únicamente el API Gateway. Tampoco valida la firma del JWT: eso lo hace el Gateway. El BFF confía en los headers `x-user-sub` y `x-user-groups` reenviados por el Gateway.

## Funcionalidad

- **Autorización por grupos**: `RolesGuard` valida `@Roles('editores', 'administradores')` contra el claim `cognito:groups`.
- **Proxy de catálogo**: reenvía las operaciones de lectura/escritura al microservicio de catálogo.
- **Proxy de biblioteca**: resuelve la biblioteca del usuario autenticado a partir de `x-user-sub`.
- **Compras**: crea una licencia para el usuario (`POST /v1/compras`).
- **Gestión de licencias**: listado y revocación (solo `administradores`).
- **Auditoría**: historial de revocaciones (solo `administradores`).
- Reenvío de `x-user-sub`, `x-user-groups` y `Authorization` al microservicio destino.
- Validación estricta de DTOs (campos desconocidos rechazados).

## Tecnologías

- NestJS + TypeScript.
- `@nestjs/axios` y Axios para el proxy HTTP hacia los microservicios.
- `@nestjs/config` para configuración.
- Guards de autenticación (`BffAuthGuard`) y roles (`RolesGuard`).
- Jest (pruebas) y Oxlint (linting).
- AWS Cognito: los microservicios reciben los grupos del usuario.

## Requisitos

- Node.js 18 o superior.
- npm.
- El API Gateway de VidalStore apuntándose (envía `x-user-sub`/`x-user-groups`).
- Los microservicios **vidalstore-catalogo** y **vidalstore-biblioteca** corriendo.

## Instalación

```bash
git clone https://github.com/wsk4/vidalstore-bff.git
cd vidalstore-bff
npm install
```

Crea el archivo de entorno local:

```bash
cp .env.example .env
```

> El puerto por defecto del código es `3000` (el `.env.example` declara `8080`, pero ese puerto lo usa el Gateway). Para la operación local se recomienda dejar el BFF en `3000` y apuntar `BFF_URL` del Gateway hacia ahí.

## Variables de entorno

| Variable | Descripción | Valor por defecto |
|---|---|---|
| `PORT` | Puerto del BFF. | `3000` |
| `NODE_ENV` | Entorno de ejecución. | `development` |
| `COGNITO_*` | Datos del user pool (contexto). | — |
| `CATALOG_SERVICE_URL` | URL del microservicio de catálogo. | `http://localhost:8001` |
| `LIBRARY_SERVICE_URL` | URL del microservicio de biblioteca. | `http://localhost:3003` |
| `PURCHASE_SERVICE_URL` | URL para compras. | `http://localhost:3003` |
| `LICENSES_SERVICE_URL` | URL para licencias. | `http://localhost:3003` |
| `AUDIT_SERVICE_URL` | URL para auditoría. | `http://localhost:3003` |
| `CACHE_TTL_SECONDS` | TTL de caché en segundos. | `300` |

Nunca se versiona un `.env` con valores reales ni credenciales de AWS.

## Ejecución

```bash
npm run start:dev    # desarrollo con watch
npm run build        # compilación
npm run start:prod   # producción
```

El BFF queda disponible en `http://localhost:3000`.

## Endpoints

Todos los endpoints requieren los headers reenviados por el Gateway (`x-user-sub` y `x-user-groups`; o un `Authorization` válido).

| Método | Ruta | Descripción | Autorización | Microservicio |
|---|---|---|---|---|
| `GET` | `/v1/catalogo` | Lista el catálogo. | Autenticado | catálogo (8001) |
| `GET` | `/v1/catalogo/:id` | Busca un juego por ID. | Autenticado | catálogo (8001) |
| `POST` | `/v1/catalogo` | Crea un juego. | `editores`, `administradores` | catálogo (8001) |
| `PUT` | `/v1/catalogo/:id` | Actualiza un juego. | `editores`, `administradores` | catálogo (8001) |
| `GET` | `/v1/biblioteca` | Biblioteca del usuario (resuelve por `sub`). | Autenticado | biblioteca (3003) |
| `POST` | `/v1/compras` | Crea una licencia para el usuario. | Autenticado | biblioteca (3003) |
| `GET` | `/v1/licencias` | Lista todas las licencias. | `administradores` | biblioteca (3003) |
| `DELETE` | `/v1/licencias/:id` | Revoca una licencia. | `administradores` | biblioteca (3003) |
| `GET` | `/v1/auditoria` | Historial de revocaciones. | `administradores` | biblioteca (3003) |

> `GET /v1/catalogo/:id` y `DELETE /v1/licencias/:id` no están expuestos por el Gateway en esta versión, pero el BFF los soporta directamente.

## Autenticación y autorización

1. **API Gateway valida el token** (firma, issuer, vigencia, `token_use`, `client_id`).
2. **Gateway reenvía** `Authorization`, `x-user-sub` y `x-user-groups` al BFF.
3. **BFF:** `BffAuthGuard` exige `x-user-sub` → `401 Unauthorized` si falta.
4. **BFF:** `RolesGuard` verifica los grupos contra `@Roles` → `403 Forbidden` si el rol no alcanza.
5. **BFF reenvía** los headers al microservicio y devuelve la respuesta.

### Ejemplos con curl

```bash
# Biblioteca del usuario (simulando los headers del Gateway)
curl -i http://localhost:3000/v1/biblioteca \
  -H "x-user-sub: user-123" \
  -H "x-user-groups: jugadores" \
  -H "Authorization: Bearer $ACCESS_TOKEN"

# Crear juego sin rol de editor → 403
curl -i -X POST http://localhost:3000/v1/catalogo \
  -H "x-user-sub: user-123" \
  -H "x-user-groups: jugadores" \
  -H "Content-Type: application/json" \
  -d '{"nombre":"Nuevo juego"}'

# Crear juego con rol de editor → 201
curl -i -X POST http://localhost:3000/v1/catalogo \
  -H "x-user-sub: user-123" \
  -H "x-user-groups: editores" \
  -H "Content-Type: application/json" \
  -d '{"nombre":"Nuevo juego","descripcion":"Demo","imagen":"https://..."}'

# Listar licencias como administrador → 200
curl -i http://localhost:3000/v1/licencias \
  -H "x-user-sub: admin-001" \
  -H "x-user-groups: administradores"

# Revocar una licencia como administrador
curl -i -X DELETE http://localhost:3000/v1/licencias/lib-1 \
  -H "x-user-sub: admin-001" \
  -H "x-user-groups: administradores"
```

## Códigos de respuesta

| Código | Significado | Cuándo se usa |
|---|---|---|
| `200 OK` | Éxito | Lecturas y actualizaciones exitosas. |
| `201 Created` | Recurso creado | `POST /v1/catalogo` y `POST /v1/compras`. |
| `401 Unauthorized` | No autenticado | Falta `x-user-sub`. |
| `403 Forbidden` | No autorizado | El grupo del usuario no cumple `@Roles`. |
| `404 Not Found` | No encontrado | Recurso inexistente. |
| `500` | Error del servidor | Error no manejado o servicio de destino caído. |

## Pruebas

```bash
npm test          # pruebas unitarias
npm run test:watch
npm run test:cov  # con cobertura
npm run test:e2e  # pruebas e2e
npm run lint      # oxlint
```

## Scripts disponibles

```bash
npm run build        # compilar TypeScript
npm run start:dev    # desarrollo con watch
npm run start:prod   # producción
npm test             # pruebas unitarias
npm run test:e2e     # pruebas e2e
npm run lint         # oxlint
npm run format       # prettier
```

## Diferencia entre Gateway y BFF

| Capa | Responsabilidad |
|---|---|
| **API Gateway** | Autenticación: valida firma y claims del JWT contra JWKS. |
| **BFF** | Autorización: verifica los grupos de Cognito y enruta a los microservicios. |

El CORS se configura solo en el Gateway; el BFF y los microservicios no lo necesitan.

## Estructura del proyecto

```text
src/
├── auth/                    # BffAuthGuard, RolesGuard, roles.decorator, extractor
├── audit/                   # GET /v1/auditoria → audit service
├── catalog/                 # GET/POST/PUT /v1/catalogo → catalog service
├── library/                 # GET /v1/biblioteca → library service
├── licenses/                # GET/DELETE /v1/licencias → licenses service
├── purchase/                # POST /v1/compras → purchase service
├── common/
│   └── filters/             # HttpExceptionFilter
├── types/                   # tipos de Express extendidos
├── app.module.ts
└── main.ts

test/                        # pruebas e2e
```

## Licencia

Proyecto académico DUOC UC — DSY1107 Desarrollo Cloud Native I.