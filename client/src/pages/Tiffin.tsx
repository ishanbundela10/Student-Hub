import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom"; // 👈 Router se navigate karne ke liye
import { getTiffins } from "@/api/tiffin";

// 1. Interfaces
interface ItemIncluded {
    itemName: string;
    quantity: string;
}

interface Tiffin {
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

const Tiffins: React.FC = () => {
    const [tiffins, setTiffins] = useState<Tiffin[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    // Filter & Search states
    const [selectedType, setSelectedType] = useState<string>("all");
    const [searchTerm, setSearchTerm] = useState<string>("");

    // 2. Fetch Tiffins from Backend
    useEffect(() => {
        fetchTiffins();
    }, []);

    const fetchTiffins = async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await getTiffins();

            // ApiResponse format: response.data.data
            const data = response.data?.data || response.data || [];
            setTiffins(data);
        } catch (err: any) {
            console.error("Error fetching tiffins:", err);
            setError(err.response?.data?.message || "Failed to load tiffins");
        } finally {
            setLoading(false);
        }
    };

    // 3. Filter Logic
    const filteredTiffins = tiffins.filter((tiffin) => {
        const matchesType =
            selectedType === "all" ? true : tiffin.foodType === selectedType;
        const matchesSearch = tiffin.name
            .toLowerCase()
            .includes(searchTerm.toLowerCase());
        return matchesType && matchesSearch;
    });

    const getFoodTypeBadge = (type: string) => {
        switch (type) {
            case "veg":
                return (
                    <span className="flex items-center gap-1 bg-green-100 text-green-700 text-xs font-bold px-2.5 py-1 rounded-full border border-green-300">
                        <span className="w-2 h-2 rounded-full bg-green-600"></span> Veg
                    </span>
                );
            case "non-veg":
                return (
                    <span className="flex items-center gap-1 bg-red-100 text-red-700 text-xs font-bold px-2.5 py-1 rounded-full border border-red-300">
                        <span className="w-2 h-2 rounded-full bg-red-600"></span> Non-Veg
                    </span>
                );
            case "jain":
                return (
                    <span className="flex items-center gap-1 bg-amber-100 text-amber-700 text-xs font-bold px-2.5 py-1 rounded-full border border-amber-300">
                        <span className="w-2 h-2 rounded-full bg-amber-500"></span> Jain
                    </span>
                );
            default:
                return (
                    <span className="bg-gray-100 text-gray-700 text-xs font-bold px-2.5 py-1 rounded-full">
                        {type}
                    </span>
                );
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 py-10 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="text-center mb-10">
                    <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl">
                        🍱 Homemade <span className="text-orange-600">Tiffin Services</span>
                    </h1>
                    <p className="mt-3 text-lg text-gray-600 max-w-2xl mx-auto">
                        Healthy, hygienic, and authentic home-cooked meals delivered hot to your doorstep.
                    </p>
                </div>

                {/* Search & Filters */}
                <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-8 bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
                    {/* Search Bar */}
                    <div className="w-full md:w-80">
                        <input
                            type="text"
                            placeholder="🔍 Search thali, meal..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm"
                        />
                    </div>

                    {/* Filter Pills */}
                    <div className="flex flex-wrap gap-2">
                        {["all", "veg", "non-veg", "jain"].map((type) => (
                            <button
                                key={type}
                                onClick={() => setSelectedType(type)}
                                className={`px-4 py-2 rounded-xl text-sm font-semibold capitalize transition ${
                                    selectedType === type
                                        ? "bg-orange-600 text-white shadow-md shadow-orange-200"
                                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                                }`}
                            >
                                {type === "all" ? "All Tiffins" : type}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Content Section */}
                {loading ? (
                    // Loading Skeletons
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[1, 2, 3, 4, 5, 6].map((n) => (
                            <div key={n} className="bg-white rounded-2xl p-4 shadow-sm animate-pulse">
                                <div className="w-full h-48 bg-gray-200 rounded-xl mb-4"></div>
                                <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
                                <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
                                <div className="h-10 bg-gray-200 rounded-xl"></div>
                            </div>
                        ))}
                    </div>
                ) : error ? (
                    // Error Message
                    <div className="text-center py-16 bg-white rounded-2xl border border-red-100 p-6">
                        <p className="text-red-600 font-semibold mb-3">{error}</p>
                        <button
                            onClick={fetchTiffins}
                            className="bg-orange-600 text-white px-5 py-2 rounded-xl font-medium hover:bg-orange-700"
                        >
                            Retry
                        </button>
                    </div>
                ) : filteredTiffins.length === 0 ? (
                    // Empty State
                    <div className="text-center py-16 bg-white rounded-2xl border border-gray-200">
                        <span className="text-5xl">🍲</span>
                        <h3 className="text-xl font-bold text-gray-800 mt-4">No Tiffins Found</h3>
                        <p className="text-gray-500 mt-1">Try adjusting your search or filters.</p>
                    </div>
                ) : (
                    // Tiffin Cards Grid
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredTiffins.map((tiffin) => (
                            // 👇 Poori card ko clickable Link bana diya
                            <Link
                                to={`/tiffin/${tiffin._id}`}
                                key={tiffin._id}
                                className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 flex flex-col group cursor-pointer"
                            >
                                {/* Thumbnail */}
                                <div className="relative h-52 w-full overflow-hidden">
                                    <img
                                        src={tiffin.thumbnail || "https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=600"}
                                        alt={tiffin.name}
                                        className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                                    />
                                    <div className="absolute top-3 left-3">
                                        {getFoodTypeBadge(tiffin.foodType)}
                                    </div>
                                    <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-2.5 py-1 rounded-full text-xs font-bold text-gray-800 shadow">
                                        ⭐ {tiffin.rating || 4.5}
                                    </div>
                                </div>

                                {/* Body */}
                                <div className="p-5 flex-1 flex flex-col justify-between">
                                    <div>
                                        <h3 className="text-xl font-bold text-gray-900 group-hover:text-orange-600 transition">
                                            {tiffin.name}
                                        </h3>
                                        <p className="text-gray-600 text-sm mt-2 line-clamp-2">
                                            {tiffin.description}
                                        </p>

                                        {/* What's Inside Preview */}
                                        <div className="mt-4 flex flex-wrap gap-1.5">
                                            {tiffin.itemsIncluded?.slice(0, 4).map((item, idx) => (
                                                <span
                                                    key={idx}
                                                    className="bg-orange-50 text-orange-800 text-xs px-2 py-1 rounded-md border border-orange-100 font-medium"
                                                >
                                                    {item.itemName} ({item.quantity})
                                                </span>
                                            ))}
                                            {tiffin.itemsIncluded?.length > 4 && (
                                                <span className="text-xs text-gray-500 self-center">
                                                    +{tiffin.itemsIncluded.length - 4} more
                                                </span>
                                            )}
                                        </div>
                                    </div>

                                    {/* Footer & Pricing */}
                                    <div className="mt-6 pt-4 border-t border-gray-100 flex items-center justify-between">
                                        <div>
                                            <span className="text-xs text-gray-500 font-medium">Starting at</span>
                                            <div className="text-xl font-extrabold text-gray-900">
                                                ₹{tiffin.pricing.oneTime}{" "}
                                                <span className="text-xs text-gray-500 font-normal">/ meal</span>
                                            </div>
                                        </div>

                                        <span className="bg-orange-600 group-hover:bg-orange-700 text-white text-sm font-semibold px-4 py-2.5 rounded-xl transition shadow-md shadow-orange-100">
                                            View Details →
                                        </span>
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