<template>
  <v-container fluid class="auth-container">
    <v-row align="center" justify="center" class="min-height-100vh">
      <v-col cols="12" sm="8" md="6" lg="4">
        
        <!-- Header -->
        <div class="auth-header">
          <h1 class="auth-title">Sign In</h1>
          <p class="auth-subtitle">Welcome back! Please sign in to your account</p>
        </div>

        <!-- Main Card -->
        <v-card class="auth-card" elevation="2">
          <v-card-text class="pa-8">
            
            <!-- Error Alert -->
            <v-alert
              v-if="error"
              type="error"
              variant="tonal"
              class="mb-6"
              closable
              @click:close="clearError"
            >
              {{ error }}
            </v-alert>
            
            <!-- Login Form -->
            <v-form ref="form" v-model="valid" @submit.prevent="login">
              
              <!-- Email Field -->
              <div class="form-field">
                <v-text-field
                  v-model="email"
                  :rules="emailRules"
                  label="Email"
                  type="email"
                  variant="outlined"
                  density="comfortable"
                  hide-details="auto"
                  class="mb-4"
                  prepend-inner-icon="mdi-email-outline"
                  required
                ></v-text-field>
              </div>
              
              <!-- Password Field -->
              <div class="form-field">
                <v-text-field
                  v-model="password"
                  :rules="passwordRules"
                  label="Password"
                  :type="showPassword ? 'text' : 'password'"
                  variant="outlined"
                  density="comfortable"
                  hide-details="auto"
                  class="mb-4"
                  prepend-inner-icon="mdi-lock-outline"
                  :append-inner-icon="showPassword ? 'mdi-eye-off' : 'mdi-eye'"
                  @click:append-inner="showPassword = !showPassword"
                  required
                ></v-text-field>
              </div>

              <!-- Forgot Password -->
              <div class="text-right mb-6">
                <a href="#" class="forgot-password">Forgot Password?</a>
              </div>

              <!-- Login Button -->
              <v-btn
                color="primary"
                size="large"
                block
                :loading="loading"
                :disabled="!valid || loading"
                @click="login"
                class="mb-6 login-btn"
              >
                Sign In
              </v-btn>

            </v-form>

            <!-- Register Link -->
            <div class="text-center">
              <span class="text-body-2 text-grey-darken-1">Don't have an account?</span>
              <router-link to="/register" class="register-link ml-1">Sign Up</router-link>
            </div>

          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  name: 'LoginView',
  data() {
    return {
      valid: false,
      email: '',
      password: '',
      showPassword: false,
      emailRules: [
        v => !!v || 'Email is required',
        v => /.+@.+\..+/.test(v) || 'Email must be valid'
      ],
      passwordRules: [
        v => !!v || 'Password is required',
        v => v.length >= 6 || 'Password must be at least 6 characters'
      ]
    };
  },
  computed: {
    ...mapGetters(['error', 'loading'])
  },
  methods: {
    async login() {
      if (this.$refs.form.validate()) {
        try {
          await this.$store.dispatch('login', {
            email: this.email,
            password: this.password
          });
          this.$router.push('/dashboard');
        } catch (error) {
          // Error is handled in the store
        }
      }
    },
    clearError() {
      this.$store.commit('CLEAR_ERROR');
    }
  }
}
</script>

<style scoped>
/* Container */
.auth-container {
  background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
  min-height: 100vh;
}

.min-height-100vh {
  min-height: 100vh;
}

/* Header */
.auth-header {
  text-align: center;
  margin-bottom: 32px;
}

.auth-title {
  font-size: 2rem;
  font-weight: 600;
  color: #1e293b;
  margin-bottom: 8px;
  letter-spacing: -0.025em;
}

.auth-subtitle {
  font-size: 1rem;
  color: #64748b;
  margin: 0;
  line-height: 1.5;
}

/* Card */
.auth-card {
  background: white;
  border-radius: 16px;
  border: 1px solid #e2e8f0;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
}

/* Form */
.form-field {
  margin-bottom: 16px;
}

.form-field :deep(.v-field) {
  border-radius: 8px;
}

.form-field :deep(.v-field--focused) {
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

/* Forgot Password */
.forgot-password {
  color: #3b82f6;
  text-decoration: none;
  font-size: 0.875rem;
  font-weight: 500;
  transition: color 0.2s ease;
}

.forgot-password:hover {
  color: #2563eb;
  text-decoration: underline;
}

/* Login Button */
.login-btn {
  height: 48px !important;
  border-radius: 8px !important;
  font-weight: 600 !important;
  text-transform: none !important;
  letter-spacing: 0.025em !important;
}

/* Register Link */
.register-link {
  color: #3b82f6;
  text-decoration: none;
  font-weight: 500;
  transition: color 0.2s ease;
}

.register-link:hover {
  color: #2563eb;
  text-decoration: underline;
}

/* Responsive */
@media (max-width: 600px) {
  .auth-card :deep(.v-card-text) {
    padding: 24px !important;
  }
  
  .auth-title {
    font-size: 1.75rem;
  }
  
  .auth-subtitle {
    font-size: 0.875rem;
  }
}

@media (max-width: 480px) {
  .auth-card :deep(.v-card-text) {
    padding: 20px !important;
  }
  
  .auth-header {
    margin-bottom: 24px;
  }
  
  .login-btn {
    height: 44px !important;
  }
}
</style>