import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'
import resp from '../functions/responseHelper.js'
import { query as q } from "../database/connection.js";

const secret = process.env.JWT_SECRET

const login = async (req, res) => {
    try {
        const { username, password } = req.body

        if(!username || !password) {
            return resp(res, 403, req.body, 'Not enough data')
        }

        const query = `SELECT * FROM GAMIFICACION_MVP_DB.GAMIFICACION_DEV.GAM_USERS WHERE EMAIL = '${username}'`
        const qres = await q(query)
        const dbUser = qres[0]

        if (!dbUser) {
            return resp(res, 403, req.body, 'Incorrect data')
        }

        const passMatch = await bcrypt.compare(password, dbUser.password)

        if (!passMatch) {
            return resp(res, 403, req.body, 'Incorrect data')
        }

        // if (!dbUser.enabled) {
        //     return resp(res, 403, req.body, 'User disabled')
        // }

        const user = { id: dbUser.id_user, name: dbUser.name, username: dbUser.email, email: dbUser.email, type: dbUser.type }

        const token = jwt.sign({ user: user }, secret)

        return resp(res, 200, {user, token}, 'Success')

    } catch(error){
        console.log(error.stack)
        return resp(res, 500, null, 'Error')
    }
}

const checkauth = async (req, res) => {
    try {
        return resp(res, 200, null, 'success')
    } catch(error){
        console.log(error.stack)
        return resp(res, 500, null, 'Error')
    }
}

export { login, checkauth }