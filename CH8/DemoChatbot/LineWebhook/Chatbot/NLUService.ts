import * as msRest from "@azure/ms-rest-js"
import * as LUIS_Prediction from "@azure/cognitiveservices-luis-runtime"
import { LUIS } from "../config"

const predictionEndpoint = `https://${LUIS.predictionResourceName}.cognitiveservices.azure.com/`;

const luisAuthoringCredentials = new msRest.ApiKeyCredentials({
    inHeader: { "Ocp-Apim-Subscription-Key": LUIS.authoringKey }
});

const luisPredictionClient = new LUIS_Prediction.LUISRuntimeClient(
    luisAuthoringCredentials,
    predictionEndpoint
);

export const languageUnderStanding = async (query: string) => {

    const request = { query: query };
    const response = await luisPredictionClient.prediction.getSlotPrediction(LUIS.appId, "Production", request);

    return response
}
