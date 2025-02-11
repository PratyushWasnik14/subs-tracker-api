import {client as workflowClient} from '@upstash/worlflow'
import { QSTASH_TOKEN, QSTASH_URL } from './env'

import {QSTASH_TOKEN,QSTASH_URL} from './env.js'

export const workflowClient = new workflowClient({
    url: QSTASH_URL,
    token: QSTASH_TOKEN,
})