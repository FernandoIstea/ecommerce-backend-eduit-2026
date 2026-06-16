import { env } from 'process'
import TokenManager from '../services/TokenManager.Class.js'
import { MdbClass } from '../services/MdbClass.js'

/**
 * @route PUT /productos/:id
 * @description Updates an existing product by ID. Requires name and price in body.
 */
export const updateProduct = async (req, res) => {
    let uid
    const id = req.params.id

    if (!id) { // No se informa ID de producto
        return res.status(401).json({ success: false, 
                                      errorMessage: 'You must send the Product Id to modify.' 
                                    })
    }

    if (!req.headers['ecommerceapikey']) { // No se envía el token
        return res.status(401).json({ success: false, 
                                      errorMessage: 'You must send a valid token also the new product information to create it.'
                                    })
    }

    if (!req.body) { // No se envía el cuerpo de la petición
        return res.status(400).json({ success: false,
                                      errorMessage: 'You must send the whole information of a new product to create it.'
                                    })
    }

    const ecommerceApiKey = req.headers['ecommerceapikey']
    const result = TokenManager.checkEncodedToken(ecommerceApiKey)
    const { imagen, precio, categoria } = req.body

    if (!imagen || !precio || !categoria) { // Faltan datos en algún campo requerido
        return res.status(400).json({ success: false, 
                                      errorMessage: '"imagen", "precio" and "categoria" fields are mandatory.'
                                    })
    }

    try {
        if (result.valid) {
            uid = result.data.userId

            const modifiedData = {
                imagen: imagen,
                precio: precio,
                categoria: categoria,
                owner: uid 
            }
            
            await MdbClass.connect(process.env.MONGO_DB_CONNECTION)
            const updatedProduct = await MdbClass.updateProduct(id, modifiedData)

            if (updateProduct) {
                return res.status(200).json(updatedProduct)
            } else {
                throw new Error(`Error trying to update the product with ID: ${id}`)
            }

        } else {
            throw new Error('You must inform a valid token to continue.')
        }

    } catch (error) {
        return res.status(500)
                  .json({ success: false, 
                          message: `Server error has ocurred: ${error.message}` 
                        })
    }
}
