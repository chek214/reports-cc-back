import { Router } from 'express'
import { activeUsers, newUsers } from '../controllers/reportsController.js'
import { verifyToken } from '../middlewares/authMiddleware.js'
const routes = Router()

routes.post('/active', verifyToken, activeUsers)
routes.post('/new', verifyToken, newUsers)

export default routes