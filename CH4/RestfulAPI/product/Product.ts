export interface ProductInterface {
    id: string,
    brand: string,
    name: string,
    description: string,
    price: number
}

export class Product implements ProductInterface{
    id: string
    brand: string
    name: string
    description: string
    price: number

    constructor() {}
}

