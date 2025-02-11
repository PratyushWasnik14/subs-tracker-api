import express from "express";
import { PORT } from "./config/env.js";
import userRouter from "./routes/users.routes.js";
import subscriptionRouter from "./routes/subscription.routes.js";
import authRouter from "./routes/auth.routes.js";
import connectToDatabase from "./databases/mongodb.js";
import errorMiddleware from "./middlewares/error.middlewares.js";
import cookieParser from "cookie-parser";
import { signUp } from "./controllers/auth.controllers.js";
import dotenv from 'dotenv'
import arcjetMiddleware from "./middlewares/arcjet.middlewares.js";
import workflowRouter from "./routes/workflow.routes.js";
dotenv.config()

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())

app.use(arcjetMiddleware)

app.use(
    '/api/v1/auth',authRouter
);

app.use(
    '/api/v1/users',userRouter
);

app.use(
    '/api/v1/subscriptions',subscriptionRouter
);

app.use('/api/v1/workflow',workflowRouter)

app.use(errorMiddleware)


app.get("/", (req, res) => {
    res.send("welcome to subdub");
})

app.listen(PORT, async () => {
  console.log(`listening on port ${PORT}`);


  await connectToDatabase()
})

export default app;