import { useContext } from "react";
import { AuthContext } from "./authProvider";

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error(
      "AuthProvider does not exist. Please wrap your component with AuthProvider.",
    );
  }
  return context;
};
