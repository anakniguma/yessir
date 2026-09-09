import { useState } from 'react';
import { Order } from '../data/admin';
import { mockOrders, weeklySales, monthlyRevenue, topProducts } from '../data/admin';
import { products as initialProducts } from '../data/products';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, PieChart, Pie, Cell
} from 'recharts';

type AdminPage = 'overview' | 'orders' | 'products' | 'analytics';

interface AdminDashboardProps {
  onBackToStore: () => void;
}

export default function AdminDashboard({ onBackToStore }: AdminDashboardProps) {
  const [currentPage, setCurrentPage] = useState<AdminPage>('overview');
  const [orders, setOrders] = useState<Order[]>(mockOrders);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const totalRevenue = orders.reduce((sum, o) => sum + o.total, 0);
  const pendingOrders = orders.filter(o => o.status === 'pending').length;
  const totalOrders = orders.length;
  const avgOrderValue = totalRevenue / totalOrders;

  const statusColors: Record<string, string> = {
    pending: 'bg-yellow-100 text-yellow-800',
    processing: 'bg-blue-100 text-blue-800',
    shipped: 'bg-purple-100 text-purple-800',
    delivered: 'bg-green-100 text-green-800'
  };

  const updateOrderStatus = (orderId: string, newStatus: Order['status']) => {
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
    if (selectedOrder?.id === orderId) {
      setSelectedOrder({ ...selectedOrder, status: newStatus });
    }
  };

  const CHART_COLORS = ['#92400e', '#b45309', '#d97706', '#f59e0b', '#fbbf24', '#fcd34d'];

  const navItems: { id: AdminPage; label: string; icon: string }[] = [
    { id: 'overview', label: 'Overview', icon: '📊' },
    { id: 'orders', label: 'Orders', icon: '📦' },
    { id: 'products', label: 'Products', icon: '☕' },
    { id: 'analytics', label: 'Analytics', icon: '📈' },
  ];

  const renderContent = () => {
    switch (currentPage) {
      case 'overview':
        return <OverviewPage />;
      case 'orders':
        return <OrdersPage />;
      case 'products':
        return <ProductsPage />;
      case 'analytics':
        return <AnalyticsPage />;
    }
  };

  // Overview Page
  function OverviewPage() {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-serif font-bold text-stone-800">Welcome back, Owner</h2>
          <p className="text-stone-500 mt-1">Here's what's happening with your store today.</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard title="Total Revenue" value={`$${totalRevenue.toFixed(2)}`} change="+12.5%" positive icon="💰" />
          <StatCard title="Total Orders" value={totalOrders.toString()} change="+8.2%" positive icon="📦" />
          <StatCard title="Pending Orders" value={pendingOrders.toString()} change="" positive icon="⏳" />
          <StatCard title="Avg. Order Value" value={`$${avgOrderValue.toFixed(2)}`} change="+3.1%" positive icon="📊" />
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-2xl p-6 border border-amber-100 shadow-sm">
            <h3 className="font-serif font-bold text-stone-800 mb-4">Weekly Revenue</h3>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={weeklySales}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f5f0e8" />
                <XAxis dataKey="day" tick={{ fill: '#78716c', fontSize: 12 }} />
                <YAxis tick={{ fill: '#78716c', fontSize: 12 }} />
                <Tooltip contentStyle={{ borderRadius: '12px', border: '1px solid #fde68a' }} />
                <Bar dataKey="revenue" fill="#92400e" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-amber-100 shadow-sm">
            <h3 className="font-serif font-bold text-stone-800 mb-4">Revenue Trend</h3>
            <ResponsiveContainer width="100%" height={220}>
              <LineChart data={monthlyRevenue}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f5f0e8" />
                <XAxis dataKey="month" tick={{ fill: '#78716c', fontSize: 12 }} />
                <YAxis tick={{ fill: '#78716c', fontSize: 12 }} />
                <Tooltip contentStyle={{ borderRadius: '12px', border: '1px solid #fde68a' }} />
                <Line type="monotone" dataKey="revenue" stroke="#92400e" strokeWidth={3} dot={{ fill: '#b45309', r: 5 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recent Orders */}
        <div className="bg-white rounded-2xl p-6 border border-amber-100 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-serif font-bold text-stone-800">Recent Orders</h3>
            <button onClick={() => setCurrentPage('orders')} className="text-sm text-amber-700 hover:text-amber-800 font-medium">
              View all →
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left text-xs font-medium text-stone-500 uppercase tracking-wider border-b border-stone-100">
                  <th className="pb-3 pr-4">Order</th>
                  <th className="pb-3 pr-4">Customer</th>
                  <th className="pb-3 pr-4 hidden sm:table-cell">Date</th>
                  <th className="pb-3 pr-4">Total</th>
                  <th className="pb-3">Status</th>
                </tr>
              </thead>
              <tbody>
                {orders.slice(0, 4).map(order => (
                  <tr key={order.id} className="border-b border-stone-50 last:border-0">
                    <td className="py-3 pr-4 font-medium text-stone-800 text-sm">{order.id}</td>
                    <td className="py-3 pr-4 text-sm text-stone-600">{order.customerName}</td>
                    <td className="py-3 pr-4 text-sm text-stone-500 hidden sm:table-cell">{order.date}</td>
                    <td className="py-3 pr-4 text-sm font-semibold text-stone-800">${order.total.toFixed(2)}</td>
                    <td className="py-3">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${statusColors[order.status]}`}>
                        {order.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  }

  // Orders Page
  function OrdersPage() {
    const [filter, setFilter] = useState<string>('all');
    const filtered = filter === 'all' ? orders : orders.filter(o => o.status === filter);

    return (
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 className="text-2xl font-serif font-bold text-stone-800">Orders</h2>
            <p className="text-stone-500 mt-1">Manage and track customer orders.</p>
          </div>
          <div className="flex gap-2 overflow-x-auto">
            {['all', 'pending', 'processing', 'shipped', 'delivered'].map(status => (
              <button
                key={status}
                onClick={() => setFilter(status)}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium whitespace-nowrap transition ${
                  filter === status
                    ? 'bg-amber-800 text-white'
                    : 'bg-white text-stone-600 border border-amber-200 hover:border-amber-400'
                }`}
              >
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Order Detail Modal */}
        {selectedOrder && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={() => setSelectedOrder(null)} />
            <div className="relative bg-white rounded-2xl shadow-xl max-w-lg w-full p-6 max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-serif font-bold text-stone-800">Order {selectedOrder.id}</h3>
                <button onClick={() => setSelectedOrder(null)} className="p-2 hover:bg-stone-100 rounded-lg">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-stone-500">Customer</p>
                  <p className="font-medium text-stone-800">{selectedOrder.customerName}</p>
                  <p className="text-sm text-stone-500">{selectedOrder.customerEmail}</p>
                </div>
                <div>
                  <p className="text-sm text-stone-500">Shipping Address</p>
                  <p className="text-sm text-stone-700">{selectedOrder.address}</p>
                </div>
                <div>
                  <p className="text-sm text-stone-500 mb-2">Items</p>
                  {selectedOrder.items.map((item: { productName: string; quantity: number; price: number }, i: number) => (
                    <div key={i} className="flex justify-between text-sm py-1">
                      <span className="text-stone-700">{item.productName} × {item.quantity}</span>
                      <span className="font-medium text-stone-800">${(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                  ))}
                  <div className="flex justify-between font-bold text-stone-800 pt-2 border-t border-stone-100 mt-2">
                    <span>Total</span>
                    <span>${selectedOrder.total.toFixed(2)}</span>
                  </div>
                </div>
                <div>
                  <p className="text-sm text-stone-500 mb-2">Update Status</p>
                  <div className="flex flex-wrap gap-2">
                    {(['pending', 'processing', 'shipped', 'delivered'] as const).map(status => (
                      <button
                        key={status}
                        onClick={() => updateOrderStatus(selectedOrder.id, status)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                          selectedOrder.status === status
                            ? 'bg-amber-800 text-white ring-2 ring-amber-300'
                            : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                        }`}
                      >
                        {status}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Orders List */}
        <div className="bg-white rounded-2xl border border-amber-100 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left text-xs font-medium text-stone-500 uppercase tracking-wider bg-stone-50 border-b border-stone-100">
                  <th className="px-4 py-3">Order ID</th>
                  <th className="px-4 py-3">Customer</th>
                  <th className="px-4 py-3 hidden md:table-cell">Items</th>
                  <th className="px-4 py-3 hidden sm:table-cell">Date</th>
                  <th className="px-4 py-3">Total</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Action</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(order => (
                  <tr key={order.id} className="border-b border-stone-50 hover:bg-amber-50/30 transition">
                    <td className="px-4 py-3 font-medium text-stone-800 text-sm">{order.id}</td>
                    <td className="px-4 py-3">
                      <p className="text-sm font-medium text-stone-800">{order.customerName}</p>
                      <p className="text-xs text-stone-500">{order.customerEmail}</p>
                    </td>
                    <td className="px-4 py-3 text-sm text-stone-600 hidden md:table-cell">
                      {order.items.reduce((s: number, i: { quantity: number }) => s + i.quantity, 0)} items
                    </td>
                    <td className="px-4 py-3 text-sm text-stone-500 hidden sm:table-cell">{order.date}</td>
                    <td className="px-4 py-3 text-sm font-semibold text-stone-800">${order.total.toFixed(2)}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${statusColors[order.status]}`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <button onClick={() => setSelectedOrder(order)} className="text-amber-700 hover:text-amber-800 text-sm font-medium">
                        View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {filtered.length === 0 && (
            <div className="text-center py-12 text-stone-500">
              No orders found with this filter.
            </div>
          )}
        </div>
      </div>
    );
  }

  // Products Page
  function ProductsPage() {
    return (
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 className="text-2xl font-serif font-bold text-stone-800">Products</h2>
            <p className="text-stone-500 mt-1">Manage your coffee inventory.</p>
          </div>
          <button className="bg-amber-800 hover:bg-amber-900 text-white px-5 py-2.5 rounded-xl font-semibold transition flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Add Product
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {initialProducts.map(product => (
            <div key={product.id} className="bg-white rounded-2xl border border-amber-100 shadow-sm overflow-hidden hover:shadow-md transition">
              <div className="aspect-[3/2] overflow-hidden">
                <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
              </div>
              <div className="p-4">
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="font-serif font-bold text-stone-800">{product.name}</h4>
                    <p className="text-sm text-stone-500">{product.origin} · {product.category}</p>
                  </div>
                  <span className="text-lg font-bold text-amber-800">${product.price.toFixed(2)}</span>
                </div>
                <div className="flex items-center justify-between mt-3 pt-3 border-t border-stone-100">
                  <span className="text-xs text-stone-500">{product.weight} · {product.roast} Roast</span>
                  <div className="flex gap-2">
                    <button className="text-xs text-amber-700 hover:text-amber-800 font-medium px-2 py-1 rounded hover:bg-amber-50 transition">Edit</button>
                    <button className="text-xs text-red-600 hover:text-red-700 font-medium px-2 py-1 rounded hover:bg-red-50 transition">Delete</button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Analytics Page
  function AnalyticsPage() {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-serif font-bold text-stone-800">Analytics</h2>
          <p className="text-stone-500 mt-1">Insights into your store performance.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Top Products */}
          <div className="bg-white rounded-2xl p-6 border border-amber-100 shadow-sm">
            <h3 className="font-serif font-bold text-stone-800 mb-4">Top Products by Sales</h3>
            <div className="space-y-3">
              {topProducts.map((product, i) => (
                <div key={product.name} className="flex items-center gap-3">
                  <span className="w-6 h-6 rounded-full bg-amber-100 text-amber-800 text-xs font-bold flex items-center justify-center">
                    {i + 1}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-stone-800 truncate">{product.name}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <div className="flex-1 h-2 bg-stone-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-amber-600 to-amber-400 rounded-full"
                          style={{ width: `${(product.sold / topProducts[0].sold) * 100}%` }}
                        />
                      </div>
                      <span className="text-xs text-stone-500 whitespace-nowrap">{product.sold} sold</span>
                    </div>
                  </div>
                  <span className="text-sm font-semibold text-stone-700">${product.revenue.toLocaleString()}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Product Distribution */}
          <div className="bg-white rounded-2xl p-6 border border-amber-100 shadow-sm">
            <h3 className="font-serif font-bold text-stone-800 mb-4">Sales Distribution</h3>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={topProducts}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  dataKey="sold"
                  nameKey="name"
                  label={({ name, percent }) => `${name.split(' ')[0]} ${(percent * 100).toFixed(0)}%`}
                  labelLine={false}
                >
                  {topProducts.map((_, i) => (
                    <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ borderRadius: '12px', border: '1px solid #fde68a' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Weekly Orders */}
          <div className="bg-white rounded-2xl p-6 border border-amber-100 shadow-sm">
            <h3 className="font-serif font-bold text-stone-800 mb-4">Weekly Orders</h3>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={weeklySales}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f5f0e8" />
                <XAxis dataKey="day" tick={{ fill: '#78716c', fontSize: 12 }} />
                <YAxis tick={{ fill: '#78716c', fontSize: 12 }} />
                <Tooltip contentStyle={{ borderRadius: '12px', border: '1px solid #fde68a' }} />
                <Bar dataKey="orders" fill="#b45309" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Key Metrics */}
          <div className="bg-white rounded-2xl p-6 border border-amber-100 shadow-sm">
            <h3 className="font-serif font-bold text-stone-800 mb-4">Key Metrics</h3>
            <div className="space-y-4">
              <MetricRow label="Total Revenue (6 months)" value="$33,500" />
              <MetricRow label="Total Orders (6 months)" value="1,247" />
              <MetricRow label="Average Order Value" value="$26.86" />
              <MetricRow label="Return Customer Rate" value="34%" />
              <MetricRow label="Most Popular Roast" value="Medium" />
              <MetricRow label="Top Origin" value="Ethiopia" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  function StatCard({ title, value, change, positive, icon }: { title: string; value: string; change: string; positive: boolean; icon: string }) {
    return (
      <div className="bg-white rounded-2xl p-5 border border-amber-100 shadow-sm">
        <div className="flex items-center justify-between mb-2">
          <span className="text-2xl">{icon}</span>
          {change && (
            <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${positive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
              {change}
            </span>
          )}
        </div>
        <p className="text-2xl font-bold text-stone-800">{value}</p>
        <p className="text-sm text-stone-500 mt-1">{title}</p>
      </div>
    );
  }

  function MetricRow({ label, value }: { label: string; value: string }) {
    return (
      <div className="flex justify-between items-center py-2 border-b border-stone-100 last:border-0">
        <span className="text-sm text-stone-600">{label}</span>
        <span className="text-sm font-semibold text-stone-800">{value}</span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 flex">
      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/30 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <aside className={`fixed lg:sticky top-0 left-0 h-full w-64 bg-white border-r border-amber-100 z-50 transform transition-transform duration-300 ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
      }`}>
        <div className="p-6">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 bg-gradient-to-br from-amber-700 to-amber-900 rounded-xl flex items-center justify-center">
              <span className="text-white text-lg">☕</span>
            </div>
            <div>
              <h1 className="text-lg font-serif font-bold text-stone-800 leading-tight">Ember & Bloom</h1>
              <p className="text-xs text-stone-500">Owner Dashboard</p>
            </div>
          </div>

          <nav className="space-y-1">
            {navItems.map(item => (
              <button
                key={item.id}
                onClick={() => { setCurrentPage(item.id); setSidebarOpen(false); }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition ${
                  currentPage === item.id
                    ? 'bg-amber-100 text-amber-900 font-semibold'
                    : 'text-stone-600 hover:bg-stone-50 hover:text-stone-800'
                }`}
              >
                <span className="text-lg">{item.icon}</span>
                <span>{item.label}</span>
              </button>
            ))}
          </nav>
        </div>

        <div className="absolute bottom-0 left-0 right-0 p-6 border-t border-stone-100">
          <button
            onClick={onBackToStore}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-stone-600 hover:bg-stone-50 hover:text-stone-800 transition"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            <span>Back to Store</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 min-w-0">
        {/* Top Bar */}
        <header className="bg-white/80 backdrop-blur-md border-b border-amber-100 sticky top-0 z-30">
          <div className="px-4 md:px-8 py-4 flex items-center justify-between">
            <button onClick={() => setSidebarOpen(true)} className="lg:hidden p-2 hover:bg-stone-100 rounded-lg">
              <svg className="w-5 h-5 text-stone-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <div className="flex items-center gap-3 ml-auto">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-medium text-stone-800">Coffee Owner</p>
                <p className="text-xs text-stone-500">admin@emberbloom.co</p>
              </div>
              <div className="w-10 h-10 bg-gradient-to-br from-amber-200 to-amber-400 rounded-full flex items-center justify-center text-amber-900 font-bold text-sm">
                CO
              </div>
            </div>
          </div>
        </header>

        <div className="p-4 md:p-8">
          {renderContent()}
        </div>
      </main>
    </div>
  );
}
