import { useContext, useEffect, useState } from 'react';
import Hero from '../components/Hero';
import PropertyCard from '../components/PropertyCard';
// import TiffinCard from '../components/TiffinCard';
import { ArrowRight, Shield, Home as HomeIcon, Utensils, Heart, LucideIcon } from 'lucide-react';
import { Link } from 'react-router-dom';
import { AuthContext } from '@/context/AuthContext';
import { Property} from '@/types';
import { getAllProperties } from '@/api/property';

export default function HomePage() {
  const [featuredRooms, setFeaturedRooms] = useState<Property[]>([]);
  const [featuredHostels, setFeaturedHostels] = useState<Property[]>([]);
  // const [featuredTiffins, setFeaturedTiffins] = useState<TiffinService[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [roomsRes, hostelsRes] = await Promise.all([
          getAllProperties("room"),
          getAllProperties("hostel,pg"),
          // getAllTiffins(),
        ]);

        setFeaturedRooms(roomsRes.data.data);
        setFeaturedHostels(hostelsRes.data.data);
        // setFeaturedTiffins(tiffinRes.data.data);
      } catch (err) {
        console.error(err);
      }
    }

    fetchData();
  }, []);
  const auth = useContext(AuthContext);

  if (!auth) {
    return null;
  }
  const { user, loading } = auth

  if (loading) {
    return <div>Loading...</div>;
  }

  // if (!user) {
  //   return <HomePage />;
  // }
  
  const features: {
    icon: LucideIcon;
    title: string;
    description: string;
    bg: string;
    color: string;
  }[] = [
      {
        icon: Shield,
        title: "Verified Listings",
        description: "All properties are verified for safety and authenticity.",
        bg: "bg-violet-100",
        color: "text-violet-600",
      },
      {
        icon: HomeIcon,
        title: "Affordable Options",
        description: "Budget-friendly choices for every student.",
        bg: "bg-indigo-100",
        color: "text-indigo-600",
      },
      {
        icon: Utensils,
        title: "Homely Food",
        description: "Connect with local housewives for fresh tiffin services.",
        bg: "bg-orange-100",
        color: "text-orange-600",
      },
      {
        icon: Heart,
        title: "24/7 Support",
        description: "We're here to help you anytime, anywhere.",
        bg: "bg-green-100",
        color: "text-green-600",
      },
    ];


  return (
    <div className="min-h-screen">
      <Hero />

      {/* Why Choose Us Section */}
      <section className="py-24 bg-linear-to-b from-violet-200 to-violet-50">
        <div className="max-w-7xl mx-auto my-5 px-4 sm:px-6 lg:px-8 flex flex-col justify-center align-middle items-center ">
          <div className="inline-flex items-center size-fit gap-2 bg-violet-100 text-violet-700 px-4 py-2 rounded-full text-sm font-semibold mb-4">
            ⭐ Why Choose StudentHub
          </div>
          <h2 className="text-4xl lg:text-5xl font-bold text-slate-900 md:col-span-3">
            Why Students Love Us ?
          </h2>
        </div>
        <div className='w-full h-fit flex gap-5 md:gap-7 justify-center items-center flex-wrap '>
          {features.map((feature) => (
            <>
              <div
                key={feature.title}
                className="bg-violet-50 rounded-3xl p-6 flex flex-col items-center text-center gap-4 shadow-lg hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 border border-violet-100"
              >
                <div
                  className={`w-20 h-20 ${feature.bg} rounded-3xl flex items-center justify-center`}
                >
                  <feature.icon className={`w-10 h-10 ${feature.color}`} />
                </div>

                <h3 className="text-xl font-semibold text-slate-900">
                  {feature.title}
                </h3>

                <p className="text-slate-600 leading-relaxed w-60">
                  {feature.description}
                </p>
              </div>
            </>
          ))}
        </div>
      </section>

      {/* Featured Rooms Section */}
      <section className="py-20 bg-linear-to-br from-violet-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-12">
            <div>
              <h2 className="text-4xl font-bold text-slate-900 mb-2">Featured Rooms</h2>
              <p className="text-lg text-slate-600">Fully furnished rooms near top universities</p>
            </div>
            <Link
              to="/rooms"
              className="flex items-center text-violet-600 font-medium hover:text-violet-700 hover:translate-x-1 transition-all"
            >
              View All
              <ArrowRight className="w-5 h-5 ml-2" />
            </Link>
          </div>

          <div className="flex gap-6 justify-center items-center overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-hide">
            {featuredRooms.slice(0,5).map((property) => (
              <div
                key={property._id}
                className="min-w-[320px] max-w-[320px] snap-start shrink-0"
              >
                <PropertyCard property={property} />
              </div>
            ))}
            <Link
              to="/rooms"
              className="min-w-10 max-w-[200px] max-h-[100px] shrink-0 snap-start rounded-2xl border-2 border-dashed border-violet-300 bg-violet-50 hover:bg-violet-100 transition-all duration-300 flex flex-col items-center justify-center text-violet-600 hover:text-violet-700"
            >
              <ArrowRight className="w-12 h-12 mb-4" />
              <h3 className="text-2xl font-bold">View All</h3>
              <p className="text-sm text-center mt-2 px-6">
                Explore all available rooms
              </p>
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Hostels Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-12">
            <div>
              <h2 className="text-4xl font-bold text-slate-900 mb-2">Premium Hostels</h2>
              <p className="text-lg text-slate-600">Safe and secure hostel accommodations</p>
            </div>
            <Link
              to="/hostels"
              className="flex items-center text-indigo-600 font-medium hover:text-indigo-700"
            >
              View All
              <ArrowRight className="w-5 h-5 ml-2" />
            </Link>
          </div>

          <div className="flex gap-6 justify-center items-center overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-hide">
            {featuredHostels.slice(0,5).map((property) => (
              <div
                key={property._id}
                className="min-w-[320px] max-w-[320px] snap-start shrink-0"
              >
                <PropertyCard property={property} />
              </div>
            ))}
            <Link
              to="/rooms"
              className="min-w-10 max-w-[200px] max-h-[100px] shrink-0 snap-start rounded-2xl border-2 border-dashed border-violet-300 bg-violet-50 hover:bg-violet-100 transition-all duration-300 flex flex-col items-center justify-center text-violet-600 hover:text-violet-700"
            >
              <ArrowRight className="w-12 h-12 mb-4" />
              <h3 className="text-2xl font-bold">View All</h3>
              <p className="text-sm text-center mt-2 px-6">
                Explore all available rooms
              </p>
            </Link>
          </div>
        </div>
      </section>

      {/* Tiffin Services Section */}
      <section className="py-20 bg-linear-to-br from-orange-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-12">
            <div>
              <h2 className="text-4xl font-bold text-slate-900 mb-2">Homely Tiffin Services</h2>
              <p className="text-lg text-slate-600">Healthy food from local housewives</p>
            </div>
            <Link
              to="/tiffin"
              className="flex items-center text-orange-600 font-medium hover:text-orange-700"
            >
              View All
              <ArrowRight className="w-5 h-5 ml-2" />
            </Link>
          </div>

          {/* <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredTiffins.map((tiffin) => (
              <TiffinCard key={tiffin._id} tiffin={tiffin} />
            ))}
          </div> */}
        </div>
      </section>

      {/* CTA Section */}
      { !user && <section className="py-20 bg-linear-to-r from-violet-600 to-indigo-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-white mb-4">
            Ready to Find Your Perfect Stay?
          </h2>
          <p className="text-xl text-violet-100 mb-8">
            Join thousands of students who found their ideal accommodation through StudentHub
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4">
            <Link
              to="/signup"
              className="px-8 py-4 bg-white text-violet-600 font-semibold rounded-xl hover:bg-violet-50 transition-colors shadow-lg"
            >
              Create Free Account
            </Link>
            <Link
              to="/rooms"
              className="px-8 py-4 bg-violet-500 text-white font-semibold rounded-xl hover:bg-violet-400 transition-colors"
            >
              Browse Listings
            </Link>
          </div>
        </div>
      </section>}

      {/* Footer */}
      <footer className="bg-slate-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-10 h-10 bg-linear-to-br from-violet-500 to-indigo-500 rounded-xl flex items-center justify-center">
                  <HomeIcon className="w-6 h-6 text-white" />
                </div>
                <span className="text-xl font-bold">StudentHub</span>
              </div>
              <p className="text-slate-400">
                Your trusted partner for student accommodation and tiffin services.
              </p>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2 text-slate-400">
                <li><Link to="/rooms" className="hover:text-white">Rented Rooms</Link></li>
                <li><Link to="/hostels" className="hover:text-white">Hostels</Link></li>
                <li><Link to="/tiffin" className="hover:text-white">Tiffin Service</Link></li>
                <li><Link to="/profile" className="hover:text-white">Profile</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-slate-400">
                <li><a href="#" className="hover:text-white">Help Center</a></li>
                <li><a href="#" className="hover:text-white">Safety Tips</a></li>
                <li><a href="#" className="hover:text-white">Contact Us</a></li>
                <li><a href="#" className="hover:text-white">Privacy Policy</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Contact</h4>
              <ul className="space-y-2 text-slate-400">
                <li>support@studenthub.com</li>
                <li>+91 90099 49018</li>
                <li>Bhopal, India</li>
              </ul>
            </div>
          </div>

          <div className="border-t border-slate-800 mt-8 pt-8 text-center text-slate-400">
            <p>&copy; 2026 StudentHub. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
