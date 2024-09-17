
import { BarChart2, Currency, IndianRupee, Pocket, Settings, ShoppingBagIcon, User, Wallet } from "lucide-react";
import { Link } from "react-router-dom";


const Sidebar = () => {
  return (
    <div>
      <section className=" bg-medium-rose">
        <>
          <aside
            id="default-sidebar"
            className="fixed top-0 left-0 z-40 w-52 h-screen pt-20 transition-transform bg-medium-rose"
            aria-label="Sidebar"
          >
            <div className="h-full px-3 pb-4 overflow-y-auto bg-medium-rose">
              <h1 className="text-white text-2xl ml-4 mb-8">Student</h1>
              <ul className="space-y-2 font-medium">
                {/* Other links */}
                <li className="">
                  <Link
                    to="/student/overview"
                    className={
                      "flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-black group"
                    }
                  >
                    <BarChart2/>
                    <span className="flex-1 ml-3 whitespace-nowrap">
                      Overview
                    </span>
                  </Link>
                </li>

                <li>
                  <Link
                    to="/student/mycourses"
                    className={
                      "flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-black group"
                    }
                  >
                    <ShoppingBagIcon />
                    <span className="flex-1 ml-3 whitespace-nowrap">
                      My Courses
                    </span>
                  </Link>
                </li>

                <li>
                  <Link
                    to="/student/chat"
                    className={
                      "flex items-center p-2  rounded-lg dark:text-white "
                    }
                  >
                    <img
                      src="/assets/icon/message.png"
                      className="w-6 h-auto"
                      alt=""
                    />
                    <span className="flex-1 ml-3 whitespace-nowrap">
                      Messages
                    </span>
                  </Link>
                </li>
                <li>
                  <Link
                    to="/student/transactions"
                    className={
                      "flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-black group"
                    }
                  >
                    <Wallet />
                    <span className="flex-1 ml-3 whitespace-nowrap">
                      Transactions
                    </span>
                  </Link>
                </li>
                <li className="">
                  <Link
                    to="/student/profile"
                    className={
                      "flex items-center p-2  rounded-lg dark:text-white hover:bg-black group"
                    }
                  >
                    <User />

                    <span className="flex-1 ml-3 whitespace-nowrap">
                      Profile
                    </span>
                  </Link>
                </li>
                <li>
                  <Link
                    to="/settings"
                    className={
                      "flex items-center p-2  rounded-lg dark:text-white hover:bg-black group"
                    }
                  >
                    <Settings />
                    <span className="flex-1 ml-3 whitespace-nowrap">Settings</span>
                  </Link>
                </li>

              </ul>
            </div>
          </aside>
        </>
      </section>
    </div>
  );
};

export default Sidebar;
