import { useState, useEffect } from 'react';
import PropertyCard from '../components/PropertyCard';
import { getAllProperties } from '@/api/property';
import { Property } from '@/types';
import { Filter, Search, MapPin, IndianRupee } from 'lucide-react';

export default function Rooms() {
  const [searchTerm, setSearchTerm] = useState('');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 20000]);
  const [showFilters, setShowFilters] = useState(false);
  const [applyFilters, setApplyFilters] = useState(false);
  const [rooms, setRooms] = useState<Property[]>([])

  useEffect(() => {
    const fetchHostels = async () => {
      try {
        const res = await getAllProperties("room")

        console.log(res.data.data)
        setRooms(res.data.data)
      } catch (error) {
        console.log(error)
        throw error;
      }
    }

    fetchHostels()
  }, [])

  const filteredRooms = !applyFilters
    ? rooms
    : rooms.filter((hostel) => {
      const matchesSearch =
        hostel.title
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        hostel.city
          .toLowerCase()
          .includes(searchTerm.toLowerCase());

      const matchesPrice =
        hostel.price >= priceRange[0] &&
        hostel.price <= priceRange[1];

      return matchesSearch && matchesPrice;
    });

  const clearFilters = () => {
    setSearchTerm("");
    setPriceRange([0, 20000]);
    setApplyFilters(false);
  };

  return (
    <div className="min-h-screen pt-20 pb-12 bg-linear-to-br from-violet-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-slate-900 mb-2">Rented Rooms</h1>
          <p className="text-lg text-slate-600">Find your perfect room near campus</p>
        </div>

        {/* Search and Filter Bar */}
        <div className="bg-white rounded-2xl shadow-lg shadow-slate-200/50 p-6 mb-8">
          <div className="flex flex-col md:flex-row md:items-center gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="text"
                placeholder="Search by location or room name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500"
              />
            </div>

            {/* Filter Toggle */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center justify-center space-x-2 px-6 py-3 rounded-xl font-medium transition-colors ${showFilters
                  ? 'bg-violet-100 text-violet-700'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
            >
              <Filter className="w-5 h-5" />
              <span>Filters</span>
            </button>
            <button
                onClick={() => setApplyFilters(true)}
                className="px-5 py-3 rounded-xl bg-indigo-600 text-white font-medium hover:bg-indigo-700 transition-colors"
              >
                Apply
              </button>
              <button
                onClick={clearFilters}
                className="px-5 py-3 rounded-xl bg-slate-200 text-slate-700 font-medium hover:bg-slate-300 transition-colors"
              >
                Clear
              </button>
          </div>

          {/* Expanded Filters */}
          {showFilters && (
            <div className="mt-6 pt-6 border-t border-slate-200 grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Price Range (per month)
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
                      onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value) || 20000])}
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
                    <option>Pune</option>
                    <option>Hyderabad</option>
                  </select>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-slate-600">
            Showing <span className="font-semibold text-slate-900">{filteredRooms.length}</span> rooms
          </p>
        </div>

        {/* Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredRooms.map((room) => (
            <PropertyCard key={room._id} property={room} />
          ))}
        </div>

        {filteredRooms.length === 0 && (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-8 h-8 text-slate-400" />
            </div>
            <h3 className="text-lg font-semibold text-slate-900 mb-2">No rooms found</h3>
            <p className="text-slate-600">Try adjusting your search or filters</p>
          </div>
        )}
      </div>
    </div>
  );
}
