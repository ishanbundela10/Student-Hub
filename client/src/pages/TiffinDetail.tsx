import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getTiffinById } from '../api/tiffin';
import {
  MapPin, Star, Phone, Mail, Utensils, Clock, Tag,
  ChevronLeft, ChevronRight, Check, Award, Loader2, ShieldCheck, Soup,
  Home, Sunrise, Moon, MessageCircle, Truck
} from 'lucide-react';

import { TiffinService } from '@/types';

// interface TiffinService {
//   _id: string;
//   name?: string;
//   kitchenName?: string;
//   description: string;
//   foodType: string;
//   typicalMeal: string; // Replaces itemsIncluded & weeklyMenu
//   thumbnail: string;
//   images?: string[];
  
//   // Simple Pricing
//   pricePerMeal: number;
//   pricePerMonth?: number;
  
//   providerName: string;
  
//   // Structured Address
//   address: {
//     area: string;
//     city: string;
//     state: string;
//     pincode: string;
//   };
  
//   contactPhone: string;
//   contactEmail?: string;
  
//   // Timings & Delivery
//   mealTime: "Lunch" | "Dinner" | "Both";
//   timing?: {
//     lunch?: string;
//     dinner?: string;
//   };
//   deliveryOptions: string;
  
//   rating?: number;
//   reviewsCount?: number;
//   isAvailable: boolean;
// }

export default function TiffinDetail() {
  const { id } = useParams<{ id: string }>();
  const [tiffin, setTiffin] = useState<TiffinService | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // ✅ Simple Subscription Toggle (Daily vs Monthly)
  const [subscriptionType, setSubscriptionType] = useState<"daily" | "monthly">("daily");

  useEffect(() => {
    const fetchTiffinDetails = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await getTiffinById(id!);
        const data = response.data?.data || response.data;
        setTiffin(data);

        // Default to monthly if available, otherwise daily
        if (data.pricePerMonth) {
          setSubscriptionType("monthly");
        }
      } catch (err: any) {
        console.error("Error fetching tiffin details:", err);
        setError(err.response?.data?.message || "Failed to load tiffin details.");
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchTiffinDetails();
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

  const imageList = [tiffin.thumbnail, ...(tiffin.images || [])].filter(Boolean);

  const formatPrice = (price?: number) => {
    if (!price) return "N/A";
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(price);
  };

  const nextImage = () => setCurrentImageIndex((prev) => (prev + 1) % imageList.length);
  const prevImage = () => setCurrentImageIndex((prev) => (prev - 1 + imageList.length) % imageList.length);

  // Get displayed price based on selection
  const getCurrentPrice = () => {
    return subscriptionType === "monthly" && tiffin.pricing.pricePerMonth
      ? tiffin.pricing.pricePerMonth
      : tiffin.pricing.pricePerMeal;
  };

  const getFullAddress = () => {
    const { area, city, state, pincode } = tiffin.address || {};
    return [area, city, state, pincode].filter(Boolean).join(", ");
  };

  const handleWhatsApp = () => {
    const message = `Hi! I'm interested in your tiffin service "${tiffin.kitchenName || tiffin.name}". Can you share more details?`;
    const phone = tiffin.contactPhone.replace(/[^0-9]/g, "");
    window.open(`https://wa.me/91${phone}?text=${encodeURIComponent(message)}`, "_blank");
  };

  const handleOpenMap = () => {
    const query = encodeURIComponent(getFullAddress());
    window.open(`https://www.google.com/maps/search/?api=1&query=${query}`, "_blank");
  };

  const getFoodTypeBadge = (type: string) => {
    const lowerType = (type || "").toLowerCase();
    if (lowerType.includes("non-veg")) {
      return <span className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-xs font-bold border border-red-300 flex items-center gap-1">🔴 Non-Veg</span>;
    }
    if (lowerType.includes("jain")) {
      return <span className="px-3 py-1 bg-amber-100 text-amber-700 rounded-full text-xs font-bold border border-amber-300 flex items-center gap-1">🟡 Jain</span>;
    }
    if (lowerType.includes("vegan")) {
      return <span className="px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-xs font-bold border border-emerald-300 flex items-center gap-1">🌱 Vegan</span>;
    }
    return <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-bold border border-green-300 flex items-center gap-1">🟢 Pure Veg</span>;
  };

  return (
    <div className="min-h-screen pt-20 pb-12 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Back Button */}
        <Link to="/tiffin" className="inline-flex items-center text-slate-600 hover:text-slate-900 mb-6 font-medium">
          <ChevronLeft className="w-5 h-5 mr-1 text-orange-500" />
          Back to Tiffin Services
        </Link>

        {/* Image Gallery */}
        <div className="bg-white rounded-3xl overflow-hidden shadow-xl shadow-slate-200/50 mb-8">
          <div className="relative h-96 md:h-[500px]">
            <img src={imageList[currentImageIndex]} alt={tiffin.kitchenName || tiffin.name} className="w-full h-full object-cover transition-all duration-500" />

            {imageList.length > 1 && (
              <>
                <button onClick={prevImage} className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg hover:bg-white transition">
                  <ChevronLeft className="w-6 h-6" />
                </button>
                <button onClick={nextImage} className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg hover:bg-white transition">
                  <ChevronRight className="w-6 h-6" />
                </button>
              </>
            )}

            <div className="absolute bottom-4 left-4 flex space-x-2">
              {imageList.map((_, index) => (
                <button key={index} onClick={() => setCurrentImageIndex(index)}
                  className={`h-2.5 rounded-full transition-all ${index === currentImageIndex ? 'bg-orange-500 w-8' : 'bg-white/70 w-2.5'}`} />
              ))}
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content Area */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* Title & Description Card */}
            <div className="bg-white rounded-2xl p-6 shadow-lg shadow-slate-200/50">
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-4">
                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-2 mb-3">
                    {getFoodTypeBadge(tiffin.foodType)}
                    {tiffin.isAvailable ? (
                      <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-semibold">Accepting Orders</span>
                    ) : (
                      <span className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-xs font-semibold">Temporarily Paused</span>
                    )}
                    <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-semibold">
                      🕐 {tiffin.mealTime}
                    </span>
                  </div>
                  <h1 className="text-3xl font-bold text-slate-900 mb-2">
                    {tiffin.kitchenName || tiffin.name}
                  </h1>
                </div>

                <div className="text-left sm:text-right">
                  <div className="text-3xl font-extrabold text-orange-600">
                    {formatPrice(tiffin.pricing.pricePerMeal)}
                  </div>
                  <div className="text-sm text-slate-500 font-medium">per meal</div>
                  <div className="flex items-center sm:justify-end mt-2">
                    <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                    <span className="ml-1 font-bold text-slate-700">{tiffin.rating || 5.0}</span>
                    <span className="ml-1 text-slate-500 text-sm">({tiffin.reviewsCount || 0} reviews)</span>
                  </div>
                </div>
              </div>

              <p className="text-slate-600 leading-relaxed text-sm border-t border-slate-100 pt-4">
                {tiffin.description}
              </p>
            </div>

            {/* ✅ Full Address Card */}
            {tiffin.address && (
              <div className="bg-white rounded-2xl p-6 shadow-lg shadow-slate-200/50">
                <h2 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                  <Home className="text-orange-500 w-6 h-6" />
                  Kitchen Location
                </h2>
                <div className="bg-orange-50/40 border border-orange-100 rounded-xl p-4">
                  <div className="flex items-start gap-3">
                    <MapPin className="w-5 h-5 text-orange-500 mt-0.5 shrink-0" />
                    <div className="flex-1">
                      <p className="font-semibold text-slate-800 text-sm">
                        {tiffin.address.area}
                      </p>
                      <p className="text-sm text-slate-700 mt-1">
                        {tiffin.address.city}, {tiffin.address.state} - <strong>{tiffin.address.pincode}</strong>
                      </p>
                    </div>
                  </div>
                  <button onClick={handleOpenMap} className="mt-3 text-xs font-semibold text-orange-600 hover:text-orange-700 flex items-center gap-1">
                    📍 View on Google Maps →
                  </button>
                </div>
              </div>
            )}

            {/* ✅ What's Inside the Box (Typical Meal String) */}
            <div className="bg-white rounded-2xl p-6 shadow-lg shadow-slate-200/50">
              <h2 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                <Soup className="text-orange-500 w-6 h-6" />
                What's in a standard meal?
              </h2>
              <div className="bg-orange-50/60 p-5 rounded-2xl border border-orange-100 shadow-sm flex items-start gap-3">
                <Utensils className="text-orange-600 w-6 h-6 shrink-0 mt-0.5" />
                <p className="text-slate-700 font-medium leading-relaxed">
                  {tiffin.typicalMeal || "Standard home-cooked Thali. Menu changes daily."}
                </p>
              </div>
            </div>

            {/* ✅ Timings & Delivery Options */}
            <div className="bg-white rounded-2xl p-6 shadow-lg shadow-slate-200/50">
              <h2 className="text-xl font-bold text-slate-900 mb-4">Timings & Delivery</h2>
              <div className="grid md:grid-cols-2 gap-6">
                
                {/* Specific Timings */}
                <div>
                  <h3 className="font-semibold text-slate-700 mb-3 flex items-center">
                    <Clock className="w-5 h-5 mr-2 text-orange-500" />
                    Food Ready By
                  </h3>
                  <div className="space-y-3">
                    {(tiffin.mealTime === "Lunch" || tiffin.mealTime === "Both") && (
                      <div className="flex items-start gap-3 p-3 bg-amber-50 rounded-xl border border-amber-100">
                        <Sunrise className="w-5 h-5 text-amber-600 mt-0.5" />
                        <div>
                          <div className="text-xs text-amber-800 font-bold uppercase">Lunch</div>
                          <div className="text-sm font-semibold text-slate-900">{tiffin.timing?.lunch || "12:30 PM"}</div>
                        </div>
                      </div>
                    )}
                    
                    {(tiffin.mealTime === "Dinner" || tiffin.mealTime === "Both") && (
                      <div className="flex items-start gap-3 p-3 bg-indigo-50 rounded-xl border border-indigo-100">
                        <Moon className="w-5 h-5 text-indigo-600 mt-0.5" />
                        <div>
                          <div className="text-xs text-indigo-800 font-bold uppercase">Dinner</div>
                          <div className="text-sm font-semibold text-slate-900">{tiffin.timing?.dinner || "7:30 PM"}</div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Delivery Logistics */}
                <div>
                  <h3 className="font-semibold text-slate-700 mb-3 flex items-center">
                    <Truck className="w-5 h-5 mr-2 text-orange-500" />
                    Logistics
                  </h3>
                  <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 space-y-3">
                    <div>
                      <span className="text-xs text-slate-500 block mb-0.5">Delivery Method</span>
                      <strong className="text-sm text-slate-800 flex items-center gap-1.5">
                        <Check className="w-4 h-4 text-green-500" /> {tiffin.deliveryOptions || "Self Pickup"}
                      </strong>
                    </div>
                    <div>
                      <span className="text-xs text-slate-500 block mb-0.5">Meal Schedule</span>
                      <strong className="text-sm text-slate-800 flex items-center gap-1.5">
                        <Check className="w-4 h-4 text-green-500" /> {tiffin.mealTime}
                      </strong>
                    </div>
                  </div>
                </div>

              </div>
            </div>

            {/* Provider Info */}
            <div className="bg-white rounded-2xl p-6 shadow-lg shadow-slate-200/50 border border-slate-100">
              <div className="flex items-start space-x-4">
                <div className="w-14 h-14 bg-linear-to-br from-orange-500 to-red-500 rounded-full flex items-center justify-center text-white font-bold text-xl shrink-0">
                  {tiffin.providerName?.charAt(0) || "P"}
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-slate-900 flex items-center gap-1.5">
                    {tiffin.providerName}
                    <ShieldCheck className="w-5 h-5 text-green-500 fill-green-50" />
                  </h3>
                  <div className="flex items-center mt-1">
                    <Award className="w-4 h-4 text-orange-500 mr-1" />
                    <span className="text-xs font-semibold text-orange-600">Verified Home Kitchen</span>
                  </div>
                  <p className="text-slate-600 text-sm mt-2">
                    Cooking with love and maintaining strict hygiene, ensuring you never miss home-cooked food.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* ✅ Sidebar Checkout (Simple Daily vs Monthly) */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl p-6 shadow-lg shadow-slate-200/50 border border-slate-100 sticky top-24 space-y-5">
              
              <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                <Tag className="w-5 h-5 text-orange-500" />
                Pricing Plans
              </h2>

              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => setSubscriptionType("daily")}
                  className={`p-3 rounded-xl border-2 transition-all text-center ${
                    subscriptionType === "daily"
                      ? "border-orange-500 bg-orange-50 shadow-md"
                      : "border-slate-200 hover:border-orange-300 bg-white"
                  }`}
                >
                  <div className={`text-xs font-bold ${subscriptionType === "daily" ? "text-orange-700" : "text-slate-500"}`}>Per Meal</div>
                  <div className={`text-lg font-extrabold mt-1 ${subscriptionType === "daily" ? "text-slate-900" : "text-slate-700"}`}>
                    {formatPrice(tiffin.pricing.pricePerMeal)}
                  </div>
                </button>

                <button
                  disabled={!tiffin.pricing.pricePerMonth}
                  onClick={() => setSubscriptionType("monthly")}
                  className={`p-3 rounded-xl border-2 transition-all text-center ${
                    !tiffin.pricing.pricePerMonth 
                      ? "opacity-50 cursor-not-allowed border-slate-200 bg-slate-50"
                      : subscriptionType === "monthly"
                      ? "border-orange-500 bg-linear-to-br from-orange-500 to-red-500 text-white shadow-md"
                      : "border-slate-200 hover:border-orange-300 bg-white"
                  }`}
                >
                  <div className={`text-xs font-bold ${subscriptionType === "monthly" ? "text-orange-100" : "text-slate-500"}`}>Per Month</div>
                  <div className={`text-lg font-extrabold mt-1 ${subscriptionType === "monthly" ? "text-white" : "text-slate-700"}`}>
                    {tiffin.pricing.pricePerMonth ? formatPrice(tiffin.pricing.pricePerMonth) : "N/A"}
                  </div>
                  {tiffin.pricing.pricePerMonth && subscriptionType === "monthly" && (
                    <div className="text-[10px] text-green-200 mt-0.5 font-bold uppercase">Best Value</div>
                  )}
                </button>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3 pt-4 border-t border-slate-100">
                <button onClick={handleWhatsApp} className="flex items-center justify-center space-x-2 w-full py-3.5 bg-green-500 text-white rounded-xl hover:bg-green-600 font-bold shadow-lg shadow-green-500/25 transition">
                  <MessageCircle className="w-5 h-5" />
                  <span>WhatsApp Provider</span>
                </button>

                <a href={`tel:${tiffin.contactPhone}`} className="flex items-center justify-center space-x-2 w-full py-3.5 bg-blue-500 text-white rounded-xl hover:bg-blue-600 font-bold shadow-lg shadow-blue-500/25 transition">
                  <Phone className="w-5 h-5" />
                  <span>Call Now</span>
                </a>

                <button onClick={() => alert(`Subscribing to ${subscriptionType} plan for ${formatPrice(getCurrentPrice())}`)}
                  className="flex items-center justify-center space-x-2 w-full py-3.5 bg-orange-500 text-white rounded-xl hover:bg-orange-600 font-bold shadow-lg shadow-orange-500/25 transition">
                  <Utensils className="w-5 h-5" />
                  <span>Subscribe Now</span>
                </button>
              </div>

              {/* Contact Info */}
              <div className="border-t border-slate-100 pt-4 space-y-2">
                <div className="flex items-center gap-2 text-xs text-slate-600">
                  <Phone className="w-3.5 h-3.5" />
                  <span>{tiffin.contactPhone}</span>
                </div>
                {tiffin.contactEmail && (
                  <div className="flex items-center gap-2 text-xs text-slate-600">
                    <Mail className="w-3.5 h-3.5" />
                    <span>{tiffin.contactEmail}</span>
                  </div>
                )}
              </div>

              {/* Perks */}
              <div className="bg-orange-50/50 rounded-xl p-4 border border-orange-100">
                <ul className="text-xs text-orange-800 space-y-2">
                  <li className="flex items-center gap-1.5 font-medium">🟢 Authentic Home-cooked meals</li>
                  <li className="flex items-center gap-1.5 font-medium">🟢 Directly contact the kitchen</li>
                  <li className="flex items-center gap-1.5 font-medium">🟢 Pause your monthly plan anytime</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}