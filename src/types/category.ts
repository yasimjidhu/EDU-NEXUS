export interface Category{
    _id:string | null|undefined;
    name:string |null;
    description:string | null;
    image: File | string | null;
    coursesCoun?:number;
}