import { ShieldX } from 'lucide-react';
import { disableCourse, getAllReports, updateReportStatus } from '../../components/redux/slices/courseSlice';
import { AppDispatch } from '../../components/redux/store/store';
import { ReportEntity } from '../../types/reports';
import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';

const AdminReportsPage = () => {

    const [reports, setReports] = useState<any[]>([])

    const dispatch: AppDispatch = useDispatch()

    useEffect(() => {
        dispatch(getAllReports())
            .then((res) => setReports(res.payload))
    }, [dispatch])

    const handleStatusChange = (id: string, value: string) => {

        dispatch(updateReportStatus({ reportId: id, status: value }))
            .then(() => {
                // Once the status update is successful, fetch the updated list of reports
                dispatch(getAllReports())
                    .then((res) => setReports(res.payload))
                    .catch((error) => console.error('Error fetching updated reports:', error));
            })
            .catch((error) => console.error('Error updating report status:', error));
    };

    const handleExportReports = async () => {
        try {
            const csvData = convertToCSV(reports);
            downloadCSV(csvData);
        } catch (error) {
            console.error('Error exporting reports:', error);
        }
    };

    const handleDisableCourseClick = async (courseId: string) => {
    
        try {
            const resultAction = await dispatch(disableCourse(courseId));
            
            // Check if the action was fulfilled
            if (disableCourse.fulfilled.match(resultAction)) {
                toast.success('Course disabled successfully');
            } else {
                toast.error('Failed to disable course');
            }
        } catch (error) {
            console.error('Error disabling course:', error);
            toast.error('An error occurred while disabling the course');
        }
    };

    const convertToCSV = (data: any[]): string => {
        const header = 'Course,Reported By,Reason,Status,Date\n';
        const rows = data.map(report => {
            const date = new Date(report.createdAt).toLocaleDateString();
            return `${report.courseName},${report.userName},${report.reason},${report.status},${date}`;
        });
        return header + rows.join('\n');
    };

    const downloadCSV = (csvData: string) => {
        const blob = new Blob([csvData], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.setAttribute('href', url);
        link.setAttribute('download', 'reports.csv');
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };


    return (
        <div className="min-h-screen bg-gray-100 p-6">
            <header className="mb-6">
                <h1 className="text-3xl font-bold">Course Reports</h1>
            </header>

            <div className="mb-4 flex justify-between items-center">
                <div>
                    <label className="mr-2">Filter by Status:</label>
                    <select className="border rounded p-2">
                        <option value="all">All</option>
                        <option value="pending">Pending</option>
                        <option value="reviewed">Reviewed</option>
                        <option value="resolved">Resolved</option>
                    </select>
                </div>
                <button
                    onClick={handleExportReports}
                    className="bg-black text-white px-4 py-2 rounded"
                >
                    Export Reports
                </button>
            </div>
        
            {reports && reports.length > 0 ? (
                reports.map(group => (
                    <div key={group.courseName} className="mb-6 bg-white p-4 rounded shadow-md">
                        <div className='flex justify-between relative'>
                            <h3 className="text-xl font-semibold mb-2">{group.courseName}</h3>

                            <div className="relative group">
                                <ShieldX color='red' size={32} className='cursor-pointer' onClick={()=>handleDisableCourseClick(group.reports[0].courseId)}/>

                                {/* Tooltip */}
                                <div className="absolute left-1/2 transform -translate-x-1/2 mt-2 w-32 bg-gray-800 text-white text-sm rounded-lg p-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                    Disable Course
                                </div>
                            </div>
                        </div>
                        <p>Total Reports: {group.totalReports}</p>
                        <p>Unique Reasons: {group.uniqueReasons.join(', ')}</p>

                        <table className="min-w-full bg-white border rounded shadow-md mt-4">
                            <thead>
                                <tr className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
                                    <th className="py-3 px-6 text-left">Reported By</th>
                                    <th className="py-3 px-6 text-left">Reason</th>
                                    <th className="py-3 px-6 text-left">Status</th>
                                    <th className="py-3 px-6 text-left">Date</th>
                                    <th className="py-3 px-6 text-left">Action</th>
                                </tr>
                            </thead>
                            <tbody className="text-gray-600 text-sm font-light">
                                {group.reports.map((report, index) => (
                                    <tr key={index} className="border-b border-gray-200 hover:bg-gray-100">
                                        <td className="py-3 px-6">{report.userName}</td>
                                        <td className="py-3 px-6">{report.reason}</td>
                                        <td className="py-3 px-6">
                                            <span className={`px-2 py-1 rounded-full text-xs font-semibold ${report.status === 'Pending' ? 'bg-yellow-200 text-yellow-800' : report.status === 'Reviewed' ? 'bg-blue-200 text-blue-800' : 'bg-green-200 text-green-800'}`}>
                                                {report.status}
                                            </span>
                                        </td>
                                        <td className="py-3 px-6">{new Date(report.createdAt).toLocaleDateString()}</td>
                                        <td className="py-3 px-6">
                                            <select
                                                value={report.status}
                                                onChange={(e) => handleStatusChange(report._id, e.target.value)}
                                                className="border rounded p-2"
                                            >
                                                <option value="Pending">Pending</option>
                                                <option value="Reviewed">Reviewed</option>
                                                <option value="Resolved">Resolved</option>
                                            </select>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ))
            ) : (
                <p>No reports found</p>
            )}

            <div className="mt-4 flex justify-between">
                <span className="text-gray-600">Showing 1 to {reports.length} of {reports.length} reports</span>
                <div>
                    <button className="bg-gray-300 px-4 py-2 rounded-l">Previous</button>
                    <button className="bg-gray-300 px-4 py-2 rounded-r">Next</button>
                </div>
            </div>
        </div>
    );


};

export default AdminReportsPage;