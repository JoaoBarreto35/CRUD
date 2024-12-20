// src/app/api/products/route.js
import axios from 'axios';

const API_URL = 'https://dummyjson.com/products';

export async function GET() {
  try {
    const response = await axios.get(API_URL);
    return new Response(JSON.stringify(response.data), {
      status: 200,
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Erro ao buscar produtos' }), {
      status: 500,
    });
  }
}
