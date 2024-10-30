export interface Category {
  id: string;
  name: string;
  description: string;
}

export type ProductResponse = Product[];



// Interface for ProductImage
export interface ProductImage {
  id: string;
  product: string; // ID of the associated product
  image_url: string; // URL of the product image
  created_at: string; // ISO string of when the image was created
}

// Interface for Product
export interface ProductCollection {
  id: string;             // Unique identifier for the product
  name: string;           // Name of the product
  description: string;    // Description of the product
  category: string;       // Category of the product
  price: number;          // Price of the product
  sizes: Size[];         // Array of sizes associated with the product
  rating: number;         // Product rating
  product_images: ProductImage[]; // Array of images associated with the product
}

export interface Product {
  sizes: any;
  id: string;
  name: string;
  price: number;
  description: string;
  category: string; 
  image: string; 
}

export interface ProductAdmin {
  id: string;
  name: string;
  price: string;
  description: string;
  category: string; 
  image: File; 
}


export interface ProductVariation {
  id: string; // UUID
  product: string; // ID of the associated product
  size: string; // Size of the product variation
  quantity: number; // Available quantity
}

// Interface for Size
interface Size {
  id: string;
  product: string; // ID of the associated product
  size: string;    // Size (e.g., S, M, L)
  quantity: number; // Available quantity for this size
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
  product_id: string;
  product_variation_id: string;
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


export interface Image {
  id: string;
  product: string;
  image_url: string;
}

export interface ImageUploadResponse {
  id: string;
  product: number;
  url: string;
}

export interface ImageRequest {
  product: string;
  image: File;
}
