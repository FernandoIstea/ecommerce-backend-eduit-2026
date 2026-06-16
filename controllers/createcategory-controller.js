import { env } from 'process'
import TokenManager from '../services/TokenManager.Class.js'
import { MdbClass } from '../services/MdbClass.js'

/**
 * @route POST /categorias
 * @description Creates a new category. Requires name in body.
 */
export const createCategory = async (req, res) => {
    if (!req.body || !req.headers['ecommerceapikey']) {
        return res.status(400).json({ success: false,
                                      errorMessage: 'You must send a valid token also the new category name to create it.'
                                    })
    }

    let uid
    const ecommerceApiKey = req.headers['ecommerceapikey']
    const { name } = req.body
    
    if (name.trim() === '' || ecommerceApiKey.trim() === '') {
        return res.status(400).json({ success: false,
                                      errorMessage: 'You must send a valid token also the new category name to create it.'
                                    })
    }

    const result = TokenManager.checkEncodedToken(ecommerceApiKey)

    try {
        if (result.valid) {
            uid = result.data.userId
        } else {
            throw new Error('Inform a valid token to continue.')
        }

        const newCategory = {
            nombre: name,
            owner: uid
        }

        await MdbClass.connect(process.env.MONGO_DB_CONNECTION)
        const categoryCreated = await MdbClass.createCategory(newCategory)
        console.log(categoryCreated.newId.toString())
        if (categoryCreated.status === 'Ok') {
            delete newCategory._id 
            newCategory.id = categoryCreated.newId.toString()
            return res.status(201).json({success: true, data: newCategory})
        } else {
            throw new Error('The new category can\'t be created.')
        }

    } catch (error) {
        return res.status(500)
                  .json({ success: false,
                          errorMessage: 'Error creating a new category.',
                          error: error.message
                        })
    }
}