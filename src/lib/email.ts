import nodemailer from 'nodemailer'
import SMTPTransport from "nodemailer/lib/smtp-transport";

type EmailPayload = {
    to: string,
    subject: string,
    html: string
}

const smtpOptions: SMTPTransport.Options = {
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT!),
    secure: true,
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS

    }
}

export const sendEmail = async (data: EmailPayload) => {
    const transporter = nodemailer.createTransport({...smtpOptions})

    return await transporter.sendMail({
        from: process.env.SMTP_FROM_EMAIL,
        ...data
    })
}