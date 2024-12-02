const nodemailer = require('nodemailer');
const pug = require('pug');
const htmlToText = require('html-to-text');

module.exports = class Email {
  constructor(user, url) {
    this.to = user.email;
    this.url = url;
    this.from = `Natours <${process.env.EMAIL_FROM}>`;
  }

  newTransport() {
    if (process.env.NODE_ENV === 'production') {
      return nodemailer.createTransport({
        service: 'gmail',
        host: 'smtp.gmail.com',
        port: 587,
        secure: false,
        auth: {
          user: process.env.EMAIL_USERNAME,
          pass: process.env.EMAIL_PASSWORD,
        },
      });
    }

    // 1) Create a transporter
    return nodemailer.createTransport({
      host: process.env.EMAIL_TEST_HOST,
      port: process.env.EMAIL_TEST_PORT,
      auth: {
        user: process.env.EMAIL_TEST_USERNAME,
        pass: process.env.EMAIL_TEST_PASSWORD,
      },
    });
  }

  async send(template, subject) {
    //Render html based on a pug template
    const html = pug.renderFile(
      `${__dirname}/../public/email/${template}.pug`,
      {
        url: this.url,
        subject: subject,
      },
    );

    // 2) Define the email options
    const mailOptions = {
      from: this.from,
      to: this.to,
      subject: subject,
      html: html,
      text: htmlToText.convert(html),
    };

    // 3) Actually send the email
    await this.newTransport().sendMail(mailOptions);
  }

  async sendConfirmation() {
    await this.send(
      'completeRegistration',
      'Complete Your Sign-Up for iReporter',
    );
  }

  async sendWelcome() {
    await this.send('welcome', 'Welcome to the natours family');
  }

  async sendPasswordReset() {
    await this.send(
      'passwordReset',
      'Your password reset token (valid for only 10 minutes)',
    );
  }
};
