import React, { createContext, useContext, useState, ReactNode } from "react";

interface SessionContextType {
  session: sessionType;
  setSession: React.Dispatch<React.SetStateAction<sessionType>>;
}

type sessionType = {
  company: string;
  job_description: string;
  type: string;
  num_q: number;
  resume: string;
};

const SessionContext = createContext<SessionContextType | undefined>(undefined);

export function useSessionContext() {
  const context = useContext(SessionContext);
  if (!context) {
    throw new Error("useSessionContext must be used within a PageProvider");
  }
  return context;
}

interface SessionProviderProps {
  children: ReactNode;
}

export function SessionProvider({ children }: SessionProviderProps) {
  const [session, setSession] = useState<sessionType>({
    company: "",
    job_description: "",
    type: "",
    num_q: 1,
    resume: "",
  });

  return (
    <SessionContext.Provider value={{ session, setSession }}>
      {children}
    </SessionContext.Provider>
  );
}
