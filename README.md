# DressStore - E-Commerce Website

A production-ready, mobile-first e-commerce platform for selling dresses, built with **Next.js 14 (App Router)** using **JavaScript**. Features a Flipkart-style mobile UI, guest browsing, COD payments, and a secure admin dashboard.

## 🎯 Features

### Customer Features
- **Browse without login** - Explore products as a guest user
- **Mobile-first design** - Optimized for mobile devices with bottom tab navigation
- **Smart cart system** - localStorage-based cart that persists across sessions
- **Login before checkout** - Authentication required only when placing orders
- **COD payments** - Cash on Delivery payment method
- **Order tracking** - View order history and status
- **Light/Dark theme** - Toggle between themes with localStorage persistence

### Admin Features
- **Secure admin panel** - Role-based access control
- **Product management** - Create, edit, and delete products
- **Image uploads** - Vercel Blob storage integration
- **Order management** - View and update order statuses
- **Stock management** - Track inventory levels

## 🛠 Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: JavaScript (No TypeScript)
- **Styling**: Tailwind CSS v4
- **Database**: MongoDB with Mongoose
- **Authentication**: JWT with HTTP-only cookies
- **File Storage**: Vercel Blob Storage
- **State Management**: React Context API
- **Animations**: Framer Motion (optional)

## 📁 Project Structure

```
/app
 ├── page.js                    # Homepage
 ├── login/page.js              # Customer login
 ├── register/page.js           # Customer registration
 ├── products/page.js           # Product listing
 ├── cart/page.js               # Shopping cart
 ├── checkout/page.js           # Checkout (protected)
 ├── orders/page.js             # Order history (protected)
 ├── admin/
 │   ├── login/page.js          # Admin login
 │   ├── dashboard/page.js      # Admin dashboard
 │   ├── products/page.js       # Product management
 │   └── orders/page.js         # Order management
 └── api/
     ├── auth/                  # Authentication endpoints
     ├── products/              # Product CRUD
     ├── orders/                # Order management
     └── upload/                # File upload

/components
 ├── ui/                        # Reusable UI components
 ├── layout/                    # Layout components
 ├── product/                   # Product-specific components
 ├── cart/                      # Cart components
 └── providers/                 # Context providers

/lib
 ├── db.js                      # MongoDB connection
 └── auth.js                    # Authentication utilities

/models
 ├── User.js                    # User schema
 ├── Product.js                 # Product schema
 └── Order.js                   # Order schema
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ installed
- MongoDB (local or Atlas)
- Vercel Blob Storage token (optional for image uploads)

### Installation

1. **Clone the repository**
   ```bash
   cd c:/e-commerce
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   
   Create a `.env.local` file in the root directory:
   ```env
   # MongoDB
   MONGODB_URI=mongodb://localhost:27017/dress-store
   # Or use MongoDB Atlas:
   # MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/dress-store
   
   # JWT Secret (use a strong random string in production)
   JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
   
   # Vercel Blob Storage (get from https://vercel.com/dashboard/stores)
   BLOB_READ_WRITE_TOKEN=your-vercel-blob-token
   
   # Site Configuration
   NEXT_PUBLIC_SITE_URL=http://localhost:3000
   NEXT_PUBLIC_SITE_NAME=DressStore
   
   # Optional: Admin default credentials
   ADMIN_EMAIL=admin@dressstore.com
   ADMIN_PASSWORD=Admin@12345
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   
   Navigate to [http://localhost:3000](http://localhost:3000)

## 👤 Creating an Admin User

Since the app is in development, you'll need to create an admin user manually in MongoDB:

```javascript
// Connect to MongoDB and run this
db.users.insertOne({
  name: "Admin",
  email: "admin@dressstore.com",
  password: "$2a$10$hashed_password_here", // Use bcrypt to hash
  role: "admin",
  createdAt: new Date(),
  updatedAt: new Date()
})
```

Or use the API endpoint after running the app:
```bash
POST http://localhost:3000/api/auth/register
{
  "name": "Admin User",
  "email": "admin@dressstore.com",
  "password": "Admin@12345"
}
```

Then manually update the role to "admin" in MongoDB.

## 📱 Mobile-First Design

The app is built with a mobile-first approach:

- **Bottom Tab Navigation** (Flipkart-style)
  - Home
  - Categories
  - Cart (with badge counter)
  - Profile/Orders

- **Responsive Breakpoints**
  - Mobile: 320px - 768px
  - Tablet: 768px - 1024px
  - Desktop: 1024px+

- **Touch-Optimized**
  - Large tap targets
  - Swipe-friendly interfaces
  - Mobile-optimized forms

## 🎨 Theme System

Toggle between light and dark modes:
- Theme preference stored in localStorage
- Smooth CSS variable-based transitions
- System preference detection on first visit

## 🔐 Authentication Flow

1. **Guest Users**: Can browse products and add items to cart
2. **Login Trigger**: Required only when clicking "Place Order" at checkout
3. **JWT Tokens**: Stored in HTTP-only cookies for security
4. **Protected Routes**: Middleware automatically redirects unauthenticated users

## 🛒 Cart System

- **localStorage-based**: Cart persists across browser sessions
- **Guest-friendly**: No login required to add items
- **Smart merging**: Combines items by ID, size, and color
- **Real-time updates**: Instant quantity changes and removals

## 📦 Product Features

- **Categories**: Casual, Formal, Party, Ethnic, Western, Summer, Winter
- **Size Options**: XS, S, M, L, XL, XXL
- **Color Variants**: Multiple color options per product
- **Stock Management**: Real-time inventory tracking
- **Image Gallery**: Multiple product images
- **Discount Display**: Compare-at pricing

## 🚚 Order Management

- **COD Only**: Cash on Delivery payment method
- **Order Statuses**: Pending → Confirmed → Shipped → Delivered
- **Order History**: Customers can track their orders
- **Admin Controls**: Update order status from dashboard

## 🏗 API Endpoints

### Public Endpoints
- `GET /api/products` - List products (with filters)
- `GET /api/products/[id]` - Get product details

### Authentication
- `POST /api/auth/register` - Create account
- `POST /api/auth/login` - Login
- `POST /api/auth/logout` - Logout
- `GET /api/auth/me` - Get current user

### Protected (Customer)
- `POST /api/orders` - Place order
- `GET /api/orders` - Get user's orders

### Admin Only
- `POST /api/products` - Create product
- `PUT /api/products/[id]` - Update product
- `DELETE /api/products/[id]` - Delete product
- `PUT /api/orders/[id]` - Update order status
- `POST /api/upload` - Upload images to Vercel Blob

## 🌐 Deployment

### Vercel (Recommended)

1. Push code to GitHub
2. Import project in Vercel
3. Add environment variables
4. Deploy!

```bash
npm run build
```

### Environment Variables for Production

Make sure to set all environment variables in your hosting platform:
- `MONGODB_URI`
- `JWT_SECRET`
- `BLOB_READ_WRITE_TOKEN`
- `NEXT_PUBLIC_SITE_URL`

## 🧪 Testing

### Manual Testing Checklist

**Guest User Flow**:
- [ ] Browse homepage
- [ ] View product details
- [ ] Add items to cart
- [ ] Cart persists after page refresh
- [ ] Redirected to login at checkout

**Customer Flow**:
- [ ] Register new account
- [ ] Login successfully
- [ ] Complete checkout
- [ ] View order history
- [ ] Logout

**Admin Flow**:
- [ ] Login to admin panel
- [ ] Create new product
- [ ] Upload product images
- [ ] Edit product details
- [ ] View all orders
- [ ] Update order status

## 🎯 Future Enhancements

- [ ] Product search functionality
- [ ] Product reviews and ratings
- [ ] Wishlist feature
- [ ] Email notifications
- [ ] Payment gateway integration
- [ ] Multiple addresses per user
- [ ] Size guide
- [ ] Product recommendations
- [ ] Analytics dashboard

## 📄 License

MIT License - feel free to use this project for learning or commercial purposes.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 💬 Support

For issues and questions, please open an issue on GitHub.

---

Built with ❤️ using Next.js and modern web technologies.
