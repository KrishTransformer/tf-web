import { useDispatch } from "react-redux";
import { bindActionCreators } from "@reduxjs/toolkit";

export const useActions = (actions) => {
	const dispatch = useDispatch();
	return bindActionCreators(actions, dispatch);
};
