import { useState, useEffect, lazy, Suspense } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import toast from "react-hot-toast";
const AnimatedBackground = lazy(() =>
  import("@crm/shared/components/AnimatedBackground")
);
import SecurityAlertModal from "@crm/shared/components/SecurityAlertModal";
import {
  updateFormData,
  setLoading,
  setErrors,
  clearErrors,
  loginSuccess,
  loginFailure,
  resetForm,
} from "@crm/shared/store/authSlice";
import apiAxios from "@crm/shared/api/ApiAxios";
import ApiRequest from "@crm/shared/api/ApiRequest";
import { useDarkModeState } from "@crm/shared/hooks/useDarkMode";

export default function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const { formData, loading, errors, isAuthenticated } = useSelector(
    (state) => state.auth
  );

  const [showPw, setShowPw] = useState(false);
  const [showSecurityAlert, setShowSecurityAlert] = useState(false);
  const [securityData, setSecurityData] = useState(null);

  const darkMode = useDarkModeState();

  const redirectPath = location.state?.from?.pathname
    ? `${location.state.from.pathname}${location.state.from.search || ""}${
        location.state.from.hash || ""
      }`
    : "/";


  useEffect(() => {
    if (isAuthenticated) {
      navigate(redirectPath, { replace: true });
    }
  }, [isAuthenticated, navigate, redirectPath]);

  const onChange = (e) => {
    const { name, value } = e.target;
    dispatch(updateFormData({ [name]: value }));
  };

  const validateForm = () => {
    const validationErrors = {};

    if (!formData.email.trim()) {
      validationErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      validationErrors.email = "Email format is invalid";
    }

    if (!formData.password.trim()) {
      validationErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      validationErrors.password = "Password must be at least 6 characters";
    }

    return validationErrors;
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    dispatch(clearErrors());

    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      dispatch(setErrors(validationErrors));
      return;
    }

    dispatch(setLoading(true));

    try {
      const payload = {
        email: formData.email.trim(),
        password: formData.password,
      };

      const response = await apiAxios.post(ApiRequest.auth.login, payload);

      if (response.data.ipSuccess === false) {
        dispatch(setLoading(false));
        // Show security alert modal
        setSecurityData({
          ip: response.data.ip,
          location: response.data.location,
          message: response.data.message,
        });
        setShowSecurityAlert(true);
        return;
      }

      if (response.data && response.data.user && response.data.token) {
        dispatch(
          loginSuccess({
            user: response.data.user,
            token: response.data.token,
            expiresAt: response.data.expires_at,
          })
        );

        toast.success("Login successful!");
        dispatch(resetForm());
      } else {
        throw new Error("Invalid response format");
      }
    } catch (error) {
      if (error.response?.data?.ipSuccess === false) {
        dispatch(setLoading(false));
        // Show security alert modal
        setSecurityData({
          ip: error.response.data.ip,
          location: error.response.data.location,
          message: error.response.data.message,
        });
        setShowSecurityAlert(true);
        return;
      }

      let errorMessage = "Login failed. Please try again.";

      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.response?.status === 401) {
        errorMessage = "Invalid email or password";
      } else if (error.response?.status === 422) {
        if (error.response.data?.errors) {
          const serverErrors = {};
          Object.keys(error.response.data.errors).forEach((key) => {
            serverErrors[key] = error.response.data.errors[key][0];
          });
          dispatch(setErrors(serverErrors));
          return;
        }
      } else if (error.code === "ECONNABORTED") {
        errorMessage = "Request timeout. Please try again.";
      } else if (!error.response) {
        errorMessage = "Network error. Please check your connection.";
      }

      dispatch(loginFailure(errorMessage));
      toast.error(errorMessage);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden p-6 bg-slate-100 transition-colors duration-300 dark:bg-slate-950">
      <div
        className="pointer-events-none absolute inset-0 bg-gradient-to-b from-white/70 via-white/20 to-white dark:from-slate-950/60 dark:via-slate-900/20 dark:to-slate-950"
        aria-hidden="true"
      />
      <div className="relative z-10 w-full max-w-6xl flex md:min-h-[600px] overflow-hidden rounded-3xl  bg-white shadow-2xl  dark:bg-slate-900">
        <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-black">
          <Suspense
            fallback={<div className="absolute inset-0 bg-slate-950" />}
          >
            <AnimatedBackground />
          </Suspense>
          <div
            className="pointer-events-none absolute inset-0 opacity-60"
            aria-hidden="true"
            style={{
              backgroundImage:
                "radial-gradient(circle at 20% 20%, rgba(255,255,255,0.10), transparent 45%), radial-gradient(circle at 80% 0%, rgba(59,130,246,0.3), transparent 50%)",
              mixBlendMode: "screen",
            }}
          />
          <div
            className="pointer-events-none absolute inset-0"
            aria-hidden="true"
            style={{
              backgroundImage:
                "linear-gradient(rgba(255,255,255,0.12) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.12) 1px, transparent 1px)",
              backgroundSize: "80px 80px",
              opacity: 0.15,
            }}
          />
          <div className="relative z-10 p-12 flex flex-col justify-between text-white">
            <div>
              <p className="text-sm font-medium tracking-wider opacity-80 mb-4 text-white">
                A WISE QUOTE
              </p>
            </div>

            <div>
              <h1 className="text-5xl font-bold leading-tight mb-6 text-white">
                Get
                <br />
                Everything
                <br />
                You Want
              </h1>
              <p className="text-lg opacity-90 leading-relaxed max-w-sm text-white">
                You can get everything you want if you work hard, trust the
                process, and stick to the plan.
              </p>
            </div>
          </div>
        </div>

        {/* Right Side - Login Form */}
        <div className="w-full lg:w-1/2 p-5 lg:p-16 flex flex-col justify-center bg-white dark:bg-slate-900">
          <div className="mb-8">
            <div className="flex justify-end mb-8">
              <div className="flex items-center space-x-2">
                <div className="size-6 bg-primary rounded-full flex items-center justify-center">
                  <span className="text-xs font-bold text-white">AL</span>
                </div>
                <span className="font-semibold text-gray-900 dark:text-slate-100">
                  Alpha
                </span>
              </div>
            </div>

            <h2 className="text-4xl font-bold text-gray-900 mb-2 dark:text-slate-100">
              Welcome Back
            </h2>
            <p className="text-gray-600 dark:text-slate-400">
              Enter your email and password to access your account
            </p>
          </div>

          {/* Form */}
          <form onSubmit={onSubmit} className="space-y-6">
            <div>
              <label>Email</label>
              <input
                name="email"
                type="email"
                className={`form-control py-3 ${
                  errors.email
                    ? "border-red-500 bg-red-50 dark:bg-red-500/10 dark:border-red-500/60"
                    : ""
                }`}
                placeholder="Enter your email"
                value={formData.email}
                onChange={onChange}
                disabled={loading}
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-300">
                  {errors.email}
                </p>
              )}
            </div>

            <div>
              <label>Password</label>
              <div className="relative">
                <input
                  name="password"
                  type={showPw ? "text" : "password"}
                  className={`form-control py-3 pr-12 ${
                    errors.password
                      ? "border-red-500 bg-red-50 dark:bg-red-500/10 dark:border-red-500/60"
                      : ""
                  }`}
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={onChange}
                  disabled={loading}
                />
                <button
                  type="button"
                  onClick={() => setShowPw(!showPw)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 dark:text-slate-500 dark:hover:text-slate-300"
                  disabled={loading}
                >
                  {showPw ? (
                    <svg
                      className="size-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21"
                      />
                    </svg>
                  ) : (
                    <svg
                      className="size-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                      />
                    </svg>
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-300">
                  {errors.password}
                </p>
              )}
            </div>

            {/* <div className="flex items-center justify-end">
              <a
                href="#"
                className="text-sm text-gray-900 hover:text-gray-700 dark:text-slate-100 dark:hover:text-slate-300"
              >
                Forgot Password
              </a>
            </div> */}

            {/* {errors.server && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-xl dark:border-red-500/60 dark:bg-red-500/10">
                <p className="text-sm text-red-600 dark:text-red-300">
                  {errors.server}
                </p>
              </div>
            )} */}

            <button
              type="submit"
              disabled={loading}
              className={`w-full btn btn-primary md:py-3 md:text-lg uppercase tracking-wide shadow-sm transition-colors ${
                loading
                  ? "bg-primary/40 cursor-not-allowed"
                  : "bg-primary/90 hover:bg-primary/80"
              }`}
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <svg
                    className="animate-spin -ml-1 mr-3 size-5 text-white"
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
                  Signing in...
                </div>
              ) : (
                "Sign In"
              )}
            </button>
          </form>
        </div>
      </div>

      {/* Security Alert Modal */}
      <SecurityAlertModal
        open={showSecurityAlert}
        onClose={() => setShowSecurityAlert(false)}
        data={securityData}
      />
    </div>
  );
}
