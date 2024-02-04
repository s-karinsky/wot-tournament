import jwt from 'json-web-token'
import User from '../models/user.js'

const { JWT_SECRET } = process.env

export default function(req, res, next) {
  const token = req.cookies.token
  jwt.decode(JWT_SECRET, token, function(error, result) {
    if (!error) {
      const { user_id, account_id, access_token, clan_id, clan_role } = result
      User.findById(user_id)
        .then(user => {
          if (['admin', 'moderator'].includes(user?.role)) {
            req.session.user = {
              user_id,
              account_id,
              access_token,
              clan_id,
              clan_role,
              role: user.role
            }
            next()
          } else {
            throw new Error('No access')
          }
        })
        .catch((error) => {
          res.status(403).json({ success: false, error: error.message })
        })
    } else {
      res.status(403).json({ success: false, error: 'Bad token' })
    }
  })
}