 import { Router } from 'express'
import { sendReminders } from '../controllers/workflow.controllers.js'

 const workflowRouter = Router()

 workflowRouter.get('/subscriptions/reminder', sendReminders)

 export default workflowRouter