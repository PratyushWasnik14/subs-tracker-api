import jwt from 'jsonwebtoken'
import { JWT_SECRET } from '../config/env.js' // ✅ Ensure correct import

const authorize = async (req, res, next) => {
  try {
    let token = req.headers.authorization
    if (!token) {
      return res.status(403).json({ success: false, message: 'Unauthorized' })
    }

    token = token.split(' ')[1]
    if (!token) {
      return res.status(403).json({ success: false, message: 'Unauthorized' })
    }

    const decoded = jwt.verify(token, JWT_SECRET) // ✅ Using imported JWT_SECRET
    if (!decoded) {
      return res.status(403).json({ success: false, message: 'Unauthorized' })
    }

    req.user = decoded
    next()
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}

export default authorize
