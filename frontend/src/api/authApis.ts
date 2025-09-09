import { useMutation } from "@tanstack/react-query";
import { fetcher } from "./index";

// This custom hook handles authentication logic using React Query
export const useLoginMutation = () => {
  return useMutation({
    mutationFn: async (payload: any) => {
      const res = await fetcher('/auth/login', 'POST', payload);
      return res.token;
    },
    onSuccess: (token) => {
      localStorage.setItem('token', token as string);
      console.log("✅ Login successful");
    },
    onError: (error: any) => {
      console.error("❌ Login failed:", error.message);
      throw error;
    }
  });
};

export const useSignupMutation = () => {
  return useMutation({
    mutationFn: async (payload: any) => {
      const res = await fetcher('/auth/signup', 'POST', payload);
      return res;
    },
    onSuccess: () => {
      console.log("✅ Signup successful");
    },
    onError: (error: any) => {
      console.error("❌ Signup failed:", error.message);
      throw error;
    }
  });
};