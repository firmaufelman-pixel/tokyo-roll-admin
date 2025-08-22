import React from "react";
import { createUseStyles } from "react-jss";
import { Navigate, Outlet } from "react-router-dom";
import supabase from "utils/client";

export default function ProtectedRoute() {
  const classes = useStyle();
  const user = supabase.auth.user();

  if (!!!user?.id) {
    return <Navigate to="/login" />;
  }

  return <Outlet />;
}

const useStyle = createUseStyles(({ colors }: Theme) => ({}));
