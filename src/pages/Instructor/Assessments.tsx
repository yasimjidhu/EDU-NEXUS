import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Search, Filter, Calendar, Book, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';

// Mock data for assessments
const mockAssessments = [
  { id: 1, title: 'Midterm Exam', course: 'Introduction to React', dueDate: '2024-07-15', type: 'Exam', description: 'Comprehensive exam covering React basics and hooks.' },
  { id: 2, title: 'Project Submission', course: 'Advanced JavaScript', dueDate: '2024-07-20', type: 'Project', description: 'Build a full-stack JavaScript application using Node.js and React.' },
  { id: 3, title: 'Quiz 1', course: 'Web Development Basics', dueDate: '2024-07-10', type: 'Quiz', description: 'Short quiz on HTML, CSS, and basic JavaScript concepts.' },
  // Add more mock data as needed
];

const Assessments: React.FC = () => {
  const [assessments, setAssessments] = useState(mockAssessments);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('All');

  useEffect(() => {
    // Simulating API call
    setAssessments(mockAssessments);
  }, []);

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };


  const handleFilterChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setFilterType(event.target.value);
  };

  const filteredAssessments = assessments.filter(assessment => 
    assessment.title.toLowerCase().includes(searchTerm.toLowerCase()) &&
    (filterType === 'All' || assessment.type === filterType)
  );

  const getTypeColor = (type: string) => {
    switch(type) {
      case 'Exam': return 'bg-purple-100 text-purple-800';
      case 'Quiz': return 'bg-green-100 text-green-800';
      case 'Project': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 bg-gray-50 min-h-screen">
      <h1 className="text-3xl inter font-bold mb-8 text-gray-800">Assessments</h1>
      
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 space-y-4 md:space-y-0">
        <button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition duration-300 ease-in-out transform hover:scale-105">
          <Plus size={20} className="inline mr-2" />
          <Link to='/instructor/add-assessments'><span >Create New Assessment</span></Link>
        </button>
        
        <div className="flex items-center space-x-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Search assessments..."
              className="pl-10 pr-4 py-2 w-64 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={searchTerm}
              onChange={handleSearch}
            />
            <Search size={20} className="absolute left-3 top-2.5 text-gray-400" />
          </div>
          
          <div className="relative">
            <select
              className="appearance-none bg-white border border-gray-300 rounded-lg pl-4 pr-10 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={filterType}
              onChange={handleFilterChange}
            >
              <option value="All">All Types</option>
              <option value="Exam">Exam</option>
              <option value="Quiz">Quiz</option>
              <option value="Project">Project</option>
            </select>
            <Filter size={20} className="absolute right-3 top-2.5 text-gray-400 pointer-events-none" />
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredAssessments.map(assessment => (
          <div key={assessment.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition duration-300 ease-in-out">
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <h2 className="text-xl font-semibold text-gray-800">{assessment.title}</h2>
                <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getTypeColor(assessment.type)}`}>
                  {assessment.type}
                </span>
              </div>
              <p className="text-gray-600 mb-4">{assessment.description}</p>
              <div className="flex items-center text-sm text-gray-500 mb-2">
                <Book size={16} className="mr-2" />
                {assessment.course}
              </div>
              <div className="flex items-center text-sm text-gray-500 mb-4">
                <Calendar size={16} className="mr-2" />
                Due: {assessment.dueDate}
              </div>
              <div className="flex justify-end space-x-2">
                <button className="text-blue-600 hover:text-blue-800 transition duration-300">
                  <Edit size={20} />
                </button>
                <button className="text-red-600 hover:text-red-800 transition duration-300">
                  <Trash2 size={20} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {filteredAssessments.length === 0 && (
        <div className="text-center py-12">
          <Clock size={48} className="mx-auto text-gray-400 mb-4" />
          <p className="text-xl text-gray-600">No assessments found. Try adjusting your search or filter.</p>
        </div>
      )}
    </div>
  );
};

export default Assessments;