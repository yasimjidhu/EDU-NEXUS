interface Attachments {
    title?: string;
    url?: string;
}

export interface Lesson {
    lessonNumber: string;
    title: string;
    description: string;
    video: string;
    duration?: string;
    attachments:Attachments[]
}