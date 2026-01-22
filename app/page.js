import Link from 'next/link';
import Button from '@/components/ui/Button';
import dbConnect from '@/lib/db';
import Product from '@/models/Product';
import dynamic from 'next/dynamic';
import { Shirt, Briefcase, PartyPopper, Flower2, Sparkles as SparklesIcon, Sun, Snowflake, Trophy } from 'lucide-react';

const ProductCard = dynamic(() => import('@/components/product/ProductCard'), { ssr: true });
// const AppDownloadSection = dynamic(() => import('@/components/home/AppDownloadSection'));

export const revalidate = 3600; // Revalidate every hour

async function getFeaturedProducts() {
  try {
    await dbConnect();
    const products = await Product.find({ featured: true })
      .limit(12)
      .lean();

    if (products.length > 0) {
      return JSON.parse(JSON.stringify(products));
    }
  } catch (error) {
    console.log('Error fetching featured products:', error.message);
  }

  return [];
}

async function getTrendingProducts() {
  try {
    await dbConnect();
    const products = await Product.find()
      .sort({ createdAt: -1 })
      .limit(8)
      .lean();

    if (products.length > 0) {
      return JSON.parse(JSON.stringify(products));
    }
  } catch (error) {
    console.log('Error fetching trending products:', error.message);
  }

  return [];
}

export default async function HomePage() {
  const featuredProducts = await getFeaturedProducts();
  const trendingProducts = await getTrendingProducts();

  const categories = [
    { name: 'Casual', slug: 'casual', icon: 'Shirt', color: 'from-blue-400 to-blue-600' },
    { name: 'Formal', slug: 'formal', icon: 'Briefcase', color: 'from-slate-400 to-slate-600' },
    { name: 'Party', slug: 'party', icon: 'PartyPopper', color: 'from-pink-400 to-pink-600' },
    { name: 'Ethnic', slug: 'ethnic', icon: 'Flower2', color: 'from-orange-400 to-orange-600' },
    { name: 'Western', slug: 'western', icon: 'SparklesIcon', color: 'from-purple-400 to-purple-600' },
    { name: 'Summer', slug: 'summer', icon: 'Sun', color: 'from-yellow-400 to-yellow-600' },
    { name: 'Winter', slug: 'winter', icon: 'Snowflake', color: 'from-cyan-400 to-cyan-600' },
    { name: 'Sports', slug: 'sports', icon: 'Trophy', color: 'from-green-400 to-green-600' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Hero Banner */}
      <section className="relative bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4xIj48cGF0aCBkPSJNMzYgMzRjMC0yLjIxIDEuNzktNCA0LTRzNCAxLjc5IDQgNC0xLjc5IDQtNCA0LTQtMS43OS00LTR6bTAgMTBjMC0yLjIxIDEuNzktNCA0LTRzNCAxLjc5IDQgNC0xLjc5IDQtNCA0LTQtMS43OS00LTR6Ii8+PC9nPjwvZz48L3N2Zz4=')] opacity-20"></div>

        <div className="container mx-auto px-4 py-16 md:py-24 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-block mb-4 px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-white text-sm font-medium flex items-center gap-2 mx-auto justify-center w-fit">
              <SparklesIcon className="w-4 h-4 text-yellow-300" /> New Collection 2026
            </div>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight">
              Elevate Your Style
              <span className="block bg-gradient-to-r from-yellow-300 to-pink-300 bg-clip-text text-transparent">
                This Season
              </span>
            </h1>
            <p className="text-lg md:text-xl text-white/90 mb-8 max-w-2xl mx-auto">
              Discover trending dresses with up to 70% OFF. Premium quality, latest fashion, delivered to your doorstep.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/products">
                <Button size="lg" className="bg-white text-indigo-600 hover:bg-gray-100 border-none font-semibold px-8 py-6 text-lg shadow-2xl">
                  Shop Now
                  <svg className="w-5 h-5 ml-2 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </Button>
              </Link>
              <Link href="/products?tag=new">
                <Button size="lg" className="bg-white/10 backdrop-blur-sm text-white hover:bg-white/20 border-2 border-white/30 font-semibold px-8 py-6 text-lg">
                  New Arrivals
                </Button>
              </Link>
            </div>

            <div className="grid grid-cols-3 gap-4 md:gap-8 mt-12 max-w-2xl mx-auto">
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-white mb-1">10K+</div>
                <div className="text-sm text-white/80">Happy Customers</div>
              </div>
              <div className="text-center border-x border-white/20">
                <div className="text-3xl md:text-4xl font-bold text-white mb-1">500+</div>
                <div className="text-sm text-white/80">Products</div>
              </div>
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-white mb-1">4.8★</div>
                <div className="text-sm text-white/80">Rating</div>
              </div>
            </div>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto">
            <path d="M0 0L60 10C120 20 240 40 360 46.7C480 53 600 47 720 43.3C840 40 960 40 1080 46.7C1200 53 1320 67 1380 73.3L1440 80V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0V0Z" fill="white" />
          </svg>
        </div>
      </section>

      {/* Categories */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-10">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">Shop by Category</h2>
            <p className="text-gray-600 text-lg">Find your perfect dress for every occasion</p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-4">
            {categories.map((category) => {
              const IconComponent = {
                Shirt,
                Briefcase,
                PartyPopper,
                Flower2,
                SparklesIcon,
                Sun,
                Snowflake,
                Trophy
              }[category.icon];

              return (
                <Link key={category.slug} href={`/products?category=${category.slug}`} className="group">
                  <div className="flex flex-col items-center p-4 rounded-2xl bg-gradient-to-br from-gray-50 to-gray-100 hover:shadow-xl transition-all duration-300 border border-gray-200 hover:border-indigo-300 hover:-translate-y-1">
                    <div className={`w-16 h-16 md:w-20 md:h-20 bg-gradient-to-br ${category.color} rounded-2xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform shadow-lg`}>
                      <IconComponent className="w-8 h-8 md:w-10 md:h-10 text-white" />
                    </div>
                    <span className="text-sm md:text-base font-semibold text-gray-800 text-center">{category.name}</span>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Best Deals */}
      <section className="py-12 bg-gradient-to-b from-white to-gray-50">
        <div className="container mx-auto px-4">
          <div className="bg-white rounded-3xl p-6 md:p-10 shadow-xl border border-gray-100">
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <span className="px-3 py-1 bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs font-bold rounded-full">HOT DEALS</span>
                  <span className="text-sm text-gray-600">Limited Time Offer</span>
                </div>
                <h2 className="text-2xl md:text-4xl font-bold text-gray-900">Best Deals on Dresses</h2>
                <p className="text-gray-600 mt-2">Handpicked deals just for you</p>
              </div>
              <Link href="/products" className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold rounded-xl transition-all shadow-lg hover:shadow-xl">
                View All
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
            </div>

            {featuredProducts.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 md:gap-6">
                {featuredProducts.slice(0, 6).map((product) => (
                  <ProductCard key={product._id} product={product} />
                ))}
              </div>
            ) : (
              <div className="text-center py-16 text-gray-500">
                <svg className="w-16 h-16 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
                <p className="text-lg">No deals available right now</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-12 bg-gradient-to-br from-indigo-50 to-purple-50">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-6">
            <div className="group bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all border border-indigo-100 hover:-translate-y-1">
              <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-xl">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Free Delivery</h3>
              <p className="text-gray-600 leading-relaxed">Enjoy free shipping on all orders above ₹999. Fast and reliable delivery across India.</p>
            </div>

            <div className="group bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all border border-purple-100 hover:-translate-y-1">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-xl">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Cash on Delivery</h3>
              <p className="text-gray-600 leading-relaxed">Pay when you receive your order. Secure and convenient payment option available.</p>
            </div>

            <div className="group bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all border border-pink-100 hover:-translate-y-1">
              <div className="w-16 h-16 bg-gradient-to-br from-pink-500 to-red-500 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-xl">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Easy Returns</h3>
              <p className="text-gray-600 leading-relaxed">Not satisfied? Return within 7 days. Hassle-free returns and exchange policy.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Top Picks */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-3xl p-6 md:p-10 border border-purple-100">
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <span className="px-3 py-1 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs font-bold rounded-full">TRENDING NOW</span>
                  <span className="text-sm text-gray-600">Most Popular</span>
                </div>
                <h2 className="text-2xl md:text-4xl font-bold text-gray-900">Top Picks for You</h2>
                <p className="text-gray-600 mt-2">Curated collection based on your style</p>
              </div>
              <Link href="/products" className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold rounded-xl transition-all shadow-lg hover:shadow-xl">
                See All
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
            </div>

            {trendingProducts.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-4 md:gap-6">
                {trendingProducts.map((product) => (
                  <ProductCard key={product._id} product={product} />
                ))}
              </div>
            ) : (
              <div className="text-center py-16 text-gray-500">
                <svg className="w-16 h-16 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
                <p className="text-lg">Loading top picks...</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Featured Collection */}
      {featuredProducts.length > 6 && (
        <section className="py-12 bg-gradient-to-b from-white to-gray-50">
          <div className="container mx-auto px-4">
            <div className="bg-white rounded-3xl p-6 md:p-10 shadow-xl border border-gray-100">
              <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <span className="px-3 py-1 bg-gradient-to-r from-indigo-500 to-blue-500 text-white text-xs font-bold rounded-full">FEATURED</span>
                    <span className="text-sm text-gray-600">Handpicked Collection</span>
                  </div>
                  <h2 className="text-2xl md:text-4xl font-bold text-gray-900">Featured Collection</h2>
                  <p className="text-gray-600 mt-2">Exclusive designs specially curated for you</p>
                </div>
                <Link href="/products" className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white font-semibold rounded-xl transition-all shadow-lg hover:shadow-xl">
                  Explore All
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </Link>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 md:gap-6">
                {featuredProducts.slice(6, 12).map((product) => (
                  <ProductCard key={product._id} product={product} />
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* App Download Section */}
      {/* <AppDownloadSection /> */}
    </div>
  );
}