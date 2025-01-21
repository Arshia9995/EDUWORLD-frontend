import { configureStore, combineReducers } from "@reduxjs/toolkit";
import userReducer from './reducers/user/userSlice';
import { useDispatch } from "react-redux";

export const useAppDispatch = () => useDispatch<AppDispatch>();

export type AppDispatch = typeof store.dispatch;

const reducer = combineReducers({
    user: userReducer,
})

export const store = configureStore({

    reducer: reducer
})
