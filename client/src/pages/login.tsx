import { useState } from "react";
import { ImagePlaceholder } from "@/components/image-placeholder";
import { BottomNav } from "@/components/bottom-nav";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { LogIn, UserPlus } from "lucide-react";
import { useSettings } from "@/hooks/use-settings";

export default function LoginPage() {
  const { get } = useSettings();
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const companyName = get("global_company_name", "[ Company Name ]");
  const welcomeText = get("login_welcome_text", "Welcome");
  const subtitle = get("login_subtitle", "Sign in to access the platform");
  const headerImage = get("login_header_image");
  const bgImage = get("bg_login");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const endpoint = isRegister ? "/api/auth/register" : "/api/auth/login";
      const body = isRegister
        ? { email, password, firstName, lastName }
        : { email, password };
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
        credentials: "include",
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || "Authentication failed");
      }
      window.location.href = "/";
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex flex-col bg-background"
      style={bgImage ? {
        backgroundImage: `url(${bgImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      } : undefined}
    >
      {bgImage && <div className="fixed inset-0 bg-background/80 z-0" />}
      <div className={`flex flex-col min-h-screen ${bgImage ? "relative z-10" : ""}`}>
      <div className="w-full border-b px-4 py-2">
        <p className="text-center text-xs tracking-widest uppercase text-muted-foreground">
          {companyName}
        </p>
      </div>

      <div className="w-full border-b">
        {headerImage ? (
          <img src={headerImage} alt="Header" className="w-full h-14 object-cover" />
        ) : (
          <ImagePlaceholder label="Header Image" className="w-full h-14 rounded-none" />
        )}
      </div>

      <div className="flex-1 flex flex-col items-center justify-center px-6 pb-20 max-w-sm mx-auto w-full">
        <div className="w-full space-y-6">
          <div className="text-center space-y-2">
            <h1 className="text-2xl font-semibold tracking-tight">{welcomeText}</h1>
            <p className="text-sm text-muted-foreground">{subtitle}</p>
          </div>

          {error && (
            <div className="bg-destructive/10 text-destructive text-sm p-3 rounded-md text-center">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {isRegister && (
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <Label htmlFor="firstName">First Name</Label>
                  <Input
                    id="firstName"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    placeholder="First name"
                  />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input
                    id="lastName"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    placeholder="Last name"
                  />
                </div>
              </div>
            )}

            <div className="space-y-1">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
              />
            </div>

            <div className="space-y-1">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                required
                minLength={6}
              />
            </div>

            <Button className="w-full" type="submit" disabled={loading}>
              {isRegister ? (
                <><UserPlus className="w-4 h-4 mr-2" />Create Account</>
              ) : (
                <><LogIn className="w-4 h-4 mr-2" />Sign In</>
              )}
            </Button>
          </form>

          <p className="text-xs text-center text-muted-foreground">
            {isRegister ? "Already have an account?" : "Don't have an account?"}{" "}
            <button
              type="button"
              className="underline hover:text-foreground"
              onClick={() => { setIsRegister(!isRegister); setError(""); }}
            >
              {isRegister ? "Sign in" : "Create one"}
            </button>
          </p>
        </div>
      </div>

      <BottomNav />
      </div>
    </div>
  );
}
