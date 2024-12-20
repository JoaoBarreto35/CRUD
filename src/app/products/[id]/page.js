'use client';  // Marcar o componente como cliente

import { useParams } from 'next/navigation'; // useParams para capturar parâmetros de rota dinâmica
import { useEffect, useState } from 'react';
import axios from 'axios';
import ProductForm from '../../../components/ProductForm';

const EditProductPage = () => {
  const { id } = useParams();  // Captura o 'id' diretamente da URL usando useParams
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);  // Estado para controle de carregamento
  const [hasFetched, setHasFetched] = useState(false); // Estado para controlar se a requisição foi feita

  useEffect(() => {
    // Verificar se o id está disponível
    if (!id) {
      console.log('Etapa 1: ID não encontrado na URL');
      return; // Se não tiver id, não faz nada
    }

    const fetchProduct = async () => {
      try {
        console.log('Etapa 2: Iniciando requisição para o produto com id', id);
        setLoading(true);  // Começar o carregamento
        const response = await axios.get(`https://dummyjson.com/products/${id}`);
        setProduct(response.data);
        setHasFetched(true);  // Marcar como já buscado
        setLoading(false);  // Parar o carregamento
        console.log('Etapa 3: Produto carregado com sucesso', response.data);
      } catch (error) {
        console.error('Erro ao buscar o produto', error);
        setLoading(false);  // Parar o carregamento em caso de erro
      }
    };

    // Só faz a requisição se o id estiver disponível e a requisição não tiver sido feita antes
    if (!hasFetched) {
      fetchProduct();
    }
  }, [id, hasFetched]);  // Dependência do useEffect para o id e hasFetched

  // Função para tratar a atualização do produto
  const handleUpdateProduct = async (updatedProduct) => {
    try {
      console.log('Atualizando produto...', updatedProduct);
      // Enviar a requisição para atualizar o produto
      const response = await axios.put(`https://dummyjson.com/products/${id}`, updatedProduct);
      console.log('Produto atualizado com sucesso:', response.data);
      // Atualize o estado do produto com os dados mais recentes
      setProduct(response.data);
    } catch (error) {
      console.error('Erro ao atualizar o produto', error);
    }
  };

  // Exibir "Carregando..." enquanto o produto não for carregado
  if (loading) return <p>Carregando...</p>;

  // Se o produto não for encontrado, exibe uma mensagem de erro
  if (!product) return <p>Produto não encontrado.</p>;

  // Renderiza o formulário de edição do produto
  return (
    <div>
      <h1>Editar Produto</h1>
      {/* Passando a função handleUpdateProduct como prop para o formulário */}
      <ProductForm initialProduct={product} onSubmit={handleUpdateProduct} />
    </div>
  );
};

export default EditProductPage;
