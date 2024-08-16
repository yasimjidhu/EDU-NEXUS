import { CourseState } from "@/components/redux/slices/courseSlice";

export const budgetWiseCoursesCount = (allCourses:CourseState[]) => {
    let allCount = 0;
    let paidCount = 0;
    let freeCount = 0;
  
    allCourses.forEach((course) => {
      allCount++;
      if (course.pricing.type == 'paid') {
        paidCount++;
      } else if (course.pricing.type == 'free') {
        freeCount++;
      }
    });
  
    return {
      All: allCount,
      Paid: paidCount,
      Free: freeCount,
    };
  };
  