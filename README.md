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

## Self-Study Notes

### Updating one query-string parameter without losing the others
From the React Router docs I learned that `setSearchParams` can take a function that receives the current parameters. In `ProductList.jsx` I copy them with `new URLSearchParams(previous)`, then only `set` or `delete` the one key that changed. This way changing the category keeps the search text and the other way around. I also pass `{ replace: true }` so typing in the search box doesn't add a new browser history entry for every letter.

### Initialising store state from localStorage safely
The stored value can be missing, invalid JSON, or something unexpected. In `cartStore.js` I read it in a `loadItems()` function wrapped in `try/catch`, check that the result is an array, and keep only items that have a valid `id`, `title`, `price` and `quantity`. If anything is wrong, the cart simply starts empty instead of crashing. From the Zustand docs I learned about `store.subscribe(listener)`. I use it to save the items back to `localStorage` outside React, and I compare `state.items` with `previousState.items` so it only writes when the cart actually changed.

### Light/dark theme with a class name and CSS custom properties
From MDN I learned how CSS custom properties work. In `index.css`, `.theme-light` and `.theme-dark` define the same variables (`--bg`, `--text`, `--surface`, ...) with different values, and all other styles only use `var(--...)`. `Layout` puts `theme-light` or `theme-dark` on the wrapper `div`, so switching one class changes every colour at once. The choice is stored with my `useLocalStorage` hook.

### React Router package name
`npm install react-router` installed version 8. Many older tutorials import from `react-router-dom`, but in the current versions everything (`BrowserRouter`, `NavLink`, `useSearchParams`, ...) is imported directly from `react-router`.

## Challenges

**1. Pasting code into the wrong file.**
While adding the theme, I pasted the new CSS into `NavBar.jsx` instead of `index.css`, and the editor showed many errors. I put the correct component code back into `NavBar.jsx` and moved the CSS to `index.css`. Since then I check which tab is open and run `git status` before every commit.

**2. Understanding the redirect after login.**
After logging in I once ended up on `/products` and thought the redirect was wrong. Then I understood that I had pressed the browser's back button: because the login uses `navigate(..., { replace: true })`, the login page is removed from the history, so "back" skips it and goes to the page before. Without `replace`, "back" would show the login form again to a user who is already signed in.

**3. Cart remembered, user forgotten.**
After a reload the cart was still there but I was signed out. This is expected: the cart is saved to `localStorage`, but the user only lives in `AuthContext` in memory. The assignment only asks to remember the cart and the theme, so I kept it that way.

**4. Hooks and early returns.**
In `ProductList` and `Cart` I return early for the loading, error or empty states. I had to make sure every hook (`useFetch`, `useSearchParams`, the store selectors) is called before those `return` statements, otherwise the hooks would be called conditionally and break the Rules of Hooks.