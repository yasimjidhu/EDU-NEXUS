import React, { useState, useEffect } from 'react';
import { 
    AlertDialog, 
    AlertDialogAction, 
    AlertDialogCancel, 
    AlertDialogContent, 
    AlertDialogDescription, 
    AlertDialogFooter, 
    AlertDialogHeader, 
    AlertDialogTitle, 
    AlertDialogTrigger 
} from '../ui/alert-dialog';
import { AppDispatch } from '../redux/store/store';
import { useDispatch } from 'react-redux';
import { blockCategory } from '../redux/slices/adminSlice';

interface CategoryBlockConfirmationProps {
    categoryId: string|null|undefined;
    onSuccess?: () => void;
    onError?: (error: any) => void;
}

const CategoryBlockConfirmation: React.FC<CategoryBlockConfirmationProps> = ({ categoryId, onSuccess, onError }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isConfirmed, setIsConfirmed] = useState(false);

    const dispatch: AppDispatch = useDispatch();

    const handleConfirm = () => {
        setIsConfirmed(true);
        setIsOpen(false);
    };

    const handleBlockCategory = async () => {
        if (!isConfirmed) return;
        setIsLoading(true);
        try {
            await dispatch(blockCategory(categoryId))
            onSuccess?.();
        } catch (error) {
            onError?.(error);
        } finally {
            setIsLoading(false);
            setIsConfirmed(false);
        }
    };

    useEffect(() => {
        if (isConfirmed) {
            handleBlockCategory();
        }
    }, [isConfirmed]);

    return (
        <AlertDialog isOpen={isOpen} onOpenChange={setIsOpen}>
            <AlertDialogTrigger className="bg-black hover:bg-gray-700 text-white font-bold py-1 px-4 rounded-full ml-52">
                Delete
            </AlertDialogTrigger>
            <AlertDialogContent className='bg-white'>
                <AlertDialogHeader>
                    <AlertDialogTitle className="text-2xl font-bold">Confirm Category Deletion</AlertDialogTitle>
                    <AlertDialogDescription className="text-gray-600">
                        Are you sure you want to Delete this category? This action will prevent all items in this category from being displayed.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded">
                        Cancel
                    </AlertDialogCancel>
                    <AlertDialogAction 
                        className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                        onClick={handleConfirm}
                    >
                        Confirm Block
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
};

export default CategoryBlockConfirmation;
