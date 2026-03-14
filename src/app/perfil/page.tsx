import { Suspense } from "react";
import ProfileComponent from "@/components/ProfileComponent";

export default function ProfilePage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><div className="w-8 h-8 border-4 border-green-500 border-t-transparent rounded-full animate-spin"></div></div>}>
      <ProfileComponent />
    </Suspense>
  );
}