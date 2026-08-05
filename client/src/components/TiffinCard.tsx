import { Link } from 'react-router-dom';
import { MapPin, Star, Utensils, Clock, Tag } from 'lucide-react';
import { TiffinService } from '../types';

interface TiffinCardProps {
  tiffin: TiffinService;
}

export default function TiffinCard({ tiffin }: TiffinCardProps) {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(price);
  };

  return (
    <Link
      to={`/tiffin/${tiffin._id}`}
      className="group bg-white rounded-2xl overflow-hidden shadow-lg shadow-slate-200/50 hover:shadow-2xl hover:shadow-orange-200/50 transition-all duration-300 hover:-translate-y-1"
    >
      {/* Image */}
      <div className="relative h-48 overflow-hidden">
        <img
          src={tiffin.images[0]}
          alt={tiffin.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
        <div className="absolute top-3 left-3 flex items-center space-x-2">
          <span className="px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-xs font-medium">
            {tiffin.cuisine[0]}
          </span>
          {tiffin.available && (
            <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
              Available
            </span>
          )}
        </div>
        {tiffin.monthlyDiscount && (
          <div className="absolute top-3 right-3 px-3 py-1 bg-red-100 text-red-700 rounded-full text-xs font-medium">
            Monthly Discount
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-5 space-y-3">
        <h3 className="text-lg font-semibold text-slate-900 group-hover:text-orange-600 transition-colors">
          {tiffin.name}
        </h3>
        
        <p className="text-sm text-slate-500">by {tiffin.providerName}</p>

        <div className="flex items-center text-slate-500">
          <MapPin className="w-4 h-4 mr-1" />
          <span className="text-sm line-clamp-1">{tiffin.location}</span>
        </div>

        {/* Rating */}
        <div className="flex items-center space-x-1">
          <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
          <span className="text-sm font-medium text-slate-700">{tiffin.rating}</span>
          <span className="text-sm text-slate-500">({tiffin.reviews} reviews)</span>
        </div>

        {/* Meal Types */}
        <div className="flex items-center space-x-2 pt-2 border-t border-slate-100">
          <Clock className="w-4 h-4 text-slate-400" />
          <div className="flex space-x-1">
            {tiffin.mealTypes.map((meal) => (
              <span
                key={meal}
                className="px-2 py-0.5 bg-slate-100 text-slate-600 text-xs rounded capitalize"
              >
                {meal}
              </span>
            ))}
          </div>
        </div>

        {/* Price */}
        <div className="flex items-center justify-between pt-2 border-t border-slate-100">
          <div className="flex items-center text-orange-600">
            <Utensils className="w-4 h-4 mr-1" />
            <span className="text-lg font-bold">{formatPrice(tiffin.pricePerMeal)}/meal</span>
          </div>
          {tiffin.weeklyDiscount && (
            <div className="flex items-center text-green-600">
              <Tag className="w-4 h-4 mr-1" />
              <span className="text-xs font-medium">Weekly discount</span>
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}
