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

// export interface ItemIncluded {
//   itemName: string;
//   quantity: string;
// }

// export interface DayMenu {
//   lunch: string;
//   dinner: string;
// }

// export interface WeeklyMenu {
//   Monday: DayMenu;
//   Tuesday: DayMenu;
//   Wednesday: DayMenu;
//   Thursday: DayMenu;
//   Friday: DayMenu;
//   Saturday: DayMenu;
//   Sunday: DayMenu;
// }

// export interface Address {
//   street: string;
//   landmark: string;
//   area: string;
//   city: string;
//   state: string;
//   pincode: string;
// }

// export interface MealPricing {
//   singleMeal: number;
//   weekly?: number;
//   monthly?: number;
// }

// export interface Pricing {
//   lunch?: MealPricing;
//   dinner?: MealPricing;
//   combo?: MealPricing;
// }

// export interface TiffinService {
//   _id: string;
//   name: string;
//   description: string;
//   foodType: "veg" | "non-veg" | "jain" | "vegan";
//   cuisine: string[];
//   thumbnail: string;
//   images?: string[];
//   pricing: Pricing;
//   itemsIncluded: ItemIncluded[];
//   providerName: string;
//   address: Address;
//   contactPhone: string;
//   contactEmail?: string;
//   details: {
//     mealTime: "Lunch" | "Dinner" | "Both";
//     calories?: string;
//     preparationType?: string;
//     packaging?: string;
//     deliverySlots?: string[];
//   };
//   weeklyMenu?: WeeklyMenu;
//   rating?: number;
//   reviewsCount?: number;
//   isAvailable: boolean;
//   createdAt?: string;
//   updatedAt?: string;
// }

export interface Address {
  area: string;
  city: string;
  state: string;
  pincode: string;
}

export interface Timing {
  lunch?: string;
  dinner?: string;
}

export interface TiffinService {
  _id: string;
  
  name: string;
  kitchenName?: string;
  providerName: string;
  description: string;
  foodType: "Veg" | "Non-Veg" | "Jain" | "Vegan";
  
  typicalMeal: string;
  
  pricing:{
    pricePerMeal: number;
    pricePerMonth?: number; 
  };
  
  // Timings & Delivery
  mealTime: "Lunch" | "Dinner" | "Both";
  timing?: Timing;
  deliveryOptions?: string;
  
  address: Address;
  contactPhone: string;
  contactEmail?: string;
  
  thumbnail: string;
  images?: string[];
  
  rating?: number;
  reviewsCount?: number;
  isAvailable: boolean;
  createdAt?: string;
  updatedAt?: string;
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


export interface NotificationItem {
    _id: string;
    title: string;
    message: string;
    type: "booking_request" | "visit_request" | "tiffin_subscription" | "payment" | "system";
    isRead: boolean;
    link?: string;
    createdAt: string;
}