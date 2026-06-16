/**
 * @route GET /hello-world
 * @description Simple welcome endpoint.
 */

export const helloWorld = (req, res)=> {
    return res.status(200).json({ success: true,
                           message: 'Te damos la bienvenida a E-commerce API!',
                           copyright: '2026 - Fernando Luna para Educación IT'
                        })
}