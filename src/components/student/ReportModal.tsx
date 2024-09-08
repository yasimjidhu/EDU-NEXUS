import React, { useState } from "react";
import { X, AlertTriangle } from "lucide-react"; 
import { useDispatch } from "react-redux";
import { AppDispatch } from "../redux/store/store";
import { submitReport } from "../redux/slices/courseSlice";
import { toast } from "react-toastify";

interface ReportModalProps {
  userId:string;
  courseId:string;
  courseName:string;
  userName:string;
  isOpen: boolean;
  onClose: () => void;
}

const ReportModal: React.FC<ReportModalProps> = ({ isOpen, onClose,courseId,userId,courseName,userName }) => {
  if (!isOpen) return null;

  const [reportReason, setReportReason] = useState(""); 
  const dispatch:AppDispatch = useDispatch();

  const handleSubmit = () => {
    console.log('report reason',reportReason)
    if (reportReason.trim()) {
      dispatch(submitReport({reason:reportReason,courseId,userId,courseName,userName})); 
      setReportReason(""); 
      toast.success('Course Reported Successfully')
      onClose(); 
    } else {
      alert("Please provide a reason for reporting.");
    }
  };

  const handleReasonChange = (e:any)=>{
    setReportReason(e.target.value)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="relative bg-white rounded-lg shadow-lg p-6 max-w-lg w-full animate-fadeIn">

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 transition duration-300"
        >
          <X className="w-6 h-6" /> {/* Close icon */}
        </button>

        {/* Modal Header */}
        <div className="flex items-center space-x-3 mb-4">
          <AlertTriangle className="w-8 h-8 text-red-500" /> {/* Warning icon */}
          <h3 className="text-2xl font-semibold text-gray-800">Report a Course Issue</h3>
        </div>

        {/* Modal Content */}
        <p className="text-gray-500 mb-4">
          Please describe the issue you're facing with this course. We’ll review and get back to you.
        </p>

        {/* Textarea */}
        <textarea
          className="w-full p-3 border rounded-lg shadow-sm focus:ring focus:ring-indigo-200 focus:outline-none"
          rows={4}
          value={reportReason}
          onChange={handleReasonChange}
          placeholder="Describe the issue here..."
        ></textarea>

        {/* Modal Footer */}
        <div className="flex justify-end mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 mr-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition duration-300"
          >
            Cancel
          </button>
          <button className="px-4 py-2 bg-medium-rose text-white rounded-lg hover:bg-strong-rose transition duration-300" onClick={handleSubmit}>
            Submit Report
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReportModal;
