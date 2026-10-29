
import { configureStore } from "@reduxjs/toolkit";
import {
  persistStore,
  persistReducer,
} from "redux-persist";
import storageModule from "redux-persist/lib/storage/index.js";

const storage = storageModule.default || storageModule;
import cartReducer from "./cartSlice";

const persistConfig = {
  key: "cart",
  storage: storage,
  whitelist: ["items"],
};

const persistedCartReducer = persistReducer(
  persistConfig,
  cartReducer
);

console.log("getItem:", typeof storage.getItem);
console.log("setItem:", typeof storage.setItem);
export const store = configureStore({
  reducer: {
    cart: persistedCartReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export const persistor = persistStore(store);
