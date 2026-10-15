"use client";
import { Provider } from "react-redux";
import { store } from "./store";
import "@/lib/axios-local-shim";

export const ReduxProvider = ({ children }) => {
  return <Provider store={store}>{children}</Provider>;
};