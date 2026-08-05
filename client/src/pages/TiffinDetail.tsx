import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { mockTiffinServices } from '@/data/mockData';
import {
  MapPin, Star, Phone, Mail, Utensils, Clock, Tag,
  ChevronLeft, ChevronRight, Maximize2, Check, X, Award
} from 'lucide-react';

export default function TiffinDetail() {
  const { id } = useParams<{ id: string }>();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [show3DView, setShow3DView] = useState(false);

  const tiffin = mockTiffinServices.find(t => t._id === id);

  if (!tiffin) {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-slate-900 mb-2">Tiffin Service Not Found</h1>
          <Link to="/tiffin" className="text-orange-600 hover:underline">
            Back to listings
          </Link>
        </div>
      </div>
    );
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(price);
  };

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % tiffin.images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + tiffin.images.length) % tiffin.images.length);
  };

  const calculateMonthlyPrice = () => {
    const dailyPrice = tiffin.pricePerMeal * tiffin.mealTypes.length;
    const monthlyPrice = dailyPrice * 30;
    const discount = tiffin.monthlyDiscount ? monthlyPrice * 0.15 : 0;
    return monthlyPrice - discount;
  };

  return (
    <div className="min-h-screen pt-20 pb-12 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <Link
          to="/tiffin"
          className="inline-flex items-center text-slate-600 hover:text-slate-900 mb-6"
        >
          <ChevronLeft className="w-5 h-5 mr-1" />
          Back to Tiffin Services
        </Link>

        {/* Image Gallery */}
        <div className="bg-white rounded-3xl overflow-hidden shadow-xl shadow-slate-200/50 mb-8">
          <div className="relative h-96 md:h-[500px]">
            <img
              src={tiffin.images[currentImageIndex]}
              alt={tiffin.name}
              className="w-full h-full object-cover"
            />
            
            {/* Navigation Arrows */}
            {tiffin.images.length > 1 && (
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
              onClick={() => setShow3DView(true)}
              className="absolute bottom-4 right-4 flex items-center space-x-2 px-4 py-2 bg-white/90 backdrop-blur-sm rounded-xl shadow-lg hover:bg-white transition-colors"
            >
              <Maximize2 className="w-5 h-5" />
              <span className="font-medium">View Menu</span>
            </button>

            {/* Image Indicators */}
            <div className="absolute bottom-4 left-4 flex space-x-2">
              {tiffin.images.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentImageIndex(index)}
                  className={`w-2 h-2 rounded-full transition-colors ${
                    index === currentImageIndex ? 'bg-white' : 'bg-white/50'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Title & Price */}
            <div className="bg-white rounded-2xl p-6 shadow-lg shadow-slate-200/50">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <div className="flex items-center space-x-2 mb-2">
                    <span className="px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-sm font-medium">
                      {tiffin.cuisine[0]}
                    </span>
                    {tiffin.available && (
                      <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
                        Available Now
                      </span>
                    )}
                    {tiffin.monthlyDiscount && (
                      <span className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-sm font-medium">
                        15% Monthly Discount
                      </span>
                    )}
                  </div>
                  <h1 className="text-3xl font-bold text-slate-900 mb-2">{tiffin.name}</h1>
                  <p className="text-slate-500">by {tiffin.providerName}</p>
                  <div className="flex items-center text-slate-500 mt-2">
                    <MapPin className="w-5 h-5 mr-1" />
                    <span>{tiffin.location}</span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-3xl font-bold text-orange-600">
                    {formatPrice(tiffin.pricePerMeal)}
                  </div>
                  <div className="text-sm text-slate-500">per meal</div>
                  <div className="flex items-center justify-end mt-2">
                    <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                    <span className="ml-1 font-medium text-slate-700">{tiffin.rating}</span>
                    <span className="ml-1 text-slate-500">({tiffin.reviews} reviews)</span>
                  </div>
                </div>
              </div>

              <p className="text-slate-600 leading-relaxed">{tiffin.description}</p>
            </div>

            {/* Meal Details */}
            <div className="bg-white rounded-2xl p-6 shadow-lg shadow-slate-200/50">
              <h2 className="text-xl font-bold text-slate-900 mb-4">Meal Details</h2>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold text-slate-700 mb-3 flex items-center">
                    <Clock className="w-5 h-5 mr-2 text-orange-500" />
                    Meal Types Available
                  </h3>
                  <div className="space-y-2">
                    {tiffin.mealTypes.map((meal) => (
                      <div key={meal} className="flex items-center space-x-2">
                        <div className="w-6 h-6 bg-orange-100 rounded-full flex items-center justify-center">
                          <Check className="w-4 h-4 text-orange-600" />
                        </div>
                        <span className="text-slate-700 capitalize">{meal}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold text-slate-700 mb-3 flex items-center">
                    <Utensils className="w-5 h-5 mr-2 text-orange-500" />
                    Cuisine Types
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {tiffin.cuisine.map((cuisine) => (
                      <span
                        key={cuisine}
                        className="px-3 py-1 bg-slate-100 text-slate-700 rounded-full text-sm"
                      >
                        {cuisine}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Pricing */}
              <div className="mt-6 pt-6 border-t border-slate-200">
                <h3 className="font-semibold text-slate-700 mb-3 flex items-center">
                  <Tag className="w-5 h-5 mr-2 text-orange-500" />
                  Pricing Plans
                </h3>
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="p-4 bg-slate-50 rounded-xl">
                    <div className="text-sm text-slate-500 mb-1">Per Meal</div>
                    <div className="text-2xl font-bold text-slate-900">
                      {formatPrice(tiffin.pricePerMeal)}
                    </div>
                  </div>
                  <div className="p-4 bg-slate-50 rounded-xl">
                    <div className="text-sm text-slate-500 mb-1">Daily (All Meals)</div>
                    <div className="text-2xl font-bold text-slate-900">
                      {formatPrice(tiffin.pricePerMeal * tiffin.mealTypes.length)}
                    </div>
                  </div>
                  <div className="p-4 bg-linear-to-br from-orange-500 to-red-500 rounded-xl text-white">
                    <div className="text-sm text-orange-100 mb-1">Monthly Estimate</div>
                    <div className="text-2xl font-bold">
                      {formatPrice(calculateMonthlyPrice())}
                    </div>
                    {tiffin.monthlyDiscount && (
                      <div className="text-xs text-orange-100 mt-1">15% discount applied</div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Provider Info */}
            <div className="bg-white rounded-2xl p-6 shadow-lg shadow-slate-200/50">
              <h2 className="text-xl font-bold text-slate-900 mb-4">About the Provider</h2>
              <div className="flex items-start space-x-4">
                <div className="w-16 h-16 bg-linear-to-br from-orange-400 to-red-500 rounded-full flex items-center justify-center text-white font-bold text-2xl">
                  {tiffin.providerName.charAt(0)}
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-slate-900">{tiffin.providerName}</h3>
                  <div className="flex items-center mt-1">
                    <Award className="w-4 h-4 text-yellow-500 mr-1" />
                    <span className="text-sm text-slate-600">Verified Provider</span>
                  </div>
                  <p className="text-slate-600 mt-2">
                    Home chef specializing in {tiffin.cuisine.join(', ')} cuisine. 
                    Committed to providing hygienic, nutritious, and delicious meals 
                    made with fresh ingredients.
                  </p>
                  <div className="flex items-center mt-3 space-x-4">
                    <div className="flex items-center">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      <span className="ml-1 text-sm font-medium">{tiffin.rating}</span>
                      <span className="ml-1 text-sm text-slate-500">({tiffin.reviews} reviews)</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Card */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl p-6 shadow-lg shadow-slate-200/50 sticky top-24">
              <h2 className="text-xl font-bold text-slate-900 mb-4">Contact Provider</h2>
              
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-linear-to-br from-orange-400 to-red-500 rounded-full flex items-center justify-center text-white font-bold text-lg">
                    {tiffin.providerName.charAt(0)}
                  </div>
                  <div>
                    <div className="font-semibold text-slate-900">{tiffin.providerName}</div>
                    <div className="text-sm text-slate-500">Tiffin Provider</div>
                  </div>
                </div>

                <div className="space-y-3 pt-4 border-t border-slate-200">
                  <a
                    href={`tel:${tiffin.contactPhone}`}
                    className="flex items-center justify-center space-x-2 w-full py-3 bg-green-500 text-white rounded-xl hover:bg-green-600 transition-colors"
                  >
                    <Phone className="w-5 h-5" />
                    <span className="font-medium">Call Now</span>
                  </a>
                  <a
                    href={`mailto:${tiffin.contactEmail}`}
                    className="flex items-center justify-center space-x-2 w-full py-3 bg-orange-500 text-white rounded-xl hover:bg-orange-600 transition-colors"
                  >
                    <Mail className="w-5 h-5" />
                    <span className="font-medium">Send Message</span>
                  </a>
                </div>

                <div className="pt-4 border-t border-slate-200">
                  <div className="flex items-center space-x-2 text-slate-600 mb-2">
                    <Phone className="w-4 h-4" />
                    <span className="text-sm">{tiffin.contactPhone}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-slate-600">
                    <Mail className="w-4 h-4" />
                    <span className="text-sm">{tiffin.contactEmail}</span>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-200">
                  <p className="text-sm text-slate-500 mb-3">Want to try? Order a sample!</p>
                  <button className="w-full py-3 border-2 border-orange-500 text-orange-600 rounded-xl font-medium hover:bg-orange-50 transition-colors">
                    Request Sample Meal
                  </button>
                </div>

                {tiffin.weeklyDiscount && (
                  <div className="bg-green-50 rounded-xl p-4">
                    <div className="flex items-center space-x-2 text-green-700 mb-1">
                      <Tag className="w-4 h-4" />
                      <span className="font-medium text-sm">Weekly Discount</span>
                    </div>
                    <p className="text-xs text-green-600">Get 10% off on weekly subscription</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Menu Modal */}
      {show3DView && (
        <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4">
          <div className="relative w-full max-w-4xl max-h-[80vh] overflow-y-auto">
            <button
              onClick={() => setShow3DView(false)}
              className="absolute -top-12 right-0 text-white hover:text-slate-300"
            >
              <X className="w-8 h-8" />
            </button>
            
            <div className="bg-white rounded-2xl overflow-hidden">
              <div className="p-6">
                <h2 className="text-2xl font-bold text-slate-900 mb-2">{tiffin.name}</h2>
                <p className="text-slate-600 mb-6">Weekly Menu Preview</p>
                
                <div className="grid md:grid-cols-2 gap-4">
                  {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map((day) => (
                    <div key={day} className="p-4 bg-slate-50 rounded-xl">
                      <div className="font-semibold text-slate-900 mb-2">{day}</div>
                      <div className="space-y-1 text-sm text-slate-600">
                        <div><span className="text-slate-400">Breakfast:</span> Poha/Upma, Tea</div>
                        <div><span className="text-slate-400">Lunch:</span> Roti, Dal, Rice, Sabzi</div>
                        <div><span className="text-slate-400">Dinner:</span> Roti, Sabzi, Salad</div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-6 p-4 bg-orange-50 rounded-xl">
                  <p className="text-sm text-orange-800">
                    <strong>Note:</strong> Menu may vary based on seasonal availability. 
                    Special dishes prepared on festivals and weekends.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
