
# E-Commerce Frontend with React.js

This is a dynamic and responsive e-commerce frontend built using React.js. The frontend interacts with a Django REST API backend to provide features like product browsing, user authentication, cart management, and order processing.

## Features

- User authentication and registration
- Browse and search for products
- Add products to cart
- Place orders and proceed to payment
- Integration with backend APIs (e.g., bKash for payments)
- Responsive design for mobile and desktop

## Technologies Used

- **React.js**: JavaScript library for building user interfaces
- **Axios**: For making HTTP requests to the backend
- **React Router Dom**: For handling navigation
- **Redux**: For managing application state (optional, depending on your setup)
- **Styled Components/CSS Modules**: For styling components
- **Tailwind and SCSS**: For responsive UI components .

## Prerequisites

Make sure you have the following installed:

- Node.js
- npm or yarn
- Git

## Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/DevMosaicRakib/Dbd-Ecom-React.git
   cd Dbd-Ecom-React
   ```

2. **Install dependencies:**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Set up environment variables:**

   Create a `.env` file in the root directory and add the following:
   ```env
   REACT_APP_API_URL=http://localhost:8000/api
   REACT_APP_BKASH_SANDBOX=true
   REACT_APP_BKASH_BASE_URL=https://sandbox.bkash.com
   ```

4. **Start the development server:**
   ```bash
   npm start
   # or
   yarn start
   ```

5. **Build for production:**
   To create a production build, run:
   ```bash
   npm run build
   # or
   yarn build
   ```

## Folder Structure

```bash
src/
  ├── components/       # Reusable components (e.g., ProductCard, Header)
  ├── pages/            # Pages (e.g., Home, ProductDetail, Cart, Checkout)
  ├── services/         # API call services using Axios
  ├── store/            # Redux store setup (if using Redux)
  ├── App.js            # Main app component
  └── index.js          # Entry point of the application
```

## API Endpoints

Ensure that your Django backend is running and the following API endpoints are available:

| Method | Endpoint                      | Description                        |
|--------|-------------------------------|------------------------------------|
| GET    | `/api/products/`              | Fetch all products                 |
| POST   | `/api/cartitems/add_item`     | Add items to cart                  |
| POST   | `/api/place-order/`           | Create a new order                 |
| POST   | `/api/bkash/payment/callback/`| payment callback from bKash         |
| POST   | `/api/user/login/`            | User login                         |

## Running Tests

To run tests for your React components:

```bash
npm test
# or
yarn test
```

## Contributing

Contributions are welcome! Feel free to fork the repository, open issues, or submit pull requests.

## License

This project is licensed under the MIT License. See the `LICENSE` file for more details.
