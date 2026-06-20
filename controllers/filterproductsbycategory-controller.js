import { env } from 'process'
import TokenManager from '../services/TokenManager.Class.js'
import { MdbClass } from '../services/MdbClass.js'

    /**
     * Retrieves a single product by its ID and verifies ownership.
     * @param {string} categoryName - The Category name of the product(s) to retrieve.
     * @param {string} ownerId - The owner's ID from the API Key, used for authorization.
     * @returns {Promise<object>} An object containing the product data if found and owned by the user, or an error/null indicator.
     */
export const filterProductsByCategory = async (req, res) => {
    let uid
    let status = 500
    const ecommerceApiKey = req.headers['ecommerceapikey']

    if (!ecommerceApiKey) {
        return res.status(401)
                  .json({ success: false,
                          message: 'You must inform a valid token to continue.'
                        })
    }

    const categoryName = req.params.categoryname

    if (!categoryName) {
        return res.status(400)
                  .json({ success: false,
                          message: 'You must inform a category name of a product to filter.'
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
        const products = await MdbClass.filterProductsByCategory(categoryName, uid)

        if (products.status === 'Error') {
            status = 404
            throw new Error(`We cannot find Products in the category: '${categoryName}'`)
        }

        return res.status(200).json({ success: true,
                                      data: products.data
                                   })

    } catch (error) {
        return res.status(status)
                  .json({ success: false,
                          errorMessage: 'Error getting the filtered products.',
                          error: error.message
                        })
    }
}