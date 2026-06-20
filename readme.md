# 📋 Resumen de Endpoints

| Endpoint | Método | Descripción | Parámetros Esperados | Body Requerido |
| :--- | :--- | :--- | :--- | :--- |
| `/categories` | `GET` | Recupera todas las categorías existentes. | ecommerceApiKey | N/A |
| `/categories` | `POST` | Crea una nueva categoría. | ecommerceApiKey | `{ "name": "Nombre de la Categoría" }` |
| `/products` | `GET` | Recupera todos los productos del usuario autenticado. | ecommerceApiKey | N/A |
| `/products/:id` | `GET` | Recupera un producto específico por su ID. | `:id` (Path) + ecommerceApiKey | N/A |
| `/products/name/:name` | `GET` | Filtra y recupera productos por parte de su nombre. | `:name` (Path) + ecommerceApiKey | N/A |
| `/products/category/:categoryname` | `GET` | Filtra y recupera productos de una categoría específica. | `:categoryname` (Path) + ecommerceApiKey | N/A |
| `/products` | `POST` | Crea un nuevo producto. | ecommerceApiKey | `{ "name": "Nombre del producto", "imagen": "emoji", "precio": 123.45, "categoria": "cat_name" }` |
| `/products/:id` | `PUT` | Actualiza image, precio, y categoría de un producto existente por su ID. | `:id` (Path) + ecommerceApiKey | `{ "imagen": "emoji", "precio": 123.45, "categoria": "cat_name" }` |
| `/products/:id` | `DELETE` | Aplica un borrado lógico (*soft delete*) a un producto por su ID. | `:id` (Path) + ecommerceApiKey | N/A |

***

## 📝 Detalle de Endpoints

### 1. GET /categories

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

### 2. POST /categories

**Descripción:** Crea una nueva categoría en el sistema, asociándola al usuario autenticado.

**Parámetros Requeridos:** Ninguno.

**Headers Requeridos:** `ecommerceapikey` (API Key).

**Body Requerido:**
```json
{
    "name": "Nombre de la Categoría"
}
```

<hr>

### 3. GET /products

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

### 4. GET /products/:id

**Descripción:** Recupera los detalles de un producto específico utilizando su ID único. La API verifica que el usuario autenticado sea el propietario del producto.

**Parámetros Requeridos:**
*   `:id` (Path): El _código_ o _Id_ del producto a recuperar.

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

### 5. GET /products/name/:name

**Descripción:** Filtra y recupera una lista de productos que contengan la cadena de texto proporcionada en el nombre.

**Parámetros Requeridos:**
*   `:name` (Path): El nombre o parte del nombre del producto a filtrar.

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

### 6. GET /products/category/:categoryname

**Descripción:** Filtra y recupera una lista de productos que estén incluídos en una categoría específica.

**Parámetros Requeridos:**
*   `:categoryname` (Path): El nombre o parte del nombre de la categoría de producto a filtrar.

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

### 7. POST /products

**Descripción:** Crea un nuevo producto bajo el perfil del usuario identificado. Requiere el nombre, la imagen (emoji), el precio y la categoría en el cuerpo de la petición.

**Parámetros Requeridos:**
N/A

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

### 8. PUT /products/:id

**Descripción:** Actualiza los datos de un producto existente utilizando su ID único. Requiere la imagen, el precio y la categoría en el cuerpo de la petición.

**Parámetros Requeridos:**
*   `:id` (Path): El _código_ o _Id_ del producto a modificar.

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

### 9. DELETE /products/:id
**Descripción:** Aplica un borrado lógico (*soft delete*) a un producto específico, marcándolo como eliminado sin borrarlo físicamente de la base de datos.

**Parámetros Requeridos:**
*   `:id` (Path): El _código_ o _Id_ del producto a eliminar.

**Body Requerido:** No aplica.

**Headers Requeridos:** `ecommerceapikey` (API Key).
```json
{}
```
<hr>
<br>

# Resumen de endpoints de Administración

| Endpoint | Método | Descripción | Parámetros Esperados | Body Requerido |
| :--- | :--- | :--- | :--- | :--- |
| `/hello-world` | `GET` | Activa el servicio de la API REST y retorna un mensaje de bienvenida. | Ninguno | N/A |
| `/create-admin-profile` | `POST` | Crea un nuevo perfil de administrador y genera su API Key. | Ninguno | `{ "userName": "nombre", "userEmail": "email@ejemplo.com" }` |
| `/recover-admin-profile` | `GET` | Recupera el token de administrador usando el email del usuario. | Ninguno | `{ "userEmail": "email@ejemplo.com" }` |
| `/get-metrics` | `POST` | Recupera las métricas de productos, usuarios y categorías. | ecommerceApiKey | N/A |

***

## 📝 Detalle de Endpoints

### 1. GET /hello-world

**Descripción:** Endpoint simple para verificar que la API está operativa y devolver un mensaje de bienvenida.

**Parámetros Requeridos:** N/A

**Body Requerido:** N/A

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

**Parámetros Requeridos:** N/A

**Headers Requeridos:** N/A

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

**Parámetros Requeridos:** N/A

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

### 4. POST /get-metrics

**Descripción:** Retorna métricas varias que permiten ver de una forma global cuántos productos y categorías activas existen, cuántos productos por categoría fueron creados, cuántos productos han sido eliminados (soft delete), cuántos perfiles de usuarios (admin) existen que todavía no crearon productos.

**Parámetros Requeridos:** N/A

**Body Requerido:** N/A


**Respuesta:**
```json
{
    {
    "status": "Ok",
    "dataMetrics": [
            {...},
            {...},
            {...},
            {...},
            {...},
        ]
    }   
}
```

<hr>