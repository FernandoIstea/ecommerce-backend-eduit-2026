import { env } from 'process'
import TokenManager from '../services/TokenManager.Class.js'
import { MdbClass } from '../services/MdbClass.js'

/**
 * @route DELETE /productos/:id
 * @description Apply a soft delete in an existing product by ID.
 */
export const softDeleteProduct = async (req, res) => {
    let uid, status = 400
    const ecommerceApiKey = req.headers['ecommerceapikey']
    const id = req.params.id

    if (!ecommerceApiKey) { // No se informa Api Key
        return res.status(401).json({ success: false,
                                      message: 'You must inform a valid token to continue.'
                                    })
    }

    if (!id) { // No se informa ID de producto
        return res.status(401).json({ success: false, 
                                      errorMessage: 'You must send the Product Id to delete.' 
                                    })
    }

    const result = TokenManager.checkEncodedToken(ecommerceApiKey)

    try {
        if (result.valid) {
            uid = result.data.userId
            await MdbClass.connect(process.env.MONGO_DB_CONNECTION)
            const deletedProduct = await MdbClass.softDeleteProduct(id, uid)

            if (deletedProduct.status === "Ok") {
                return res.status(204).json({ success: true, data: {} })
            } else if (deletedProduct.errorMessage.includes('Product not found')) {
                status = 404
                throw new Error(`Product with id: '${id}' was not found.`)
            } else {
                status = 500
                throw new Error(`Error trying to delete the product with ID: ${id}`)
            }
        } else {
            status = 401
            throw new Error('You must inform a valid token to continue.')
        }
    } catch (error) {
        return res.status(status).json({
            success: false,
            errorMessage: `Error deleting product: ${error.message}`
        })
    }
}
