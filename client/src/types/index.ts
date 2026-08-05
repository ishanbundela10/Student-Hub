export interface User {
  _id: string;
  fullname: string;
  email: string;
  phoneNumber: string;
  role: 'student' | 'food_service' | 'owner';
  profileImage?: string
  bio?: string;
  university?: string;
  location?: {
    city?: string;
    state?: string;
  };
  createdAt: Date;
  isVerified: boolean;
  updatedAt: string;
  businessName: string;
  lastLogin: Date
}

export interface VisitSlot {
  from: string;
  to: string;
}

export interface VisitAvailability {
  day: string;
  slots: VisitSlot[];
}

export type Visit = {
    _id: string;
    property: {
        _id: string;
        title: string;
        address: string;
        city: string;
        images: string[];
        price: number;
    };
    student: {
        _id: string;
        fullName: string;
        email: string;
        phoneNumber?: string;
        avatar?: string;
    };
    day: string;
    from: string;
    to: string;
    message: string;
    status: "pending" | "accepted" | "rejected";
    createdAt: string;
};

export interface Booking {
    _id: string;
    property: {
        _id: string;
        title: string;
        address: string;
        city: string;
        images: string[];
        price: number;
        priceType: string;
        isAvailable: boolean;
    };
    student: {
        _id: string;
        fullname: string;
        email: string;
        phoneNumber?: string;
    };
    owner: string;
    message: string;
    status: "pending" | "accepted" | "rejected" | "cancelled";
    bookedAt?: string;
    createdAt: string;
}

export interface PropertyDetails {
  furnishingType: "furnished" | "semi_furnished" | "unfurnished";
  area: string;
  rooms: number;
  bathrooms: number;
  tenants: number;
  amenities: string[];
}

export interface Property {
  _id: string;
  owner: string
  title: string;
  propertyType: 'room' | 'hostel' | 'pg';
  description: string;

  price: number;
  priceType:  'per_year' | 'per_month' | 'per_day';
  
  address: string;
  city: string;
  state: string;
  landmark: string;
  pincode: string;
  

  propertyDetails: PropertyDetails;
  securityDeposit: string;
  maintenanceCharge: string;

  images: string[];

  contactName: string;
  contactPhone: string;
  contactEmail: string;
  alternatePhone: string;

  rating?: number;
  reviews?: number;
  isAvailable: boolean;
  createdAt: string;
  updatedAt: string;
  girls_only?: boolean;

  visitAvailability: VisitAvailability[];
}

export interface TiffinService {
  _id: string;
  name: string;
  providerName: string;
  location: string;
  cuisine: string[];
  pricePerMeal: number;
  mealTypes: ('breakfast' | 'lunch' | 'dinner')[];
  description: string;
  images: string[];
  contactPhone: string;
  contactEmail: string;
  rating?: number;
  reviews?: number;
  available: boolean;
  weeklyDiscount: boolean;
  monthlyDiscount: boolean;
}

export interface Review {
  id: string;
  propertyId: string;
  userId: string;
  userName: string;
  rating: number;
  comment: string;
  createdAt: Date;
}
