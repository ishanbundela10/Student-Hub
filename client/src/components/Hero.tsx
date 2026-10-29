import { useState, useEffect } from "react";
import { api } from "@/api/axios";
import { Search, MapPin, Star, Home, Coffee, Loader2, ChevronLeft, ChevronRight, Building2 } from "lucide-react";
import SponsorsCarousel from "./SponsorsCarousel";

interface TiffinCardData {
  name: string;
  thumbnail: string;
  images?: string[];
  rating?: number;
  pricing?: {
    combo?: { singleMeal?: number };
    lunch?: { singleMeal?: number };
  };
}

interface RoomCardData {
  title?: string;
  name?: string;
  thumbnail?: string;
  images?: string[];
  address?: { area?: string; city?: string };
}

const Hero = () => {
  const [latestTiffins, setLatestTiffins] = useState<TiffinCardData[]>([]);
  const [latestRooms, setLatestRooms] = useState<RoomCardData[]>([]);
  const [counts, setCounts] = useState({ rooms: 0, hostels: 0, tiffins: 0 });
  const [loading, setLoading] = useState(true);

  const [roomSlide, setRoomSlide] = useState(0);
  const [tiffinSlide, setTiffinSlide] = useState(0);

  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    let isMounted = true;

    const fetchHeroData = async () => {
      try {
        setLoading(true);

        const [tiffinRes, roomRes, hostelRes] = await Promise.allSettled([
          api.get("/tiffins"),
          api.get("/properties?propertyType=room"),
          api.get("/properties?propertyType=hostel,pg"),
        ]);

        if (!isMounted) return;

        const tiffinData = tiffinRes.status === "fulfilled" ? tiffinRes.value?.data?.data || [] : [];
        const roomData = roomRes.status === "fulfilled" ? roomRes.value?.data?.data || [] : [];
        const hostelData = hostelRes.status === "fulfilled" ? hostelRes.value?.data?.data || [] : [];

        setLatestTiffins(tiffinData.slice(0, 5)); // take up to 5 for slideshow
        setLatestRooms(roomData.slice(0, 5));
        setCounts({
          rooms: roomData.length,
          hostels: hostelData.length,
          tiffins: tiffinData.length,
        });
      } catch (error) {
        console.error("Hero fetch error:", error);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchHeroData();

    return () => {
      isMounted = false;
    };
  }, []);

  // ✅ Auto slideshow
  useEffect(() => {
    if (latestRooms.length <= 1 && latestTiffins.length <= 1) return;

    const interval = setInterval(() => {
      setRoomSlide((prev) => (latestRooms.length ? (prev + 1) % latestRooms.length : 0));
      setTiffinSlide((prev) => (latestTiffins.length ? (prev + 1) % latestTiffins.length : 0));
    }, 3500); // change every 3.5s

    return () => clearInterval(interval);
  }, [latestRooms.length, latestTiffins.length]);

  // Helpers
  const getRoomImage = (room?: RoomCardData) =>
    room?.thumbnail || room?.images?.[0] || "https://images.unsplash.com/photo-1522771731478-4463fe566f85?w=600";

  const getTiffinImage = (tiffin?: TiffinCardData) =>
    tiffin?.thumbnail || tiffin?.images?.[0] || "https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=600";

  const getTiffinPrice = (tiffin?: TiffinCardData) =>
    tiffin?.pricing?.combo?.singleMeal || tiffin?.pricing?.lunch?.singleMeal || 120;

  const currentRoom = latestRooms[roomSlide];
  const currentTiffin = latestTiffins[tiffinSlide];

  return (
    <>
      <section
        id="home"
        className="relative min-h-[90vh] flex items-center overflow-hidden pt-20"
        style={{
          background: "linear-gradient(135deg, #1e1b4b 0%, #312e81 40%, #4c1d95 80%, #5b21b6 100%)",
        }}
      >
        {/* Background effects */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div
            className="absolute -top-32 -left-32 w-96 h-96 rounded-full opacity-30 animate-pulse"
            style={{ background: "radial-gradient(circle, #a78bfa, transparent)" }}
          />
          <div
            className="absolute top-1/2 -right-24 w-80 h-80 rounded-full opacity-20 animate-pulse"
            style={{ background: "radial-gradient(circle, #818cf8, transparent)", animationDelay: "1s" }}
          />
          <div
            className="absolute inset-0 opacity-[0.07]"
            style={{
              backgroundImage:
                "linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)",
              backgroundSize: "40px 40px",
            }}
          />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-8 items-center">
            
            {/* ================= LEFT ================= */}
            <div className="text-white space-y-8">
              <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 px-4 py-2 rounded-full text-sm font-semibold text-violet-100 shadow-lg">
                <span className="w-2.5 h-2.5 bg-green-400 rounded-full animate-pulse shadow-[0_0_8px_#4ade80]" />
                Made for Students, By Students 🎓
              </div>

              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold leading-[1.1] tracking-tight">
                Your Home <br />
                <span className="text-transparent bg-clip-text bg-linear-to-r from-violet-300 via-pink-300 to-indigo-300">
                  Away From
                </span>{" "}
                <br />
                Home 🏠
              </h1>

              <p className="text-lg text-violet-200 leading-relaxed max-w-lg font-medium">
                Find verified <strong className="text-white">rented rooms</strong>, cozy{" "}
                <strong className="text-white">hostels</strong>, and delicious{" "}
                <strong className="text-white">home-cooked tiffins</strong> — everything you need in one place.
              </p>

              {/* Search */}
              <div className="flex flex-col sm:flex-row gap-3 max-w-xl bg-white/10 p-2 rounded-2xl backdrop-blur-md border border-white/20 shadow-2xl">
                <div className="flex-1 flex items-center gap-3 bg-white/5 rounded-xl px-4 py-3">
                  <MapPin className="w-5 h-5 text-violet-300 shrink-0" />
                  <input
                    type="text"
                    placeholder="Search city, college, or area..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="bg-transparent text-white placeholder-violet-300/70 text-[15px] outline-none flex-1 w-full"
                  />
                </div>
                <button
                  onClick={() => (window.location.href = `/rooms?search=${searchQuery}`)}
                  className="flex items-center justify-center gap-2 px-8 py-3.5 bg-linear-to-r from-violet-500 to-pink-500 hover:from-violet-400 hover:to-pink-400 text-white font-bold rounded-xl transition-all shadow-lg shadow-pink-500/30 hover:-translate-y-0.5"
                >
                  <Search className="w-4 h-4" />
                  Search
                </button>
              </div>

              {/* Real Counts */}
              <div className="flex flex-wrap gap-4 pt-2">
                <div className="bg-white/5 border border-white/10 px-5 py-3 rounded-2xl flex items-center gap-3">
                  <div className="bg-white/10 p-2 rounded-lg text-violet-300">
                    <Home className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xl font-extrabold text-white">
                      {counts.rooms > 0 ? `${counts.rooms}+` : "100+"}
                    </div>
                    <div className="text-xs text-violet-200 font-medium">Rooms Listed</div>
                  </div>
                </div>

                <div className="bg-white/5 border border-white/10 px-5 py-3 rounded-2xl flex items-center gap-3">
                  <div className="bg-white/10 p-2 rounded-lg text-violet-300">
                    <Building2 className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xl font-extrabold text-white">
                      {counts.hostels > 0 ? `${counts.hostels}+` : "50+"}
                    </div>
                    <div className="text-xs text-violet-200 font-medium">Hostels & PGs</div>
                  </div>
                </div>

                <div className="bg-white/5 border border-white/10 px-5 py-3 rounded-2xl flex items-center gap-3">
                  <div className="bg-white/10 p-2 rounded-lg text-violet-300">
                    <Coffee className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xl font-extrabold text-white">
                      {counts.tiffins > 0 ? `${counts.tiffins}+` : "50+"}
                    </div>
                    <div className="text-xs text-violet-200 font-medium">Tiffin Services</div>
                  </div>
                </div>
              </div>
            </div>

            {/* ================= RIGHT (FLOAT + SLIDESHOW) ================= */}
            <div className="relative hidden md:flex justify-center lg:justify-end mt-10 lg:mt-0">
              <div className="relative w-full max-w-[450px] h-[420px]">

                {loading ? (
                  <div className="w-full h-full flex items-center justify-center bg-white/5 rounded-3xl border border-white/10">
                    <Loader2 className="w-8 h-8 text-violet-300 animate-spin" />
                  </div>
                ) : (
                  <>
                    {/* ========== ROOM CARD (Floating + Slideshow) ========== */}
                    <div className="absolute top-0 right-0 w-[85%] z-10 animate-float">
                      <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-4 shadow-2xl overflow-hidden">
                        
                        {/* Image Slideshow */}
                        <div className="relative h-48 rounded-2xl overflow-hidden mb-3">
                          <img
                            src={getRoomImage(currentRoom)}
                            alt="Room"
                            className="w-full h-full object-cover transition-opacity duration-700"
                            key={roomSlide} // forces fade when index changes
                          />
                          
                          {/* Manual arrows (optional) */}
                          {latestRooms.length > 1 && (
                            <>
                              <button
                                onClick={() => setRoomSlide((p) => (p - 1 + latestRooms.length) % latestRooms.length)}
                                className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-black/40 hover:bg-black/60 rounded-full flex items-center justify-center text-white"
                              >
                                <ChevronLeft className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => setRoomSlide((p) => (p + 1) % latestRooms.length)}
                                className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-black/40 hover:bg-black/60 rounded-full flex items-center justify-center text-white"
                              >
                                <ChevronRight className="w-4 h-4" />
                              </button>
                            </>
                          )}

                          {/* Dots */}
                          {latestRooms.length > 1 && (
                            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1.5">
                              {latestRooms.map((_, i) => (
                                <div
                                  key={i}
                                  className={`w-1.5 h-1.5 rounded-full transition-all ${
                                    i === roomSlide ? "bg-white w-4" : "bg-white/50"
                                  }`}
                                />
                              ))}
                            </div>
                          )}
                        </div>

                        <div className="space-y-1">
                          <div className="flex items-center justify-between gap-2">
                            <span className="text-white font-bold text-base truncate">
                              {currentRoom?.title || currentRoom?.name || "Verified Student Rooms"}
                            </span>
                            <span className="bg-green-400 text-green-900 text-[10px] font-extrabold px-2 py-0.5 rounded-full uppercase shrink-0">
                              Verified
                            </span>
                          </div>
                          <div className="flex items-center gap-1 text-violet-200 text-xs font-medium">
                            <MapPin className="w-3 h-3 text-pink-300" />
                            <span className="truncate">
                              {currentRoom?.address?.area
                                ? `${currentRoom.address.area}, ${currentRoom.address.city}`
                                : "Near Top Colleges"}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* ========== TIFFIN CARD (Floating + Slideshow) ========== */}
                    <div className="absolute bottom-4 left-0 w-[70%] z-20 animate-float-delayed">
                      <div className="bg-white/15 backdrop-blur-2xl border border-white/25 rounded-3xl p-3 shadow-2xl">
                        <div className="flex gap-3 items-center">
                          <div className="relative w-16 h-16 rounded-2xl overflow-hidden shrink-0">
                            <img
                              src={getTiffinImage(currentTiffin)}
                              alt="Tiffin"
                              className="w-full h-full object-cover transition-opacity duration-700"
                              key={tiffinSlide}
                            />
                          </div>
                          <div className="min-w-0 flex-1">
                            <h4 className="text-white font-bold text-sm truncate">
                              {currentTiffin?.name || "Home-style Tiffins"}
                            </h4>
                            <p className="text-violet-200 text-[11px] font-semibold mt-0.5">
                              ₹{getTiffinPrice(currentTiffin)} / meal
                            </p>
                            <div className="flex items-center gap-1 mt-1">
                              <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                              <span className="text-white text-xs font-bold">
                                {currentTiffin?.rating || 4.8}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Tiny dots for tiffin */}
                        {latestTiffins.length > 1 && (
                          <div className="flex justify-center gap-1 mt-2">
                            {latestTiffins.map((_, i) => (
                              <div
                                key={i}
                                className={`w-1 h-1 rounded-full ${
                                  i === tiffinSlide ? "bg-white" : "bg-white/40"
                                }`}
                              />
                            ))}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Floating badge */}
                    <div className="absolute -top-5 left-8 bg-white rounded-2xl shadow-xl px-4 py-2 flex items-center gap-2 z-30 animate-bounce-slow">
                      <span className="text-xl">🔥</span>
                      <div>
                        <div className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">
                          check it out
                        </div>
                        <div className="text-xs font-extrabold text-slate-800">Premium Properties</div>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Sponsors */}
      <div className="bg-slate-50 border-b border-slate-200 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-center text-xs font-bold text-slate-400 uppercase tracking-widest mb-6">
            Trusted & Sponsored By
          </p>
          <SponsorsCarousel />
        </div>
      </div>
    </>
  );
};

export default Hero;
