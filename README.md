# Zamalek Store

**Zamalek Store** is a modern e-commerce platform designed for a local brick-and-mortar shop in Zamalek, Cairo. This project aims to expand the store's reach by providing a seamless online shopping experience, allowing customers to browse products, manage their carts, and securely purchase items using local payment methods like Paymob.

## Features

### For Customers

- **Browse Products:** Explore a wide range of products organized by categories.
- **Search:** Quickly find items with a powerful search functionality.
- **Shopping Cart:** Add items, adjust quantities, and manage your cart.
- **Secure Checkout:** Integrated with **Paymob** for secure credit card transactions.
- **User Accounts:** Sign up to track orders and save shipping addresses.

### For Administrators

- **Dashboard:** View sales analytics, recent orders, and stock alerts.
- **Product Management:** Add, edit, and remove products with image support.
- **Order Management:** Track and update order statuses (Pending, Shipped, Delivered).

## Tech Stack

- **Frontend:** [Next.js 15](https://nextjs.org/) (App Router), [React 19](https://react.dev/)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/), [HeroUI](https://heroui.com/)
- **Database:** [PostgreSQL](https://www.postgresql.org/)
- **ORM:** [Prisma](https://www.prisma.io/)
- **Authentication:** [Better Auth](https://better-auth.com/)
- **Payments:** [Paymob](https://paymob.com/)

## Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL database

### Installation

1.  Clone the repository:

    ```bash
    git clone https://github.com/yourusername/zamalek-store.git
    cd zamalek-store
    ```

2.  Install dependencies:

    ```bash
    npm install
    ```

3.  Set up environment variables:
    Create a `.env` file in the root directory and add the following:

    ```env
    DATABASE_URL="postgresql://user:password@localhost:5432/zamalek_store"
    AUTH_SECRET="your_auth_secret" # Generate with: npx auth secret
    PAYMOB_API_KEY="your_paymob_api_key"
    # Add other Paymob keys as needed
    ```

4.  Initialize the database:

    ```bash
    npx prisma migrate dev --name init
    ```

5.  Run the development server:
    ```bash
    npm run dev
    ```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.
