export interface StoreInterface {
    id: string,
    city: string,
    address: string,
    name: string,
    phone: string,
    longitude: number,
    latitude: number
    description: string
}

export class Store implements StoreInterface{
    id: string
    city: string
    address: string
    name: string
    phone: string
    longitude: number
    latitude: number
    description: string

    constructor() {}
}

