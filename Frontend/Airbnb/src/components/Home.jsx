import React from "react";
import { Link } from "react-router-dom";

function Home({ listings }) {
  return (
    <div>
      <div id="filters" className=" flex px-1.5 mt-1 pl-1.5">
        <div className="filter">
          <i class="fa-solid fa-fire"></i>
          Trending
        </div>
        <div className="filter">
          <i class="fa-solid fa-bed"></i>
          Rooms
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 my-5">
        {listings.map((item) => (
          <Link
            to={`/listing/${item._id}`}
            key={item._id}
            className="group cursor-pointer"
          >
            <div className="relative aspect-square rounded-xl overflow-hidden mb-3">
              {item.image?.url ? (
                <img
                  src={item.image.url}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              ) : (
                <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                  <i className="fa-regular fa-image text-4xl text-gray-400"></i>
                </div>
              )}
            </div>

            <div className="space-y-1">
              <h3 className="font-semibold text-gray-900 truncate">
                {item.title}
              </h3>

              <p className="text-sm text-gray-500 truncate">
                {item.location}, {item.country}
              </p>

              <div className="flex items-baseline space-x-1">
                <span className="font-semibold text-gray-900">
                  ₹ {item.price}
                </span>

                <span className="text-sm text-gray-500">
                  / night
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default Home;