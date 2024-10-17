export interface Category {
  id: number;
  name: string;
}

// Example of a response type for an array of products
export type ProductResponse = Product[];

export interface productImage{
    id:number, 
    image:string,   
    product_id: number

}

export interface Product {
  id: number;
  name: string;
  price: number;
  product_images: productImage[];
  description: string;
  sizes: ProductVariation[];
  rating: number;
  category: Category;
}

export interface ProductVariation {
  id: number;
  size: string;
  quantity: number;
}

export interface AuthUser {
  first_name?: string;
  last_name?: string;
  username?: string;
  email: string;
  password: string;
  password2?: string;
}
export interface LoginUser {
  identifier: string; // Change this to identifier to accept either username or email
  password: string;
}

export interface Loginuser{

}
export interface Address {
  address_line_1: string;
  address_line_2?: string;
  city: string;
  state: string;
  country: string;
  zip_code: string;
  phone_number?: string;
}
// Define the interface for the error response
export interface ErrorResponse {
  error: {
    [key: string]: string[]; // This indicates that each key can have an array of string messages
  };
}
