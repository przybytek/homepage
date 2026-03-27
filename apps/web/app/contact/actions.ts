'use server'

import { SESv2Client, SendEmailCommand } from '@aws-sdk/client-sesv2'

interface ContactState {
  success: boolean
  error: string
}

const FROM = process.env.SES_FROM_ADDRESS
const REGION = process.env.SES_REGION ?? 'us-east-1'

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

export async function sendContactMessage(
  _prev: ContactState,
  formData: FormData,
): Promise<ContactState> {
  const name = (formData.get('name') as string | null)?.trim() ?? ''
  const email = (formData.get('email') as string | null)?.trim() ?? ''
  const message = (formData.get('message') as string | null)?.trim() ?? ''

  if (!name || !email || !message) {
    return { success: false, error: 'All fields are required.' }
  }
  if (!isValidEmail(email)) {
    return { success: false, error: 'Please enter a valid email address.' }
  }
  if (message.length > 2000) {
    return { success: false, error: 'Message must be under 2 000 characters.' }
  }
  if (!FROM) {
    console.error('SES_FROM_ADDRESS env var is not set')
    return { success: false, error: 'Server configuration error. Please try again later.' }
  }

  const client = new SESv2Client({ region: REGION })

  try {
    await client.send(
      new SendEmailCommand({
        FromEmailAddress: FROM,
        Destination: { ToAddresses: [FROM] },
        ReplyToAddresses: [email],
        Content: {
          Simple: {
            Subject: { Data: `Contact form message from ${name}`, Charset: 'UTF-8' },
            Body: {
              Text: {
                Data: `Name: ${name}\nEmail: ${email}\n\n${message}`,
                Charset: 'UTF-8',
              },
            },
          },
        },
      }),
    )
    return { success: true, error: '' }
  } catch (err) {
    console.error('SES error:', err)
    return { success: false, error: 'Failed to send message. Please try again later.' }
  }
}
