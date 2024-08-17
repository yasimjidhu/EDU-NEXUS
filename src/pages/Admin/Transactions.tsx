import React, { useState, useEffect } from 'react';
import { ChevronDown, ChevronUp, Search, Download, ArrowUpDown } from 'lucide-react';
import { getTransactions } from '../../components/redux/slices/paymentSlice';
import { AppDispatch, RootState } from '../../components/redux/store/store';
import { useDispatch, useSelector } from 'react-redux';
import { User } from '../../types/user';
import { getAllUsers } from '../../components/redux/slices/studentSlice';


const AdminTransaction = () => {
    const dispatch: AppDispatch = useDispatch();
    const [searchTerm, setSearchTerm] = useState('');
    const [sortConfig, setSortConfig] = useState({ key: 'created_at', direction: 'desc' });
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(10);
    const [filters, setFilters] = useState({
        startDate: '',
        endDate: '',
        status: '',
    });
    const [allUsers, setAllUsers] = useState<User[]>([])

    useEffect(() => {
        if (allUsers.length <= 0) {
            dispatch(getAllUsers()).then((res) => {
                console.log('response payload of allusers', res.payload)
                setAllUsers(res.payload)
            })
        }
    }, []);

    const { transactions, loading, error } = useSelector((state: RootState) => state.payment);
    const { allCourses } = useSelector((state: RootState) => state.course)

    useEffect(() => {
        const fetchTransactions = () => {
            const params: Record<string, string> = {
                sortBy: sortConfig.key,
                sortOrder: sortConfig.direction,
                page: currentPage.toString(),
                limit: itemsPerPage.toString(),
                search: searchTerm,
                ...filters,
            };

            // Remove empty filters
            Object.keys(params).forEach(key => params[key] === '' && delete params[key]);

            dispatch(getTransactions(params));
        };

        fetchTransactions();
    }, [dispatch, sortConfig, currentPage, itemsPerPage, searchTerm, filters]);

    const handleSort = (key: string) => {
        setSortConfig({
            key,
            direction: sortConfig.key === key && sortConfig.direction === 'asc' ? 'desc' : 'asc',
        });
    };

    const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFilters({ ...filters, [e.target.name]: e.target.value });
    };

    const filteredTransactions = transactions.filter(
        (transaction) =>
            transaction.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
            transaction.user_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
            transaction.course_id.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'completed': return 'bg-green-100 text-green-800';
            case 'pending': return 'bg-yellow-100 text-yellow-800';
            case 'failed': return 'bg-red-100 text-red-800';
            case 'refunded': return 'bg-blue-100 text-blue-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    const getCourseName = (courseId: string) => {
        return allCourses?.find((course) => course._id == courseId)
    }

    const getUserName = (userId: string): string | null => {
        if (!allUsers) return null;
        const user = allUsers.find((user) => user._id === userId);
        return user ? `${user.firstName} ${user.lastName}` : null;
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-6">Transaction History</h1>
            <div className="mb-4 flex flex-wrap justify-between items-center">
                <div className="relative mb-2 sm:mb-0">
                    <input
                        type="text"
                        placeholder="Search transactions..."
                        className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <Search className="absolute left-3 top-2.5 text-gray-400" size={20} />
                </div>
                <div className="flex flex-wrap items-center">
                    <input
                        type="date"
                        name="startDate"
                        value={filters.startDate}
                        onChange={handleFilterChange}
                        className="mr-2 mb-2 sm:mb-0 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <input
                        type="date"
                        name="endDate"
                        value={filters.endDate}
                        onChange={handleFilterChange}
                        className="mr-2 mb-2 sm:mb-0 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <select
                        name="status"
                        value={filters.status}
                        onChange={handleFilterChange}
                        className="mr-2 mb-2 sm:mb-0 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="">All Statuses</option>
                        <option value="completed">Completed</option>
                        <option value="pending">Pending</option>
                        <option value="failed">Failed</option>
                        <option value="refunded">Refunded</option>
                    </select>
                    <button className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition duration-300 flex items-center">
                        <Download size={20} className="mr-2" />
                        Export CSV
                    </button>
                </div>
            </div>
            <div className="overflow-x-auto bg-white rounded-lg shadow overflow-y-auto relative">
                <table className="border-collapse table-auto w-full whitespace-no-wrap bg-white table-striped relative">
                    <thead>
                        <tr className="text-left">
                            {['ID', 'User', 'Course', 'Amount', 'Currency', 'Status', 'Date'].map((header) => (
                                <th key={header} className="bg-gray-100 sticky top-0 border-b border-gray-200 px-6 py-3 text-gray-600 font-bold tracking-wider uppercase text-xs">
                                    <button className="flex items-center" onClick={() => handleSort(header.toLowerCase())}>
                                        {header}
                                        <ArrowUpDown size={14} className="ml-1" />
                                    </button>
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr>
                                <td colSpan={7} className="text-center py-4">Loading...</td>
                            </tr>
                        ) : error ? (
                            <tr>
                                <td colSpan={7} className="text-center py-4 text-red-500">{error}</td>
                            </tr>
                        ) : (
                            filteredTransactions.map((transaction) => (
                                <tr key={transaction.id}>
                                    <td className="border-t border-gray-200 px-6 py-4">{transaction.id}</td>
                                    <td className="border-t border-gray-200 px-6 py-4">
                                        {getUserName(transaction.userId)}
                                    </td>
                                    <td className="border-t border-gray-200 px-6 py-4">{getCourseName(transaction.courseId)?.title}</td>
                                    <td className="border-t border-gray-200 px-6 py-4">{(transaction.amount / 100).toFixed(2)}</td>
                                    <td className="border-t border-gray-200 px-6 py-4">{transaction.currency}</td>
                                    <td className="border-t border-gray-200 px-6 py-4">
                                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(transaction.status)}`}>
                                            {transaction.status}
                                        </span>
                                    </td>
                                    <td className="border-t border-gray-200 px-6 py-4">
                                        {new Date(transaction.created_at).toLocaleDateString()}
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
            <div className="mt-4 flex justify-between items-center">
                <div>
                    Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, filteredTransactions.length)} of {filteredTransactions.length} entries
                </div>
                <div className="flex">
                    {Array.from({ length: Math.ceil(filteredTransactions.length / itemsPerPage) }, (_, i) => (
                        <button
                            key={i}
                            onClick={() => paginate(i + 1)}
                            className={`px-3 py-1 mx-1 rounded ${currentPage === i + 1 ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
                        >
                            {i + 1}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default AdminTransaction;