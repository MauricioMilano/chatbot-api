const AssistantV1 = require("ibm-watson/assistant/v1");
const { IamAuthenticator } = require("ibm-watson/auth");

const assistant = new AssistantV1({
  version: "2021-06-14",
  authenticator: new IamAuthenticator({
    apikey: process.env.WATSON_APIKEY,
  }),
  serviceUrl: process.env.WATSON_URL,
});
 async function enviarMsg (options = {text: text},  context={}) {
   const contextKeys = Object.keys(context)
  if(Object.keys(context).length === 0){
    return await assistant
     .message({
       workspaceId: process.env.WATSON_WORKSPACE,
       input: { text: options.text }
     })  
    }else{
      return await assistant
       .message({
         workspaceId: process.env.WATSON_WORKSPACE,
         input: { text: options.text }, 
         context: context
       })  
      
  } 
}

module.exports = {
  enviarMsg
}
