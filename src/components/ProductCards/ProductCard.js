'use client';

import axios from 'axios';
import Link from 'next/link'; // Importe o Link do Next.js para redirecionar
import './ProductCard.css';

const ProductCard = ({ product }) => {
  const handleDelete = async () => {
    try {
      // Fazendo a requisição para deletar o produto
      await axios.delete(`https://dummyjson.com/products/${product.id}`);
      alert('Produto deletado!');
      
      // Recarrega a página após a exclusão
      window.location.reload(); 
    } catch (error) {
      console.error('Erro ao deletar produto', error);
    }
  };

  return (
    <div className="product-card">
      <img
        src={product.thumbnail}
        alt={product.title}
        className="product-image"
      />
      <h3>{product.title}</h3>
      <div className='product-sub-title'>
        <h5>{product.brand}</h5>
        <h5>{product.category}</h5>
      </div>
      <p>{product.description}</p>
      <h4 className="products-card-valor">R$ {product.price}</h4>

      <div className="product-card-tools">
        {/* Botão Editar - redireciona para a página de edição do produto */}
        <button>
          <Link href={`/products/${product.id}`} className="link">
            Editar
          </Link>
        </button>
        {/* Botão Deletar */}
        <button
          onClick={handleDelete} // Chama a função handleDelete diretamente
        >
          Deletar
        </button>
        <p>{product.rating}⭐</p>
      </div>
    </div>
  );
};

export default ProductCard;
