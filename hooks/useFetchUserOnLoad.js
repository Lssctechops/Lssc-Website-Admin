"use client";

// LOCAL DEV — no backend. Loads the user saved at login into redux.
import { useEffect } from "react";
import { useDispatch } from "react-redux";

export const useFetchUserOnLoad = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    let user = { name: "Admin", email: "admin@local", role: "superadmin" };

    try {
      const saved = localStorage.getItem("user");
      if (saved) {
        const parsed = JSON.parse(saved);
        user = { ...user, ...parsed };
      }
    } catch {}

    dispatch({
      type: "getloginuser/get/fulfilled",
      payload: { user },
    });
  }, [dispatch]);
};