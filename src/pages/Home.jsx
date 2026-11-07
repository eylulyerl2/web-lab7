import { Link } from 'react-router';

function Home() {
  return (
    <section>
      <h1>Welcome to Mini Shop</h1>
      <p>Browse the catalogue, filter products and add them to your cart.</p>
      <Link to="/products">Go to products</Link>
    </section>
  );
}

export default Home;