# 🏨 Sistema de Gestión Hotelera (Proyecto Práctico)

## 📘 Descripción General

Este proyecto es un **sistema colaborativo de práctica** diseñado para que los estudiantes aprendan sobre **desarrollo de APIs, pruebas de software y trabajo en equipo**.  
Simula un **Sistema de Gestión de Hoteles** que permite administrar habitaciones, reservas, huéspedes y empleados.

El objetivo principal es que los estudiantes:
- Aprendan a trabajar con APIs (Node.js / Express).  
- Practiquen la creación de **pruebas automatizadas** (por ejemplo, con Jest o Postman).  
- Colaboren utilizando **Git y GitHub**.  
- Apliquen principios de **desarrollo ágil** y trabajo en equipo.

---

## ⚙️ Tecnologías Utilizadas

- **Backend:** Node.js + Express  
- **Base de Datos:** MongoDB (o la base elegida por el equipo)  
- **Pruebas:** Jest / Supertest  
- **Control de Versiones:** Git & GitHub    

---

## 🧩 Funcionalidades Principales

- 🛏️ Gestión de habitaciones (CRUD)  
- 📅 Gestión de reservas (CRUD)  
- 💼 Gestión de usurios (CRUD)
- 👥 Gestión de roles (CRUD)
- ⭐️ Gestión de reviews (CRUD)    
- 📊 Generación de reportes y dashboard de administración  

---

## 🚀 Primeros Pasos

### 1. Clonar el Repositorio

```bash
git clone git@github.com:Josefrancasrod hotel-system-7a.git
cd hotel-system-7a
```
### 2. Instalar Dependencias

```bash
npm install
```

### 3. CONECTAR PRISMA A UNA BASE DE DATOS SUPABASE

------------------------------------------------------------
1. INSTALAR DEPENDENCIAS
------------------------------------------------------------

Ejecuta el siguiente comando en la raíz de tu proyecto:
``` bash
npm install prisma @prisma/client
```
Luego inicializa Prisma con:
``` bash
npx prisma init
```
Esto creará:
- una nueva carpeta: /prisma
- un archivo: /prisma/schema.prisma
- y un archivo .env en la raíz del proyecto (si no existe).


------------------------------------------------------------
2. OBTENER TU URL DE BASE DE DATOS DE SUPABASE
------------------------------------------------------------

1. Entra a tu panel de Supabase: https://app.supabase.com/
2. Abre tu proyecto → Configuración (Settings) → Base de datos (Database) → Connection string.
3. Copia la cadena de conexión (URI).

Ejemplo de formato:

``` bash
postgresql://postgres:[TU_PASSWORD]@db.[TU_PROJECT_ID].supabase.co:5432/postgres
```

------------------------------------------------------------
3. CONFIGURAR EL ARCHIVO .ENV
------------------------------------------------------------

En tu archivo .env, reemplaza la cadena de conexión por la de Supabase:
``` bash
DATABASE_URL="postgresql://postgres:[TU_PASSWORD]@db.[TU_PROJECT_ID].supabase.co:5432/postgres"
```

Importante:
- Nunca subas el archivo .env a GitHub.
- Asegúrate de tener .env en tu archivo .gitignore.


------------------------------------------------------------
4. ACTUALIZAR EL ARCHIVO schema.prisma
------------------------------------------------------------

Abre /prisma/schema.prisma y configura los bloques de datasource y generator:
``` javascript
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

generator client {
  provider = "prisma-client-js"
}
```

Ahora puedes empezar a definir tus modelos dentro de este archivo.

Ejemplo:
``` javascript
model Rooms {
  id          BigInt  @id @default(autoincrement())
  name        String  @db.VarChar
  type        String? @db.VarChar
  price       Float?
  description String? @db.VarChar
  id_rating   BigInt?
}
´´´
Utilizando el comando, en caso de ya tener los datos creados en la base de datos.

``` bash
npx prisma db pull
```

------------------------------------------------------------
5. ENVIAR O MIGRAR LA BASE DE DATOS
------------------------------------------------------------

Una vez definidos tus modelos, aplica los cambios en Supabase.
``` bash
npx prisma migrate dev --name init
npx prisma db pull
```



------------------------------------------------------------
6. GENERAR EL CLIENTE DE PRISMA
------------------------------------------------------------

Después de sincronizar el esquema, genera el cliente de Prisma:

``` bash
npx prisma generate
```
Para verificar la conexión ejecuta:

npx prisma studio

Esto abrirá la interfaz visual de Prisma en:
http://localhost:5555


------------------------------------------------------------
9. ¡LISTO!
------------------------------------------------------------

Tu proyecto existente de Node.js ahora está conectado a tu base de datos de Supabase usando Prisma.


### 4. Iniciar el proyecto
```bash
npm start
```
o en modo desarrollador:
```bash
npm run dev
```

## 🧪 Ejecución de Pruebas

Para ejecutar todas las pruebas automatizadas:

```bash
npm test
```

Para ver resultados más detallados:

```bash
npm run test:verbose
```

**Cada estudiante debe:**

- Escribir pruebas unitarias para controladores y servicios.
- Crear pruebas de integración para los endpoints de la API.

## 🌿 Sistema de Ramas y Mensajes de Commit

Para mantener el proyecto organizado y entendible, seguiremos una convención específica para los nombres de ramas y los mensajes de commit.
Esto ayudará a identificar fácilmente qué hace cada cambio y quién lo realizó.

## 🧭 Convenciones para Ramas y Commits

Para mantener un flujo de trabajo ordenado y claro, todos los equipos deben seguir la siguiente **nomenclatura** al crear ramas y escribir mensajes de commit.

---

### 🌿 Nomenclatura de Ramas

Cada rama debe seguir el formato:

```
[TEAM]/[FEATURE|BUGFIX]/[DESCRIPCION_CORTA]
```

#### 🔹 Ejemplos

```
team1/feature/crear-endpoint-login
team2/bugfix/corregir-validacion-email
team3/feature/agregar-test-de-habitaciones
```

#### 📋 Reglas
- Usa siempre **minúsculas** y **guiones medios (-)** en lugar de espacios.
- Usa `feature` para nuevas funcionalidades.
- Usa `bugfix` para corrección de errores.
- La descripción debe ser **breve y clara**.
- Trabaja siempre desde la rama principal (`main`) antes de crear una nueva.

---

### 💬 Nomenclatura de Commits

Cada mensaje de commit debe seguir el formato:

```
[#NUMERO_ISSUE] - DESCRIPCION_DEL_CAMBIO
```

#### 🔹 Ejemplos

```
#12 - Crear endpoint para registro de huéspedes
#7 - Corregir error en la validación del email
#15 - Agregar pruebas unitarias para el módulo de reservas
```

#### 📋 Reglas
- Incluye siempre el número del issue relacionado (por ejemplo, `#12`).
- Usa **verbos en infinitivo** (crear, agregar, corregir, eliminar).
- Sé **breve y específico** en la descripción.
- Si el commit está relacionado con un Pull Request, menciona el issue correspondiente.

---

✅ **Ejemplo de flujo completo**

1. Crear una nueva rama:
   ```bash
   git checkout -b team1/feature/crear-endpoint-login
   ```

2. Realizar cambios y hacer commit:
   ```bash
   git add .
   git commit -m "#5 - Crear endpoint para login de usuarios"
   ```

3. Subir la rama al repositorio:
   ```bash
   git push origin team1/feature/crear-endpoint-login
   ```

4. Crear un Pull Request y vincularlo al issue correspondiente.

---

