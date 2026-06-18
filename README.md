## 📋 Resumen de Endpoints

| Endpoint | Método | Descripción | Parámetros Esperados | Body Requerido |
| :--- | :--- | :--- | :--- | :--- |
| `/hello-world` | `GET` | Activa el servicio de la API REST y retorna un mensaje de bienvenida. | Ninguno | N/A |
| `/create-admin-profile` | `POST` | Crea un nuevo perfil de administrador y genera su API Key. | Ninguno | `{ "userName": "nombre", "userEmail": "email@ejemplo.com" }` |
| `/recover-admin-profile` | `GET` | Recupera el token de administrador usando el email del usuario. | Ninguno | `{ "userEmail": "email@ejemplo.com" }` |

<br>

| Endpoint | Método | Descripción | Parámetros Esperados | Body Requerido |
| :--- | :--- | :--- | :--- | :--- |
| `/categories` | `GET` | Recupera todas las categorías existentes. | Ninguno | N/A |
| `/categories` | `POST` | Crea una nueva categoría. | Ninguno | `{ "name": "Nombre de la Categoría" }` |
| `/products` | `GET` | Recupera todos los productos del usuario autenticado. | Ninguno | N/A |
| `/products/:id` | `GET` | Recupera un producto específico por su ID. | `:id` (Path) | N/A |
| `/products/:name` | `GET` | Filtra y recupera productos por parte de su nombre. | `:name` (Path) | N/A |
| `/products` | `POST` | Crea un nuevo producto. | Ninguno | `{ "name": "Nombre del producto", "imagen": "emoji", "precio": 123.45, "categoria": "cat_name" }` |
| `/products/:id` | `PUT` | Actualiza image, precio, y categoría de un producto existente por su ID. | `:id` (Path) | `{ "imagen": "emoji", "precio": 123.45, "categoria": "cat_name" }` |
| `/products/:id` | `DELETE` | Aplica un borrado lógico (*soft delete*) a un producto por su ID. | `:id` (Path) | N/A |

***

## 📝 Detalle de Endpoints

### 1. GET /hello-world

**Descripción:** Endpoint simple para verificar que la API está operativa y devolver un mensaje de bienvenida.

**Parámetros Requeridos:** Ninguno.

**Body Requerido:** No aplica.
```json
{
    "success": true,
    "message": "Te damos la bienvenida a E-commerce API!",
    "copyright": "2026 - Fernando Luna para Educación IT"
}
```

<hr>

### 2. POST /create-admin-profile

**Descripción:** Crea un nuevo perfil de administrador en el sistema, generando automáticamente una nueva API Key para este usuario.

**Parámetros Requeridos:** Ninguno.

**Headers Requeridos:** No aplica.

**Body Requerido:**.

```json
{
    "userName": "Nombre del Administrador",
    "userEmail": "email@ejemplo.com"
}
```
**Respuesta:**
```json
{
    "success": true,
    "message": "Admin profile created successfully for Omar Mercado.",
    "info": {
        "userId": "8Ba7eA26d99743a7e19002de76d023e9",
        "userName": "Nombre del Administrador",
        "userEmail": "email@ejemplo.com",
        "createdAt": 1781746860097,
        "apiKey": "90TUQdXUGV1UKtmVQp1aXZlWW50d01mVYplRihlTIpFeNdVW0ETbWNDbsJVaWZkYH5kMWhXQqZ1dR5WTXxGSlRnSGd1RxcVV4plVNpGdFVGdsZ1VvRGMWllUtZlTK5mVIZVbhdEctZVYC5mUph3RhhkSHN1dGpWVzgmbNplUsdlcGJjV3hGMZpHcsJFW0dUYXplVXdkUVRFWSdlUshGbWNHZxI1U4dlV2B3aSNlRHpleFJjVPplVXdXUtJ1VWZUZ0Z1RhNFetVVMSdVTqRGbTVEcGN1S4SFGZrJFWkZVWHBXbWZDcWJ1UG1GVzZlRTtkSqZldSdlVhxWRjZlSyY1TaxGV1YlRixGZud1VSZkVThGbZhVNFNVYOhkW41UMWNEctZVUoJTTXxWbUNnWxM2aGpXWQB3alpFarFVWKJjVrhGbVRDbrZFaGdUZ0ZFbTFmQqV..."
    }
```

<hr>

### 3. GET /recover-admin-profile

**Descripción:** Recupera el token de administrador usando el email del usuario. Este endpoint no requiere API Key en los headers, pero sí un cuerpo con el correo electrónico.

**Parámetros Requeridos:** Ninguno.

**Body Requerido:**

```json
{
    "userEmail": "email_del_usuario@ejemplo.com"
}
```

**Respuesta:**
```json
{
    "success": true,
    "data": "990TUQdXUGV1UKtmVQp1aXZlWW50d01mVYplRihlTIpFeNdVW0ETbWNDbsJVaWZkYH5kMWhXQqZ1dR5WTXxGSlRnSGd1RxcVV4plVNpGdFVGdsZ1VvRGMWllUtZlTK5mVIZVbhdEctZVYC5mUph3RhhkSHN1dGpWVzgmbNplUsdlcGJjV3hGMZpHcsJFW0dUYXplVXdkUVRFWSdlUshGbWNHZxI1U4dlV2B3aSNlRHpleFJjVPplVXdXUtJ1VWZUZ0Z1RhNFetVVMSdVTqRGbTVEcGN1S4SFGZrJFWkZVWHBXbWZDcWJ1UG1GVzZlRTtkSqZldSdlVhxWRjZlSyY1TaxGV1YlRixGZud1VSZkVThGbZhVNFNVYOhkW41UMWNEctZVUoJTTXxWbUNnWxM2aGpXWQB3alpFarFVWKJjVrhGbVRDbrZFaGdUZ0ZFbTFmQqV..."
    }
```

<hr>

### 4. GET /categories

**Descripción:** Recupera una lista completa de todas las categorías asociadas al usuario autenticado.

**Parámetros Requeridos:** Ninguno.

**Body Requerido:** No aplica.

**Headers Requeridos:** `ecommerceapikey` (API Key).

```json
{
    "success": true,
    "data": [
        {
            "id": "6a2f8358505b0f2113049e5f",
            "nombre": "automotor"
        },
        {
            ...
        }
    ]
}
```

<hr>

### 5. POST /categories

**Descripción:** Crea una nueva categoría en el sistema, asociándola al usuario autenticado.

**Parámetros Requeridos:** Ninguno.

**Headers Requeridos:** `ecommerceapikey` (API Key).```json

**Body Requerido:**
```json
{
    "name": "Nombre de la Categoría"
}
```

<hr>

### 6. GET /products

**Descripción:** Recupera la lista completa de productos del usuario autenticado.

**Parámetros Requeridos:** Ninguno.

**Headers Requeridos:** `ecommerceapikey` (API Key).

**Body Requerido:** No aplica.
```json
{
    "success": true,
    "data": [
        {
            "id": "9c4f1566505b8e2113048a9a",
            "nombre": "Notebook Pro 14\"",
            "imagen": "💻",
            "precio": 129999,
            "categoria": "laptops"
        },
        {
            ...
        }
    ]
}
```

<hr>

### 7. GET /products/:id

**Descripción:** Recupera los detalles de un producto específico utilizando su ID único. La API verifica que el usuario autenticado sea el propietario del producto.

**Parámetros Requeridos:**
*   `:id` (Path): El `ObjectId` del producto a recuperar.

**Body Requerido:** No aplica.

**Headers Requeridos:** `ecommerceapikey` (API Key).
```json
{
    "success": true,
    "data": {
        "id": "9a2fe8b64edc4b2b5a8380d4",
        "nombre": "Mouse Inalámbrico",
        "imagen": "🖱️",
        "precio": 2999,
        "categoria": "accesorios"
    }
}
```
<hr>

### 8. GET /products/:name

**Descripción:** Filtra y recupera una lista de productos que contengan la cadena de texto proporcionada en el nombre.

**Parámetros Requeridos:**
*   `:name` (Path): La parte del nombre del producto a filtrar.

**Body Requerido:** No aplica.

**Headers Requeridos:** `ecommerceapikey` (API Key).
```json
{
    "success": true,
    "data": [
        {
            "id": "6f2fe8b64aec4f2b5a8380e4",
            "nombre": "Mouse Inalámbrico",
            "imagen": "🖱️",
            "precio": 2999,
            "categoria": "accesorios"
        },
        {
            ...
        }
    ]
}
```
<hr>

### 9. POST /products

**Descripción:** Crea un nuevo producto bajo el perfil del usuario identificado. Requiere el nombre, la imagen (emoji), el precio y la categoría en el cuerpo de la petición.

**Parámetros Requeridos:**
*   `:id` (Path): El `ObjectId` del producto a modificar.

**Headers Requeridos:** `ecommerceapikey` (API Key).

**Body Requerido:**

```json
{
    "nombre": "Nuevo producto",
    "imagen": "✅",
    "precio": 123.45,
    "categoria": "nombre_de_la_categoria"
}
```

<hr>

### 10. PUT /products/:id

**Descripción:** Actualiza los datos de un producto existente utilizando su ID único. Requiere la imagen, el precio y la categoría en el cuerpo de la petición.

**Parámetros Requeridos:**
*   `:id` (Path): El `ObjectId` del producto a modificar.

**Headers Requeridos:** `ecommerceapikey` (API Key).

**Body Requerido:**

```json
{
    "imagen": "✅",
    "precio": 123.45,
    "categoria": "nombre_de_la_categoria"
}
```

<hr>

### 11. DELETE /products/:id
**Descripción:** Aplica un borrado lógico (*soft delete*) a un producto específico, marcándolo como eliminado sin borrarlo físicamente de la base de datos.

**Parámetros Requeridos:**
*   `:id` (Path): El `ObjectId` del producto a eliminar.

**Body Requerido:** No aplica.

**Headers Requeridos:** `ecommerceapikey` (API Key).
```json
{}
```
