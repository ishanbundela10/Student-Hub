import { Link } from 'react-router-dom';
import { MapPin, Star, Wifi } from 'lucide-react';
import { Property } from '../types';

interface PropertyCardProps {
  property: Property;
}

export default function PropertyCard({ property }: PropertyCardProps) {
  const formatPrice = (price: number, priceType: string) => {
    const formatted = new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(price);

    const period = priceType === 'per_year' ? '/year' : priceType === 'per_month' ? '/month' : '/meal';
    return `${formatted}${period}`;
  };

  const propertyTypeConfig = {
    hostel: {
      label: "Hostel",
      className: "bg-indigo-100 text-indigo-700",
    },
    room: {
      label: "Room",
      className: "bg-violet-100 text-violet-700",
    },
    pg: {
      label: "PG",
      className: "bg-orange-100 text-orange-700",
    },
  };

  const type = propertyTypeConfig[property.propertyType];

  const amenities = property.propertyDetails?.amenities || [];
  
  return (
    <Link
      to={`/property/${property._id}`}
      className="group bg-white rounded-2xl overflow-hidden shadow-lg shadow-slate-200/50 hover:shadow-2xl hover:shadow-violet-200/50 transition-all duration-300 hover:-translate-y-1"
    >
      <div className="bg-gray-50 border border-gray-200 rounded-3xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
        {/* Image */}
        <div className="relative h-48 overflow-hidden">
          <div className="absolute inset-0 bg-linear-to-t from-black/40 to-transparent">
            <img
              src={
                property.images?.[0] ||
                "https://via.placeholder.com/600x400?text=No+Image"
              }
              alt={property.title}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
            />
          </div>
          <div className="absolute top-3 left-3 flex items-center space-x-2">
            {/* <span className={`px-3 py-1 rounded-full text-xs font-medium ${property.propertyType === 'hostel'
              ? 'bg-indigo-100 text-indigo-700'
              : 'bg-violet-100 text-violet-700'
              }`}>
              {property.propertyType === 'hostel' ? 'Hostel' : 'Room'}
              </span> */}
            <span className={`px-3 py-1 rounded-full text-xs font-medium ${type.className}`}>
              {type.label}
            </span>

            {property.isAvailable && (
              <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                Available
              </span>
            )}
            {property.girls_only && (
              <span className="px-3 py-1 bg-pink-100 text-pink-700 rounded-full text-xs font-medium">
                Girls Only
              </span>
            )}
          </div>
          {/* <div className="absolute bottom-3 right-3 px-3 py-1.5 bg-white/90 backdrop-blur-sm rounded-lg"> */}
          {/* <span className="text-lg font-bold text-slate-900">
            {formatPrice(property.price, property.priceType)}
            </span> */}
          <div className="absolute bottom-3 right-0 ">
            <div className="relative bg-violet-600 text-white px-6 py-2 font-semibold shadow-lg rounded-l-2xl">
              {formatPrice(property.price, property.priceType)}
              <div className="absolute top-full right-0 border-l-10px border-l-violet-800 border-t-10px border-t-transparent"></div>
            </div>
          </div>
        </div>
        {/* </div> */}

        {/* Content */}
        <div className="p-5 space-y-3">
          <h3 className="text-lg font-semibold text-slate-900 group-hover:text-violet-600 transition-colors line-clamp-1">
            {property.title.toUpperCase()}
          </h3>

          <div className="flex items-center text-slate-500">
            <MapPin className="w-4 h-4 mr-1" />
            <span className="text-sm line-clamp-1">{property.address} , {property.city}, {property.state}</span>
          </div>

          {/* Rating */}
          <div className="flex items-center space-x-1">
            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
            <span className="text-sm font-medium text-slate-700">{property.rating}</span>
            <span className="text-sm text-slate-500">({property.reviews} reviews)</span>
          </div>

          {/* Amenities Preview */}
          <div className="flex items-center space-x-2 pt-2 border-t border-slate-100">
            <Wifi className="w-4 h-4 text-slate-400" />
            <span className="text-xs text-slate-500">
              {amenities
                ?.slice(0, 3)
                .map(
                  (amenity) =>
                    amenity.charAt(0).toUpperCase() + amenity.slice(1)
                )
                .join(", ")}
              {amenities &&
                amenities.length > 3 &&
                ` +${property.propertyDetails.amenities.length - 3} more`}            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
