const axios = require("axios");

const enviarMsg = async (options = { text: "", userId: "" }) => {
  const body = {
    messaging_type: "RESPONSE",
    recipient: {
      id: options.userId,
    },
    message: {
      text: options.text,
    },
  };
  return await axios.post(`https://graph.facebook.com/v11.0/me/messages?access_token=${process.env.FB_ACCESS_TOKEN}`, body);
};

const enviarMsgComBotao = async (options = { text: "",userId:"", buttons: [] }) => {
  const body = {
    recipient: {
      id: options.userId,
    },
    message: {
      attachment: {
        type: "template",
        payload: {
          template_type: "button",
          text: options.text,
          buttons: options.buttons,
        },
      },
    },
  };
  return await axios.post(`https://graph.facebook.com/v11.0/me/messages?access_token=${process.env.FB_ACCESS_TOKEN}`, body)
};
module.exports = {
  enviarMsg,
  enviarMsgComBotao
};
