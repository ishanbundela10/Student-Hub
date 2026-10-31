import { useEffect, useState, useContext } from 'react';
import { Link, Navigate, useLocation } from 'react-router-dom';
import {
  Home, Building, Plus, TrendingUp, MapPin, CheckCircle, AlertCircle,
  User, Mail, Phone, DollarSign, Users, BedDouble,
  Sparkles, Settings, CalendarDays, Edit, UserCircle, MessageSquare
} from 'lucide-react';
import { AuthContext } from '../../context/AuthContext';
import { getMyProperties } from '@/api/property';
import { getOwnerDashboardStats } from '@/api/dashboard';
import { getOwnerVisits } from '@/api/visit'; // Ensure your visit API helper is exported
import AllBookings from '../AllBookings';
import AllVisits from '../AllVisits';
import OwnerContacts from '../OwnerContact';

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
  createdAt?: string;
}

interface ActivityItem {
  id: string;
  action: string;
  item: string;
  time: string;
  type: 'save' | 'apply' | 'view' | 'contact';
  rawDate: Date;
}

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState('overview');
  const [requestType, setRequestType] = useState<'visits' | 'bookings'>('bookings');

  const location = useLocation();
  const auth = useContext(AuthContext);

  if (!auth) return null;
  const { user, loading } = auth;

  if (loading) return <div className="min-h-screen flex items-center justify-center text-slate-600 font-bold">Loading...</div>;
  if (!user) return <Navigate to="/login" />;

  const [myProperties, setMyProperties] = useState<Property[]>([]);
  const [recentActivities, setRecentActivities] = useState<ActivityItem[]>([]);
  const [showAllActivities, setShowAllActivities] = useState(false);
  const [visitRequestCount, setVisitRequestCount] = useState(0);

  const [stats, setStats] = useState({
    activeListings: 0,
    occupiedRooms: 0,
    bookingRequests: 0,
    monthlyIncome: 0,
  });

  const ACTIVITY_PREVIEW_COUNT = 4;

  // ===================== FETCH REAL DATA =====================

  const fetchProperties = async () => {
    try {
      const res = await getMyProperties();
      const props = res?.data?.data || res?.data || [];
      setMyProperties(Array.isArray(props) ? props : []);
      return props;
    } catch (error) {
      console.error("Error fetching properties:", error);
      return [];
    }
  };

  const fetchStats = async () => {
    try {
      const res = await getOwnerDashboardStats();
      if (res?.data?.data) {
        setStats(res.data.data);
      }
    } catch (error) {
      console.error("Error fetching dashboard stats:", error);
    }
  };

  // Helper function to convert DB dates into "X hours ago"
  const formatTimeAgo = (dateInput?: string | Date) => {
    if (!dateInput) return "Recently";
    const date = new Date(dateInput);
    const now = new Date();
    const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (seconds < 60) return "Just now";
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes} minute${minutes > 1 ? "s" : ""} ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours} hour${hours > 1 ? "s" : ""} ago`;
    const days = Math.floor(hours / 24);
    return `${days} day${days > 1 ? "s" : ""} ago`;
  };

  // Build Real Activity Feed from DB records
  const loadRecentActivities = async (properties: Property[]) => {
    const activities: ActivityItem[] = [];

    // 1. Property listings
    properties.forEach((prop) => {
      if (prop.createdAt) {
        activities.push({
          id: `prop-${prop._id}`,
          action: "Listed a new property",
          item: prop.title || "Unnamed Property",
          time: formatTimeAgo(prop.createdAt),
          type: "save",
          rawDate: new Date(prop.createdAt),
        });
      }
    });

    // 2. Visit requests
    try {
      const visitRes = await getOwnerVisits();
      const visits = visitRes?.data?.data || visitRes?.data || [];
      if (Array.isArray(visits)) {
        // Count pending visits for badge
        const pendingVisits = visits.filter(
          (v: any) => !v.status || v.status === "pending"
        ).length;
        setVisitRequestCount(pendingVisits);

        visits.forEach((v: any) => {
          const studentName =
            v.student?.fullname || v.student?.fullName || "A student";
          const propertyTitle = v.property?.title || "your property";
          const statusLabel =
            v.status === "accepted"
              ? "accepted"
              : v.status === "rejected"
                ? "rejected"
                : "received";

          activities.push({
            id: `visit-${v._id}`,
            action: `Visit request ${statusLabel} from ${studentName}`,
            item: propertyTitle,
            time: formatTimeAgo(v.createdAt),
            type: "apply",
            rawDate: new Date(v.createdAt || Date.now()),
          });
        });
      }
    } catch (err) {
      // Visit API optional
    }

    // Sort by latest first & limit to top 5
    activities.sort((a, b) => b.rawDate.getTime() - a.rawDate.getTime());
    setRecentActivities(activities);
  };

  const totalRequestsBadge = (stats.bookingRequests || 0) + (visitRequestCount || 0);

  useEffect(() => {
    const initDashboard = async () => {
      const props = await fetchProperties();
      await fetchStats();
      await loadRecentActivities(props);
    };

    initDashboard();

    if (location.state?.refresh) {
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);

  const refreshDashboard = async () => {
    const props = await fetchProperties();
    await fetchStats();
    await loadRecentActivities(props);
  };

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

            {/* Quick Actions / Settings Link */}
            <div className="flex items-center space-x-4">
              <Link
                to="/profile"
                className="p-3 bg-white dark:bg-slate-800 rounded-xl shadow-lg hover:shadow-xl transition-shadow flex items-center gap-2 text-slate-700 dark:text-slate-200 font-semibold text-sm"
              >
                <Settings className="w-5 h-5 text-slate-600 dark:text-slate-300" />
                <span>Account Settings</span>
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

            {/* Tab Content: Overview */}
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
                      onClick={() => setActiveTab("requests")}
                      className="flex flex-col items-center p-4 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl hover:bg-indigo-100 dark:hover:bg-indigo-900/30 transition-colors relative"
                    >
                      <CheckCircle className="w-8 h-8 text-indigo-600 dark:text-indigo-400 mb-2" />
                      <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                        View Requests
                      </span>

                      {/* Combined Booking + Visit badge */}
                      {totalRequestsBadge > 0 && (
                        <span className="absolute top-2 right-2 min-w-5 h-5 px-1.5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center shadow-sm">
                          {totalRequestsBadge > 9 ? "9+" : totalRequestsBadge}
                        </span>
                      )}
                    </button>

                    <button
                      onClick={() => setActiveTab('properties')}
                      className="flex flex-col items-center p-4 bg-orange-50 dark:bg-orange-900/20 rounded-xl hover:bg-orange-100 dark:hover:bg-orange-900/30 transition-colors"
                    >
                      <CalendarDays className="w-8 h-8 text-orange-600 dark:text-orange-400 mb-2" />
                      <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                        Manage Properties
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
                {/* ⚡ REAL RECENT ACTIVITY FEED */}
                <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-lg">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                      Recent Activity
                    </h2>
                    <div className='flex items-center gap-3'>
                      <div>
                        {recentActivities.length > 0 && (
                          <span className="text-xs font-semibold text-slate-400 bg-slate-100 dark:bg-slate-700 px-2.5 py-1 rounded-full">
                            {recentActivities.length} total
                          </span>
                        )}
                      </div>
                      {/* Show more / Show less */}
                      {recentActivities.length > ACTIVITY_PREVIEW_COUNT && (
                        <div className=" text-center">
                          <button
                            onClick={() => setShowAllActivities((prev) => !prev)}
                            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold text-violet-600 dark:text-violet-400 bg-violet-50 dark:bg-violet-900/20 hover:bg-violet-100 dark:hover:bg-violet-900/40 transition-colors"
                          >
                            {showAllActivities ? (
                              <>Show less</>
                            ) : (
                              <>
                                Show more
                                <span className="bg-violet-600 text-white text-[10px] font-black px-1.5 py-0.5 rounded-md">
                                  +{recentActivities.length - ACTIVITY_PREVIEW_COUNT}
                                </span>
                              </>
                            )}
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  {recentActivities.length === 0 ? (
                    <div className="p-8 text-center bg-slate-50 dark:bg-slate-700/30 rounded-xl border border-dashed border-slate-200 dark:border-slate-700">
                      <Sparkles className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                      <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">
                        No recent activities found.
                      </p>
                      <p className="text-xs text-slate-400 mt-1">
                        Activities will appear as students interact with your listings.
                      </p>
                    </div>
                  ) : (
                    <>
                      <div className="space-y-4">
                        {(showAllActivities
                          ? recentActivities
                          : recentActivities.slice(0, ACTIVITY_PREVIEW_COUNT)
                        ).map((activity) => (
                          <div
                            key={activity.id}
                            className="flex items-start space-x-4 p-4 bg-slate-50 dark:bg-slate-700/50 rounded-xl"
                          >
                            <div className="w-10 h-10 bg-white dark:bg-slate-600 rounded-lg flex items-center justify-center shrink-0 shadow-sm">
                              {getActivityIcon(activity.type)}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-slate-900 dark:text-white text-sm font-medium leading-snug">
                                <span>{activity.action}</span>
                                <span className="text-violet-600 dark:text-violet-400 font-bold ml-1">
                                  {" "}
                                  - {activity.item}
                                </span>
                              </p>
                              <p className="text-xs text-slate-400 mt-1 font-medium">
                                {activity.time}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </>
                  )}
                </div>
              </div>
            )}

            {/* Properties Tab */}
            {activeTab === 'properties' && (
              <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-lg">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-slate-900 dark:text-white">My Properties</h2>
                  {myProperties.length > 0 && (
                    <Link to="/add-property" className="text-sm text-violet-600 dark:text-violet-400 font-medium hover:text-violet-700">
                      Add new
                    </Link>
                  )}
                </div>

                {myProperties.length > 0 ? (
                  <div className="grid md:grid-cols-2 gap-4">
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
                                ₹{property.price?.toLocaleString() || '0'}/month
                              </span>
                              <Link
                                to={`/edit-property/${property._id}`}
                                className="p-2 bg-violet-100 text-violet-700 rounded-lg hover:bg-violet-200 transition-colors"
                                title="Edit Property"
                              >
                                <Edit className="w-4 h-4" />
                              </Link>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-16 bg-slate-50 dark:bg-slate-700/30 border border-dashed border-slate-300 dark:border-slate-700 rounded-3xl">
                    <Building className="w-16 h-16 text-violet-400 mb-4" />
                    <h3 className="text-2xl font-bold text-slate-800 dark:text-white mb-2">No Properties Yet</h3>
                    <p className="text-slate-500 dark:text-slate-400 text-center max-w-md mb-6">
                      You haven't listed any rooms, hostels, or PGs yet. Start by adding your first property.
                    </p>
                    <Link
                      to="/add-property"
                      className="inline-flex items-center gap-2 px-6 py-3 bg-violet-600 hover:bg-violet-700 text-white font-semibold rounded-xl transition-all shadow-lg"
                    >
                      <Plus className="w-5 h-5" />
                      Add Your First Property
                    </Link>
                  </div>
                )}
              </div>
            )}

            {/* Requests Tab */}
            {activeTab === 'requests' && (
              <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-lg">
                <div className="mb-6">
                  <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4">Tenant Requests</h2>
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

                <div className="mt-6">
                  {requestType === 'bookings' ? (
                    <AllBookings onAction={refreshDashboard} />
                  ) : (
                    <AllVisits onAction={refreshDashboard} />
                  )}
                </div>
              </div>
            )}

            {/* Contact Tab */}
            {activeTab === 'contact' && (
              <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-lg">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-slate-900 dark:text-white">My Contacts</h2>
                </div>
                <OwnerContacts />
              </div>
            )}
          </div>

          {/* Right Column: Profile Summary & Help */}
          <div className="space-y-8">
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
                  <Mail className="w-5 h-5 text-slate-400 shrink-0" />
                  <span className="text-sm truncate">{user.email}</span>
                </div>
                <div className="flex items-center space-x-3 text-slate-600 dark:text-slate-300">
                  <Phone className="w-5 h-5 text-slate-400 shrink-0" />
                  <span className="text-sm">{user.phoneNumber || 'No phone added'}</span>
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