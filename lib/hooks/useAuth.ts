import { useContext } from "react";
import { AuthContext, AuthContextType } from "@/app/providers/AuthProvider";

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth harus digunakan dalam AuthProvider");
  }
  return context;
}
