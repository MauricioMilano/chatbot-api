const watson = require("../services/watson");
const messenger = require("../services/messenger");
var moment = require("moment");

const conversations = {};
const delay = 1000;

function pegaContexto(id) {
  return conversations[id] ? conversations[id].context : {};
}
function salvaContexto(id, context) {
  context = conversations[id] = { context: context, time: moment() };
}

async function LimpaContexto(logger) {
  const convKeys = Object.keys(conversations);
  convKeys.forEach((value) => {
    const now = moment();
    const diff = now.diff(conversations[value].time, "minutes");
    logger.info(`Diferença de ${diff} minutos`);
    if (diff > 5) {
      delete conversations[value];
    }
  });
}

const responseType = {
  option: async (input, output, userId, request, conversation_id) => {
    const text = output.title
    const buttons = output.options.map(option=>{
      return {
        type: "postback",
        title: option.label,
        payload: option.value.input.text
      }
    })
    await salvarPlanilha(input, text, request, conversation_id)
  },
  text: async (input, output, userId, request, conversation_id) => {
      const resposta = output?.text;
      await salvarPlanilha(input, resposta, request, conversation_id)
  },
};

async function salvarPlanilha( input, resposta, request, conversation_id) {
  try {
    request.logger.info("Salvando as mensagens na planilha");
    request.repository.appendRow({ range: "conversas!A:B", valueInputOption: "USER_ENTERED", rowAsArray: [`"${conversation_id}"`, input, resposta] });
    
  } catch (error) {
    request.logger.error("Erro ao salvar as conversas na planilha");
  }
}
async function processa(request, response) {
  try {
    LimpaContexto(request.logger);
    request.logger.info("Mensagem recebida");
    request.logger.info("Enviando mensagem para o Watson");
    const contextRecovered = pegaContexto(request.body.id);
    const response = await watson.enviarMsg({ text: request.body.text }, contextRecovered);
    const output = response.result?.output;
    request.logger.info("Mensagem recebida do watson");
    const context = response.result?.context;
    request.logger.info(`Total de mensagens: ${output.generic.length}`);
    salvaContexto(request.body.id, context);
    output.generic.forEach((response, index) => {
      setTimeout(async function () {
      request.logger.info(`Salvando a mensagem ${index + 1} com delay de ${delay / 1000} segundo${delay / 1000 > 1 ? "s" : ""}`);
      await responseType[response.response_type](request.body.text, response, request.body.id, request, context.conversation_id);
      request.logger.info(`Mensagem ${index + 1} salva`);
    }, index * delay);
    });

    return output.generic
  } catch (error) {
    request.logger.error(`Erro durante o processo de envio de emnsagens`);
  }
}

module.exports = {
  processa,
};
