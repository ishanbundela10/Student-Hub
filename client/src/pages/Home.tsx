import { useContext, useEffect, useState } from 'react';
import Hero from '../components/Hero';
import PropertyCard from '../components/PropertyCard';
import TiffinCard from '../components/TiffinCard';
import { ArrowRight, Shield, Home as HomeIcon, Utensils, Heart, LucideIcon } from 'lucide-react';
import { Link } from 'react-router-dom';
import { AuthContext } from '@/context/AuthContext';
import { Property } from '@/types';
import { getAllProperties } from '@/api/property';
import { TiffinService } from '@/types';
import { getTiffins } from '@/api/tiffin';

const PropertyCardSkeleton = () => (
  <div className="min-w-[300px] w-[300px] sm:min-w-[320px] sm:w-[320px] snap-start shrink-0">
    <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-md animate-pulse">
      <div className="relative h-48 bg-slate-200">
        <div className="absolute top-3 left-3 flex gap-2">
          <div className="w-16 h-6 bg-slate-300 rounded-full" />
        </div>
        <div className="absolute bottom-3 right-0">
          <div className="w-24 h-8 bg-slate-300 rounded-l-2xl" />
        </div>
      </div>
      <div className="p-5 space-y-3">
        <div className="h-5 bg-slate-200 rounded-md w-3/4" />
        <div className="h-4 bg-slate-200 rounded-md w-1/2" />
        <div className="flex gap-2 pt-2">
          <div className="w-14 h-6 bg-slate-200 rounded-full" />
          <div className="w-14 h-6 bg-slate-200 rounded-full" />
        </div>
      </div>
    </div>
  </div>
);

const TiffinCardSkeleton = () => (
  <div className="bg-white rounded-3xl p-4 shadow-sm animate-pulse border border-slate-100">
    <div className="w-full h-48 bg-slate-200 rounded-2xl mb-4" />
    <div className="h-6 bg-slate-200 rounded-lg w-3/4 mb-3" />
    <div className="h-4 bg-slate-200 rounded-lg w-1/2 mb-4" />
    <div className="h-10 bg-slate-200 rounded-xl" />
  </div>
);

export default function HomePage() {
  const [featuredRooms, setFeaturedRooms] = useState<Property[]>([]);
  const [featuredHostels, setFeaturedHostels] = useState<Property[]>([]);
  const [featuredTiffins, setFeaturedTiffins] = useState<TiffinService[]>([]);
  const [dataLoading, setDataLoading] = useState(true);

  const auth = useContext(AuthContext);
  const user = auth?.user;

  useEffect(() => {
    let isMounted = true;

    const fetchData = async () => {
      try {
        setDataLoading(true);
        const [roomsRes, hostelsRes, tiffinRes] = await Promise.allSettled([
          getAllProperties("room"),
          getAllProperties("hostel,pg"),
          getTiffins(),
        ]);

        if (!isMounted) return;

        if (roomsRes.status === "fulfilled") {
          setFeaturedRooms(roomsRes.value?.data?.data || []);
        } else {
          console.error("Error fetching rooms:", roomsRes.reason);
        }

        if (hostelsRes.status === "fulfilled") {
          setFeaturedHostels(hostelsRes.value?.data?.data || []);
        } else {
          console.error("Error fetching hostels:", hostelsRes.reason);
        }

        if (tiffinRes.status === "fulfilled") {
          setFeaturedTiffins(tiffinRes.value?.data?.data || []);
        } else {
          console.error("Error fetching tiffins:", tiffinRes.reason);
        }
      } catch (err) {
        console.error("Error fetching homepage data:", err);
      } finally {
        if (isMounted) {
          setDataLoading(false);
        }
      }
    };

    fetchData();

    return () => {
      isMounted = false;
    };
  }, []);

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
        <div className="max-w-7xl mx-auto my-5 px-4 sm:px-6 lg:px-8 flex flex-col justify-center align-middle items-center">
          <div className="inline-flex items-center size-fit gap-2 bg-violet-100 text-violet-700 px-4 py-2 rounded-full text-sm font-semibold mb-4">
            ⭐ Why Choose StudentHub
          </div>
          <h2 className="text-4xl lg:text-5xl font-bold text-slate-900 md:col-span-3">
            Why Students Love Us ?
          </h2>
        </div>
        <div className="w-full h-fit flex gap-5 md:gap-7 justify-center items-center flex-wrap">
          {features.map((feature) => (
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

          <div className="flex gap-6 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-hide px-1">
            {dataLoading ? (
              [1, 2, 3, 4].map((n) => <PropertyCardSkeleton key={n} />)
            ) : featuredRooms.length > 0 ? (
              featuredRooms.slice(0, 5).map((property) => (
                <div
                  key={property._id}
                  className="min-w-[300px] w-[300px] sm:min-w-[320px] sm:w-[320px] snap-start shrink-0"
                >
                  <PropertyCard property={property} />
                </div>
              ))
            ) : (
              <div className="w-full py-10 text-center text-slate-500 font-medium">
                No rooms available right now. Check back soon!
              </div>
            )}
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
              className="flex items-center text-indigo-600 font-medium hover:text-indigo-700 hover:translate-x-1 transition-all"
            >
              View All
              <ArrowRight className="w-5 h-5 ml-2" />
            </Link>
          </div>

          <div className="flex gap-6 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-hide px-1">
            {dataLoading ? (
              [1, 2, 3, 4].map((n) => <PropertyCardSkeleton key={n} />)
            ) : featuredHostels.length > 0 ? (
              featuredHostels.slice(0, 5).map((property) => (
                <div
                  key={property._id}
                  className="min-w-[300px] w-[300px] sm:min-w-[320px] sm:w-[320px] snap-start shrink-0"
                >
                  <PropertyCard property={property} />
                </div>
              ))
            ) : (
              <div className="w-full py-10 text-center text-slate-500 font-medium">
                No hostels available right now. Check back soon!
              </div>
            )}
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
              className="flex items-center text-orange-600 font-medium hover:text-orange-700 hover:translate-x-1 transition-all"
            >
              View All
              <ArrowRight className="w-5 h-5 ml-2" />
            </Link>
          </div>

          <div className="flex gap-6 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-hide px-1">
            {dataLoading ? (
              [1, 2, 3].map((n) => <TiffinCardSkeleton key={n} />)
            ) : featuredTiffins.length > 0 ? (
              featuredTiffins.map((tiffin) => (
                <div
                  key={tiffin._id}
                  className="min-w-[300px] w-[300px] sm:min-w-[320px] sm:w-[320px] snap-start shrink-0"
                >
                <TiffinCard key={tiffin._id} tiffin={tiffin} />
                </div>
              ))
            ) : (
              <div className="col-span-full py-10 text-center text-slate-500 font-medium">
                No tiffin services available right now. Check back soon!
              </div>
            )}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      {!user && (
        <section className="py-20 bg-linear-to-r from-violet-600 to-indigo-600">
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
        </section>
      )}
    </div>
  );
}
