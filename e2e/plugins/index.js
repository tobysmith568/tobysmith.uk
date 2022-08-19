import { config } from "dotenv";
import { init } from "smtp-tester";

config({ path: "./.env.local", debug: true });

const setupPlugins = (on, config) => {
  // SMTP Server

  const port = process.env.EMAIL_PORT;
  console.log(`Starting mail server at port ${port}`);

  const mailServer = init(port);
  console.log(`Started mail server at port ${port}`);

  let lastEmailSent = null;

  on("task", {
    deleteLastEmail() {
      console.log("Deleting the last received email");
      lastEmailSent = null;
      return null;
    },

    getLastEmail() {
      return lastEmailSent;
    }
  });

  mailServer.bind((addr, id, email) => {
    lastEmailSent = email;
    console.log("New email received: ", email);
  });

  // Env Variables

  config.env.contactEmail = process.env.CONTACT_EMAIL;
  return config;
};

export default setupPlugins;
