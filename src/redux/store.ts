import { configureStore, combineReducers } from "@reduxjs/toolkit";
import userReducer from './reducers/user/userSlice';
import adminReducer from './reducers/admin/adminSlice';
import { useDispatch } from "react-redux";
import { persistStore, persistReducer} from 'redux-persist';
import storage from 'redux-persist/lib/storage';

import { PersistConfig } from "redux-persist";






// export const useAppDispatch = () => useDispatch<AppDispatch>();
// export type RootState = ReturnType<typeof reducer>;
// export type AppDispatch = typeof store.dispatch;

const rootReducer = combineReducers({
    user: userReducer,
    admin: adminReducer
})

 export type RootState = ReturnType<typeof rootReducer>;

const persistConfig: PersistConfig<RootState> = {
    key: 'root',
    storage,
  };

const persistedReducer = persistReducer<RootState>(persistConfig, rootReducer);

export const store = configureStore({

    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: {
                ignoredActions:['persist/PERSIST', 'persist/REHYDRATE'],
            },
        }),
});

export const persistor = persistStore(store);


// export type RootState = ReturnType<typeof rootReducer>;
export type AppDispatch = typeof store.dispatch;
export const useAppDispatch = () => useDispatch<AppDispatch>();