import nodemailer from "nodemailer";
import fs from "fs";
import path from "path";
import mustache from "mustache";

type Payload = {
  email: string;
  subject: string;
  name: string;
  resetLink: string;
};

export async function sendEmail(payload: Payload) {
  // logo
  const headerPath = path.join(__dirname, "../public/images/image-1.png");
  const logoPath = path.join(__dirname, "../public/images/image-2.png");

  const header = fs.readFileSync(headerPath, "base64");
  const logo = fs.readFileSync(logoPath, "base64");

  const templatePath = path.join(__dirname, "../template/index.html");
  const emailTempalate = fs.readFileSync(templatePath, "utf-8");

  try {
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false, // Use `true` for port 465, `false` for all other ports
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD, // application password / app password
      },
    });

    await transporter.sendMail({
      from: `"Y" <${process.env.EMAIL_USER}>`,
      to: `${payload.email}`,
      subject: `${payload.subject}`,
      html: mustache.render(emailTempalate, { payload }),
      attachments: [
        {
          content: header,
          encoding: "base64",
          cid: "uniqueHeaderId",
        },
        {
          content: logo,
          encoding: "base64",
          cid: "uniqueLogoId",
        },
      ],
    });
  } catch (error) {
    throw new Error(error);
  }
}
