import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import "swiper/css";
import { Link } from "react-router-dom";

const sponsors = [
  {
    id: 1,
    name: "Discount on premium ⭐",
    img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR2aCYhYBf787NhpWDBQ1ydP_HmuncCEozGxpDaCXpKLg&s"
  },
  {
    id: 2,
    name: "Women's Tiffin",
    img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT1_z-x3G7szxmIezlldZrNwQc812KJDr3r3D8mRWCeiv4fg8Mj54gWvcM&s=10",
    location: "New Delhi, India",
  },
  {
    id: 3,
    name: "ABC Hostel",
    img: "https://via.placeholder.com/250x150?text=ABC+Hostel",
    location: "kolkata, India"
  },
  {
    id: 4,
    name: "Zomato",
    img: "https://via.placeholder.com/250x150?text=Zomato",
  },
  {
    id: 5,
    name: "Book Store",
    img: "https://via.placeholder.com/250x150?text=Book+Store",
  },
];

export default function SponsorsCarousel() {
  return (
    <Swiper
      modules={[Autoplay]}
      slidesPerView={1}
      loop
      autoplay={{
        delay: 2500,
        disableOnInteraction: false,
      }}
    >
      {sponsors.map((sponsor) => (
        <SwiperSlide key={sponsor.id}>
          <Link to={`/sponsors/${sponsor.id}`} className="block">
            <div className="relative bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-2 shadow-2xl ">
              <img
                src={sponsor.img}
                alt={sponsor.name}
                className="w-full h-56 object-cover rounded-2xl"
              />

              <div className="mt-5">
                <h3 className="text-white text-xl font-bold ml-2">
                  {sponsor.name}
                  {sponsor.location && (
                    <span className="text-gray-300 text-sm font-extralight ml-2">
                      {sponsor.location}
                    </span>
                  )}
                </h3>
                {/* 
              { 
                <p className="text-violet-200 mt-2">
                Proud Partner of StudentHub
              </p>} */}

                {/* <div className="mt-4 inline-flex bg-green-400 text-green-900 px-3 py-1 rounded-full text-sm font-semibold">
                Sponsor
              </div> */}
                <div className="absolute -right-8 top-5 rotate-45 bg-pink-500 text-white text-xs px-8 py-1">
                  SPONSORED
                </div>
              </div>
            </div>
          </Link>
        </SwiperSlide>
      ))}
    </Swiper>
  );
}