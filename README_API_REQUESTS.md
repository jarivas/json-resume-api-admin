# API — Campos de las peticiones

Este documento resume los endpoints principales del API y los campos esperados en las peticiones. Está pensado como referencia rápida; para reglas de validación exactas revisa las clases `FormRequest` correspondientes.

**Base URL**: `/api`

Encabezados comunes:
- `Accept: application/json`
- Para endpoints protegidos: `Authorization: Bearer <token>`

## Autenticación

Todos los controladores de autenticación están en [app/Http/Controllers/Authentication](app/Http/Controllers/Authentication.php).

- POST `/api/authentication/login`
  - Descripción: Inicia sesión y devuelve un token de acceso.
  - Body (JSON):
    - `email` (string, required, formato email)
    - `password` (string, required, reglas: mínimo 8 caracteres, mayúsculas/minúsculas y números)
  - Respuesta (200): `{"token": "<plainTextToken>", "expiresAt": "YYYY-MM-DD HH:MM:SS"}`

- POST `/api/authentication/recovery`
  - Descripción: Envía instrucciones de recuperación por email.
  - Body: ninguno
  - Respuesta: `204 No Content` cuando se envía correctamente.

- POST `/api/authentication/change-password`
  - Descripción: Cambia la contraseña del usuario autenticado.
  - Body (JSON):
    - `password` (string, required, mismas reglas que en `login`)
  - Requiere: autenticación (middleware `auth:sanctum` si aplica)

- POST `/api/authentication/refresh-token`
  - Descripción: Renueva el token del usuario autenticado.
  - Body: ninguno
  - Requiere: autenticación
  - Respuesta (200): `{"token": "<plainTextToken>", "expiresAt": "YYYY-MM-DD HH:MM:SS"}`

- POST `/api/authentication/logout`
  - Descripción: Revoca los tokens del usuario autenticado.
  - Body: ninguno
  - Requiere: autenticación
  - Respuesta: `204 No Content`

## Validaciones y helpers

- Las reglas de validación para `login` y `change-password` están en [app/Http/Requests/Authentication/Login.php](app/Http/Requests/Authentication/Login.php) y [app/Http/Requests/Authentication/ChangePassword.php](app/Http/Requests/Authentication/ChangePassword.php).
- Las reglas de contraseña (mínimo 8, mayúsculas/minúsculas y números) están definidas en [app/Helpers/Http/Requests/Authentication/Password.php](app/Helpers/Http/Requests/Authentication/Password.php).

## Ejemplos (curl)

Login:

```bash
curl -X POST "http://localhost/api/authentication/login" \
  -H "Accept: application/json" \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"Secret123"}'
```

Refresh token (ejemplo con token):

```bash
curl -X POST "http://localhost/api/authentication/refresh-token" \
  -H "Accept: application/json" \
  -H "Authorization: Bearer <token>"
```

## Ampliar la documentación

- Para documentar otros endpoints, revisa las rutas en [routes/api](routes/api) y las clases `FormRequest` en [app/Http/Requests](app/Http/Requests). Añade secciones análogas a la anterior para cada recurso (campos, validaciones, ejemplo curl).

Si quieres, puedo generar automáticamente secciones para todos los endpoints detectando las `FormRequest` y sus reglas de validación.

---

## Auto-generado — Campos por `FormRequest`

Las siguientes secciones fueron generadas automáticamente a partir de las clases en `app/Http/Requests`.

### Award

- Create
  - `title`: required, string
  - `date`: required, date (Y-m-d)
  - `awarder`: required, string
  - `summary`: required, string
- Update
  - same fields optional (string/date)
  
  - Endpoints:
    - `POST /api/award` -> Create
    - `GET /api/award` -> Read
    - `PATCH /api/award/{award}` -> Update
    - `DELETE /api/award/{award}` -> Delete

### Basic

- Create
  - `name`: required, string
  - `label`: required, string
  - `email`: required, email
  - `phone`: required, string
  - `url`: url
  - `summary`: string
  - `location`: array
    - `location.address`: string
    - `location.postalCode`: string
    - `location.city`: string
    - `location.countryCode`: string
    - `location.region`: string
  - `profiles`: array
    - `profiles.*.network`: string
    - `profiles.*.username`: string
    - `profiles.*.url`: url
- Update
  - same fields optional; plus relations arrays where items are `ulid|exists:...` (awards, certificates, educations, interests, languages, projects, publications, references, skills, volunteers, works)
  
  - Endpoints:
    - `POST /api/basic` -> Create
    - `GET /api/basic` -> Read
    - `GET /api/basic/{basic}` -> Read one
    - `PATCH /api/basic/{basic}` -> Update
    - `DELETE /api/basic/{basic}` -> Delete

### BaseSearch

- `sort_by`: array
  - `sort_by.field`: string
  - `sort_by.order`: in:asc,desc
- `filter_by`: array of filters
  - `filter_by.*.field`: string
  - `filter_by.*.operator`: enum (see SearchOperator)
  - `filter_by.*.value`: optional
  - `filter_by.*.condition`: enum (see ConditionOperator)
- `relation`: array for relation filters (see `RelationOperator`/`SearchOperator` enums)

### Chat

- `message`: required, string
- `session_id`: nullable, string
- `metadata`: nullable, array

  - Endpoint: `POST /api/chat`

### Skill

- Create
  - `name`: required, string
  - `level`: required, string
  - `keywords`: required, array of strings
- Update
  - same fields optional

  - Endpoints:
    - `POST /api/skill` -> Create
    - `GET /api/skill` -> Read
    - `PATCH /api/skill/{skill}` -> Update
    - `DELETE /api/skill/{skill}` -> Delete

### Interest

- Create
  - `name`: required, string
  - `keywords`: required, array of strings
- Update
  - same fields optional

  - Endpoints:
    - `POST /api/interest` -> Create
    - `GET /api/interest` -> Read
    - `PATCH /api/interest/{interest}` -> Update
    - `DELETE /api/interest/{interest}` -> Delete

### Publication

- Create
  - `name`: required, string
  - `publisher`: required, string
  - `releaseDate`: required, date (Y-m-d)
  - `url`: url
  - `summary`: required, string
- Update
  - same fields optional

  - Endpoints:
    - `POST /api/publication` -> Create
    - `GET /api/publication` -> Read
    - `PATCH /api/publication/{publication}` -> Update
    - `DELETE /api/publication/{publication}` -> Delete

### Import

- ImportJson
  - `file`: required file, mimetypes `application/json,text/plain`, max 10240 KB
  - `disk`: sometimes string max 100
  - `path`: sometimes string max 2048
- ImportResume
  - `file`: required file, mimes `pdf,doc,docx`, max 20480 KB
  - `disk`: sometimes string max 100
  - `path`: sometimes string max 2048
  - `keep_json`: sometimes boolean

  - Endpoints:
    - `POST /api/import/json` -> ImportJson
    - `POST /api/import/resume` -> ImportResume

### Reference

- Create
  - `name`: required, string
  - `reference`: required, string
- Update
  - same fields optional

  - Endpoints:
    - `POST /api/reference` -> Create
    - `GET /api/reference` -> Read
    - `PATCH /api/reference/{reference}` -> Update
    - `DELETE /api/reference/{reference}` -> Delete

### Work

- Create
  - `name`: required, string
  - `position`: required, string
  - `url`: url
  - `startDate`: required, string
  - `endDate`: required, string
  - `summary`: required, string
  - `highlights`: required array of strings
- Update
  - same fields optional

  - Endpoints:
    - `POST /api/work` -> Create
    - `GET /api/work` -> Read
    - `PATCH /api/work/{work}` -> Update
    - `DELETE /api/work/{work}` -> Delete

### Language

- Create
  - `language`: required, string
  - `fluency`: required, string
- Update
  - same fields optional

  - Endpoints:
    - `POST /api/language` -> Create
    - `GET /api/language` -> Read
    - `PATCH /api/language/{language}` -> Update
    - `DELETE /api/language/{language}` -> Delete

### Education

- Create
  - `institution`: required, string
  - `url`: url
  - `area`: required, string
  - `studyType`: required, string
  - `startDate`: required, date (Y-m-d)
  - `endDate`: required, date (Y-m-d)
  - `score`: string
  - `summary`: required, string
  - `courses`: array of strings
- Update
  - same fields optional

  - Endpoints:
    - `POST /api/education` -> Create
    - `GET /api/education` -> Read
    - `PATCH /api/education/{education}` -> Update
    - `DELETE /api/education/{education}` -> Delete

### Project

- Create
  - `name`: required, string
  - `startDate`: required, date (Y-m-d)
  - `endDate`: required, date (Y-m-d)
  - `description`: required, string
  - `highlights`: required array of strings
  - `url`: url
- Update
  - same fields optional

  - Endpoints:
    - `POST /api/project` -> Create
    - `GET /api/project` -> Read
    - `PATCH /api/project/{project}` -> Update
    - `DELETE /api/project/{project}` -> Delete

### Certificate

- Create
  - `name`: required, string
  - `date`: required, date (Y-m-d)
  - `issuer`: required, string
  - `url`: required, url
- Update
  - same fields optional

  - Endpoints:
    - `POST /api/certificate` -> Create
    - `GET /api/certificate` -> Read
    - `PATCH /api/certificate/{certificate}` -> Update
    - `DELETE /api/certificate/{certificate}` -> Delete

---

Nota: para ver la ubicación exacta de cada `FormRequest`, revisa `app/Http/Requests`. Si quieres, puedo enlazar cada sección a la ruta (URI) correspondiente leyendo `routes/api/*.php` y mapeando controladores.
