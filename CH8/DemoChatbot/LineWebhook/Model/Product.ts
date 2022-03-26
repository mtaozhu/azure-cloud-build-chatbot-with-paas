export interface ProductInterface {
    id: string,
    brand: string,
    type: string,
    name: string,
    description: string,
    imageUri: string
    price: number,
    label: string
}

export class Product implements ProductInterface{
    id: string
    brand: string
    type: string
    name: string
    description: string
    imageUri: string
    price: number
    label: string

    constructor() {}
}
