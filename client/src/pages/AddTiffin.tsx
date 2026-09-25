import React, { useState, ChangeEvent, FormEvent } from "react";
import { addTiffin } from "../api/tiffin";

// 1. Interfaces Define karo
interface ItemIncluded {
    itemName: string;
    quantity: string;
}

interface TiffinFormData {
    name: string;
    description: string;
    foodType: "veg" | "non-veg" | "jain" | "vegan";
    oneTimePrice: string;
    weeklyPrice: string;
    monthlyPrice: string;
    mealTime: "Lunch" | "Dinner" | "Both";
    calories: string;
    preparationType: string;
    packaging: string;
    deliverySlots: string[];
    itemsIncluded: ItemIncluded[];
}

const createInitialFormData = (): TiffinFormData => ({
    name: "",
    description: "",
    foodType: "veg",
    oneTimePrice: "",
    weeklyPrice: "",
    monthlyPrice: "",
    mealTime: "Both",
    calories: "",
    preparationType: "Home-style less oil",
    packaging: "Eco-friendly insulated box",
    deliverySlots: ["12:00 PM - 1:30 PM"],
    itemsIncluded: [{ itemName: "", quantity: "" }],
});

const AddTiffin: React.FC = () => {
    const [formData, setFormData] = useState<TiffinFormData>(createInitialFormData);

    const [thumbnail, setThumbnail] = useState<File | null>(null);
    const [images, setImages] = useState<File[]>([]);
    const [loading, setLoading] = useState<boolean>(false);

    // ✅ Add item
    const addItem = () => {
        setFormData((prev) => ({
            ...prev,
            itemsIncluded: [...prev.itemsIncluded, { itemName: "", quantity: "" }],
        }));
    };

    // ✅ Update item (Fixed TypeScript Error)
    const updateItem = (index: number, field: keyof ItemIncluded, value: string) => {
        const updated = [...formData.itemsIncluded];
        updated[index][field] = value;
        setFormData((prev) => ({ ...prev, itemsIncluded: updated }));
    };

    // ✅ Remove item
    const removeItem = (index: number) => {
        const updated = formData.itemsIncluded.filter((_, i) => i !== index);
        setFormData((prev) => ({ ...prev, itemsIncluded: updated }));
    };

    // ✅ File handlers
    const handleThumbnailChange = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setThumbnail(e.target.files[0]);
        }
    };

    const handleImagesChange = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            setImages(Array.from(e.target.files));
        }
    };

    // ✅ Submit handler
    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const form = e.currentTarget;
        setLoading(true);

        const data = new FormData();
        data.append("name", formData.name);
        data.append("description", formData.description);
        data.append("foodType", formData.foodType);
        data.append("oneTimePrice", formData.oneTimePrice);
        data.append("weeklyPrice", formData.weeklyPrice);
        data.append("monthlyPrice", formData.monthlyPrice);
        data.append("mealTime", formData.mealTime);
        data.append("calories", formData.calories);
        data.append("preparationType", formData.preparationType);
        data.append("packaging", formData.packaging);
        data.append("deliverySlots", JSON.stringify(formData.deliverySlots));
        data.append("itemsIncluded", JSON.stringify(formData.itemsIncluded));

        if (thumbnail) data.append("thumbnail", thumbnail);
        images.forEach((img) => data.append("images", img));

        try {
            const res = await addTiffin(data);
            setFormData(createInitialFormData());
            setThumbnail(null);
            setImages([]);
            form.reset();
            alert("Tiffin added successfully!");
            console.log(res.data);
        } catch (error: any) {
            alert(error.response?.data?.message || "Error adding tiffin");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-3xl mx-auto p-6 bg-orange-50 min-h-screen">
            <h1 className="text-3xl font-bold text-orange-600 mb-6">
                🍱 Add New Tiffin Service
            </h1>

            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Basic Info */}
                <div className="bg-white p-6 rounded-xl shadow">
                    <h2 className="text-xl font-semibold mb-4">Basic Info</h2>

                    <input
                        type="text"
                        placeholder="Tiffin Name (e.g. Deluxe Veg Thali)"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full border p-3 rounded-lg mb-3"
                        required
                    />

                    <textarea
                        placeholder="Description"
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        className="w-full border p-3 rounded-lg mb-3"
                        rows={3}
                        required
                    />

                    <select
                        value={formData.foodType}
                        onChange={(e) =>
                            setFormData({
                                ...formData,
                                foodType: e.target.value as TiffinFormData["foodType"],
                            })
                        }
                        className="w-full border p-3 rounded-lg"
                    >
                        <option value="veg">🟢 Pure Veg</option>
                        <option value="non-veg">🔴 Non-Veg</option>
                        <option value="jain">🟡 Jain</option>
                        <option value="vegan">🌱 Vegan</option>
                        <option value="vegan">Veg and Non-Veg</option>
                    </select>
                </div>

                {/* Pricing */}
                <div className="bg-white p-6 rounded-xl shadow">
                    <h2 className="text-xl font-semibold mb-4">💰 Pricing</h2>
                    <div className="grid grid-cols-3 gap-4">
                        <input
                            type="number"
                            placeholder="Per Meal ₹"
                            value={formData.oneTimePrice}
                            onChange={(e) => setFormData({ ...formData, oneTimePrice: e.target.value })}
                            className="border p-3 rounded-lg"
                            required
                        />
                        <input
                            type="number"
                            placeholder="Weekly ₹"
                            value={formData.weeklyPrice}
                            onChange={(e) => setFormData({ ...formData, weeklyPrice: e.target.value })}
                            className="border p-3 rounded-lg"
                        />
                        <input
                            type="number"
                            placeholder="Monthly ₹"
                            value={formData.monthlyPrice}
                            onChange={(e) => setFormData({ ...formData, monthlyPrice: e.target.value })}
                            className="border p-3 rounded-lg"
                        />
                    </div>
                </div>

                {/* Items Inside Box */}
                <div className="bg-white p-6 rounded-xl shadow">
                    <h2 className="text-xl font-semibold mb-4">📦 What's Inside the Box</h2>

                    {formData.itemsIncluded.map((item, index) => (
                        <div key={index} className="flex gap-3 mb-3">
                            <input
                                type="text"
                                placeholder="Item (e.g. Butter Roti)"
                                value={item.itemName}
                                onChange={(e) => updateItem(index, "itemName", e.target.value)}
                                className="flex-1 border p-3 rounded-lg"
                            />
                            <input
                                type="text"
                                placeholder="Qty (e.g. 4 pcs)"
                                value={item.quantity}
                                onChange={(e) => updateItem(index, "quantity", e.target.value)}
                                className="w-32 border p-3 rounded-lg"
                            />
                            <button
                                type="button"
                                onClick={() => removeItem(index)}
                                className="bg-red-500 text-white px-4 rounded-lg"
                            >
                                ✕
                            </button>
                        </div>
                    ))}

                    <button
                        type="button"
                        onClick={addItem}
                        className="bg-green-500 text-white px-4 py-2 rounded-lg mt-2"
                    >
                        + Add Item
                    </button>
                </div>

                {/* Images */}
                <div className="bg-white p-6 rounded-xl shadow">
                    <h2 className="text-xl font-semibold mb-4">📸 Images</h2>
                    <label className="block mb-2 font-medium">Thumbnail (Required)</label>
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleThumbnailChange}
                        className="mb-4"
                        required
                    />

                    <label className="block mb-2 font-medium">Extra Images (Optional)</label>
                    <input
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={handleImagesChange}
                    />
                </div>

                {/* Submit */}
                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-orange-600 text-white py-4 rounded-xl text-xl font-bold hover:bg-orange-700 disabled:bg-gray-400"
                >
                    {loading ? "Adding..." : "🍱 Add Tiffin Service"}
                </button>
            </form>
        </div>
    );
};

export default AddTiffin;