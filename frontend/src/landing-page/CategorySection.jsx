import React from "react";
import { Link, useNavigate } from "react-router-dom";


const categories = [
  {
    name: "Ganapati Decoration",
    link: "ganpati",
    img: "https://m.media-amazon.com/images/I/81vh6Efr76L.jpg"
  },
  {
    name: "Diwali Specials",
    link: "diwali",
    img: "data:image/jpeg;base64,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"
  },
  {
    name: "Birthday Celebration",
    link: "Birthday",
    img: "https://www.kanpurgifts.com/admin/product_images/bday-decoration.jpg"
  },
  {
    name: "Wedding",
    link: "wedding",
    img: "https://img.staticmb.com/mbcontent/images/crop/uploads/2023/8/Heaven_4_0_1200.jpg.webp"
  },
  {
    name: "Anniversary",
    link: "anniversary",
    img: "https://cdn.togetherv.com/white-and-gold-enchantment-anniversary-decoration-main_1709543433.webp"
  },
  {
    name: "Housewarming",
    link: "housewarming",
    img: "https://5.imimg.com/data5/ANDROID/Default/2023/12/369501462/SR/HX/OG/9558151/product-jpeg-500x500.jpg"
  },
  {
    name: "Festivals",
    link: "festivals",
    img: "https://static.vecteezy.com/system/resources/thumbnails/070/420/203/small/traditional-indian-marigold-flower-garland-for-festive-decoration-free-photo.jpg"
  }
];

export default function CategorySection() {
  const navigate = useNavigate();

  const handleSeeMore = () => {
    const isLoggedIn = sessionStorage.getItem("isLoggedIn");
    if (isLoggedIn) {
      navigate("/maincategory");
    } else {
      navigate("/signin");
    }
  };
  return (
    <section className="py-12 px-6 bg-white">
      <h2 className="text-3xl font-bold text-center text-[#411900] mb-10">
        Explore Our Categories
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {categories.slice(0, 7).map((cat, index) => (
          <div
            key={index}
            className="bg-[#411900] rounded-xl shadow-lg hover:shadow-2xl transition transform hover:-translate-y-2 cursor-pointer"
            onClick={() => {
              const isLoggedIn = sessionStorage.getItem("isLoggedIn") === "true";
              if (isLoggedIn) {
                navigate(`/category/${cat.link}`);
              } else {
                navigate("/signin");
              }
            }}
          >
            <img
              src={cat.img}
              alt={cat.name}
              className="w-full h-40 object-cover rounded-t-xl"
            />
            <div className="p-4 text-center">
              <h3 className="text-lg font-semibold text-white">{cat.name}</h3>
            </div>
          </div>
        ))}

        {/* See More card */}
        <button
          onClick={handleSeeMore}
          className="flex items-center justify-center bg-[#411900] text-white rounded-xl shadow-lg hover:shadow-2xl transition transform hover:-translate-y-2"
        >
          <span className="text-lg font-semibold">See More →</span>
        </button>
      </div>
    </section>
  );
}

