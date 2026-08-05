import { useState, useEffect } from 'react';
import {
    Calendar, Clock, MapPin, Mail, Phone,
    Check, X, Clock3, CheckCircle, XCircle,
    Trash2
} from 'lucide-react';
import { getOwnerVisits, updateVisitStatus, deleteVisit, clearAllVisits } from '@/api/visit'

import { Visit } from '@/types';

interface AllVisitsProps {
    onAction?: () => void;
}

export default function AllVisits({ onAction }: AllVisitsProps) {
    const [visits, setVisits] = useState<Visit[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState<'all' | 'pending' | 'accepted' | 'rejected'>('all');

    useEffect(() => {
        fetchAllBookings();
    }, []);

    const fetchAllBookings = async () => {
        try {
            setLoading(true);
            const res = await getOwnerVisits();
            setVisits(res.data.data);  // Same state name
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
            const res = await updateVisitStatus(bookingId, status);

            setVisits((prev) =>
                prev.map((v) =>
                    v._id === bookingId ? { ...v, status } : v
                )
            );

            if (onAction) onAction();  // Refresh dashboard stats

            // Toast
            const toast = document.createElement('div');
            toast.className = `fixed bottom-4 right-4 px-6 py-3 rounded-xl shadow-lg z-50 text-white ${status === 'accepted' ? 'bg-green-500' : 'bg-red-500'
                }`;
            toast.textContent = res.data.message;
            document.body.appendChild(toast);
            setTimeout(() => toast.remove(), 3000);
        } catch (error: any) {
            console.error(error);
            alert(error?.response?.data?.message || "Failed");
        }
    };

    // Filter visits based on selected tab
    const filteredVisits = visits.filter((visit) => {
        if (filter === 'all') return true;
        return visit.status === filter;
    });

    // Counts for each status
    const counts = {
        all: visits.length,
        pending: visits.filter((v) => v.status === 'pending').length,
        accepted: visits.filter((v) => v.status === 'accepted').length,
        rejected: visits.filter((v) => v.status === 'rejected').length,
    };

    // Status Badge Component
    const StatusBadge = ({ status }: { status: string }) => {
        const config = {
            pending: {
                bg: 'bg-yellow-100 text-yellow-700',
                icon: <Clock3 className="w-4 h-4" />,
                label: 'Pending'
            },
            accepted: {
                bg: 'bg-green-100 text-green-700',
                icon: <CheckCircle className="w-4 h-4" />,
                label: 'Accepted'
            },
            rejected: {
                bg: 'bg-red-100 text-red-700',
                icon: <XCircle className="w-4 h-4" />,
                label: 'Rejected'
            }
        };

        const { bg, icon, label } = config[status as keyof typeof config] || config.pending;

        return (
            <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold ${bg}`}>
                {icon}
                {label.toUpperCase()}
            </span>
        );
    };

    const showToast = (message: string, color: string) => {
        const toast = document.createElement('div');
        toast.className = `fixed bottom-4 right-4 px-6 py-3 rounded-xl shadow-lg z-50 text-white bg-${color}-500`;
        toast.textContent = message;
        document.body.appendChild(toast);
        setTimeout(() => toast.remove(), 3000);
    };

    const handleDeleteVisit = async (visitId: string) => {
        if (!confirm("Are you sure you want to delete this request?")) return;

        try {
            await deleteVisit(visitId);

            setVisits((prev) => prev.filter((v) => v._id !== visitId));

            if (onAction) onAction();

            showToast("🗑️ Request deleted", "red");
        } catch (error: any) {
            console.error(error);
            alert(error?.response?.data?.message || "Failed to delete");
        }
    };

    const handleClearAll = async () => {
        if (visits.length === 0) {
            alert("No requests to clear");
            return;
        }

        if (!confirm(`⚠️ Are you sure you want to delete ALL ${visits.length} requests? This cannot be undone!`)) return;

        try {
            await clearAllVisits();
            setVisits([]);

            if (onAction) onAction();

            showToast("✅ All requests cleared", "green");
        } catch (error: any) {
            console.error(error);
            alert(error?.response?.data?.message || "Failed to clear all");
        }
    };


    if (loading) {
        return (
            <div className="flex items-center justify-center py-12">
                <div className="text-slate-500">Loading visits...</div>
            </div>
        );
    }

    return (
        <div>
            <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
                {/* Filter Tabs */}
                <div className="flex flex-wrap gap-2 mb-6">
                    {[
                        { key: 'all', label: 'All', color: 'violet' },
                        { key: 'pending', label: 'Pending', color: 'yellow' },
                        { key: 'accepted', label: 'Accepted', color: 'green' },
                        { key: 'rejected', label: 'Rejected', color: 'red' }
                    ].map((tab) => (
                        <button
                            key={tab.key}
                            onClick={() => setFilter(tab.key as any)}
                            className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium text-sm transition-all ${filter === tab.key
                                ? 'bg-violet-600 text-white shadow-lg'
                                : 'bg-slate-100 text-slate-700 hover:bg-slate-600 dark:bg-slate-700 dark:text-slate-300'
                                }`}
                        >
                            {tab.label}
                            <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${filter === tab.key
                                ? 'bg-white/20 text-white'
                                : 'bg-slate-200 text-slate-700 dark:bg-slate-600 dark:text-slate-200'
                                }`}>
                                {counts[tab.key as keyof typeof counts]}
                            </span>
                        </button>
                    ))}
                </div>
                {visits.length > 0 && (
                    <button
                        onClick={handleClearAll}
                        className="flex items-center gap-2 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-xl font-medium text-sm shadow-md hover:shadow-lg transition-all"
                    >
                        <Trash2 className="w-4 h-4" />
                        Clear All ({visits.length})
                    </button>
                )}
            </div>



            {/* Visits List */}
            {filteredVisits.length === 0 ? (
                <div className="bg-slate-50 dark:bg-slate-700/50 rounded-2xl p-12 text-center">
                    <Calendar className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">
                        No {filter !== 'all' ? filter : ''} visit requests found
                    </h3>
                    <p className="text-slate-500">
                        {filter === 'all'
                            ? "You don't have any visits requests yet."
                            : `No ${filter} visits at the moment.`
                        }
                    </p>
                </div>
            ) : (
                <div className="space-y-4">
               {filteredVisits.map((visit) => (
                                <div
                                    key={visit._id}
                                    className="bg-white dark:bg-slate-800 rounded-xl shadow-sm hover:shadow-md transition-all border border-slate-100 dark:border-slate-700 p-4"
                                >
                                    <div className="flex gap-4">
                                        {/* Property Image - Small */}
                                        <div className="relative shrink-0">
                                            <img
                                                src={visit.property?.images?.[0] || '/placeholder.jpg'}
                                                alt={visit.property?.title || 'Property Deleted'}
                                                className="w-20 h-20 object-cover rounded-lg"
                                            />
                                        </div>

                                        {/* Main Content */}
                                        <div className="flex-1 min-w-0">
                                            {/* Top Row: Title + Status + Date */}
                                            <div className="flex items-start justify-between gap-2 mb-2">
                                                <div className="min-w-0 flex-1">
                                                    <h3 className="font-semibold text-slate-900 dark:text-white text-sm truncate">
                                                        {visit.property?.title || 'Property Deleted'}
                                                    </h3>
                                                    <div className="flex items-center text-slate-500 text-xs mt-0.5">
                                                        <MapPin className="w-3 h-3 mr-1 shrink-0" />
                                                        <span className="truncate">
                                                            {visit.property ? `${visit.property.address}, ${visit.property.city}` : 'Property no longer exists'}
                                                        </span>
                                                    </div>
                                                </div>
                                                <StatusBadge status={visit?.status || 'Deleted'} />
                                            </div>

                                            {/* Student + Slot Row */}
                                            <div className="flex flex-wrap items-center gap-2 mb-2 text-xs">
                                                {/* Student */}
                                                <div className="flex items-center gap-1.5 bg-slate-50 dark:bg-slate-700/50 px-2 py-1 rounded-md">
                                                    <div className="w-5 h-5 rounded-full bg-violet-500 text-white flex items-center justify-center text-[10px] font-bold">
                                                        {visit.student.fullName?.charAt(0) || 'S'}
                                                    </div>
                                                    <span className="font-medium text-slate-700 dark:text-slate-300">
                                                        {visit.student.fullName}
                                                    </span>
                                                </div>

                                                {/* Day */}
                                                <div className="flex items-center gap-1 bg-violet-50 text-violet-700 px-2 py-1 rounded-md font-medium">
                                                    <Calendar className="w-3 h-3" />
                                                    {visit.day}
                                                </div>

                                                {/* Time */}
                                                <div className="flex items-center gap-1 bg-indigo-50 text-indigo-700 px-2 py-1 rounded-md font-medium">
                                                    <Clock className="w-3 h-3" />
                                                    {visit.from} - {visit.to}
                                                </div>

                                                {/* Date */}
                                                <span className="text-slate-400 text-[11px] ml-auto">
                                                    {new Date(visit.createdAt).toLocaleDateString('en-IN', {
                                                        day: 'numeric',
                                                        month: 'short'
                                                    })}
                                                </span>
                                            </div>

                                            {/* Contact + Message (collapsible) */}
                                            <div className="flex items-center gap-3 text-xs text-slate-500 mb-2">
                                                <div className="flex items-center gap-1 truncate">
                                                    <Mail className="w-3 h-3 shrink-0" />
                                                    <span className="truncate">{visit.student.email}</span>
                                                </div>
                                                {visit.student.phoneNumber && (
                                                    <div className="flex items-center gap-1">
                                                        <Phone className="w-3 h-3" />
                                                        <span>{visit.student.phoneNumber}</span>
                                                    </div>
                                                )}
                                            </div>

                                            {/* Message - Only if exists */}
                                            {visit.message && (
                                                <div className="bg-blue-50 dark:bg-blue-900/20 border-l-2 border-blue-400 px-2 py-1 rounded text-xs text-slate-700 dark:text-slate-300 mb-2 line-clamp-2">
                                                    💬 {visit.message}
                                                </div>
                                            )}

                                            {/* Action Buttons or Status */}
                                            {visit.status === 'pending' && (
                                                <div className="flex gap-2 mt-2">
                                                    <button
                                                        onClick={() => handleStatusUpdate(visit._id, 'accepted')}
                                                        className="flex items-center gap-1 px-3 py-1.5 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors text-xs font-medium"
                                                    >
                                                        <Check className="w-3.5 h-3.5" />
                                                        Accept
                                                    </button>
                                                    <button
                                                        onClick={() => handleStatusUpdate(visit._id, 'rejected')}
                                                        className="flex items-center gap-1 px-3 py-1.5 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors text-xs font-medium"
                                                    >
                                                        <X className="w-3.5 h-3.5" />
                                                        Reject
                                                    </button>
                                                    <button
                                                        onClick={() => handleDeleteVisit(visit._id)}
                                                        className="flex items-center gap-1 px-3 py-1.5 bg-slate-500 text-white rounded-lg hover:bg-slate-600 transition-colors text-xs font-medium"
                                                        title="Delete request"
                                                    >
                                                        <Trash2 className="w-3.5 h-3.5" />
                                                    </button>
                                                </div>
                                            )}

                                            {(visit.status === 'accepted' || visit.status === 'rejected') && (
                                                <div className="flex items-center justify-between mt-2">
                                                    {visit.status === 'accepted' ? (
                                                        <div className="flex items-center gap-1 text-xs text-green-600 font-medium">
                                                            <CheckCircle className="w-3.5 h-3.5" />
                                                            Accepted
                                                        </div>
                                                    ) : (
                                                        <div className="flex items-center gap-1 text-xs text-red-600 font-medium">
                                                            <XCircle className="w-3.5 h-3.5" />
                                                            Rejected
                                                        </div>
                                                    )}

                                                    {/* ✅ DELETE BUTTON */}
                                                    <button
                                                        onClick={() => handleDeleteVisit(visit._id)}
                                                        className="flex items-center gap-1 px-3 py-1.5 bg-slate-100 hover:bg-red-100 text-slate-600 hover:text-red-600 rounded-lg transition-colors text-xs font-medium"
                                                        title="Delete request"
                                                    >
                                                        <Trash2 className="w-3.5 h-3.5" />
                                                        Delete
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
            )}
