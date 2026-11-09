# Assignment 7 – Mini Shop

A small multi-page online shop built with React and Vite. It loads products from the DummyJSON API, lets visitors filter the catalogue through the URL, shows a detail page for each product, and has a cart that only signed-in users can open. The cart and the theme are remembered between visits.

## How to Run

```bash
npm install
npm run dev
```

**Demo login:** `230408012@st.biruni.edu.tr` / `demo123456`

## File Organization

```
/assignment7
├── src/
│   ├── api/
│   │   ├── productsApi.js     # fetchProducts / fetchProduct – fetch only, no React
│   │   └── authApi.js         # login() – fake server call that resolves after 500 ms
│   ├── hooks/
│   │   ├── useFetch.js        # loading / error / data with useReducer + abort cleanup
│   │   └── useLocalStorage.js # useState-like hook that saves to localStorage
│   ├── context/
│   │   └── AuthContext.jsx    # AuthProvider + useAuth (LOGGED_IN / LOGGED_OUT)
│   ├── store/
│   │   └── cartStore.js       # Zustand cart store + selectors + localStorage sync
│   ├── components/
│   │   ├── Layout.jsx         # Shared layout: NavBar, <Outlet />, footer, theme class
│   │   ├── NavBar.jsx         # NavLinks, cart count, theme toggle, login/logout
│   │   ├── ProductCard.jsx    # One product in the list
│   │   └── ProtectedRoute.jsx # Redirects to /login when nobody is signed in
│   ├── pages/
│   │   ├── Home.jsx
│   │   ├── ProductList.jsx    # Filters live in the URL query string
│   │   ├── ProductDetail.jsx  # Reads :id from the URL
│   │   ├── Cart.jsx
│   │   ├── Login.jsx
│   │   └── NotFound.jsx
│   ├── App.jsx                # Route configuration
│   ├── main.jsx               # BrowserRouter + AuthProvider
│   └── index.css              # Minimal styles and light/dark theme variables
├── index.html
└── package.json
```

## Reasoning Questions

### 1. State choices

- **Signed-in user:** in `AuthContext` (Context + `useReducer`). The NavBar, the Login page and `ProtectedRoute` all need it, and it only changes on login and logout. It lives in memory only, so a reload signs the user out.
- **Cart:** in a Zustand store. It changes often and many components read it. It is saved to `localStorage` so it survives a reload.
- **Filter values:** in the URL query string (`?q=...&category=...`). This way the filtered view can be shared as a link and it stays the same after a refresh.
- **Product list:** local to `ProductList` through `useFetch`. Only that page needs it. The filtered list is not stored anywhere; it is calculated during render.
- **Theme:** in `Layout` with `useLocalStorage`, because only the layout and the NavBar need it and it has to be remembered between visits.

### 2. Context versus store

The user changes very rarely, so it is fine that every component using `useAuth` re-renders on login or logout. The cart changes on every click. With Context, every component reading the cart would re-render on any change. With Zustand each component picks only what it needs with a selector, so the NavBar only re-renders when the item count changes. A store also lives outside React, so I could save the cart with `subscribe` instead of an effect. If I swapped them, the cart would cause many unnecessary re-renders, and the user would lose the simple `AuthProvider` / `useAuth` pattern for no real benefit.

### 3. Custom hooks

`useFetch` shares the logic: the reducer with `loading`, `error` and `data`, the effect that calls the fetching function, and the cleanup that aborts the request when the inputs change or the component unmounts. It deliberately does not share data or state. Every component that calls it gets its own reducer state, so `ProductList` and `ProductDetail` never see each other's data. It is not a cache.

### 4. Route parameters

The `id` from `useParams()` is always a **string**, for example `"3"`, even though product ids in the API are numbers. This mattered for the "Next product" link in `ProductDetail.jsx`: `"3" + 1` would give `"31"`, so I convert it first with `Number(id) + 1`. When adding to the cart I use `product.id` from the API response, which is already a number.

### 5. Protected routes

`ProtectedRoute` only runs in the browser, so it is a user-experience feature, not security. Anyone can change the app's state with the developer tools, and all the code, including the Cart page, is downloaded anyway. Real security needs a real server: proper authentication (for example a session or a token) and the server checking it on every request before it sends any private data.

### 6. Deep links

On a plain static file server, reloading `/products/3` would return 404, because the server looks for a real file at that path and there is none. Only `index.html` exists, and the routing happens later in the browser. The Vite dev server works because it falls back to `index.html` for unknown paths. On a real host, the server needs a rewrite rule that sends every path to `index.html`.