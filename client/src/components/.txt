
import SponsorsCarousel from "./SponsorsCarousel";

const Hero = () => {
  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center overflow-hidden"
      style={{
        background: "linear-gradient(135deg, #1e1b4b 0%, #312e81 30%, #4c1d95 60%, #5b21b6 100%)",
        // backdropFilter: 
      }}
    >
      {/* Animated background blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div
          className="absolute -top-32 -left-32 w-96 h-96 rounded-full opacity-20 animate-pulse"
          style={{ background: "radial-gradient(circle, #a78bfa, transparent)" }}
        />
        <div
          className="absolute top-1/2 -right-24 w-80 h-80 rounded-full opacity-15 animate-pulse"
          style={{ background: "radial-gradient(circle, #818cf8, transparent)", animationDelay: "1s" }}
        />
        <div
          className="absolute bottom-0 left-1/3 w-64 h-64 rounded-full opacity-10 animate-pulse"
          style={{ background: "radial-gradient(circle, #c4b5fd, transparent)", animationDelay: "2s" }}
        />
        {/* Grid overlay */}
        <div
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage:
              "linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="text-white space-y-7">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 px-4 py-2 rounded-full text-sm font-medium text-violet-200">
              <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
              🎓 Made for Students, By Students
            </div>

            {/* Headline */}
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold leading-tight font-poppins">
              Your Home <br />
              <span className="text-transparent bg-clip-text bg-linear-to-r from-violet-300 via-pink-300 to-indigo-300">
                Away From
              </span>{" "}
              <br />
              Home 🏠
            </h1>

            {/* Subtitle */}
            <p className="text-lg text-violet-200 leading-relaxed max-w-lg">
              Find <strong className="text-white">rented rooms</strong>, cozy{" "}
              <strong className="text-white">hostels</strong>, and delicious{" "}
              <strong className="text-white">home-cooked tiffins</strong> — everything a student needs, all in one place.
            </p>

            {/* Search bar */}
            <div className="flex flex-col sm:flex-row gap-3 max-w-xl">
              <div className="flex-1 flex items-center gap-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl px-4 py-3">
                <svg className="w-5 h-5 text-violet-300 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <input
                  type="text"
                  placeholder="Search city or college name..."
                  className="bg-transparent text-white placeholder-violet-300 text-sm outline-none flex-1"
                />
              </div>
              <button className="px-6 py-3 bg-linear-to-r from-violet-400 to-pink-400 hover:from-violet-300 hover:to-pink-300 text-white font-bold rounded-2xl transition-all duration-200 shadow-lg hover:shadow-pink-400/30 hover:-translate-y-0.5 whitespace-nowrap">
                🔍 Search Now
              </button>
            </div>

            {/* Stats */}
            <div className="flex flex-wrap gap-8 pt-2">
              {[
                { val: "2,400+", label: "Rooms Listed" },
                { val: "180+", label: "Hostels" },
                { val: "320+", label: "Tiffin Services" },
              ].map((s) => (
                <div key={s.label}>
                  <div className="text-3xl font-extrabold text-white">{s.val}</div>
                  <div className="text-sm text-violet-300">{s.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Right — Cards stack */}

          {/* <div className="relative flex justify-center lg:justify-end">
            <div className="relative w-full max-w-sm">
               Background cards 
              <div className="absolute top-6 left-6 w-full h-full bg-white/5 rounded-3xl border border-white/10 rotate-3" />
              <div className="absolute top-3 left-3 w-full h-full bg-white/8 rounded-3xl border border-white/10 rotate-1" />

                Main card 
              <div className="relative bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-6 shadow-2xl">
                <img
                  src="https://images.pexels.com/photos/7972963/pexels-photo-7972963.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=400&w=600"
                  alt="Students studying"
                  className="w-full h-48 object-cover rounded-2xl mb-4"
                />
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-white font-bold text-lg">Student Hub</span>
                    <span className="bg-green-400 text-green-900 text-xs font-bold px-3 py-1 rounded-full">LIVE ✓</span>
                  </div>
                  <p className="text-violet-200 text-sm">Everything you need for a comfortable student life</p>

                   Feature pills
                  <div className="flex flex-wrap gap-2 pt-1">
                    {["🏠 Rooms", "🏨 Hostels", "🍱 Tiffin", "👤 Profiles"].map((tag) => (
                      <span key={tag} className="bg-white/10 border border-white/20 text-violet-200 text-xs px-3 py-1 rounded-full">
                        {tag}
                      </span>
                    ))}
                  </div>

                   Rating 
                  <div className="flex items-center gap-2 pt-2">
                    <div className="flex">
                      {"★★★★★".split("").map((s, i) => (
                        <span key={i} className="text-yellow-400 text-sm">{s}</span>
                      ))}
                    </div>
                    <span className="text-violet-200 text-sm">4.9 • 1.2k reviews</span>
                  </div>
                </div>
              </div>

               Floating badges
              <div className="absolute -top-4 -right-4 bg-white rounded-2xl shadow-xl px-4 py-2 flex items-center gap-2">
                <span className="text-2xl">🎉</span>
                <div>
                  <div className="text-xs text-gray-500">New Listings</div>
                  <div className="text-sm font-bold text-gray-800">+48 today</div>
                </div>
              </div>

              <div className="absolute -bottom-4 -left-4 bg-white rounded-2xl shadow-xl px-4 py-2 flex items-center gap-2">
                <span className="text-2xl">📍</span>
                <div>
                  <div className="text-xs text-gray-500">Near your college</div>
                  <div className="text-sm font-bold text-gray-800">15 matches</div>
                </div>
              </div>
            </div>
          </div> */}

          {/* Sponsors */}

          <div className="flex justify-center lg:justify-end">
            <div className="w-full max-w-md">
              <SponsorsCarousel />
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-violet-300 animate-bounce">
          <span className="text-xs font-medium">Scroll to explore</span>
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>
      </section>
  );
};

export default Hero;
