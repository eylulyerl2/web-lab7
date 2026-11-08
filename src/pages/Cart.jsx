import { Link } from 'react-router';
import { useCartStore, selectTotalPrice } from '../store/cartStore.js';

function Cart() {
  const items = useCartStore((state) => state.items);
  const totalPrice = useCartStore(selectTotalPrice);
  const setQuantity = useCartStore((state) => state.setQuantity);
  const removeItem = useCartStore((state) => state.removeItem);
  const clear = useCartStore((state) => state.clear);

  if (items.length === 0) {
    return (
      <section>
        <h1>Your cart</h1>
        <p>Your cart is empty.</p>
        <Link to="/products">Browse products</Link>
      </section>
    );
  }

  return (
    <section>
      <h1>Your cart</h1>

      <ul className="cart-list">
        {items.map((item) => (
          <li key={item.id} className="cart-item">
            <span className="cart-title">{item.title}</span>
            <span>${item.price}</span>
            <div className="quantity">
              <button type="button" onClick={() => setQuantity(item.id, item.quantity - 1)}>
                −
              </button>
              <span>{item.quantity}</span>
              <button type="button" onClick={() => setQuantity(item.id, item.quantity + 1)}>
                +
              </button>
            </div>
            <button type="button" onClick={() => removeItem(item.id)}>
              Remove
            </button>
          </li>
        ))}
      </ul>

      <p className="total">Total: ${totalPrice.toFixed(2)}</p>
      <button type="button" onClick={clear}>
        Clear cart
      </button>
    </section>
  );
}

export default Cart;