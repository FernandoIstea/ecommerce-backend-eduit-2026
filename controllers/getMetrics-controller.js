import { env } from 'process'
import TokenManager from '../services/TokenManager.Class.js'
import { MdbClass } from '../services/MdbClass.js'

export const getMetrics = async (req, res) => {
    let uid, status = 500
    const ecommerceApiKey = req.headers['ecommerceapikey']

    if (!ecommerceApiKey) {
        return res.status(401).json({
            success: false,
            message: 'You must inform a valid token to continue.'
        })
    }

    const result = TokenManager.checkEncodedToken(ecommerceApiKey)

    try {
        if (result.valid) {
            const ownerId = result.data.userId

            await MdbClass.connect(process.env.MONGO_DB_CONNECTION)
            const metricsArray = await MdbClass.getMetrics(ownerId)

            return res.status(200).json(metricsArray)

        } else {
            status = 401
            throw new Error('Inform the correct token to continue.')
        }

    } catch (error) {
        res.status(status)
            .json({
                success: false,
                errorMessage: error.message
            })
    }
}