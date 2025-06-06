<template>
  <div class="station-form-container">
    <!-- Header Section -->
    <div class="header-section">
      <div class="header-content">
        <v-btn
          variant="text"
          prepend-icon="mdi-arrow-left"
          @click="$router.go(-1)"
          class="back-btn"
        >
          <span class="btn-text">Back</span>
        </v-btn>
        
        <h1 class="page-title">
          {{ isEdit ? 'Edit Charging Station' : 'Add New Station' }}
        </h1>
        <p class="page-subtitle">
          {{ isEdit ? 'Update your charging station details' : 'Create a new charging station for your network' }}
        </p>
      </div>
    </div>

    <!-- Main Content -->
    <div class="form-content">
      <!-- Error Alert -->
      <v-alert
        v-if="error"
        type="error"
        variant="tonal"
        closable
        @click:close="clearError"
        class="error-alert"
      >
        {{ error }}
      </v-alert>

      <v-form ref="form" v-model="valid" @submit.prevent="submitForm">
        <!-- Basic Information Card -->
        <div class="form-card">
          <div class="card-header">
            <div class="header-icon-wrapper info-bg">
              <v-icon color="white" size="20">mdi-information-outline</v-icon>
            </div>
            <div class="header-text">
              <h2 class="card-title">Basic Information</h2>
              <p class="card-subtitle">Essential details about your charging station</p>
            </div>
          </div>
          
          <div class="form-fields">
            <v-text-field
              v-model="form.name"
              :rules="nameRules"
              label="Station Name"
              variant="outlined"
              required
              hide-details="auto"
              class="form-field"
              color="primary"
            >
              <template v-slot:prepend-inner>
                <v-icon size="18" class="field-icon">mdi-ev-station</v-icon>
              </template>
            </v-text-field>

            <v-textarea
              v-model="form.address"
              :rules="addressRules"
              label="Full Address"
              variant="outlined"
              rows="3"
              required
              hide-details="auto"
              class="form-field"
              color="primary"
            >
              <template v-slot:prepend-inner>
                <v-icon size="18" class="field-icon">mdi-map-marker-outline</v-icon>
              </template>
            </v-textarea>

            <div class="coordinates-section">
              <div class="coordinates-header">
                <h3 class="section-subtitle">Location Coordinates</h3>
                <v-btn
                  color="primary"
                  variant="elevated"
                  @click="getCurrentLocation"
                  :loading="gettingLocation"
                  class="location-btn"
                >
                  <v-icon start size="18">mdi-crosshairs-gps</v-icon>
                  <span class="btn-text">Use Current Location</span>
                </v-btn>
              </div>
              
              <div class="coordinates-grid">
                <v-text-field
                  v-model="form.latitude"
                  :rules="latitudeRules"
                  label="Latitude"
                  variant="outlined"
                  type="number"
                  step="any"
                  required
                  hide-details="auto"
                  class="form-field"
                  color="primary"
                >
                  <template v-slot:prepend-inner>
                    <v-icon size="18" class="field-icon">mdi-latitude</v-icon>
                  </template>
                </v-text-field>
                
                <v-text-field
                  v-model="form.longitude"
                  :rules="longitudeRules"
                  label="Longitude"
                  variant="outlined"
                  type="number"
                  step="any"
                  required
                  hide-details="auto"
                  class="form-field"
                  color="primary"
                >
                  <template v-slot:prepend-inner>
                    <v-icon size="18" class="field-icon">mdi-longitude</v-icon>
                  </template>
                </v-text-field>
              </div>
            </div>
          </div>
        </div>

        <!-- Technical Specifications Card -->
        <div class="form-card">
          <div class="card-header">
            <div class="header-icon-wrapper tech-bg">
              <v-icon color="white" size="20">mdi-lightning-bolt</v-icon>
            </div>
            <div class="header-text">
              <h2 class="card-title">Technical Specifications</h2>
              <p class="card-subtitle">Power output and connector details</p>
            </div>
          </div>
          
          <div class="form-fields">
            <div class="specs-grid">
              <v-text-field
                v-model="form.powerOutput"
                :rules="powerRules"
                label="Power Output (kW)"
                variant="outlined"
                type="number"
                min="1"
                required
                hide-details="auto"
                class="form-field"
                color="primary"
              >
                <template v-slot:prepend-inner>
                  <v-icon size="18" class="field-icon">mdi-lightning-bolt</v-icon>
                </template>
              </v-text-field>

              <v-select
                v-model="form.connectorType"
                :items="connectorTypes"
                :rules="connectorRules"
                label="Connector Type"
                variant="outlined"
                required
                hide-details="auto"
                class="form-field"
                color="primary"
              >
                <template v-slot:prepend-inner>
                  <v-icon size="18" class="field-icon">mdi-power-plug</v-icon>
                </template>
              </v-select>
            </div>

            <div class="specs-grid">
              <v-select
                v-model="form.status"
                :items="statusOptions"
                :rules="statusRules"
                label="Current Status"
                variant="outlined"
                required
                hide-details="auto"
                class="form-field"
                color="primary"
              >
                <template v-slot:prepend-inner>
                  <v-icon size="18" class="field-icon">mdi-check-circle</v-icon>
                </template>
              </v-select>

              <v-text-field
                v-model="form.pricing"
                label="Pricing ($/kWh)"
                variant="outlined"
                type="number"
                step="0.01"
                min="0"
                hide-details="auto"
                class="form-field"
                color="primary"
              >
                <template v-slot:prepend-inner>
                  <v-icon size="18" class="field-icon">mdi-currency-usd</v-icon>
                </template>
              </v-text-field>
            </div>
          </div>
        </div>

        <!-- Amenities Card -->
        <div class="form-card">
          <div class="card-header">
            <div class="header-icon-wrapper amenities-bg">
              <v-icon color="white" size="20">mdi-star</v-icon>
            </div>
            <div class="header-text">
              <h2 class="card-title">Amenities & Features</h2>
              <p class="card-subtitle">Additional services and facilities available</p>
            </div>
          </div>
          
          <div class="form-fields">
            <v-combobox
              v-model="form.amenities"
              :items="availableAmenities"
              label="Select or add amenities"
              variant="outlined"
              multiple
              chips
              closable-chips
              hide-details="auto"
              class="form-field"
              color="primary"
            >
              <template v-slot:prepend-inner>
                <v-icon size="18" class="field-icon">mdi-plus-circle</v-icon>
              </template>
              <template v-slot:chip="{ props, item }">
                <v-chip
                  v-bind="props"
                  class="amenity-chip"
                >
                  {{ item.title || item }}
                </v-chip>
              </template>
            </v-combobox>
            <p class="field-hint">Press Enter to add custom amenities</p>
          </div>
        </div>

        <!-- Map Preview Card -->
        <div class="form-card" v-if="form.latitude && form.longitude">
          <div class="card-header">
            <div class="header-icon-wrapper map-bg">
              <v-icon color="white" size="20">mdi-map</v-icon>
            </div>
            <div class="header-text">
              <h2 class="card-title">Location Preview</h2>
              <p class="card-subtitle">Visual confirmation of station location</p>
            </div>
          </div>
          
          <div class="map-container">
            <div id="form-map" class="map-element"></div>
          </div>
        </div>

        <!-- Action Buttons -->
        <div class="actions-section">
          <v-btn
            variant="outlined"
            @click="$router.go(-1)"
            :disabled="loading"
            class="action-btn cancel-btn"
          >
            <span class="btn-text">Cancel</span>
          </v-btn>
          <v-btn
            color="primary"
            variant="elevated"
            @click="submitForm"
            :loading="loading"
            :disabled="!valid || loading"
            class="action-btn submit-btn"
          >
            <span class="btn-text">{{ isEdit ? 'Update Station' : 'Create Station' }}</span>
          </v-btn>
        </div>
      </v-form>
    </div>

    <!-- Success Dialog -->
    <v-dialog v-model="successDialog" max-width="440" persistent>
      <v-card class="success-dialog">
        <v-card-text class="success-content">
          <div class="success-icon-wrapper">
            <v-icon size="48" color="white">mdi-check-circle</v-icon>
          </div>
          <h3 class="success-title">Success!</h3>
          <p class="success-message">
            {{ isEdit ? 'Station updated successfully!' : 'Station created successfully!' }}
          </p>
        </v-card-text>
        <v-card-actions class="success-actions">
          <v-btn
            color="primary"
            variant="elevated"
            @click="handleSuccess"
            class="success-btn"
          >
            <span class="btn-text">Continue</span>
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

// Fix for default markers in Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

export default {
  name: 'StationForm',
  data() {
    return {
      valid: false,
      gettingLocation: false,
      successDialog: false,
      map: null,
      marker: null,
      form: {
        name: '',
        address: '',
        latitude: null,
        longitude: null,
        powerOutput: null,
        connectorType: '',
        status: 'Active',
        pricing: null,
        amenities: []
      },
      nameRules: [
        v => !!v || 'Station name is required',
        v => v.length >= 3 || 'Name must be at least 3 characters'
      ],
      addressRules: [
        v => !!v || 'Address is required',
        v => v.length >= 10 || 'Address must be at least 10 characters'
      ],
      latitudeRules: [
        v => v !== null && v !== '' || 'Latitude is required',
        v => (v >= -90 && v <= 90) || 'Latitude must be between -90 and 90'
      ],
      longitudeRules: [
        v => v !== null && v !== '' || 'Longitude is required',
        v => (v >= -180 && v <= 180) || 'Longitude must be between -180 and 180'
      ],
      powerRules: [
        v => !!v || 'Power output is required',
        v => v > 0 || 'Power output must be greater than 0',
        v => v <= 1000 || 'Power output must be reasonable (≤ 1000 kW)'
      ],
      connectorRules: [
        v => !!v || 'Connector type is required'
      ],
      statusRules: [
        v => !!v || 'Status is required'
      ],
      connectorTypes: [
        { title: 'Type 1 (J1772)', value: 'Type 1' },
        { title: 'Type 2 (Mennekes)', value: 'Type 2' },
        { title: 'CHAdeMO', value: 'CHAdeMO' },
        { title: 'CCS (Combined Charging System)', value: 'CCS' },
        { title: 'Tesla Supercharger', value: 'Tesla' }
      ],
      statusOptions: [
        { title: 'Active', value: 'Active' },
        { title: 'Inactive', value: 'Inactive' },
        { title: 'Maintenance', value: 'Maintenance' }
      ],
      availableAmenities: [
        'WiFi',
        'Restrooms',
        'Food Court',
        'Shopping',
        'Parking',
        'Covered Parking',
        'Security Cameras',
        '24/7 Access',
        'Wheelchair Accessible',
        'Electric Vehicle Supply Equipment',
        'Payment Terminal',
        'Mobile App Support'
      ]
    };
  },
  computed: {
    ...mapGetters(['currentStation', 'loading', 'error']),
    
    isEdit() {
      return this.$route.name === 'EditStation';
    }
  },
  methods: {
    async getCurrentLocation() {
      if (!navigator.geolocation) {
        this.showSnackbar('Geolocation is not supported by this browser.');
        return;
      }

      this.gettingLocation = true;
      
      navigator.geolocation.getCurrentPosition(
        (position) => {
          this.form.latitude = position.coords.latitude;
          this.form.longitude = position.coords.longitude;
          this.gettingLocation = false;
          this.updateMap();
        },
        (error) => {
          console.error('Error getting location:', error);
          this.showSnackbar('Unable to get your location. Please enter coordinates manually.');
          this.gettingLocation = false;
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0
        }
      );
    },

    initMap() {
      if (this.form.latitude && this.form.longitude) {
        if (this.map) {
          this.map.remove();
          this.map = null;
        }
        this.map = L.map('form-map').setView([this.form.latitude, this.form.longitude], 15);
        
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '© OpenStreetMap contributors'
        }).addTo(this.map);
        
        this.updateMarker();
      }
    },

    updateMap() {
      if (this.map && this.form.latitude && this.form.longitude) {
        this.map.setView([this.form.latitude, this.form.longitude], 15);
        this.updateMarker();
      } else if (this.form.latitude && this.form.longitude) {
        this.$nextTick(() => {
          this.initMap();
        });
      }
    },

    updateMarker() {
      if (this.marker) {
        this.map.removeLayer(this.marker);
      }
      
      if (this.form.latitude && this.form.longitude) {
        const stationIcon = L.divIcon({
          html: `<div style="background: linear-gradient(135deg, #007aff 0%, #0056cc 100%); width: 32px; height: 32px; border-radius: 50%; display: flex; align-items: center; justify-content: center; color: white; font-weight: bold; border: 3px solid white; box-shadow: 0 4px 12px rgba(0, 122, 255, 0.3);">⚡</div>`,
          className: 'custom-div-icon',
          iconSize: [32, 32],
          iconAnchor: [16, 16]
        });
        
        this.marker = L.marker([this.form.latitude, this.form.longitude], { icon: stationIcon })
          .addTo(this.map)
          .bindPopup(this.form.name || 'New Charging Station');
      }
    },

    async submitForm() {
      if (this.$refs.form.validate()) {
        try {
          const stationData = {
            name: this.form.name,
            coordinates: [parseFloat(this.form.longitude), parseFloat(this.form.latitude)],
            address: this.form.address,
            status: this.form.status,
            powerOutput: parseFloat(this.form.powerOutput),
            connectorType: this.form.connectorType,
            amenities: this.form.amenities,
            pricing: this.form.pricing ? parseFloat(this.form.pricing) : 0
          };

          if (this.isEdit) {
            await this.$store.dispatch('updateStation', {
              stationId: this.$route.params.id,
              stationData
            });
          } else {
            await this.$store.dispatch('createStation', stationData);
          }

          // Refresh stations list after create or update
          await this.$store.dispatch('fetchStations');

          this.successDialog = true;
        } catch (error) {
          // Error is handled in the store
          console.error('Form submission error:', error);
        }
      }
    },

    handleSuccess() {
      this.successDialog = false;
      if (this.isEdit) {
        this.$router.push(`/stations/${this.$route.params.id}`);
      } else {
        this.$router.push('/stations');
      }
    },

    clearError() {
      this.$store.commit('CLEAR_ERROR');
    },

    loadStationData() {
      if (this.currentStation) {
        this.form = {
          name: this.currentStation.name,
          address: this.currentStation.location.address,
          latitude: this.currentStation.location.coordinates[1],
          longitude: this.currentStation.location.coordinates[0],
          powerOutput: this.currentStation.powerOutput,
          connectorType: this.currentStation.connectorType,
          status: this.currentStation.status,
          pricing: this.currentStation.pricing || null,
          amenities: this.currentStation.amenities || []
        };
      }
    },
    
    showSnackbar(text) {
      // You can implement a snackbar here if needed
      alert(text);
    }
  },

  async created() {
    if (this.isEdit) {
      const stationId = this.$route.params.id;
      await this.$store.dispatch('fetchStationById', stationId);
      this.loadStationData();
    }
  },

  mounted() {
    this.$nextTick(() => {
      if (this.form.latitude && this.form.longitude) {
        this.initMap();
      }
    });
  },

  watch: {
    'form.latitude': function() {
      this.updateMap();
    },
    'form.longitude': function() {
      this.updateMap();
    },
    'form.name': function() {
      if (this.marker) {
        this.marker.setPopupContent(this.form.name || 'New Charging Station');
      }
    },
    currentStation: {
      handler(newStation) {
        if (newStation && this.isEdit) {
          this.loadStationData();
          this.$nextTick(() => {
            this.updateMap();
          });
        }
      },
      immediate: true
    }
  },

  beforeUnmount() {
    if (this.map) {
      this.map.remove();
    }
  }
}
</script>

<style scoped>
/* Apple-inspired modern styling */
.station-form-container {
  min-height: 100vh;
  background: #f8f9fa;
  padding: 0;
}

/* Button Text Alignment Fix */
.btn-text {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  text-align: center;
}

/* Header Section */
.header-section {
  background: white;
  padding: 40px 48px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.04);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.04);
  margin-bottom: 48px;
}

.header-content {
  max-width: 800px;
  margin: 0 auto;
}

.back-btn {
  margin-bottom: 24px;
  border-radius: 12px !important;
  font-weight: 500 !important;
  text-transform: none !important;
  color: #007aff !important;
  display: flex !important;
  align-items: center !important;
  justify-content: center !important;
}

.page-title {
  font-size: 3rem;
  font-weight: 300;
  color: #1d1d1f;
  margin: 0 0 16px 0;
  letter-spacing: -1px;
  line-height: 1.1;
}

.page-subtitle {
  font-size: 1.25rem;
  color: #86868b;
  margin: 0;
  font-weight: 400;
  max-width: 600px;
}

/* Form Content */
.form-content {
  max-width: 800px;
  margin: 0 auto;
  padding: 0 48px 48px 48px;
}

/* Error Alert */
.error-alert {
  margin-bottom: 32px;
  border-radius: 16px !important;
}

/* Form Cards */
.form-card {
  background: white;
  border-radius: 20px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  border: 1px solid rgba(0, 0, 0, 0.04);
  padding: 32px;
  margin-bottom: 32px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.form-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.12);
}

.card-header {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 32px;
}

.header-icon-wrapper {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.info-bg { background: linear-gradient(135deg, #60a5fa, #3b82f6); }
.tech-bg { background: linear-gradient(135deg, #34d399, #10b981); }
.amenities-bg { background: linear-gradient(135deg, #a78bfa, #8b5cf6); }
.map-bg { background: linear-gradient(135deg, #fb7185, #f43f5e); }

.header-text {
  flex: 1;
}

.card-title {
  font-size: 1.5rem;
  font-weight: 600;
  color: #1d1d1f;
  margin: 0 0 8px 0;
}

.card-subtitle {
  font-size: 1rem;
  color: #86868b;
  margin: 0;
  line-height: 1.5;
}

/* Form Fields */
.form-fields {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.form-field {
  border-radius: 12px;
}

.form-field :deep(.v-field) {
  border-radius: 12px !important;
  background: #f8f9fa !important;
}

.field-icon {
  color: #86868b;
}

.field-hint {
  font-size: 0.875rem;
  color: #86868b;
  margin: -16px 0 0 0;
  padding-left: 12px;
}

/* Coordinates Section */
.coordinates-section {
  background: #f8f9fa;
  border-radius: 16px;
  padding: 24px;
  border: 1px solid #f1f5f9;
}

.coordinates-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.section-subtitle {
  font-size: 1.125rem;
  font-weight: 600;
  color: #1d1d1f;
  margin: 0;
}

.location-btn {
  background: #007aff !important;
  color: white !important;
  border-radius: 12px !important;
  padding: 0 20px !important;
  font-weight: 500 !important;
  text-transform: none !important;
  box-shadow: 0 4px 20px rgba(0, 122, 255, 0.3) !important;
  display: flex !important;
  align-items: center !important;
  justify-content: center !important;
}

.coordinates-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}

/* Specs Grid */
.specs-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}

/* Map Container */
.map-container {
  margin-top: 8px;
}

.map-element {
  height: 400px;
  border-radius: 16px;
  overflow: hidden;
  border: 1px solid #f1f5f9;
}

/* Actions Section */
.actions-section {
  display: flex;
  justify-content: flex-end;
  gap: 16px;
  margin-top: 48px;
}

.action-btn {
  border-radius: 12px !important;
  padding: 12px 32px !important;
  font-weight: 500 !important;
  text-transform: none !important;
  display: flex !important;
  align-items: center !important;
  justify-content: center !important;
}

.cancel-btn {
  color: #86868b !important;
}

.submit-btn {
  background: #007aff !important;
  color: white !important;
  box-shadow: 0 4px 20px rgba(0, 122, 255, 0.3) !important;
}

/* Success Dialog */
.success-dialog {
  border-radius: 20px !important;
  overflow: hidden;
}

.success-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 48px 32px 32px 32px;
  text-align: center;
}

.success-icon-wrapper {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: linear-gradient(135deg, #34d399, #10b981);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 24px;
}

.success-title {
  font-size: 1.5rem;
  font-weight: 600;
  color: #1d1d1f;
  margin: 0 0 12px 0;
}

.success-message {
  font-size: 1rem;
  color: #86868b;
  margin: 0;
  line-height: 1.5;
}

.success-actions {
  padding: 0 32px 32px 32px;
  display: flex;
  justify-content: center;
}

.success-btn {
  background: #007aff !important;
  color: white !important;
  border-radius: 12px !important;
  padding: 12px 32px !important;
  font-weight: 500 !important;
  text-transform: none !important;
  box-shadow: 0 4px 20px rgba(0, 122, 255, 0.3) !important;
  display: flex !important;
  align-items: center !important;
  justify-content: center !important;
}

/* Amenity Chips */
.amenity-chip {
  border-radius: 8px !important;
  background: #f8f9fa !important;
  border: 1px solid #e5e7eb !important;
  color: #1d1d1f !important;
  font-weight: 500 !important;
}

/* Custom Leaflet Icon */
.custom-div-icon {
  background: transparent !important;
  border: none !important;
}

/* Responsive */
@media (max-width: 1200px) {
  .header-section,
  .form-content {
    padding-left: 32px;
    padding-right: 32px;
  }
}

@media (max-width: 768px) {
  .header-section {
    padding: 32px 24px;
  }
  
  .form-content {
    padding: 0 24px 32px 24px;
  }
  
  .page-title {
    font-size: 2.5rem;
  }
  
  .form-card {
    padding: 24px;
  }
  
  .coordinates-grid,
  .specs-grid {
    grid-template-columns: 1fr;
  }
  
  .coordinates-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 16px;
  }
  
  .location-btn {
    width: 100%;
  }
  
  .actions-section {
    flex-direction: column-reverse;
  }
  
  .action-btn {
    width: 100%;
  }
}

@media (max-width: 480px) {
  .header-section {
    padding: 24px 16px;
  }
  
  .form-content {
    padding: 0 16px 24px 16px;
  }
  
  .page-title {
    font-size: 2rem;
  }
  
  .form-card {
    padding: 20px;
  }
  
  .card-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 16px;
  }
}
</style>
