import { useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import {
  Home, Key, Building, Utensils, Heart, Calendar, MessageSquare,
  Settings, Bell, Search, Plus, TrendingUp, MapPin,
  Star, Clock, CheckCircle, AlertCircle, ChevronRight, User, Mail, Phone
} from 'lucide-react';
import { useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState('overview');
  const [showNotifications, setShowNotifications] = useState(false);
  // const [notifications, setNotifications] = useState([
  //   { id: 1, title: 'Application Approved!', message: 'Your application for Premium Boys Hostel has been approved.', time: '1 hour ago', unread: true },
  //   { id: 2, title: 'New Message', message: 'Rajesh Kumar sent you a message about Cozy Studio.', time: '3 hours ago', unread: true },
  //   { id: 3, title: 'Viewing Reminder', message: 'You have a property viewing scheduled for tomorrow at 10 AM.', time: '5 hours ago', unread: false },
  //   { id: 4, title: 'Price Drop', message: 'Spacious 1BHK price reduced to ₹11,000/month.', time: '1 day ago', unread: false }
  // ]);

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

  const stats = {
    savedProperties: 12,
    applicationsSent: 5,
    viewingsScheduled: 3,
    messagesUnread: 8
  };

  const savedProperties = [
    {
      id: 1,
      title: 'Cozy Studio Near University',
      type: 'room',
      price: 8500,
      location: 'Sector 15, Delhi',
      image: 'https://images.unsplash.com/photo-1522771753035-1a5b6569f3b9?w=400',
      savedAt: '2 days ago'
    },
    {
      id: 2,
      title: 'Premium Boys Hostel - Deluxe Room',
      type: 'hostel',
      price: 6500,
      location: 'MG Road, Delhi',
      image: 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=400',
      savedAt: '5 days ago'
    },
    {
      id: 3,
      title: 'Ghar Ka Khana Tiffin',
      type: 'tiffin',
      price: 60,
      location: 'Sector 14, Delhi',
      image: 'https://images.unsplash.com/photo-1585937421612-70a008356f36?w=400',
      savedAt: '1 week ago'
    }
  ];

  const applications = [
    {
      id: 1,
      property: 'Cozy Studio Near University',
      type: 'room',
      status: 'pending',
      appliedAt: '3 days ago',
      owner: 'Rajesh Kumar'
    },
    {
      id: 2,
      property: 'Premium Boys Hostel',
      type: 'hostel',
      status: 'approved',
      appliedAt: '1 week ago',
      owner: 'Student Hub Management'
    },
    {
      id: 3,
      property: 'Spacious 1BHK for Students',
      type: 'room',
      status: 'rejected',
      appliedAt: '2 weeks ago',
      owner: 'Priya Sharma'
    }
  ];

  const recentActivity = [
    { id: 1, action: 'Saved a new room', item: 'Cozy Studio Near University', time: '2 hours ago', type: 'save' },
    { id: 2, action: 'Sent application', item: 'Premium Boys Hostel', time: '5 hours ago', type: 'apply' },
    { id: 3, action: 'Viewed property', item: 'Girls Hostel - Safe & Secure', time: '1 day ago', type: 'view' },
    { id: 4, action: 'Contacted owner', item: 'Ghar Ka Khana Tiffin', time: '2 days ago', type: 'contact' },
    { id: 5, action: 'Saved a tiffin service', item: 'South Indian Delights', time: '3 days ago', type: 'save' }
  ];

  const notifications = [
    { id: 1, title: 'Application Approved!', message: 'Your application for Premium Boys Hostel has been approved.', time: '1 hour ago', unread: true },
    { id: 2, title: 'New Message', message: 'Rajesh Kumar sent you a message about Cozy Studio.', time: '3 hours ago', unread: true },
    { id: 3, title: 'Viewing Reminder', message: 'You have a property viewing scheduled for tomorrow at 10 AM.', time: '5 hours ago', unread: false },
    { id: 4, title: 'Price Drop', message: 'Spacious 1BHK price reduced to ₹11,000/month.', time: '1 day ago', unread: false }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400';
      case 'pending': return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400';
      case 'rejected': return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400';
      default: return 'bg-slate-100 text-slate-700';
    }
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'save': return <Heart className="w-4 h-4 text-red-500" />;
      case 'apply': return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'view': return <Search className="w-4 h-4 text-blue-500" />;
      case 'contact': return <MessageSquare className="w-4 h-4 text-purple-500" />;
      default: return <Clock className="w-4 h-4 text-slate-500" />;
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
                Welcome back, {user.fullname.split(' ')[0]}! 👋
              </h1>
              <p className="text-lg text-slate-600 dark:text-slate-300">
                Here's what's happening with your account today.
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
                <Heart className="w-6 h-6 text-violet-600 dark:text-violet-400" />
              </div>
              <TrendingUp className="w-5 h-5 text-green-500" />
            </div>
            <div className="text-3xl font-bold text-slate-900 dark:text-white">{stats.savedProperties}</div>
            <div className="text-sm text-slate-500 dark:text-slate-400">Saved Properties</div>
          </div>

          <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-indigo-100 dark:bg-indigo-900/30 rounded-xl flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
              </div>
              <TrendingUp className="w-5 h-5 text-green-500" />
            </div>
            <div className="text-3xl font-bold text-slate-900 dark:text-white">{stats.applicationsSent}</div>
            <div className="text-sm text-slate-500 dark:text-slate-400">Applications Sent</div>
          </div>

          <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900/30 rounded-xl flex items-center justify-center">
                <Calendar className="w-6 h-6 text-orange-600 dark:text-orange-400" />
              </div>
              <TrendingUp className="w-5 h-5 text-green-500" />
            </div>
            <div className="text-3xl font-bold text-slate-900 dark:text-white">{stats.viewingsScheduled}</div>
            <div className="text-sm text-slate-500 dark:text-slate-400">Viewings Scheduled</div>
          </div>

          <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-xl flex items-center justify-center">
                <MessageSquare className="w-6 h-6 text-green-600 dark:text-green-400" />
              </div>
              {stats.messagesUnread > 0 && (
                <span className="px-2 py-1 bg-red-500 text-white text-xs font-bold rounded-full">
                  {stats.messagesUnread}
                </span>
              )}
            </div>
            <div className="text-3xl font-bold text-slate-900 dark:text-white">{stats.messagesUnread}</div>
            <div className="text-sm text-slate-500 dark:text-slate-400">Unread Messages</div>
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
                  { id: 'saved', label: 'Saved', icon: Heart },
                  { id: 'applications', label: 'Applications', icon: CheckCircle },
                  { id: 'messages', label: 'Messages', icon: MessageSquare }
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
                      to="/rooms"
                      className="flex flex-col items-center p-4 bg-violet-50 dark:bg-violet-900/20 rounded-xl hover:bg-violet-100 dark:hover:bg-violet-900/30 transition-colors"
                    >
                      <Key className="w-8 h-8 text-violet-600 dark:text-violet-400 mb-2" />
                      <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Find Rooms</span>
                    </Link>
                    <Link
                      to="/hostels"
                      className="flex flex-col items-center p-4 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl hover:bg-indigo-100 dark:hover:bg-indigo-900/30 transition-colors"
                    >
                      <Building className="w-8 h-8 text-indigo-600 dark:text-indigo-400 mb-2" />
                      <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Find Hostels</span>
                    </Link>
                    <Link
                      to="/tiffin"
                      className="flex flex-col items-center p-4 bg-orange-50 dark:bg-orange-900/20 rounded-xl hover:bg-orange-100 dark:hover:bg-orange-900/30 transition-colors"
                    >
                      <Utensils className="w-8 h-8 text-orange-600 dark:text-orange-400 mb-2" />
                      <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Find Tiffin</span>
                    </Link>
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

            {activeTab === 'saved' && (
              <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-lg">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-slate-900 dark:text-white">Saved Properties</h2>
                  <Link to="/rooms" className="text-sm text-violet-600 dark:text-violet-400 font-medium hover:text-violet-700">
                    View all
                  </Link>
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  {savedProperties.map((property) => (
                    <div key={property.id} className="flex space-x-4 p-4 bg-slate-50 dark:bg-slate-700/50 rounded-xl">
                      <img
                        src={property.image}
                        alt={property.title}
                        className="w-24 h-24 object-cover rounded-lg shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2 mb-1">
                          <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${property.type === 'room' ? 'bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-400' :
                              property.type === 'hostel' ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400' :
                                'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400'
                            }`}>
                            {property.type}
                          </span>
                        </div>
                        <h3 className="font-semibold text-slate-900 dark:text-white text-sm truncate">{property.title}</h3>
                        <div className="flex items-center text-slate-500 dark:text-slate-400 text-xs mt-1">
                          <MapPin className="w-3 h-3 mr-1" />
                          {property.location || 'Location not added'}
                        </div>
                        <div className="flex items-center justify-between mt-2">
                          <span className="text-lg font-bold text-violet-600 dark:text-violet-400">
                            ₹{property.price.toLocaleString()}
                            {property.type === 'tiffin' ? '/meal' : '/month'}
                          </span>
                          <span className="text-xs text-slate-400">{property.savedAt}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'applications' && (
              <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-lg">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-slate-900 dark:text-white">My Applications</h2>
                  <button className="flex items-center space-x-2 px-4 py-2 bg-violet-600 text-white rounded-xl hover:bg-violet-700 transition-colors">
                    <Plus className="w-4 h-4" />
                    <span>New Application</span>
                  </button>
                </div>
                <div className="space-y-4">
                  {applications.map((app) => (
                    <div key={app.id} className="p-4 bg-slate-50 dark:bg-slate-700/50 rounded-xl">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h3 className="font-semibold text-slate-900 dark:text-white">{app.property}</h3>
                          <p className="text-sm text-slate-500 dark:text-slate-400">Owner: {app.owner}</p>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium capitalize ${getStatusColor(app.status)}`}>
                          {app.status}
                        </span>
                      </div>
                      <div className="flex items-center justify-between mt-3 pt-3 border-t border-slate-200 dark:border-slate-600">
                        <span className="text-xs text-slate-500 dark:text-slate-400">Applied {app.appliedAt}</span>
                        <button className="text-sm text-violet-600 dark:text-violet-400 font-medium hover:text-violet-700 flex items-center">
                          View Details <ChevronRight className="w-4 h-4 ml-1" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'messages' && (
              <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-lg">
                <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6">Messages</h2>
                <div className="text-center py-12">
                  <MessageSquare className="w-16 h-16 text-slate-300 dark:text-slate-600 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">No messages yet</h3>
                  <p className="text-slate-500 dark:text-slate-400 mb-4">
                    Start conversations with property owners
                  </p>
                  <Link
                    to="/rooms"
                    className="inline-flex items-center px-6 py-3 bg-violet-600 text-white rounded-xl hover:bg-violet-700 transition-colors"
                  >
                    Browse Properties
                  </Link>
                </div>
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

            {/* Tips Card */}
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
            </div>

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
