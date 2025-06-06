<template>
  <div class="station-map-container">
    <!-- Simplified Top Controls -->
    <div class="top-controls">
      <div class="controls-wrapper">
        <!-- Search Bar -->
        <div class="search-section">
          <v-text-field
            v-model="search"
            prepend-inner-icon="mdi-magnify"
            label="Search stations..."
            variant="solo-filled"
            flat
            density="comfortable"
            hide-details
            @input="searchStations"
            class="search-input"
          ></v-text-field>
        </div>

        <!-- Quick Filters -->
        <div class="quick-filters">
          <v-select
            v-model="filters.status"
            :items="statusOptions"
            label="Status"
            variant="solo-filled"
            flat
            density="comfortable"
            hide-details
            clearable
            @update:model-value="applyFilters"
            class="filter-select"
          ></v-select>
          
          <v-select
            v-model="filters.connectorType"
            :items="connectorOptions"
            label="Connector"
            variant="solo-filled"
            flat
            density="comfortable"
            hide-details
            clearable
            @update:model-value="applyFilters"
            class="filter-select"
          ></v-select>
        </div>

        <!-- Action Buttons -->
        <div class="action-buttons">
          <v-btn
            @click="getCurrentLocation"
            :loading="gettingLocation"
            prepend-icon="mdi-crosshairs-gps"
            variant="elevated"
            class="action-btn location-btn"
          >
            <span class="btn-text">My Location</span>
          </v-btn>
          
          <v-btn
            @click="toggleClustering"
            :color="clustering ? 'primary' : 'default'"
            :variant="clustering ? 'elevated' : 'outlined'"
            prepend-icon="mdi-group"
            class="action-btn"
          >
            <span class="btn-text">{{ clustering ? 'Clustered' : 'Individual' }}</span>
          </v-btn>
          
          <v-btn
            @click="resetFilters"
            prepend-icon="mdi-refresh"
            variant="outlined"
            class="action-btn"
          >
            <span class="btn-text">Reset</span>
          </v-btn>
        </div>
      </div>
    </div>

    <!-- Map Container -->
    <div class="map-wrapper" @wheel.stop @touchmove.stop>
      <div id="stations-map" class="map-element"></div>
      
      <!-- Compact Legend -->
      <div class="map-legend">
        <div class="legend-header">
          <h4 class="legend-title">Legend</h4>
          <span class="total-count">{{ filteredStations.length }} stations</span>
        </div>
        <div class="legend-items">
          <div class="legend-item">
            <div class="legend-marker active"></div>
            <span class="legend-text">Active ({{ activeCount }})</span>
          </div>
          <div class="legend-item">
            <div class="legend-marker inactive"></div>
            <span class="legend-text">Inactive ({{ inactiveCount }})</span>
          </div>
          <div class="legend-item">
            <div class="legend-marker maintenance"></div>
            <span class="legend-text">Maintenance ({{ maintenanceCount }})</span>
          </div>
          <div class="legend-item">
            <div class="legend-marker user-location"></div>
            <span class="legend-text">Your Location</span>
          </div>
        </div>
      </div>

      <!-- Station Info Panel -->
      <v-navigation-drawer
        v-model="showStationInfo"
        location="right"
        temporary
        width="400"
        class="station-info-panel"
      >
        <div v-if="selectedStation" class="station-info-content">
          <div class="station-info-header">
            <h3 class="station-info-title">{{ selectedStation.name }}</h3>
            <v-btn
              icon
              variant="text"
              @click="showStationInfo = false"
              class="close-btn"
            >
              <v-icon>mdi-close</v-icon>
            </v-btn>
          </div>
          
          <div class="station-info-body">
            <div class="station-status-section">
              <v-chip
                :color="getStatusColor(selectedStation.status)"
                size="small"
                class="status-chip"
              >
                {{ selectedStation.status }}
              </v-chip>
            </div>
            
            <div class="station-details">
              <div class="detail-item">
                <v-icon class="detail-icon">mdi-map-marker</v-icon>
                <span class="detail-text">{{ selectedStation.location.address }}</span>
              </div>
              
              <div class="detail-item">
                <v-icon class="detail-icon">mdi-lightning-bolt</v-icon>
                <span class="detail-text">{{ selectedStation.powerOutput }} kW</span>
              </div>
              
              <div class="detail-item">
                <v-icon class="detail-icon">mdi-power-plug</v-icon>
                <span class="detail-text">{{ selectedStation.connectorType }}</span>
              </div>
              
              <div v-if="selectedStation.pricing" class="detail-item">
                <v-icon class="detail-icon">mdi-currency-usd</v-icon>
                <span class="detail-text">${{ selectedStation.pricing }}/kWh</span>
              </div>
            </div>
            
            <div v-if="selectedStation.amenities && selectedStation.amenities.length > 0" class="amenities-section">
              <h4 class="amenities-title">Amenities</h4>
              <div class="amenities-chips">
                <v-chip
                  v-for="amenity in selectedStation.amenities"
                  :key="amenity"
                  size="small"
                  variant="outlined"
                  class="amenity-chip"
                >
                  {{ amenity }}
                </v-chip>
              </div>
            </div>
            
            <div class="station-actions">
              <v-btn
                color="primary"
                variant="elevated"
                prepend-icon="mdi-directions"
                @click="getDirections"
                class="station-action-btn primary-btn"
              >
                <span class="btn-text">Get Directions</span>
              </v-btn>
              
              <v-btn
                color="primary"
                variant="outlined"
                prepend-icon="mdi-eye"
                :to="`/stations/${selectedStation._id}`"
                class="station-action-btn"
              >
                <span class="btn-text">View Details</span>
              </v-btn>
              
              <v-btn
                variant="text"
                prepend-icon="mdi-share"
                @click="shareStation"
                class="station-action-btn"
              >
                <span class="btn-text">Share Station</span>
              </v-btn>
            </div>
          </div>
        </div>
      </v-navigation-drawer>
    </div>

    <!-- Loading Overlay -->
    <v-overlay v-model="loading" class="loading-overlay">
      <div class="loading-content">
        <v-progress-circular
          indeterminate
          size="64"
          color="primary"
        ></v-progress-circular>
        <p class="loading-text">Loading stations...</p>
      </div>
    </v-overlay>

    <!-- Snackbar for notifications -->
    <v-snackbar
      v-model="snackbar"
      :color="snackbarColor"
      timeout="3000"
      class="notification-snackbar"
    >
      {{ snackbarText }}
      <template v-slot:actions>
        <v-btn
          color="white"
          variant="text"
          @click="snackbar = false"
        >
          Close
        </v-btn>
      </template>
    </v-snackbar>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet.markercluster/dist/MarkerCluster.css';
import 'leaflet.markercluster/dist/MarkerCluster.Default.css';
import 'leaflet.markercluster';

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
  name: 'StationMap',
  data() {
    return {
      map: null,
      markers: [],
      markerClusterGroup: null,
      userLocationMarker: null,
      selectedStation: null,
      showStationInfo: false,
      clustering: true,
      gettingLocation: false,
      search: '',
      filters: {
        status: null,
        connectorType: null,
        minPower: null,
        maxPower: null
      },
      statusOptions: ['Active', 'Inactive', 'Maintenance'],
      connectorOptions: ['Type 1', 'Type 2', 'CHAdeMO', 'CCS', 'Tesla'],
      snackbar: false,
      snackbarText: '',
      snackbarColor: 'success'
    };
  },
  computed: {
    ...mapGetters(['stations', 'loading']),
    
    filteredStations() {
      let result = [...this.stations];
      
      if (this.search) {
        const searchLower = this.search.toLowerCase();
        result = result.filter(station => 
          station.name.toLowerCase().includes(searchLower) ||
          station.location.address.toLowerCase().includes(searchLower)
        );
      }
      
      return result;
    },
    
    activeCount() {
      return this.filteredStations.filter(s => s.status === 'Active').length;
    },
    
    inactiveCount() {
      return this.filteredStations.filter(s => s.status === 'Inactive').length;
    },
    
    maintenanceCount() {
      return this.filteredStations.filter(s => s.status === 'Maintenance').length;
    }
  },
  methods: {
    initMap() {
      // Initialize map centered on a default location
      this.map = L.map('stations-map', {
        scrollWheelZoom: true,
        doubleClickZoom: true,
        touchZoom: true,
        zoomControl: true
      }).setView([37.7749, -122.4194], 10);
      
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors',
        maxZoom: 19
      }).addTo(this.map);
      
      // Initialize marker cluster group
      this.markerClusterGroup = L.markerClusterGroup({
        chunkedLoading: true,
        spiderfyOnMaxZoom: false,
        showCoverageOnHover: false,
        zoomToBoundsOnClick: true
      });
      
      if (this.clustering) {
        this.map.addLayer(this.markerClusterGroup);
      }
      
      // Try to get user's location
      this.getCurrentLocation();
    },
    
    createStationMarker(station) {
      const [lng, lat] = station.location.coordinates;
      
      // Create custom icon based on status
      const iconHtml = `
        <div style="
          background-color: ${this.getStatusHexColor(station.status)};
          width: 30px;
          height: 30px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-weight: bold;
          border: 3px solid white;
          box-shadow: 0 2px 4px rgba(0,0,0,0.3);
          font-size: 14px;
        ">⚡</div>
      `;
      
      const customIcon = L.divIcon({
        html: iconHtml,
        className: 'custom-station-icon',
        iconSize: [30, 30],
        iconAnchor: [15, 15],
        popupAnchor: [0, -15]
      });
      
      const marker = L.marker([lat, lng], { icon: customIcon });
      
      // Create popup content
      const popupContent = `
        <div style="min-width: 200px;">
          <h4 style="margin: 0 0 8px 0; color: #1976D2;">${station.name}</h4>
          <p style="margin: 4px 0; font-size: 12px;">
            <strong>Status:</strong> 
            <span style="color: ${this.getStatusHexColor(station.status)};">${station.status}</span>
          </p>
          <p style="margin: 4px 0; font-size: 12px;">
            <strong>Power:</strong> ${station.powerOutput} kW
          </p>
          <p style="margin: 4px 0; font-size: 12px;">
            <strong>Connector:</strong> ${station.connectorType}
          </p>
          <p style="margin: 4px 0 8px 0; font-size: 12px;">
            <strong>Address:</strong> ${station.location.address}
          </p>
          <button 
            onclick="window.stationMapComponent.showStationDetails('${station._id}')"
            style="
              background: #1976D2;
              color: white;
              border: none;
              padding: 6px 12px;
              border-radius: 4px;
              cursor: pointer;
              font-size: 12px;
              margin-right: 8px;
            "
          >
            View Details
          </button>
          <button 
            onclick="window.stationMapComponent.getDirectionsToStation('${station._id}')"
            style="
              background: #4CAF50;
              color: white;
              border: none;
              padding: 6px 12px;
              border-radius: 4px;
              cursor: pointer;
              font-size: 12px;
            "
          >
            Directions
          </button>
        </div>
      `;
      
      marker.bindPopup(popupContent);
      
      // Store station data with marker
      marker.stationData = station;
      
      return marker;
    },
    
    updateMarkers() {
      // Clear existing markers
      this.clearMarkers();
      
      // Create new markers for filtered stations
      this.markers = this.filteredStations.map(station => {
        return this.createStationMarker(station);
      });
      
      // Add markers to map
      if (this.clustering) {
        this.markerClusterGroup.addLayers(this.markers);
      } else {
        this.markers.forEach(marker => {
          marker.addTo(this.map);
        });
      }
      
      // Fit map to show all markers
      if (this.markers.length > 0) {
        const group = new L.featureGroup(this.markers);
        this.map.fitBounds(group.getBounds().pad(0.1));
      }
    },
    
    clearMarkers() {
      if (this.clustering) {
        this.markerClusterGroup.clearLayers();
      } else {
        this.markers.forEach(marker => {
          this.map.removeLayer(marker);
        });
      }
      this.markers = [];
    },
    
    toggleClustering() {
      this.clustering = !this.clustering;
      
      if (this.clustering) {
        // Remove individual markers and add cluster group
        this.markers.forEach(marker => {
          this.map.removeLayer(marker);
        });
        this.map.addLayer(this.markerClusterGroup);
        this.markerClusterGroup.addLayers(this.markers);
      } else {
        // Remove cluster group and add individual markers
        this.map.removeLayer(this.markerClusterGroup);
        this.markerClusterGroup.clearLayers();
        this.markers.forEach(marker => {
          marker.addTo(this.map);
        });
      }
    },
    
    getCurrentLocation() {
      if (!navigator.geolocation) {
        this.showSnackbar('Geolocation is not supported by this browser.', 'error');
        return;
      }
      
      this.gettingLocation = true;
      
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;
          
          // Remove existing user location marker
          if (this.userLocationMarker) {
            this.map.removeLayer(this.userLocationMarker);
          }
          
          // Create user location marker
          const userIcon = L.divIcon({
            html: `
              <div style="
                background-color: #FF5722;
                width: 20px;
                height: 20px;
                border-radius: 50%;
                border: 3px solid white;
                box-shadow: 0 2px 4px rgba(0,0,0,0.3);
              "></div>
            `,
            className: 'user-location-icon',
            iconSize: [20, 20],
            iconAnchor: [10, 10]
          });
          
          this.userLocationMarker = L.marker([lat, lng], { icon: userIcon })
            .addTo(this.map)
            .bindPopup('Your Location');
          
          // Center map on user location
          this.map.setView([lat, lng], 12);
          
          this.gettingLocation = false;
          this.showSnackbar('Location found!', 'success');
        },
        (error) => {
          console.error('Error getting location:', error);
          this.gettingLocation = false;
          this.showSnackbar('Unable to get your location.', 'error');
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0
        }
      );
    },
    
    searchStations() {
      // Debounce search
      clearTimeout(this.searchTimeout);
      this.searchTimeout = setTimeout(() => {
        this.updateMarkers();
      }, 300);
    },
    
    applyFilters() {
      this.$store.dispatch('fetchStations', this.filters).then(() => {
        this.updateMarkers();
      });
    },
    
    resetFilters() {
      this.search = '';
      this.filters = {
        status: null,
        connectorType: null,
        minPower: null,
        maxPower: null
      };
      this.applyFilters();
    },
    
    showStationDetails(stationId) {
      const station = this.stations.find(s => s._id === stationId);
      if (station) {
        this.selectedStation = station;
        this.showStationInfo = true;
      }
    },
    
    getDirectionsToStation(stationId) {
      const station = this.stations.find(s => s._id === stationId);
      if (station) {
        this.getDirections(station);
      }
    },
    
    getDirections(station = this.selectedStation) {
      if (station) {
        const [lng, lat] = station.location.coordinates;
        const url = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;
        window.open(url, '_blank');
      }
    },
    
    shareStation() {
      if (this.selectedStation) {
        const url = `${window.location.origin}/stations/${this.selectedStation._id}`;
        
        if (navigator.share) {
          navigator.share({
            title: this.selectedStation.name,
            text: `Check out this EV charging station: ${this.selectedStation.name}`,
            url: url
          });
        } else {
          navigator.clipboard.writeText(url);
          this.showSnackbar('Station link copied to clipboard!', 'success');
        }
      }
    },
    
    getStatusColor(status) {
      switch (status) {
        case 'Active':
          return 'success';
        case 'Inactive':
          return 'error';
        case 'Maintenance':
          return 'warning';
        default:
          return 'grey';
      }
    },
    
    getStatusHexColor(status) {
      switch (status) {
        case 'Active':
          return '#4CAF50';
        case 'Inactive':
          return '#F44336';
        case 'Maintenance':
          return '#FF9800';
        default:
          return '#9E9E9E';
      }
    },
    
    showSnackbar(text, color = 'success') {
      this.snackbarText = text;
      this.snackbarColor = color;
      this.snackbar = true;
    }
  },
  
  async created() {
    // Make component available globally for popup callbacks
    window.stationMapComponent = this;
    
    // Fetch stations
    await this.$store.dispatch('fetchStations');
  },
  
  mounted() {
    this.$nextTick(() => {
      this.initMap();
      this.updateMarkers();
    });
  },
  
  watch: {
    stations: {
      handler() {
        if (this.map) {
          this.updateMarkers();
        }
      },
      deep: true
    }
  },
  
  beforeUnmount() {
    // Clean up
    if (this.map) {
      this.map.remove();
    }
    if (window.stationMapComponent === this) {
      delete window.stationMapComponent;
    }
  }
}
</script>

<style scoped>
/* Apple-inspired modern styling */
.station-map-container {
  height: 100vh;
  background: #f8f9fa;
  position: relative;
  overflow: hidden;
}

/* Button Text Alignment Fix */
.btn-text {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  text-align: center;
}

/* Top Controls - Simplified and Clean */
.top-controls {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  border-bottom: 1px solid rgba(0, 0, 0, 0.08);
  padding: 16px 24px;
}

.controls-wrapper {
  max-width: 1400px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 1fr auto auto;
  gap: 24px;
  align-items: center;
}

.search-section {
  min-width: 300px;
}

.search-input :deep(.v-field) {
  border-radius: 12px !important;
  background: rgba(248, 249, 250, 0.8) !important;
  backdrop-filter: blur(10px);
}

.quick-filters {
  display: flex;
  gap: 12px;
}

.filter-select {
  min-width: 140px;
}

.filter-select :deep(.v-field) {
  border-radius: 12px !important;
  background: rgba(248, 249, 250, 0.8) !important;
  backdrop-filter: blur(10px);
}

.action-buttons {
  display: flex;
  gap: 8px;
}

.action-btn {
  border-radius: 12px !important;
  font-weight: 500 !important;
  text-transform: none !important;
  backdrop-filter: blur(10px);
  display: flex !important;
  align-items: center !important;
  justify-content: center !important;
  min-width: 120px;
}

.location-btn {
  background: #007aff !important;
  color: white !important;
  box-shadow: 0 2px 10px rgba(0, 122, 255, 0.3) !important;
}

/* Map Wrapper */
.map-wrapper {
  height: 100vh;
  position: relative;
  padding-top: 80px;
}

.map-element {
  height: 100%;
  width: 100%;
}

/* Compact Legend */
.map-legend {
  position: absolute;
  top: 100px;
  right: 24px;
  z-index: 1000;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  border-radius: 16px;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.12);
  border: 1px solid rgba(255, 255, 255, 0.2);
  padding: 20px;
  min-width: 200px;
  max-width: 280px;
}

.legend-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.legend-title {
  font-size: 1rem;
  font-weight: 600;
  color: #1d1d1f;
  margin: 0;
}

.total-count {
  font-size: 0.875rem;
  color: #86868b;
  font-weight: 500;
}

.legend-items {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 8px;
}

.legend-marker {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  border: 2px solid white;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
  flex-shrink: 0;
}

.legend-marker.active {
  background-color: #4CAF50;
}

.legend-marker.inactive {
  background-color: #F44336;
}

.legend-marker.maintenance {
  background-color: #FF9800;
}

.legend-marker.user-location {
  background-color: #FF5722;
}

.legend-text {
  font-size: 0.8rem;
  color: #1d1d1f;
  font-weight: 500;
}

/* Station Info Panel */
.station-info-panel {
  z-index: 1001;
}

.station-info-content {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.station-info-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 24px;
  border-bottom: 1px solid #f1f5f9;
}

.station-info-title {
  font-size: 1.5rem;
  font-weight: 600;
  color: #1d1d1f;
  margin: 0;
}

.close-btn {
  border-radius: 12px !important;
}

.station-info-body {
  flex: 1;
  padding: 24px;
  overflow-y: auto;
}

.station-status-section {
  margin-bottom: 24px;
}

.status-chip {
  border-radius: 12px !important;
  font-weight: 500 !important;
}

.station-details {
  margin-bottom: 32px;
}

.detail-item {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 16px;
  padding: 12px;
  background: #f8f9fa;
  border-radius: 12px;
}

.detail-icon {
  color: #86868b;
  font-size: 1.2rem;
}

.detail-text {
  font-size: 0.875rem;
  color: #1d1d1f;
  font-weight: 500;
}

.amenities-section {
  margin-bottom: 32px;
}

.amenities-title {
  font-size: 1rem;
  font-weight: 600;
  color: #1d1d1f;
  margin: 0 0 16px 0;
}

.amenities-chips {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.amenity-chip {
  border-radius: 8px !important;
  font-size: 0.8rem !important;
}

.station-actions {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.station-action-btn {
  border-radius: 12px !important;
  font-weight: 500 !important;
  text-transform: none !important;
  justify-content: flex-start !important;
  display: flex !important;
  align-items: center !important;
}

.primary-btn {
  background: #007aff !important;
  color: white !important;
  box-shadow: 0 4px 20px rgba(0, 122, 255, 0.3) !important;
}

/* Loading Overlay */
.loading-overlay {
  background: rgba(248, 249, 250, 0.8) !important;
  backdrop-filter: blur(10px);
}

.loading-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
}

.loading-text {
  font-size: 1rem;
  color: #1d1d1f;
  font-weight: 500;
  margin: 0;
}

/* Notification Snackbar */
.notification-snackbar {
  border-radius: 12px !important;
}

/* Custom marker styles */
:deep(.custom-station-icon) {
  background: transparent;
  border: none;
}

:deep(.user-location-icon) {
  background: transparent;
  border: none;
}

/* Responsive adjustments */
@media (max-width: 1200px) {
  .controls-wrapper {
    grid-template-columns: 1fr;
    gap: 16px;
  }
  
  .search-section,
  .quick-filters,
  .action-buttons {
    justify-self: stretch;
  }
  
  .quick-filters {
    justify-content: center;
  }
  
  .action-buttons {
    justify-content: center;
  }
}

@media (max-width: 768px) {
  .top-controls {
    padding: 12px 16px;
  }
  
  .map-wrapper {
    padding-top: 140px;
  }
  
  .quick-filters {
    flex-direction: column;
    gap: 8px;
  }
  
  .action-buttons {
    flex-wrap: wrap;
    gap: 8px;
  }
  
  .action-btn {
    flex: 1;
    min-width: 0;
  }
  
  .map-legend {
    top: 160px;
    right: 16px;
    left: auto;
    max-width: 200px;
  }
  
  .legend-items {
    grid-template-columns: 1fr;
    gap: 8px;
  }
  
  .station-info-header,
  .station-info-body {
    padding: 16px;
  }
}

@media (max-width: 480px) {
  .search-section {
    min-width: auto;
  }
  
  .filter-select {
    min-width: auto;
  }
  
  .action-btn {
    min-width: 100px;
    font-size: 0.875rem;
  }
}
</style>
