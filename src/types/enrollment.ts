export enum CompletionStatus {
    Enrolled = 'enrolled',
    InProgress = 'in-progress',
    Completed = 'completed',
}   

export interface CheckEnrollment{
    userId:string;
    courseId:string
}
export interface UpdateAssessmentPayload {
    userId: string;
    courseId: string;
}