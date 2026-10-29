import { useContext, useState, useEffect } from 'react';
import { Link, Navigate } from 'react-router-dom';
import {
  Utensils, Plus, TrendingUp, DollarSign, Users, Star,
  Calendar, Clock, Settings, Bell, CheckCircle,
  Edit2, Eye, Trash2,
  ChefHat, Award, Package, Mail, MapPin, Loader2,
  AlertCircle, Sparkles
} from 'lucide-react';
import { AuthContext } from '@/context/AuthContext';
import { deleteTiffin, getTiffins, toggleTiffinAvailability } from '@/api/tiffin';
import { TiffinService } from '@/types';


// // Interface matching your Tiffin schema
// interface TiffinService {
//   _id: string;
//   name: string;
//   description: string;
//   foodType: "veg" | "non-veg" | "jain" | "vegan";
//   cuisine?: string[];
//   thumbnail: string;
//   pricing: {
//     lunch?: { singleMeal?: number; weekly?: number; monthly?: number };
//     dinner?: { singleMeal?: number; weekly?: number; monthly?: number };
//     combo?: { singleMeal?: number; weekly?: number; monthly?: number };
//   };
//   address?: {
//     city?: string;
//     state?: string;
//     area?: string;
//   };
//   rating?: number;
//   reviewsCount?: number;
//   isAvailable: boolean;
//   createdAt: string;
// }

export default function TiffinProviderDashboard() {
  const [activeTab, setActiveTab] = useState('overview');
  const [showNotifications, setShowNotifications] = useState(false);
  const [tiffins, setTiffins] = useState<TiffinService[]>([]);
  const [loadingTiffins, setLoadingTiffins] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [togglingId, setTogglingId] = useState<string | null>(null);

  const auth = useContext(AuthContext);

  if (!auth) return null;
  const { user, loading } = auth;

  // ✅ Fetch tiffins from database
  useEffect(() => {
    if (user) fetchMyTiffins();
  }, [user]);

  const fetchMyTiffins = async () => {
    try {
      setLoadingTiffins(true);
      const response = await getTiffins()
      const data = response.data?.data || response.data || [];
      setTiffins(data);
    } catch (error) {
      console.error("Error fetching tiffins:", error);
    } finally {
      setLoadingTiffins(false);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!window.confirm(`Are you sure you want to delete "${name}"?`)) return;

    try {
      setDeletingId(id);
      await deleteTiffin(id);
      setTiffins(current => current.filter(tiffin => tiffin._id !== id));
      alert("Tiffin deleted successfully");
    } catch (error: any) {
      alert(error.response?.data?.message || "Failed to delete tiffin");
    } finally {
      setDeletingId(null);
    }
  };

  const toggleAvailability = async (id: string, currentStatus: boolean) => {
    try {
      setTogglingId(id);
      const response = await toggleTiffinAvailability(id, !currentStatus);
      const updatedStatus = response.data?.data?.isAvailable ?? !currentStatus;
      setTiffins(current => current.map(tiffin =>
        tiffin._id === id ? { ...tiffin, isAvailable: updatedStatus } : tiffin
      ));
    } catch (error: any) {
      alert(error.response?.data?.message || "Failed to update status");
    } finally {
      setTogglingId(null);
    }
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <Loader2 className="w-8 h-8 text-orange-500 animate-spin" />
    </div>
  );

  if (!user) return <Navigate to="/login" />;

  const roleLabels = {
    student: "Student",
    owner: "Property Owner",
    food_service: "Tiffin Provider",
  } as const;

  // ✅ Real calculated stats from actual data
  const stats = {
    totalTiffins: tiffins.length,
    activeTiffins: tiffins.filter(t => t.isAvailable).length,
    averageRating: tiffins.length > 0
      ? (tiffins.reduce((sum, t) => sum + (t.rating || 0), 0) / tiffins.length).toFixed(1)
      : "0.0",
    totalReviews: tiffins.reduce((sum, t) => sum + (t.reviewsCount || 0), 0),
    estimatedMonthlyEarnings: tiffins.reduce((sum, t) => {
      const monthlyPrice = t.pricing?.pricePerMeal || t.pricing?.pricePerMeal || 0;
      return sum + (monthlyPrice * 5); // Estimated 5 subscribers per tiffin
    }, 0),
  };

  const getStatusColor = (status: boolean) =>
    status
      ? 'bg-green-100 text-green-700 border-green-200'
      : 'bg-red-100 text-red-700 border-red-200';

  const getFoodTypeBadge = (type: string) => {
    switch (type) {
      case "veg": return "🟢";
      case "non-veg": return "🔴";
      case "jain": return "🟡";
      case "vegan": return "🌱";
      default: return "🍽️";
    }
  };

  const getStartingPrice = (tiffin: TiffinService) => {
    const prices = [
      tiffin.pricing?.pricePerMeal,
      tiffin.pricing?.pricePerMeal,
      tiffin.pricing?.pricePerMeal,
    ].filter(Boolean) as number[];
    return prices.length > 0 ? Math.min(...prices) : 0;
  };

  return (
    <div className="min-h-screen pt-20 pb-12 bg-slate-50 dark:bg-slate-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Sparkles className="w-6 h-6 text-orange-500" />
                <h1 className="text-4xl font-extrabold bg-linear-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
                  Provider Dashboard
                </h1>
              </div>
              <p className="text-lg text-slate-600 dark:text-slate-300">
                Welcome back, <span className="font-semibold text-slate-900 dark:text-white">{user.fullname}</span>! 👋
              </p>
            </div>
            
            <div className="flex items-center space-x-3">
              <Link
                to="/add-tiffin"
                className="flex items-center space-x-2 px-6 py-3 bg-linear-to-r from-orange-600 to-red-600 text-white rounded-xl hover:shadow-xl hover:shadow-orange-500/30 transition-all font-semibold"
              >
                <Plus className="w-5 h-5" />
                <span>Add Tiffin</span>
              </Link>

              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative p-3 bg-white dark:bg-slate-800 rounded-xl shadow-lg hover:shadow-xl transition-shadow"
              >
                <Bell className="w-5 h-5 text-slate-600 dark:text-slate-300" />
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                  3
                </span>
              </button>

              <Link to="/profile" className="p-3 bg-white dark:bg-slate-800 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
                <Settings className="w-5 h-5 text-slate-600 dark:text-slate-300" />
              </Link>
            </div>
          </div>
        </div>

        {/* ✅ Real Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mb-8">
          
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900/30 rounded-xl flex items-center justify-center">
                <Utensils className="w-6 h-6 text-orange-600 dark:text-orange-400" />
              </div>
              <Package className="w-5 h-5 text-blue-500" />
            </div>
            <div className="text-3xl font-bold text-slate-900 dark:text-white">{stats.totalTiffins}</div>
            <div className="text-sm text-slate-500 dark:text-slate-400">Total Tiffins</div>
            <div className="text-xs text-green-600 mt-1">{stats.activeTiffins} active</div>
          </div>

          <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center">
                <Users className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
              <TrendingUp className="w-5 h-5 text-green-500" />
            </div>
            <div className="text-3xl font-bold text-slate-900 dark:text-white">{stats.totalReviews}</div>
            <div className="text-sm text-slate-500 dark:text-slate-400">Total Reviews</div>
            <div className="text-xs text-slate-400 mt-1 flex items-center">
              <CheckCircle className="w-3 h-3 mr-1" />
              Across all tiffins
            </div>
          </div>

          <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-yellow-100 dark:bg-yellow-900/30 rounded-xl flex items-center justify-center">
                <Star className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
              </div>
              <Award className="w-5 h-5 text-yellow-500" />
            </div>
            <div className="text-3xl font-bold text-slate-900 dark:text-white">{stats.averageRating}</div>
            <div className="text-sm text-slate-500 dark:text-slate-400">Average Rating</div>
            <div className="text-xs text-yellow-600 mt-1 flex items-center">
              <Star className="w-3 h-3 mr-1 fill-current" />
              Across kitchens
            </div>
          </div>

          <div className="bg-linear-to-br from-orange-500 to-red-500 rounded-2xl p-6 shadow-lg text-white hover:shadow-xl transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                <DollarSign className="w-6 h-6" />
              </div>
              <TrendingUp className="w-5 h-5" />
            </div>
            <div className="text-sm text-orange-100">Est. Monthly</div>
            <div className="text-3xl font-bold">
              ₹{stats.estimatedMonthlyEarnings.toLocaleString()}
            </div>
            <div className="text-xs text-orange-100 mt-1">Based on your pricing</div>
          </div>

        </div>

        {/* Main Content */}
        <div className="grid lg:grid-cols-3 gap-8">
          
          {/* Left Column - Tabs */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Tab Navigation */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl p-2 shadow-lg">
              <div className="flex space-x-2 overflow-x-auto">
                {[
                  { id: 'overview', label: 'My Tiffins', icon: Utensils },
                  { id: 'orders', label: 'Orders', icon: Package },
                  { id: 'subscriptions', label: 'Subscribers', icon: Calendar },
                  { id: 'reviews', label: 'Reviews', icon: Star }
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex-1 flex items-center justify-center space-x-2 px-4 py-3 rounded-xl font-medium transition-all whitespace-nowrap ${
                      activeTab === tab.id
                        ? 'bg-linear-to-r from-orange-600 to-red-600 text-white shadow-md'
                        : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'
                    }`}
                  >
                    <tab.icon className="w-5 h-5" />
                    <span className="hidden sm:inline text-sm">{tab.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* ✅ Overview - Real Tiffin Cards */}
            {activeTab === 'overview' && (
              <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-lg">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-slate-900 dark:text-white">My Tiffin Services</h2>
                  <Link to="/add-tiffin" className="text-sm text-orange-600 font-semibold hover:text-orange-700 flex items-center gap-1">
                    <Plus className="w-4 h-4" /> Add New
                  </Link>
                </div>

                {loadingTiffins ? (
                  <div className="flex items-center justify-center py-12">
                    <Loader2 className="w-8 h-8 text-orange-500 animate-spin" />
                  </div>
                ) : tiffins.length === 0 ? (
                  // ✅ Empty state
                  <div className="text-center py-12">
                    <div className="w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <ChefHat className="w-10 h-10 text-orange-500" />
                    </div>
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
                      No Tiffins Yet
                    </h3>
                    <p className="text-slate-500 dark:text-slate-400 text-sm mb-6">
                      Start your kitchen journey by adding your first tiffin service!
                    </p>
                    <Link
                      to="/add-tiffin"
                      className="inline-flex items-center gap-2 px-6 py-3 bg-linear-to-r from-orange-600 to-red-600 text-white rounded-xl font-semibold hover:shadow-lg transition-shadow"
                    >
                      <Plus className="w-5 h-5" />
                      Add Your First Tiffin
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {tiffins.map((tiffin) => (
                      <div key={tiffin._id} className="flex flex-col sm:flex-row items-start sm:items-center gap-4 p-4 bg-slate-50 dark:bg-slate-700/50 rounded-xl hover:shadow-md transition-shadow">
                        <img
                          src={tiffin.thumbnail}
                          alt={tiffin.name}
                          className="w-full sm:w-24 h-24 object-cover rounded-lg shrink-0"
                        />
                        <div className="flex-1 w-full">
                          <div className="flex flex-wrap items-center gap-2 mb-1">
                            <h3 className="font-bold text-slate-900 dark:text-white">
                              {getFoodTypeBadge(tiffin.foodType)} {tiffin.name}
                            </h3>
                            <span className={`px-2 py-0.5 rounded-full text-xs font-semibold border ${getStatusColor(tiffin.isAvailable)}`}>
                              {tiffin.isAvailable ? "Active" : "Paused"}
                            </span>
                          </div>
                          
                          {tiffin.typicalMeal && tiffin.typicalMeal.length > 0 && (
                            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">
                              {tiffin.typicalMeal.slice(0, 3)}
                            </p>
                          )}
                          
                          {tiffin.address && (
                            <div className="flex items-center gap-1 text-xs text-slate-500 mb-2">
                              <MapPin className="w-3 h-3" />
                              {tiffin.address.area}, {tiffin.address.city}
                            </div>
                          )}
                          
                          <div className="flex flex-wrap items-center justify-between gap-2 mt-2">
                            <div className="flex items-center gap-4 text-sm">
                              <span className="text-orange-600 dark:text-orange-400 font-bold">
                                From ₹{getStartingPrice(tiffin)}/meal
                              </span>
                              <div className="flex items-center">
                                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                                <span className="ml-1 font-semibold text-white">{tiffin.rating || 4.5}</span>
                                <span className="ml-1 text-xs text-slate-500">({tiffin.reviewsCount || 0})</span>
                              </div>
                            </div>
                            
                            <div className="flex items-center gap-1">
                              <Link
                                to={`/tiffin/${tiffin._id}`}
                                title="View"
                                className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition"
                              >
                                <Eye className="w-4 h-4" />
                              </Link>
                              <button
                                onClick={() => toggleAvailability(tiffin._id, tiffin.isAvailable)}
                                disabled={togglingId === tiffin._id}
                                title={tiffin.isAvailable ? "Pause" : "Activate"}
                                className={`p-2 rounded-lg transition ${
                                  tiffin.isAvailable
                                    ? "text-green-600 hover:bg-green-50"
                                    : "text-orange-600 hover:bg-orange-50"
                                } disabled:opacity-50`}
                              >
                                {togglingId === tiffin._id ? (
                                  <Loader2 className="w-4 h-4 animate-spin" />
                                ) : tiffin.isAvailable ? "🟢" : "🔴"}
                              </button>
                              <Link
                                to={`/edit-tiffin/${tiffin._id}`}
                                title="Edit"
                                className="p-2 text-slate-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition"
                              >
                                <Edit2 className="w-4 h-4" />
                              </Link>
                              <button
                                onClick={() => handleDelete(tiffin._id, tiffin.name)}
                                disabled={deletingId === tiffin._id}
                                title="Delete"
                                className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition disabled:opacity-50"
                              >
                                {deletingId === tiffin._id ? (
                                  <Loader2 className="w-4 h-4 animate-spin" />
                                ) : (
                                  <Trash2 className="w-4 h-4" />
                                )}
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Orders Tab - Empty state (until backend supports) */}
            {activeTab === 'orders' && (
              <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-lg">
                <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6">Order Management</h2>
                <div className="text-center py-12">
                  <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Package className="w-10 h-10 text-blue-500" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
                    Coming Soon!
                  </h3>
                  <p className="text-slate-500 dark:text-slate-400 text-sm max-w-md mx-auto">
                    Order management feature is under development. Soon you'll be able to track all incoming orders here.
                  </p>
                </div>
              </div>
            )}

            {/* Subscriptions Tab - Empty state */}
            {activeTab === 'subscriptions' && (
              <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-lg">
                <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6">Active Subscribers</h2>
                <div className="text-center py-12">
                  <div className="w-20 h-20 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Calendar className="w-10 h-10 text-purple-500" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
                    No Subscribers Yet
                  </h3>
                  <p className="text-slate-500 dark:text-slate-400 text-sm max-w-md mx-auto">
                    Once customers start subscribing to your tiffin services, they will appear here with subscription details.
                  </p>
                </div>
              </div>
            )}

            {/* Reviews Tab - Empty state */}
            {activeTab === 'reviews' && (
              <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-lg">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-slate-900 dark:text-white">Customer Reviews</h2>
                  <div className="flex items-center space-x-2">
                    <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                    <span className="font-bold text-slate-900 dark:text-white">{stats.averageRating}</span>
                    <span className="text-slate-500 text-sm">({stats.totalReviews} total)</span>
                  </div>
                </div>
                <div className="text-center py-12">
                  <div className="w-20 h-20 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Star className="w-10 h-10 text-yellow-500" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
                    No Reviews Yet
                  </h3>
                  <p className="text-slate-500 dark:text-slate-400 text-sm max-w-md mx-auto">
                    Customer reviews will appear here once they start rating your tiffin services.
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Right Column - Profile */}
          <div className="space-y-6">
            
            {/* Profile Card */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-lg">
              <div className="text-center mb-6">
                <div className="w-24 h-24 bg-linear-to-br from-orange-400 to-red-500 rounded-2xl flex items-center justify-center text-white text-4xl font-bold mx-auto mb-4 shadow-lg">
                  {user.fullname?.charAt(0).toUpperCase() || 'U'}
                </div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white">{user.fullname}</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 flex items-center justify-center gap-1 mt-1">
                  <ChefHat className="w-4 h-4" />
                  {roleLabels[user.role]}
                </p>
                <div className="inline-flex items-center gap-1 mt-2 px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-semibold">
                  <CheckCircle className="w-3 h-3" />
                  Verified Provider
                </div>
              </div>

              <div className="space-y-3 pt-4 border-t border-slate-200 dark:border-slate-700">
                <div className="flex items-center gap-3 text-slate-600 dark:text-slate-300">
                  <MapPin className="w-4 h-4 text-slate-400 shrink-0" />
                  <span className="text-sm truncate">
                    {user.location?.city || user.location?.state
                      ? `${user.location?.city ?? ""}${user.location?.city && user.location?.state ? ", " : ""}${user.location?.state ?? ""}`
                      : "Location not added"}
                  </span>
                </div>
                <div className="flex items-center gap-3 text-slate-600 dark:text-slate-300">
                  <Mail className="w-4 h-4 text-slate-400 shrink-0" />
                  <span className="text-sm truncate">{user.email}</span>
                </div>
                <div className="flex items-center gap-3 text-slate-600 dark:text-slate-300">
                  <Clock className="w-4 h-4 text-slate-400 shrink-0" />
                  <span className="text-sm">
                    Since {new Date(user.createdAt).toLocaleDateString('en-IN', { month: 'short', year: 'numeric' })}
                  </span>
                </div>
              </div>

              <Link
                to="/profile"
                className="mt-6 w-full py-3 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-xl font-medium hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors flex items-center justify-center gap-2"
              >
                <Settings className="w-4 h-4" />
                Edit Profile
              </Link>
            </div>

            {/* Performance Card */}
            <div className="bg-linear-to-br from-orange-600 to-red-600 rounded-2xl p-6 shadow-lg text-white">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                  <TrendingUp className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-bold">Performance</h3>
              </div>
              <div className="space-y-4">
                <div>
                  <div className="flex items-center justify-between text-sm mb-1">
                    <span className="text-orange-100">Active Kitchens</span>
                    <span className="font-bold">{stats.activeTiffins}/{stats.totalTiffins}</span>
                  </div>
                  <div className="w-full bg-white/20 rounded-full h-2">
                    <div
                      className="bg-white rounded-full h-2 transition-all"
                      style={{
                        width: stats.totalTiffins > 0
                          ? `${(stats.activeTiffins / stats.totalTiffins) * 100}%`
                          : "0%"
                      }}
                    />
                  </div>
                </div>

                <div className="pt-2 flex items-center justify-between text-sm">
                  <span className="text-orange-100">Overall Rating</span>
                  <span className="font-bold flex items-center gap-1">
                    <Star className="w-3 h-3 fill-white" /> {stats.averageRating}
                  </span>
                </div>

                <div className="pt-1 flex items-center justify-between text-sm">
                  <span className="text-orange-100">Total Reviews</span>
                  <span className="font-bold">{stats.totalReviews}</span>
                </div>
              </div>
            </div>

            {/* Tips Card */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-lg">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center">
                  <ChefHat className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">Pro Tips</h3>
              </div>
              <ul className="space-y-3 text-slate-600 dark:text-slate-300 text-sm">
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500 shrink-0 mt-0.5" />
                  <span>Update your weekly menu regularly</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500 shrink-0 mt-0.5" />
                  <span>Upload high-quality food photos</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500 shrink-0 mt-0.5" />
                  <span>Offer discounts for monthly subscriptions</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500 shrink-0 mt-0.5" />
                  <span>Respond to reviews within 24 hours</span>
                </li>
              </ul>
            </div>

            {/* Getting Started Card - if no tiffins */}
            {!loadingTiffins && tiffins.length === 0 && (
              <div className="bg-linear-to-br from-blue-50 to-indigo-50 rounded-2xl p-6 shadow-lg border border-blue-100">
                <div className="flex items-center gap-2 mb-3">
                  <AlertCircle className="w-5 h-5 text-blue-600" />
                  <h3 className="font-bold text-blue-900">Getting Started</h3>
                </div>
                <p className="text-xs text-blue-800 mb-4">
                  Complete these steps to start receiving orders:
                </p>
                <ol className="space-y-2 text-xs text-blue-700">
                  <li className="flex gap-2">
                    <span className="font-bold">1.</span>
                    <span>Add your first tiffin service</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="font-bold">2.</span>
                    <span>Set pricing for lunch/dinner</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="font-bold">3.</span>
                    <span>Upload menu & photos</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="font-bold">4.</span>
                    <span>Start accepting subscriptions!</span>
                  </li>
                </ol>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}