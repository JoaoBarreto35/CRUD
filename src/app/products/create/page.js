// app/products/create.js
import CreateProductForm from '@/components/CreateProductForm';

const CreateProductPage = () => {
  return (
    <div className="create-product-page">
      <h1 className="text-3xl text-center font-bold">Página de Criação de Produto</h1>
      <CreateProductForm />
    </div>
  );
};

export default CreateProductPage;
