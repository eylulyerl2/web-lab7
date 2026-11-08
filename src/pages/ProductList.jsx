import { useSearchParams } from 'react-router';
import { useFetch } from '../hooks/useFetch.js';
import { fetchProducts } from '../api/productsApi.js';
import ProductCard from '../components/ProductCard.jsx';

function ProductList() {
  const { loading, error, data } = useFetch((signal) => fetchProducts(signal), []);
  const [searchParams, setSearchParams] = useSearchParams();

  const query = searchParams.get('q') ?? '';
  const category = searchParams.get('category') ?? '';

  function updateParam(name, value) {
    setSearchParams(
      (previous) => {
        const next = new URLSearchParams(previous);
        if (value) {
          next.set(name, value);
        } else {
          next.delete(name);
        }
        return next;
      },
      { replace: true }
    );
  }

  if (loading) return <p>Loading products...</p>;
  if (error) return <p role="alert">Error: {error}</p>;

  const products = data ?? [];
  const categories = [...new Set(products.map((product) => product.category))].sort();
  const search = query.trim().toLowerCase();

  const filteredProducts = products.filter(
    (product) =>
      (category === '' || product.category === category) &&
      product.title.toLowerCase().includes(search)
  );

  return (
    <section>
      <h1>Products</h1>

      <div className="filters">
        <label>
          Search:{' '}
          <input
            type="text"
            value={query}
            onChange={(event) => updateParam('q', event.target.value)}
            placeholder="Filter by title"
          />
        </label>

        <label>
          Category:{' '}
          <select value={category} onChange={(event) => updateParam('category', event.target.value)}>
            <option value="">All categories</option>
            {categories.map((name) => (
              <option key={name} value={name}>
                {name}
              </option>
            ))}
          </select>
        </label>
      </div>

      {products.length === 0 && <p>No products available.</p>}
      {products.length > 0 && filteredProducts.length === 0 && (
        <p>No products match your filters.</p>
      )}
      {filteredProducts.length > 0 && (
        <div className="product-grid">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </section>
  );
}

export default ProductList;