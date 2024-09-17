import { getStudentCoursesTransaction, processRefund } from "../../components/redux/slices/paymentSlice";
import { AppDispatch, RootState } from "../../components/redux/store/store";
import { CheckCircle, XCircle, RefreshCcw, DollarSign, Calendar, CreditCard, IndianRupee } from "lucide-react";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Pagination from "../../components/common/Pagination";
import { toast } from "react-toastify";

export const StudentTransactions = () => {
    const [transactions, setTransactions] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState<number>(1);

    const dispatch: AppDispatch = useDispatch();
    const { user } = useSelector((state: RootState) => state.user);

    useEffect(() => {
        if (!user) return;
        dispatch(getStudentCoursesTransaction({ userId: user?._id, limit: 10, page: currentPage }))
            .then((res) => {
                setTransactions(res.payload.transactions);
                setTotalPages(res.payload.totalPages);
            });
    }, [dispatch, user, currentPage]);

    const handlePageChange = (pageNumber: number) => {
        setCurrentPage(pageNumber);
    };

    return (
        <div className="container mx-auto p-6 bg-gradient-to-r from-blue-50 to-indigo-50 min-h-screen">
            <h1 className="text-3xl font-bold mb-6 text-indigo-800 text-center"> Transactions</h1>
            <div className="overflow-x-auto rounded-xl shadow-2xl">
                <table className="w-full bg-white border-collapse">
                    <thead>
                        <tr className="bg-gradient-to-r from-indigo-600 to-blue-500 text-white">
                            <th className="py-3 px-6 text-left">Transaction ID</th>
                            <th className="py-3 px-6 text-left">Date</th>
                            <th className="py-3 px-6 text-left">Amount (INR)</th>
                            <th className="py-3 px-6 text-left">Status</th>
                            <th className="py-3 px-6 text-left">Currency</th>
                        </tr>
                    </thead>
                    <tbody>
                        {transactions.map((transaction, index) => (
                            <tr key={transaction.id} className={`hover:bg-indigo-50 transition-colors duration-200 ${index % 2 === 0 ? 'bg-white' : 'bg-indigo-50'}`}>
                                <td className="py-4 px-6 border-b border-indigo-100">
                                    <div className="flex items-center">
                                        <CreditCard className="mr-2 text-indigo-600" size={18} />
                                        <span className="font-medium">{transaction.stripe_payment_intent_id || ''}</span>
                                    </div>
                                </td>
                                <td className="py-4 px-6 border-b border-indigo-100">
                                    <div className="flex items-center">
                                        <Calendar className="mr-2 text-indigo-600" size={18} />
                                        <span>{new Date(transaction.createdAt).toLocaleDateString()}</span>
                                    </div>
                                </td>
                                <td className="py-4 px-6 border-b border-indigo-100">
                                    <div className="flex items-center">
                                        <IndianRupee className="mr-2 text-green-600" size={18} />
                                        <span className="font-semibold">{transaction.amountInINR}</span>
                                    </div>
                                </td>
                                <td className="py-4 px-6 border-b border-indigo-100">
                                    {transaction.status === 'completed' ? (
                                        <span className="flex items-center text-green-600 font-medium">
                                            <CheckCircle className="mr-2" size={18} /> Completed
                                        </span>
                                    ) : (
                                        <span className="flex items-center text-red-600 font-medium">
                                            <RefreshCcw className="mr-2" size={18} /> {transaction.status}
                                        </span>
                                    )}
                                </td>
                                <td className="py-4 px-6 border-b border-indigo-100">
                                    <span className="bg-indigo-100 text-indigo-800 py-1 px-3 rounded-full text-sm font-medium">
                                        {transaction.currency}
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <div className="mt-6 flex justify-center items-center">
                {totalPages > 1 && (
                    <Pagination
                        currentPage={currentPage}
                        onPageChange={handlePageChange}
                        totalPages={totalPages}
                    />
                )}
            </div>
        </div>
    );
};