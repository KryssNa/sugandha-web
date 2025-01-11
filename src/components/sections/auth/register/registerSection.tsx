"use client";

import useSweetAlert from "@/components/shared/toast/showToast";
import { FormErrors } from "@/components/shared/types/formTypes";
import { AppDispatch, RootState } from "@/store";
import { registerUser, resetRegistrationSuccess } from "@/store/slices/authSlice";
import { Facebook } from "@/utils/helpers/svgicon";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, Eye, EyeOff, Lock, Mail, User } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AuthLayout } from "../authSection";

// Types
interface PasswordStrength {
  score: number;
  feedback: string;
  color: string;
}

// Password strength indicator component
const PasswordStrengthIndicator: React.FC<{ password: string }> = ({
  password,
}) => {
  const [strength, setStrength] = useState<PasswordStrength>({
    score: 0,
    feedback: "Password is required",
    color: "bg-gray-200",
  });

  useEffect(() => {
    if (!password) {
      setStrength({
        score: 0,
        feedback: "Password is required",
        color: "bg-gray-200",
      });
      return;
    }

    let score = 0;
    let feedback = "";

    // Length check
    if (password.length >= 8) score += 1;
    if (password.length >= 12) score += 1;

    // Complexity checks
    if (/[A-Z]/.test(password)) score += 1;
    if (/[0-9]/.test(password)) score += 1;
    if (/[^A-Za-z0-9]/.test(password)) score += 1;

    // Set feedback based on score
    switch (score) {
      case 0:
      case 1:
        feedback = "Very weak";
        break;
      case 2:
        feedback = "Weak";
        break;
      case 3:
        feedback = "Medium";
        break;
      case 4:
        feedback = "Strong";
        break;
      case 5:
        feedback = "Very strong";
        break;
    }

    const colors: { [key: number]: string } = {
      0: "bg-red-500",
      1: "bg-red-400",
      2: "bg-orange-400",
      3: "bg-yellow-400",
      4: "bg-green-400",
      5: "bg-green-500",
    };

    setStrength({
      score,
      feedback,
      color: colors[score] || "bg-gray-200",
    });
  }, [password]);

  return (
    <div className='space-y-2'>
      <div className='flex space-x-2 h-1'>
        {[1, 2, 3, 4, 5].map((segment) => (
          <motion.div
            key={segment}
            className={`flex-1 rounded-full ${segment <= strength.score ? strength.color : "bg-gray-200"
              }`}
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.2, delay: segment * 0.1 }}
          />
        ))}
      </div>
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className='text-xs text-gray-600'
      >
        Password strength: {strength.feedback}
      </motion.p>
    </div>
  );
};

// Animation variants
const formVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0 },
};

// Register Component
export const RegisterPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { loading, error, registrationSuccess } = useSelector(
    (state: RootState) => state.auth
  );
  // Form state
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [acceptTerms, setAcceptTerms] = useState(false);
  const router = useRouter();
  const createAlert = useSweetAlert();
  // Clear specific field error
  const clearError = (fieldName: keyof FormErrors) => {
    setErrors((prev) => {
      const newErrors = { ...prev };
      delete newErrors[fieldName];
      return newErrors;
    });
  };

  // Handle input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    clearError(name as keyof FormErrors);

    // Special handling for confirm password
    if (name === "password" || name === "confirmPassword") {
      if (name === "password" && formData.confirmPassword) {
        if (formData.confirmPassword !== value) {
          setErrors((prev) => ({
            ...prev,
            confirmPassword: "Passwords must match",
          }));
        } else {
          clearError("confirmPassword");
        }
      }
      if (name === "confirmPassword" && value !== formData.password) {
        setErrors((prev) => ({
          ...prev,
          confirmPassword: "Passwords must match",
        }));
      }
    }
  };

  // Handle terms checkbox
  const handleTermsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAcceptTerms(e.target.checked);
    clearError("terms");
  };
  useEffect(() => {
    // Reset registration success state when component unmounts
    return () => {
      dispatch(resetRegistrationSuccess());
    };
  }, [dispatch]);

  // Form validation
  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    // Name validation
    if (!formData.name?.trim()) {
      newErrors.name = "Name is required";
    } else if (formData.name.length < 2) {
      newErrors.name = "Name must be at least 2 characters";
    }

    // Email validation
    if (!formData.email?.trim()) {
      newErrors.email = "Email is required";
    } else if (
      !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(formData.email)
    ) {
      newErrors.email = "Invalid email address";
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = "Password is required";
    } else {
      const passwordChecks = {
        length: formData.password.length >= 8,
        hasUpper: /[A-Z]/.test(formData.password),
        hasLower: /[a-z]/.test(formData.password),
        hasNumber: /\d/.test(formData.password),
        hasSpecial: /[^A-Za-z0-9]/.test(formData.password),
      };

      if (!passwordChecks.length) {
        newErrors.password = "Password must be at least 8 characters";
      } else if (!passwordChecks.hasUpper || !passwordChecks.hasLower) {
        newErrors.password =
          "Password must contain both uppercase and lowercase letters";
      } else if (!passwordChecks.hasNumber) {
        newErrors.password = "Password must contain at least one number";
      } else if (!passwordChecks.hasSpecial) {
        newErrors.password =
          "Password must contain at least one special character";
      }
    }

    // Confirm password validation
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords must match";
    }

    // Terms validation
    if (!acceptTerms) {
      newErrors.terms = "You must accept the Terms and Conditions";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      const resultAction = await dispatch(
        registerUser({
          firstName: formData.name,
          lastName: formData.name,
          email: formData.email,
          password: formData.password
        })
      );

      if (registerUser.fulfilled.match(resultAction)) {
        createAlert("success", "Registration successful");
        // dispatch(resetRegistrationSuccess());
        setFormData({
          name: "",
          email: "",
          password: "",
          confirmPassword: ""
        });
        router.push("/");
      } else if (registerUser.rejected.match(resultAction)) {
        createAlert("error", resultAction.payload as string);
      }
    } catch (error) {
      createAlert("error", "Registration failed. Please try again.");
    }
  };

  // JSX
  return (
    <AuthLayout>
      <div className='space-y-6'>
        {/* Header */}
        <div className='text-center mb-8'>
          <h1 className='text-3xl font-bold text-gray-900 mb-2'>
            Create Account
          </h1>
          <p className='text-gray-600'>
            Join us for a better shopping experience
          </p>
        </div>

        {/* Form */}
        <motion.form
          variants={formVariants}
          initial='hidden'
          animate='visible'
          onSubmit={handleSubmit}
          className='space-y-6'
        >
          {/* Name Field */}
          <motion.div variants={itemVariants} className='space-y-2'>
            <label className='text-sm font-medium text-gray-700'>
              Full Name
            </label>
            <div className='relative'>
              <input
                type='text'
                name='name'
                value={formData.name}
                onChange={handleChange}
                onFocus={() => clearError("name")}
                className={`w-full px-4 py-3 pl-11 border rounded-lg focus:ring-2 
                  focus:ring-orange-500 transition-all ${errors.name ? "border-red-500" : "border-gray-200"
                  }`}
                placeholder='Enter your full name'
              />
              <User className='w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2' />
            </div>
            <AnimatePresence>
              {errors.name && (
                <motion.span
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className='text-sm text-red-500'
                >
                  {errors.name}
                </motion.span>
              )}
            </AnimatePresence>
          </motion.div>

          {/* Email Field */}
          <motion.div variants={itemVariants} className='space-y-2'>
            <label className='text-sm font-medium text-gray-700'>Email</label>
            <div className='relative'>
              <input
                type='email'
                name='email'
                value={formData.email}
                onChange={handleChange}
                onFocus={() => clearError("email")}
                className={`w-full px-4 py-3 pl-11 border rounded-lg focus:ring-2 
                  focus:ring-orange-500 transition-all ${errors.email ? "border-red-500" : "border-gray-200"
                  }`}
                placeholder='Enter your email'
              />
              <Mail className='w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2' />
            </div>
            <AnimatePresence>
              {errors.email && (
                <motion.span
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className='text-sm text-red-500'
                >
                  {errors.email}
                </motion.span>
              )}
            </AnimatePresence>
          </motion.div>

          {/* Password Fields */}
          <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
            {/* Password */}
            <motion.div variants={itemVariants} className='space-y-2'>
              <label className='text-sm font-medium text-gray-700'>
                Password
              </label>
              <div className='relative'>
                <input
                  type={showPassword ? "text" : "password"}
                  name='password'
                  value={formData.password}
                  onChange={handleChange}
                  onFocus={() => clearError("password")}
                  className={`w-full px-4 py-3 pl-11 pr-11 border rounded-lg focus:ring-2 
                    focus:ring-orange-500 transition-all ${errors.password ? "border-red-500" : "border-gray-200"
                    }`}
                  placeholder='Create password'
                />
                <Lock className='w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2' />
                <button
                  type='button'
                  onClick={() => setShowPassword(!showPassword)}
                  className='absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 
                    hover:text-gray-600 transition-colors'
                >
                  {showPassword ? (
                    <EyeOff className='w-5 h-5' />
                  ) : (
                    <Eye className='w-5 h-5' />
                  )}
                </button>
              </div>
              {formData.password && (
                <PasswordStrengthIndicator password={formData.password} />
              )}
              <AnimatePresence>
                {errors.password && (
                  <motion.span
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className='text-sm text-red-500'
                  >
                    {errors.password}
                  </motion.span>
                )}
              </AnimatePresence>
            </motion.div>

            {/* Confirm Password */}
            <motion.div variants={itemVariants} className='space-y-2'>
              <label className='text-sm font-medium text-gray-700'>
                Confirm Password
              </label>
              <div className='relative'>
                <input
                  type={showPassword ? "text" : "password"}
                  name='confirmPassword'
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  onFocus={() => clearError("confirmPassword")}
                  className={`w-full px-4 py-3 pl-11 pr-11 border rounded-lg focus:ring-2 
                    focus:ring-orange-500 transition-all ${errors.confirmPassword
                      ? "border-red-500"
                      : "border-gray-200"
                    }`}
                  placeholder='Confirm password'
                />
                <Lock className='w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2' />
              </div>
              <AnimatePresence>
                {errors.confirmPassword && (
                  <motion.span
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className='text-sm text-red-500'
                  >
                    {errors.confirmPassword}
                  </motion.span>
                )}
              </AnimatePresence>
            </motion.div>
          </div>

          {/* Terms and Conditions */}
          <motion.div variants={itemVariants} className='flex items-start'>
            <div className='flex items-center h-5'>
              <input
                id='terms'
                type='checkbox'
                checked={acceptTerms}
                onChange={(e) => setAcceptTerms(e.target.checked)}
                className='w-4 h-4 text-orange-500 border-gray-300 rounded 
                  focus:ring-orange-500'
              />
            </div>
            <div className='ml-3 text-sm'>
              <label htmlFor='terms' className='text-gray-600'>
                I agree to the{" "}
                <Link
                  href='/terms'
                  className='text-orange-500 hover:text-orange-600'
                >
                  Terms and Conditions
                </Link>{" "}
                and{" "}
                <Link
                  href='/privacy'
                  className='text-orange-500 hover:text-orange-600'
                >
                  Privacy Policy
                </Link>
              </label>
            </div>
          </motion.div>
          {errors.terms && (
            <motion.span
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className='text-sm text-red-500'
            >
              {errors.terms}
            </motion.span>
          )}

          {/* Submit Button */}
          <motion.button
            variants={itemVariants}
            type='submit'
            disabled={loading}
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            className={`w-full py-3 px-4 bg-orange-500 text-white rounded-lg font-medium
              ${loading
                ? "opacity-70 cursor-not-allowed"
                : "hover:bg-orange-600"
              } 
              transition-all duration-200`}
          >
            {loading ? (
              <div className='flex items-center justify-center'>
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{
                    duration: 1,
                    repeat: Infinity,
                    ease: "linear",
                  }}
                  className='w-5 h-5 border-2 border-white border-t-transparent rounded-full'
                />
                <span className='ml-2'>Creating account...</span>
              </div>
            ) : (
              <span className='flex items-center justify-center'>
                Create Account <ArrowRight className='w-5 h-5 ml-2' />
              </span>
            )}
          </motion.button>

          {/* Social Registration */}
          <div className='relative my-8'>
            <div className='absolute inset-0 flex items-center'>
              <div className='w-full border-t border-gray-200' />
            </div>
            <div className='relative flex justify-center text-sm'>
              <span className='px-4 bg-white text-gray-500'>
                Or sign up with
              </span>
            </div>
          </div>

          <motion.div
            variants={itemVariants}
            className='grid grid-cols-1 gap-4'
          >
            <motion.button
              whileHover={{
                scale: 1.01,
                boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
              }}
              whileTap={{ scale: 0.99 }}
              type='button'
              className='flex items-center justify-center px-4 py-3 border border-gray-200 
                rounded-lg hover:bg-gray-50 transition-all duration-200'
            >
              <Facebook className='w-5 h-5 mr-2' />
              Continue with Facebook
            </motion.button>
          </motion.div>
        </motion.form>

        {/* Login Link */}
        <motion.p variants={itemVariants} className='text-center text-gray-600'>
          Already have an account?{" "}
          <Link
            href='/auth/login'
            className='text-orange-500 hover:text-orange-600 font-medium transition-colors'
          >
            Sign in
          </Link>
        </motion.p>
      </div>
    </AuthLayout>
  );
};

export default RegisterPage;
