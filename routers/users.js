import express from 'express'

import { verifyUser } from '../controllers/user.js'

const router = express.Router()

router.get('/',verifyUser)

export default router