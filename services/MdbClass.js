import { MongoClient, ObjectId } from 'mongodb'

/**
 * @class MdbClass
 * @description Manages MongoDB connections and database operations for the application.
 */
export class MdbClass {
    /**
     * @private
     * @static 
     * @type {MongoClient | null} The MongoDB client instance.
     */
    static client = null

    /**
     * Initializes the connection to MongoDB using the environment variable MONGO_DB_CONNECTION.
     * This method should be called once at application startup.
     * @param {string} connectionString - The MongoDB connection URI.
     * @returns {Promise<void>} A promise that resolves when the client is connected.
     */
    static async connect(connectionString) {
        if (!connectionString) {
            throw new Error("CONNECTION_STRING_Environment variable is not set.")
        }

        try {
            this.client = new MongoClient(connectionString)
            await this.client.connect()
            console.log("✅ Successfully connected to MongoDB.")
        } catch (error) {
            console.error("❌ Error connecting to MongoDB:", error)
            throw error
        }
    }

    /**
     * Retrieves user data from the 'users' collection by email.
     * @param {string} emailName - The email address of the user to retrieve.
     * @returns {Promise<object | string>} The user document if found, or an error message/object.
     */
    static async getUserData(emailName) {
        if (!this.client) {
            return "Error: Database client not initialized. Call MdbClass.connect() first."
        }

        const dbName = process.env.MONGO_DB_NAME || 'ecommerce'
        const collectionName = 'users'

        try {
            const db = this.client.db(dbName)
            const usersCollection = db.collection(collectionName)

            const userData = await usersCollection.findOne({ userEmail: emailName })

            if (userData) {
                console.log(`✅ Successfully retrieved data for user: ${emailName}`)
                delete userData._id
                return userData
            } else {
                console.warn(`⚠️ User not found with email: ${emailName}`)
                return null
            }

        } catch (error) {
            console.error("❌ Error retrieving user data:", error)
            // Return a structured error object or message upon failure
            return { success: false, message: `Database query failed: ${error.message}` }
        }
    }

    /**
     * Creates a new admin profile in the 'users' collection.
     * @param {object} userData - JSON object containing user data (e.g., { username: string, email: string }).
     * @returns {Promise<string>} "Ok" if creation is successful, or "Error" otherwise.
     */
    static async createAdminProfile(userData) {
        if (!this.client) {
            return { status: 'Error', errorMessage: 'Database client not initialized. Call MdbClass.connect() first.' }
        }

        const dbName = process.env.MONGO_DB_NAME || 'ecommerce'
        const collectionName = 'users'

        try {
            const db = this.client.db(dbName)
            const usersCollection = db.collection(collectionName)

            if (!userData || !userData.userName || !userData.userEmail) {
                return {status: 'Error', errorMessage: 'Missing username or email in user data.'}
            }

            await usersCollection.insertOne(userData)
            return { status: 'Ok', userData: userData }

        } catch (error) {
            return { status: 'Error', message: `Failed to create profile. Details: ${error.message}` }
        }
    }

    /**
     * Checks if a user with the given email already exists in the 'users' collection.
     * @param {string} email - The email address to check.
     * @returns {Promise<{exists: boolean}>} An object indicating existence.
     */
    static async isEmailExists(email) {
        if (!this.client) {
            throw new Error("Database client not initialized. Call MdbClass.connect() first.")
        }

        const dbName = process.env.MONGO_DB_NAME || 'ecommerce'
        const collectionName = 'users'

        try {
            const db = this.client.db(dbName)
            const usersCollection = db.collection(collectionName)

            const count = await usersCollection.countDocuments({ userEmail: email })
            return { exists: count > 0 }

        } catch (error) {
            throw new Error(`Database query failed: ${error.message}`)
        }
    }

    /**
     * Validates if the provided string is a valid MongoDB ObjectId format (24-character hex string).
     * @param {string} idString - The potential ObjectId string to validate.
     * @returns {boolean} True if the string is a valid ObjectId, false otherwise.
     */
    static isValidObjectId(idString) {
        if (!idString || typeof idString !== 'string') {
            return false
        }
        try {
            new ObjectId(idString)
            return true
        } catch (e) {
            return false
        }
    }

    static async createCategory(newCategory) {
        if (!this.client) {
            return { 
                status: 'Error', 
                errorMessage: 'Database client not initialized. Call MdbClass.connect() first.' 
            }
        }

        const dbName = process.env.MONGO_DB_NAME 
        const collectionName = 'categories'

        try {
            const db = this.client.db(dbName)
            const categoriesCollection = db.collection(collectionName)
            const categoryCreated = await categoriesCollection.insertOne(newCategory)

            if (categoryCreated.acknowledged) {
                return { status: 'Ok', newId: categoryCreated.insertedId }
            } else {
                throw new Error('Error creating a new category')
            }
        } catch (error) {
            return { status: 'Error', errorMessage: error.message }
        }
    }

    static async getCategories(owner) {
        if (!this.client) {
            return { status: 'Error', errorMessage: 'Database client not initialized. Call MdbClass.connect() first.' }
        }

        const dbName = process.env.MONGO_DB_NAME || 'ecommerce'
        const collectionName = 'categories'
        try {
            const db = this.client.db(dbName)
            const categoriesCollection = db.collection(collectionName)
            const queryFilter = { owner: owner }

            const categoriesCursor = await categoriesCollection.find(queryFilter)
            const categoriesArray = await categoriesCursor.toArray()
            const categories = categoriesArray.map((category)=> {
                return {
                    id: category._id,
                    nombre: category.nombre
                }
            })

            if (categories) {
                return categories
            } else {
                return null
            }

        } catch (error) {
            return { 
                success: false, 
                message: `Database query failed: ${error.message}` 
            }
        }
    }

    static async getProducts(owner) {
        if (!this.client) {
            return { status: 'Error', errorMessage: 'Database client not initialized. Call MdbClass.connect() first.' }
        }

        const dbName = process.env.MONGO_DB_NAME || 'ecommerce'
        const collectionName = 'products'

        try {
            const db = this.client.db(dbName)
            const productsCollection = db.collection(collectionName)
            const queryFilter = { owner: owner, deleted: { $exists: false } }
            // PRIMERA OPCION FUNCIONANDO: const queryFilter = { owner: userId }
            // OTRA OPCION POR SI NO FUNCIONA LA ACTUAL: deleted: { $ne: true }

            const productsCursor = await productsCollection.find(queryFilter)
            const productsArray = await productsCursor.toArray()
            const products = productsArray.map((product)=> {
                return {
                    id: product._id,
                    nombre: product.nombre,
                    imagen: product.imagen,
                    precio: product.precio,
                    categoria: product.categoria,
                }
            })

            if (products) {
                return products
            } else {
                return null
            }

        } catch (error) {
            return { 
                success: false, 
                message: `Database query failed: ${error.message}` 
            }
        }
    }

    static async getProductById(id, owner) {
        if (!this.client) {
            return { status: 'Error', errorMessage: 'Database client not initialized. Call MdbClass.connect() first.' }
        }

        if (!this.isValidObjectId(id)) {
            throw new Error(`Invalid ID: ${id}.`)
        }

        const dbName = process.env.MONGO_DB_NAME
        const collectionName = 'products'

        try {
            const db = this.client.db(dbName)
            const productsCollection = db.collection(collectionName)
            const queryFilter = { _id: new ObjectId(id), owner: owner, deleted: { $ne: true } }
            const productDocument = await productsCollection.findOne(queryFilter)

            if (!productDocument?._id) {
                return { status: 'Error', 
                         messageError: `We cannot find a Product with this ID: ${id}`
                }
            }

            const productFound = {
                    id: productDocument._id.toString(),
                    nombre: productDocument.nombre,
                    imagen: productDocument.imagen,
                    precio: productDocument.precio,
                    categoria: productDocument.categoria,
                }

            return { status: 'Ok',
                     data: productFound
            }

        } catch (error) {
            return { 
                status: 'Error',
                message: `Database query failed: ${error.message}` 
            }
        }
    }

    static async filterProductsByName(name, owner) {
        console.log('Se invocó filterProductsByName')
        if (!this.client) {
            return { status: 'Error', 
                     errorMessage: 'Database client not initialized. Call MdbClass.connect() first.' 
                   }
        }

        if (!name) {
            throw new Error(`You must inform a valida name to filter products.`)
        }

        const escapeRegExp = (string)=> string.replaceAll(/[.*+?^${}()|[\]\\]/g, '\\$&')

        const dbName = process.env.MONGO_DB_NAME
        const collectionName = 'products'

        try {
            const db = this.client.db(dbName)
            const productsCollection = db.collection(collectionName)
            const regexPattern = new RegExp(escapeRegExp(name), 'i')

            const queryFilter = { nombre: regexPattern, owner: owner, deleted: { $ne: true } }
            const productDocuments = await productsCollection.find(queryFilter)
                                                             .toArray()

            if (Array.isArray(productDocuments) && productDocuments.length > 0) {
                const filteredProducts = productDocuments.map((prod)=> {
                    return {
                               id: prod._id.toString(),
                               nombre: prod.nombre,
                               imagen: prod.imagen,
                               precio: prod.precio,
                               categoria: prod.categoria
                           }
                })

                return { status: 'Ok',
                         data: filteredProducts
                       }
            } else {
                return { status: 'Error', 
                        messageError: `We cannot find Products with name: '${name}'.`
                    }
            } 
        } catch (error) {
            return { 
                status: 'Error',
                message: `Database query failed: ${error.message}` 
            }
        }
    }

    static async filterProductsByCategory(categoryName, owner) {
        if (!this.client) {
            return { status: 'Error', 
                     errorMessage: 'Database client not initialized. Call MdbClass.connect() first.' 
                   }
        }

        if (!categoryName) {
            throw new Error(`You must inform a valida category name to filter its products.`)
        }

        const escapeRegExp = (string)=> string.replaceAll(/[.*+?^${}()|[\]\\]/g, '\\$&')

        const dbName = process.env.MONGO_DB_NAME
        const collectionName = 'products'

        try {
            const db = this.client.db(dbName)
            const productsCollection = db.collection(collectionName)
            const regexPattern = new RegExp(escapeRegExp(name), 'i')
            
            const queryFilter = { categoria: regexPattern, owner: owner, deleted: { $ne: true } }
            const productDocuments = await productsCollection.find(queryFilter)
                                                             .toArray()

            if (Array.isArray(productDocuments) && productDocuments.length > 0) {
                const filteredProducts = productDocuments.map((prod)=> {
                    return {
                               id: prod._id.toString(),
                               nombre: prod.nombre,
                               imagen: prod.imagen,
                               precio: prod.precio,
                               categoria: prod.categoria
                           }
                })

                return { status: 'Ok',
                         data: filteredProducts
                       }
            } else {
                return { status: 'Error', 
                        messageError: `We cannot find Products in the category: '${name}'.`
                    }
            } 
        } catch (error) {
            return { 
                status: 'Error',
                message: `Database query failed: ${error.message}` 
            }
        }
    }

    static async createProduct(newProduct) {
        if (!this.client) {
            return { 
                status: 'Error', 
                errorMessage: 'Database client not initialized. Call MdbClass.connect() first.' 
            }
        }

        const dbName = process.env.MONGO_DB_NAME 
        const collectionName = 'products'

        try {
            const db = this.client.db(dbName)
            const categoriesCollection = db.collection(collectionName)
            const productCreated = await categoriesCollection.insertOne(newProduct)

            if (productCreated.acknowledged) {
                return { status: 'Ok', 
                         newId: productCreated.insertedId 
                       }
            } else {
                throw new Error('Error creating a new product')
            }
        } catch (error) {
            return { status: 'Error', 
                     errorMessage: error.message 
                   }
        }
    }

    static async updateProduct(id, modifiedData) {
        if (!this.client) {
            throw new Error('Database client not initialized. Call MdbClass.connect() first.')
        }

        if (!this.isValidObjectId(id)) {
            throw new Error(`Invalid ID: ${id}`)
        }

        const dbName = process.env.MONGO_DB_NAME
        const collectionName = 'products'

        try {
            const filter = { _id: new ObjectId(id), owner: modifiedData.owner }
            const updateFields = { $set: { ...modifiedData } }
            const result = await this.client.db(dbName)
                                            .collection(collectionName)
                                            .updateOne(filter, updateFields)

            if (result.matchedCount === 0) {
                throw new Error('Product not found or its Owner does not fit with the informed ID.' )
            }

            const updatedProduct = await this.client.db(dbName)
                                                    .collection(collectionName)
                                                    .findOne(filter)

            if (!updatedProduct) {
                throw new Error('We can\'t get the Product after the update.')
            }

            return {
                success: true,
                data: {
                    id: updatedProduct._id.toString(), // MongoDB devuelve ObjectId aquí
                    nombre: updatedProduct.nombre,
                    imagen: updatedProduct.imagen,
                    precio: updatedProduct.precio,
                    categoria: updatedProduct.categoria,
                }
            }

        } catch (error) {
            return { status: 'Error', 
                     errorMessage: `Error updating Product: ${error.message}` 
                   }
        }
    }

    static async softDeleteProduct(id, owner) {
        if (!this.client) {
            return { status: 'Error', errorMessage: 'Database client not initialized. Call MdbClass.connect() first.' }
        }

        if (!this.isValidObjectId(id)) {
            throw new Error(`Invalid ID: ${id}`)
        }

        const dbName = process.env.MONGO_DB_NAME
        const collectionName = 'products'

        try {
            const queryFilter = { _id: new ObjectId(id), owner: owner, deleted: { $ne: true } }
            const deleteData = { deleted: true }
            const updateField = { $set: { ...deleteData } }

            const result = await this.client.db(dbName)
                                            .collection(collectionName)
                                            .updateOne(queryFilter, updateField)

            if (result.matchedCount === 0 && result.modifiedCount === 0) {
                throw new Error(`Product not found or owner does not match with the informed ID. ${id}`)
            }

            return { status: "Ok", message: 'Deleted successfully.' }
        
        } catch (error) {
            return { status: 'Error', 
                     errorMessage: `Error deleting the product: ${error.message}` 
                   }
        }
    }

    static async disconnect() {
        if (this.client) {
            await this.client.close()
            console.log("🔌 Disconnected from MongoDB.")
            this.client = null
        }
    }
}