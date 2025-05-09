import { AuthProvider, useAuth } from "@/context/AuthContext";
import { Slot } from "expo-router";

function AuthGuard({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();


  // Render Slot for navigation to work correctly
  return user ? <>{children}</> : <Slot />;
}

export default function Layout() {
  return (
    <AuthProvider>
      <AuthGuard>
        <Slot />
      </AuthGuard>
    </AuthProvider>
  );
}
