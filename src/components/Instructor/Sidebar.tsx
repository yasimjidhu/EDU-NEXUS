
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
              <h1 className="text-white text-2xl ml-4 mb-8">Instructor</h1>
              <ul className="space-y-2 font-medium">
                {/* Other links */}
                <li className="">
                  <Link
                    to="/instructor/overview"
                    className={
                      "flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-black group"
                    }
                  >
                    <svg
                      className="flex-shrink-0 w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white"
                      aria-hidden="true"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M14 2a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V2Zm0 16a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h8a1 1 0 0 1 1 1v16Zm-3-4.5a.5.5 0 0 0-.5-.5h-5a.5.5 0 0 0 0 1h5a.5.5 0 0 0 .5-.5Zm.5-4.5a.5.5 0 0 0-.5-.5h-6a.5.5 0 0 0 0 1h6a.5.5 0 0 0 .5-.5Zm0-4.5a.5.5 0 0 0-.5-.5h-6a.5.5 0 0 0 0 1h6a.5.5 0 0 0 .5-.5Zm4.5 9h-3v-3h-2v3h-3v2h3v3h2v-3h3v-2Z" />
                    </svg>
                    <span className="flex-1 ml-3 whitespace-nowrap">
                      Overview
                    </span>
                  </Link>
                </li>
                <li>
                  <Link
                    to="/instructor/courses"
                    className={
                      "flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-black group"
                    }
                  >
                    <svg
                      className="flex-shrink-0 w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white"
                      aria-hidden="true"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="currentColor"
                      viewBox="0 0 18 18"
                    >
                      <path d="M18 0H0v2h18V0ZM4 9h5V4H4v5Zm7 0h5V4h-5v5Zm-7 5h5v-3H4v3Zm7 0h5v-3h-5v3ZM0 3v3h2V3H0Zm14 0v3h2V3h-2ZM0 7v3h2V7H0Zm0 4v3h2v-3H0Zm0 4v3h2v-3H0Zm14-9v3h2V7h-2Zm0 4v3h2v-3h-2Zm0 4v3h2v-3h-2ZM4 15v3h2v-3H4Zm10 0v3h2v-3h-2Z" />
                    </svg>
                    <span className="flex-1 ml-3 whitespace-nowrap">
                      My Courses
                    </span>
                  </Link>
                </li>
               
                <li>
                  <Link
                    to="/instructor/assessments"
                    className={
                      "flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-black group"
                    }
                  >
                    <svg
                      className="flex-shrink-0 w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white"
                      aria-hidden="true"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M10 0a5 5 0 0 0 0 10A5 5 0 0 0 10 0Zm0 8a3 3 0 1 1 0-6 3 3 0 0 1 0 6Zm7-6h-4v2h4V2ZM7 16H2v2h5v-2Zm11 2h-4v2h4v-2Zm-8 0H9v2h1v-2Zm-2 0H5v2h1v-2ZM3 16H0v2h3v-2Zm13-4h-2v2h2v-2Zm0 4h-2v2h2v-2Zm-2 4h-1v2h1v-2ZM9 12H2v2h7v-2Zm9 0h-7v2h7v-2Z" />
                    </svg>
                    <span className="flex-1 ml-3 whitespace-nowrap">
                      Assessments
                    </span>
                  </Link>
                </li>
                <li>
                  <Link
                    to="/instructor/chat"
                    className={
                      "flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-black group"
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
                    to="/settings"
                    className={
                      "flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-black group"
                    }
                  >
                    <img
                      src="/assets/png/user.png"
                      className="w-5 h-auto"
                      alt=""
                    />
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
