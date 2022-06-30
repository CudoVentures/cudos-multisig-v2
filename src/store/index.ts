import { configureStore, combineReducers } from '@reduxjs/toolkit'
import storage from 'redux-persist/lib/storage'
import { persistReducer } from 'redux-persist'
import settingsReducer from './settings'
import modalStateReducer from './modals'
import userStateReducer from './user'
import stepsReducer from './steps'
import walletObjectReducer from './walletObject'

const rootReducer = combineReducers({
    settings: settingsReducer,
    modalState: modalStateReducer,
    userState: userStateReducer,
    steps: stepsReducer,
    walletObject: walletObjectReducer
})

const persistConfig = {
  key: 'root',
  storage
}

const persistedReducer = persistReducer(persistConfig, rootReducer)

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false
    })
})

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch
