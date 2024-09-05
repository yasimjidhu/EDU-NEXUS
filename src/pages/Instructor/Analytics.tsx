import React, { useEffect, useState } from 'react'
import { Table } from '../../components/common/Table'
import { AppDispatch, RootState } from '../../components/redux/store/store'
import { useDispatch, useSelector } from 'react-redux'
import { getStudentEnrollmentOverview } from '../../components/redux/slices/courseSlice'

export const Analytics = () => {
    const { user } = useSelector((state: RootState) => state.user)
    const [data,setData] = useState([])

    const dispatch:AppDispatch = useDispatch();

    useEffect(()=>{
        dispatch(getStudentEnrollmentOverview(user?._id))
    },[dispatch])

    const Headings = [
        'User',
        'UserName',
        'Status',
        'Score'
    ]

    return (
        <>
            <div className='bg-blue-500 grid grid-cols-12 gap-4'>
                <div className='bg-green-400 col-span-8'>
                    {/* greeting section */}
                    <div className='bg-gray-400'>
                        <h1 className='inter text-2xl'>Hi {`${user?.firstName}${user?.lastName}`} 👋</h1>
                    </div>
                    <div className='grid grid-cols-12'>
                        <div className='bg-teal-700 col-span-6'>
                            <h1 className='text-white inter text-center'>Students Status</h1>
                            <Table
                                data={data}
                                heading='Students Overview'
                                headings={Headings}/>
                        </div>
                        <div className='bg-rose-600 col-span-6'>
                            f
                        </div>
                    </div>
                </div>
                <div className='bg-orange-500 col-span-4'>
                    2
                </div>
            </div>
        </>
    )
}
