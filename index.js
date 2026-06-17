import { env } from 'process'
import express from 'express'
import { MdbClass } from './services/MdbClass.js'
import TokenManager from './services/TokenManager.Class.js'

// CONTROLLERS
import { helloWorld } from './controllers/helloworld-controller.js'
import { createAdminProfile } from './controllers/createadminprofile-controller.js'
import { recoverProfile } from './controllers/recoverprofile-controller.js'
import { getCategories } from './controllers/getcategories-controller.js'
import { createCategory } from './controllers/createcategory-controller.js'
import { getProducts } from './controllers/getproducts-controller.js'
import { createProduct } from './controllers/createproduct-controller.js'
import { updateProduct } from './controllers/updateproduct-controller.js'
import { softDeleteProduct } from './controllers/softdeleteproduct-controller.js'
import { getProductById } from './controllers/getproductbyid-controller.js'

const app = express()
const PORT = process.env.PORT || 3000

app.use(express.json())
// --- Routes ---
app.get('/', (req, res)=> res.redirect('/hello-world') )
app.get('/hello-world', helloWorld)
// ADMIN
app.post('/create-admin-profile', createAdminProfile)
app.get('/recover-profile', recoverProfile)
// CATEGORIES
app.get('/categories', getCategories)
app.post('/categories', createCategory)
// PRODUCTS
app.get('/products', getProducts)
app.get('/products/:id', getProductById)
app.post('/products', createProduct)
app.put('/products/:id', updateProduct)
app.delete('/products/:id', softDeleteProduct)

app.use((req, res) =>   res.status(404).json({ errorMessage: `The Endpoint ${req.url} does not exist.` }) )

// --- Server Start ---
app.listen(PORT, () => {
    console.clear()
    console.log(`========================================================`)
    console.log(`🚀 Server running successfully!`)
    console.log(`🌐 Environment: ${process.env.NODE_ENV || 'development'}`)
    console.log(`🔗 API Endpoints available on ${process.env.RENDER_EXTERNAL_URL}  || 'localhost':${PORT}`)
    console.log(`========================================================`)
})
