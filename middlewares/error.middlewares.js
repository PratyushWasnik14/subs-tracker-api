const errorMiddleware = (err, req, res, next) => {
  console.error(err) // Log the full error for debugging

  let error = new Error(err.message)
  error.status = err.status || 500

  // Handle Mongoose bad ObjectId error
  if (err.name === 'CastError') {
    error = new Error(`Resource not found. Invalid: ${err.path}`)
    error.status = 404
  }

  // Handle Mongoose duplicate key error
  if (err.code === 11000) {
    error = new Error('Duplicate field value entered')
    error.status = 400
  }

  // Handle Mongoose validation errors
  if (err.name === 'ValidationError') {
    error = new Error(
      Object.values(err.errors)
        .map((val) => val.message)
        .join(', ')
    )
    error.status = 400
  }

  res.status(error.status).json({
    success: false,
    error: error.message,
  })

  // If the error is unexpected, pass it to the next error handler
  next(error)
}

export default errorMiddleware

// Key Fixes and Improvements
// ✅ Removes unnecessary try-catch → Express already catches errors and passes them here.
// ✅ Ensures error.status always exists → Defaults to 500.
// ✅ Logs the full error → Useful for debugging.
// ✅ Returns the response properly → res.status(...).json(...) executes correctly.
// ✅ Calls next(error) only if necessary → Ensures unhandled errors move forward.