"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, User, Lock, Mail } from "lucide-react";
import TextField from "@/components/shared/TextField";
import { useClerk, useSignIn, useSignUp } from "@clerk/nextjs";

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [animateForm, setAnimateForm] = useState(false);
  const router = useRouter();

  // Clerk authentication hooks
  const { signIn, isLoaded: signInLoaded } = useSignIn();
  const { signUp, isLoaded: signUpLoaded } = useSignUp();
  const { setActive } = useClerk();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    name: "",
  });

  useEffect(() => {
    setAnimateForm(true);
  }, []);

  const handleAuthModeChange = () => {
    setAnimateForm(false);
    setTimeout(() => {
      setIsLogin(!isLogin);
      setError(null);
      setAnimateForm(true);
    }, 300);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target as HTMLInputElement;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      if (isLogin) {
        if (!signInLoaded || !signIn) {
          throw new Error("Authentication system not loaded");
        }

        const result = await signIn.create({
          identifier: formData.email,
          password: formData.password,
        });

        if (result.status === "complete") {
          await setActive({ session: result.createdSessionId });
          setAnimateForm(false);
          setTimeout(() => router.push("/"), 500);
        } else {
          throw new Error("Additional verification required");
        }
      } else {
        if (!signUpLoaded || !signUp) {
          throw new Error("Authentication system not loaded");
        }

        const result = await signUp.create({
          emailAddress: formData.email,
          password: formData.password,
          firstName: formData.name.split(" ")[0],
          lastName: formData.name.split(" ").slice(1).join(" ") || "",
        });

        if (result.status === "complete") {
          await setActive({ session: result.createdSessionId });
          setAnimateForm(false);
          setTimeout(() => router.push("/"), 500);
        } else {
          router.push("/verification");
        }
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message || "Authentication failed");
      } else {
        setError("An unknown error occurred");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 overflow-hidden">
      <div
        className={`max-w-md w-full space-y-8 bg-white p-8 rounded-lg shadow-md transition-all duration-500 ease-in-out 
          ${
            animateForm
              ? "opacity-100 translate-y-0 scale-100"
              : "opacity-0 -translate-y-6 scale-95"
          }`}
      >
        <div className="text-center">
          <h1 className="text-3xl font-bold text-emerald-600 animate-pulse">
            IoTLinker
          </h1>
          <h2
            className={`mt-6 text-center text-2xl font-bold text-gray-900 transition-all duration-300 
            ${
              animateForm
                ? "opacity-100 translate-x-0"
                : "opacity-0 -translate-x-4"
            }`}
          >
            {isLogin ? "Sign in to your account" : "Create a new account"}
          </h2>
        </div>

        {error && (
          <div
            className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative animate-shake"
            role="alert"
          >
            <span className="block sm:inline">{error}</span>
          </div>
        )}

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm space-y-4">
            {!isLogin && (
              <div
                className={`relative transition-all duration-500 ease-in-out 
                  ${
                    animateForm
                      ? "opacity-100 translate-y-0"
                      : "opacity-0 -translate-y-4"
                  }`}
                style={{ transitionDelay: "100ms" }}
              >
                <label htmlFor="name" className="sr-only">
                  Full Name
                </label>
                <User
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                  size={18}
                />
                <TextField
                  id="name"
                  name="name"
                  type="text"
                  required={!isLogin}
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Full Name"
                />
              </div>
            )}

            <div
              className={`relative transition-all duration-500 ease-in-out 
                ${
                  animateForm
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 -translate-y-4"
                }`}
              style={{ transitionDelay: isLogin ? "100ms" : "200ms" }}
            >
              <label htmlFor="email" className="sr-only">
                Email address
              </label>
              <Mail
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                size={18}
              />
              <TextField
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={formData.email}
                onChange={handleChange}
                placeholder="Email address"
              />
            </div>

            <div
              className={`relative transition-all duration-500 ease-in-out 
                ${
                  animateForm
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 -translate-y-4"
                }`}
              style={{ transitionDelay: isLogin ? "200ms" : "300ms" }}
            >
              <label htmlFor="password" className="sr-only">
                Password
              </label>
              <Lock
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                size={18}
              />
              <TextField
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                autoComplete={isLogin ? "current-password" : "new-password"}
                required
                value={formData.password}
                onChange={handleChange}
                placeholder="Password"
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors duration-200"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {isLogin && (
            <div
              className={`flex items-center justify-end transition-all duration-500 ease-in-out 
                ${
                  animateForm
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-4"
                }`}
              style={{ transitionDelay: "300ms" }}
            >
              <div className="text-sm">
                <button
                  type="button"
                  onClick={() => router.push("/forgot-password")}
                  className="font-medium text-emerald-600 hover:text-emerald-500 transition-colors duration-200"
                >
                  Forgot your password?
                </button>
              </div>
            </div>
          )}

          <div
            className={`transition-all duration-500 ease-in-out 
              ${
                animateForm
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-4"
              }`}
            style={{ transitionDelay: "400ms" }}
          >
            <button
              type="submit"
              disabled={isLoading}
              className={`group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transform transition-all duration-300 ${
                isLoading
                  ? "opacity-70 cursor-not-allowed"
                  : "hover:scale-105 active:scale-95"
              }`}
            >
              {isLoading ? (
                <span className="flex items-center">
                  <svg
                    className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Processing...
                </span>
              ) : isLogin ? (
                "Sign in"
              ) : (
                "Sign up"
              )}
            </button>
          </div>
        </form>

        <div
          className={`text-center mt-4 transition-all duration-500 ease-in-out 
            ${
              animateForm
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-4"
            }`}
          style={{ transitionDelay: "500ms" }}
        >
          <button
            onClick={handleAuthModeChange}
            className="font-medium text-emerald-600 hover:text-emerald-500 transition-colors duration-200 hover:underline"
          >
            {isLogin
              ? "Don't have an account? Sign up"
              : "Already have an account? Sign in"}
          </button>
        </div>

        <div
          className={`mt-6 transition-all duration-500 ease-in-out 
            ${
              animateForm
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-4"
            }`}
          style={{ transitionDelay: "600ms" }}
        >
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">
                Or continue with
              </span>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-2 gap-2">
            {/* Social login buttons would typically be Clerk components */}
            <button
              type="button"
              onClick={() =>
                isLogin
                  ? signIn?.authenticateWithRedirect({
                      strategy: "oauth_google",
                      redirectUrl: "/sso-callback",
                      redirectUrlComplete: "/",
                    })
                  : signUp?.authenticateWithRedirect({
                      strategy: "oauth_google",
                      redirectUrl: "/sso-callback",
                      redirectUrlComplete: "/",
                    })
              }
              className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
            >
              <span className="sr-only">Sign in with Google</span>
              <svg
                className="w-5 h-5"
                fill="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path d="M12.545 10.239v3.821h5.445c-0.712 2.315-2.647 3.972-5.445 3.972-3.332 0-6.033-2.701-6.033-6.032s2.701-6.032 6.033-6.032c1.498 0 2.866 0.549 3.921 1.453l2.814-2.814c-1.787-1.676-4.139-2.701-6.735-2.701-5.522 0-10.001 4.478-10.001 10s4.478 10 10.001 10c8.396 0 10.249-7.85 9.426-11.748l-9.426 0.081z" />
              </svg>
            </button>

            <button
              type="button"
              onClick={() =>
                isLogin
                  ? signIn?.authenticateWithRedirect({
                      strategy: "oauth_github",
                      redirectUrl: "/sso-callback",
                      redirectUrlComplete: "/",
                    })
                  : signUp?.authenticateWithRedirect({
                      strategy: "oauth_github",
                      redirectUrl: "/sso-callback",
                      redirectUrlComplete: "/",
                    })
              }
              className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
            >
              <span className="sr-only">Sign in with GitHub</span>
              <svg
                className="w-5 h-5"
                fill="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  fillRule="evenodd"
                  d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
