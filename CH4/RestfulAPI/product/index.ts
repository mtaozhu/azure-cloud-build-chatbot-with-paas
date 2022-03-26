import { AzureFunction, Context, HttpRequest } from "@azure/functions"
import { Product } from "./Product";
import * as productService from "./productService"

const httpTrigger: AzureFunction = async function (context: Context, req: HttpRequest): Promise<void> {
    let result = null;
    const method = req.method;
    switch (method) {
        case "GET":
            const id = req.query.id;
            result = await productService.readProduct(id);
            break;
        case "POST":
            const newItem = req.body as Product;
            await productService.createProduct(newItem);
            result = "Product 新增成功"
            break;
        case "PUT":
            const updateItem = req.body as Product;
            await productService.updateProduct(updateItem);
            result = "Product 修改成功"
            break;
        case "DELETE":
            const deleteItem = req.body as Product;
            await productService.deleteProduct(deleteItem);
            result = "Product 刪除成功"
            break;
        default:
            break;
    }

    context.res = {
        body: result
    };

};

export default httpTrigger;