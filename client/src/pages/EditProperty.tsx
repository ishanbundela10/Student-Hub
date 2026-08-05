import { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import {
    ArrowLeft, Upload, X, Home, Building, IndianRupee,
    Wifi, Tv, WashingMachine, AirVent, Car, Dumbbell, Utensils,
    Shield, Trash2, BedDouble, CheckCircle, MapPin, Phone, Mail,
    User, Calendar, Clock, Sparkles, Save, ImageIcon, Info
} from 'lucide-react';
import { getPropertyById, updateProperty, deleteProperty } from '@/api/property';

type VisitSlot = {
    from: string;
    to: string;
};

type VisitAvailability = {
    day: string;
    slots: VisitSlot[];
};

export default function EditProperty() {
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [existingImages, setExistingImages] = useState<string[]>([]);
    const [newImages, setNewImages] = useState<string[]>([]);
    const [newFiles, setNewFiles] = useState<File[]>([]);
    const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);

    const [formData, setFormData] = useState({
        title: '',
        propertyType: 'room' as 'room' | 'hostel' | 'pg',
        description: '',
        address: '',
        city: '',
        state: '',
        pincode: '',
        landmark: '',
        price: '',
        priceType: 'per_year' as 'per_month' | 'per_day' | 'per_year',
        securityDeposit: '',
        maintenanceCharge: '',
        furnishingType: 'furnished' as 'furnished' | 'semi_furnished' | 'unfurnished',
        area: '',
        rooms: '1',
        bathrooms: '1',
        tenants: '1',
        availableFrom: '',
        contactName: '',
        contactPhone: '',
        contactEmail: '',
        alternatePhone: '',
        isAvailable: true,
        visitAvailability: [] as VisitAvailability[],
    });

    const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

    const amenitiesList = [
        { id: 'wifi', label: 'WiFi', icon: Wifi },
        { id: 'tv', label: 'TV', icon: Tv },
        { id: 'laundary', label: 'Laundary', icon: WashingMachine },
        { id: 'ac', label: 'Air Conditioning', icon: AirVent },
        { id: 'parking', label: 'Parking', icon: Car },
        { id: 'gym', label: 'Gym', icon: Dumbbell },
        { id: 'mess', label: 'Mess/Canteen', icon: Utensils },
        { id: 'security', label: '24/7 Security', icon: Shield }
    ];

    // Fetch property data
    useEffect(() => {
        const fetchProperty = async () => {
            try {
                const res = await getPropertyById(id!);
                const property = res.data.data.property;

                setFormData({
                    title: property.title || '',
                    propertyType: property.propertyType || 'room',
                    description: property.description || '',
                    address: property.address || '',
                    city: property.city || '',
                    state: property.state || '',
                    pincode: property.pincode || '',
                    landmark: property.landmark || '',
                    price: property.price?.toString() || '',
                    priceType: property.priceType || 'per_year',
                    securityDeposit: property.securityDeposit?.toString() || '',
                    maintenanceCharge: property.maintenanceCharge?.toString() || '',
                    furnishingType: property.propertyDetails?.furnishingType || 'furnished',
                    area: property.propertyDetails?.area?.toString() || '',
                    rooms: property.propertyDetails?.rooms?.toString() || '1',
                    bathrooms: property.propertyDetails?.bathrooms?.toString() || '1',
                    tenants: property.propertyDetails?.tenants?.toString() || '1',
                    availableFrom: property.availableFrom?.split('T')[0] || '',
                    contactName: property.contactName || '',
                    contactPhone: property.contactPhone || '',
                    contactEmail: property.contactEmail || '',
                    alternatePhone: property.alternatePhone || '',
                    isAvailable: property.isAvailable ?? true,
                    visitAvailability: property.visitAvailability || [],
                });

                setExistingImages(property.images || []);
                setSelectedAmenities(property.propertyDetails?.amenities || []);
                setLoading(false);
            } catch (error) {
                console.error(error);
                alert("Failed to load property");
                navigate('/dashboard');
            }
        };

        if (id) fetchProperty();
    }, [id]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files) return;
        const files = Array.from(e.target.files);
        setNewFiles(prev => [...prev, ...files]);
        const previews = files.map(f => URL.createObjectURL(f));
        setNewImages(prev => [...prev, ...previews]);
    };

    const removeExistingImage = (index: number) => {
        setExistingImages(prev => prev.filter((_, i) => i !== index));
    };

    const removeNewImage = (index: number) => {
        setNewImages(prev => prev.filter((_, i) => i !== index));
        setNewFiles(prev => prev.filter((_, i) => i !== index));
    };

    const toggleAmenity = (amenityId: string) => {
        setSelectedAmenities(prev =>
            prev.includes(amenityId)
                ? prev.filter(id => id !== amenityId)
                : [...prev, amenityId]
        );
    };

    const addSlot = (day: string) => {
        setFormData((prev) => {
            const availability = [...prev.visitAvailability];
            const dayIndex = availability.findIndex(item => item.day === day);
            if (dayIndex === -1) {
                availability.push({ day, slots: [{ from: "", to: "" }] });
            } else {
                availability[dayIndex].slots.push({ from: "", to: "" });
            }
            return { ...prev, visitAvailability: availability };
        });
    };

    const updateSlot = (day: string, slotIndex: number, field: "from" | "to", value: string) => {
        setFormData((prev) => {
            const availability = [...prev.visitAvailability];
            const dayIndex = availability.findIndex(item => item.day === day);
            availability[dayIndex].slots[slotIndex][field] = value;
            return { ...prev, visitAvailability: availability };
        });
    };

    const removeSlot = (day: string, slotIndex: number) => {
        setFormData((prev) => {
            const availability = [...prev.visitAvailability];
            const dayIndex = availability.findIndex(item => item.day === day);
            availability[dayIndex].slots.splice(slotIndex, 1);
            if (availability[dayIndex].slots.length === 0) {
                availability.splice(dayIndex, 1);
            }
            return { ...prev, visitAvailability: availability };
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            setSaving(true);
            const data = new FormData();

            Object.entries(formData).forEach(([key, value]) => {
                if (key === 'visitAvailability') {
                    data.append(key, JSON.stringify(value));
                } else if (typeof value === 'boolean') {
                    data.append(key, String(value));
                } else if (value !== null && value !== undefined && value !== '') {
                    data.append(key, String(value));
                }
            });

            selectedAmenities.forEach(item => {
                data.append('amenities', item);
            });

            data.append('existingImages', JSON.stringify(existingImages));

            newFiles.forEach(file => {
                data.append('images', file);
            });

            await updateProperty(id!, data);

            const toast = document.createElement('div');
            toast.className = 'fixed bottom-4 right-4 bg-gradient-to-r from-green-500 to-emerald-500 text-white px-6 py-3 rounded-xl shadow-2xl z-50 font-medium';
            toast.textContent = '✅ Property updated successfully!';
            document.body.appendChild(toast);
            setTimeout(() => toast.remove(), 3000);

            navigate('/dashboard', { state: { refresh: true } });
        } catch (error: any) {
            console.error(error);
            alert(error?.response?.data?.message || 'Failed to update property');
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async () => {
        if (!confirm("Are you sure you want to delete this property? This action cannot be undone.")) return;
        try {
            await deleteProperty(id!);
            alert("Property deleted successfully");
            navigate('/dashboard');
        } catch (error: any) {
            console.error(error);
            alert(error?.response?.data?.message || 'Failed to delete');
        }
    };

    const toggleAvailability = () => {
        setFormData(prev => ({ ...prev, isAvailable: !prev.isAvailable }));
    };

    // Reusable input class
    const inputClass = "w-full px-4 py-3 bg-slate-50 dark:bg-slate-700 border-2 border-slate-200 dark:border-slate-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent text-slate-900 dark:text-white placeholder:text-slate-400 transition-all";
    const labelClass = "block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2";
    const sectionClass = "bg-white dark:bg-slate-800 rounded-2xl p-6 md:p-8 shadow-xl shadow-slate-200/50 dark:shadow-slate-900/50 border border-slate-100 dark:border-slate-700";
    const sectionTitleClass = "text-2xl font-bold bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text text-transparent mb-6 flex items-center gap-3";

    if (loading) {
        return (
            <div className="min-h-screen pt-20 flex items-center justify-center bg-linear-to-br from-slate-50 to-violet-50 dark:from-slate-950 dark:to-slate-900">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-violet-200 border-t-violet-600 rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-slate-600 dark:text-slate-300 font-medium">Loading property...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen pt-20 pb-12 bg-linear-to-br from-slate-50 via-white to-violet-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">

                {/* Header */}
                <div className="mb-8">
                    <Link
                        to="/dashboard"
                        className="inline-flex items-center gap-2 text-slate-600 dark:text-slate-400 hover:text-violet-600 dark:hover:text-violet-400 mb-4 font-medium transition-colors group"
                    >
                        <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                        Back to Dashboard
                    </Link>

                    <div className="flex items-center justify-between flex-wrap gap-4">
                        <div>
                            <div className="flex items-center gap-3 mb-2">
                                <div className="w-12 h-12 bg-linear-to-br from-violet-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
                                    <Sparkles className="w-6 h-6 text-white" />
                                </div>
                                <h1 className="text-4xl font-bold bg-linear-to-r from-violet-600 to-indigo-600 bg-clip-text text-transparent">
                                    Edit Property
                                </h1>
                            </div>
                            <p className="text-lg text-slate-600 dark:text-slate-300 ml-15">
                                Update your property details and manage availability
                            </p>
                        </div>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">

                    {/* Availability Status Card - Premium Design */}
                    <div className={`relative overflow-hidden rounded-2xl p-6 shadow-2xl border-2 transition-all ${formData.isAvailable
                            ? 'bg-linear-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border-green-300 dark:border-green-700'
                            : 'bg-linear-to-br from-red-50 to-orange-50 dark:from-red-900/20 dark:to-orange-900/20 border-red-300 dark:border-red-700'
                        }`}>
                        {/* Decorative circle */}
                        <div className={`absolute -top-16 -right-16 w-48 h-48 rounded-full opacity-20 ${formData.isAvailable ? 'bg-green-400' : 'bg-red-400'
                            }`}></div>

                        <div className="relative flex items-center justify-between flex-wrap gap-4">
                            <div className="flex items-center gap-4">
                                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg ${formData.isAvailable ? 'bg-green-500' : 'bg-red-500'
                                    }`}>
                                    {formData.isAvailable ? (
                                        <CheckCircle className="w-7 h-7 text-white" />
                                    ) : (
                                        <BedDouble className="w-7 h-7 text-white" />
                                    )}
                                </div>
                                <div>
                                    <h3 className={`font-bold text-xl mb-1 ${formData.isAvailable ? 'text-green-800 dark:text-green-300' : 'text-red-800 dark:text-red-300'
                                        }`}>
                                        {formData.isAvailable ? 'Property is Available' : 'Property is Booked'}
                                    </h3>
                                    <p className={`text-sm ${formData.isAvailable ? 'text-green-700 dark:text-green-400' : 'text-red-700 dark:text-red-400'
                                        }`}>
                                        {formData.isAvailable
                                            ? 'Students can view and request visits'
                                            : 'Hidden from public listings'}
                                    </p>
                                </div>
                            </div>

                            <label className="relative inline-flex items-center cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={formData.isAvailable}
                                    onChange={toggleAvailability}
                                    className="sr-only peer"
                                />
                                <div className="w-16 h-9 bg-slate-300 dark:bg-slate-600 rounded-full peer peer-checked:after:translate-x-7 after:content-[''] after:absolute after:top-1 after:left-1 after:bg-white after:rounded-full after:h-7 after:w-7 after:transition-all after:shadow-md peer-checked:bg-green-500 shadow-inner"></div>
                            </label>
                        </div>
                    </div>

                    {/* Basic Information */}
                    <div className={sectionClass}>
                        <h2 className={sectionTitleClass}>
                            <Info className="w-7 h-7 text-violet-600" />
                            Basic Information
                        </h2>

                        <div className="space-y-6">
                            <div>
                                <label className={labelClass}>Property Type *</label>
                                <div className="grid grid-cols-3 gap-3">
                                    {[
                                        { value: 'room', label: 'Room', icon: Home },
                                        { value: 'hostel', label: 'Hostel', icon: Building },
                                        { value: 'pg', label: 'PG', icon: Home }
                                    ].map((type) => (
                                        <button
                                            key={type.value}
                                            type="button"
                                            onClick={() => setFormData({ ...formData, propertyType: type.value as any })}
                                            className={`p-4 rounded-xl border-2 transition-all flex flex-col items-center gap-2 ${formData.propertyType === type.value
                                                    ? 'border-violet-600 bg-violet-50 dark:bg-violet-900/30 shadow-lg scale-105'
                                                    : 'border-slate-200 dark:border-slate-600 hover:border-violet-300 dark:hover:border-violet-500 hover:bg-slate-50 dark:hover:bg-slate-700'
                                                }`}
                                        >
                                            <type.icon className={`w-7 h-7 ${formData.propertyType === type.value
                                                    ? 'text-violet-600 dark:text-violet-400'
                                                    : 'text-slate-400'
                                                }`} />
                                            <span className={`text-sm font-semibold ${formData.propertyType === type.value
                                                    ? 'text-violet-700 dark:text-violet-300'
                                                    : 'text-slate-600 dark:text-slate-400'
                                                }`}>
                                                {type.label}
                                            </span>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <label className={labelClass}>Property Title *</label>
                                <input
                                    type="text"
                                    name="title"
                                    value={formData.title}
                                    onChange={handleInputChange}
                                    placeholder="e.g., Cozy Studio Near Delhi University"
                                    className={inputClass}
                                    required
                                />
                            </div>

                            <div>
                                <label className={labelClass}>Description</label>
                                <textarea
                                    name="description"
                                    value={formData.description}
                                    onChange={handleInputChange}
                                    rows={4}
                                    placeholder="Describe your property..."
                                    className={`${inputClass} resize-none`}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Images */}
                    <div className={sectionClass}>
                        <h2 className={sectionTitleClass}>
                            <ImageIcon className="w-7 h-7 text-violet-600" />
                            Property Images
                        </h2>

                        {existingImages.length > 0 && (
                            <div className="mb-6">
                                <p className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3 flex items-center gap-2">
                                    <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                                    Current Images ({existingImages.length})
                                </p>
                                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
                                    {existingImages.map((img, i) => (
                                        <div key={i} className="relative aspect-square rounded-xl overflow-hidden group shadow-md hover:shadow-xl transition-all">
                                            <img src={img} alt="" className="w-full h-full object-cover" />
                                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                            <button
                                                type="button"
                                                onClick={() => removeExistingImage(i)}
                                                className="absolute top-2 right-2 w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all hover:bg-red-600 shadow-lg"
                                            >
                                                <X className="w-4 h-4" />
                                            </button>
                                            {i === 0 && (
                                                <span className="absolute bottom-2 left-2 px-2 py-1 bg-violet-600 text-white text-xs font-bold rounded shadow">
                                                    Primary
                                                </span>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {newImages.length > 0 && (
                            <div className="mb-6">
                                <p className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3 flex items-center gap-2">
                                    <span className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></span>
                                    New Images ({newImages.length})
                                </p>
                                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
                                    {newImages.map((img, i) => (
                                        <div key={i} className="relative aspect-square rounded-xl overflow-hidden group shadow-md">
                                            <img src={img} alt="" className="w-full h-full object-cover" />
                                            <button
                                                type="button"
                                                onClick={() => removeNewImage(i)}
                                                className="absolute top-2 right-2 w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all hover:bg-red-600 shadow-lg"
                                            >
                                                <X className="w-4 h-4" />
                                            </button>
                                            <span className="absolute bottom-2 left-2 px-2 py-1 bg-blue-500 text-white text-xs font-bold rounded shadow">
                                                NEW
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        <div className="border-2 border-dashed border-violet-300 dark:border-violet-700 rounded-2xl p-8 text-center bg-violet-50/50 dark:bg-violet-900/10 hover:bg-violet-50 dark:hover:bg-violet-900/20 transition-colors">
                            <div className="w-16 h-16 bg-linear-to-br from-violet-500 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-lg">
                                <Upload className="w-8 h-8 text-white" />
                            </div>
                            <p className="text-slate-700 dark:text-slate-300 font-medium mb-1">
                                Add more property images
                            </p>
                            <p className="text-sm text-slate-500 mb-4">
                                JPG, PNG (Max 5MB each)
                            </p>
                            <input
                                type="file"
                                accept="image/*"
                                multiple
                                onChange={handleImageUpload}
                                className="hidden"
                                id="image-upload"
                            />
                            <label
                                htmlFor="image-upload"
                                className="inline-flex items-center gap-2 px-6 py-3 bg-linear-to-r from-violet-600 to-indigo-600 text-white rounded-xl hover:from-violet-700 hover:to-indigo-700 cursor-pointer font-medium shadow-lg hover:shadow-xl transition-all"
                            >
                                <Upload className="w-5 h-5" />
                                Choose Files
                            </label>
                        </div>
                    </div>

                    {/* Location */}
                    <div className={sectionClass}>
                        <h2 className={sectionTitleClass}>
                            <MapPin className="w-7 h-7 text-violet-600" />
                            Location Details
                        </h2>
                        <div className="grid md:grid-cols-2 gap-4">
                            <div className="md:col-span-2">
                                <label className={labelClass}>Full Address *</label>
                                <input
                                    type="text"
                                    name="address"
                                    value={formData.address}
                                    onChange={handleInputChange}
                                    placeholder="House/Flat No., Building, Street"
                                    className={inputClass}
                                />
                            </div>
                            <div>
                                <label className={labelClass}>City *</label>
                                <input
                                    type="text"
                                    name="city"
                                    value={formData.city}
                                    onChange={handleInputChange}
                                    placeholder="e.g., Delhi"
                                    className={inputClass}
                                />
                            </div>
                            <div>
                                <label className={labelClass}>State *</label>
                                <input
                                    type="text"
                                    name="state"
                                    value={formData.state}
                                    onChange={handleInputChange}
                                    placeholder="e.g., Delhi"
                                    className={inputClass}
                                />
                            </div>
                            <div>
                                <label className={labelClass}>Pincode *</label>
                                <input
                                    type="text"
                                    name="pincode"
                                    value={formData.pincode}
                                    onChange={handleInputChange}
                                    placeholder="e.g., 110001"
                                    className={inputClass}
                                />
                            </div>
                            <div>
                                <label className={labelClass}>Landmark</label>
                                <input
                                    type="text"
                                    name="landmark"
                                    value={formData.landmark}
                                    onChange={handleInputChange}
                                    placeholder="Nearby landmark"
                                    className={inputClass}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Pricing */}
                    <div className={sectionClass}>
                        <h2 className={sectionTitleClass}>
                            <IndianRupee className="w-7 h-7 text-violet-600" />
                            Pricing Details
                        </h2>
                        <div className="grid md:grid-cols-2 gap-4">
                            <div>
                                <label className={labelClass}>Rent (₹) *</label>
                                <div className="relative">
                                    <IndianRupee className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                    <input
                                        type="number"
                                        name="price"
                                        value={formData.price}
                                        onChange={handleInputChange}
                                        placeholder="8000"
                                        className={`${inputClass} pl-11`}
                                    />
                                </div>
                            </div>
                            <div>
                                <label className={labelClass}>Price Type *</label>
                                <select
                                    name="priceType"
                                    value={formData.priceType}
                                    onChange={handleInputChange}
                                    className={inputClass}
                                >
                                    <option value="per_month">Per Month</option>
                                    <option value="per_year">Per Year</option>
                                    <option value="per_day">Per Day</option>
                                </select>
                            </div>
                            <div>
                                <label className={labelClass}>Security Deposit (₹)</label>
                                <div className="relative">
                                    <IndianRupee className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                    <input
                                        type="number"
                                        name="securityDeposit"
                                        value={formData.securityDeposit}
                                        onChange={handleInputChange}
                                        placeholder="16000"
                                        className={`${inputClass} pl-11`}
                                    />
                                </div>
                            </div>
                            <div>
                                <label className={labelClass}>Maintenance (₹)</label>
                                <div className="relative">
                                    <IndianRupee className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                    <input
                                        type="number"
                                        name="maintenanceCharge"
                                        value={formData.maintenanceCharge}
                                        onChange={handleInputChange}
                                        placeholder="500"
                                        className={`${inputClass} pl-11`}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Amenities */}
                    <div className={sectionClass}>
                        <h2 className={sectionTitleClass}>
                            <Sparkles className="w-7 h-7 text-violet-600" />
                            Amenities
                        </h2>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                            {amenitiesList.map((amenity) => (
                                <button
                                    key={amenity.id}
                                    type="button"
                                    onClick={() => toggleAmenity(amenity.id)}
                                    className={`p-4 rounded-xl border-2 flex flex-col items-center gap-2 transition-all ${selectedAmenities.includes(amenity.id)
                                            ? 'border-violet-600 bg-linear-to-br from-violet-50 to-indigo-50 dark:from-violet-900/30 dark:to-indigo-900/30 shadow-lg scale-105'
                                            : 'border-slate-200 dark:border-slate-600 hover:border-violet-300 hover:bg-slate-50 dark:hover:bg-slate-700'
                                        }`}
                                >
                                    <amenity.icon className={`w-6 h-6 ${selectedAmenities.includes(amenity.id)
                                            ? 'text-violet-600 dark:text-violet-400'
                                            : 'text-slate-400'
                                        }`} />
                                    <span className={`text-xs font-semibold ${selectedAmenities.includes(amenity.id)
                                            ? 'text-violet-700 dark:text-violet-300'
                                            : 'text-slate-600 dark:text-slate-400'
                                        }`}>
                                        {amenity.label}
                                    </span>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Contact */}
                    <div className={sectionClass}>
                        <h2 className={sectionTitleClass}>
                            <User className="w-7 h-7 text-violet-600" />
                            Contact Information
                        </h2>
                        <div className="grid md:grid-cols-2 gap-4">
                            <div>
                                <label className={labelClass}>Contact Name *</label>
                                <div className="relative">
                                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                    <input
                                        type="text"
                                        name="contactName"
                                        value={formData.contactName}
                                        onChange={handleInputChange}
                                        className={`${inputClass} pl-11`}
                                    />
                                </div>
                            </div>
                            <div>
                                <label className={labelClass}>Phone *</label>
                                <div className="relative">
                                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                    <input
                                        type="tel"
                                        name="contactPhone"
                                        value={formData.contactPhone}
                                        onChange={handleInputChange}
                                        className={`${inputClass} pl-11`}
                                    />
                                </div>
                            </div>
                            <div>
                                <label className={labelClass}>Email *</label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                    <input
                                        type="email"
                                        name="contactEmail"
                                        value={formData.contactEmail}
                                        onChange={handleInputChange}
                                        className={`${inputClass} pl-11`}
                                    />
                                </div>
                            </div>
                            <div>
                                <label className={labelClass}>Alternate Phone</label>
                                <div className="relative">
                                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                    <input
                                        type="tel"
                                        name="alternatePhone"
                                        value={formData.alternatePhone}
                                        onChange={handleInputChange}
                                        className={`${inputClass} pl-11`}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Visit Availability */}
                    <div className={sectionClass}>
                        <h2 className={sectionTitleClass}>
                            <Calendar className="w-7 h-7 text-violet-600" />
                            Visit Availability
                        </h2>
                        <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
                            Set when students can visit your property
                        </p>
                        <div className="space-y-3">
                            {days.map((day) => {
                                const availability = formData.visitAvailability.find(item => item.day === day);
                                const hasSlots = availability && availability.slots.length > 0;
                                return (
                                    <div
                                        key={day}
                                        className={`border-2 rounded-xl p-4 transition-all ${hasSlots
                                                ? 'border-violet-200 dark:border-violet-700 bg-violet-50/50 dark:bg-violet-900/10'
                                                : 'border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700/30'
                                            }`}
                                    >
                                        <div className="flex justify-between items-center mb-3">
                                            <h3 className={`font-bold text-lg ${hasSlots
                                                    ? 'text-violet-700 dark:text-violet-300'
                                                    : 'text-slate-600 dark:text-slate-400'
                                                }`}>
                                                {day}
                                            </h3>
                                            <button
                                                type="button"
                                                onClick={() => addSlot(day)}
                                                className="px-4 py-2 bg-linear-to-r from-violet-600 to-indigo-600 text-white rounded-lg text-sm font-medium hover:from-violet-700 hover:to-indigo-700 shadow-md hover:shadow-lg transition-all flex items-center gap-1"
                                            >
                                                <Clock className="w-4 h-4" />
                                                Add Slot
                                            </button>
                                        </div>
                                        {availability?.slots.map((slot, i) => (
                                            <div key={i} className="grid grid-cols-[1fr_1fr_auto] gap-2 mb-2">
                                                <input
                                                    type="time"
                                                    value={slot.from}
                                                    onChange={(e) => updateSlot(day, i, "from", e.target.value)}
                                                    className="border-2 border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 rounded-lg px-3 py-2 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-violet-500"
                                                />
                                                <input
                                                    type="time"
                                                    value={slot.to}
                                                    onChange={(e) => updateSlot(day, i, "to", e.target.value)}
                                                    className="border-2 border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 rounded-lg px-3 py-2 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-violet-500"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => removeSlot(day, i)}
                                                    className="p-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors shadow-md"
                                                >
                                                    <X className="w-4 h-4" />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="sticky bottom-4 z-10">
                        <div className="bg-white dark:bg-slate-800 rounded-2xl p-4 shadow-2xl border border-slate-200 dark:border-slate-700 flex justify-between gap-4 flex-wrap">
                            <button
                                type="button"
                                onClick={handleDelete}
                                className="flex items-center gap-2 px-6 py-3 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-xl hover:bg-red-100 dark:hover:bg-red-900/30 font-semibold border-2 border-red-200 dark:border-red-800 transition-all"
                            >
                                <Trash2 className="w-5 h-5" />
                                Delete
                            </button>

                            <div className="flex gap-3">
                                <Link
                                    to="/dashboard"
                                    className="px-6 py-3 border-2 border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700 font-semibold transition-all"
                                >
                                    Cancel
                                </Link>
                                <button
                                    type="submit"
                                    disabled={saving}
                                    className="flex items-center gap-2 px-8 py-3 bg-linear-to-r from-violet-600 to-indigo-600 text-white rounded-xl hover:from-violet-700 hover:to-indigo-700 font-semibold disabled:opacity-50 shadow-lg hover:shadow-xl transition-all"
                                >
                                    {saving ? (
                                        <>
                                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                            Saving...
                                        </>
                                    ) : (
                                        <>
                                            <Save className="w-5 h-5" />
                                            Save Changes
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
}