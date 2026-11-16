# E-Commerce React App

A React storefront for browsing products, managing a cart, checking out, and handling basic user and admin workflows. The app uses a separate backend API for products, users, addresses, carts, orders, payments, and reviews.

## Features

- Product catalog with pagination, product details, pricing, stock, and ratings.
- User authentication with login and sign-up flows.
- Cart management with item selection, quantity updates, removal, and checkout.
- Checkout flow with shipping address selection or editing.
- Order creation, payment confirmation, and payment detail views.
- User account pages for profile, orders, and reviews.
- Admin pages for managing users, products, orders, and reviews.
- Toast and inline message handling for API success and error feedback.

## Tech Stack

- React 19
- Create React App / react-scripts
- React Router
- Axios
- Bootstrap 5
- React Bootstrap
- Bootstrap Icons
- React Icons
- React Testing Library

## Prerequisites

Before running the app, make sure you have:

- Node.js and npm installed.
- A compatible backend API running at `http://localhost:8080/api`.

The API base URL is currently defined in `src/api/ApiCall.js`.

## Getting Started

If your terminal is open in the parent folder that contains this app folder, move into the React app first:

```powershell
cd .\ecommerce-react-app
```

You should be in the same folder as `package.json` before running npm commands.

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm start
```

The app will open at:

```text
http://localhost:3000
```

Create a production build:

```bash
npm run build
```

Run tests:

```bash
npm test
```

## Troubleshooting

### `npm` is not recognized

If PowerShell shows `npm : The term 'npm' is not recognized`, Node.js/npm is not installed or is not available on your PATH.

Try these steps:

1. Close PowerShell and open a new PowerShell window.
2. Check whether Node and npm are available:

   ```powershell
   node -v
   npm -v
   ```

3. If both commands still fail, install Node.js LTS from the official Node.js website, then reopen PowerShell.
4. If you use NVM for Windows, activate an installed Node version first:

   ```powershell
   nvm list
   nvm use 22.16.0
   ```

After `npm -v` works, run the setup commands again from the React app folder.

## Backend API Expectations

The frontend expects API responses with a shape similar to:

```json
{
  "success": true,
  "message": "Operation completed successfully.",
  "responseData": {}
}
```

Main API areas used by the app:

- Public products: `/public/product`
- User auth: `/user/signup`, `/user/login`
- User profile and addresses: `/user/:userExternalId`, `/user/:userExternalId/address`
- Cart: `/user/:userExternalId/cart`
- Orders: `/user/:userExternalId/order`, `/user/order/:orderExternalId`
- Payments: `/user/order/:orderExternalId/payment`
- Reviews: `/user/:userExternalId/reviews`, `/product/:productExternalId/reviews`
- Admin products, orders, reviews, and users: `/admin/...`

## Main Routes

| Route | Purpose |
| --- | --- |
| `/` and `/products` | Product catalog |
| `/products/:productExternalId` | Product detail page |
| `/login` | Login and sign-up page |
| `/user/cart` | User cart |
| `/user/cart/checkout` | Checkout selected cart items |
| `/user/product/:productExternalId/checkout` | Buy-now checkout for one product |
| `/user/profile` | User profile |
| `/user/orders` | User order list |
| `/user/reviews` | User review list |
| `/order/:orderExternalId/payment/details` | Payment details |
| `/user/order/:orderExternalId/payment/confirmation` | Payment confirmation |
| `/admin/users` | Admin user management |
| `/admin/manage/products` | Admin product management |
| `/admin/manage/orders` | Admin order management |
| `/admin/manage/reviews` | Admin review management |

## Demo Admin Login

The current frontend includes a local admin check for development:

```text
Email: admin@gmail.com
Password: Passw0rd-admin
```

Move admin authentication and authorization fully to the backend before using this in production.

## Project Structure

```text
src/
  api/
    ApiCall.js
  components/
    AuthComponent.jsx
    CartComponent.jsx
    CheckoutSummaryComponent.jsx
    HeaderComponent.jsx
    HomeComponent.jsx
    ProductComponent.jsx
    ...
  components/modal/
    DeleteModalComponent.jsx
    OrderModalCompoment.jsx
    ProductModalComponent.jsx
    ReviewModalComponent.jsx
  security/
    AuthContext.js
  App.js
  index.js
```

## Notes

- Product detail pages use a fallback image when the backend does not provide `imageUrl`.
- Several user and admin pages redirect to `/login` when the user is not authenticated.
- Admin-only and user-only experiences are controlled in the frontend through `AuthContext`.
- For production, consider moving the API base URL into an environment variable such as `REACT_APP_API_BASE_URL`.
