import { useEffect, useState, useContext } from 'react';
import { Link, Navigate } from 'react-router-dom';
import {
  Home, Building, Plus, TrendingUp, MapPin, CheckCircle, AlertCircle,
  User, Mail, Phone, DollarSign, Users, BedDouble,
  Sparkles, Bell, Settings, MessageSquare, CalendarDays,
  Edit, UserCircle
} from 'lucide-react'
import { AuthContext } from '../../context/AuthContext';
import { getMyProperties } from '@/api/property';
import { getOwnerDashboardStats } from '@/api/dashboard';
// import { getOwnerVisits } from '@/api/visit';
// import AllBookings from '../AllBookings';
import AllBookings from '../AllBookings';  // Booking requests
import AllVisits from '../AllVisits';
import { useLocation } from 'react-router-dom';
import OwnerContacts from '../OwnerContact';  // path adjust kar


interface Property {
  _id: string;
  title: string;
  propertyType: "room" | "hostel" | "pg";
  price: number;
  city?: string;
  state?: string;
  address?: string;
  images?: string[];
  status?: string;
}

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState('overview');
  const [showNotifications, setShowNotifications] = useState(false);
  const [requestType, setRequestType] = useState<'visits' | 'bookings'>('bookings');
  // const [notifications, setNotifications] = useState([
  //   { id: 1, title: 'Application Approved!', message: 'Your application for Premium Boys Hostel has been approved.', time: '1 hour ago', unread: true },
  //   { id: 2, title: 'New Message', message: 'Rajesh Kumar sent you a message about Cozy Studio.', time: '3 hours ago', unread: true },
  //   { id: 3, title: 'Viewing Reminder', message: 'You have a property viewing scheduled for tomorrow at 10 AM.', time: '5 hours ago', unread: false },
  //   { id: 4, title: 'Price Drop', message: 'Spacious 1BHK price reduced to ₹11,000/month.', time: '1 day ago', unread: false }
  // ]);

  const location = useLocation();

  const auth = useContext(AuthContext);

  if (!auth) {
    return null;
  }
  const { user, loading } = auth

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/login" />;
  }

  const [myProperties, setMyProperties] = useState<Property[]>([])

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const res = await getMyProperties()
        console.log(res?.data.data)
        setMyProperties(res?.data.data)
      } catch (error) {
        console.log(error)
      }
    }
    fetchProperties()
  }, [])

  const [stats, setStats] = useState({
    activeListings: 0,
    occupiedRooms: 0,
    bookingRequests: 0,
    monthlyIncome: 0,
  });


  const fetchStats = async () => {
    try {
      const res = await getOwnerDashboardStats();
      console.log("=== DASHBOARD STATS ===");
      console.log("Full response:", res?.data);
      console.log("Stats data:", res?.data.data);
      console.log("bookingRequests:", res?.data.data.bookingRequests);

      setStats(res?.data.data);
    } catch (error) {
      console.error(error);
    }
  };
  useEffect(() => {

    fetchStats();
    if (location.state?.refresh) {
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);

  const refreshDashboard = () => {
    fetchStats()
  };


  const recentActivity = [
    { id: 1, action: 'Accepted a tenant request', item: 'Cozy Studio Near University', time: '2 hours ago', type: 'apply' },
    { id: 2, action: 'Updated room pricing', item: 'Premium Boys Hostel', time: '5 hours ago', type: 'view' },
    { id: 3, action: 'Added a new listing', item: 'Girls Hostel - Safe & Secure', time: '1 day ago', type: 'save' },
    { id: 4, action: 'Responded to a booking enquiry', item: 'Ghar Ka Khana Tiffin', time: '2 days ago', type: 'contact' }
  ];

  const notifications = [
    { id: 1, title: 'New booking request', message: 'A student requested to book a room in Cozy Studio.', time: '1 hour ago', unread: true },
    { id: 2, title: 'Payment received', message: 'Monthly rent payment was received for Premium Boys Hostel.', time: '3 hours ago', unread: true },
    { id: 3, title: 'Maintenance reminder', message: 'Please verify the AC in the deluxe room.', time: '5 hours ago', unread: false }
  ];


  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'save': return <Sparkles className="w-4 h-4 text-violet-500" />;
      case 'apply': return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'view': return <TrendingUp className="w-4 h-4 text-blue-500" />;
      case 'contact': return <MessageSquare className="w-4 h-4 text-purple-500" />;
      default: return <CalendarDays className="w-4 h-4 text-slate-500" />;
    }
  };

  return (
    <div className="min-h-screen pt-20 pb-12 bg-slate-50 dark:bg-slate-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-2">
                Welcome back, {user.fullname.split(' ')[0].toUpperCase()}! 👋
              </h1>
              <p className="text-lg text-slate-600 dark:text-slate-300">
                Manage your listings, requests, and occupancy from one place.
              </p>
            </div>
            <div className="flex items-center space-x-4">

              {/* Notifications */}
              <div className="relative">
                <button
                  onClick={() => setShowNotifications(!showNotifications)}
                  className="relative p-3 bg-white dark:bg-slate-800 rounded-xl shadow-lg hover:shadow-xl transition-shadow"
                >
                  <Bell className="w-6 h-6 text-slate-600 dark:text-slate-300" />
                  {notifications.filter(n => n.unread).length > 0 && (
                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
                      {notifications.filter(n => n.unread).length}
                    </span>
                  )}
                </button>

                {/* Notifications Dropdown */}
                {showNotifications && (
                  <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-slate-800 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700 overflow-hidden z-50">
                    <div className="p-4 border-b border-slate-200 dark:border-slate-700">
                      <h3 className="font-semibold text-slate-900 dark:text-white">Notifications</h3>
                    </div>
                    <div className="max-h-96 overflow-y-auto">
                      {notifications.map((notification) => (
                        <div
                          key={notification.id}
                          className={`p-4 border-b border-slate-100 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/50 ${notification.unread ? 'bg-violet-50 dark:bg-violet-900/10' : ''
                            }`}
                        >
                          <div className="flex items-start justify-between mb-1">
                            <h4 className="font-medium text-slate-900 dark:text-white text-sm">
                              {notification.title}
                            </h4>
                            {notification.unread && (
                              <span className="w-2 h-2 bg-violet-500 rounded-full"></span>
                            )}
                          </div>
                          <p className="text-sm text-slate-600 dark:text-slate-300 mb-1">
                            {notification.message}
                          </p>
                          <p className="text-xs text-slate-400">{notification.time}</p>
                        </div>
                      ))}
                    </div>
                    <div className="p-3 bg-slate-50 dark:bg-slate-700/50 text-center">
                      <button className="text-sm text-violet-600 dark:text-violet-400 font-medium hover:text-violet-700">
                        View all notifications
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Settings */}
              <Link
                to="/profile"
                className="p-3 bg-white dark:bg-slate-800 rounded-xl shadow-lg hover:shadow-xl transition-shadow"
              >
                <Settings className="w-6 h-6 text-slate-600 dark:text-slate-300" />
              </Link>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-violet-100 dark:bg-violet-900/30 rounded-xl flex items-center justify-center">
                <Building className="w-6 h-6 text-violet-600 dark:text-violet-400" />
              </div>
              <TrendingUp className="w-5 h-5 text-green-500" />
            </div>
            <div className="text-3xl font-bold text-slate-900 dark:text-white">{stats.activeListings}</div>
            <div className="text-sm text-slate-500 dark:text-slate-400">Active Listings</div>
          </div>

          <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-indigo-100 dark:bg-indigo-900/30 rounded-xl flex items-center justify-center">
                <BedDouble className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
              </div>
              <TrendingUp className="w-5 h-5 text-green-500" />
            </div>
            <div className="text-3xl font-bold text-slate-900 dark:text-white">{stats.occupiedRooms}</div>
            <div className="text-sm text-slate-500 dark:text-slate-400">Properties Occupied</div>
          </div>

          <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900/30 rounded-xl flex items-center justify-center">
                <Users className="w-6 h-6 text-orange-600 dark:text-orange-400" />
              </div>
              <TrendingUp className="w-5 h-5 text-green-500" />
            </div>
            <div className="text-3xl font-bold text-slate-900 dark:text-white">{stats.bookingRequests}</div>
            <div className="text-sm text-slate-500 dark:text-slate-400">Booking Requests</div>
          </div>

          <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-xl flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-green-600 dark:text-green-400" />
              </div>
              <span className="px-2 py-1 bg-emerald-500 text-white text-xs font-bold rounded-full">+12%</span>
            </div>
            <div className="text-3xl font-bold text-slate-900 dark:text-white">₹{stats.monthlyIncome.toLocaleString('en-IN')}</div>
            <div className="text-sm text-slate-500 dark:text-slate-400">Monthly Income</div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Tabs & Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Tab Navigation */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl p-2 shadow-lg">
              <div className="flex space-x-2">
                {[
                  { id: 'overview', label: 'Overview', icon: Home },
                  { id: 'properties', label: 'Properties', icon: Building },
                  { id: 'requests', label: 'Requests', icon: CheckCircle },
                  { id: 'contact', label: 'Contact', icon: UserCircle }
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex-1 flex items-center justify-center space-x-2 px-4 py-3 rounded-xl font-medium transition-all ${activeTab === tab.id
                      ? 'bg-violet-600 text-white'
                      : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'
                      }`}
                  >
                    <tab.icon className="w-5 h-5" />
                    <span className="hidden sm:inline">{tab.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Tab Content */}
            {activeTab === 'overview' && (
              <div className="space-y-8">
                {/* Quick Actions */}
                <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-lg">
                  <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4">Quick Actions</h2>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">

                    <Link
                      to="/add-property"
                      className="flex flex-col items-center p-4 bg-violet-50 dark:bg-violet-900/20 rounded-xl hover:bg-violet-100 dark:hover:bg-violet-900/30 transition-colors"
                    >
                      <Plus className="w-8 h-8 text-violet-600 dark:text-violet-400 mb-2" />
                      <span className="text-sm font-medium text-slate-700 dark:text-slate-300">New Listing</span>
                    </Link>

                    <button
                      onClick={() => setActiveTab('requests')}
                      className="flex flex-col items-center p-4 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl hover:bg-indigo-100 dark:hover:bg-indigo-900/30 transition-colors relative"
                    >
                      <Bell className="w-8 h-8 text-indigo-600 dark:text-indigo-400 mb-2" />
                      <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                        View Requests
                      </span>
                      {/* Notification badge */}
                      {stats.bookingRequests > 0 && (
                        <span className="absolute top-2 right-2 w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
                          {stats.bookingRequests}
                        </span>
                      )}
                    </button>

                    <button
                      onClick={() => setActiveTab('properties')}
                      className="flex flex-col items-center p-4 bg-orange-50 dark:bg-orange-900/20 rounded-xl hover:bg-orange-100 dark:hover:bg-orange-900/30 transition-colors"
                    >
                      <CalendarDays className="w-8 h-8 text-orange-600 dark:text-orange-400 mb-2" />
                      <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                        Manage Visit Timings
                      </span>
                    </button>
                    <Link
                      to="/profile"
                      className="flex flex-col items-center p-4 bg-green-50 dark:bg-green-900/20 rounded-xl hover:bg-green-100 dark:hover:bg-green-900/30 transition-colors"
                    >
                      <User className="w-8 h-8 text-green-600 dark:text-green-400 mb-2" />
                      <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Edit Profile</span>
                    </Link>
                  </div>
                </div>

                {/* Recent Activity */}
                <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-lg">
                  <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4">Recent Activity</h2>
                  <div className="space-y-4">
                    {recentActivity.map((activity) => (
                      <div key={activity.id} className="flex items-start space-x-4 p-4 bg-slate-50 dark:bg-slate-700/50 rounded-xl">
                        <div className="w-10 h-10 bg-white dark:bg-slate-600 rounded-lg flex items-center justify-center shrink-0">
                          {getActivityIcon(activity.type)}
                        </div>
                        <div className="flex-1">
                          <p className="text-slate-900 dark:text-white">
                            <span className="font-medium">{activity.action}</span>
                            <span className="text-slate-600 dark:text-slate-300"> - {activity.item}</span>
                          </p>
                          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">{activity.time}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'properties' && (
              <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-lg">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-slate-900 dark:text-white">My Properties</h2>
                  {myProperties.length > 0 ? <Link to="/add-property" className="text-sm text-violet-600 dark:text-violet-400 font-medium hover:text-violet-700">
                    Add new
                  </Link> : ''}
                </div>
                {myProperties.length > 0 ? <div className="grid md:grid-cols-2 gap-4">
                  {myProperties.map((property) => {
                    const locationText = [property.address, property.city, property.state].filter(Boolean).join(', ');

                    return (
                      <div key={property._id} className="flex space-x-4 p-4 bg-slate-50 dark:bg-slate-700/50 rounded-xl">
                        <img
                          src={property.images?.[0] || 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=400'}
                          alt={property.title}
                          className="w-24 h-24 object-cover rounded-lg shrink-0"
                        />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center space-x-2 mb-1">
                            <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${property.propertyType === 'room' ? 'bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-400' :
                              property.propertyType === 'hostel' ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400' :
                                'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400'
                              }`}>
                              {property.propertyType}
                            </span>
                            <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-700">
                              {property.status || 'Live'}
                            </span>
                          </div>
                          <h3 className="font-semibold text-slate-900 dark:text-white text-sm truncate">{property.title}</h3>
                          <div className="flex items-center text-slate-500 dark:text-slate-400 text-xs mt-1">
                            <MapPin className="w-3 h-3 mr-1" />
                            {locationText || 'Location not added'}
                          </div>
                          <div className="flex items-center justify-between mt-2">
                            <span className="text-lg font-bold text-violet-600 dark:text-violet-400">
                              ₹{property.price?.toLocaleString() || '0'}
                              /month
                            </span>
                            <div className="flex flex-col gap-2 justify-center">
                              <Link
                                to={`/edit-property/${property._id}`}
                                className="p-2 bg-violet-100 text-violet-700 rounded-lg hover:bg-violet-200 transition-colors"
                                title="Edit"
                              >
                                <Edit className="w-4 h-4" />
                              </Link>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div> :
                  <div className="flex flex-col items-center justify-center py-16 bg-gray-200 border border-dashed border-slate-300 rounded-3xl">
                    <Building className="w-16 h-16 text-violet-400 mb-4" />

                    <h3 className="text-2xl font-bold text-slate-800 mb-2">
                      No Properties Yet
                    </h3>

                    <p className="text-slate-500 text-center max-w-md mb-6">
                      You haven't listed any rooms, hostels, or PGs yet.
                      Start by adding your first property and make it available to students.
                    </p>

                    <Link
                      to="/add-property"
                      className="inline-flex items-center gap-2 px-6 py-3 bg-violet-600 hover:bg-violet-700 text-white font-semibold rounded-xl transition-all shadow-lg"
                    >
                      <Plus className="w-5 h-5" />
                      Add Your First Property
                    </Link>
                  </div>}
              </div>
            )}

            {activeTab === 'requests' && (
              <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-lg">
                <div className="mb-6">
                  <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4">
                    Tenant Requests
                  </h2>

                  {/* ✅ Sub-tabs: Visit / Booking */}
                  <div className="flex gap-2 p-1 bg-slate-100 dark:bg-slate-700 rounded-xl w-fit">
                    <button
                      onClick={() => setRequestType('bookings')}
                      className={`flex items-center gap-2 px-5 py-2.5 rounded-lg font-medium text-sm transition-all ${requestType === 'bookings'
                        ? 'bg-white dark:bg-slate-800 text-violet-600 shadow-md'
                        : 'text-slate-600 dark:text-slate-300 hover:text-slate-900'
                        }`}
                    >
                      <Home className="w-4 h-4" />
                      Booking Requests
                    </button>
                    <button
                      onClick={() => setRequestType('visits')}
                      className={`flex items-center gap-2 px-5 py-2.5 rounded-lg font-medium text-sm transition-all ${requestType === 'visits'
                        ? 'bg-white dark:bg-slate-800 text-violet-600 shadow-md'
                        : 'text-slate-600 dark:text-slate-300 hover:text-slate-900'
                        }`}
                    >
                      <CalendarDays className="w-4 h-4" />
                      Visit Requests
                    </button>
                  </div>
                </div>

                {/* ✅ Content based on sub-tab */}
                <div className="mt-6">
                  {requestType === 'bookings' ? (
                    <AllBookings onAction={refreshDashboard} />
                  ) : (
                    <AllVisits onAction={refreshDashboard} />
                  )}
                </div>
              </div>
            )}

            {activeTab === 'contact' && (
              <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-lg">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                    My Contacts
                  </h2>
                </div>
                <OwnerContacts />
              </div>
            )}
          </div>

          {/* Right Column - Profile & Tips */}
          <div className="space-y-8">
            {/* Profile Card */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-lg">
              <div className="text-center mb-6">
                <div className="w-24 h-24 bg-linear-to-br from-violet-500 to-indigo-500 rounded-2xl flex items-center justify-center text-white text-4xl font-bold mx-auto mb-4">
                  {user.fullname?.charAt(0).toUpperCase() || 'U'}
                </div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white">{user.fullname}</h3>
                <p className="text-slate-500 dark:text-slate-400">{user.university?.toUpperCase() || 'University Not Specified'}</p>
                <span className="inline-block mt-2 px-3 py-1 bg-violet-100 dark:bg-violet-900/30 text-violet-700 dark:text-violet-400 rounded-full text-sm font-medium capitalize">
                  {user.role}
                </span>
              </div>

              <div className="space-y-3 pt-4 border-t border-slate-200 dark:border-slate-700">
                <div className="flex items-center space-x-3 text-slate-600 dark:text-slate-300">
                  <Mail className="w-5 h-5 text-slate-400" />
                  <span className="text-sm">{user.email}</span>
                </div>
                <div className="flex items-center space-x-3 text-slate-600 dark:text-slate-300">
                  <Phone className="w-5 h-5 text-slate-400" />
                  <span className="text-sm">{user.phoneNumber}</span>
                </div>
              </div>

              <Link
                to="/profile"
                className="mt-6 w-full py-3 bg-violet-600 text-white rounded-xl font-medium hover:bg-violet-700 transition-colors flex items-center justify-center space-x-2"
              >
                <Settings className="w-5 h-5" />
                <span>Edit Profile</span>
              </Link>
            </div>

            {/* Tips Card
            <div className="bg-linear-to-br from-violet-600 to-indigo-600 rounded-2xl p-6 shadow-lg text-white">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                  <Star className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold">Pro Tips</h3>
              </div>
              <ul className="space-y-3 text-violet-100 text-sm">
                <li className="flex items-start space-x-2">
                  <CheckCircle className="w-5 h-5 shrink-0 mt-0.5" />
                  <span>Always visit the property before making payment</span>
                </li>
                <li className="flex items-start space-x-2">
                  <CheckCircle className="w-5 h-5 shrink-0 mt-0.5" />
                  <span>Read reviews from other students</span>
                </li>
                <li className="flex items-start space-x-2">
                  <CheckCircle className="w-5 h-5 shrink-0 mt-0.5" />
                  <span>Verify all amenities before signing agreement</span>
                </li>
                <li className="flex items-start space-x-2">
                  <CheckCircle className="w-5 h-5 shrink-0 mt-0.5" />
                  <span>Save multiple options to compare later</span>
                </li>
              </ul>
            </div> */}

            {/* Help Card */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-lg">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-orange-100 dark:bg-orange-900/30 rounded-xl flex items-center justify-center">
                  <AlertCircle className="w-6 h-6 text-orange-600 dark:text-orange-400" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">Need Help?</h3>
              </div>
              <p className="text-slate-600 dark:text-slate-300 text-sm mb-4">
                Our support team is available 24/7 to assist you with any questions.
              </p>
              <button className="w-full py-3 border-2 border-violet-500 text-violet-600 dark:text-violet-400 rounded-xl font-medium hover:bg-violet-50 dark:hover:bg-violet-900/20 transition-colors">
                Contact Support
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
