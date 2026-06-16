import { env } from 'process'
import TokenManager from '../services/TokenManager.Class.js'
import { MdbClass } from '../services/MdbClass.js'

/**
 * @route POST /create-admin-profile
 * @description Creates a new admin profile. Requires username and email in body.
 */
export const createAdminProfile = async (req, res) => {
    if (!req.body) {
        return res.status(401).json({ error: 'Username and email are required.' })
    }

    const { userName, userEmail } = req.body
    if (!userName || !userEmail) {
        return res.status(400).json({ error: 'Username and email are required.' })
    }

    await MdbClass.connect(process.env.MONGO_DB_CONNECTION)
    const validate = await MdbClass.isEmailExists(userEmail)
    if (validate.exists) {
        return res.status(409).json({ success: false, 
                                      errorMessage: 'Existe un conflicto con el correo electrónico o el nombre del usuario.' }
                                    )
    }

    const info = {
        userId: TokenManager.returnNewUID(),
        userName: userName,
        userEmail: userEmail,
        createdAt: Date.now()
    }

    const result = await MdbClass.createAdminProfile(info)

    if (result.status === "Ok") {
        const ecommerceToken = TokenManager.buildEncodedToken(info)
        info.apiKey = ecommerceToken.token
        delete info._id 

        console.log('Attempting to create admin profile:', { userName, userEmail })
        return res.status(201).json({ success: true, 
                               message: `Admin profile created successfully for ${userName}.`, 
                               info 
                            })
    } else {
        return res.status(500).json({ error: result })
    }
}