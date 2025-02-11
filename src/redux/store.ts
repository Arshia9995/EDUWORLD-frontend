import { configureStore, combineReducers } from "@reduxjs/toolkit";
import userReducer from './reducers/user/userSlice';
import adminReducer from './reducers/admin/adminSlice';
import { useDispatch } from "react-redux";

export const useAppDispatch = () => useDispatch<AppDispatch>();
export type RootState = ReturnType<typeof reducer>;
export type AppDispatch = typeof store.dispatch;

const reducer = combineReducers({
    user: userReducer,
    admin: adminReducer
})

export const store = configureStore({

    reducer: reducer
})
