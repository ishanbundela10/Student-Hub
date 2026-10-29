import { Link } from 'react-router-dom';
import { MapPin, Star, Clock, CheckCircle2, Leaf } from 'lucide-react';
import { TiffinService } from '../types';

interface TiffinCardProps {
  tiffin: TiffinService;
}

const formatPrice = (price?: number) => {
  if (!price) return '₹0';

  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(price);
};

const getFoodTypeStyles = (foodType?: string) => {
  const value = (foodType || '').toLowerCase();

  if (value.includes('non')) {
    return 'bg-red-100 text-red-700';
  }

  if (value.includes('jain')) {
    return 'bg-amber-100 text-amber-700';
  }

  if (value.includes('vegan')) {
    return 'bg-emerald-100 text-emerald-700';
  }

  return 'bg-green-100 text-green-700';
};

export default function TiffinCard({ tiffin }: TiffinCardProps) {
  const image = tiffin.thumbnail || tiffin.images?.[0] || 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=600';
  const title = tiffin.kitchenName || tiffin.name || 'Home Kitchen';
  const location = [tiffin.address?.area, tiffin.address?.city, tiffin.address?.state]
    .filter(Boolean)
    .join(', ');
  const mealText = tiffin.mealTime || 'Both';
  const price = tiffin.pricing?.pricePerMeal ?? 0;

  return (
    <Link
      to={`/tiffin/${tiffin._id}`}
      className="group block bg-white rounded-3xl overflow-hidden shadow-lg shadow-slate-200/50 hover:shadow-2xl hover:shadow-orange-200/50 transition-all duration-300 hover:-translate-y-1 border border-slate-100"
    >
      <div className="relative h-52 overflow-hidden">
        <img
          src={image}
          alt={title}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />

        <div className="absolute inset-0 bg-linear-to-t from-black/40 via-transparent to-transparent" />

        <div className="absolute top-3 left-3 flex flex-wrap gap-2">
          <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${getFoodTypeStyles(tiffin.foodType)}`}>
            {tiffin.foodType || 'Veg'}
          </span>
          {tiffin.isAvailable !== false && (
            <span className="px-2.5 py-1 rounded-full bg-green-100 text-green-700 text-[10px] font-bold">
              Available
            </span>
          )}
        </div>

        <div className="absolute bottom-3 right-3 bg-white/90 text-slate-900 px-3 py-1.5 rounded-full shadow-md text-sm font-bold">
          {formatPrice(price)}/meal
        </div>
      </div>

      <div className="p-5 space-y-3">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h3 className="text-lg font-bold text-slate-900 group-hover:text-orange-600 transition-colors line-clamp-1">
              {title}
            </h3>
            <p className="text-sm text-slate-500 mt-1">by {tiffin.providerName}</p>
          </div>
        </div>

        <div className="flex items-center text-slate-500 text-sm">
          <MapPin className="w-4 h-4 mr-1.5 text-orange-500" />
          <span className="line-clamp-1">{location || 'Local area'}</span>
        </div>

        <div className="flex items-center gap-1 text-sm">
          <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
          <span className="font-semibold text-slate-800">{tiffin.rating ?? 4.5}</span>
          <span className="text-slate-500">({tiffin.reviewsCount ?? 0} reviews)</span>
        </div>

        <div className="flex items-center justify-between pt-3 border-t border-slate-100 text-sm text-slate-600">
          <div className="flex items-center gap-1.5">
            <Clock className="w-4 h-4 text-slate-400" />
            <span>{mealText}</span>
          </div>

          <div className="flex items-center gap-1.5 text-emerald-600 font-medium">
            <CheckCircle2 className="w-4 h-4" />
            <span>{tiffin.deliveryOptions || 'Home Delivery'}</span>
          </div>
        </div>

        <div className="flex items-center justify-between pt-2">
          <div className="flex items-center gap-1 text-slate-600 text-xs font-medium">
            <Leaf className="w-3.5 h-3.5 text-green-600" />
            <span>Fresh & Hygienic</span>
          </div>
          <span className="text-orange-600 text-sm font-bold">View details</span>
        </div>
      </div>
    </Link>
  );
}
