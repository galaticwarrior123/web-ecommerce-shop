import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: "nguyenducphu200321@gmail.com",
    pass: "aryk ysvp npav qxsc",
  },
});
export default transporter;
