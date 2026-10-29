import React, { useState, FormEvent } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Loader2, Utensils, MapPin, Camera, Phone, Clock, ArrowLeft } from "lucide-react";
import { addTiffin } from "@/api/tiffin";


// Predefined Indian States for easy selection
const INDIAN_STATES = [
    "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh",
    "Delhi", "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand",
    "Karnataka", "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur",
    "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Punjab", "Rajasthan",
    "Sikkim", "Tamil Nadu", "Telangana", "Tripura", "Uttar Pradesh",
    "Uttarakhand", "West Bengal"
];

// Initial form state
const initialFormData = {
    kitchenName: "",
    providerName: "",
    description: "",
    foodType: "Pure Veg",
    typicalMeal: "",
    pricePerMeal: "",
    pricePerMonth: "",
    mealTime: "Both",
    lunchTiming: "12:30 PM to 2:00 PM",
    dinnerTiming: "7:30 PM to 9:30 PM",
    deliveryOptions: "Home Delivery",
    area: "",
    city: "",
    state: "",
    pincode: "",
    contactPhone: "",
};

const AddTiffin: React.FC = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [thumbnail, setThumbnail] = useState<File | null>(null);
    const [formData, setFormData] = useState(initialFormData);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!thumbnail) {
            alert("Please upload a photo of your food.");
            return;
        }

        setLoading(true);
        const data = new FormData();

        // Append all text fields
        Object.keys(formData).forEach(key => {
            data.append(key, formData[key as keyof typeof formData]);
        });

        // Append image
        data.append("thumbnail", thumbnail);

        try {
            await addTiffin(data);

            alert("Congratulations! Your Tiffin Service is now Live! 🎉");

            // Clear form state & uploaded file
            setFormData(initialFormData);
            setThumbnail(null);

            // Redirect to provider dashboard
            navigate("/dashboard");

        } catch (error: any) {
            alert(error.response?.data?.message || "Failed to add service. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 pt-24 pb-12 px-4">
            {/* Centered Container */}
            <div className="max-w-2xl mx-auto">
                <Link
                    to="/dashboard"
                    className="inline-flex items-center text-orange-600 hover:text-orange-700 font-semibold mb-6 transition-colors group"
                >
                    <ArrowLeft className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform" />
                    Back to Dashboard
                </Link>

                <div className="text-center mb-8">
                    <h1 className="text-3xl font-extrabold text-slate-900 mb-2">
                        Start Your Food Business 🍲
                    </h1>
                    <p className="text-slate-600">
                        Fill out this simple form to start getting orders from students near you.
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">

                    {/* --- STEP 1: ABOUT YOU --- */}
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                        <h2 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                            <Utensils className="w-5 h-5 text-orange-500" />
                            About Your Kitchen
                        </h2>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-1">What do you call your kitchen?</label>
                                <input type="text" name="kitchenName" value={formData.kitchenName} onChange={handleChange} placeholder="e.g., Sharma Aunty's Kitchen" className="w-full border border-slate-300 p-3 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none" required />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 mb-1">Your Full Name</label>
                                    <input type="text" name="providerName" value={formData.providerName} onChange={handleChange} placeholder="e.g., Sunita Sharma" className="w-full border border-slate-300 p-3 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none" required />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 mb-1">Food Type</label>
                                    <select name="foodType" value={formData.foodType} onChange={handleChange} className="w-full border border-slate-300 p-3 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none">
                                        <option value="Pure Veg">🟢 Pure Veg</option>
                                        <option value="Non-Veg">🔴 Non-Veg</option>
                                        <option value="Jain">🟡 Jain Food</option>
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-1">Tell us a little about your food</label>
                                <textarea name="description" value={formData.description} onChange={handleChange} placeholder="e.g., I cook fresh, less-oil, home-style food perfect for students..." rows={3} className="w-full border border-slate-300 p-3 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none" required />
                            </div>
                        </div>
                    </div>

                    {/* --- STEP 2: THE FOOD & TIMINGS --- */}
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                        <h2 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                            <Clock className="w-5 h-5 text-orange-500" />
                            Menu, Pricing & Timings
                        </h2>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-1">What is in a standard meal?</label>
                                <textarea name="typicalMeal" value={formData.typicalMeal} onChange={handleChange} placeholder="e.g., 4 Roti, 1 Dal, 1 Dry Sabzi, Rice, Salad." rows={2} className="w-full border border-slate-300 p-3 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none" required />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 mb-1">Price for 1 Meal (₹)</label>
                                    <input type="number" name="pricePerMeal" value={formData.pricePerMeal} onChange={handleChange} placeholder="e.g., 80" className="w-full border border-slate-300 p-3 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none" required />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 mb-1">Price for 1 Month (Optional)</label>
                                    <input type="number" name="pricePerMonth" value={formData.pricePerMonth} onChange={handleChange} placeholder="e.g., 2200" className="w-full border border-slate-300 p-3 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none" />
                                </div>
                            </div>

                            {/* TIMINGS */}
                            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 mt-4">
                                <label className="block text-sm font-semibold text-slate-700 mb-2">When do you serve food?</label>
                                <select name="mealTime" value={formData.mealTime} onChange={handleChange} className="w-full border border-slate-300 p-3 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none mb-4">
                                    <option value="Both">☀️🌙 Both Lunch & Dinner</option>
                                    <option value="Lunch">☀️ Lunch Only</option>
                                    <option value="Dinner">🌙 Dinner Only</option>
                                </select>

                                {(formData.mealTime === "Lunch" || formData.mealTime === "Both") && (
                                    <div className="mb-3">
                                        <label className="block text-sm font-semibold mb-1 text-orange-600">☀️ Lunch Ready By:</label>
                                        <input type="text" name="lunchTiming" value={formData.lunchTiming} onChange={handleChange} placeholder="e.g., 12:30 PM to 2:30 PM" className="w-full border border-slate-300 p-3 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none" required />
                                    </div>
                                )}

                                {(formData.mealTime === "Dinner" || formData.mealTime === "Both") && (
                                    <div>
                                        <label className="block text-sm font-semibold mb-1 text-indigo-600">🌙 Dinner Ready By:</label>
                                        <input type="text" name="dinnerTiming" value={formData.dinnerTiming} onChange={handleChange} placeholder="e.g., 7:30 PM to 9:30 PM" className="w-full border border-slate-300 p-3 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none" required />
                                    </div>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-1">Delivery Method</label>
                                <select name="deliveryOptions" value={formData.deliveryOptions} onChange={handleChange} className="w-full border border-slate-300 p-3 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none">
                                    <option value="Home Delivery">I can deliver to them</option>
                                    <option value="Self Pickup">Student must pick it up</option>
                                    <option value="Both">Both available</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* --- STEP 3: LOCATION & CONTACT --- */}
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                        <h2 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                            <MapPin className="w-5 h-5 text-orange-500" />
                            Contact & Location
                        </h2>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-1">WhatsApp / Calling Number</label>
                                <div className="relative">
                                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                    <input type="tel" name="contactPhone" value={formData.contactPhone} onChange={handleChange} placeholder="10-digit mobile number" maxLength={10} className="w-full border border-slate-300 pl-10 p-3 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none" required />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 mb-1">Local Area / Society</label>
                                    <input type="text" name="area" value={formData.area} onChange={handleChange} placeholder="e.g., Sector 62, Supertech Estate" className="w-full border border-slate-300 p-3 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none" required />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 mb-1">City</label>
                                    <input type="text" name="city" value={formData.city} onChange={handleChange} placeholder="e.g., Noida" className="w-full border border-slate-300 p-3 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none" required />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 mb-1">State</label>
                                    <select name="state" value={formData.state} onChange={handleChange} className="w-full border border-slate-300 p-3 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none" required>
                                        <option value="" disabled>Select State</option>
                                        {INDIAN_STATES.map((state) => (
                                            <option key={state} value={state}>{state}</option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 mb-1">Pincode</label>
                                    <input type="text" name="pincode" value={formData.pincode} onChange={handleChange} placeholder="e.g., 201301" maxLength={6} className="w-full border border-slate-300 p-3 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none" required />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* --- STEP 4: PHOTO --- */}
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                        <h2 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                            <Camera className="w-5 h-5 text-orange-500" />
                            Upload a Photo
                        </h2>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">Upload a real photo of the food you cook (Students love real photos!)</label>
                        <input
                            key={thumbnail ? thumbnail.name : "empty-file-input"}
                            type="file"
                            accept="image/*"
                            onChange={(e) => setThumbnail(e.target.files?.[0] || null)}
                            className="w-full border border-slate-300 p-3 rounded-xl focus:outline-none file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-orange-50 file:text-orange-700 hover:file:bg-orange-100"
                            required
                        />
                    </div>

                    {/* SUBMIT BUTTON */}
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full flex items-center justify-center gap-2 bg-linear-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white py-4 rounded-2xl text-lg font-bold transition shadow-lg disabled:opacity-50"
                    >
                        {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : "🚀 Submit & Go Live"}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default AddTiffin;