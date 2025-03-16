import { ReactNode } from "react";

export function Layout({ children }: { children: ReactNode }) {
  return (
    <div className="flex justify-center w-screen h-dvh bg-background">
      <div className="w-full h-full">{children}</div>
    </div>
  );
}
