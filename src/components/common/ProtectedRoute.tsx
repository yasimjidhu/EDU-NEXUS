import React, { FC } from "react";
import { Navigate, Route } from "react-router-dom";
import { RootState } from "../redux/store/store";
import {useDispatch,useSelector } from "react-redux";
import { AppDispatch } from "../redux/store/store";
import { logoutUser } from "../redux/slices/authSlice";

interface ProtectedRouteProps {
	element: React.ReactElement;
	allowedRoles: string[];
}

export const ProtectedRoute: FC<ProtectedRouteProps> = ({ allowedRoles,...routeProps }) => {
	const { user } = useSelector((state: RootState) => state.user);
    console.log('>>>>>>>>',user)

	const dispatch = useDispatch<AppDispatch>

	if (!user) {
        console.log('user not found')
		// return <Navigate to="/home" />;
	}

	if (user.isBlocked) {
		dispatch(logoutUser());
		return <Navigate to="/auth/login" />;
	}


	if (!allowedRoles.includes(user.role)) {
        console.log('no user')
		return <Navigate to='/'/>
	} 
    return <Route {...routeProps}/>
};