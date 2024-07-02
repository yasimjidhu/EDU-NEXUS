import React, { useState } from 'react';
import { PlusCircle, MinusCircle, CheckCircle2, Book, Trophy, Pencil, ArrowLeft } from 'lucide-react';

const AddAssessments = ({ onSave, onCancel }) => {
  const [assessment, setAssessment] = useState({
    totalScore: 0,
    passingScore: 0,
    courseId: '',
    lessonId: '',
    assessmentType: 'quiz',
    questions: []
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setAssessment(prev => ({ ...prev, [name]: value }));
  };

  const addQuestion = () => {
    setAssessment(prev => ({
      ...prev,
      questions: [...prev.questions, { question: '', answer: '', mark: 0, options: [''] }]
    }));
  };

  const removeQuestion = (index) => {
    setAssessment(prev => ({
      ...prev,
      questions: prev.questions.filter((_, i) => i !== index)
    }));
  };

  const updateQuestion = (index, field, value) => {
    setAssessment(prev => ({
      ...prev,
      questions: prev.questions.map((q, i) => 
        i === index ? { ...q, [field]: value } : q
      )
    }));
  };

  const addOption = (questionIndex) => {
    setAssessment(prev => ({
      ...prev,
      questions: prev.questions.map((q, i) => 
        i === questionIndex ? { ...q, options: [...q.options, ''] } : q
      )
    }));
  };

  const updateOption = (questionIndex, optionIndex, value) => {
    setAssessment(prev => ({
      ...prev,
      questions: prev.questions.map((q, i) => 
        i === questionIndex ? {
          ...q,
          options: q.options.map((opt, j) => j === optionIndex ? value : opt)
        } : q
      )
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-500 to-indigo-600 py-12 px-6 sm:px-10 lg:px-12">
      <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-lg p-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
            <Pencil className="w-8 h-8" />
            Add New Assessment
          </h1>
          <button 
            onClick={onCancel} 
            className="flex items-center text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="w-6 h-6 mr-1" /> Back
          </button>
        </div>

        <div className="space-y-8">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div>
              <label htmlFor="totalScore" className="block text-sm font-medium text-gray-700 flex items-center gap-2">
                <Trophy className="w-5 h-5" />
                Total Score
              </label>
              <input
                type="number"
                id="totalScore"
                name="totalScore"
                value={assessment.totalScore}
                onChange={handleInputChange}
                className="mt-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              />
            </div>
            <div>
              <label htmlFor="passingScore" className="block text-sm font-medium text-gray-700 flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5" />
                Passing Score
              </label>
              <input
                type="number"
                id="passingScore"
                name="passingScore"
                value={assessment.passingScore}
                onChange={handleInputChange}
                className="mt-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div>
              <label htmlFor="courseId" className="block text-sm font-medium text-gray-700 flex items-center gap-2">
                <Book className="w-5 h-5" />
                Course ID
              </label>
              <input
                type="text"
                id="courseId"
                name="courseId"
                value={assessment.courseId}
                onChange={handleInputChange}
                className="mt-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              />
            </div>
            <div>
              <label htmlFor="lessonId" className="block text-sm font-medium text-gray-700 flex items-center gap-2">
                <Book className="w-5 h-5" />
                Lesson ID
              </label>
              <input
                type="text"
                id="lessonId"
                name="lessonId"
                value={assessment.lessonId}
                onChange={handleInputChange}
                className="mt-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              />
            </div>
          </div>

          <div>
            <label htmlFor="assessmentType" className="block text-sm font-medium text-gray-700">Assessment Type</label>
            <select
              id="assessmentType"
              name="assessmentType"
              value={assessment.assessmentType}
              onChange={handleInputChange}
              className="mt-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            >
              <option value="quiz">Quiz</option>
              <option value="exam">Exam</option>
            </select>
          </div>

          <div>
            <h2 className="text-lg font-medium text-gray-900 mb-4">Questions</h2>
            {assessment.questions.map((q, index) => (
              <div key={index} className="border rounded-md p-4 mb-4">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="font-semibold">Question {index + 1}</h3>
                  <button onClick={() => removeQuestion(index)} className="text-red-500 hover:text-red-700">
                    <MinusCircle className="w-5 h-5" />
                  </button>
                </div>
                <input
                  type="text"
                  placeholder="Question"
                  value={q.question}
                  onChange={(e) => updateQuestion(index, 'question', e.target.value)}
                  className="mb-2 w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                />
                <input
                  type="text"
                  placeholder="Answer"
                  value={q.answer}
                  onChange={(e) => updateQuestion(index, 'answer', e.target.value)}
                  className="mb-2 w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                />
                <input
                  type="number"
                  placeholder="Mark"
                  value={q.mark}
                  onChange={(e) => updateQuestion(index, 'mark', e.target.value)}
                  className="mb-2 w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                />
                <h4 className="font-medium mb-1">Options</h4>
                {q.options.map((option, optionIndex) => (
                  <input
                    key={optionIndex}
                    type="text"
                    placeholder={`Option ${optionIndex + 1}`}
                    value={option}
                    onChange={(e) => updateOption(index, optionIndex, e.target.value)}
                    className="mb-2 w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
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
        onClick={onCancel}
        className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
      >
        Cancel
      </button>
      <button
        onClick={() => onSave(assessment)}
        className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
      >
        Save Assessment
      </button>
    </div>
  </div>    
</div>

);
};

export default AddAssessments;