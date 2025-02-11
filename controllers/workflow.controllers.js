import { serve } from '@upstash/workflow'
import dayjs from 'dayjs'

import Subscription from '../models/subscriptions.models.js'
import { sendReminderEmail } from '../utils/send-email.js'

const reminders = [7, 5, 2, 1]

export const sendReminders = serve(async (context) => {
  const { subscriptionId } = context.requestPayload
  const subscription = await fetchSubscription(context, subscriptionId)

  if (!subscription || subscription.status !== 'active') {
    return {
      success: false,
      message: 'Subscription not found',
    }
  }

  const renewalDate = dayjs(subscription.renewalDate)

  if (renewalDate.isBefore(dayjs())) {
    console.log(
      `Renewal date has passed for subscription ${subscriptionId}. Stopping workflow`
    )
    return
  }

  for (const daysBefore of REMINDERS) {
    const reminderDate = renewalDate.subtract(daysBefore, 'day')

    if (reminderDate.isBefore(dayjs())) {
      // schedule reminder
      await sleepUntilReminder(
        context,
        `reminder-${daysBefore} days before`,
        reminderDate
      )
    }

    if (dayjs().isSame(reminderDate, 'day')) {
      await triggerReminder(
        context,
        `${daysBefore} days before reminder`,
        subscription
      )
    }
  }
})

const fetchSubscription = async (context, subscriptionId) => {
  return await context.run('get subscription', async() => {
    return Subscription.findById(subscriptionId).populate('user', 'name email')
  })
}

const sleepUntilReminder = async (context, label, date) => {
  console.log(`sleeping until ${label} reminder at ${date}`)
  await context.sleepUntil(label, date.toDate())
}

const triggerReminder = async (context, label, subscription) => {
  console.log(`triggering ${label} reminder`)
  // send an email sms push notiification
  await sendReminderEmail({
    to: subscription.user.email,
    type:label,
    subscription,})
  
}
 