import React from "react";


const Courses = () => {
  return (
    <>
      <div className="ml-64 py-2 px-8">
        <ul className="flex justify-between md:mt-4">
          <li className="text-black inter hover:bg-medium-rose hover:text-white transition duration-300 p-2 rounded-md cursor-pointer">
            All courses
          </li>
          <li className="text-black inter hover:bg-medium-rose hover:text-white transition duration-300 p-2 rounded-md cursor-pointer">
            kindergarden
          </li>
          <li className="text-black inter hover:bg-medium-rose hover:text-white transition duration-300 p-2 rounded-md cursor-pointer">
            High School
          </li>
          <li className="text-black inter hover:bg-medium-rose hover:text-white transition duration-300 p-2 rounded-md cursor-pointer">
            college
          </li>
          <li className="text-black inter hover:bg-medium-rose hover:text-white transition duration-300 p-2 rounded-md cursor-pointer">
            Computer
          </li>
          <li className="text-black inter hover:bg-medium-rose hover:text-white transition duration-300 p-2 rounded-md cursor-pointer">
            Science
          </li>
          <li className="text-black inter hover:bg-medium-rose hover:text-white transition duration-300 p-2 rounded-md cursor-pointer">
            Engineering
          </li>
          <li className="text-blue-700 secondary-font hover:bg-medium-rose hover:text-white transition duration-300 p-2 rounded-md cursor-pointer">
            More Courses
          </li>
        </ul>
        <div className="grid grid-cols-6 gap-4 p-2 mt-8">
          <div className="col-span-4 flex bg-white rounded-lg border-2 h-48 border-gray-300">
            <div className="bg-purple-700 w-1/3 flex-shrink-0">
              <img
                src="/assets/images/person2.png"
                className="object-cover w-full h-full rounded-l-lg"
                alt=""
              />
            </div>
            <div className="w-2/3 p-4 flex flex-col justify-between ">
              <div>
                <p>by neymar junior</p>
                <h3 className="prime-sm text-xl font-semibold">
                  Create AN LmS WEbsite WITH LeanPRESS
                </h3>
                <ul className="flex justify-between mt-3">
                  <li className="flex items-center">
                    <img src="/assets/icon/clock.png" alt="" className="mr-2" />
                    <span>2 Weeks</span>
                  </li>
                  <li className="flex items-center">
                    <img
                      src="/assets/icon/students.png"
                      alt=""
                      className="mr-2"
                    />
                    <span>156 students</span>
                  </li>
                  <li className="flex items-center">
                    <img src="/assets/icon/levels.png" alt="" className="mr-2" />
                    <span>all levels</span>
                  </li>
                  <li className="flex items-center">
                    <img src="/assets/icon/lesson.png" alt="" className="mr-2" />
                    <span>20 lessons</span>
                  </li>
                </ul>
              </div>
              <div>
                <div className="border-b-2 border-gray-300 my-4"></div>
                <div className="flex justify-between items-center">
                  <h6 className="text-green-700 font-semibold poppins-normal">
                    $59.0 free
                  </h6>
                  <button className="bg-black py-2 px-2 hover:bg-gray-800 rounded-md text-white poppins-normal">
                    Manage Course
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className=" w-full col-span-2 p-8">
            <h1 className="text-lg font-semibold">Instructors</h1>
            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <input type="checkbox" name="instructorName" className="mr-2" />
                <span>kennie white</span>
              </div>
              <h6>15</h6>
            </div>
            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <input type="checkbox" name="instructorName" className="mr-2" />
                <span>John Doe</span>
              </div>
              <h6>15</h6>
            </div>
            <h1 className="text-lg font-semibold mt-3">Price</h1>
            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <input type="checkbox" name="instructorName" className="mr-2" />
                <span>All</span>
              </div>
              <h6>15</h6>
            </div>
            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <input type="checkbox" name="instructorName" className="mr-2" />
                <span>Free</span>
              </div>
              <h6>15</h6>
            </div>
            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <input type="checkbox" name="instructorName" className="mr-2" />
                <span>Paid</span>
              </div>
              <h6>15</h6>
            </div>
            <h1 className="text-lg font-semibold mt-3">Review</h1>
            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <input type="checkbox" name="instructorName" className="mr-2" />
                <div className="flex justify-evenly space-x-2">
                    <img src="/assets/icon/star.png" alt="" />
                    <img src="/assets/icon/star.png" alt="" />
                    <img src="/assets/icon/star.png" alt="" />
                    <img src="/assets/icon/star.png" alt="" />
                    <img src="/assets/icon/star.png" alt="" />
                </div>
              </div>
              <h6>(1,234)</h6>
            </div>
            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <input type="checkbox" name="instructorName" className="mr-2" />
                <div className="flex justify-evenly space-x-2">
                    <img src="/assets/icon/star.png" alt="" />
                    <img src="/assets/icon/star.png" alt="" />
                    <img src="/assets/icon/star.png" alt="" />
                    <img src="/assets/icon/star.png" alt="" />
                </div>
              </div>
              <h6>(1,234)</h6>
            </div>
            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <input type="checkbox" name="instructorName" className="mr-2" />
                <div className="flex justify-evenly space-x-2">
                    <img src="/assets/icon/star.png" alt="" />
                    <img src="/assets/icon/star.png" alt="" />
                    <img src="/assets/icon/star.png" alt="" />
                </div>
              </div>
              <h6>(1,234)</h6>
            </div>
            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <input type="checkbox" name="instructorName" className="mr-2" />
                <div className="flex justify-evenly space-x-2">
                    <img src="/assets/icon/star.png" alt="" />
                    <img src="/assets/icon/star.png" alt="" />
                </div>
              </div>
              <h6>(1,234)</h6>
            </div>
            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <input type="checkbox" name="instructorName" className="mr-2" />
                <div className="flex justify-evenly space-x-2">
                    <img src="/assets/icon/star.png" alt="" />
                </div>
              </div>
              <h6>(1,234)</h6>
            </div>
            <h1 className="text-lg font-semibold">Level</h1>
            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <input type="checkbox" name="instructorName" className="mr-2" />
                <span>All Levels</span>
              </div>
              <h6>15</h6>
            </div>
            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <input type="checkbox" name="instructorName" className="mr-2" />
                <span>All Levels</span>
              </div>
              <h6>15</h6>
            </div>
            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <input type="checkbox" name="instructorName" className="mr-2" />
                <span>All Levels</span>
              </div>
              <h6>15</h6>
            </div>
            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <input type="checkbox" name="instructorName" className="mr-2" />
                <span>All Levels</span>
              </div>
              <h6>15</h6>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Courses;
