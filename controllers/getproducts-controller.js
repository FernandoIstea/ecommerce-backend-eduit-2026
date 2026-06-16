import { env } from 'process'
import TokenManager from '../services/TokenManager.Class.js'
import { MdbClass } from '../services/MdbClass.js'

/**
 * @route GET /productos
 * @description Retrieves all products.
 */
export const getProducts = async (req, res) => {
    let uid
    const ecommerceApiKey = req.headers['ecommerceapikey']

    if (!ecommerceApiKey) {
        return res.status(401).json({ success: false,
                                      message: 'You must inform a valid token to continue.'
                                    })
    }

    const result = TokenManager.checkEncodedToken(ecommerceApiKey)

    try {
        if (result.valid) {
            uid = result.data.userId
        } else {
            throw new Error('Inform the correct token to continue.')
        }

        await MdbClass.connect(process.env.MONGO_DB_CONNECTION)
        const productsArray = await MdbClass.getProducts(uid)

        if (result) {
            return res.status(200).json({ success: true,
                                          data: productsArray
                                        })
        } else {
            throw new Error('Can\'t get categories data. Try again later.')
        }

    } catch (error) {
        return res.status(500)
                  .json({ success: false,
                          errorMessage: 'Error getting the products list.',
                          error: error.message
                        })
    }
}