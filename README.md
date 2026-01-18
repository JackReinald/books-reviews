# 1. 📚 Sistema de Gestión de Libros (Fullstack)

Este proyecto es una solución integral para la gestión y reseña de libros, compuesta por un Backend en Symfony, un Frontend Web en Vue.js y una App Móvil en React Native (Expo).

## 2. Requisitos Previos

- PHP: 8.2 o superior.
- Composer: v2.x.
- Node.js: v18.x o superior (LTS).
- npm: v9.x o superior.
- MySQL: v8.0 o MariaDB.
- Expo Go: Instalado en dispositivo móvil (para la App).
- Symfony CLI: Opcional (recomendado).
- VSCode o su editor de confianza.

## 3. Instrucciones de Instalación (Backend - book_api)

1. Abrir la terminal
2. Entrar al directorio: `cd book_api`
3. Entrar a la carpeta raíz con VSCode:`code .`
4. Crear un archivo .env que contendrá las variables de entorno y configurar DATABASE_URL con sus credenciales de MySQL.

```
DATABASE_URL="mysql://app:!ChangeMe!@127.0.0.1:3306/app?serverVersion=10.11.2-MariaDB&charset=utf8mb4"
```

5. Instalar dependencias: `composer install`
6. Preparar Base de Datos:

```
php bin/console doctrine:database:create
php bin/console doctrine:migrations:migrate
php bin/console doctrine:fixtures:load
```

(Siga los pasos del ayudante) 7. Iniciar el servidor: `symfony server:start`

## 4. Cómo correr el Frontend Web (book_frontend)

1. Entrar al directorio book_frontend
2. Instalar dependencias: `npm install`
3. Ejecutar en desarrollo: `npm run dev`
4. Acceso: Abrir el navegador en `http://localhost:5173`

## 5. Cómo correr el Frontend Mobile (book_mobile)

1. Entrar al directorio book_mobile
2. Instalar dependencias: `npm install`
3. Configurar API: Editar `book_mobile/config/axios.ts` y reemplazar `YOUR_LOCAL_IP` con la dirección IPv4 de tu PC:

```typescript
export const API_URL = "http://YOUR_LOCAL_IP:8000/api";
```

**Nota:** Para encontrar tu IPv4, ejecuta en la terminal:

```bash
ipconfig
```

Busca la dirección bajo "Dirección IPv4" (ej: `192.168.x.x`) 4. Iniciar Expo: `npx expo start` 5. Visualización:
_ Escanea el código QR con la app Expo Go en tu celular.
_ Asegúrate de que el móvil y el PC estén en la misma red Wi-Fi.

## 6. Endpoints Principales

### GET /api/books

Obtiene la lista de todos los libros registrados en el sistema.

**Parámetros:** Ninguno

**Respuesta (200 OK):**

```json
[
  {
    "id": 5,
    "title": "El Arte de Programar",
    "author": "Donald Knuth",
    "published_year": 1968,
    "average_rating": 4.2857
  }
]
```

**Campos:**

- `id`: Identificador único del libro
- `title`: Título del libro
- `author`: Autor del libro
- `published_year`: Año de publicación
- `average_rating`: Calificación promedio (0-5)

### POST /api/reviews
Crea una nueva reseña para un libro.

**Body (JSON):**

```json
{
  "book_id": 1,
  "rating": 5,
  "comment": "Una obra maestra absoluta."
}
```

**Campos:**

- `book_id`: ID del libro a reseñar
- `rating`: Calificación de 1 a 5
- `comment`: Comentario o reseña del libro

**Respuesta (201 Created):**
```json
{
    "status": "success",
    "message": "Reseña creada correctamente",
    "data": {
        "id": 30,
        "created_at": "2026-01-17 22:22:31"
    }
}
```

## 7. Evidencia de Funcionamiento (POSTMAN)

* Prueba del endpoint **GET /api/books**
![Evidencia Postman - GET /api/books](image.png)

* Prueba del endpoint **POST /api/reviews**
![Evidencia Postman - POST /api/reviews](image-1.png)

## 8. Manejo de Errores de Validación
El backend fue programado para rechazar comentarios en blanco o ratings por fuera del intervalo de 1 hasta 5 (incluyendo los extremos)
![Rating incorrecto y comentario en blanco](image-2.png)

Tampoco recibe solicitudes que hagan referencia a un ID inexistente.
![ID incorrecto](image-3.png)

## 9. Pregunta Opcional: Escalabilidad Profesional
Para escalar esta aplicación a cientos de miles de libros y usuarios, implementaría las siguientes mejoras:

* Optimización de Base de Datos: Añadiría índices en book_id dentro de la tabla review y usaría réplicas de lectura para distribuir la carga.
* Arquitectura de Microservicios: Separaría el motor de reseñas en un servicio independiente para que el tráfico masivo de votos no afecte la navegación de libros.
* Procesaría el cálculo de estadísticas complejas asíncronamente

## 10. Video Evidencia
xxxxxxxx

## 11. Información de Entrega
* Branch evaluado: **main**
* Commit final: [Hash del último commit]
