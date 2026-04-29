import { Router } from 'express'

import auth from './authRouter.js'
import reports from './reportsRouter.js'

const router = Router()

router.get('/', (req, res) =>{
    res.send('ok')
})

router.get('/api', (req, res) =>{
    res.send('ok')
})

router.use('/api/auth', auth)
router.use('/api/reports', reports)

export default router