import { Twilio } from "twilio";
const client = new Twilio(
  process.env["TWILIO_SID"]!,
  process.env["TWILIO_AUTH_TOKEN"]!
);

export const sendSMS = async (configMessage: { body: string; to: string }) => {
  try {
    const response = await client.messages.create({
      body: configMessage.body,
      to: configMessage.to,
      from: process.env["TWILIO_NUMBER"],
    });
    return response;
  } catch (err) {
    console.log(err);
  }
};