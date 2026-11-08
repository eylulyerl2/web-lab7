import { useFetch } from '../hooks/useFetch.js';
import { fetchProducts } from '../api/productsApi.js';
import ProductCard from '../components/ProductCard.jsx';

function ProductList() {
  const { loading, error, data } = useFetch((signal) => fetchProducts(signal), []);

  if (loading) return <p>Loading products...</p>;
  if (error) return <p role="alert">Error: {error}</p>;

  const products = data ?? [];

  return (
    <section>
      <h1>Products</h1>

      {products.length === 0 && <p>No products available.</p>}
      {products.length > 0 && (
        <div className="product-grid">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </section>
  );
}

export default ProductList;