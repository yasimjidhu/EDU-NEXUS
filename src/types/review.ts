export interface Review{
    courseId:string;
    userId:string;
    rating:number;
    content:string;
    createdAt?:Date;
    updatedAt?:Date;
}