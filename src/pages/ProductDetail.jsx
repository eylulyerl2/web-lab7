import { Link, useNavigate, useParams } from 'react-router';
import { useFetch } from '../hooks/useFetch.js';
import { fetchProduct } from '../api/productsApi.js';
import { useCartStore } from '../store/cartStore.js';

function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const addItem = useCartStore((state) => state.addItem);
  const { loading, error, data: product } = useFetch((signal) => fetchProduct(id, signal), [id]);

  const productId = Number(id);
  const hasNumericId = Number.isInteger(productId);

  return (
    <section>
      <button type="button" onClick={() => navigate('/products')}>
        ← Back to products
      </button>

      {loading && <p>Loading product...</p>}
      {error && <p role="alert">{error}</p>}

      {!loading && !error && product && (
        <article className="product-detail">
          <img src={product.thumbnail} alt={product.title} />
          <div>
            <h1>{product.title}</h1>
            <p className="category">{product.category}</p>
            <p>{product.description}</p>
            <p className="price">${product.price}</p>
            <button type="button" onClick={() => addItem(product)}>
              Add to cart
            </button>
          </div>
        </article>
      )}

      {hasNumericId && (
        <p>
          <Link to={`/products/${productId + 1}`}>Next product →</Link>
        </p>
      )}
    </section>
  );
}

export default ProductDetail;