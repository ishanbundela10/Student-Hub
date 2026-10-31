import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getTiffins } from "@/api/tiffin";
import { TiffinService } from "@/types";
import { Search, MapPin, ChefHat } from "lucide-react";

const Tiffins: React.FC = () => {
    const [tiffins, setTiffins] = useState<TiffinService[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    // Filter & Search states
    const [selectedType, setSelectedType] = useState<string>("all");
    const [searchTerm, setSearchTerm] = useState<string>("");

    useEffect(() => {
        fetchTiffins();
    }, []);

    const fetchTiffins = async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await getTiffins();
            const data = response.data?.data || response.data || [];
            setTiffins(Array.isArray(data) ? data : []);
        } catch (err: any) {
            console.error("Error fetching tiffins:", err);
            setError(err.response?.data?.message || "Failed to load tiffins");
        } finally {
            setLoading(false);
        }
    };

    const filteredTiffins = tiffins.filter((tiffin) => {
        if (!tiffin) return false;

        const foodType = (tiffin.foodType || "").toLowerCase();
        const matchesType = selectedType === "all" ? true : foodType === selectedType.toLowerCase();

        const searchLower = searchTerm.toLowerCase();
        const name = (tiffin.name || (tiffin as any).kitchenName || "").toLowerCase();
        const description = (tiffin.description || "").toLowerCase();
        const city = (tiffin.address?.city || "").toLowerCase();
        const area = (tiffin.address?.area || "").toLowerCase();

        const matchesSearch =
            name.includes(searchLower) ||
            description.includes(searchLower) ||
            city.includes(searchLower) ||
            area.includes(searchLower);

        return matchesType && matchesSearch;
    });

    // ✅ Flexible Starting Price (Supports both simple schema and structured pricing schema)
    const getStartingPrice = (tiffin: any): number => {
        if (tiffin?.pricePerMeal) return tiffin.pricePerMeal;

        const prices: number[] = [];
        if (tiffin?.pricing?.pricePerMeal) prices.push(tiffin.pricing.pricePerMeal);
        if (tiffin?.pricing?.pricePerMeal) prices.push(tiffin.pricing.pricePerMeal);
        if (tiffin?.pricing?.pricePerMeal) prices.push(tiffin.pricing.pricePerMeal);

        return prices.length > 0 ? Math.min(...prices) : 120;
    };

    const getFoodTypeBadge = (type?: string) => {
        const foodType = (type || "").toLowerCase();
        switch (foodType) {
            case "veg":
                return (
                    <span className="flex items-center gap-1.5 bg-white/95 backdrop-blur-md text-green-700 text-xs font-extrabold px-3 py-1.5 rounded-full shadow-sm">
                        <span className="w-2.5 h-2.5 rounded-full bg-green-500 border border-white"></span> Veg
                    </span>
                );
            case "non-veg":
                return (
                    <span className="flex items-center gap-1.5 bg-white/95 backdrop-blur-md text-red-700 text-xs font-extrabold px-3 py-1.5 rounded-full shadow-sm">
                        <span className="w-2.5 h-2.5 rounded-full bg-red-500 border border-white"></span> Non-Veg
                    </span>
                );
            case "jain":
                return (
                    <span className="flex items-center gap-1.5 bg-white/95 backdrop-blur-md text-amber-700 text-xs font-extrabold px-3 py-1.5 rounded-full shadow-sm">
                        <span className="w-2.5 h-2.5 rounded-full bg-amber-500 border border-white"></span> Jain
                    </span>
                );
            case "vegan":
                return (
                    <span className="flex items-center gap-1.5 bg-white/95 backdrop-blur-md text-emerald-700 text-xs font-extrabold px-3 py-1.5 rounded-full shadow-sm">
                        <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 border border-white"></span> Vegan
                    </span>
                );
            default:
                return (
                    <span className="flex items-center gap-1.5 bg-white/95 backdrop-blur-md text-slate-700 text-xs font-extrabold px-3 py-1.5 rounded-full shadow-sm capitalize">
                        {type || "Food"}
                    </span>
                );
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 pt-28 pb-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">

                {/* Header */}
                <div className="text-center mb-12">
                    <div className="inline-flex items-center justify-center p-3 bg-orange-100 rounded-full mb-4">
                        <ChefHat className="w-8 h-8 text-orange-600" />
                    </div>
                    <h1 className="text-4xl font-extrabold text-slate-900 sm:text-5xl tracking-tight">
                        Homemade <span className="text-transparent bg-clip-text bg-linear-to-r from-orange-500 to-red-600">Tiffin Services</span>
                    </h1>
                    <p className="mt-4 text-lg text-slate-600 max-w-2xl mx-auto font-medium">
                        Healthy, hygienic, and authentic home-cooked meals delivered hot to your doorstep.
                    </p>
                </div>

                {/* Search & Filters Bar */}
                <div className="flex flex-col lg:flex-row items-center justify-between gap-5 mb-10 bg-white p-3 sm:p-4 rounded-2xl shadow-md shadow-slate-200/50 border border-slate-100">

                    {/* Search Bar */}
                    <div className="w-full lg:w-96 relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Search by kitchen, city, or sector..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:bg-white transition-all text-sm font-medium"
                        />
                    </div>

                    {/* Filter Pills */}
                    <div className="flex flex-wrap items-center gap-2 w-full lg:w-auto">
                        {["all", "veg", "non-veg", "jain", "vegan"].map((type) => {
                            const isSelected = selectedType === type;
                            return (
                                <button
                                    key={type}
                                    onClick={() => setSelectedType(type)}
                                    className={`px-5 py-2.5 rounded-xl text-sm font-bold capitalize transition-all ${isSelected
                                        ? "bg-linear-to-r from-orange-500 to-red-500 text-white shadow-lg shadow-orange-500/30"
                                        : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                                        }`}
                                >
                                    {type === "all" ? "All Tiffins" : type}
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* Content Section */}
                {loading ? (
                    // Loading Skeletons
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {[1, 2, 3, 4, 5, 6].map((n) => (
                            <div key={n} className="bg-white rounded-3xl p-4 shadow-sm animate-pulse border border-slate-100">
                                <div className="w-full h-52 bg-slate-200 rounded-2xl mb-4"></div>
                                <div className="h-6 bg-slate-200 rounded-lg w-3/4 mb-3"></div>
                                <div className="h-4 bg-slate-200 rounded-lg w-1/2 mb-5"></div>
                                <div className="h-12 bg-slate-200 rounded-xl"></div>
                            </div>
                        ))}
                    </div>
                ) : error ? (
                    // Error Message
                    <div className="text-center py-20 bg-white rounded-3xl border border-red-100 p-8 shadow-sm">
                        <span className="text-5xl block mb-4">⚠️</span>
                        <p className="text-red-600 font-bold text-lg mb-4">{error}</p>
                        <button
                            onClick={fetchTiffins}
                            className="bg-orange-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-orange-700 transition"
                        >
                            Try Again
                        </button>
                    </div>
                ) : filteredTiffins.length === 0 ? (
                    // Empty State
                    <div className="text-center py-20 bg-white rounded-3xl border border-slate-100 shadow-sm">
                        <span className="text-6xl block mb-4">🍲</span>
                        <h3 className="text-2xl font-bold text-slate-800 mt-4">No Tiffins Found</h3>
                        <p className="text-slate-500 mt-2 font-medium">Try adjusting your search or switching categories.</p>
                        <button
                            onClick={() => { setSearchTerm(""); setSelectedType("all"); }}
                            className="mt-6 text-orange-600 font-bold hover:underline"
                        >
                            Clear all filters
                        </button>
                    </div>
                ) : (
                    // Tiffin Cards Grid
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {filteredTiffins.map((tiffin) => (
                            <Link
                                to={`/tiffin/${tiffin._id}`}
                                key={tiffin._id}
                                className="bg-white rounded-3xl overflow-hidden shadow-md hover:shadow-2xl hover:shadow-orange-500/10 transition-all duration-300 border border-slate-100 flex flex-col group cursor-pointer"
                            >
                                {/* Thumbnail */}
                                <div className="relative h-56 w-full overflow-hidden p-2">
                                    <img
                                        src={tiffin.thumbnail || "https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=600"}
                                        alt={tiffin.name || "Tiffin Food"}
                                        className="w-full h-full object-cover rounded-2xl group-hover:scale-105 transition-transform duration-500"
                                    />
                                    <div className="absolute top-5 left-5">
                                        {getFoodTypeBadge(tiffin.foodType)}
                                    </div>
                                    <div className="absolute top-5 right-5 bg-white/95 backdrop-blur-md px-3 py-1.5 rounded-full text-xs font-extrabold text-slate-800 shadow-sm flex items-center gap-1">
                                        ⭐ {tiffin.rating || 4.5}
                                    </div>
                                </div>

                                {/* Body */}
                                <div className="p-6 flex-1 flex flex-col justify-between">
                                    <div>
                                        <h3 className="text-xl font-extrabold text-slate-900 group-hover:text-orange-600 transition-colors">
                                            {tiffin.name || (tiffin as any).kitchenName || "Unnamed Kitchen"}
                                        </h3>

                                        {/* Kitchen Location */}
                                        {tiffin.address && (
                                            <div className="flex items-center text-xs text-slate-500 mt-2 font-semibold">
                                                <MapPin className="w-4 h-4 text-orange-500 mr-1 shrink-0" />
                                                <span className="truncate">
                                                    {[tiffin.address.area, tiffin.address.city].filter(Boolean).join(", ")}
                                                </span>
                                            </div>
                                        )}

                                        <p className="text-slate-600 text-sm mt-3 line-clamp-2 leading-relaxed">
                                            {tiffin.description || (tiffin as any).typicalMeal || "Fresh home-cooked food delivered daily."}
                                        </p>

                                        {/* Typical Meal / Items Preview */}
                                        {/* {tiffin.itemsIncluded && tiffin.itemsIncluded.length > 0 ? (
                                            <div className="mt-4 flex flex-wrap gap-2">
                                                {tiffin.itemsIncluded.slice(0, 4).map((item, idx) => (
                                                    <span
                                                        key={idx}
                                                        className="bg-orange-50 text-orange-700 text-xs px-2.5 py-1 rounded-md border border-orange-100 font-bold"
                                                    >
                                                        {item.itemName} <span className="opacity-75">({item.quantity})</span>
                                                    </span>
                                                ))}
                                                {tiffin.itemsIncluded.length > 4 && (
                                                    <span className="text-xs text-slate-500 self-center font-bold bg-slate-100 px-2 py-1 rounded-md">
                                                        +{tiffin.itemsIncluded.length - 4} more
                                                    </span>
                                                )}
                                            </div>
                                        ) : (tiffin as any).typicalMeal ? (
                                            <div className="mt-4 bg-orange-50/60 p-2.5 rounded-xl border border-orange-100 text-xs font-semibold text-orange-900 truncate">
                                                🍱 {(tiffin as any).typicalMeal}
                                            </div>
                                        ) : null} */}
                                    </div>

                                    {/* Footer & Pricing */}
                                    <div className="mt-6 pt-5 border-t border-slate-100 flex items-center justify-between">
                                        <div>
                                            <span className="text-xs text-slate-500 font-bold uppercase tracking-wider block mb-0.5">Starting at</span>
                                            <div className="text-2xl font-black text-slate-900">
                                                ₹{getStartingPrice(tiffin)}{" "}
                                                <span className="text-sm text-slate-500 font-medium normal-case">/ meal</span>
                                            </div>
                                        </div>

                                        <div className="bg-slate-900 group-hover:bg-orange-600 text-white text-sm font-bold px-5 py-3 rounded-xl transition-all shadow-md">
                                            View Details
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Tiffins;