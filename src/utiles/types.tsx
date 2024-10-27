export interface Category {
  id: number;
  name: string;
  description: string;
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

export interface SendSmsResponse {
  message?: string;
  error?: string;
}

export interface CheckoutProduct {
  id: number;
  quantity: number;
  product: Product;
  size: string;
}
interface CheckoutProductForbackend{
  id: number;
  quantity: number;
  product_id: number;
  product_variation_id: number;
}

export interface Order {
  order_id: string
  email: string;
  city: string;
  state: string;
  payment_method: string;
  status: string;                  // Status of the order
  phone_number: string;            // Phone number of the user
  address_line_1: string;          // First line of the address
  address_line_2?: string;                    // State of the user
  zip_code: string;                // ZIP or postal code
  country: string;                 // Country of the user
  user: number;    
  products: CheckoutProductForbackend[]; // Include product data in the form values
}


export interface OrderItem {
  order_id:string;
  product: Product;
  quantity: number;
  product_variation_id: ProductVariation;
}

export interface Size {
  id: number;
  size: string;
}

export interface CartItem {
  id: number;
  quantity: number;
  product: Product;
  size: Size; // Change this to Size object
  product_variation_id: number;
}

export interface GetOrder {
  order_id: string;       // Unique identifier for the order
  created_at: string;     // Datetime when the order was created
  status: string;         // Status of the order (e.g., 'Pending', 'Completed')
  items: OrderItem[];     // Array of items in the order
}
