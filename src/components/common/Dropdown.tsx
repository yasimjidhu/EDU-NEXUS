"use client";

import { Dropdown } from "flowbite-react";
import { CourseState } from "../redux/slices/courseSlice";

interface DropDownProps {
  text: string;
  data: CourseState[];
  onSelect: (courseId: string) => void;
}

const DropDown: React.FC<DropDownProps> = ({ text, data, onSelect }) => {
  return (
    <div className="bg-medium-rose text-black rounded-xl mb-4">
      <Dropdown label={text} className="bg-gray-400 text-black">
        {data.map((item) => (
          <Dropdown.Item
            key={item.id} 
            className="text-black bg-white hover:bg-blue-200"
            onClick={() => onSelect(item.id)}
          >
            {item.name} 
          </Dropdown.Item>
        ))}
      </Dropdown>
    </div>
  );
};

export default DropDown;
