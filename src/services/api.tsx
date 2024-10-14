import axios from "axios";
import {
  Category,
  Product,
  AuthUser,
} from "../utiles/types";

const API_BASE_URL = "http://127.0.0.1:5000/";

const getAuthToken = () => {
  return localStorage.getItem('authToken');
};


export const fetchCategories = async (): Promise<Category[]> => {
  const response = await axios.get<Category[]>(`${API_BASE_URL}categories`);
  return response.data;
};

export const fetchBestSeller = async (): Promise<Product[]> => {
  const response = await axios.get<Product[]>(`${API_BASE_URL}bestseller`);
  return response.data;
};

export const fetchProductById = async (productId: number): Promise<Product> => {
  const response = await axios.get<Product>(
    `${API_BASE_URL}products/${productId}`
  );
  return response.data;
};

export const fetchExplore = async (): Promise<Product[]> => {
  const response = await axios.get<Product[]>(`${API_BASE_URL}explore`);
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

export const registerUser = async (userData: AuthUser): Promise<any> => {
  try {
    const response = await axios.post(`${API_BASE_URL}register`, userData, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    return response.data;
  } catch (error: any) {
    throw new Error(
      `Registration failed: ${error.response?.data?.message || error.message}`
    );
  }
};

export const loginUser = async (loginData: AuthUser): Promise<any> => {
  try {
    const response = await axios.post(`${API_BASE_URL}login`, {
      email: loginData.email,
      password: loginData.password,
    });

    // Store the access token and refresh token
    localStorage.setItem('authToken', response.data.access_token);
    localStorage.setItem('refreshToken', response.data.refresh_token);

    return response.data.user; // Return user data for convenience
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(
        `Login failed: ${error.response?.data?.message || error.message}`
      );
    }
    throw new Error("An unexpected error occurred");
  }
};
