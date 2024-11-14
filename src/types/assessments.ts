import { Document, Types } from 'mongoose';

interface Question {
  answer: string;
  mark: number;
  options: string[];
  question: string;
}

interface IAssessment extends Document {
  _id:string;
  title?:string;
  total_score?: number;
  passing_score?: number;
  course_id: Types.ObjectId;
  assessment_type: string;
  questions: Question[];
}

export default IAssessment;
