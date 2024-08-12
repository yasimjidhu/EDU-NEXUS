// StudentsList.tsx
import React from 'react';
import { User } from '../redux/slices/studentSlice';

interface StudentsListProps {
  students: User[];
}

const StudentsList: React.FC<StudentsListProps> = ({ students }) => (
  <div className="w-1/4 bg-white p-4 overflow-y-auto">
    <h3 className="text-lg font-semibold mb-4">Students</h3>
    <ul>
      {students.map((student) => (
        <li key={student._id} className="mb-2 p-2 bg-gray-100 rounded">
          {student.firstName} {student.lastName}
        </li>
      ))}
    </ul>
  </div>
);