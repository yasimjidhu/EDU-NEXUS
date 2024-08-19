// src/components/CoursesList.tsx
import React, { useEffect, useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import { CourseState, getAllCourses } from '../redux/slices/courseSlice';
import { ListCourses } from './ListCourses';
import { AppDispatch } from '../redux/store/store';

const ThroatledCourseList: React.FC = () => {
  const [allCourses,setAllCourses] = useState<CourseState[]>([])
  const dispatch:AppDispatch = useDispatch();
  const observerRef = useRef<IntersectionObserver | null>(null);
  const page = 1
  const limit = 4

  useEffect(() => {
    dispatch(getAllCourses({page:page}));
  }, [dispatch, page,]);

  useEffect(() => {
    const lastCourseElement = document.querySelector('#last-course');
    if (lastCourseElement) {
      const observer = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting ) {
            console.log('last course intersected',entries[0])
            dispatch(getAllCourses({ page:page})).then((res:any)=>{
                setAllCourses(res.payload.courses)
            })
          }
        },
        { threshold: 1 }
      );
      if (lastCourseElement) {
        observer.observe(lastCourseElement);
      }
      observerRef.current = observer;
    }

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [dispatch, page, limit]);

  return (
    <div>
      <ListCourses allCourses={allCourses}/>
    </div>
  );
};

export default ThroatledCourseList;
