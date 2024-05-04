import AuthButton from "@/components/auth-button";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard",
};

export default async function ProtectedPage() {
  return (
    <div>
      <AuthButton />
    </div>
  );
}
