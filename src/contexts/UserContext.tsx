import { createContext, Dispatch, SetStateAction } from "react";

export type User = {
  id: string | undefined;
  email: string | null;
};

type UserContextType = {
  user: User | null;
  setUser: Dispatch<SetStateAction<User | null>>;
};

export const UserContext = createContext<UserContextType | null>(null);
