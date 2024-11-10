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
  rating: number;
  image: string;         // Product rating
}

export interface Product {
  sizes: Size[];
  id: string;
  name: string;
  price: number;
  description: string;
  category: string; 
  image: string; 
}

export interface CheckProduct {
  id: string;
  name: string;
  price: number;
  description: string;
  product_images: string; 
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
  phone_number?: string;
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
  payment_status: string; // Payment status (e.g., "paid", "pending")
  subtotal: number; // Subtotal of the order before discounts and taxes
  discount_amount: number; // Total discount applied to the order
  tax_amount: number; // Total tax applied to the order
  total_amount: number; // Final total amount for the order
}


export interface OrderItem {
  order_id:string;
  product: Product;
  quantity: number;
  product_variation: ProductVariation;
  subtotal?: string;
  price: string; // Price per unit
  discount_amount: string; // Discount on the product
  tax_amount: string; // Tax on the product
  total_price: string; // Total price for this item
}

export interface CartItem {
  id: number;
  quantity: number;
  product: CheckProduct;
  size: Size; 
  product_variation_id: string;
  couponDiscount: number,
  quantityDiscount: number
}

export interface CartItemCheckout {
  id: number;
  quantity: number;
  product: CheckProduct;
  size: Size; 
  product_variation_id: string;
}


export interface GetOrder {
  order_id: string;       // Unique identifier for the order
  created_at: string;     // Datetime when the order was created
  status: string;         // Status of the order (e.g., 'Pending', 'Completed')
  items: OrderItem[];     // Array of items in the order
}


export interface ProductsImage {
  id: string;
  product_id: string;
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

export type DiscountType = 'COUPON' | 'QUANTITY';

export interface Discount {
  id: string;
  coupon?: string;  // Optional for 'QUANTITY' type discounts
  percent_discount: number;
  min_order_price: number;
  discount_type: DiscountType;
  quantity_threshold?: number;  // Optional for 'COUPON' type discounts
  created_at: string;
  updated_at: string;
}