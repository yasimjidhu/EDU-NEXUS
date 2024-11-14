export enum CompletionStatus {
    Enrolled = 'enrolled',
    InProgress = 'in-progress',
    Completed = 'completed',
}   

export interface CheckEnrollment{
    userId:string|undefined;
    courseId:string|undefined;
}
export interface UpdateAssessmentPayload {
    userId: string;
    courseId: string;
    score:number;
    completedAssessmentId:string;
    examStatus:'passed'|'failed'|'pending';
}