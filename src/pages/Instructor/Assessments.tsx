import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Search, Filter, Book, Clock } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { getAssessments, editAssessment, deleteAssessment } from '../../components/redux/slices/courseSlice';
import { AppDispatch, RootState } from '../../components/redux/store/store';
import { useDispatch, useSelector } from 'react-redux';
import Modal from 'react-modal';

interface Question {
  answer: string;
  mark: number;
  options: string[];
  question: string;
}

interface IAssessment {
  _id?: string;
  title: string;
  total_score: number;
  passing_score: number;
  course_id: string;
  instructor_id: string;
  assessment_type: string;
  questions: Question[];
}

const Assessments: React.FC = () => {
  const [assessments, setAssessments] = useState<IAssessment[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('All');
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [currentAssessment, setCurrentAssessment] = useState<IAssessment | null>(null);

  const dispatch: AppDispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state: RootState) => state.user);

  useEffect(() => {
    dispatch(getAssessments(user._id))
      .then((res) => {
        if (res.payload && res.payload.assessments) {
          setAssessments(res.payload.assessments);
        }
      });
  }, [dispatch, user._id]);

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const handleFilterChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setFilterType(event.target.value);
  };

  const filteredAssessments = assessments.filter(assessment => 
    assessment.title.toLowerCase().includes(searchTerm.toLowerCase()) &&
    (filterType === 'All' || assessment.assessment_type === filterType)
  );

  const getTypeColor = (type: string) => {
    switch(type) {
      case 'Exam': return 'bg-purple-100 text-purple-800';
      case 'Quiz': return 'bg-green-100 text-green-800';
      case 'Project': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };


  const handleDelete = (assessment: IAssessment) => {
    setCurrentAssessment(assessment);
    setIsDeleteModalOpen(true);
  };

  const handleEditClick = (e: React.MouseEvent, assessmentId: string) => {
    e.preventDefault();
    e.stopPropagation();
    navigate(`/instructor/add-assessments`,{state:assessmentId});
  };

  const handleDeleteConfirm = () => {
    if (currentAssessment && currentAssessment._id) {
      dispatch(deleteAssessment(currentAssessment._id))
        .then(() => {
          setIsDeleteModalOpen(false);
          setCurrentAssessment(null);
          // Refresh the assessments list
          dispatch(getAssessments(user._id));
        });
    }
  };

  return (
    <div className="mx-auto px-4 py-8 bg-gray-50 min-h-screen ml-52">     
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 space-y-4 md:space-y-0">
        <button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition duration-300 ease-in-out transform hover:scale-105">
          <Plus size={20} className="inline mr-2" />
          <Link to='/instructor/add-assessments'><span>Create New Assessment</span></Link>
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
          <div key={assessment._id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition duration-300 ease-in-out">
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <h2 className="text-xl font-semibold text-gray-800">{assessment.title}</h2>
                <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getTypeColor(assessment.assessment_type)}`}>
                  {assessment.assessment_type}
                </span>
              </div>
              <p className="text-gray-600 mb-4">Total Score: {assessment.total_score}</p>
              <p className="text-gray-600 mb-4">Passing Score: {assessment.passing_score}</p>
              <div className="flex items-center text-sm text-gray-500 mb-2">
                <Book size={16} className="mr-2" />
                Course ID: {assessment.course_id}
              </div>
              <div className="flex items-center text-sm text-gray-500 mb-4">
                <Clock size={16} className="mr-2" />
                Questions: {assessment.questions.length}
              </div>
              <div className="flex justify-end space-x-2">
                <button 
                  className="text-blue-600 hover:text-blue-800 transition duration-300"
                  onClick={(e) => handleEditClick(e,assessment._id)}
                >
                  <Edit size={20} />
                </button>
                <button 
                  className="text-red-600 hover:text-red-800 transition duration-300"
                  onClick={() => handleDelete(assessment)}
                >
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

      {/* Edit Modal */}
      

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={isDeleteModalOpen}
        onRequestClose={() => setIsDeleteModalOpen(false)}
        className="modal-content"
        overlayClassName="modal-overlay"
      >
        <div className="bg-white rounded-lg p-8 max-w-md w-full mx-auto">
          <h2 className="text-lg font-medium mb-4">Confirm Deletion</h2>
          <p>Are you sure you want to delete this assessment? This action cannot be undone.</p>
          <div className="mt-4 flex justify-end">
            <button
              type="button"
              className="mr-2 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500"
              onClick={() => setIsDeleteModalOpen(false)}
            >
              Cancel
            </button>
            <button
              type="button"
              className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-red-500"
              onClick={handleDeleteConfirm}
            >
              Delete
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Assessments;
