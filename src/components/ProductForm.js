import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation'; // Importando o useRouter para navegação
import './ProductForm.css';

const ProductForm = ({ initialProduct, onSubmit }) => {
  const [product, setProduct] = useState(initialProduct);
  const [loading, setLoading] = useState(false);
  const [categoriesList, setCategoriesList] = useState([]);
  // Inicializa selectedCategories como um array vazio, caso o produto não tenha categorias definidas
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [showCategoryList, setShowCategoryList] = useState(false);

  const router = useRouter(); // Instanciando o hook do Next.js para navegação

  // Carrega as categorias da API
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch('https://dummyjson.com/products/categories');
        const data = await response.json();
        setCategoriesList(data); // Assuming data is an array of category objects
      } catch (error) {
        console.error('Erro ao buscar categorias:', error);
      }
    };

    fetchCategories();
  }, []);

  // Atualiza o estado de produto e categorias quando initialProduct mudar
  useEffect(() => {
    setProduct(initialProduct);

    // Certifique-se de que initialProduct.category seja sempre um array
    if (initialProduct.category) {
      setSelectedCategories(Array.isArray(initialProduct.category) 
        ? initialProduct.category 
        : [initialProduct.category]); // Caso seja uma string, transforma em array
    } else {
      setSelectedCategories([]);
    }
  }, [initialProduct]);

  const handleCategoryChange = (category) => {
    setSelectedCategories((prevSelected) => {
      if (prevSelected.includes(category)) {
        return prevSelected.filter(item => item !== category);
      } else {
        return [...prevSelected, category];
      }
    });
  };

  const handleRemoveCategory = (category) => {
    setSelectedCategories((prevSelected) =>
      prevSelected.filter((item) => item !== category)
    );
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProduct((prevProduct) => ({
      ...prevProduct,
      [name]: value,
    }));
  };

  const handleCancel = () => {
    router.push('/'); // Redireciona para a página de produtos
  };

  const handleUpdateProduct = async (product) => {
    const url = `https://dummyjson.com/products/${product.id}`;

    const updatedFields = {};
    Object.keys(product).forEach((key) => {
      if (product[key] !== initialProduct[key]) {
        updatedFields[key] = product[key];
      }
    });

    if (Object.keys(updatedFields).length === 0) {
      alert('Nenhuma alteração detectada.');
      return;
    }

    try {
      const response = await axios.put(url, updatedFields, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      console.log('Produto atualizado:', response.data);
      alert(`Produto atualizado com sucesso: ${response.data.title}`);
    } catch (error) {
      if (error.response) {
        console.error('Erro na atualização do produto:', error.response.data);
        alert(`Erro ao atualizar o produto: ${error.response.data.message || 'Erro desconhecido'}`);
      } else if (error.request) {
        console.error('Erro na requisição:', error.request);
        alert('Erro na requisição ao servidor.');
      } else {
        console.error('Erro:', error.message);
        alert(`Erro: ${error.message}`);
      }
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const updatedProduct = { ...product, categories: selectedCategories };
    handleUpdateProduct(updatedProduct);
  };

  return (
    <form onSubmit={handleSubmit} className="product-form">
      <h3>Formulário de Edição do Produto</h3>

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
          Nome:
          <input
            type="text"
            name="name"
            value={product.title || ''}
            onChange={handleChange}
            placeholder="Digite o nome do produto"
          />
        </label>
      </div>

      <div>
        <label>
          Preço:
          <input
            type="number"
            name="price"
            value={product.price || ''}
            onChange={handleChange}
            placeholder="Digite o preço do produto"
          />
        </label>
      </div>

      <div>
        <label>
          Porcentagem de desconto:
          <input
            type="number"
            name="discountPercentage"
            value={product.discountPercentage || ''}
            onChange={handleChange}
            placeholder="Digite o desconto do produto"
          />
        </label>
      </div>

      <div>
        <label>
          Estoque:
          <input
            type="text"
            name="stock"
            value={product.stock || ''}
            onChange={handleChange}
            placeholder="Digite o estoque do produto"
          />
        </label>
      </div>

      <div>
        <label>
          Marca:
          <input
            type="text"
            name="brand"
            value={product.brand || ''}
            onChange={handleChange}
            placeholder="Digite a marca do produto"
          />
        </label>
      </div>

      <div>
        <label>
          Descrição:
          <textarea
            name="description"
            value={product.description || ''}
            onChange={handleChange}
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
                onClick={() => handleRemoveCategory(category)}
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
          {showCategoryList ? 'Fechar' : '+'}
        </button>

        {showCategoryList && (
          <div className="category-list">
            {categoriesList.length === 0 ? (
              <p>Carregando categorias...</p>
            ) : (
              categoriesList.map((category) => (
                <div key={category.slug} className="category-item">
                  <button
                    type="button"
                    onClick={() => handleCategoryChange(category.name)}
                    className="category-item-btn"
                  >
                    {category.name}
                  </button>
                </div>
              ))
            )}
          </div>
        )}
      </div>

      <div className="buttons">
        <button type="submit" disabled={loading} className="submit-btn">
          {loading ? 'Atualizando...' : 'Atualizar Produto'}
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
