import { importShared } from './__federation_fn_import-BFo6b6m_.js';
import { a as apiAxios } from './ApiAxios-BgIYsQIb.js';

const {createSlice,createAsyncThunk} = await importShared('@reduxjs/toolkit');

const initialState = {
  user: null,
  token: null,
  expiresAt: null,
  isAuthenticated: false,
  loading: false,
  isInitialized: false,
  errors: {
    email: "",
    password: "",
    server: "",
  },
  formData: {
    email: "",
    password: "",
  },
};

const isSessionExpired = (expiresAt) => {
  if (!expiresAt) return false;
  return new Date(expiresAt).getTime() <= Date.now();
};

const verifySession = createAsyncThunk(
  "auth/verifySession",
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("authToken");
      const userData = localStorage.getItem("userData");
      const expiresAt = localStorage.getItem("sessionExpiresAt");

      if (!token || !userData) {
        return rejectWithValue("No session found");
      }

      if (isSessionExpired(expiresAt)) {
        localStorage.removeItem("authToken");
        localStorage.removeItem("userData");
        localStorage.removeItem("sessionExpiresAt");
        return rejectWithValue("Session expired");
      }

      const response = await apiAxios.get("/profile");

      return {
        token,
        user: JSON.parse(userData),
        expiresAt,
      };
    } catch (error) {
      localStorage.removeItem("authToken");
      localStorage.removeItem("userData");
      localStorage.removeItem("sessionExpiresAt");
      return rejectWithValue("Session expired or invalid");
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    // Form data update
    updateFormData: (state, action) => {
      state.formData = {
        ...state.formData,
        ...action.payload,
      };
      if (action.payload.email !== undefined) {
        state.errors.email = "";
      }
      if (action.payload.password !== undefined) {
        state.errors.password = "";
      }
    },

    // Set loading state
    setLoading: (state, action) => {
      state.loading = action.payload;
    },

    // Set validation errors
    setErrors: (state, action) => {
      state.errors = {
        ...state.errors,
        ...action.payload,
      };
    },

    // Clear all errors
    clearErrors: (state) => {
      state.errors = {
        email: "",
        password: "",
        server: "",
      };
    },

    // Login success -
    loginSuccess: (state, action) => {
      const { user, token, expiresAt } = action.payload;

      const normalizedUser = {
        ...user,
        unit_ids: user.unit_ids || user.unitIds || [],
        team_ids: user.team_ids || user.teamIds || [],
        brand_ids: user.brand_ids || user.brandIds || [],
        unitIds: user.unit_ids || user.unitIds || [],
        teamIds: user.team_ids || user.teamIds || [],
        brandIds: user.brand_ids || user.brandIds || [],
      };

      state.user = normalizedUser;
      state.token = token;
      state.expiresAt = expiresAt;
      state.isAuthenticated = true;
      state.isInitialized = true;
      state.loading = false;
      state.errors = initialState.errors;

      // Store in localStorage
      localStorage.setItem("authToken", token);
      localStorage.setItem("userData", JSON.stringify(normalizedUser));
      localStorage.setItem("sessionExpiresAt", expiresAt);
    },

    // Login failure
    loginFailure: (state, action) => {
      state.loading = false;
      state.errors.server = action.payload;
      state.isAuthenticated = false;
      state.user = null;
      state.token = null;
      state.expiresAt = null;
      state.isInitialized = true;
    },

    // Logout
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.expiresAt = null;
      state.isAuthenticated = false;
      state.loading = false;
      state.errors = initialState.errors;
      state.formData = initialState.formData;
      state.isInitialized = true;

      // Clear localStorage
      localStorage.removeItem("authToken");
      localStorage.removeItem("userData");
      localStorage.removeItem("sessionExpiresAt");
    },

    // Initialize auth from localStorage
    initializeAuth: (state) => {
      const token = localStorage.getItem("authToken");
      const userData = localStorage.getItem("userData");
      const expiresAt = localStorage.getItem("sessionExpiresAt");

      if (token && userData) {
        if (isSessionExpired(expiresAt)) {
          localStorage.removeItem("authToken");
          localStorage.removeItem("userData");
          localStorage.removeItem("sessionExpiresAt");
          state.isInitialized = true;
          return;
        }

        try {
          state.token = token;
          state.user = JSON.parse(userData);
          state.expiresAt = expiresAt;
          state.isAuthenticated = true;
        } catch (error) {
          // If parsing fails, clear invalid data
          localStorage.removeItem("authToken");
          localStorage.removeItem("userData");
          localStorage.removeItem("sessionExpiresAt");
        }
      }
      state.isInitialized = true;
    },

    // Reset form
    resetForm: (state) => {
      state.formData = initialState.formData;
      state.errors = initialState.errors;
    },

    // Set auth user
    setAuth: (state, action) => {
      const user = action.payload.user;

      const normalizedUser = {
        ...user,
        unit_ids: user.unit_ids || user.unitIds || [],
        team_ids: user.team_ids || user.teamIds || [],
        brand_ids: user.brand_ids || user.brandIds || [],
        unitIds: user.unit_ids || user.unitIds || [],
        teamIds: user.team_ids || user.teamIds || [],
        brandIds: user.brand_ids || user.brandIds || [],
      };

      state.user = normalizedUser;
      localStorage.setItem("userData", JSON.stringify(normalizedUser));
    },

    updateSessionExpiry: (state, action) => {
      state.expiresAt = action.payload;
      localStorage.setItem("sessionExpiresAt", action.payload);
    },
  },
  extraReducers: (builder) => {
    builder
      // Verify session pending
      .addCase(verifySession.pending, (state) => {
        state.loading = true;
        state.isInitialized = false;
      })
      // Verify session fulfilled -
      .addCase(verifySession.fulfilled, (state, action) => {
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.expiresAt = action.payload.expiresAt;
        state.isAuthenticated = true;
        state.loading = false;
        state.isInitialized = true;
      })
      // Verify session rejected (session invalid or expired)
      .addCase(verifySession.rejected, (state) => {
        state.user = null;
        state.token = null;
        state.expiresAt = null;
        state.isAuthenticated = false;
        state.loading = false;
        state.isInitialized = true;
      });
  },
});

const {
  updateFormData,
  setLoading,
  setErrors,
  clearErrors,
  loginSuccess,
  loginFailure,
  logout,
  initializeAuth,
  resetForm,
  setAuth,
  updateSessionExpiry,
} = authSlice.actions;

const authReducer = authSlice.reducer;

export { authReducer as a };
