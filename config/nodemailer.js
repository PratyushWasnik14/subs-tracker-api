import nodemailer from "nodemailer"
import { EMAIL_PASSWORD } from "./env.js"

export const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'your_email@gmail.com',
    pass: 'your_password',
  },
})