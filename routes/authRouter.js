import { Router } from 'express'
import { checkauth, login } from '../controllers/authController.js'
import { verifyToken } from '../middlewares/authMiddleware.js'
const routes = Router()

routes.post('/login', login)
routes.get('/checkauth', verifyToken, checkauth)

export default routes