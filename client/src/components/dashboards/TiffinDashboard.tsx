import { useContext, useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import {
  Utensils, Plus, TrendingUp, DollarSign, Users, Star,
  Calendar, Clock, Settings, Bell, CheckCircle,
  AlertCircle, Edit2, Eye,
  ChefHat, Award, Package, Mail
} from 'lucide-react';
import { AuthContext } from '@/context/AuthContext';

export default function TiffinProviderDashboard() {
  const [activeTab, setActiveTab] = useState('overview');
  const [showNotifications, setShowNotifications] = useState(false);

  const auth = useContext(AuthContext)

  if (!auth) {
    return null
  }

  const { user, loading } = auth

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/login" />;
  }

  const roleLabels = {
    student: "Student",
    owner: "Property Owner",
    food_service: "Food Service",
  } as const;

  const stats = {
    totalEarnings: 45600,
    monthlyEarnings: 18200,
    activeSubscriptions: 24,
    totalOrders: 156,
    averageRating: 4.8,
    totalReviews: 145,
    pendingOrders: 3,
    completionRate: 98
  };

  const tiffinServices = [
    {
      id: 1,
      name: 'Ghar Ka Khana - Standard',
      cuisine: 'North Indian',
      pricePerMeal: 60,
      subscribers: 18,
      status: 'active',
      rating: 4.8,
      image: 'https://images.unsplash.com/photo-1585937421612-70a008356f36?w=400'
    },
    {
      id: 2,
      name: 'Ghar Ka Khana - Premium',
      cuisine: 'North Indian + Special',
      pricePerMeal: 90,
      subscribers: 6,
      status: 'active',
      rating: 4.9,
      image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400'
    }
  ];

  const recentOrders = [
    { id: 1, customer: 'Rahul Sharma', meal: 'Lunch + Dinner', amount: 120, status: 'delivered', time: 'Today, 1:30 PM' },
    { id: 2, customer: 'Priya Singh', meal: 'Lunch Only', amount: 60, status: 'preparing', time: 'Today, 12:45 PM' },
    { id: 3, customer: 'Amit Kumar', meal: 'Breakfast + Lunch', amount: 110, status: 'pending', time: 'Today, 11:00 AM' },
    { id: 4, customer: 'Neha Gupta', meal: 'Dinner Only', amount: 70, status: 'delivered', time: 'Yesterday, 8:30 PM' },
    { id: 5, customer: 'Vikram Patel', meal: 'Full Day', amount: 180, status: 'delivered', time: 'Yesterday, 2:00 PM' }
  ];

  const subscriptions = [
    { id: 1, customer: 'Rahul Sharma', plan: 'Monthly (All Meals)', amount: 5400, startDate: '2024-01-15', endDate: '2024-02-15', status: 'active' },
    { id: 2, customer: 'Priya Singh', plan: 'Weekly (Lunch + Dinner)', amount: 1800, startDate: '2024-01-20', endDate: '2024-01-27', status: 'active' },
    { id: 3, customer: 'Amit Kumar', plan: 'Monthly (Lunch Only)', amount: 1800, startDate: '2024-01-10', endDate: '2024-02-10', status: 'active' },
    { id: 4, customer: 'Sneha Reddy', plan: 'Weekly (Breakfast)', amount: 600, startDate: '2024-01-22', endDate: '2024-01-29', status: 'expiring' }
  ];

  const reviews = [
    { id: 1, customer: 'Rahul Sharma', rating: 5, comment: 'Amazing home-style food! Reminds me of my mother\'s cooking.', date: '2 days ago', response: 'Thank you so much! Happy to serve you.' },
    { id: 2, customer: 'Priya Singh', rating: 5, comment: 'Very hygienic and tasty. Highly recommended!', date: '5 days ago', response: null },
    { id: 3, customer: 'Amit Kumar', rating: 4, comment: 'Good food but sometimes delivery is late.', date: '1 week ago', response: 'Sorry for the delay. We\'re working on it.' },
    { id: 4, customer: 'Neha Gupta', rating: 5, comment: 'Best tiffin service in the area!', date: '1 week ago', response: 'Thank you for your kind words!' }
  ];

  // const weeklyEarnings = [
  //   { day: 'Mon', amount: 2400 },
  //   { day: 'Tue', amount: 2600 },
  //   { day: 'Wed', amount: 2200 },
  //   { day: 'Thu', amount: 2800 },
  //   { day: 'Fri', amount: 3000 },
  //   { day: 'Sat', amount: 2500 },
  //   { day: 'Sun', amount: 2100 }
  // ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
      case 'delivered':
        return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400';
      case 'pending':
      case 'preparing':
        return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400';
      case 'expiring':
        return 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400';
      case 'cancelled':
        return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400';
      default:
        return 'bg-slate-100 text-slate-700';
    }
  };

  return (
    <div className="min-h-screen pt-20 pb-12 bg-slate-50 dark:bg-slate-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-2">
                Tiffin Provider Dashboard
              </h1>
              <p className="text-lg text-slate-600 dark:text-slate-300">
                Manage your tiffin service and track your earnings
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <Link
                to="/add-tiffin"
                className="flex items-center space-x-2 px-6 py-3 bg-linear-to-r from-orange-600 to-red-600 text-white rounded-xl hover:from-orange-700 hover:to-red-700 transition-all shadow-lg"
              >
                <Plus className="w-5 h-5" />
                <span>Add Tiffin Service</span>
              </Link>

              {/* Notifications */}
              <div className="relative">
                <button
                  onClick={() => setShowNotifications(!showNotifications)}
                  className="relative p-3 bg-white dark:bg-slate-800 rounded-xl shadow-lg hover:shadow-xl transition-shadow"
                >
                  <Bell className="w-6 h-6 text-slate-600 dark:text-slate-300" />
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
                    5
                  </span>
                </button>
              </div>

              <Link
                to="/profile"
                className="p-3 bg-white dark:bg-slate-800 rounded-xl shadow-lg hover:shadow-xl transition-shadow"
              >
                <Settings className="w-6 h-6 text-slate-600 dark:text-slate-300" />
              </Link>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
          

          <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900/30 rounded-xl flex items-center justify-center">
                <Utensils className="w-6 h-6 text-orange-600 dark:text-orange-400" />
              </div>
              <Package className="w-5 h-5 text-blue-500" />
            </div>
            <div className="text-3xl font-bold text-slate-900 dark:text-white">{stats.activeSubscriptions}</div>
            <div className="text-sm text-slate-500 dark:text-slate-400">Active Subscriptions</div>
            <div className="text-xs text-slate-400 mt-1">{stats.pendingOrders} pending orders</div>
          </div>

          <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center">
                <Users className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
              <TrendingUp className="w-5 h-5 text-green-500" />
            </div>
            <div className="text-3xl font-bold text-slate-900 dark:text-white">{stats.totalOrders}</div>
            <div className="text-sm text-slate-500 dark:text-slate-400">Total Orders</div>
            <div className="text-xs text-green-600 dark:text-green-400 mt-1 flex items-center">
              <CheckCircle className="w-3 h-3 mr-1" />
              {stats.completionRate}% completion rate
            </div>
          </div>

          <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-yellow-100 dark:bg-yellow-900/30 rounded-xl flex items-center justify-center">
                <Star className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
              </div>
              <Award className="w-5 h-5 text-yellow-500" />
            </div>
            <div className="text-3xl font-bold text-slate-900 dark:text-white">{stats.averageRating}</div>
            <div className="text-sm text-slate-500 dark:text-slate-400">Average Rating</div>
            <div className="text-xs text-slate-400 mt-1">{stats.totalReviews} reviews</div>
          </div>

          <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-xl flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-green-600 dark:text-green-400" />
              </div>
              <TrendingUp className="w-5 h-5 text-green-500" />
            </div>
            <div className="text-sm text-slate-500 dark:text-slate-400">Monthly Earnings</div>
            <div className="text-3xl font-bold text-slate-900 dark:text-white">
              ₹{stats.monthlyEarnings.toLocaleString()}
            </div>
            <div className="text-xs text-green-600 dark:text-green-400 mt-1 flex items-center">
              <TrendingUp className="w-3 h-3 mr-1" />
              +12% from last month
            </div>
          </div>

        </div>

        

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Tabs & Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Tab Navigation */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl p-2 shadow-lg">
              <div className="flex space-x-2 overflow-x-auto">
                {[
                  { id: 'overview', label: 'Overview', icon: TrendingUp },
                  { id: 'orders', label: 'Orders', icon: Package },
                  { id: 'subscriptions', label: 'Subscriptions', icon: Calendar },
                  { id: 'reviews', label: 'Reviews', icon: Star }
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex-1 flex items-center justify-center space-x-2 px-4 py-3 rounded-xl font-medium transition-all whitespace-nowrap ${activeTab === tab.id
                      ? 'bg-orange-600 text-white'
                      : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'
                      }`}
                  >
                    <tab.icon className="w-5 h-5" />
                    <span className="hidden sm:inline">{tab.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Tab Content */}
            {activeTab === 'overview' && (
              <div className="space-y-8">
                {/* My Tiffin Services */}
                <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-lg">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold text-slate-900 dark:text-white">My Tiffin Services</h2>
                    <Link to="/add-tiffin" className="text-sm text-orange-600 dark:text-orange-400 font-medium hover:text-orange-700">
                      Add New
                    </Link>
                  </div>
                  <div className="space-y-4">
                    {tiffinServices.map((service) => (
                      <div key={service.id} className="flex items-center space-x-4 p-4 bg-slate-50 dark:bg-slate-700/50 rounded-xl">
                        <img
                          src={service.image}
                          alt={service.name}
                          className="w-20 h-20 object-cover rounded-lg shrink-0"
                        />
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-1">
                            <h3 className="font-semibold text-slate-900 dark:text-white">{service.name}</h3>
                            <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getStatusColor(service.status)}`}>
                              {service.status}
                            </span>
                          </div>
                          <p className="text-sm text-slate-500 dark:text-slate-400">{service.cuisine}</p>
                          <div className="flex items-center justify-between mt-2">
                            <div className="flex items-center space-x-4 text-sm">
                              <span className="text-orange-600 dark:text-orange-400 font-semibold">
                                ₹{service.pricePerMeal}/meal
                              </span>
                              <span className="text-slate-500 dark:text-slate-400">
                                {service.subscribers} subscribers
                              </span>
                              <div className="flex items-center">
                                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                                <span className="ml-1">{service.rating}</span>
                              </div>
                            </div>
                            <div className="flex items-center space-x-2">
                              <button className="p-2 text-slate-400 hover:text-blue-600 transition-colors">
                                <Eye className="w-4 h-4" />
                              </button>
                              <button className="p-2 text-slate-400 hover:text-green-600 transition-colors">
                                <Edit2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Weekly Earnings Chart
                <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-lg">
                  <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6">Weekly Earnings</h2>
                  <div className="flex items-end justify-between space-x-2 h-48">
                    {weeklyEarnings.map((day, index) => {
                      const maxAmount = Math.max(...weeklyEarnings.map(d => d.amount));
                      const height = (day.amount / maxAmount) * 100;
                      return (
                        <div key={index} className="flex-1 flex flex-col items-center">
                          <div
                            className="w-full bg-linear-to-t from-orange-500 to-red-500 rounded-t-lg transition-all hover:from-orange-600 hover:to-red-600"
                            style={{ height: `${height}%` }}
                          />
                          <span className="text-xs text-slate-500 dark:text-slate-400 mt-2">{day.day}</span>
                          <span className="text-xs font-medium text-slate-700 dark:text-slate-300">
                            ₹{(day.amount / 100).toFixed(0)}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div> */}

                {/* Recent Orders */}
                <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-lg">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold text-slate-900 dark:text-white">Recent Orders</h2>
                    <Link to="/orders" className="text-sm text-orange-600 dark:text-orange-400 font-medium hover:text-orange-700">
                      View all
                    </Link>
                  </div>
                  <div className="space-y-3">
                    {recentOrders.slice(0, 5).map((order) => (
                      <div key={order.id} className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-700/50 rounded-xl">
                        <div className="flex items-center space-x-4">
                          <div className="w-10 h-10 bg-orange-100 dark:bg-orange-900/30 rounded-full flex items-center justify-center">
                            <Utensils className="w-5 h-5 text-orange-600 dark:text-orange-400" />
                          </div>
                          <div>
                            <h4 className="font-medium text-slate-900 dark:text-white">{order.customer}</h4>
                            <p className="text-sm text-slate-500 dark:text-slate-400">{order.meal} • {order.time}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-bold text-slate-900 dark:text-white">₹{order.amount}</div>
                          <span className={`text-xs px-2 py-1 rounded-full font-medium capitalize ${getStatusColor(order.status)}`}>
                            {order.status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'orders' && (
              <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-lg">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-slate-900 dark:text-white">All Orders</h2>
                  <div className="flex space-x-2">
                    <select className="px-4 py-2 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg text-sm">
                      <option>All Status</option>
                      <option>Pending</option>
                      <option>Preparing</option>
                      <option>Delivered</option>
                    </select>
                    <select className="px-4 py-2 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg text-sm">
                      <option>Today</option>
                      <option>This Week</option>
                      <option>This Month</option>
                    </select>
                  </div>
                </div>
                <div className="space-y-3">
                  {recentOrders.map((order) => (
                    <div key={order.id} className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-700/50 rounded-xl">
                      <div className="flex items-center space-x-4">
                        <div className="w-10 h-10 bg-orange-100 dark:bg-orange-900/30 rounded-full flex items-center justify-center">
                          <Utensils className="w-5 h-5 text-orange-600 dark:text-orange-400" />
                        </div>
                        <div>
                          <h4 className="font-medium text-slate-900 dark:text-white">{order.customer}</h4>
                          <p className="text-sm text-slate-500 dark:text-slate-400">{order.meal} • {order.time}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">
                        <div className="text-right">
                          <div className="font-bold text-slate-900 dark:text-white">₹{order.amount}</div>
                          <span className={`text-xs px-2 py-1 rounded-full font-medium capitalize ${getStatusColor(order.status)}`}>
                            {order.status}
                          </span>
                        </div>
                        {order.status === 'pending' && (
                          <button className="px-4 py-2 bg-orange-600 text-white rounded-lg text-sm hover:bg-orange-700 transition-colors">
                            Accept
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'subscriptions' && (
              <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-lg">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-slate-900 dark:text-white">Active Subscriptions</h2>
                  <span className="text-sm text-slate-500 dark:text-slate-400">{subscriptions.length} total</span>
                </div>
                <div className="space-y-4">
                  {subscriptions.map((sub) => (
                    <div key={sub.id} className="p-4 bg-slate-50 dark:bg-slate-700/50 rounded-xl">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h3 className="font-semibold text-slate-900 dark:text-white">{sub.customer}</h3>
                          <p className="text-sm text-slate-500 dark:text-slate-400">{sub.plan}</p>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium capitalize ${getStatusColor(sub.status)}`}>
                          {sub.status}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center space-x-4 text-slate-500 dark:text-slate-400">
                          <span className="flex items-center">
                            <Calendar className="w-4 h-4 mr-1" />
                            {sub.startDate} to {sub.endDate}
                          </span>
                        </div>
                        <div className="font-bold text-orange-600 dark:text-orange-400">₹{sub.amount.toLocaleString()}/month</div>
                      </div>
                      {sub.status === 'expiring' && (
                        <div className="mt-3 p-3 bg-orange-50 dark:bg-orange-900/20 rounded-lg flex items-center space-x-2">
                          <AlertCircle className="w-4 h-4 text-orange-600 dark:text-orange-400" />
                          <span className="text-sm text-orange-700 dark:text-orange-300">Subscription expiring soon. Send renewal reminder.</span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'reviews' && (
              <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-lg">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-slate-900 dark:text-white">Customer Reviews</h2>
                  <div className="flex items-center space-x-2">
                    <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                    <span className="font-bold text-slate-900 dark:text-white">{stats.averageRating}</span>
                    <span className="text-slate-500 dark:text-slate-400">({stats.totalReviews} reviews)</span>
                  </div>
                </div>
                <div className="space-y-6">
                  {reviews.map((review) => (
                    <div key={review.id} className="p-4 bg-slate-50 dark:bg-slate-700/50 rounded-xl">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-linear-to-br from-orange-400 to-red-500 rounded-full flex items-center justify-center text-white font-bold">
                            {review.customer.charAt(0)}
                          </div>
                          <div>
                            <h4 className="font-semibold text-slate-900 dark:text-white">{review.customer}</h4>
                            <p className="text-xs text-slate-500 dark:text-slate-400">{review.date}</p>
                          </div>
                        </div>
                        <div className="flex items-center">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`w-4 h-4 ${i < review.rating
                                ? 'fill-yellow-400 text-yellow-400'
                                : 'text-slate-300 dark:text-slate-600'
                                }`}
                            />
                          ))}
                        </div>
                      </div>
                      <p className="text-slate-600 dark:text-slate-300 mb-3">{review.comment}</p>
                      {review.response && (
                        <div className="p-3 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
                          <p className="text-sm text-orange-800 dark:text-orange-300">
                            <span className="font-semibold">Your response:</span> {review.response}
                          </p>
                        </div>
                      )}
                      {!review.response && (
                        <button className="text-sm text-orange-600 dark:text-orange-400 font-medium hover:text-orange-700">
                          Respond to review
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Column - Profile & Quick Info */}
          <div className="space-y-8">
            {/* Profile Card */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-lg">
              <div className="text-center mb-6">
                <div className="w-24 h-24 bg-linear-to-br from-orange-400 to-red-500 rounded-2xl flex items-center justify-center text-white text-4xl font-bold mx-auto mb-4">
                  {user.fullname?.charAt(0).toUpperCase() || 'U'}
                </div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white">{user.fullname}</h3>
                <p className="text-slate-500 dark:text-slate-400">
                  {roleLabels[user.role]}</p>
                {/* <div className="flex items-center justify-center mt-2 space-x-2">
                  {user.verificationStatus === 'verified' && (
                    <span className="inline-flex items-center px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-full text-sm font-medium">
                      <CheckCircle className="w-3 h-3 mr-1" />
                      Verified
                    </span>
                  )}
                </div> */}
              </div>

              <div className="space-y-3 pt-4 border-t border-slate-200 dark:border-slate-700">
                <div className="flex items-center space-x-3 text-slate-600 dark:text-slate-300">
                  <Utensils className="w-5 h-5 text-slate-400" />
                  <span className="text-sm">
                    {user.location?.city || user.location?.state ? `${user.location?.city ?? ""}
                    ${user.location?.city && user.location?.state ? ", " : ""}
                    ${user.location?.state ?? ""}`
                      : "Location not added"}
                  </span>                </div>
                <div className="flex items-center space-x-3 text-slate-600 dark:text-slate-300">
                  <Mail className="w-5 h-5 text-slate-400" />
                  <span className="text-sm">{user.email}</span>
                </div>
                <div className="flex items-center space-x-3 text-slate-600 dark:text-slate-300">
                  <Clock className="w-5 h-5 text-slate-400" />
                  <span className="text-sm">Member since {user.createdAt.toString()}</span>
                </div>
              </div>

              <Link
                to="/profile"
                className="mt-6 w-full py-3 bg-orange-600 text-white rounded-xl font-medium hover:bg-orange-700 transition-colors flex items-center justify-center space-x-2"
              >
                <Settings className="w-5 h-5" />
                <span>Edit Profile</span>
              </Link>
            </div>

            {/* Quick Stats */}
            <div className="bg-linear-to-br from-orange-600 to-red-600 rounded-2xl p-6 shadow-lg text-white">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                  <TrendingUp className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold">Performance</h3>
              </div>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-orange-100">Order Completion</span>
                  <span className="font-bold">{stats.completionRate}%</span>
                </div>
                <div className="w-full bg-white/20 rounded-full h-2">
                  <div className="bg-white rounded-full h-2" style={{ width: `${stats.completionRate}%` }} />
                </div>

                <div className="flex items-center justify-between pt-2">
                  <span className="text-orange-100">Response Time</span>
                  <span className="font-bold">&lt; 2 hrs</span>
                </div>

                <div className="flex items-center justify-between pt-2">
                  <span className="text-orange-100">Customer Retention</span>
                  <span className="font-bold">85%</span>
                </div>
              </div>
            </div>

            {/* Tips Card */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-lg">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center">
                  <ChefHat className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">Pro Tips</h3>
              </div>
              <ul className="space-y-3 text-slate-600 dark:text-slate-300 text-sm">
                <li className="flex items-start space-x-2">
                  <CheckCircle className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
                  <span>Update your menu weekly to keep customers interested</span>
                </li>
                <li className="flex items-start space-x-2">
                  <CheckCircle className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
                  <span>Respond to reviews within 24 hours</span>
                </li>
                <li className="flex items-start space-x-2">
                  <CheckCircle className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
                  <span>Offer discounts for monthly subscriptions</span>
                </li>
                <li className="flex items-start space-x-2">
                  <CheckCircle className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
                  <span>Maintain hygiene standards for better ratings</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
