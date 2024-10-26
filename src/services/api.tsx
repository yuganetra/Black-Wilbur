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
  CartItem,
  GetOrder,
} from "../utiles/types";

const API_BASE_URL = "https://backendapi.blackwilbur.com/";

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

export const fetchBestSeller = async (): Promise<Product[]> => {
  const response = await axiosInstance.get<Product[]>(`${API_BASE_URL}bestseller`);
  return response.data;
};

export const fetchProductById = async (productId: number): Promise<Product> => {
  const response = await axiosInstance.get<Product>(`${API_BASE_URL}products/${productId}`);
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

export const fetchCollection = async (): Promise<Product[]> => {
  const response = await axiosInstance.get<Product[]>(`${API_BASE_URL}collections`);
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
      identifier: loginData.email,
      password: loginData.password,
    });

    localStorage.setItem("authToken", response.data.access_token);
    localStorage.setItem("refreshToken", response.data.refresh_token);

    return response.data.user;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const errorMessage =
        error.response?.data?.error || error.message || "Login failed. Please try again.";
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
    const response = await axios.post(`${API_BASE_URL}/api/token/refresh/`, {
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
  productId: number,
  productVariationId: number,
  quantity: number
) => {
  const response = await axiosInstance.post(`${API_BASE_URL}cart`, {
    product_id: productId,
    product_variation_id: productVariationId,
    quantity,
  });
  return response.data;
};

export const updateCartItem = async (cartItemId: number, newQuantity: number) => {
  const response = await axiosInstance.put(`${API_BASE_URL}cart/${cartItemId}`, {
    quantity: newQuantity,
  });
  return response.data;
};

export const removeFromCart = async (cartItemId: number) => {
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
export const sendSms = async (otp: string, numbers: string[]): Promise<SendSmsResponse> => {
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

// Function to get all orders of the current user
export const getOrders = async (): Promise<GetOrder[]> => {
  const response = await axiosInstance.get<GetOrder[]>(`${API_BASE_URL}orders`);
  if (!response.data) {
    throw new Error("Failed to fetch orders");
  }
  return response.data;
};

// Function to create a new order
export const createOrder = async (orderData: Order) => {
  try {
    const response = await axiosInstance.post(`${API_BASE_URL}orders`, orderData, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error creating order:");
    throw error;
  }
};

export const fetchRatings = async (productId: number) => {
  try {
    const response = await axiosInstance.get(`${API_BASE_URL}ratings/?product_id=${productId}`);
    console.log(response.data);
    return response.data; // Return the fetched ratings
  } catch (error) {
    console.error("Error getting ratings:");
    throw error;
  }
};

export const addRating = async (productId: number, rating: number) => {
  const ratingData = {
    product_id: productId,
    rating: rating,
  };

  try {
    const response = await axiosInstance.post(`${API_BASE_URL}ratings/`, ratingData);
    console.log("Rating added:", response.data);
  } catch (error) {
    console.error("Error adding rating:");
    throw error;
  }
};
