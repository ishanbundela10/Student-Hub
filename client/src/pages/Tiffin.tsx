import { useState } from 'react';
import TiffinCard from '../components/TiffinCard';
import { mockTiffinServices } from '@/data/mockData';
import { TiffinService } from '@/types';
import { Filter, Search, MapPin, IndianRupee } from 'lucide-react';

export default function Tiffin() {
  const [searchTerm, setSearchTerm] = useState('');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 150]);
  const [showFilters, setShowFilters] = useState(false);
  const [selectedCuisine, setSelectedCuisine] = useState<string>('all');

  const filteredTiffins = mockTiffinServices.filter((tiffin: TiffinService) => {
    const matchesSearch = tiffin.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         tiffin.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         tiffin.providerName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesPrice = tiffin.pricePerMeal >= priceRange[0] && tiffin.pricePerMeal <= priceRange[1];
    const matchesCuisine = selectedCuisine === 'all' || tiffin.cuisine.includes(selectedCuisine);
    return matchesSearch && matchesPrice && matchesCuisine;
  });

  const cuisines = ['all', 'North Indian', 'South Indian', 'Healthy', 'Maharashtrian', 'Bengali'];

  return (
    <div className="min-h-screen pt-20 pb-12 bg-linear-to-br from-orange-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-slate-900 mb-2">Tiffin Services</h1>
          <p className="text-lg text-slate-600">Homely food from local housewives, food servers etc - healthy, hygienic & delicious</p>
        </div>

        {/* Info Banner */}
        <div className="bg-linear-to-r from-orange-500 to-red-500 rounded-2xl p-6 mb-8 text-white">
          <div className="flex items-start space-x-4">
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center shrink-0">
              <span className="text-2xl">👩‍🍳</span>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-2">Are you a housewife looking to earn?</h3>
              <p className="text-orange-100 mb-4">
                Join our tiffin service network and cook for students in your area. Flexible hours, great earnings!
              </p>
              <button className="px-6 py-2 bg-white text-orange-600 font-medium rounded-lg hover:bg-orange-50 transition-colors">
                Register as Provider
              </button>
            </div>
          </div>
        </div>

        {/* Search and Filter Bar */}
        <div className="bg-white rounded-2xl shadow-lg shadow-slate-200/50 p-6 mb-8">
          <div className="flex flex-col md:flex-row md:items-center gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="text"
                placeholder="Search by name, location, or cuisine..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>

            {/* Filter Toggle */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center justify-center space-x-2 px-6 py-3 rounded-xl font-medium transition-colors ${
                showFilters
                  ? 'bg-orange-100 text-orange-700'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              <Filter className="w-5 h-5" />
              <span>Filters</span>
            </button>
          </div>

          {/* Cuisine Tags */}
          <div className="flex flex-wrap gap-2 mt-4">
            {cuisines.map((cuisine) => (
              <button
                key={cuisine}
                onClick={() => setSelectedCuisine(cuisine)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  selectedCuisine === cuisine
                    ? 'bg-orange-500 text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {cuisine === 'all' ? 'All' : cuisine}
              </button>
            ))}
          </div>

          {/* Expanded Filters */}
          {showFilters && (
            <div className="mt-6 pt-6 border-t border-slate-200 grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Price Range (per meal)
                </label>
                <div className="flex items-center space-x-4">
                  <div className="relative flex-1">
                    <IndianRupee className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type="number"
                      value={priceRange[0]}
                      onChange={(e) => setPriceRange([parseInt(e.target.value) || 0, priceRange[1]])}
                      className="w-full pl-8 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg"
                      placeholder="Min"
                    />
                  </div>
                  <span className="text-slate-400">-</span>
                  <div className="relative flex-1">
                    <IndianRupee className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type="number"
                      value={priceRange[1]}
                      onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value) || 150])}
                      className="w-full pl-8 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg"
                      placeholder="Max"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Location
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <select className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg appearance-none">
                    <option>All Locations</option>
                    <option>Bangalore</option>
                    <option>Delhi</option>
                    <option>Mumbai</option>
                    <option>Kolkata</option>
                    <option>Pune</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Meal Types
                </label>
                <div className="flex flex-wrap gap-2">
                  {['Breakfast', 'Lunch', 'Dinner'].map((meal) => (
                    <label key={meal} className="flex items-center space-x-2">
                      <input type="checkbox" className="rounded text-orange-600" />
                      <span className="text-sm text-slate-600">{meal}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Offers
                </label>
                <div className="flex flex-wrap gap-2">
                  <label className="flex items-center space-x-2">
                    <input type="checkbox" className="rounded text-orange-600" />
                    <span className="text-sm text-slate-600">Weekly Discount</span>
                  </label>
                  <label className="flex items-center space-x-2">
                    <input type="checkbox" className="rounded text-orange-600" />
                    <span className="text-sm text-slate-600">Monthly Discount</span>
                  </label>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-slate-600">
            Showing <span className="font-semibold text-slate-900">{filteredTiffins.length}</span> tiffin services
          </p>
        </div>

        {/* Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTiffins.map((tiffin) => (
            <TiffinCard key={tiffin._id} tiffin={tiffin} />
          ))}
        </div>

        {filteredTiffins.length === 0 && (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-8 h-8 text-slate-400" />
            </div>
            <h3 className="text-lg font-semibold text-slate-900 mb-2">No tiffin services found</h3>
            <p className="text-slate-600">Try adjusting your search or filters</p>
          </div>
        )}
      </div>
    </div>
  );
}
