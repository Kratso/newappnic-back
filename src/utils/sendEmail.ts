import nodemailer from 'nodemailer';
import Handlebars from 'handlebars';
import fs from 'fs';
import path from 'path';

export const sendEmail = async (email: string, subject: string, payload: {name: string, link: string}) => {
    try {
        const transporter = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 587,
            secure: false,
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASSWORD
            }
        });

        const source = fs.readFileSync( path.join(__dirname,  '/template/requestResetPassword.handlebars'), 'utf8');
        const template = Handlebars.compile(source);

        const options = {
            from: process.env.FROM_EMAIL,
            to: email,
            subject,
            html: template(payload)
        };

        console.log(await transporter.sendMail(options));
    } catch (err) {
        console.log(err);
    }
};