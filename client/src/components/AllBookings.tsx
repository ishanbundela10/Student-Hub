import { useState, useEffect } from 'react';
import { 
    Home, MapPin, Mail, Phone, 
    Check, X, Clock3, CheckCircle, XCircle, Trash2, IndianRupee, MessageSquare
} from 'lucide-react';
import { getOwnerBookings, updateBookingStatus, deleteBooking } from '@/api/booking';
import { Booking } from '@/types';

interface AllBookingsProps {
    onAction?: () => void;
}

export default function AllBookings({ onAction }: AllBookingsProps) {
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState<'all' | 'pending' | 'accepted' | 'rejected'>('all');

    useEffect(() => {
        fetchBookings();
    }, []);

    const fetchBookings = async () => {
        try {
            setLoading(true);
            const res = await getOwnerBookings();
            setBookings(res.data.data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleStatusUpdate = async (
        bookingId: string,
        status: "accepted" | "rejected"
    ) => {
        try {
            const res = await updateBookingStatus(bookingId, status);

            setBookings((prev) =>
                prev.map((b) =>
                    b._id === bookingId ? { ...b, status } : b
                )
            );

            if (onAction) onAction();

            showToast(res.data.message, status === 'accepted' ? 'green' : 'red');
        } catch (error: any) {
            console.error(error);
            alert(error?.response?.data?.message || "Failed to update");
        }
    };

    const handleDelete = async (bookingId: string) => {
        if (!confirm("Delete this booking request?")) return;

        try {
            await deleteBooking(bookingId);
            setBookings((prev) => prev.filter((b) => b._id !== bookingId));
            if (onAction) onAction();
            showToast("Booking deleted", "red");
        } catch (error: any) {
            console.error(error);
        }
    };

    const showToast = (message: string, color: string) => {
        const toast = document.createElement('div');
        toast.className = `fixed bottom-4 right-4 px-6 py-3 rounded-xl shadow-lg z-50 text-white bg-${color}-500`;
        toast.textContent = message;
        document.body.appendChild(toast);
        setTimeout(() => toast.remove(), 3000);
    };

    const filteredBookings = bookings.filter((b) => {
        if (filter === 'all') return true;
        return b.status === filter;
    });

    const counts = {
        all: bookings.length,
        pending: bookings.filter((b) => b.status === 'pending').length,
        accepted: bookings.filter((b) => b.status === 'accepted').length,
        rejected: bookings.filter((b) => b.status === 'rejected').length,
    };

    const StatusBadge = ({ status }: { status: string }) => {
        const config = {
            pending: { bg: 'bg-yellow-100 text-yellow-700', icon: <Clock3 className="w-3 h-3" />, label: 'PENDING' },
            accepted: { bg: 'bg-green-100 text-green-700', icon: <CheckCircle className="w-3 h-3" />, label: 'ACCEPTED' },
            rejected: { bg: 'bg-red-100 text-red-700', icon: <XCircle className="w-3 h-3" />, label: 'REJECTED' }
        };
        const { bg, icon, label } = config[status as keyof typeof config] || config.pending;
        return (
            <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-bold ${bg}`}>
                {icon}{label}
            </span>
        );
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center py-12">
                <div className="text-slate-500">Loading bookings...</div>
            </div>
        );
    }

    return (
        <div>
            {/* Filter Tabs */}
            <div className="flex flex-wrap gap-2 mb-6">
                {[
                    { key: 'all', label: 'All' },
                    { key: 'pending', label: 'Pending' },
                    { key: 'accepted', label: 'Accepted' },
                    { key: 'rejected', label: 'Rejected' }
                ].map((tab) => (
                    <button
                        key={tab.key}
                        onClick={() => setFilter(tab.key as any)}
                        className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium text-sm transition-all ${
                            filter === tab.key
                                ? 'bg-violet-600 text-white shadow-lg'
                                : 'bg-slate-100 text-slate-700 hover:bg-slate-600 dark:bg-slate-700 dark:text-slate-300'
                        }`}
                    >
                        {tab.label}
                        <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${
                            filter === tab.key ? 
                            'bg-white/20 text-white'
                            : 'bg-slate-200 text-slate-700 dark:bg-slate-600 dark:text-slate-200'
                        }`}>
                            {counts[tab.key as keyof typeof counts]}
                        </span>
                    </button>
                ))}
            </div>

            {/* Bookings List */}
            {filteredBookings.length === 0 ? (
                <div className="bg-slate-50 dark:bg-slate-700/50 rounded-2xl p-12 text-center">
                    <Home className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">
                        No {filter !== 'all' ? filter : ''} bookings
                    </h3>
                    <p className="text-slate-500">
                        Booking requests will appear here
                    </p>
                </div>
            ) : (
                <div className="space-y-3 max-h-[600px] overflow-y-auto pr-2">
                    {filteredBookings.map((booking) => (
                        <div
                            key={booking._id}
                            className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all border border-slate-100 p-4"
                        >
                            <div className="flex gap-4">
                                {/* Image */}
                                <img
                                    src={booking.property?.images?.[0] || 'https://via.placeholder.com/150'}
                                    alt={booking.property?.title || 'Property'}
                                    className="w-20 h-20 object-cover rounded-lg shrink-0"
                                />

                                <div className="flex-1 min-w-0">
                                    {/* Header */}
                                    <div className="flex items-start justify-between gap-2 mb-2">
                                        <div className="min-w-0 flex-1">
                                            <h3 className="font-semibold text-slate-900 text-sm truncate">
                                                {booking.property?.title || 'Property Deleted'}
                                            </h3>
                                            <div className="flex items-center text-slate-500 text-xs mt-0.5">
                                                <MapPin className="w-3 h-3 mr-1" />
                                                {booking.property?.city || 'N/A'}
                                            </div>
                                        </div>
                                        <StatusBadge status={booking.status} />
                                    </div>

                                    {/* Price */}
                                    <div className="flex items-center gap-1 text-violet-600 font-bold mb-2">
                                        <IndianRupee className="w-4 h-4" />
                                        {booking.property?.price?.toLocaleString('en-IN')}
                                        <span className="text-xs text-slate-500 font-normal">/month</span>
                                    </div>

                                    {/* Student */}
                                    <div className="flex items-center gap-2 mb-2 flex-wrap text-xs">
                                        <div className="flex items-center gap-1.5 bg-slate-50 px-2 py-1 rounded-md">
                                            <div className="w-5 h-5 rounded-full bg-violet-500 text-white flex items-center justify-center text-[10px] font-bold">
                                                {booking.student?.fullname?.charAt(0) || 'S'}
                                            </div>
                                            <span className="font-medium">{booking.student?.fullname}</span>
                                        </div>
                                        <div className="flex items-center gap-1 text-slate-500">
                                            <Mail className="w-3 h-3" />
                                            {booking.student?.email}
                                        </div>
                                        {booking.student?.phoneNumber && (
                                            <div className="flex items-center gap-1 text-slate-500">
                                                <Phone className="w-3 h-3" />
                                                {booking.student.phoneNumber}
                                            </div>
                                        )}
                                    </div>

                                    {/* Message */}
                                    {booking.message && (
                                        <div className="bg-blue-50 border-l-2 border-blue-400 px-2 py-1 rounded text-xs mb-2 flex items-start gap-1">
                                            <MessageSquare className="w-3 h-3 mt-0.5 shrink-0" />
                                            <span>{booking.message}</span>
                                        </div>
                                    )}

                                    {/* Actions */}
                                    {booking.status === 'pending' && (
                                        <div className="flex gap-2 mt-2">
                                            <button
                                                onClick={() => handleStatusUpdate(booking._id, 'accepted')}
                                                className="flex items-center gap-1 px-3 py-1.5 bg-green-500 text-white rounded-lg hover:bg-green-600 text-xs font-medium"
                                            >
                                                <Check className="w-3.5 h-3.5" />
                                                Accept & Book
                                            </button>
                                            <button
                                                onClick={() => handleStatusUpdate(booking._id, 'rejected')}
                                                className="flex items-center gap-1 px-3 py-1.5 bg-red-500 text-white rounded-lg hover:bg-red-600 text-xs font-medium"
                                            >
                                                <X className="w-3.5 h-3.5" />
                                                Reject
                                            </button>
                                            <button
                                                onClick={() => handleDelete(booking._id)}
                                                className="p-1.5 bg-slate-100 hover:bg-red-100 text-slate-600 hover:text-red-600 rounded-lg"
                                            >
                                                <Trash2 className="w-3.5 h-3.5" />
                                            </button>
                                        </div>
                                    )}

                                    {booking.status === 'accepted' && (
                                        <div className="flex items-center justify-between mt-2">
                                            <div className="flex items-center gap-1 text-xs text-green-600 font-medium">
                                                <CheckCircle className="w-3.5 h-3.5" />
                                                Booked ✓
                                            </div>
                                            <button
                                                onClick={() => handleDelete(booking._id)}
                                                className="flex items-center gap-1 px-2 py-1 bg-slate-100 hover:bg-red-100 text-slate-600 hover:text-red-600 rounded-lg text-xs"
                                            >
                                                <Trash2 className="w-3 h-3" />
                                            </button>
                                        </div>
                                    )}

                                    {booking.status === 'rejected' && (
                                        <div className="flex items-center justify-between mt-2">
                                            <div className="flex items-center gap-1 text-xs text-red-600 font-medium">
                                                <XCircle className="w-3.5 h-3.5" />
                                                Rejected
                                            </div>
                                            <button
                                                onClick={() => handleDelete(booking._id)}
                                                className="flex items-center gap-1 px-2 py-1 bg-slate-100 hover:bg-red-100 text-slate-600 hover:text-red-600 rounded-lg text-xs"
                                            >
                                                <Trash2 className="w-3 h-3" />
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}