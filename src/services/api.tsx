import axios from "axios";
import { AxiosError } from "axios";
import { jwtDecode } from "jwt-decode";
import {
  Category,
  Product,
  AuthUser,
  ProductResponse,
  ErrorResponse,
  SendSmsResponse,
  Order,
  // CartItem,
  GetOrder,
  ProductAdmin,
  ProductVariation,
  ProductsImage,
  ImageUploadResponse,
  ImageRequest,
  Discount,
  ProductCollection,
  User,
  NewOrder,
  NewGetOrder,
} from "../utiles/types";
interface CartItem extends Product {
  selectedSize: string | undefined;
  quantity: number;
}

const API_BASE_URL ="https://api.blackwilbur.com/";
//"https://blackwilbur.com/api/"
//

// Axios instance for API calls
const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
});

// Utility Functions
const getAuthToken = () => {
  return localStorage.getItem("authToken");
};

export const fetchCategories = async (): Promise<Category[]> => {
  const response = await axios.get<Category[]>(`${API_BASE_URL}categories`);
  return response.data;
};

export const addCategory = async (name: string, description: string) => {
  const response = await axios.post(`${API_BASE_URL}categories`, {
    name,
    description,
  });
  return response.data;
};

export const updateCategory = async (
  currentCategoryId: string,
  categoryName: string,
  categoryDescription: string
) => {
  const response = await axiosInstance.put(`${API_BASE_URL}categories`, {
    id: currentCategoryId,
    data: {
      name: categoryName,
      description: categoryDescription,
    },
  });
  return response.data;
};

export const deleteCategory = async (currentCategoryId: string) => {
  await axiosInstance.delete(`${API_BASE_URL}categories`, {
    data: {
      id: currentCategoryId,
    },
  });
};

export const fetchBestSeller = async (): Promise<Product[]> => {
  const response = await axiosInstance.get<Product[]>(
    `${API_BASE_URL}bestseller`
  );
  return response.data;
};

export const fetchProductById = async (productId: string): Promise<Product> => {
  const response = await axiosInstance.get<Product>(
    `${API_BASE_URL}products/${productId}`
  );
  return response.data;
};

export const getTokenExpiration = (token: string): number => {
  const decoded: { exp: number } = jwtDecode(token);
  return decoded.exp * 1000; // Convert exp to milliseconds
};

export const tokenExpiresIn = (token: string): number => {
  const expiration = getTokenExpiration(token);
  return expiration - Date.now(); // Returns time until expiration in milliseconds
};

export const fetchCollection = async (): Promise<ProductCollection[]> => {
  const response = await axiosInstance.get<ProductCollection[]>(
    `${API_BASE_URL}collections`
  );
  return response.data;
};

export const fetchCartItemsFromLocalStorage = () => {
  const storedCart = localStorage.getItem("cart");
  if (!storedCart) return [];
  const cartItems = JSON.parse(storedCart);
  return cartItems.map((item: any) => ({
    ...item,
    price: parseFloat(item.price),
  }));
};

// Request Interceptor for Token Management
axiosInstance.interceptors.request.use(
  async (config) => {
    const token = getAuthToken();

    if (token) {
      const expiresIn = tokenExpiresIn(token);
      if (expiresIn < 5 * 60 * 1000) {
        // Check if less than 5 minutes to expiration
        const newToken = await refreshAuthToken();
        if (newToken) {
          config.headers.Authorization = `Bearer ${newToken}`;
        }
      } else {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export const registerUser = async (userData: AuthUser): Promise<any> => {
  try {
    const response = await axios.post(`${API_BASE_URL}register`, userData);
    return response.data;
  } catch (error) {
    const axiosError = error as AxiosError<ErrorResponse>;

    let errorMessage = "An unknown error occurred.";

    if (axiosError.response && axiosError.response.data) {
      const serverErrors = axiosError.response.data.error;
      if (serverErrors) {
        errorMessage = JSON.stringify(serverErrors);
      }
    } else if (error instanceof Error) {
      errorMessage = error.message;
    }

    throw new Error(`Registration failed: ${errorMessage}`);
  }
};

export const loginUser = async (loginData: AuthUser): Promise<any> => {
  try {
    const response = await axios.post(`${API_BASE_URL}login`, {
      email: loginData.email,
      password: loginData.password,
    });

    // Save tokens in localStorage
    localStorage.setItem("authToken", response.data.access_token);
    localStorage.setItem("refreshToken", response.data.refresh_token);

    return response.data.user;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const errorMessage =
        error.response?.data?.error ||
        error.message ||
        "Login failed. Please try again.";
      throw new Error(errorMessage);
    }
    throw new Error("An unexpected error occurred");
  }
};

export const refreshAuthToken = async (): Promise<string | null> => {
  const refreshToken = localStorage.getItem("refreshToken");

  if (!refreshToken) {
    console.error("No refresh token found");
    return null;
  }

  try {
    const response = await axios.post(`${API_BASE_URL}token/refresh/`, {
      refresh: refreshToken,
    });

    const newAccessToken = response.data.access;
    localStorage.setItem("authToken", newAccessToken);
    return newAccessToken;
  } catch (error) {
    console.error("Failed to refresh token:", error);
    return null;
  }
};

export const isUserLoggedIn = (): boolean => {
  return !!(localStorage.getItem("authToken") && localStorage.getItem("user"));
};

// Cart Functions
export const fetchCartItems = async (): Promise<CartItem[]> => {
  const response = await axiosInstance.get(`${API_BASE_URL}cart`);
  return response.data; // Ensure that response.data is in the CartItem format
};

export const addToCart = async (
  productId: string,
  productVariationId: string,
  quantity: number
) => {
  const response = await axiosInstance.post(`${API_BASE_URL}cart`, {
    product_id: productId,
    product_variation_id: productVariationId,
    quantity,
  });
  return response.data;
};

export const updateCartItem = async (
  cartItemId: string,
  quantity: number
): Promise<any> => {
  try {
    const response = await axiosInstance.put(
      `${API_BASE_URL}cart`, // Replace with your actual endpoint
      {
        cart_item_id: cartItemId,
        quantity,
      }
    );
    return response.data; // Return the updated cart item data
  } catch (error: any) {
    console.error("Error updating cart item quantity:", error.response || error);
    if (error.response) {
      return {
        error: error.response.data.error || "Failed to update cart item quantity",
      };
    }
    return { error: "An unknown error occurred" };
  }
};

export const removeFromCart = async (cartItemId: string) => {
  await axiosInstance.delete(`${API_BASE_URL}cart`, {
    data: {
      cart_item_id: cartItemId,
    },
  });
};

export const getCartItemsCount = async (): Promise<number> => {
  try {
    if (!isUserLoggedIn()) {
      const localCart = localStorage.getItem("cart");
      const cartItems = localCart ? JSON.parse(localCart) : [];
      return cartItems.length;
    }

    const cartItems = await fetchCartItems();
    return cartItems.length;
  } catch (error) {
    console.error("Error fetching cart items count:", error);
    return 0;
  }
};

export const fetchExplore = async (): Promise<Product[]> => {
  const response = await axiosInstance.get<Product[]>(`${API_BASE_URL}explore`);
  return response.data;
};

export const fetchSearchResults = async (
  searchTerm: string
): Promise<ProductResponse | undefined> => {
  try {
    const response = await axiosInstance.get(`${API_BASE_URL}search`, {
      params: { search_term: searchTerm },
      headers: { "Content-Type": "application/json" },
    });

    return response.data as ProductResponse;
  } catch (error) {
    console.error("Error fetching search results:", error);
    return undefined;
  }
};

// Function to send an SMS
export const sendSms = async (
  otp: string,
  numbers: string[]
): Promise<SendSmsResponse> => {
  try {
    const response = await axios.post(`${API_BASE_URL}send-sms/`, {
      otp,
      numbers,
    });

    return response.data;
  } catch (error) {
    console.error("Error sending SMS:", error);
    return { error: "Failed to send SMS." };
  }
};

export const getUsers = async (): Promise<User[]> => {
  try {
    const response = await axios.get<User[]>(`${API_BASE_URL}users/`);
    return response.data;
  } catch (error) {
    console.error("Failed to fetch users:", error);
    throw error;
  }
};

// Function to get all orders of the current user
export const getOrders = async (): Promise<NewGetOrder[]> => {
  const response = await axiosInstance.get<NewGetOrder[]>(`${API_BASE_URL}orders`);
  if (!response.data) {
    throw new Error("Failed to fetch orders");
  }
  return response.data;
};

export const updateOrderStatus = async (orderId: string, status: string): Promise<NewGetOrder[]> => {
  const response = await axiosInstance.get<NewGetOrder[]>(`${API_BASE_URL}orders`);
  if (!response.data) {
    throw new Error("Failed to fetch orders");
  }
  return response.data;
};


// Function to create a new order
export const createOrder = async (orderData: NewOrder) => {
  try {
    // Prepare the products data separately as per backend requirements
    const { products, ...restOrderData } = orderData;

    // Create the order
    const response = await axiosInstance.post(
      `${API_BASE_URL}orders`,
      { ...restOrderData, products },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    const { order_id, payment_url } = response.data;

    // Validate the payment URL before redirecting
    if (payment_url && isValidUrl(payment_url)) {
      return { order_id, payment_url };
    }

    return { order_id };
  } catch (error) {
    console.error("Error creating order:", error);
    throw error;
  }
};

// Helper function to validate the URL
const isValidUrl = (url: string) => {
  try {
    // Use the URL constructor to check if the URL is valid
    new URL(url);
    return true;
  } catch (e) {
    return false; // If the URL constructor throws an error, it's invalid
  }
};

export const fetchRatings = async (productId: string) => {
  try {
    const response = await axiosInstance.get(
      `${API_BASE_URL}ratings/?product_id=${productId}`
    );
    return response.data; // Return the fetched ratings
  } catch (error) {
    console.error("Error getting ratings:");
    throw error;
  }
};

export const addRating = async (productId: string, rating: number) => {
  const ratingData = {
    product_id: productId,
    rating: rating,
  };
  try {
    await axiosInstance.post(`${API_BASE_URL}ratings/`, ratingData);
  } catch (error) {
    console.error("Error adding rating:", error);
    throw error;
  }
};

export const fetchProducts = async (): Promise<ProductAdmin[]> => {
  try {
    const response = await axios.get(`${API_BASE_URL}products-manage`);
    return response.data;
  } catch (error) {
    console.error("Error fetching products:", error);
    throw error;
  }
};

// Add Product
export const addProduct = async (formData: FormData): Promise<ProductAdmin> => {
  try {
    // Set the appropriate headers for FormData
    const response = await axios.post(
      `${API_BASE_URL}products-manage`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data", // Ensure the server knows we're sending form data
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error adding product:", error);
    throw error;
  }
};
// Update Product
export const updateProduct = async (
  productId: number,
  product: Product
): Promise<Product> => {
  try {
    const response = await axios.put(
      `${API_BASE_URL}products-manage${productId}`,
      product
    );
    return response.data;
  } catch (error) {
    console.error("Error updating product:", error);
    throw error;
  }
};

export const deleteProduct = async (productId: string) => {
  try {
    const response = await axios.delete(`${API_BASE_URL}products-manage`, {
      data: { id: productId }, // Pass productId in the request body
    });
    return response.data;
  } catch (error) {
    console.error("Error deleting product:", error);
    throw error;
  }
};

// Fetch all product variations
export const fetchProductVariations = async (): Promise<ProductVariation[]> => {
  const response = await axios.get(`${API_BASE_URL}product-variation/`);
  return response.data;
};

export const getProductVariationsByProductId = async (
  id: string
): Promise<ProductVariation> => {
  const response = await axios.get<ProductVariation>(
    `${API_BASE_URL}product-variation/${id}/`
  );
  return response.data;
};

export const createProductVariation = async (variation: {
  product: string;
  size: string;
  quantity: number;
}): Promise<ProductVariation> => {
  const response = await axios.post(
    `${API_BASE_URL}product-variation/`,
    variation
  );
  return response.data; // Return the created product variation data
};

// Update an existing product variation
export const updateProductVariation = async (
  variation: ProductVariation
): Promise<ProductVariation> => {
  const response = await axios.put(
    `${API_BASE_URL}product-variation/`,
    variation
  );
  return response.data;
};

// Partially update an existing product variation
export const partialUpdateProductVariation = async (
  variation: Partial<ProductVariation>
): Promise<ProductVariation> => {
  const response = await axios.patch(
    `${API_BASE_URL}product-variation/`,
    variation
  );
  return response.data;
};

// Delete a product variation
export const deleteProductVariation = async (id: string): Promise<void> => {
  await axios.delete(`${API_BASE_URL}product-variation/`, { data: { id } });
};

// Function to fetch a single ProductsImage by ID
export const getImageByProductId = async (
  id: string
): Promise<ProductsImage[]> => {
  const response = await axios.get<ProductsImage[]>(
    `${API_BASE_URL}images/product/${id}/`
  );
  return response.data;
};

// Function to fetch all images
export const getAllImages = async (): Promise<ProductsImage[]> => {
  const response = await axios.get<ProductsImage[]>(`${API_BASE_URL}images/`);
  return response.data;
};

// Function to upload an image
export const uploadImage = async (
  imageRequest: ImageRequest
): Promise<ImageUploadResponse> => {
  const formData = new FormData();
  formData.append("product", imageRequest.product.toString());
  formData.append("image", imageRequest.image);

  const response = await axios.post<ImageUploadResponse>(
    `${API_BASE_URL}images/`,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );
  return response.data;
};

// Function to delete an image by ID
export const deleteImage = async (id: string): Promise<void> => {
  await axios.delete(`${API_BASE_URL}images/`, {
    data: { id }, // Passing the ID in the request body
  });
};

// Get discounts (all, by coupon code, or by ID)
export const getDiscounts = async (params: {
  coupon_code?: string;
  id?: string;
}) => {
  try {
    const response = await axios.get(`${API_BASE_URL}discounts/`);
    return response.data;
  } catch (error) {
    console.error("Error fetching discounts:", error);
    throw error;
  }
};

// Create a new discount
export const createDiscount = async (
  discount: Omit<Discount, "id" | "created_at" | "updated_at">
) => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}discounts/`,
      discount
    );
    return response.data;
  } catch (error) {
    console.error("Error creating discount:", error);
    throw error;
  }
};

// Update an existing discount
export const updateDiscount = async (
  id: string,
  discount: Partial<Discount>
) => {
  try {
    const response = await axios.put(
      `${API_BASE_URL}discounts/${id}`,
      discount
    );
    return response.data;
  } catch (error) {
    console.error("Error updating discount:", error);
    throw error;
  }
};

// Delete a discount
export const deleteDiscount = async (id: string) => {
  try {
    const response = await axios.delete(`${API_BASE_URL}discounts/`, {
      data: { id }, // Passing the ID in the body
    });
    return response.data;
  } catch (error) {
    console.error("Error deleting discount:", error);
    throw error;
  }
};

export const downloadInvoice = async (orderId: string): Promise<void> => {
  try {
    const response = await axiosInstance.get(`${API_BASE_URL}invoice/${orderId}/`, {
      responseType: "blob", 
    });
    
    // Create a downloadable URL from the blob
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `invoice_${orderId}.pdf`); // Set the file name
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  } catch (error) {
    console.error("Error downloading invoice:", error);
    throw new Error("Failed to download invoice");
  }
};