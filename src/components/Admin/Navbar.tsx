import React from "react";

const Navbar = () => {
  return (
    <>
      <div className="grid grid-cols-12 gap-4  ml-64 p-3 border bottom-4">
        <div className=" col-span-10 w-full m-auto">
          <form className="max-w-md mx-auto">
            <label
              htmlFor="default-search"
              className="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white"
            >
              Search
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                <svg
                  className="w-4 h-4 text-gray-500 dark:text-gray-400"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 20 20"
                >
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
                  />
                </svg>
              </div>
              <input
                type="search"
                id="default-search"
                className="block p-4 ps-10 text-sm text-gray-900 rounded-lg w-full bg-gray-100"
                placeholder="Search Mockups, Logos..."
                required=""
              />
              <button
                type="submit"
                className="text-white absolute end-2.5 bottom-2.5 bg-medium-rose hover:bg-strong-rose focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2"
              >
                Search
              </button>
            </div>
          </form>
        </div>
        <div className="cursor-pointer p-2 col-span-1 m-auto">
              <img src="/assets/png/user.png" className="w-12" alt="User Profile" />
        </div>
        <div className="cursor-pointer p-2rounded-xl col-span-1 m-auto">
              <img src="/assets/png/bell.png" className="w-8" alt="Notifications" />
        </div>
      </div>
    </>
  );
};

export default Navbar;
