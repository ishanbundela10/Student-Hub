import { useState, useEffect,useContext } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Property } from '@/types';
import { getPropertyById, saveProperties } from '@/api/property';
import { requestVisit } from '@/api/visit';
import { AuthContext } from '@/context/AuthContext';
import {
  MapPin, Star, Phone, Mail,
  ChevronLeft, ChevronRight, Maximize2, Check, X, Heart,
  Home, Lock, LogIn
} from 'lucide-react';
import { createBooking } from '@/api/booking';
// import { useAuthAction } from '@/hooks/useAuthAction';
// import LoginRequiredModal from '@/components/LoginRequiredModal';

export default function PropertyDetail() {
  const navigate = useNavigate()
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [bookingMessage, setBookingMessage] = useState("");
  const [booking, setBooking] = useState(false);


  const { id } = useParams<{ id: string }>();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [show3DView, setShow3DView] = useState(false);
  const [property, setProperty] = useState<Property | null>(null)
  const [isSaved, setIsSaved] = useState(false)

  const [showVisitModal, setShowVisitModal] = useState(false);

  const [selectedDay, setSelectedDay] = useState("");

  const [selectedSlot, setSelectedSlot] = useState({
    from: "",
    to: "",
  });

  const [message, setMessage] = useState("");
  // const {
  //   requireAuth,
  //   showLoginModal,
  //   setShowLoginModal,
  //   actionText
  // } = useAuthAction();

  const [showLoginAlert, setShowLoginAlert] = useState(false);
  const [loginActionText, setLoginActionText] = useState('continue');

  const auth = useContext(AuthContext)

  if (!auth) {
    return null
  }

  const { setUser } = auth;

  if (!setUser) {
    return null
  }

  useEffect(() => {
    const fetchProperty = async () => {
      try {
        const res = await getPropertyById(id!)

        console.log(res.data.data)
        setProperty(res.data.data.property)

        setIsSaved(res.data.data.isSaved || false)
      } catch (error) {
        console.log(error)
        throw error;
      }
    }
    fetchProperty()
  }, [id])

  const requireLogin = (actionName: string): boolean => {
    if (!auth?.user) {
      setLoginActionText(actionName);
      setShowLoginAlert(true);
      return false;  // Blocked
    }
    return true;  // Allowed
  };

  const handleBookNow = async () => {
    // ✅ Check login first
    if (!requireLogin('book this property')) return;

    try {
      if (!property) return;

      setBooking(true);

      const res = await createBooking({
        propertyId: property._id,
        message: bookingMessage
      });

      console.log("Success: ", res.data);

      // Toast
      const toast = document.createElement('div');
      toast.className = 'fixed bottom-4 right-4 bg-green-500 text-white px-6 py-3 rounded-xl shadow-lg z-50';
      toast.textContent = '🎉 Booking request sent successfully!';
      document.body.appendChild(toast);
      setTimeout(() => toast.remove(), 3000);

      setShowBookingModal(false);
      setBookingMessage("");
    } catch (error: any) {
      console.error(error);
      alert(error?.response?.data?.message || "Failed to book");
    } finally {
      setBooking(false);
    }
  };

  if (!property) {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-slate-900 mb-2">Loading...</h1>
          <Link to="/rooms" className="text-violet-600 hover:underline">
            Back to listings
          </Link>
        </div>
      </div>
    );
  }

  const formatPrice = (price: number, type: string) => {
    const formatted = new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(price);

    const period = type === 'per_year' ? '/year' : type === 'per_month' ? '/month' : '/meal'
    return `${formatted}${period}`;
  };

  const amenities = property.propertyDetails?.amenities || [];

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % property.images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + property.images.length) % property.images.length);
  };

  const handleSaveProperty = async (_id: string) => {
    // ✅ Check login first
    if (!requireLogin('save this property')) return;

    try {
      const res = await saveProperties(property._id);
      const saved = res.data.data.saved;

      setIsSaved(saved);

      const toast = document.createElement('div');
      toast.className = `fixed bottom-4 right-4 text-white px-6 py-3 rounded-xl shadow-lg z-50 animate-pulse ${saved ? "bg-green-500" : "bg-red-500"
        }`;
      toast.textContent = saved
        ? 'Property saved successfully'
        : 'Property removed from saved properties';

      document.body.appendChild(toast);

      setTimeout(() => {
        toast.remove();
      }, 3000);
    } catch (error) {
      console.log(error);
    }
  };

  const handleVisitRequest = async () => {
    // ✅ Check login first
    if (!requireLogin('schedule a visit')) return;

    try {
      if (!selectedDay) {
        alert("Please select a day.");
        return;
      }

      if (!selectedSlot.from || !selectedSlot.to) {
        alert("Please select a time slot.");
        return;
      }

      const res = await requestVisit({
        propertyId: property._id,
        day: selectedDay,
        from: selectedSlot.from,
        to: selectedSlot.to,
        message,
      });

      alert(res.data.message);

      setShowVisitModal(false);
      setSelectedDay("");
      setSelectedSlot({ from: "", to: "" });
      setMessage("");
    } catch (error: any) {
      console.error(error);
      alert(
        error.response?.data?.message ||
        "Failed to request visit."
      );
    }
  };

  return (
    <div className="min-h-screen pt-20 pb-12 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <Link
          to={property.propertyType === 'hostel' ? '/hostels' : '/rooms'}
          className="inline-flex items-center text-slate-600 hover:text-slate-900 mb-6"
        >
          <ChevronLeft className="w-5 h-5 mr-1" />
          Back to {property.propertyType === 'hostel' ? 'Hostels' : 'Rooms'}
        </Link>

        {/* Image Gallery */}
        <div className="bg-white rounded-3xl overflow-hidden shadow-xl shadow-slate-200/50 mb-8">
          <div className="relative h-96 md:h-[500px]">
            <img
              src={property.images[currentImageIndex]}
              alt={property.title}
              className="w-full h-full object-cover"
            />

            {/* Navigation Arrows */}
            {property.images.length > 1 && (
              <>
                <button
                  onClick={prevImage}
                  className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg hover:bg-white transition-colors"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
                <button
                  onClick={nextImage}
                  className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg hover:bg-white transition-colors"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
              </>
            )}
            {/* Save Button */}
            <button
              onClick={() => handleSaveProperty(property._id)}
              className={`absolute top-4 right-4 flex items-center space-x-2 px-4 py-2 rounded-xl shadow-lg transition-all 
                ${isSaved
                  ? 'bg-red-500 text-white hover:bg-red-600'
                  : 'bg-white/90 backdrop-blur-sm text-slate-700 hover:bg-white'
                }`}
            >
              <Heart className={`w-5 h-5 ${isSaved ? 'fill-white' : ''}`} />
              <span className="font-medium">{isSaved ? 'Saved' : 'Save'}</span>
            </button>

            {/* 3D View Button */}
            <button
              onClick={() => setShow3DView(true)}
              className="absolute bottom-4 right-4 flex items-center space-x-2 px-4 py-2 bg-white/90 backdrop-blur-sm rounded-xl shadow-lg hover:bg-white transition-colors"
            >
              <Maximize2 className="w-5 h-5" />
              <span className="font-medium">3D View</span>
            </button>

            {/* Image Indicators */}
            <div className="absolute bottom-4 left-4 flex space-x-2">
              {property.images.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentImageIndex(index)}
                  className={`w-2 h-2 rounded-full transition-colors ${index === currentImageIndex ? 'bg-white' : 'bg-white/50'
                    }`}
                />
              ))}
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Title & Price */}
            <div className="bg-white rounded-2xl p-6 shadow-lg shadow-slate-200/50">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <div className="flex items-center space-x-2 mb-2">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${property.propertyType === 'hostel'
                      ? 'bg-indigo-100 text-indigo-700'
                      : 'bg-violet-100 text-violet-700'
                      }`}>
                      {property.propertyType === 'hostel' ? 'Hostel' : 'Room'}
                    </span>
                    {property.isAvailable && (
                      <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
                        Available Now
                      </span>
                    )}
                  </div>
                  <h1 className="text-3xl font-bold text-slate-900 mb-2">{property.title}</h1>
                  <div className="flex items-center text-slate-500">
                    <MapPin className="w-5 h-5 mr-1" />
                    <span>{property.address}, {property.city}, {property.state}</span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-3xl font-bold text-violet-600">
                    {formatPrice(property.price, property.priceType)}
                  </div>
                  <div className="flex items-center justify-end mt-1">
                    <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                    <span className="ml-1 font-medium text-slate-700">{property.rating}</span>
                    <span className="ml-1 text-slate-500">({property.reviews} reviews)</span>
                  </div>
                </div>
              </div>

              <p className="text-slate-600 leading-relaxed">{property.description}</p>
            </div>

            {/* Amenities */}
            <div className="bg-white rounded-2xl p-6 shadow-lg shadow-slate-200/50">
              <h2 className="text-xl font-bold text-slate-900 mb-4">Amenities</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {amenities.map((amenity) => (
                  <div key={amenity} className="flex items-center space-x-2">
                    <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
                      <Check className="w-4 h-4 text-green-600" />
                    </div>
                    <span className="text-slate-700">{amenity.toUpperCase()}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Visit Availability */}
            <div className="bg-white rounded-2xl p-6 shadow-lg shadow-slate-200/50">
              <h2 className="text-xl font-bold text-slate-900 mb-6">
                Visit Availability
              </h2>

              {property.visitAvailability &&
                property.visitAvailability.length > 0 ? (
                <div className="space-y-5">
                  {property.visitAvailability.map((availability) => (
                    <div
                      key={availability.day}
                      className="border border-slate-200 rounded-xl p-4"
                    >
                      <h3 className="font-semibold text-violet-700 mb-3">
                        {availability.day}
                      </h3>

                      <div className="flex flex-wrap gap-2">
                        {availability.slots.map((slot, index) => (
                          <div
                            key={index}
                            className="px-4 py-2 bg-violet-100 text-violet-700 rounded-full text-sm font-medium"
                          >
                            {slot.from} - {slot.to}
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-slate-500">
                  Owner hasn't added visit timings yet.
                </div>
              )}
            </div>

            {/* Location Map Placeholder */}
            <div className="bg-white rounded-2xl p-6 shadow-lg shadow-slate-200/50">
              <h2 className="text-xl font-bold text-slate-900 mb-4">Location</h2>
              <div className="h-64 bg-slate-100 rounded-xl flex items-center justify-center">
                <div className="text-center">
                  <MapPin className="w-12 h-12 text-slate-400 mx-auto mb-2" />
                  <p className="text-slate-500">{property.address}</p>
                  <p className="text-sm text-slate-400">Interactive map coming soon</p>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Card */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl p-6 shadow-lg shadow-slate-200/50 sticky top-24">
              <h2 className="text-xl font-bold text-slate-900 mb-4">Contact Owner</h2>

              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-linear-to-br from-violet-500 to-indigo-500 rounded-full flex items-center justify-center text-white font-bold text-lg">
                    {property.contactName.charAt(0)}
                  </div>
                  <div>
                    <div className="font-semibold text-slate-900">{property.contactName}</div>
                    <div className="text-sm text-slate-500">Property Owner</div>
                  </div>
                </div>

                <div className="space-y-3 pt-4 border-t border-slate-200">
                  <a
                    href={`tel:${property.contactPhone}`}
                    className="flex items-center justify-center space-x-2 w-full py-3 bg-green-500 text-white rounded-xl hover:bg-green-600 transition-colors"
                  >
                    <Phone className="w-5 h-5" />
                    <span className="font-medium">Call Now</span>
                  </a>
                  <a
                    href={`mailto:${property.contactEmail}`}
                    className="flex items-center justify-center space-x-2 w-full py-3 bg-violet-500 text-white rounded-xl hover:bg-violet-600 transition-colors"
                  >
                    <Mail className="w-5 h-5" />
                    <span className="font-medium">Send Email</span>
                  </a>
                </div>

                <div className="pt-4 border-t border-slate-200">
                  <div className="flex items-center space-x-2 text-slate-600 mb-2">
                    <Phone className="w-4 h-4" />
                    <span className="text-sm">{property.contactPhone}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-slate-600">
                    <Mail className="w-4 h-4" />
                    <span className="text-sm">{property.contactEmail}</span>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-200">
                  <p className="text-sm text-slate-500 mb-3">Interested? Schedule a visit!</p>
                  <div className='flex flex-col gap-2'>
                    <button
                      onClick={() => {
                        if (!requireLogin('schedule a visit')) return;
                        setShowVisitModal(true);  // ✅ Sirf logged in users ko modal khulega
                      }}
                      className="w-full py-3 border-2 border-violet-500 text-violet-600 rounded-xl font-medium hover:bg-violet-50 transition-colors"
                    >
                      Schedule Visit
                    </button>
                    <button
                      onClick={() => {
                        if (!requireLogin('book this property')) return;
                        setShowBookingModal(true);  // ✅ Sirf logged in users ko modal khulega
                      }}
                      disabled={!property.isAvailable}
                      className={`w-full py-3 border-2 rounded-xl font-medium transition-colors ${property.isAvailable
                        ? 'border-green-500 text-green-600 hover:bg-green-50'
                        : 'border-slate-300 text-slate-400 cursor-not-allowed'
                        }`}
                    >
                      {property.isAvailable ? 'Book Now!' : 'Already Booked'}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* MODALS... */}

      {showBookingModal && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-lg p-6">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Home className="w-8 h-8 text-green-600" />
              </div>
              <h2 className="text-2xl font-bold mb-2">Book This Property?</h2>
              <p className="text-slate-600">
                Send a booking request to the owner
              </p>
            </div>

            <div className="bg-slate-50 rounded-xl p-4 mb-4">
              <h3 className="font-semibold mb-1">{property.title}</h3>
              <p className="text-sm text-slate-500">{property.address}, {property.city}</p>
              <p className="text-lg font-bold text-green-600 mt-2">
                ₹{property.price.toLocaleString()}/month
              </p>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium mb-2">
                Message to Owner (optional)
              </label>
              <textarea
                rows={3}
                value={bookingMessage}
                onChange={(e) => setBookingMessage(e.target.value)}
                className="w-full border rounded-xl p-3 resize-none"
                placeholder="Introduce yourself..."
              />
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowBookingModal(false)}
                disabled={booking}
                className="flex-1 px-5 py-3 rounded-xl border-2 font-semibold"
              >
                Cancel
              </button>
              <button
                onClick={handleBookNow}
                disabled={booking}
                className="flex-1 px-5 py-3 rounded-xl bg-green-500 text-white font-semibold hover:bg-green-600 disabled:opacity-50"
              >
                {booking ? 'Sending...' : 'Confirm Booking'}
              </button>
            </div>
          </div>
        </div>
      )}

      {showVisitModal && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-lg p-6 relative">

            {/* Close */}
            <button
              onClick={() => setShowVisitModal(false)}
              className="absolute top-4 right-4 text-slate-500 hover:text-slate-700"
            >
              <X className="w-6 h-6" />
            </button>

            <h2 className="text-2xl font-bold mb-6">
              Schedule Visit
            </h2>

            {/* Day */}
            <div className="mb-6">
              <label className="font-medium block mb-2">
                Select Day
              </label>

              <select
                value={selectedDay}
                onChange={(e) => {
                  setSelectedDay(e.target.value);

                  setSelectedSlot({
                    from: "",
                    to: "",
                  });
                }}
                className="w-full border rounded-xl p-3"
              >
                <option value="">
                  Select Day
                </option>

                {property.visitAvailability.map((item) => (
                  <option
                    key={item.day}
                    value={item.day}
                  >
                    {item.day}
                  </option>
                ))}
              </select>
            </div>

            {/* Time Slots */}
            {selectedDay && (
              <div className="mb-6">
                <label className="font-medium block mb-3">
                  Available Time Slots
                </label>

                <div className="space-y-3">

                  {property.visitAvailability
                    .find(
                      (item) => item.day === selectedDay
                    )
                    ?.slots.map((slot, index) => (

                      <button
                        key={index}
                        type="button"
                        onClick={() =>
                          setSelectedSlot(slot)
                        }
                        className={`w-full border rounded-xl p-3 text-left transition ${selectedSlot.from === slot.from &&
                          selectedSlot.to === slot.to
                          ? "border-violet-600 bg-violet-50"
                          : "border-slate-200"
                          }`}
                      >
                        {slot.from} - {slot.to}
                      </button>

                    ))}

                </div>
              </div>
            )}

            {/* Message */}
            <div className="mb-6">
              <label className="font-medium block mb-2">
                Message (optional)
              </label>

              <textarea
                rows={3}
                value={message}
                onChange={(e) =>
                  setMessage(e.target.value)
                }
                className="w-full border rounded-xl p-3 resize-none"
                placeholder="Anything you'd like the owner to know..."
              />
            </div>

            {/* Buttons */}
            <div className="flex justify-end gap-3">

              <button
                onClick={() =>
                  setShowVisitModal(false)
                }
                className="px-5 py-3 rounded-xl border"
              >
                Cancel
              </button>

              <button
                onClick={handleVisitRequest}
                className="px-5 py-3 rounded-xl bg-violet-600 text-white hover:bg-violet-700"
              >
                Request Visit
              </button>

            </div>

          </div>
        </div>
      )}

      {/* 3D View Modal */}
      {show3DView && (
        <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4">
          <div className="relative w-full max-w-5xl">
            <button
              onClick={() => setShow3DView(false)}
              className="absolute -top-12 right-0 text-white hover:text-slate-300"
            >
              <X className="w-8 h-8" />
            </button>

            <div className="bg-slate-900 rounded-2xl overflow-hidden">
              <div className="aspect-video relative">
                <img
                  src={property.images[0]}
                  alt="3D View"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center text-white">
                    <Maximize2 className="w-16 h-16 mx-auto mb-4 opacity-50" />
                    <p className="text-xl font-medium">3D Virtual Tour</p>
                    <p className="text-slate-400 mt-2">Interactive 3D view coming soon</p>
                    <p className="text-sm text-slate-500 mt-4">This is a placeholder for Matterport or similar 3D tour integration</p>
                  </div>
                </div>

                {/* Navigation dots for 3D view */}
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2">
                  {property.images.map((_, index) => (
                    <button
                      key={index}
                      className="w-3 h-3 bg-white/50 rounded-full hover:bg-white transition-colors"
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ✅ LOGIN REQUIRED MODAL */}
      {showLoginAlert && (
        <div
          className="fixed inset-0 z-100 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setShowLoginAlert(false)}
        >
          <div
            className="bg-white rounded-3xl w-full max-w-md shadow-2xl overflow-hidden relative"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close */}
            <button
              onClick={() => setShowLoginAlert(false)}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors z-10"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Gradient Header */}
            <div className="bg-linear-to-br from-violet-500 to-indigo-600 p-8 text-center text-white">
              <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Lock className="w-10 h-10" />
              </div>
              <h2 className="text-2xl font-bold mb-2">Login Required</h2>
              <p className="text-violet-100">
                Please login to {loginActionText}
              </p>
            </div>

            {/* Content */}
            <div className="p-6">
              <p className="text-center text-slate-600 mb-6">
                Create an account or login to continue enjoying all features:
              </p>

              {/* Benefits */}
              <div className="space-y-2 mb-6">
                <div className="flex items-center gap-2 text-sm text-slate-700">
                  <span className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center text-green-600 text-xs">✓</span>
                  Save favorite properties
                </div>
                <div className="flex items-center gap-2 text-sm text-slate-700">
                  <span className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center text-green-600 text-xs">✓</span>
                  Book & schedule visits
                </div>
                <div className="flex items-center gap-2 text-sm text-slate-700">
                  <span className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center text-green-600 text-xs">✓</span>
                  Contact property owners
                </div>
                <div className="flex items-center gap-2 text-sm text-slate-700">
                  <span className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center text-green-600 text-xs">✓</span>
                  Write & read reviews
                </div>
              </div>

              {/* Buttons */}
              <div className="space-y-3">
                <button
                  onClick={() => {
                    localStorage.setItem('redirectAfterLogin', window.location.pathname);
                    navigate('/login');
                  }}
                  className="w-full py-3 bg-linear-to-r from-violet-600 to-indigo-600 text-white rounded-xl font-semibold hover:from-violet-700 hover:to-indigo-700 transition-all shadow-lg flex items-center justify-center gap-2"
                >
                  <LogIn className="w-5 h-5" />
                  Login Now
                </button>

                <button
                  onClick={() => {
                    localStorage.setItem('redirectAfterLogin', window.location.pathname);
                    navigate('/signup');
                  }}
                  className="w-full py-3 border-2 border-violet-600 text-violet-600 rounded-xl font-semibold hover:bg-violet-50 transition-colors"
                >
                  Create New Account
                </button>
              </div>

              {/* Continue browsing */}
              <button
                onClick={() => setShowLoginAlert(false)}
                className="w-full mt-3 py-2 text-slate-500 hover:text-slate-700 text-sm font-medium"
              >
                Continue browsing
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
