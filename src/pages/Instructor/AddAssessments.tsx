import React, { useEffect, useState } from "react";
import {
  PlusCircle,
  MinusCircle,
  CheckCircle2,
  Pen,
  Trophy,
  ArrowLeft,
} from "lucide-react";
import { AppDispatch, RootState } from "../../components/redux/store/store";
import { useDispatch, useSelector } from "react-redux";
import { addAssessment, getAllCoursesOfInstructor, getAssessment, editAssessment } from "../../components/redux/slices/courseSlice";
import { toast } from "react-toastify";
import { useLocation, useNavigate } from "react-router-dom";

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

const AddAssessments = () => {
  const [assessment, setAssessment] = useState<IAssessment>({
    title: "",
    total_score: 0,
    passing_score: 0,
    course_id: "",
    instructor_id: "",
    assessment_type: "quiz",
    questions: [],
  });
  const [instructorCourses, setInstructorCourses] = useState([]);
  const [mode, setMode] = useState<"add" | "edit">("add");

  const dispatch: AppDispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const { user } = useSelector((state: RootState) => state.user);

  useEffect(() => {
    if (user._id) {
      dispatch(getAllCoursesOfInstructor(user?._id!)).then((res) => {
        setInstructorCourses(res.payload.courses);
        setAssessment(prev => ({ ...prev, instructor_id: user._id }));
      });
    }
  }, [dispatch, user._id]);

  useEffect(() => {
    if (location.state) {
      console.log('location state is here',location.state)
      setMode("edit");
      dispatch(getAssessment(location.state))
        .then((res) => {
          console.log('response of getassessmennt>>',res)
          const fetchedAssessment = res.payload.assessment;
          setAssessment({
            _id: fetchedAssessment._id,
            title: fetchedAssessment.title,
            total_score: fetchedAssessment.total_score,
            passing_score: fetchedAssessment.passing_score,
            course_id: fetchedAssessment.course_id,
            instructor_id: fetchedAssessment.instructor_id,
            assessment_type: fetchedAssessment.assessment_type,
            questions: fetchedAssessment.questions,
          });
        }).catch(err=> console.log(err))
    }
  }, []);

  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setAssessment((prev) => ({ ...prev, [name]: value }));
  };

  const addQuestion = () => {
    setAssessment((prev) => ({
      ...prev,
      questions: [
        ...prev.questions,
        { question: "", answer: "", mark: 0, options: [""] },
      ],
    }));
  };

  const removeQuestion = (index: number) => {
    setAssessment((prev) => ({
      ...prev,
      questions: prev.questions.filter((_, i) => i !== index),
    }));
  };

  const updateQuestion = (index: number, field: keyof Question, value: string | number) => {
    setAssessment((prev) => ({
      ...prev,
      questions: prev.questions.map((q, i) =>
        i === index ? { ...q, [field]: value } : q
      ),
    }));
  };

  const addOption = (questionIndex: number) => {
    setAssessment((prev) => ({
      ...prev,
      questions: prev.questions.map((q, i) =>
        i === questionIndex ? { ...q, options: [...q.options, ""] } : q
      ),
    }));
  };

  const updateOption = (questionIndex: number, optionIndex: number, value: string) => {
    setAssessment((prev) => ({
      ...prev,
      questions: prev.questions.map((q, i) =>
        i === questionIndex
          ? {
              ...q,
              options: q.options.map((opt, j) =>
                j === optionIndex ? value : opt
              ),
            }
          : q
      ),
    }));
  };

  const submitAssessment = async () => {
    try {
      if (mode === "add") {
        await dispatch(addAssessment(assessment));
        toast.success('Assessment created successfully');
      } else {
        await dispatch(editAssessment(assessment));
        toast.success('Assessment updated successfully');
      }
      navigate('/instructor/assessments');
    } catch (error) {
      console.error('Error:', error);
      toast.error('Failed to save assessment');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-500 to-indigo-600 py-12 px-6 sm:px-10 lg:px-12">
      <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-lg p-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            {mode === "add" ? "Add New Assessment" : "Edit Assessment"}
          </h1>
          <button
            onClick={() => navigate(-1)}
            className="flex items-center text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="w-6 h-6 mr-1" /> Back
          </button>
        </div>

        <div className="space-y-8">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div>
              <label
                htmlFor="title"
                className="block text-sm font-medium text-gray-700 flex items-center gap-2"
              >
                <Pen className="w-5 h-5" />
                Exam Title
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={assessment.title}
                onChange={handleInputChange}
                className="mt-2 block w-full p-2 bg-gray-200 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              />
            </div>
            <div>
              <label
                htmlFor="total_score"
                className="block text-sm font-medium text-gray-700 flex items-center gap-2"
              >
                <Trophy className="w-5 h-5" />
                Total Score
              </label>
              <input
                type="number"
                id="total_score"
                name="total_score"
                value={assessment.total_score}
                onChange={handleInputChange}
                className="mt-2 block w-full p-2 bg-gray-200 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              />
            </div>
            <div>
              <label
                htmlFor="passing_score"
                className="block text-sm font-medium text-gray-700 flex items-center gap-2"
              >
                <CheckCircle2 className="w-5 h-5" />
                Passing Score
              </label>
              <input
                type="number"
                id="passing_score"
                name="passing_score"
                value={assessment.passing_score}
                onChange={handleInputChange}
                className="mt-2 block w-full p-2 bg-gray-200 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="course_id"
              className="block text-sm font-medium text-gray-700"
            >
              Choose Course
            </label>
            <select
              id="course_id"
              name="course_id"
              value={assessment.course_id}
              onChange={handleInputChange}
              className="mt-2 block w-full p-2 bg-gray-200 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            >
              <option value="">Select a course</option>
              {instructorCourses.map((course) => (
                <option key={course._id} value={course._id}>
                  {course.title}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label
              htmlFor="assessment_type"
              className="block text-sm font-medium text-gray-700"
            >
              Assessment Type
            </label>
            <select
              id="assessment_type"
              name="assessment_type"
              value={assessment.assessment_type}
              onChange={handleInputChange}
              className="mt-2 block w-full p-2 bg-gray-200 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            >
              <option value="quiz">Quiz</option>
              <option value="exam">Exam</option>
            </select>
          </div>

          <div>
            <h2 className="text-lg font-medium text-gray-900 mb-4">
              Questions
            </h2>
            {assessment.questions.map((q, index) => (
              <div key={index} className="border rounded-md p-4 mb-4">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="font-semibold">Question {index + 1}</h3>
                  <button
                    onClick={() => removeQuestion(index)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <MinusCircle className="w-5 h-5" />
                  </button>
                </div>
                <input
                  type="text"
                  placeholder="Question"
                  value={q.question}
                  onChange={(e) =>
                    updateQuestion(index, "question", e.target.value)
                  }
                  className="mb-2 w-full p-2 bg-gray-200 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                />
                <input
                  type="text"
                  placeholder="Answer"
                  value={q.answer}
                  onChange={(e) =>
                    updateQuestion(index, "answer", e.target.value)
                  }
                  className="mb-2 w-full p-2 bg-gray-200 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                />
                <input
                  type="number"
                  placeholder="Mark"
                  value={q.mark}
                  onChange={(e) =>
                    updateQuestion(index, "mark", parseInt(e.target.value))
                  }
                  className="mb-2 w-full p-2 bg-gray-200 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                />
                <h4 className="font-medium mb-1">Options</h4>
                {q.options.map((option, optionIndex) => (
                  <input
                    key={optionIndex}
                    type="text"
                    placeholder={`Option ${optionIndex + 1}`}
                    value={option}
                    onChange={(e) =>
                      updateOption(index, optionIndex, e.target.value)
                    }
                    className="mb-2 w-full rounded-md p-2 bg-gray-200 border-gray-300 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                  />
                ))}
                <button
                  onClick={() => addOption(index)}
                  className="mt-2 inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  <PlusCircle className="w-4 h-4 mr-2" /> Add Option
                </button>
              </div>
            ))}
            <button
              onClick={addQuestion}
              className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              <PlusCircle className="w-5 h-5 mr-2" /> Add Question
            </button>
          </div>
        </div>
        <div className="mt-8 flex justify-end space-x-3">
          <button
            onClick={() => navigate(-1)}
            className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Cancel
          </button>
          <button
          type="button"
            onClick={submitAssessment}
            className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            {mode === "add" ? "Save Assessment" : "Update Assessment"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddAssessments;