import { Router } from 'express'
import { getUser, getUsers } from '../controllers/user.controllers.js'
import  authorize  from '../middlewares/auth.middleware.js'

const userRouter = Router()

userRouter.get('/', getUsers)

userRouter.get('/:id',authorize, getUser)

userRouter.post('/', (req, res) => {
  res.send({ title: 'Create a new user' })
})

userRouter.put('/:id', (req, res) => {
  res.send({ title: 'Update user by id' })
})

userRouter.delete('/:id', (req, res) => {
  res.send({ title: 'Delete user by id' })
})

export default userRouter
