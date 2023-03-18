import { configureStore } from "@reduxjs/toolkit";
import classementReducer from "../features/classementSlice";

export const store = configureStore({
  reducer: {
    classement: classementReducer,
  },
});
