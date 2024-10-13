import axios from 'axios';
import { Category,Bestsellers, productImage } from '../utiles/types';
const API_BASE_URL = 'http://127.0.0.1:5000/';

export const fetchCategories = async (): Promise<Category[]> => {
    const response = await axios.get<Category[]>(`${API_BASE_URL}categories`);
    return response.data;
};

export const fetchBestSeller = async (): Promise<Bestsellers[]> => {
    const response = await axios.get<Bestsellers[]>(`${API_BASE_URL}bestseller`);
    return response.data;
};

