import { env } from 'process'
import TokenManager from '../services/TokenManager.Class.js'
import { MdbClass } from '../services/MdbClass.js'

/**
 * @route GET /recover-admin-profile
 * @description Retrieves an admin profile by ID. Requires id query parameter.
 */
export const recoverProfile = async (req, res) => {
    if (!req.query) {
        return res.status(401).json({
            success: false,
            errorMessage: 'User Data is required for token recovery.'
        })
    }

    const { userEmail } = req.body
    if (!userEmail) {
        return res.status(400).json({
            success: false,
            errorMessage: 'User Data is required for token recovery.'
        })
    }

    try {
        await MdbClass.connect(process.env.MONGO_DB_CONNECTION)
        const result = await MdbClass.getUserData(userEmail)

        if (result) {
            const TIMER = parseInt(Math.random() * 10000)
            setTimeout(() => {
                const recovertoken = TokenManager.buildEncodedToken(result)
                return res.status(200).json({
                    success: true,
                    data: recovertoken.token
                })                
            }, TIMER)
        } else {
            return res.status(401).json({
                success: false,
                errorMessage: "Error trying to recover the token."
            })
        }
    } catch (error) {
        return res.status(500)
                  .json({ success: false, 
                          errorMessage: "Server error or Unavailable."
                        })
    }
}