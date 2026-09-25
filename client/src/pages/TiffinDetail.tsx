import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import {
  MapPin, Star, Phone, Utensils, Clock, Tag,
  ChevronLeft, ChevronRight, Maximize2, Check, X, Award, Loader2, ShieldCheck, Soup
} from 'lucide-react';

// 1. Interfaces matching the MongoDB Schema
interface ItemIncluded {
  itemName: string;
  quantity: string;
}

interface TiffinService {
  _id: string;
  name: string;
  description: string;
  foodType: "veg" | "non-veg" | "jain" | "vegan";
  thumbnail: string;
  images?: string[];
  pricing: {
    oneTime: number;
    weekly?: number;
    monthly?: number;
  };
  itemsIncluded: ItemIncluded[];
  details: {
    mealTime: "Lunch" | "Dinner" | "Both";
    calories?: string;
    preparationType?: string;
    packaging?: string;
    deliverySlots?: string[];
  };
  rating?: number;
  reviewsCount?: number;
  isAvailable: boolean;
}

export default function TiffinDetail() {
  const { id } = useParams<{ id: string }>();
  const [tiffin, setTiffin] = useState<TiffinService | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showMenuModal, setShowMenuModal] = useState(false);

  // 2. Fetch Tiffin Details from DB
  useEffect(() => {
    const fetchTiffinDetails = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await axios.get(`http://localhost:1003/api/v1/tiffins/${id}`, {
          withCredentials: true,
        });
        const data = response.data?.data || response.data;
        setTiffin(data);
      } catch (err: any) {
        console.error("Error fetching tiffin details:", err);
        setError(err.response?.data?.message || "Failed to load tiffin details.");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchTiffinDetails();
    }
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen pt-20 flex flex-col items-center justify-center bg-slate-50">
        <Loader2 className="w-12 h-12 text-orange-500 animate-spin mb-4" />
        <p className="text-slate-600 font-semibold">Cooking up details...</p>
      </div>
    );
  }

  if (error || !tiffin) {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center bg-slate-50">
        <div className="text-center bg-white p-8 rounded-3xl shadow-lg max-w-md border border-slate-100">
          <span className="text-5xl block mb-4">🍽️</span>
          <h1 className="text-2xl font-bold text-slate-900 mb-2">Tiffin Service Not Found</h1>
          <p className="text-slate-500 mb-6">{error || "The requested tiffin service doesn't exist."}</p>
          <Link to="/tiffin" className="px-6 py-2.5 bg-orange-500 text-white font-semibold rounded-xl hover:bg-orange-600 transition">
            Back to listings
          </Link>
        </div>
      </div>
    );
  }

  // Create combined list of images (thumbnail + secondary images)
  const imageList = [tiffin.thumbnail, ...(tiffin.images || [])].filter(Boolean);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(price);
  };

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % imageList.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + imageList.length) % imageList.length);
  };

  const getFoodTypeBadge = (type: string) => {
    switch (type) {
      case "veg":
        return <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-bold border border-green-300 flex items-center gap-1">🟢 Veg</span>;
      case "non-veg":
        return <span className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-xs font-bold border border-red-300 flex items-center gap-1">🔴 Non-Veg</span>;
      case "jain":
        return <span className="px-3 py-1 bg-amber-100 text-amber-700 rounded-full text-xs font-bold border border-amber-300 flex items-center gap-1">🟡 Jain</span>;
      default:
        return <span className="px-3 py-1 bg-slate-100 text-slate-700 rounded-full text-xs font-bold capitalize">{type}</span>;
    }
  };

  return (
    <div className="min-h-screen pt-20 pb-12 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Back Button */}
        <Link
          to="/tiffin"
          className="inline-flex items-center text-slate-600 hover:text-slate-900 mb-6 font-medium"
        >
          <ChevronLeft className="w-5 h-5 mr-1 text-orange-500" />
          Back to Tiffin Services
        </Link>

        {/* Image Gallery */}
        <div className="bg-white rounded-3xl overflow-hidden shadow-xl shadow-slate-200/50 mb-8">
          <div className="relative h-96 md:h-[500px]">
            <img
              src={imageList[currentImageIndex]}
              alt={tiffin.name}
              className="w-full h-full object-cover transition-all duration-500"
            />
            
            {/* Navigation Arrows */}
            {imageList.length > 1 && (
              <>
                <button
                  onClick={prevImage}
                  className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg hover:bg-white transition-colors"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
                <button
                  onClick={nextImage}
                  className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg hover:bg-white transition-colors"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
              </>
            )}

            {/* View Menu Button */}
            <button
              onClick={() => setShowMenuModal(true)}
              className="absolute bottom-4 right-4 flex items-center space-x-2 px-5 py-2.5 bg-orange-600 text-white rounded-xl shadow-lg hover:bg-orange-700 transition"
            >
              <Maximize2 className="w-4 h-4" />
              <span className="font-semibold text-sm">View Weekly Menu</span>
            </button>

            {/* Image Indicators */}
            <div className="absolute bottom-4 left-4 flex space-x-2">
              {imageList.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentImageIndex(index)}
                  className={`w-2.5 h-2.5 rounded-full transition-colors ${
                    index === currentImageIndex ? 'bg-orange-500 w-5' : 'bg-white/50'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content Area */}
          <div className="lg:col-span-2 space-y-8">
            {/* Title & Description */}
            <div className="bg-white rounded-2xl p-6 shadow-lg shadow-slate-200/50">
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-4">
                <div>
                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    {getFoodTypeBadge(tiffin.foodType)}
                    {tiffin.isAvailable ? (
                      <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-semibold">
                        Accepting Subscriptions
                      </span>
                    ) : (
                      <span className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-xs font-semibold">
                        Temporarily Paused
                      </span>
                    )}
                  </div>
                  <h1 className="text-3xl font-bold text-slate-900 mb-1">{tiffin.name}</h1>
                  <div className="flex items-center text-slate-500 text-sm mt-1">
                    <MapPin className="w-4 h-4 mr-1 text-orange-500" />
                    <span>Free Home Delivery Available</span>
                  </div>
                </div>

                <div className="text-left sm:text-right">
                  <div className="text-3xl font-extrabold text-orange-600">
                    {formatPrice(tiffin.pricing.oneTime)}
                  </div>
                  <div className="text-sm text-slate-500 font-medium">per meal charge</div>
                  <div className="flex items-center sm:justify-end mt-2">
                    <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                    <span className="ml-1 font-bold text-slate-700">{tiffin.rating || 4.5}</span>
                    <span className="ml-1 text-slate-500 text-sm">({tiffin.reviewsCount || 0} reviews)</span>
                  </div>
                </div>
              </div>

              <p className="text-slate-600 leading-relaxed text-sm border-t border-slate-100 pt-4">
                {tiffin.description}
              </p>
            </div>

            {/* What's Inside the Box - Real Database itemsIncluded */}
            <div className="bg-white rounded-2xl p-6 shadow-lg shadow-slate-200/50">
              <h2 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                <Soup className="text-orange-500 w-6 h-6" />
                What's Inside the Box
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {tiffin.itemsIncluded?.map((item, idx) => (
                  <div
                    key={idx}
                    className="p-3 bg-orange-50/50 rounded-xl border border-orange-100 shadow-sm flex flex-col"
                  >
                    <span className="font-semibold text-slate-800 text-sm">{item.itemName}</span>
                    <span className="text-xs text-orange-600 font-bold mt-1 bg-white px-2 py-0.5 rounded-md self-start border border-orange-100">
                      {item.quantity}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Specifications & Packaging Details */}
            <div className="bg-white rounded-2xl p-6 shadow-lg shadow-slate-200/50">
              <h2 className="text-xl font-bold text-slate-900 mb-4">Preparation & Diet</h2>
              <div className="grid md:grid-cols-2 gap-6">
                
                {/* Meal Timings */}
                <div>
                  <h3 className="font-semibold text-slate-700 mb-3 flex items-center">
                    <Clock className="w-5 h-5 mr-2 text-orange-500" />
                    Meal Timings
                  </h3>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <div className="w-6 h-6 bg-orange-100 rounded-full flex items-center justify-center">
                        <Check className="w-4 h-4 text-orange-600" />
                      </div>
                      <span className="text-slate-700 capitalize text-sm">
                        Available for: <strong className="font-semibold text-slate-900">{tiffin.details?.mealTime || "Both"}</strong>
                      </span>
                    </div>
                  </div>
                </div>

                {/* Packaging & Calories */}
                <div>
                  <h3 className="font-semibold text-slate-700 mb-3 flex items-center">
                    <Utensils className="w-5 h-5 mr-2 text-orange-500" />
                    Nutrition & Hygiene
                  </h3>
                  <div className="space-y-1.5 text-sm text-slate-600">
                    <div>🔥 <span className="text-slate-400">Calories:</span> <strong className="text-slate-800">{tiffin.details?.calories || "~650 kcal"}</strong></div>
                    <div>🍳 <span className="text-slate-400">Preparation:</span> <strong className="text-slate-800">{tiffin.details?.preparationType || "Less oil / Home-style"}</strong></div>
                    <div>🍱 <span className="text-slate-400">Packaging:</span> <strong className="text-slate-800">{tiffin.details?.packaging || "Eco-friendly insulated box"}</strong></div>
                  </div>
                </div>
              </div>

              {/* Pricing Subscription Plans */}
              <div className="mt-6 pt-6 border-t border-slate-200">
                <h3 className="font-semibold text-slate-700 mb-3 flex items-center">
                  <Tag className="w-5 h-5 mr-2 text-orange-500" />
                  Subscription Packages
                </h3>
                <div className="grid md:grid-cols-3 gap-4">
                  
                  {/* Single Meal */}
                  <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                    <div className="text-xs text-slate-500 mb-1">Single Trial Meal</div>
                    <div className="text-2xl font-extrabold text-slate-900">
                      {formatPrice(tiffin.pricing.oneTime)}
                    </div>
                    <div className="text-xs text-slate-400 mt-1">Single dispatch order</div>
                  </div>

                  {/* Weekly Plan */}
                  <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                    <div className="text-xs text-slate-500 mb-1">Weekly Package (7 days)</div>
                    <div className="text-2xl font-extrabold text-slate-900">
                      {formatPrice(tiffin.pricing.weekly || tiffin.pricing.oneTime * 7)}
                    </div>
                    <div className="text-xs text-green-600 font-semibold mt-1">Includes all taxes & delivery</div>
                  </div>

                  {/* Monthly Plan (Rotated Card Highlight) */}
                  <div className="p-4 bg-linear-to-br from-orange-500 to-red-500 rounded-xl text-white shadow-md shadow-orange-500/10">
                    <div className="text-xs text-orange-100 mb-1">Monthly Package (30 days)</div>
                    <div className="text-2xl font-extrabold">
                      {formatPrice(tiffin.pricing.monthly || tiffin.pricing.oneTime * 30)}
                    </div>
                    <div className="text-xs text-orange-100 mt-1 font-medium">✨ Highly Recommended Plan</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Provider Verification Info */}
            <div className="bg-white rounded-2xl p-6 shadow-lg shadow-slate-200/50 border border-slate-100">
              <div className="flex items-start space-x-4">
                <div className="w-14 h-14 bg-linear-to-br from-orange-500 to-red-500 rounded-full flex items-center justify-center text-white font-bold text-xl shrink-0">
                  {tiffin.name.charAt(0)}
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-slate-900 flex items-center gap-1.5">
                    Verified Home Kitchen
                    <ShieldCheck className="w-5 h-5 text-green-500 fill-green-50" />
                  </h3>
                  <div className="flex items-center mt-1">
                    <Award className="w-4 h-4 text-orange-500 mr-1" />
                    <span className="text-xs font-semibold text-orange-600">FSSAI Guideline Compliant</span>
                  </div>
                  <p className="text-slate-600 text-sm mt-3 leading-relaxed">
                    Meals are prepared in absolute hygienic environments. Premium quality fresh vegetables, high-grade wheat flour, and home-pressed oils are used. Perfect for students and professionals looking for daily healthy digestion.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar / Subscription Checkout Card */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl p-6 shadow-lg shadow-slate-200/50 border border-slate-100 sticky top-24 space-y-5">
              <h2 className="text-xl font-bold text-slate-900 border-b border-slate-100 pb-3">Book Subscription</h2>
              
              {/* Delivery Slots */}
              {tiffin.details?.deliverySlots && tiffin.details.deliverySlots.length > 0 && (
                <div>
                  <span className="text-xs font-semibold text-slate-400 block mb-2">AVAILABLE DELIVERY SLOTS</span>
                  <div className="flex flex-wrap gap-2">
                    {tiffin.details.deliverySlots.map((slot, index) => (
                      <span key={index} className="text-xs bg-slate-100 font-semibold px-2.5 py-1.5 rounded-lg text-slate-700">
                        🕒 {slot}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="space-y-3 pt-2">
                <button
                  onClick={() => alert(`Connecting to WhatsApp with provider...`)}
                  className="flex items-center justify-center space-x-2 w-full py-3.5 bg-green-500 text-white rounded-xl hover:bg-green-600 font-bold shadow-lg shadow-green-500/25 transition"
                >
                  <Phone className="w-5 h-5" />
                  <span>Call / Order via WhatsApp</span>
                </button>
                
                <button
                  onClick={() => alert("Redirecting to subscription gateway!")}
                  className="flex items-center justify-center space-x-2 w-full py-3.5 bg-orange-500 text-white rounded-xl hover:bg-orange-600 font-bold shadow-lg shadow-orange-500/25 transition"
                >
                  <Utensils className="w-5 h-5" />
                  <span>Subscribe Now</span>
                </button>
              </div>

              {/* Highlight Perks */}
              <div className="bg-orange-50/50 rounded-xl p-4 border border-orange-100">
                <ul className="text-xs text-orange-800 space-y-2">
                  <li className="flex items-center gap-1.5 font-medium">🟢 Pause Subscription Anytime (e.g., Weekends)</li>
                  <li className="flex items-center gap-1.5 font-medium">🟢 Delivery right inside Hostel/Flat</li>
                  <li className="flex items-center gap-1.5 font-medium">🟢 Zero hidden shipping/delivery costs</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Menu / Daily Schedule Preview Modal */}
      {showMenuModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="relative w-full max-w-4xl max-h-[85vh] overflow-y-auto bg-white rounded-3xl shadow-2xl animate-scaleUp">
            
            {/* Close Button */}
            <button
              onClick={() => setShowMenuModal(false)}
              className="absolute top-4 right-4 text-slate-500 hover:text-slate-800 bg-slate-100 hover:bg-slate-200 p-2 rounded-full transition"
            >
              <X className="w-6 h-6" />
            </button>
            
            <div className="p-6 md:p-8">
              <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                🍱 Weekly Menu Schedule
              </h2>
              <p className="text-slate-600 text-sm mt-1 mb-6">Real home-cooked menu distribution for {tiffin.name}</p>
              
              <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
                {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map((day) => (
                  <div key={day} className="p-4 bg-slate-50 rounded-2xl border border-slate-100 hover:border-orange-200 transition">
                    <div className="font-bold text-slate-900 border-b border-slate-200 pb-1.5 mb-2 text-sm">{day}</div>
                    <div className="space-y-1.5 text-xs text-slate-600">
                      <div>🌤️ <span className="text-slate-400 font-medium">Lunch:</span> 4 Roti, Dal Fry, Special Sabzi, Basmati Rice</div>
                      <div>🌙 <span className="text-slate-400 font-medium">Dinner:</span> 4 Butter Roti, Dry Seasonal Sabzi, Salad, Khichdi</div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 p-4 bg-orange-50/60 border border-orange-100 rounded-2xl">
                <p className="text-xs text-orange-800 leading-relaxed font-medium">
                  💡 <strong>Please Note:</strong> Dishes vary weekly according to seasonal vegetable markets. Sundays contain "Special" cheat meals like Paneer Masala or kheer in the afternoon.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}