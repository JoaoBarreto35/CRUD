'use client'; // Para garantir que o componente seja tratado no lado do cliente em Next.js

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation'; // Importando o useRouter para navegação
import './ProductForm.css';

const ProductForm = () => {
  const [product, setProduct] = useState({
    title: '',
    price: '',
    discountPercentage: '',
    rating: '',
    stock: '',
    brand: '',
    description: '',
    thumbnail: '',
    category: [], // Inicializando categorias como array vazio
  });
  const [loading, setLoading] = useState(false);
  const [categoriesList, setCategoriesList] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [showCategoryList, setShowCategoryList] = useState(false);

  const router = useRouter(); // Instanciando o hook do Next.js para navegação

  // Função para fazer o upload da imagem e pegar o link da imagem
  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const formData = new FormData();
      formData.append('image', file);

      try {
        // Envia o arquivo para o ImgBB
        const response = await axios.post('https://api.imgbb.com/1/upload?key=85517e45b4d383060c2515382e90b466', formData);
        const uploadedImageUrl = response.data.data.url; // Obtém a URL da imagem carregada
        setProduct(prevProduct => ({
          ...prevProduct,
          thumbnail: uploadedImageUrl // Atualiza a URL da imagem no estado do produto
        }));
      } catch (error) {
        console.error('Erro ao fazer upload da imagem', error);
      }
    }
  };

  // Busca categorias da API
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get('https://dummyjson.com/products/categories');
        setCategoriesList(response.data); // Preenche lista de categorias
      } catch (error) {
        console.error('Erro ao buscar categorias:', error);
      }
    };

    fetchCategories();
  }, []);

  // Atualiza as categorias selecionadas
  const handleCategoryChange = (category) => {
    setSelectedCategories((prevSelected) => {
      if (prevSelected.includes(category)) {
        return prevSelected.filter(item => item !== category);
      } else {
        return [...prevSelected, category];
      }
    });
  };

  // Função de criação do produto
  const handleProductCreation = async (product) => {
    try {
      setLoading(true); // Inicia o carregamento

      const response = await axios.post('https://dummyjson.com/products/add', {
        ...product,
        categories: selectedCategories,
      });

      alert(`Produto criado com sucesso: ${response.data.title}`);
      console.log('Resposta do servidor:', response.data);

      // Após criação, redireciona o usuário para a página de produtos
      router.push('/');
    } catch (error) {
      console.error('Erro ao salvar o produto:', error.response?.data || error.message);
      alert('Erro ao salvar o produto.');
    } finally {
      setLoading(false); // Finaliza o carregamento
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newProduct = { ...product, categories: selectedCategories };
    handleProductCreation(newProduct);  // Chama a função para criar o produto
  };

  // Função para cancelar/voltar
  const handleCancel = () => {
    router.push('/'); // Redireciona para a página de produtos
  };

  return (
    <form onSubmit={handleSubmit} className="product-form">
      <h3>Criar Novo Produto</h3>

      {product.thumbnail && (
        <div>
          <img
            src={product.thumbnail}
            alt={product.title}
            className="product-image"
          />
        </div>
      )}

      <div>
        <label>
          <p>Nome:</p>
          <input
            type="text"
            name="name"
            value={product.title}
            onChange={(e) => setProduct({ ...product, title: e.target.value })}
            placeholder="Digite o nome do produto"
          />
        </label>
      </div>

      <div>
        <label>
          <p>Preço:</p>
          <input
            type="number"
            name="price"
            value={product.price}
            onChange={(e) => setProduct({ ...product, price: e.target.value })}
            placeholder="Digite o preço do produto"
          />
        </label>
      </div>

      <div>
        <label>
          <p>Porcentagem de desconto:</p>
          <input
            type="number"
            name="discountPercentage"
            value={product.discountPercentage}
            onChange={(e) => setProduct({ ...product, discountPercentage: e.target.value })}
            placeholder="Digite o desconto do produto"
          />
        </label>
      </div>

      <div>
        <label>
          <p>Avaliação:</p>
          <input
            type="number"
            name="rating"
            value={product.rating}
            onChange={(e) => setProduct({ ...product, rating: e.target.value })}
            placeholder="Digite a avaliação do produto"
          />
        </label>
      </div>

      <div>
        <label>
          <p>Estoque:</p>
          <input
            type="number"
            name="stock"
            value={product.stock}
            onChange={(e) => setProduct({ ...product, stock: e.target.value })}
            placeholder="Digite o estoque do produto"
          />
        </label>
      </div>

      <div>
        <label>
          <p>Marca:</p>
          <input
            type="text"
            name="brand"
            value={product.brand}
            onChange={(e) => setProduct({ ...product, brand: e.target.value })}
            placeholder="Digite a marca do produto"
          />
        </label>
      </div>

      <div>
        <label>
          <p>Descrição:</p>
          <textarea
            name="description"
            value={product.description}
            onChange={(e) => setProduct({ ...product, description: e.target.value })}
            placeholder="Digite a descrição do produto"
          />
        </label>
      </div>

      <div>
        <label>Categorias:</label>
        <div className="selected-categories">
          {selectedCategories.length === 0 && (
            <span className="no-category">Nenhuma categoria selecionada.</span>
          )}
          {selectedCategories.map((category, index) => (
            <div key={category + index} className="category-tag">
              <span>{category}</span>
              <button
                type="button"
                onClick={() => handleCategoryChange(category)}
                className="remove-category-btn"
              >
                X
              </button>
            </div>
          ))}
        </div>

        <button
          type="button"
          onClick={() => setShowCategoryList(!showCategoryList)}
          className="add-category-btn"
        >
          {showCategoryList ? "Fechar" : "+"}
        </button>

        {showCategoryList && (
          <div className="category-list">
            {categoriesList.length === 0 ? (
              <p>Carregando categorias...</p>
            ) : (
              categoriesList.map((category, index) => (
                <div key={index} className="category-item">
                  <button
                    type="button"
                    onClick={() => handleCategoryChange(category.name)} // Aqui, estamos passando a propriedade 'name'
                    className="category-item-btn"
                  >
                    {category.name} {/* Exibe o nome da categoria */}
                  </button>
                </div>
              ))
            )}
          </div>
        )}
      </div>

      {/* Input de imagem */}
      <div>
        <label>
          <p>Imagem do Produto:</p>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
          />
        </label>
      </div>

      <div className="buttons">
        <button type="submit" disabled={loading} className="submit-btn">
          {loading ? 'Salvando...' : 'Criar Produto'}
        </button>

        {/* Botão de Cancelar */}
        <button type="button" onClick={handleCancel} className="cancel-btn">
          Cancelar
        </button>
      </div>
    </form>
  );
};

export default ProductForm;
