import { useState,useEffect } from 'react';
import { User } from '../components/redux/slices/instructorSlice'


export function useFilterEnrolledInstructors(allInstructors: User[], enrolledInstructorRefs: string[]) {
    const [enrolledInstructors, setEnrolledInstructors] = useState<User[]>([]);
  
    useEffect(() => {
      const filteredInstructors = allInstructors.filter(instructor => 
        enrolledInstructorRefs.includes(instructor._id)
      );
      setEnrolledInstructors(filteredInstructors);
    }, [allInstructors, enrolledInstructorRefs]);
  
    return enrolledInstructors;
  }
  
