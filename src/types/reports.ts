export class ReportEntity {
    constructor(
        public reportedBy: string,
        public courseId: string, 
        public courseName:string,
        public userName:string,
        public reason: string,      
        public status: string = 'Pending', 
        public createdAt: Date = new Date(), 
        public reviewedAt?: Date,
        public _id?:string
    ) {}
}