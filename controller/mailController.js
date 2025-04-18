import { asyncHandler } from "../utils/asyncHandler.js";
import nodemailer from "nodemailer";
import { ApiError } from "../utils/ApiError.js";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

const sendEmail = asyncHandler(async (req, res) => {
  const { name, email, company, phone, message } = req.body;

  try {
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      secure: false,
      auth: {
        user: process.env.SMTP_MAIL,
        pass: process.env.SMTP_PASS,
      },
    });

    const info = await transporter.sendMail({
      from: '"Maddison Foo Koch 👻" <maddison53@ethereal.email>',
      to: email,
      subject: "New message from contact form",
      text: message,
    });

    await prisma.mail.create({
      data: {
        name,
        email,
        company,
        phone,
        message,
      },
    });

    res.status(200).json({
      success: true,
      message: "Email sent successfully",
    });
  } catch (error) {
    ApiError(500, error.message);
  }
});

const getMails = asyncHandler(async (req, res) => {
  const mails = await prisma.mail.findMany();
  res.status(200).json({ mails });
});

const getOneMail = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const mail = await prisma.mail.findUnique({
    where: {
      id: id,
    },
  });
  res.status(200).json({ mail });
});

const deleteMail = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const mail = await prisma.mail.delete({
    where: {
      id: id,
    },
  });
  res.status(200).json({ mail });
});

export { sendEmail, getMails, getOneMail, deleteMail };
