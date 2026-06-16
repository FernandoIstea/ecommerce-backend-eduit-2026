import { env } from 'process'
import TokenManager from '../services/TokenManager.Class.js'
import { MdbClass } from '../services/MdbClass.js'

/**
 * @route DELETE /productos/:id
 * @description Apply a soft delete in an existing product by ID.
 */
export const softDeleteProduct = async (req, res) => {
    let uid
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
            await MdbClass.connect(process.env.MONGO_DB_CONNECTION)
            const deletedProduct = await MdbClass.softDeleteProduct(id, result.data.userId)

            if (deletedProduct.status === "Ok") {
                return res.status(204).json({ success: true,
                                              data: {}
                                            })
            } else {
                throw new Error(`Error trying to delete the product with ID: ${id}`)
            }
        } else {
            throw new Error('You must inform a valid token to continue.')
        }
    } catch (error) {
        return res.status(500).json({
            success: false,
            errorMessage: `Error deleting product: ${error.message}`
        })
    }
}