import { ReactNode } from "react";

export function Layout({ children }: { children: ReactNode }) {
  return (
    <div className="h-dvh w-screen flex justify-center bg-background">
      <div className="w-full h-full">{children}</div>
    </div>
  );
}
