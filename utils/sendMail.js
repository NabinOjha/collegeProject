const nodemailer = require('nodemailer');

class Email {
  constructor(sender, receiver, subject) {
    this.to = receiver.email;
    this.from = sender.email;
    this.firstName = sender.userName.split(' ')[0];
    this.filename = sender.resume;
    this.subject = subject;
  }

  newTransport() {
    return nodemailer.createTransport({
      // service: 'SendGrid',
      host: process.env.MAILTRAP_HOST,
      port: process.env.MAILTRAP_PORT,
      auth: {
        // user: process.env.SENDGRID_USERNAME,
        // pass: process.env.SENDGRID_PASSWORD,
        user: process.env.MAILTRAP_USERNAME,
        pass: process.env.MAILTRAP_PASSWORD,
      },
    });
  }
  async send() {
    const mailOptions = {
      from: 'nabinojha47@gmail.com',
      to: this.to,
      subject: this.subject,
      text: 'Mail from the job portal',
      html: `<h6>Hello My name is:${this.firstName}.${this.subject}.ThankYou.</h6>`,
      attachments: [
        {
          path: `${process.cwd()}/public/resume/${this.filename}`,
          filename: this.filename,
        },
      ],
    };

    await this.newTransport().sendMail(mailOptions);
  }
}

module.exports = Email;
