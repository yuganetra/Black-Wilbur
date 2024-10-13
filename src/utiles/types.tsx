export interface Category {
    id: number,
    name: string
}
export interface Bestsellers{
    id: number,
    name: string,
    price: number,
    product_images: productImage[]
}
export interface productImage{
    id:number, 
    image:string,   
    product_id: number
}