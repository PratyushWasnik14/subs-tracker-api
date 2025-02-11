import User from '../models/users.models.js'

export const getUsers = async (req, res, next) => {
  try {
    const users = await User.find()
    res.status(200).json({ sucess: true, data: users })
  } catch (error) {
    next(error)
  }
}

export const getUser = async (req, res, next) => {
  try {
    const users = await User.findById(req.params.id).select('-password')
    if (!users) {
      return res.status(404).json({ sucess: false, message: 'User not found' })
    }
    res.status(200).json({ sucess: true, data: users })
  } catch (error) {
    next(error)
  }
}
