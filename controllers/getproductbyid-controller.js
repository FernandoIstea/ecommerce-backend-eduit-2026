import { env } from 'process'
import TokenManager from '../services/TokenManager.Class.js'
import { MdbClass } from '../services/MdbClass.js'

    /**
     * Retrieves a single product by its ID and verifies ownership.
     * @param {string} id - The MongoDB Object ID of the product to retrieve.
     * @param {string} ownerId - The owner's ID from the API Key, used for authorization.
     * @returns {Promise<object>} An object containing the product data if found and owned by the user, or an error/null indicator.
     */
export const getProductById = async (req, res) => {
    let uid
    let status = 500
    const ecommerceApiKey = req.headers['ecommerceapikey']
    if (!ecommerceApiKey) {
        return res.status(401)
                  .json({ success: false,
                          message: 'You must inform a valid token to continue.'
                        })
    }

    const id = req.params.id
    if (!id) {
        return res.status(400)
                  .json({ success: false,
                          message: 'You must inform a valid ID to filter.'
                        })
    }

    const result = TokenManager.checkEncodedToken(ecommerceApiKey)

    try {
        if (result.valid) {
            uid = result.data.userId
        } else {
            status = 401
            throw new Error('Inform the correct token to continue.')
        }

        await MdbClass.connect(process.env.MONGO_DB_CONNECTION)
        const product = await MdbClass.getProductById(id, uid)

        if (product.status === 'Error') {
            status = 404
            throw new Error(`We cannot get a product with ID: ${id}`)
        }

        return res.status(200).json({ success: true,
                                      data: product.data
                                    })

    } catch (error) {
        return res.status(status)
                  .json({ success: false,
                          errorMessage: 'Error getting the filtered product.',
                          error: error.message
                        })
    }
}