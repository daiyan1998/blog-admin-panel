import express from "express";
import {
  sendEmail,
  deleteMail,
  getMails,
  getOneMail,
} from "../controller/mailController.js";

const route = express.Router();

route.get("/", getMails);
route.get("/:id", getOneMail);
route.post("/send-mail", sendEmail);
route.delete("/:id", deleteMail);

export default route;
