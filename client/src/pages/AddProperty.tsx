import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
    ArrowLeft, Upload, X, MapPin, Home, Building, IndianRupee,
    Wifi, Tv, WashingMachine, AirVent, Car, Dumbbell, Utensils,
    Shield, Check, AlertCircle
} from 'lucide-react';
import { addProperty } from '@/api/property';

type VisitSlot = {
    from: string;
    to: string;
};

type VisitAvailability = {
    day: string;
    slots: VisitSlot[];
};

export default function AddProperty() {
    const navigate = useNavigate();
    const [step, setStep] = useState(1);
    const [images, setImages] = useState<string[]>([]);
    const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);

    const [files, setFiles] = useState<File[]>([]);

    const [formData, setFormData] = useState({
        // Basic Info
        title: '',
        propertyType: 'room' as 'room' | 'hostel' | 'pg',
        description: '',

        // Location
        address: '',
        city: '',
        state: '',
        pincode: '',
        landmark: '',

        // Pricing
        price: '',
        priceType: 'per_year' as 'per_month' | 'per_day' | 'per_year',
        securityDeposit: '',
        maintenanceCharge: '',

        // Property Details
        furnishingType: 'furnished' as 'furnished' | 'semi_furnished' | 'unfurnished',
        area: '',
        rooms: '1',
        bathrooms: '1',
        tenants: '1',
        availableFrom: '',

        // Amenities
        amenities: [] as string[],

        // Contact
        contactName: '',
        contactPhone: '',
        contactEmail: '',
        alternatePhone: '',

        // visit availability
        visitAvailability: [] as VisitAvailability[],
    });


    const days = [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
        "Sunday",
    ];

    const addSlot = (day: string) => {
        setFormData((prev: any) => {
            const availability = [...prev.visitAvailability];

            const dayIndex = availability.findIndex(
                (item: any) => item.day === day
            );

            if (dayIndex === -1) {
                availability.push({
                    day,
                    slots: [
                        {
                            from: "",
                            to: "",
                        },
                    ],
                });
            } else {
                availability[dayIndex].slots.push({
                    from: "",
                    to: "",
                });
            }

            return {
                ...prev,
                visitAvailability: availability,
            };
        });
    };

    const updateSlot = (
        day: string,
        slotIndex: number,
        field: "from" | "to",
        value: string
    ) => {
        setFormData((prev: any) => {
            const availability = [...prev.visitAvailability];

            const dayIndex = availability.findIndex(
                (item: any) => item.day === day
            );

            availability[dayIndex].slots[slotIndex][field] = value;

            return {
                ...prev,
                visitAvailability: availability,
            };
        });
    };

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

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files) return;

        const selectedFiles = Array.from(e.target.files);

        setFiles((prev) => [...prev, ...selectedFiles]);

        const previews = selectedFiles.map((file) =>
            URL.createObjectURL(file)
        );

        setImages((prev) => [...prev, ...previews]);
    };

    const removeImage = (index: number) => {
        setImages(images.filter((_, i) => i !== index));
        setFiles((prev) => prev.filter((_, i) => i !== index));

    };

    const toggleAmenity = (amenityId: string) => {
        setSelectedAmenities((prev) => {
            const updated = prev.includes(amenityId)
                ? prev.filter((id) => id !== amenityId)
                : [...prev, amenityId]

            setFormData((current) => ({ ...current, amenities: updated }))

            return updated;
        })
    }

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    // const handleSubmit = async (e: React.FormEvent) => {
    //     e.preventDefault();

    //     if (!isStepValid()) {
    //         alert('Please complete all required fields before submitting.');
    //         return;
    //     }

    //     try {
    //         const data = new FormData();

    //         Object.entries(formData).forEach(([key, value]) => {
    //             if (key === 'amenities') return;

    //             if (key === "visitAvailability") {
    //                 data.append(key, JSON.stringify(value));
    //                 return;
    //             }

    //             data.append(key, value.toString());

    //             if (typeof value === "object") {
    //                 data.append(key, JSON.stringify(value));
    //                 return;
    //             }

    //             data.append(key, String(value));
    //         });

    //         selectedAmenities.forEach((item) => {
    //             data.append('amenities', item);
    //         });


    //         files.forEach((file) => {
    //             data.append('images', file);
    //         });

    //         const res = await addProperty(data);
    //         console.log(res.data);

    //         alert('Property added successfully!');
    //         navigate('/dashboard');
    //     } catch (error: any) {
    //         console.error(error);
    //         alert(error?.response?.data?.message || 'Something went wrong');
    //     }
    // };

    const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // ✅ Safety check - only submit on step 6
    if (step !== 6) {
        console.log("Not on final step, ignoring submit");
        return;
    }

    if (!isStepValid()) {
        alert('Please complete all required fields before submitting.');
        return;
    }

    // ✅ Extra check for visitAvailability
    if (!formData.visitAvailability || formData.visitAvailability.length === 0) {
        // alert('Please add at least one visit slot');
        return;
    }

    try {
        const data = new FormData();

        Object.entries(formData).forEach(([key, value]) => {
            // Skip these - handle separately
            if (key === 'amenities') return;
            
            // Handle visitAvailability - stringify array
            if (key === "visitAvailability") {
                data.append(key, JSON.stringify(value));
                return;
            }

            // Handle any other object/array
            if (typeof value === "object" && value !== null) {
                data.append(key, JSON.stringify(value));
                return;
            }

            // Handle primitives (string, number, boolean)
            if (value !== null && value !== undefined) {
                data.append(key, String(value));
            }
        });

        // Append amenities separately
        selectedAmenities.forEach((item) => {
            data.append('amenities', item);
        });

        // Append files
        files.forEach((file) => {
            data.append('images', file);
        });

        // ✅ Debug - check what's being sent
        console.log("=== FormData being sent ===");
        for (let [key, value] of data.entries()) {
            console.log(key, ":", value);
        }

        const res = await addProperty(data);
        console.log(res.data);

        alert('Property added successfully!');
        navigate('/dashboard');
    } catch (error: any) {
        console.error(error);
        alert(error?.response?.data?.message || 'Something went wrong');
    }
};

    const isStepValid = () => {
        switch (step) {
            case 1:
                return formData.title && formData.propertyType && formData.description;
            case 2:
                return formData.address && formData.city && formData.state && formData.pincode
            case 3:
                return formData.price && formData.securityDeposit;
            case 4:
                return (formData.rooms && formData.bathrooms && formData.furnishingType && formData.tenants) || (formData.area && formData.rooms && formData.bathrooms && formData.availableFrom);
            case 5:
                return formData.contactName && formData.contactPhone && formData.contactEmail;
            case 6:
                return formData.visitAvailability
            default:
                return false;
        }
    };

    return (
        <div className="min-h-screen pt-20 pb-12 bg-slate-50 dark:bg-slate-950">
            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="mb-8">
                    <Link
                        to="/dashboard"
                        className="inline-flex items-center text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white mb-4"
                    >
                        <ArrowLeft className="w-5 h-5 mr-2" />
                        Back to Dashboard
                    </Link>
                    <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-2">
                        List Your Property
                    </h1>
                    <p className="text-lg text-slate-600 dark:text-slate-300">
                        Fill in the details to list your property for students
                    </p>
                </div>

                {/* Progress Steps */}
                <div className="mb-8">
                    <div className="flex items-center justify-between">
                        {[
                            { num: 1, label: 'Basic Info' },
                            { num: 2, label: 'Location' },
                            { num: 3, label: 'Pricing' },
                            { num: 4, label: 'Details' },
                            { num: 5, label: 'Contact' }
                        ].map((stepItem, index) => (
                            <div key={stepItem.num} className="flex items-center">
                                <div className="flex items-center">
                                    <div
                                        className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-colors ${step >= stepItem.num
                                            ? 'bg-violet-600 text-white'
                                            : 'bg-slate-200 dark:bg-slate-700 text-slate-500 dark:text-slate-400'
                                            }`}
                                    >
                                        {step < stepItem.num ? stepItem.num : <Check className="w-5 h-5" />}
                                    </div>
                                    <span
                                        className={`ml-2 text-sm font-medium hidden sm:block ${step >= stepItem.num
                                            ? 'text-slate-900 dark:text-white'
                                            : 'text-slate-500 dark:text-slate-400'
                                            }`}
                                    >
                                        {stepItem.label}
                                    </span>
                                </div>
                                {index < 4 && (
                                    <div
                                        className={`w-12 sm:w-24 h-1 mx-2 rounded ${step > stepItem.num
                                            ? 'bg-violet-600'
                                            : 'bg-slate-200 dark:bg-slate-700'
                                            }`}
                                    />
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit}>
                    <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-xl p-8 mb-8">
                        {/* Step 1: Basic Information */}
                        {step === 1 && (
                            <div className="space-y-6">
                                <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">
                                    Basic Information
                                </h2>

                                {/* Property Type */}
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-3">
                                        Property Type *
                                    </label>
                                    <div className="grid grid-cols-3 gap-4">
                                        {[
                                            { value: 'room', label: 'Room', icon: Home },
                                            { value: 'hostel', label: 'Hostel', icon: Building },
                                            { value: 'pg', label: 'PG', icon: Home }
                                        ].map((type) => (
                                            <button
                                                key={type.value}
                                                type="button"
                                                onClick={() => setFormData({ ...formData, propertyType: type.value as any })}
                                                className={`p-4 rounded-xl border-2 transition-all flex flex-col items-center ${formData.propertyType === type.value
                                                    ? 'border-violet-600 bg-violet-50 dark:bg-violet-900/20'
                                                    : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600'
                                                    }`}
                                            >
                                                <type.icon className={`w-8 h-8 mb-2 ${formData.propertyType === type.value
                                                    ? 'text-violet-600 dark:text-violet-400'
                                                    : 'text-slate-400'
                                                    }`} />
                                                <span className={`font-medium ${formData.propertyType === type.value
                                                    ? 'text-violet-700 dark:text-violet-400'
                                                    : 'text-slate-600 dark:text-slate-400'
                                                    }`}>
                                                    {type.label}
                                                </span>
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Title */}
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                        Property Title *
                                    </label>
                                    <input
                                        type="text"
                                        name="title"
                                        value={formData.title}
                                        onChange={handleInputChange}
                                        placeholder="e.g., Cozy Studio Near Delhi University"
                                        className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500 text-slate-900 dark:text-white"
                                        required
                                    />
                                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                                        Make it descriptive and attractive
                                    </p>
                                </div>

                                {/* Description */}
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                        Description *
                                    </label>
                                    <textarea
                                        name="description"
                                        value={formData.description}
                                        onChange={handleInputChange}
                                        placeholder="Describe your property, nearby facilities, transportation, etc."
                                        rows={6}
                                        className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500 text-slate-900 dark:text-white resize-none"
                                        required
                                    />
                                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                                        Minimum 50 characters
                                    </p>
                                </div>

                                {/* Images */}
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                        Property Images
                                    </label>
                                    <div className="border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-xl p-8 text-center">
                                        <Upload className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                                        <p className="text-slate-600 dark:text-slate-300 mb-2">
                                            Drag and drop images here, or click to browse
                                        </p>
                                        <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">
                                            Support for JPG, PNG (Max 10 images, 5MB each)
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
                                            className="inline-flex items-center px-6 py-3 bg-violet-600 text-white rounded-xl hover:bg-violet-700 transition-colors cursor-pointer"
                                        >
                                            <Upload className="w-5 h-5 mr-2" />
                                            Upload Images
                                        </label>
                                    </div>

                                    {/* Image Preview */}
                                    {images.length > 0 && (
                                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 mt-4">
                                            {images.map((image, index) => (
                                                <div key={index} className="relative aspect-square rounded-xl overflow-hidden group">
                                                    <img src={image} alt={`Property ${index + 1}`} className="w-full h-full object-cover" />
                                                    <button
                                                        type="button"
                                                        onClick={() => removeImage(index)}
                                                        className="absolute top-2 right-2 w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                                                    >
                                                        <X className="w-4 h-4" />
                                                    </button>
                                                    {index === 0 && (
                                                        <span className="absolute bottom-2 left-2 px-2 py-1 bg-violet-600 text-white text-xs rounded">
                                                            Primary
                                                        </span>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* Step 2: Location */}
                        {step === 2 && (
                            <div className="space-y-6">
                                <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">
                                    Location Details
                                </h2>

                                <div className="grid md:grid-cols-2 gap-6">
                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                            Full Address *
                                        </label>
                                        <input
                                            type="text"
                                            name="address"
                                            value={formData.address}
                                            onChange={handleInputChange}
                                            placeholder="House/Flat No., Building Name, Street"
                                            className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500 text-slate-900 dark:text-white"
                                            required
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                            City *
                                        </label>
                                        <input
                                            type="text"
                                            name="city"
                                            value={formData.city}
                                            onChange={handleInputChange}
                                            placeholder="e.g., Delhi"
                                            className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500 text-slate-900 dark:text-white"
                                            required
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                            State *
                                        </label>
                                        {/* <select
                                            name="state"
                                            value={formData.state}
                                            onChange={handleInputChange}
                                            className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500 text-slate-900 dark:text-white"
                                            required
                                        > */}
                                        <input
                                            type="text"
                                            name="state"
                                            value={formData.state}
                                            onChange={handleInputChange}
                                            placeholder="e.g., Madhya Pradesh"
                                            className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500 text-slate-900 dark:text-white"

                                        />
                                        {/* <option value="">Select State</option>
                                            <option value="Delhi">Delhi</option>
                                            <option value="Karnataka">Karnataka</option>
                                            <option value="Maharashtra">Maharashtra</option>
                                            <option value="Tamil Nadu">Tamil Nadu</option>
                                            <option value="Telangana">Telangana</option>
                                            <option value="Uttar Pradesh">Uttar Pradesh</option>
                                            <option value="Madhya Pradesh">Madhya Pradesh</option> */}
                                        {/* </select> */}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                            Pincode *
                                        </label>
                                        <input
                                            type="text"
                                            name="pincode"
                                            value={formData.pincode}
                                            onChange={handleInputChange}
                                            placeholder="e.g., 110001"
                                            maxLength={6}
                                            className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500 text-slate-900 dark:text-white"
                                            required
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                            Nearby Landmark
                                        </label>
                                        <input
                                            type="text"
                                            name="landmark"
                                            value={formData.landmark}
                                            onChange={handleInputChange}
                                            placeholder="e.g., Near Metro Station, Opposite Mall"
                                            className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500 text-slate-900 dark:text-white"
                                        />
                                    </div>
                                </div>

                                {/* Map Placeholder */}
                                <div className="mt-6">
                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                        Location on Map
                                    </label>
                                    <div className="h-64 bg-slate-100 dark:bg-slate-700 rounded-xl flex items-center justify-center">
                                        <div className="text-center">
                                            <MapPin className="w-12 h-12 text-slate-400 mx-auto mb-2" />
                                            <p className="text-slate-500 dark:text-slate-400">Interactive map will be shown here</p>
                                            <p className="text-sm text-slate-400 dark:text-slate-500 mt-1">Pin your property location</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Step 3: Pricing */}
                        {step === 3 && (
                            <div className="space-y-6">
                                <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">
                                    Pricing Details
                                </h2>

                                <div className="grid md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                            Rent (₹) *
                                        </label>
                                        <div className="relative">
                                            <IndianRupee className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                            <input
                                                type="number"
                                                name="price"
                                                value={formData.price}
                                                onChange={handleInputChange}
                                                placeholder="e.g., 8000"
                                                className="w-full pl-12 pr-4 py-3 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500 text-slate-900 dark:text-white"
                                                required
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                            Price Type *
                                        </label>
                                        <select
                                            name="priceType"
                                            value={formData.priceType}
                                            onChange={handleInputChange}
                                            className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500 text-slate-900 dark:text-white"
                                        >
                                            <option value="per_year">Per Year</option>
                                            <option value="per_month">Per Month</option>
                                            <option value="per_day">Per Day</option>
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                            Security Deposit (₹) *
                                        </label>
                                        <div className="relative">
                                            <IndianRupee className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                            <input
                                                type="number"
                                                name="securityDeposit"
                                                value={formData.securityDeposit}
                                                onChange={handleInputChange}
                                                placeholder="e.g., 16000"
                                                className="w-full pl-12 pr-4 py-3 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500 text-slate-900 dark:text-white"
                                                required
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                            Maintenance Charge (₹)
                                        </label>
                                        <div className="relative">
                                            <IndianRupee className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                            <input
                                                type="number"
                                                name="maintenanceCharge"
                                                value={formData.maintenanceCharge}
                                                onChange={handleInputChange}
                                                placeholder="e.g., 500"
                                                className="w-full pl-12 pr-4 py-3 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500 text-slate-900 dark:text-white"
                                            />
                                        </div>
                                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Optional monthly maintenance</p>
                                    </div>
                                </div>

                                {/* Pricing Summary */}
                                <div className="bg-violet-50 dark:bg-violet-900/20 rounded-xl p-6 mt-6">
                                    <h3 className="font-semibold text-slate-900 dark:text-white mb-4">Pricing Summary</h3>
                                    <div className="grid grid-cols-3 gap-4 text-center">
                                        <div>
                                            <div className="text-2xl font-bold text-violet-600 dark:text-violet-400">
                                                ₹{formData.price || '0'}
                                            </div>
                                            <div className="text-sm text-slate-600 dark:text-slate-400">Monthly Rent</div>
                                        </div>
                                        <div>
                                            <div className="text-2xl font-bold text-violet-600 dark:text-violet-400">
                                                ₹{formData.securityDeposit || '0'}
                                            </div>
                                            <div className="text-sm text-slate-600 dark:text-slate-400">Security Deposit</div>
                                        </div>
                                        <div>
                                            <div className="text-2xl font-bold text-violet-600 dark:text-violet-400">
                                                ₹{parseInt(formData.price || '0') + parseInt(formData.securityDeposit || '0')}
                                            </div>
                                            <div className="text-sm text-slate-600 dark:text-slate-400">Initial Payment</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Step 4: Property Details */}
                        {step === 4 && (
                            <div className="space-y-6">
                                <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">
                                    Property Details
                                </h2>

                                <div className="grid md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                            Furnishing Type *
                                        </label>
                                        <select
                                            name="furnishingType"
                                            value={formData.furnishingType}
                                            onChange={handleInputChange}
                                            className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500 text-slate-900 dark:text-white"
                                        >
                                            <option value="furnished">Furnished</option>
                                            <option value="semi_furnished">Semi-Furnished</option>
                                            <option value="unfurnished">Unfurnished</option>
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                            Area (sq. ft.)
                                        </label>
                                        <input
                                            type="number"
                                            name="area"
                                            value={formData.area}
                                            onChange={handleInputChange}
                                            placeholder="e.g., 1200"
                                            className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500 text-slate-900 dark:text-white"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                            Number of Rooms *
                                        </label>
                                        <select
                                            name="rooms"
                                            value={formData.rooms}
                                            onChange={handleInputChange}
                                            className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500 text-slate-900 dark:text-white"
                                        >
                                            {[1, 2, 3, 4, 5, '6+'].map(num => (
                                                <option key={num} value={num}>{num} {num === 1 ? 'Room' : 'Rooms'}</option>
                                            ))}
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                            Number of Bathrooms *
                                        </label>
                                        <select
                                            name="bathrooms"
                                            value={formData.bathrooms}
                                            onChange={handleInputChange}
                                            className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500 text-slate-900 dark:text-white"
                                        >
                                            {[1, 2, 3, 4, '5+'].map(num => (
                                                <option key={num} value={num}>{num} {num === 1 ? 'Bathroom' : 'Bathrooms'}</option>
                                            ))}
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                            Max Tenants *
                                        </label>
                                        <select
                                            name="tenants"
                                            value={formData.tenants}
                                            onChange={handleInputChange}
                                            className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500 text-slate-900 dark:text-white"
                                        >
                                            {[1, 2, 3, 4, 5, 6].map(num => (
                                                <option key={num} value={num}>{num} {num === 1 ? 'Person' : 'People'}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>

                                {/* Amenities */}
                                <div className="mt-6">
                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-4">
                                        Amenities
                                    </label>
                                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                                        {amenitiesList.map((amenity) => (
                                            <button
                                                key={amenity.id}
                                                type="button"
                                                onClick={() => toggleAmenity(amenity.id)}
                                                className={`p-4 rounded-xl border-2 transition-all flex flex-col items-center ${selectedAmenities.includes(amenity.id)
                                                    ? 'border-violet-600 bg-violet-50 dark:bg-violet-900/20'
                                                    : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600'
                                                    }`}
                                            >
                                                <amenity.icon className={`w-6 h-6 mb-2 ${selectedAmenities.includes(amenity.id)
                                                    ? 'text-violet-600 dark:text-violet-400'
                                                    : 'text-slate-400'
                                                    }`} />
                                                <span className={`text-sm font-medium ${selectedAmenities.includes(amenity.id)
                                                    ? 'text-violet-700 dark:text-violet-400'
                                                    : 'text-slate-600 dark:text-slate-400'
                                                    }`}>
                                                    {amenity.label}
                                                </span>
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Step 5: Contact Information */}
                        {step === 5 && (
                            <div className="space-y-6">
                                <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">
                                    Contact Information
                                </h2>

                                <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl p-4 flex items-start space-x-3">
                                    <AlertCircle className="w-6 h-6 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                                    <div>
                                        <h3 className="font-medium text-amber-800 dark:text-amber-300">Privacy Notice</h3>
                                        <p className="text-sm text-amber-700 dark:text-amber-400 mt-1">
                                            Your contact information will be visible to interested students. We recommend using a dedicated phone number for property inquiries.
                                        </p>
                                    </div>
                                </div>

                                <div className="grid md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                            Contact Name *
                                        </label>
                                        <input
                                            type="text"
                                            name="contactName"
                                            value={formData.contactName}
                                            onChange={handleInputChange}
                                            placeholder="e.g., Rajesh Kumar"
                                            className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500 text-slate-900 dark:text-white"
                                            required
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                            Contact Phone *
                                        </label>
                                        <input
                                            type="tel"
                                            name="contactPhone"
                                            value={formData.contactPhone}
                                            onChange={handleInputChange}
                                            placeholder="+91 98765 43210"
                                            className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500 text-slate-900 dark:text-white"
                                            required
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                            Contact Email *
                                        </label>
                                        <input
                                            type="email"
                                            name="contactEmail"
                                            value={formData.contactEmail}
                                            onChange={handleInputChange}
                                            placeholder="your@email.com"
                                            className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500 text-slate-900 dark:text-white"
                                            required
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                            Alternate Phone
                                        </label>
                                        <input
                                            type="tel"
                                            name="alternatePhone"
                                            value={formData.alternatePhone}
                                            onChange={handleInputChange}
                                            placeholder="+91 98765 43210"
                                            className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500 text-slate-900 dark:text-white"
                                        />
                                    </div>
                                </div>

                                {/* Terms and Conditions */}
                                <div className="mt-6 p-4 bg-slate-50 dark:bg-slate-700 rounded-xl">
                                    <label className="flex items-start space-x-3">
                                        <input
                                            type="checkbox"
                                            className="mt-1 rounded text-violet-600 focus:ring-violet-500"
                                            required
                                        />
                                        <span className="text-sm text-slate-600 dark:text-slate-300">
                                            I confirm that I am the owner/authorized person to list this property. I agree to the{' '}
                                            <a href="#" className="text-violet-600 dark:text-violet-400 hover:underline">
                                                Terms of Service
                                            </a>{' '}
                                            and{' '}
                                            <a href="#" className="text-violet-600 dark:text-violet-400 hover:underline">
                                                Privacy Policy
                                            </a>
                                            . I understand that false information may lead to account suspension.
                                        </span>
                                    </label>
                                </div>
                            </div>
                        )}

                        {step == 6 && (
                            <div className="mt-8">
                                <h2 className="text-2xl font-bold text-slate-900 mb-6">
                                    Visit Availability
                                </h2>

                                <p className="text-slate-500 mb-6">
                                    Select the days and time ranges when students can visit your property.
                                </p>

                                <div className="space-y-6">
                                    {days.map((day) => {
                                        const availability =
                                            formData.visitAvailability.find(
                                                (item: any) => item.day === day
                                            );

                                        return (
                                            <div
                                                key={day}
                                                className="border rounded-2xl p-5 bg-slate-50"
                                            >
                                                <div className="flex justify-between items-center mb-4">
                                                    <h3 className="font-semibold text-lg">
                                                        {day}
                                                    </h3>

                                                    <button
                                                        type="button"
                                                        onClick={() => addSlot(day)}
                                                        className="px-4 py-2 bg-violet-600 text-white rounded-lg hover:bg-violet-700"
                                                    >
                                                        + Add Slot
                                                    </button>
                                                </div>

                                                {availability?.slots.map(
                                                    (slot: any, index: number) => (
                                                        <div
                                                            key={index}
                                                            className="grid grid-cols-2 gap-4 mb-4"
                                                        >
                                                            <input
                                                                type="time"
                                                                value={slot.from}
                                                                onChange={(e) =>
                                                                    updateSlot(
                                                                        day,
                                                                        index,
                                                                        "from",
                                                                        e.target.value
                                                                    )
                                                                }
                                                                className="border rounded-xl px-4 py-3"
                                                            />

                                                            <input
                                                                type="time"
                                                                value={slot.to}
                                                                onChange={(e) =>
                                                                    updateSlot(
                                                                        day,
                                                                        index,
                                                                        "to",
                                                                        e.target.value
                                                                    )
                                                                }
                                                                className="border rounded-xl px-4 py-3"
                                                            />
                                                        </div>
                                                    )
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Navigation Buttons */}
                    <div className="flex justify-between">
                        <button
                            type="button"
                            onClick={() => setStep(step - 1)}
                            disabled={step === 1}
                            className={`px-8 py-4 rounded-xl font-medium transition-colors ${step === 1
                                ? 'bg-slate-200 dark:bg-slate-700 text-slate-400 cursor-not-allowed'
                                : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-300 dark:hover:bg-slate-600'
                                }`}
                        >
                            Previous
                        </button>

                        {step < 6 ? (
                            <button
                                type="button"
                                onClick={() => setStep(step + 1)}
                                disabled={!isStepValid()}
                                className={`px-8 py-4 rounded-xl font-medium transition-all ${isStepValid()
                                    ? 'bg-linear-to-r from-violet-600 to-indigo-600 text-white hover:from-violet-700 hover:to-indigo-700 shadow-lg'
                                    : 'bg-slate-200 dark:bg-slate-700 text-slate-400 cursor-not-allowed'
                                    }`}
                            >
                                Next Step
                            </button>
                        ) : (
                            <button
                                type="submit"
                                disabled={!isStepValid()}
                                className={`px-8 py-4 rounded-xl font-medium transition-all ${isStepValid()
                                    ? 'bg-linear-to-r from-green-600 to-emerald-600 text-white hover:from-green-700 hover:to-emerald-700 shadow-lg'
                                    : 'bg-slate-200 dark:bg-slate-700 text-slate-400 cursor-not-allowed'
                                    }`}
                            >
                                Submit Property
                            </button>
                        )}
                    </div>
                </form>
            </div>
        </div>
    );
}
