import { useEffect, useState } from 'react';
import { 
    Phone, Mail, MessageSquare, User, 
    Search,  Home, CalendarDays 
} from 'lucide-react';
import { getOwnerContacts } from '@/api/booking';

interface Contact {
    _id: string;
    fullname: string;
    email: string;
    phoneNumber?: string;
    avatar?: string;
    bookings: Array<{
        _id: string;
        property: string;
        status: string;
        date: string;
    }>;
    visits: Array<{
        _id: string;
        property: string;
        status: string;
        date: string;
    }>;
    lastActivity: string;
    totalInteractions: number;
}

export default function OwnerContacts() {
    const [contacts, setContacts] = useState<Contact[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");

    useEffect(() => {
        fetchContacts();
    }, []);

    const fetchContacts = async () => {
        try {
            setLoading(true);
            const res = await getOwnerContacts();
            setContacts(res.data.data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    // Filter contacts based on search
    const filteredContacts = contacts.filter((contact) => 
        contact.fullname?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        contact.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        contact.phoneNumber?.includes(searchQuery)
    );

    const formatPhoneForWhatsApp = (phone: string) => {
        const cleaned = phone.replace(/\D/g, '');
        return cleaned.startsWith('91') ? cleaned : `91${cleaned}`;
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center py-12">
                <div className="text-slate-500">Loading contacts...</div>
            </div>
        );
    }

    return (
        <div>
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
                <div>
                    <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                        Your Contacts
                    </h3>
                    <p className="text-sm text-slate-500">
                        {contacts.length} {contacts.length === 1 ? 'person' : 'people'} interested in your properties
                    </p>
                </div>

                {/* Search */}
                <div className="relative w-full md:w-72">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                        type="text"
                        placeholder="Search by name, email, phone..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-violet-500"
                    />
                </div>
            </div>

            {/* Contacts List */}
            {filteredContacts.length === 0 ? (
                <div className="bg-slate-50 dark:bg-slate-700/50 rounded-2xl p-12 text-center">
                    <User className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
                        {searchQuery ? 'No contacts found' : 'No contacts yet'}
                    </h3>
                    <p className="text-slate-500">
                        {searchQuery 
                            ? 'Try a different search term' 
                            : 'Contacts will appear when students book or request visits'
                        }
                    </p>
                </div>
            ) : (
                <div className="space-y-3">
                    {filteredContacts.map((contact) => (
                        <div
                            key={contact._id}
                            className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-4 hover:shadow-lg transition-all"
                        >
                            <div className="flex items-start justify-between gap-4 flex-wrap">
                                {/* Left: Info */}
                                <div className="flex items-start gap-3 flex-1 min-w-0">
                                    {/* Avatar */}
                                    <div className="w-12 h-12 rounded-full bg-linear-to-br from-violet-500 to-indigo-600 text-white flex items-center justify-center font-bold text-lg shrink-0">
                                        {contact.fullname?.charAt(0).toUpperCase() || 'U'}
                                    </div>

                                    {/* Details */}
                                    <div className="min-w-0 flex-1">
                                        <h3 className="font-semibold text-slate-900 dark:text-white truncate">
                                            {contact.fullname}
                                        </h3>
                                        <div className="text-xs text-slate-500 mb-2">
                                            Last activity: {new Date(contact.lastActivity).toLocaleDateString('en-IN', {
                                                day: 'numeric',
                                                month: 'short',
                                                year: 'numeric'
                                            })}
                                        </div>

                                        {/* Contact Info */}
                                        <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-slate-600 dark:text-slate-400 mb-3">
                                            <div className="flex items-center gap-1">
                                                <Mail className="w-3.5 h-3.5" />
                                                {contact.email}
                                            </div>
                                            {contact.phoneNumber && (
                                                <div className="flex items-center gap-1">
                                                    <Phone className="w-3.5 h-3.5" />
                                                    {contact.phoneNumber}
                                                </div>
                                            )}
                                        </div>

                                        {/* Badges */}
                                        <div className="flex flex-wrap gap-2">
                                            {contact.bookings.length > 0 && (
                                                <span className="inline-flex items-center gap-1 px-2 py-1 bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-400 rounded-md text-xs font-medium">
                                                    <Home className="w-3 h-3" />
                                                    {contact.bookings.length} Booking{contact.bookings.length > 1 ? 's' : ''}
                                                </span>
                                            )}
                                            {contact.visits.length > 0 && (
                                                <span className="inline-flex items-center gap-1 px-2 py-1 bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400 rounded-md text-xs font-medium">
                                                    <CalendarDays className="w-3 h-3" />
                                                    {contact.visits.length} Visit{contact.visits.length > 1 ? 's' : ''}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Right: Action Buttons */}
                                <div className="flex gap-2 shrink-0">
                                    {/* Call */}
                                    {contact.phoneNumber && (
                                        <a
                                            href={`tel:${contact.phoneNumber}`}
                                            className="flex items-center justify-center w-10 h-10 bg-green-100 hover:bg-green-500 text-green-600 hover:text-white rounded-lg transition-all group"
                                            title="Call"
                                        >
                                            <Phone className="w-4 h-4" />
                                        </a>
                                    )}

                                    {/* Email */}
                                    <a
                                        href={`mailto:${contact.email}`}
                                        className="flex items-center justify-center w-10 h-10 bg-blue-100 hover:bg-blue-500 text-blue-600 hover:text-white rounded-lg transition-all"
                                        title="Send Email"
                                    >
                                        <Mail className="w-4 h-4" />
                                    </a>

                                    {/* WhatsApp */}
                                    {contact.phoneNumber && (
                                        <a
                                            href={`https://wa.me/${formatPhoneForWhatsApp(contact.phoneNumber)}?text=Hi ${contact.fullname}, regarding your property inquiry...`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex items-center justify-center w-10 h-10 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-all"
                                            title="WhatsApp"
                                        >
                                            <MessageSquare className="w-4 h-4" />
                                        </a>
                                    )}
                                </div>
                            </div>

                            {/* Properties Involved */}
                            {(contact.bookings.length > 0 || contact.visits.length > 0) && (
                                <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-700">
                                    <div className="text-xs font-medium text-slate-500 mb-2">
                                        Interested in:
                                    </div>
                                    <div className="flex flex-wrap gap-1.5">
                                        {[...new Set([
                                            ...contact.bookings.map(b => b.property),
                                            ...contact.visits.map(v => v.property)
                                        ])].slice(0, 3).map((property, i) => (
                                            <span 
                                                key={i}
                                                className="px-2 py-0.5 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded text-xs truncate max-w-[200px]"
                                            >
                                                {property}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}