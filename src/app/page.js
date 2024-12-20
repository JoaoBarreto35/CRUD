'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import ProductCard from '../components/ProductCards/ProductCard';
import Link from 'next/link'; // <-- Importação do Link

const ProductsPage = () => {
  const [products, setProducts] = useState([]);  // Todos os produtos
  const [filteredProducts, setFilteredProducts] = useState([]);  // Produtos filtrados
  const [search, setSearch] = useState('');
  const [sortOrder, setSortOrder] = useState('asc');
  const [sortBy, setSortBy] = useState('title');
  
  // Paginação
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 8; // Número de produtos por página

  // Função para buscar todos os produtos
  const fetchAllProducts = async () => {
    try {
      console.log('Buscando todos os produtos...');
      const response = await axios.get('https://dummyjson.com/products', {
        params: {
          limit: 100, // Defina um limite adequado para o número de produtos que você deseja carregar
        },
      });

      const fetchedProducts = response.data.products;
      console.log(fetchedProducts); // Verificando os resultados da API
      setProducts(fetchedProducts);  // Atualizando os produtos com os resultados da API
      setFilteredProducts(fetchedProducts); // Inicialmente, todos os produtos são exibidos
    } catch (error) {
      console.error('Erro ao buscar produtos', error);
    }
  };

  // Função para filtrar os produtos de acordo com a pesquisa
  const filterProducts = () => {
    if (!search) {
      setFilteredProducts(products); // Se não houver busca, exibe todos os produtos
    } else {
      const filtered = products.filter(product => {
        const title = product.title ? product.title.toLowerCase() : '';
        const brand = product.brand ? product.brand.toLowerCase() : '';
        return title.includes(search.toLowerCase()) || brand.includes(search.toLowerCase());
      });
      setFilteredProducts(filtered);
    }
  };

  // Chama a função fetchAllProducts para pegar todos os produtos no primeiro carregamento
  useEffect(() => {
    fetchAllProducts();  // Carregar todos os produtos quando a página for carregada
  }, []);  // O array vazio garante que o efeito seja executado apenas uma vez

  // Filtra os produtos após cada digitação na busca
  useEffect(() => {
    filterProducts();
  }, [search, products]); // Refiltra sempre que search ou products mudarem

  // Função de busca
  const handleSearchChange = (e) => {
    setSearch(e.target.value);
    setCurrentPage(1);  // Reinicia a página para a primeira quando a busca mudar
  };

  // Função de ordenação
  const handleSortChange = (e) => {
    const value = e.target.value;
    setSortBy(value);
    setSortOrder('asc'); // Resetando a ordem para 'asc' quando mudar o critério de ordenação
  };

  // Função de ordenação
  const sortProducts = (productsToSort) => {
    return productsToSort.sort((a, b) => {
      const valA = a[sortBy] ? a[sortBy].toLowerCase() : '';
      const valB = b[sortBy] ? b[sortBy].toLowerCase() : '';
      
      if (sortOrder === 'asc') {
        return valA.localeCompare(valB);
      } else {
        return valB.localeCompare(valA);
      }
    });
  };

  // Cálculo para a paginação
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = sortProducts(filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct));

  const totalPages = Math.ceil(filteredProducts.length / productsPerPage); // Número total de páginas

  // Funções de navegação de página
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-3xl text-center font-bold">Lista de Produtos</h1>
      <div className="top">
      {/* Barra de busca */}
      <input
        type="text"
        placeholder="Buscar por título ou marca"
        value={search}
        onChange={handleSearchChange}
        className="p-2 border border-gray-300 rounded-md mt-4 mb-4 w-full max-w-md mx-auto"
      />

      {/* Seletor de ordenação */}
      <div className="mb-4">
        <label htmlFor="sortBy" className="mr-2">Ordenar por:</label>
        <select
          id="sortBy"
          onChange={handleSortChange}
          value={sortBy}
          className="p-2 border border-gray-300 rounded-md"
        >
          <option value="title">Título</option>
          <option value="brand">Marca</option>
        </select>

        <label htmlFor="sortOrder" className="ml-4 mr-2">Ordem:</label>
        <select
          id="sortOrder"
          onChange={(e) => setSortOrder(e.target.value)}
          value={sortOrder}
          className="p-2 border border-gray-300 rounded-md"
        >
          <option value="asc">Ascendente</option>
          <option value="desc">Descendente</option>
        </select>
      </div>
      </div>
      {/* Link para criar novo produto */}
      <div className="text-center mb-4">
        <Link href="/products/create" className="p-2 px-4 bg-green-500 text-white rounded-md">Criar Novo Produto</Link>
      </div>

      {/* Exibir os produtos filtrados */}
      <div className="products-grid grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-4">
        {currentProducts.length > 0 ? (
          currentProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))
        ) : (
          <p className="text-center text-gray-500">Nenhum produto encontrado.</p>
        )}
      </div>

      {/* Navegação de Paginação */}
      
      <div className="pagination flex justify-center gap-4 mt-4">
  <a
    onClick={handlePreviousPage}
    className={`p-2 px-4 rounded-md border ${currentPage === 1 ? 'bg-gray-200 text-gray-500 cursor-not-allowed' : 'bg-white text-blue-500'}`}
    disabled={currentPage === 1}
  >
    Anterior
  </a>

  {Array.from({ length: totalPages }, (_, index) => index + 1).map((pageNumber) => (
    <a
      key={pageNumber}
      onClick={() => handlePageChange(pageNumber)}
      className={`p-2 px-4 rounded-md border ${currentPage === pageNumber ? 'bg-blue-500 text-white active' : 'bg-white text-blue-500'}`}
    >
      {pageNumber}
    </a>
  ))}

  <a
    onClick={handleNextPage}
    className={`p-2 px-4 rounded-md border ${currentPage === totalPages ? 'bg-gray-200 text-gray-500 cursor-not-allowed' : 'bg-white text-blue-500'}`}
    disabled={currentPage === totalPages}
  >
    Próximo
  </a>
</div>

    </div>
  );
};

export default ProductsPage;
