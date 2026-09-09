import { useState, useMemo } from 'react';
import { Product, CartItem } from './types';
import { products, categories } from './data/products';
import AdminDashboard from './components/AdminDashboard';

function App() {
  const [view, setView] = useState<'customer' | 'owner'>('customer');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckout, setIsCheckout] = useState(false);
  const [orderComplete, setOrderComplete] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const filteredProducts = useMemo(() => {
    return products.filter(product => {
      const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.origin.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.flavorNotes.some(note => note.toLowerCase().includes(searchQuery.toLowerCase()));
      const matchesCategory = selectedCategory === 'All' || product.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, selectedCategory]);

  const cartTotal = useMemo(() => {
    return cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  }, [cart]);

  const cartCount = useMemo(() => {
    return cart.reduce((sum, item) => sum + item.quantity, 0);
  }, [cart]);

  // Owner Dashboard View - rendered AFTER all hooks
  if (view === 'owner') {
    return <AdminDashboard onBackToStore={() => setView('customer')} />;
  }

  const addToCart = (product: Product) => {
    setCart(prev => {
      const existing = prev.find(item => item.product.id === product.id);
      if (existing) {
        return prev.map(item =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { product, quantity: 1 }];
    });
  };

  const updateQuantity = (productId: number, delta: number) => {
    setCart(prev => {
      return prev.map(item => {
        if (item.product.id === productId) {
          const newQty = item.quantity + delta;
          if (newQty <= 0) return null as any;
          return { ...item, quantity: newQty };
        }
        return item;
      }).filter(Boolean);
    });
  };

  const removeFromCart = (productId: number) => {
    setCart(prev => prev.filter(item => item.product.id !== productId));
  };

  const handleCheckout = () => {
    setIsCheckout(true);
    setIsCartOpen(false);
  };

  const completeOrder = () => {
    setOrderComplete(true);
    setCart([]);
    setTimeout(() => {
      setOrderComplete(false);
      setIsCheckout(false);
      setSelectedProduct(null);
    }, 3000);
  };

  const getRoastColor = (roast: string) => {
    switch (roast) {
      case 'Light': return 'bg-amber-100 text-amber-800';
      case 'Medium': return 'bg-orange-100 text-orange-800';
      case 'Medium-Dark': return 'bg-yellow-100 text-yellow-800';
      case 'Dark': return 'bg-stone-200 text-stone-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // Order Complete Screen
  if (orderComplete) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl shadow-xl p-8 md:p-12 text-center max-w-md w-full">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-2xl md:text-3xl font-serif font-bold text-stone-800 mb-3">Order Confirmed!</h2>
          <p className="text-stone-600 mb-6">Thank you for your order. Your specialty coffee is being prepared with care.</p>
          <div className="text-sm text-stone-500">
            <p>Order #EB-{Math.floor(Math.random() * 90000) + 10000}</p>
          </div>
        </div>
      </div>
    );
  }

  // Checkout Screen
  if (isCheckout) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50">
        <header className="bg-white/80 backdrop-blur-md border-b border-amber-100 sticky top-0 z-40">
          <div className="max-w-6xl mx-auto px-4 py-4 flex items-center">
            <button onClick={() => setIsCheckout(false)} className="text-stone-600 hover:text-stone-800 flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back
            </button>
            <h1 className="ml-4 text-xl font-serif font-bold text-stone-800">Checkout</h1>
          </div>
        </header>

        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="grid md:grid-cols-2 gap-8">
            {/* Order Summary */}
            <div className="bg-white rounded-2xl shadow-sm p-6 border border-amber-100">
              <h2 className="text-lg font-serif font-bold text-stone-800 mb-4">Order Summary</h2>
              <div className="space-y-3">
                {cart.map(item => (
                  <div key={item.product.id} className="flex justify-between items-center py-2 border-b border-stone-100 last:border-0">
                    <div>
                      <p className="text-sm font-medium text-stone-700">{item.product.name}</p>
                      <p className="text-xs text-stone-500">Qty: {item.quantity}</p>
                    </div>
                    <p className="text-sm font-semibold text-stone-800">${(item.product.price * item.quantity).toFixed(2)}</p>
                  </div>
                ))}
              </div>
              <div className="mt-4 pt-4 border-t border-stone-200">
                <div className="flex justify-between text-sm text-stone-600 mb-2">
                  <span>Subtotal</span>
                  <span>${cartTotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm text-stone-600 mb-2">
                  <span>Shipping</span>
                  <span>Free</span>
                </div>
                <div className="flex justify-between text-lg font-bold text-stone-800 mt-3 pt-3 border-t border-stone-200">
                  <span>Total</span>
                  <span>${cartTotal.toFixed(2)}</span>
                </div>
              </div>
            </div>

            {/* Checkout Form */}
            <div className="bg-white rounded-2xl shadow-sm p-6 border border-amber-100">
              <h2 className="text-lg font-serif font-bold text-stone-800 mb-4">Shipping Details</h2>
              <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); completeOrder(); }}>
                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-1">Full Name</label>
                  <input type="text" required className="w-full px-4 py-2.5 rounded-xl border border-stone-200 focus:border-amber-400 focus:ring-2 focus:ring-amber-100 outline-none transition" placeholder="John Doe" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-1">Email</label>
                  <input type="email" required className="w-full px-4 py-2.5 rounded-xl border border-stone-200 focus:border-amber-400 focus:ring-2 focus:ring-amber-100 outline-none transition" placeholder="john@example.com" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-1">Address</label>
                  <input type="text" required className="w-full px-4 py-2.5 rounded-xl border border-stone-200 focus:border-amber-400 focus:ring-2 focus:ring-amber-100 outline-none transition" placeholder="123 Coffee Lane" />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-stone-700 mb-1">City</label>
                    <input type="text" required className="w-full px-4 py-2.5 rounded-xl border border-stone-200 focus:border-amber-400 focus:ring-2 focus:ring-amber-100 outline-none transition" placeholder="Portland" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-stone-700 mb-1">ZIP</label>
                    <input type="text" required className="w-full px-4 py-2.5 rounded-xl border border-stone-200 focus:border-amber-400 focus:ring-2 focus:ring-amber-100 outline-none transition" placeholder="97201" />
                  </div>
                </div>
                <div className="pt-2">
                  <label className="block text-sm font-medium text-stone-700 mb-1">Card Number</label>
                  <input type="text" required className="w-full px-4 py-2.5 rounded-xl border border-stone-200 focus:border-amber-400 focus:ring-2 focus:ring-amber-100 outline-none transition" placeholder="4242 4242 4242 4242" />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-stone-700 mb-1">Expiry</label>
                    <input type="text" required className="w-full px-4 py-2.5 rounded-xl border border-stone-200 focus:border-amber-400 focus:ring-2 focus:ring-amber-100 outline-none transition" placeholder="MM/YY" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-stone-700 mb-1">CVC</label>
                    <input type="text" required className="w-full px-4 py-2.5 rounded-xl border border-stone-200 focus:border-amber-400 focus:ring-2 focus:ring-amber-100 outline-none transition" placeholder="123" />
                  </div>
                </div>
                <button type="submit" className="w-full bg-gradient-to-r from-amber-700 to-amber-800 text-white py-3.5 rounded-xl font-semibold hover:from-amber-800 hover:to-amber-900 transition-all shadow-lg shadow-amber-200 mt-4">
                  Place Order — ${cartTotal.toFixed(2)}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Product Detail View
  if (selectedProduct) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50">
        <header className="bg-white/80 backdrop-blur-md border-b border-amber-100 sticky top-0 z-40">
          <div className="max-w-6xl mx-auto px-4 py-4 flex items-center">
            <button onClick={() => setSelectedProduct(null)} className="text-stone-600 hover:text-stone-800 flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back
            </button>
            <h1 className="ml-4 text-xl font-serif font-bold text-stone-800 truncate">{selectedProduct.name}</h1>
            <button onClick={() => setIsCartOpen(true)} className="ml-auto relative p-2 text-stone-600 hover:text-stone-800">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 100 4 2 2 0 000-4z" />
              </svg>
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-amber-700 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold">{cartCount}</span>
              )}
            </button>
          </div>
        </header>

        <div className="max-w-6xl mx-auto px-4 py-8">
          <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
            <div className="relative">
              <div className="aspect-square rounded-3xl overflow-hidden shadow-xl">
                <img src={selectedProduct.image} alt={selectedProduct.name} className="w-full h-full object-cover" />
              </div>
              <span className={`absolute top-4 left-4 px-3 py-1 rounded-full text-xs font-semibold ${getRoastColor(selectedProduct.roast)}`}>
                {selectedProduct.roast} Roast
              </span>
            </div>

            <div className="flex flex-col justify-center">
              <div className="mb-2">
                <span className="text-sm font-medium text-amber-700 uppercase tracking-wider">{selectedProduct.category}</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-serif font-bold text-stone-800 mb-2">{selectedProduct.name}</h2>
              <p className="text-stone-500 mb-4">{selectedProduct.origin} · {selectedProduct.weight}</p>
              <p className="text-stone-600 leading-relaxed mb-6">{selectedProduct.description}</p>

              <div className="mb-6">
                <h3 className="text-sm font-semibold text-stone-700 uppercase tracking-wider mb-3">Flavor Notes</h3>
                <div className="flex flex-wrap gap-2">
                  {selectedProduct.flavorNotes.map(note => (
                    <span key={note} className="px-3 py-1.5 bg-amber-50 border border-amber-200 text-amber-800 rounded-full text-sm">
                      {note}
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-between mt-auto pt-6 border-t border-stone-200">
                <div>
                  <span className="text-3xl font-bold text-stone-800">${selectedProduct.price.toFixed(2)}</span>
                </div>
                <button
                  onClick={() => { addToCart(selectedProduct); }}
                  className="bg-gradient-to-r from-amber-700 to-amber-800 text-white px-8 py-3.5 rounded-xl font-semibold hover:from-amber-800 hover:to-amber-900 transition-all shadow-lg shadow-amber-200 flex items-center gap-2"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  Add to Cart
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Cart Sidebar */}
        {isCartOpen && (
          <div className="fixed inset-0 z-50 flex justify-end">
            <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={() => setIsCartOpen(false)} />
            <div className="relative w-full max-w-md bg-white shadow-2xl flex flex-col h-full animate-slide-in">
              <div className="p-6 border-b border-stone-100 flex items-center justify-between">
                <h2 className="text-xl font-serif font-bold text-stone-800">Your Cart</h2>
                <button onClick={() => setIsCartOpen(false)} className="p-2 hover:bg-stone-100 rounded-lg transition">
                  <svg className="w-5 h-5 text-stone-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <div className="flex-1 overflow-y-auto p-6">
                {cart.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="text-5xl mb-4">☕</div>
                    <p className="text-stone-500">Your cart is empty</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {cart.map(item => (
                      <div key={item.product.id} className="flex gap-4 p-3 bg-stone-50 rounded-xl">
                        <img src={item.product.image} alt={item.product.name} className="w-16 h-16 rounded-lg object-cover" />
                        <div className="flex-1 min-w-0">
                          <h4 className="text-sm font-semibold text-stone-800 truncate">{item.product.name}</h4>
                          <p className="text-sm text-amber-700 font-medium">${item.product.price.toFixed(2)}</p>
                          <div className="flex items-center gap-2 mt-2">
                            <button onClick={() => updateQuantity(item.product.id, -1)} className="w-7 h-7 rounded-lg bg-white border border-stone-200 flex items-center justify-center text-stone-600 hover:bg-stone-100 transition text-sm">−</button>
                            <span className="text-sm font-semibold text-stone-800 w-6 text-center">{item.quantity}</span>
                            <button onClick={() => updateQuantity(item.product.id, 1)} className="w-7 h-7 rounded-lg bg-white border border-stone-200 flex items-center justify-center text-stone-600 hover:bg-stone-100 transition text-sm">+</button>
                            <button onClick={() => removeFromCart(item.product.id)} className="ml-auto text-stone-400 hover:text-red-500 transition">
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              {cart.length > 0 && (
                <div className="p-6 border-t border-stone-100">
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-stone-600">Total</span>
                    <span className="text-xl font-bold text-stone-800">${cartTotal.toFixed(2)}</span>
                  </div>
                  <button onClick={handleCheckout} className="w-full bg-gradient-to-r from-amber-700 to-amber-800 text-white py-3.5 rounded-xl font-semibold hover:from-amber-800 hover:to-amber-900 transition-all shadow-lg shadow-amber-200">
                    Proceed to Checkout
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    );
  }

  // Main Store View
  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-amber-100 sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-amber-700 to-amber-900 rounded-xl flex items-center justify-center">
                <span className="text-white text-lg">☕</span>
              </div>
              <div>
                <h1 className="text-xl font-serif font-bold text-stone-800 leading-tight">Ember & Bloom</h1>
                <p className="text-xs text-stone-500 hidden sm:block">Specialty Coffee Roasters</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={() => setView('owner')} className="p-2.5 bg-stone-100 hover:bg-stone-200 rounded-xl transition" title="Owner Dashboard">
                <svg className="w-5 h-5 text-stone-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </button>
              <button onClick={() => setIsCartOpen(true)} className="relative p-2.5 bg-stone-100 hover:bg-stone-200 rounded-xl transition">
                <svg className="w-5 h-5 text-stone-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 100 4 2 2 0 000-4z" />
                </svg>
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-amber-700 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold">{cartCount}</span>
                )}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="max-w-6xl mx-auto px-4 py-12 md:py-16">
          <div className="text-center max-w-2xl mx-auto">
            <h2 className="text-3xl md:text-5xl font-serif font-bold text-stone-800 mb-4 leading-tight">
              Crafted with Passion,<br />Roasted to Perfection
            </h2>
            <p className="text-stone-600 text-lg mb-8">
              Discover our curated selection of single-origin and artisan blend coffees from the world's finest growing regions.
            </p>
          </div>
        </div>
        <div className="absolute top-0 right-0 w-64 h-64 bg-amber-200/30 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-orange-200/30 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />
      </section>

      {/* Search & Filters */}
      <section className="max-w-6xl mx-auto px-4 pb-6">
        <div className="flex flex-col sm:flex-row gap-4 items-stretch sm:items-center">
          <div className="relative flex-1">
            <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-stone-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder="Search by name, origin, or flavor..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-4 py-3 bg-white border border-amber-200 rounded-xl focus:border-amber-400 focus:ring-2 focus:ring-amber-100 outline-none transition text-stone-700 placeholder:text-stone-400"
            />
          </div>
          <div className="flex gap-2 overflow-x-auto pb-1 sm:pb-0">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2.5 rounded-xl text-sm font-medium whitespace-nowrap transition-all ${
                  selectedCategory === cat
                    ? 'bg-amber-800 text-white shadow-md shadow-amber-200'
                    : 'bg-white text-stone-600 border border-amber-200 hover:border-amber-400 hover:text-amber-800'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Products Grid */}
      <section className="max-w-6xl mx-auto px-4 pb-16">
        {filteredProducts.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-5xl mb-4">🔍</div>
            <p className="text-stone-500 text-lg">No coffees found matching your search.</p>
            <button onClick={() => { setSearchQuery(''); setSelectedCategory('All'); }} className="mt-4 text-amber-700 hover:text-amber-800 font-medium">
              Clear filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProducts.map(product => (
              <div
                key={product.id}
                className="group bg-white rounded-2xl shadow-sm border border-amber-100 overflow-hidden hover:shadow-lg hover:shadow-amber-100/50 transition-all duration-300 hover:-translate-y-1"
              >
                <div className="relative aspect-[4/3] overflow-hidden cursor-pointer" onClick={() => setSelectedProduct(product)}>
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  <span className={`absolute top-3 left-3 px-2.5 py-1 rounded-full text-xs font-semibold ${getRoastColor(product.roast)}`}>
                    {product.roast}
                  </span>
                </div>
                <div className="p-5">
                  <div className="flex items-start justify-between mb-1">
                    <span className="text-xs font-medium text-amber-700 uppercase tracking-wider">{product.category}</span>
                    <span className="text-xs text-stone-400">{product.weight}</span>
                  </div>
                  <h3 className="text-lg font-serif font-bold text-stone-800 mb-1 cursor-pointer hover:text-amber-800 transition" onClick={() => setSelectedProduct(product)}>
                    {product.name}
                  </h3>
                  <p className="text-sm text-stone-500 mb-3">{product.origin}</p>
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {product.flavorNotes.slice(0, 3).map(note => (
                      <span key={note} className="px-2 py-0.5 bg-amber-50 text-amber-700 rounded-md text-xs">{note}</span>
                    ))}
                  </div>
                  <div className="flex items-center justify-between pt-3 border-t border-stone-100">
                    <span className="text-xl font-bold text-stone-800">${product.price.toFixed(2)}</span>
                    <button
                      onClick={() => addToCart(product)}
                      className="bg-amber-800 hover:bg-amber-900 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors flex items-center gap-1.5"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                      </svg>
                      Add
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Footer */}
      <footer className="bg-stone-800 text-stone-300 py-12">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-amber-600 to-amber-800 rounded-xl flex items-center justify-center">
                  <span className="text-white text-lg">☕</span>
                </div>
                <h3 className="text-lg font-serif font-bold text-white">Ember & Bloom</h3>
              </div>
              <p className="text-sm text-stone-400 leading-relaxed">
                Specialty coffee roasters dedicated to sourcing and roasting the finest beans from around the world.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-3">Quick Links</h4>
              <ul className="space-y-2 text-sm">
                <li><span className="hover:text-amber-400 cursor-pointer transition">Our Story</span></li>
                <li><span className="hover:text-amber-400 cursor-pointer transition">Brewing Guides</span></li>
                <li><span className="hover:text-amber-400 cursor-pointer transition">Subscription</span></li>
                <li><span className="hover:text-amber-400 cursor-pointer transition">Contact</span></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-3">Stay Connected</h4>
              <p className="text-sm text-stone-400 mb-3">Join our newsletter for brewing tips and new arrivals.</p>
              <div className="flex gap-2">
                <input type="email" placeholder="your@email.com" className="flex-1 px-3 py-2 bg-stone-700 border border-stone-600 rounded-lg text-sm text-white placeholder:text-stone-500 focus:border-amber-500 outline-none" />
                <button className="px-4 py-2 bg-amber-700 hover:bg-amber-600 text-white rounded-lg text-sm font-medium transition">Join</button>
              </div>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-stone-700 text-center text-sm text-stone-500">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-2">
              <span>© 2026 Ember & Bloom Coffee Co. All rights reserved.</span>
              <button onClick={() => setView('owner')} className="text-stone-400 hover:text-amber-400 text-sm transition flex items-center gap-1">
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                Owner Dashboard
              </button>
            </div>
          </div>
        </div>
      </footer>

      {/* Cart Sidebar */}
      {isCartOpen && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={() => setIsCartOpen(false)} />
          <div className="relative w-full max-w-md bg-white shadow-2xl flex flex-col h-full">
            <div className="p-6 border-b border-stone-100 flex items-center justify-between">
              <h2 className="text-xl font-serif font-bold text-stone-800">Your Cart</h2>
              <button onClick={() => setIsCartOpen(false)} className="p-2 hover:bg-stone-100 rounded-lg transition">
                <svg className="w-5 h-5 text-stone-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-6">
              {cart.length === 0 ? (
                <div className="text-center py-12">
                  <div className="text-5xl mb-4">☕</div>
                  <p className="text-stone-500">Your cart is empty</p>
                  <p className="text-sm text-stone-400 mt-1">Add some delicious coffee!</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {cart.map(item => (
                    <div key={item.product.id} className="flex gap-4 p-3 bg-stone-50 rounded-xl">
                      <img src={item.product.image} alt={item.product.name} className="w-16 h-16 rounded-lg object-cover" />
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-semibold text-stone-800 truncate">{item.product.name}</h4>
                        <p className="text-sm text-amber-700 font-medium">${item.product.price.toFixed(2)}</p>
                        <div className="flex items-center gap-2 mt-2">
                          <button onClick={() => updateQuantity(item.product.id, -1)} className="w-7 h-7 rounded-lg bg-white border border-stone-200 flex items-center justify-center text-stone-600 hover:bg-stone-100 transition text-sm font-bold">−</button>
                          <span className="text-sm font-semibold text-stone-800 w-6 text-center">{item.quantity}</span>
                          <button onClick={() => updateQuantity(item.product.id, 1)} className="w-7 h-7 rounded-lg bg-white border border-stone-200 flex items-center justify-center text-stone-600 hover:bg-stone-100 transition text-sm font-bold">+</button>
                          <button onClick={() => removeFromCart(item.product.id)} className="ml-auto text-stone-400 hover:text-red-500 transition p-1">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            {cart.length > 0 && (
              <div className="p-6 border-t border-stone-100">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-stone-600">Total</span>
                  <span className="text-xl font-bold text-stone-800">${cartTotal.toFixed(2)}</span>
                </div>
                <button onClick={handleCheckout} className="w-full bg-gradient-to-r from-amber-700 to-amber-800 text-white py-3.5 rounded-xl font-semibold hover:from-amber-800 hover:to-amber-900 transition-all shadow-lg shadow-amber-200">
                  Proceed to Checkout
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
