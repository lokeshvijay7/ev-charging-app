<template>
  <v-container fluid class="auth-container">
    <v-row align="center" justify="center" class="min-height-100vh">
      <v-col cols="12" sm="8" md="6" lg="4">
        
        <!-- Header -->
        <div class="auth-header">
          <h1 class="auth-title">Create Account</h1>
          <p class="auth-subtitle">Sign up to get started with your account</p>
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
            
            <!-- Register Form -->
            <v-form ref="form" v-model="valid" @submit.prevent="register">
              
              <!-- Name Field -->
              <div class="form-field">
                <v-text-field
                  v-model="name"
                  :rules="nameRules"
                  label="Full Name"
                  variant="outlined"
                  density="comfortable"
                  hide-details="auto"
                  class="mb-4"
                  prepend-inner-icon="mdi-account-outline"
                  required
                ></v-text-field>
              </div>

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

              <!-- Confirm Password Field -->
              <div class="form-field">
                <v-text-field
                  v-model="confirmPassword"
                  :rules="confirmPasswordRules"
                  label="Confirm Password"
                  :type="showPassword ? 'text' : 'password'"
                  variant="outlined"
                  density="comfortable"
                  hide-details="auto"
                  class="mb-4"
                  prepend-inner-icon="mdi-lock-check-outline"
                  required
                ></v-text-field>
              </div>

              <!-- Terms and Conditions -->
              <div class="mb-6">
                <v-checkbox
                  v-model="acceptTerms"
                  :rules="[v => !!v || 'You must accept the terms and conditions']"
                  hide-details="auto"
                  density="compact"
                  class="terms-checkbox"
                >
                  <template v-slot:label>
                    <span class="text-body-2">
                      I agree to the 
                      <a href="#" class="terms-link">Terms of Service</a> 
                      and 
                      <a href="#" class="terms-link">Privacy Policy</a>
                    </span>
                  </template>
                </v-checkbox>
              </div>

              <!-- Register Button -->
              <v-btn
                color="primary"
                size="large"
                block
                :loading="loading"
                :disabled="!valid || loading || !acceptTerms"
                @click="register"
                class="mb-6 register-btn"
              >
                Create Account
              </v-btn>

            </v-form>

            <!-- Login Link -->
            <div class="text-center">
              <span class="text-body-2 text-grey-darken-1">Already have an account?</span>
              <router-link to="/login" class="login-link ml-1">Sign In</router-link>
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
  name: 'RegisterView',
  data() {
    return {
      valid: false,
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
      showPassword: false,
      acceptTerms: false,
      nameRules: [
        v => !!v || 'Name is required',
        v => v.length >= 2 || 'Name must be at least 2 characters'
      ],
      emailRules: [
        v => !!v || 'Email is required',
        v => /.+@.+\..+/.test(v) || 'Email must be valid'
      ],
      passwordRules: [
        v => !!v || 'Password is required',
        v => v.length >= 6 || 'Password must be at least 6 characters'
      ],
      confirmPasswordRules: [
        v => !!v || 'Confirm password is required',
        v => v === this.password || 'Passwords do not match'
      ]
    };
  },
  computed: {
    ...mapGetters(['error', 'loading'])
  },
  methods: {
    async register() {
      if (this.$refs.form.validate() && this.acceptTerms) {
        try {
          await this.$store.dispatch('register', {
            name: this.name,
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

/* Terms Checkbox */
.terms-checkbox :deep(.v-selection-control) {
  align-items: flex-start;
}

.terms-link {
  color: #3b82f6;
  text-decoration: none;
  font-weight: 500;
  transition: color 0.2s ease;
}

.terms-link:hover {
  color: #2563eb;
  text-decoration: underline;
}

/* Register Button */
.register-btn {
  height: 48px !important;
  border-radius: 8px !important;
  font-weight: 600 !important;
  text-transform: none !important;
  letter-spacing: 0.025em !important;
}

/* Login Link */
.login-link {
  color: #3b82f6;
  text-decoration: none;
  font-weight: 500;
  transition: color 0.2s ease;
}

.login-link:hover {
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
  
  .register-btn {
    height: 44px !important;
  }
}
</style>