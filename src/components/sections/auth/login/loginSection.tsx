"use client";
import useSweetAlert from "@/components/shared/toast/showToast";
import { FormErrors } from "@/components/shared/types/formTypes";
import { RootState } from "@/store";
import { useAppDispatch } from "@/store/hooks";
import { loginUser } from "@/store/slices/authSlice";
import { fetchCart } from "@/store/slices/cartSlice";
import { motion } from "framer-motion";
import { ArrowRight, Eye, EyeOff, Lock, Mail } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useSelector } from "react-redux";
import { AuthLayout } from "../authSection";


const formVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0 }
};

// Login Component
export const LoginPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const { loading, error } = useSelector((state: RootState) => state.auth);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [rememberMe, setRememberMe] = useState(false);
  const [twoFactorToken, setTwoFactorToken] = useState("");
  const [isTwoFactorRequired, setIsTwoFactorRequired] = useState(false);

  const router = useRouter();
  const createAlert = useSweetAlert();
  // const { login, loading, error } = useAuth();

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(email)) {
      newErrors.email = "Invalid email address";
    }

    if (!password) {
      newErrors.password = "Password is required";
    }
    if (isTwoFactorRequired && !twoFactorToken.trim()) {
      newErrors.twoFactorToken = "Two-factor token is required.";
    }
    

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const fetchCartData = async () => {
    try {
      const response = await dispatch(fetchCart());
      if (fetchCart.fulfilled.match(response)) {
      }
    } catch (error) {
      console.error("Failed to fetch cart", error);
    }
  }
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      const payload: { email: string; password: string; twoFactorToken?: string } = { email, password };
      if (isTwoFactorRequired) {
        payload.twoFactorToken = twoFactorToken;
      }

      const resultAction = await dispatch(loginUser(payload));
      if (loginUser.fulfilled.match(resultAction)) {
        createAlert("success", "Signed in successfully");
        fetchCartData();
        setEmail('');
        setPassword('');
        setTwoFactorToken('');
        setIsTwoFactorRequired(false);
        router.push("/");
      } else if (loginUser.rejected.match(resultAction)) {
        const errorMessage = resultAction.payload as string;

        if (errorMessage === "2FA token is required") {
          createAlert("info", "An extra security layer is added. Please provide your 2FA token.");
          setIsTwoFactorRequired(true);
        } else {
          createAlert("error", errorMessage);
        }
      }
    } catch (error) {
      createAlert("error", "An error occurred. Please try again later.");
    }
  };


  // const handleSubmit = async (e: React.FormEvent) => {
  //   e.preventDefault();
  //   if (!validateForm()) return;

  //   try {
  //     const resultAction = await dispatch(loginUser({ email, password }));
  //     if (loginUser.fulfilled.match(resultAction)) {
  //       createAlert("success", "Signed in successfully");
  //       fetchCartData();
  //       setEmail('');
  //       setPassword('');
  //       router.push("/");
  //     } else if (loginUser.rejected.match(resultAction)) {
  //       createAlert("error", resultAction.payload as string);
  //     }
  //   } catch (error) {
  //     createAlert("error", "An error occurred. Please try again later.");
  //   }
  // };
  return (
    <AuthLayout>
      <div className="space-y-6">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome Back</h1>
          <p className="text-gray-600">Sign in to continue shopping with us</p>
        </div>

        <motion.form
          variants={formVariants}
          initial="hidden"
          animate="visible"
          onSubmit={handleSubmit}
          className="space-y-6"
        >
          {/* Email Field */}
          <motion.div variants={itemVariants} className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Email</label>
            <div className="relative">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={`w-full px-4 py-3 pl-11 border rounded-lg focus:ring-2 
                  focus:ring-orange-500 transition-all ${errors.email ? "border-red" : "border-gray-200"
                  }`}
                placeholder="Enter your email"
              />
              <Mail className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
            </div>
            {errors.email && (
              <motion.span
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-sm text-red"
              >
                {errors.email}
              </motion.span>
            )}
          </motion.div>

          {/* Password Field */}
          <motion.div variants={itemVariants} className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Password</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={`w-full px-4 py-3 pl-11 pr-11 border rounded-lg focus:ring-2 
                  focus:ring-orange-500 transition-all ${errors.password ? "border-red" : "border-gray-200"
                  }`}
                placeholder="Enter your password"
              />
              <Lock className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 
                  hover:text-gray-600 transition-colors"
              >
                {showPassword ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
            </div>
            {errors.password && (
              <motion.span
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-sm text-red"
              >
                {errors.password}
              </motion.span>
            )}
          </motion.div>
          {isTwoFactorRequired && (
            <motion.div variants={itemVariants} className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                Two-Factor Authentication Token
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={twoFactorToken}
                  onChange={(e) => setTwoFactorToken(e.target.value)}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 
          focus:ring-orange-500 transition-all ${errors.twoFactorToken ? "border-red" : "border-gray-200"
                    }`}
                  placeholder="Enter your 2FA token"
                />
              </div>
              {errors.twoFactorToken && (
                <motion.span
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-sm text-red"
                >
                  {errors.twoFactorToken}
                </motion.span>
              )}
            </motion.div>
          )}


          {/* Remember Me & Forgot Password */}
          <motion.div variants={itemVariants} className="flex items-center justify-between">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="w-4 h-4 text-orange-500 rounded border-gray-300 
                  focus:ring-orange-500"
              />
              <span className="ml-2 text-sm text-gray-600">Remember me</span>
            </label>
            <Link
              href="/auth/forgot-password"
              className="text-sm text-orange-500 hover:text-orange-600 transition-colors"
            >
              Forgot password?
            </Link>
          </motion.div>

          {/* Submit Button */}
          <motion.button
            variants={itemVariants}
            type="submit"
            disabled={loading}
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            className={`w-full py-3 px-4 bg-orange-500 text-white rounded-lg font-medium
              ${loading ? "opacity-70 cursor-not-allowed" : "hover:bg-orange-600"} 
              transition-all duration-200`}
          >
            {loading ? (
              <div className="flex items-center justify-center">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{
                    duration: 1,
                    repeat: Infinity,
                    ease: "linear"
                  }}
                  className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                />
                <span className="ml-2">Signing in...</span>
              </div>
            ) : (
              <span className="flex items-center justify-center">
                Sign In <ArrowRight className="w-5 h-5 ml-2" />
              </span>
            )}
          </motion.button>

          {/* Social Login */}
          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-white text-gray-500">
                Or continue with
              </span>
            </div>
          </div>

          <motion.div variants={itemVariants} className="grid grid-cols-1 gap-4">
            <motion.button
              whileHover={{ scale: 1.01, boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)" }}
              whileTap={{ scale: 0.99 }}
              type="button"
              className="flex items-center justify-center px-4 py-3 border border-gray-200 
                rounded-lg hover:bg-gray-50 transition-all duration-200"
            >
              {/* < className="w-5 h-5 mr-2" /> */}
              <img src="/assets/icons/image.png" alt="" className="h-5 w-5 mr-2" />
              Continue with Google
            </motion.button>
          </motion.div>
        </motion.form>

        {/* Register Link */}
        <motion.p
          variants={itemVariants}
          className="text-center text-gray-600"
        >
          Don't have an account?{" "}
          <Link
            href="/auth/register"
            className="text-orange-500 hover:text-orange-600 font-medium transition-colors"
          >
            Sign up
          </Link>
        </motion.p>
      </div>
    </AuthLayout>
  );
};
