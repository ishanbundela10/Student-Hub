import { useContext, useEffect, useState } from 'react';
import { User, Mail, Phone, MapPin, Edit2, Save, X, Briefcase, GraduationCap } from 'lucide-react';
import { AuthContext } from "@/context/AuthContext";
import { updateProfile } from '@/api/auth';
import { Navigate } from 'react-router-dom';

export default function Profile() {
  const [isEditing, setIsEditing] = useState(false);
  const auth = useContext(AuthContext);

  if (!auth) {
    throw new Error("AuthContext not found")
  }

  const { user, setUser, loading } = auth
  const roleLabels = {
    student: "Student",
    owner: "Property Owner",
    food_service: "Food Service",
  } as const;

  const [formData, setFormData] = useState({
    fullname: "",
    email: "",
    phoneNumber: "",
    role: "student",
    profileImage: "",
    bio: "",
    university: "",
    location: {
      city: "",
      state: ""
    },
  });
  useEffect(() => {
    if (user) {
      setFormData({
        fullname: user.fullname,
        email: user.email,
        phoneNumber: user.phoneNumber,
        role: user.role,
        profileImage: user.profileImage || "",
        bio: user.bio || "",
        university: user.university || "",
        location:{
          city: user.location?.city ?? "",
          state: user.location?.state?? ""
        },
      });
    }

  }, [user]);

  const handleSave = async () => {
    try {
      const res = await updateProfile(formData);
      console.log(res.data);
      console.log(res.data.data);
      setUser(res.data.data);
      setIsEditing(false);
    } catch (error) {
      console.error(error);
    }
  };

  const handleCancel = () => {
    setFormData(user ? {
      fullname: user.fullname,
      email: user.email,
      phoneNumber: user.phoneNumber,
      role: user.role,
      profileImage: user.profileImage || "",
      bio: user.bio || "",
      university: user.university || "",
      location: {
        city: user.location?.city ?? "",
        state: user.location?.state ?? "",
      },
    }
      : {
        fullname: "",
        email: "",
        phoneNumber: "",
        role: "student",
        profileImage: "",
        bio: "",
        university: "",
        location: {
          city: "",
          state: ""
        },
      });
    setIsEditing(false);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/login" />;
  }

  return (
    <div className="min-h-screen pt-20 pb-12 bg-linear-to-br from-slate-50 to-violet-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-slate-900 mb-2">My Profile</h1>
          <p className="text-lg text-slate-600">Manage your account and preferences</p>
        </div>

        <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/50 overflow-hidden">
          {/* Profile Header */}
          <div className="relative h-48 bg-linear-to-r from-violet-600 to-indigo-600">
            <div className="absolute -bottom-16 left-8">
              <div className="w-32 h-32 bg-white rounded-2xl shadow-xl flex items-center justify-center">
                <div className="w-28 h-28 bg-linear-to-br from-violet-500 to-indigo-500 rounded-xl flex items-center justify-center text-white text-5xl font-bold">
                  {user?.fullname?.charAt(0).toUpperCase() || "U"}
                </div>
              </div>
            </div>
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="absolute top-4 right-4 flex items-center space-x-2 px-4 py-2 bg-white/20 backdrop-blur-sm text-white rounded-lg hover:bg-white/30 transition-colors"
            >
              {isEditing ? (
                <>
                  <Save className="w-4 h-4" />
                  <span onClick={handleCancel}>Cancel</span>
                </>
              ) : (
                <>
                  <Edit2 className="w-4 h-4" />
                  <span>Edit Profile</span>
                </>
              )}
            </button>
          </div>

          {/* Profile Content */}
          <div className="pt-20 px-8 pb-8">
            {isEditing ? (
              <div className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Full Name
                    </label>
                    <input
                      type="text"
                      value={formData.fullname}
                      onChange={(e) => setFormData({ ...formData, fullname: e.target.value })}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Email
                    </label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Phone
                    </label>
                    <input
                      type="tel"
                      value={formData.phoneNumber}
                      onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Role
                    </label>
                    <select
                      value={formData.role}
                      onChange={(e) => setFormData({ ...formData, role: e.target.value as 'student' | 'food_service' | 'owner' })}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500"
                    >
                      <option value="student">Student</option>
                      <option value="food_service">Food service (Tiffin Provider)</option>
                      <option value="owner">Property Owner</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      {formData.role === 'student' ? 'University/College' : 'Business Name'}
                    </label>
                    <input
                      type="text"
                      value={formData.university}
                      onChange={(e) => setFormData({ ...formData, university: e.target.value })}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Location
                    </label>
                    <input
                      type="text"
                      value={formData.location.city}
                      onChange={(e) => setFormData({ ...formData, location: { ...formData.location, city: e.target.value } })}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Bio
                  </label>
                  <textarea
                    value={formData.bio}
                    onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                    rows={4}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500 resize-none"
                  />
                </div>

                <div className="flex space-x-4 pt-4">
                  <button
                    onClick={handleSave}
                    className="flex items-center space-x-2 px-6 py-3 bg-linear-to-r from-violet-600 to-indigo-600 text-white font-medium rounded-xl hover:from-violet-700 hover:to-indigo-700 transition-all"
                  >
                    <Save className="w-5 h-5" />
                    <span>Save Changes</span>
                  </button>
                  <button
                    onClick={handleCancel}
                    className="flex items-center space-x-2 px-6 py-3 bg-slate-100 text-slate-700 font-medium rounded-xl hover:bg-slate-200 transition-colors"
                  >
                    <X className="w-5 h-5" />
                    <span>Cancel</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-8">
                {/* Info Grid */}
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="flex items-start space-x-4 p-4 bg-slate-50 rounded-xl">
                    <div className="w-10 h-10 bg-violet-100 rounded-lg flex items-center justify-center">
                      <User className="w-5 h-5 text-violet-600" />
                    </div>
                    <div>
                      <div className="text-sm text-slate-500">Full Name</div>
                      <div className="font-semibold text-slate-900">{user.fullname}</div>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4 p-4 bg-slate-50 rounded-xl">
                    <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
                      <Mail className="w-5 h-5 text-indigo-600" />
                    </div>
                    <div>
                      <div className="text-sm text-slate-500">Email</div>
                      <div className="font-semibold text-slate-900">{user.email}</div>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4 p-4 bg-slate-50 rounded-xl">
                    <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                      <Phone className="w-5 h-5 text-green-600" />
                    </div>
                    <div>
                      <div className="text-sm text-slate-500">Phone</div>
                      <div className="font-semibold text-slate-900">{user.phoneNumber}</div>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4 p-4 bg-slate-50 rounded-xl">
                    <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                      <Briefcase className="w-5 h-5 text-orange-600" />
                    </div>
                    <div>
                      <div className="text-sm text-slate-500">Role</div>
                      <div className="font-semibold text-slate-900 capitalize">{roleLabels[user.role]}</div>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4 p-4 bg-slate-50 rounded-xl">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                      {user.role === 'student' ? (
                        <GraduationCap className="w-5 h-5 text-blue-600" />
                      ) : (
                        <Briefcase className="w-5 h-5 text-blue-600" />
                      )}
                    </div>
                    <div>
                      <div className="text-sm text-slate-500">
                        {user.role === "student"
                          ? "University"
                          : user.role === "owner"
                            ? "Business"
                            : "Food Service"}
                      </div>
                      <div className="font-semibold text-slate-900">{user.university? `${user.university}` : "NA"}</div>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4 p-4 bg-slate-50 rounded-xl">
                    <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                      <MapPin className="w-5 h-5 text-red-600" />
                    </div>
                    <div>
                      <div className="text-sm text-slate-500">Location</div>
                      <div className="font-semibold text-slate-900">{user.location?.city || "Location not specified"}</div>
                    </div>
                  </div>
                </div>

                {/* Bio */}
                <div className="p-6 bg-slate-50 rounded-xl">
                  <h3 className="font-semibold text-slate-900 mb-3">About Me</h3>
                  <p className="text-slate-600">{user.bio? `${user.bio}` : "NA"}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
