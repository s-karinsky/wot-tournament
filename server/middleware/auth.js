import jwt from 'json-web-token'

const { JWT_SECRET } = process.env

export default function(req, res, next) {
  const token = req.cookies.token
  jwt.decode(JWT_SECRET, token, function(error, result) {
    if (!error) {
      const { user_id, account_id, access_token, clan_id, clan_role } = result
      req.session.user = {
        user_id,
        account_id,
        access_token,
        clan_id,
        clan_role
      }
    }

    next()
  })
}