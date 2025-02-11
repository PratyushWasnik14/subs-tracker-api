import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'
import User from '../models/users.models.js'
import jwt from 'jsonwebtoken'

export const signUp = async (req, res, next) => {
  // Start a session for a transaction
  const session = await mongoose.startSession()
  session.startTransaction() // ✅ Start the transaction

  try {
    const { name, email, password } = req.body

    // Check if the user already exists
    const existingUser = await User.findOne({ email }).session(session)
    if (existingUser) {
      // If user exists, throw an error
      throw new Error('User already exists')
    }

    // Hash the password
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password, salt)
    console.log('Hashed Password:', hashedPassword) // Debugging hashed password

    // Create the new user inside the transaction
    const newUser = await User.create(
      [{ name, email, password: hashedPassword }],
      { session }
    )

    // Attach a JWT token for the new user
    const token = jwt.sign({ id: newUser[0]._id }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN,
    })

    // ✅ Commit the transaction if everything is successful
    await session.commitTransaction()
    session.endSession()

    // Respond with the new user and token
    res.status(201).json({
      success: true,
      message: 'User created successfully',
      data: {
        user: newUser[0], // Access the first user in the array
        token,
      },
    })
  } catch (error) {
    // ❌ If something fails, rollback the transaction
    await session.abortTransaction()
    session.endSession()
    next(error)
  }
}


export const signIn = async (req, res, next) => {
  try {
    const { email, password } = req.body

    // Check if email or password is missing
    if (!email || !password) {
      return res
        .status(400)
        .json({ message: 'Email and password are required' })
    }

    // Check if the user exists
    const user = await User.findOne({ email })
    console.log('Found User:', user) // Debugging the found user

    // If the user doesn't exist
    if (!user) {
      return res.status(404).json({ message: 'User not found' })
    }

    // If the user does not have a password field
    if (!user.password) {
      return res.status(500).json({ message: 'User password not found' })
    }

    // Compare the provided password with the stored hash
    let isPasswordCorrect
    try {
      isPasswordCorrect = await bcrypt.compare(password, user.password)
    } catch (error) {
      return res.status(500).json({ message: 'Error comparing passwords' })
    }

    // If password doesn't match
    if (!isPasswordCorrect) {
      return res.status(400).json({ message: 'Invalid password' })
    }

    // Generate a JWT token for the user
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN,
    })

    // Respond with user data and token
    res.status(200).json({
      success: true,
      message: 'User signed in successfully',
      data: {
        user,
        token,
      },
    })
  } catch (error) {
    next(error)
  }
}


export const signOut = async (req, res, next) => {
  // implent the sign out logic
}

//what is a request body ?
// A request body is the data that a client (like a web browser or mobile app) sends to the server when making an HTTP request, usually in POST, PUT, or PATCH requests. It contains the information that the server needs to process the request.
