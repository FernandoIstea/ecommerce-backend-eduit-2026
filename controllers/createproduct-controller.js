import { env } from 'process'
import TokenManager from '../services/TokenManager.Class.js'
import { MdbClass } from '../services/MdbClass.js'

/**
 * @route POST /productos
 * @description Creates a new product. Requires name and price in body.
 */
export const createProduct = async (req, res) => {
    let uid
    if (!req.headers['ecommerceapikey']) {
        return res.status(401).json({ success: false, 
                                      errorMessage: 'You must send a valid token also the new product information to create it.'
                                    })
    }

    if (!req.body) {
        return res.status(400).json({ success: false,
                                      errorMessage: 'You must send the whole information of a new product to create it.'
                                    })
    }

    const { nombre, imagen, precio, categoria } = req.body
    if (!nombre || !imagen || !precio || !categoria) {
        return res.status(400).json({ success: false, 
                                      errorMessage: 'Whole fields are required.'
                                    })
    }
    
    const ecommerceApiKey = req.headers['ecommerceapikey']
    const result = TokenManager.checkEncodedToken(ecommerceApiKey)

    try {
        if (!result.valid) {
            throw new Error('Inform a valid token to continue.')
        }

        uid = result.data.userId

        const newProduct = {
            nombre: nombre,
            imagen: imagen,
            precio: precio,
            categoria: categoria,
            owner: uid
        }

        // return res.json(newProduct)

        await MdbClass.connect(process.env.MONGO_DB_CONNECTION)
        const productCreated = await MdbClass.createProduct(newProduct)

        if (productCreated.status === 'Ok') {
            newProduct.id = productCreated.newId.toString()
            delete newProduct._id

            console.table(newProduct)
            return res.status(201).json({ success: true, 
                                          data: newProduct 
                                        })
        } else {
            throw new Error('The new product can\'t be created.')
        }

    } catch (error) {
        return res.status(500)
                  .json({ success: false,
                          errorMessage: 'Error creating a new product.',
                          error: error.message
                        })        
    }
}