import * as msRest from "@azure/ms-rest-js"
import * as PredictionApi from "@azure/cognitiveservices-customvision-prediction";
import { CUSTOMVISION } from "../config"

const predictor_credentials = new msRest.ApiKeyCredentials({ inHeader: { "Prediction-key": CUSTOMVISION.key } });
const predictor = new PredictionApi.PredictionAPIClient(predictor_credentials, CUSTOMVISION.endpoint);


export const classifyImageByCustomVision = async (imageBuffer: ArrayBuffer,): Promise<any> => {
    let tagName: String
    const projectId = CUSTOMVISION.projectId
    const publishedName = CUSTOMVISION.publishedName
    const predictedResult = await predictor.classifyImage(projectId, publishedName, imageBuffer);

    console.log(predictedResult)
    console.log(`\t ${predictedResult.predictions[0].tagName}: ${(predictedResult.predictions[0].probability * 100.0).toFixed(2)}%`);

    tagName = predictedResult.predictions[0].tagName
    return tagName
}
