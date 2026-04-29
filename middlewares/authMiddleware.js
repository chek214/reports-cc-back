import jwt from 'jsonwebtoken'
import resp from '../functions/responseHelper.js'

const verifyToken = (req, res, next) => {
    try {
        const authHeader = req.header('Authorization')
        if (!authHeader) {
            return resp(res, 403, null, 'Missing Authorization Header')
        }

        let token = authHeader

        if (authHeader.startsWith("Bearer ")){
            token = authHeader.substring(7, authHeader.length)
        }

        if (!token || token === null || token === undefined || token === '' || token === 'null' || token === 'undefined') {
            return resp(res, 403, null, 'Invalid Token')
        }
        
        jwt.verify(token, process.env.JWT_SECRET, function(err, decodedToken) {
             req.token = decodedToken
             next()
        })
    } catch (error) {
        console.log(error.stack)
        return resp(res, 403, null, 'Invalid Token')
    }
}

// const verifyAdmin = (req, res, next) => {
//     try {
//         const type = req.token.user.type
//         if (type === 'admin') {
//             next()
//         } else {
//             return resp(res, 400, null, 'Not enough privileges')
//         }
//     } catch (error) {
//         console.log(error.stack)
//         return resp(res, 403, null, 'Invalid Token')
//     }
// }

export { verifyToken }
