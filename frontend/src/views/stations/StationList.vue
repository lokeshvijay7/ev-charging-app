<template>
  <div class="station-list-container">
    <!-- Header Section -->
    <div class="header-section">
      <div class="header-content">
        <div class="title-section">
          <h1 class="page-title">Charging Stations</h1>
          <p class="page-subtitle">Manage your electric vehicle charging infrastructure</p>
        </div>
        <v-btn
          color="primary"
          variant="elevated"
          size="large"
          prepend-icon="mdi-plus"
          to="/stations/new"
          class="add-station-btn"
        >
          <span class="btn-text-content">Add Station</span>
        </v-btn>
      </div>
    </div>

    <!-- Search and Filter Section -->
    <div class="search-section">
      <div class="search-content">
        <div class="search-bar">
          <v-text-field
            v-model="search"
            prepend-inner-icon="mdi-magnify"
            label="Search stations..."
            variant="solo"
            flat
            hide-details
            density="comfortable"
            class="search-input"
            bg-color="white"
          ></v-text-field>
        </div>
        
        <v-btn
          :color="showFilters ? 'primary' : 'default'"
          :variant="showFilters ? 'elevated' : 'outlined'"
          @click="showFilters = !showFilters"
          class="filters-btn"
          prepend-icon="mdi-tune"
        >
          <span class="btn-text-content">Filters</span>
        </v-btn>
      </div>
      
      <!-- Expanded Filters -->
      <v-expand-transition>
        <div v-if="showFilters" class="filters-expanded">
          <v-row class="filters-row">
            <v-col cols="12" sm="6" md="3">
              <v-select
                v-model="filters.status"
                :items="statusOptions"
                label="Status"
                variant="solo"
                flat
                density="comfortable"
                clearable
                class="filter-select"
                bg-color="white"
              ></v-select>
            </v-col>
            
            <v-col cols="12" sm="6" md="3">
              <v-select
                v-model="filters.connectorType"
                :items="connectorOptions"
                label="Connector Type"
                variant="solo"
                flat
                density="comfortable"
                clearable
                class="filter-select"
                bg-color="white"
              ></v-select>
            </v-col>
            
            <v-col cols="12" sm="6" md="3">
              <v-text-field
                v-model="filters.minPower"
                label="Min Power (kW)"
                type="number"
                variant="solo"
                flat
                density="comfortable"
                class="filter-input"
                bg-color="white"
              ></v-text-field>
            </v-col>
            
            <v-col cols="12" sm="6" md="3">
              <v-text-field
                v-model="filters.maxPower"
                label="Max Power (kW)"
                type="number"
                variant="solo"
                flat
                density="comfortable"
                class="filter-input"
                bg-color="white"
              ></v-text-field>
            </v-col>
          </v-row>
          
          <div class="filter-actions">
            <v-btn
              variant="text"
              @click="resetFilters"
              class="filter-action-btn"
            >
              <span class="btn-text-content">Reset</span>
            </v-btn>
            <v-btn
              color="primary"
              variant="elevated"
              @click="applyFilters"
              class="filter-action-btn apply-btn"
            >
              <span class="btn-text-content">Apply Filters</span>
            </v-btn>
          </div>
        </div>
      </v-expand-transition>
    </div>

    <!-- Stations List -->
    <div class="stations-container">
      <div v-if="loading" class="loading-section">
        <v-progress-circular indeterminate color="primary" size="48"></v-progress-circular>
        <p class="loading-text">Loading stations...</p>
      </div>

      <div v-else-if="filteredStations && filteredStations.length > 0" class="stations-list">
        <!-- Table Header -->
        <div class="table-header">
          <div class="header-cell station-name-header">Station Name</div>
          <div class="header-cell location-header">Location</div>
          <div class="header-cell power-header">Power</div>
          <div class="header-cell connector-header">Connector</div>
          <div class="header-cell status-header">Status</div>
          <div class="header-cell actions-header">Actions</div>
        </div>
        
        <!-- Station Items -->
        <div class="stations-body">
          <div 
            v-for="station in paginatedStations" 
            :key="station._id"
            class="station-item"
          >
            <div class="station-cell station-name-cell">
              <h3 class="station-name">{{ station.name }}</h3>
            </div>
            
            <div class="station-cell location-cell">
              <div class="location-content">
                <v-icon size="16" class="location-icon">mdi-map-marker</v-icon>
                <span class="location-text">{{ station?.location?.address || 'N/A' }}</span>
              </div>
            </div>
            
            <div class="station-cell power-cell">
              <div class="power-content">
                <v-icon size="16" class="power-icon">mdi-lightning-bolt</v-icon>
                <span class="power-value">{{ station?.powerOutput || 'N/A' }} kW</span>
              </div>
            </div>
            
            <div class="station-cell connector-cell">
              <span class="connector-type">{{ station?.connectorType || 'N/A' }}</span>
            </div>
            
            <div class="station-cell status-cell">
              <v-chip
                :color="getStatusColor(station?.status)"
                variant="flat"
                size="small"
                class="status-chip"
              >
                {{ station?.status || 'Unknown' }}
              </v-chip>
            </div>
            
            <div class="station-cell actions-cell">
              <div class="action-buttons">
                <v-btn
                  variant="text"
                  size="small"
                  :to="station?._id ? `/stations/${station._id}` : ''"
                  :disabled="!station?._id"
                  class="action-btn"
                  icon
                >
                  <v-icon size="20">mdi-eye-outline</v-icon>
                </v-btn>
                
                <v-btn
                  variant="text"
                  size="small"
                  :to="station?._id ? `/stations/${station._id}/edit` : ''"
                  :disabled="!station?._id"
                  class="action-btn"
                  icon
                >
                  <v-icon size="20">mdi-pencil-outline</v-icon>
                </v-btn>
                
                <v-btn
                  variant="text"
                  size="small"
                  color="error"
                  @click="confirmDelete(station)"
                  :disabled="!station?._id"
                  class="action-btn"
                  icon
                >
                  <v-icon size="20">mdi-delete-outline</v-icon>
                </v-btn>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Pagination -->
        <div class="pagination-section">
          <div class="pagination-info">
            <span class="items-per-page-label">Items per page:</span>
            <v-select
              v-model="itemsPerPage"
              :items="[10, 25, 50, 100]"
              variant="outlined"
              density="compact"
              hide-details
              class="items-per-page-select"
            ></v-select>
            <span class="pagination-text">
              {{ startItem }}-{{ endItem }} of {{ totalItems }}
            </span>
          </div>
          
          <div class="pagination-controls">
            <v-btn
              icon
              variant="text"
              size="small"
              @click="goToFirstPage"
              :disabled="currentPage === 1"
              class="pagination-btn"
            >
              <v-icon>mdi-page-first</v-icon>
            </v-btn>
            
            <v-btn
              icon
              variant="text"
              size="small"
              @click="goToPreviousPage"
              :disabled="currentPage === 1"
              class="pagination-btn"
            >
              <v-icon>mdi-chevron-left</v-icon>
            </v-btn>
            
            <v-btn
              icon
              variant="text"
              size="small"
              @click="goToNextPage"
              :disabled="currentPage === totalPages"
              class="pagination-btn"
            >
              <v-icon>mdi-chevron-right</v-icon>
            </v-btn>
            
            <v-btn
              icon
              variant="text"
              size="small"
              @click="goToLastPage"
              :disabled="currentPage === totalPages"
              class="pagination-btn"
            >
              <v-icon>mdi-page-last</v-icon>
            </v-btn>
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <div v-else class="empty-state">
        <div class="empty-icon">
          <v-icon size="64" color="grey-lighten-1">mdi-ev-station</v-icon>
        </div>
        <h3 class="empty-title">No charging stations found</h3>
        <p class="empty-text">
          Get started by adding your first charging station to begin managing your EV infrastructure.
        </p>
        <v-btn
          color="primary"
          variant="elevated"
          size="large"
          to="/stations/new"
          prepend-icon="mdi-plus"
          class="empty-action-btn"
        >
          <span class="btn-text-content">Add Your First Station</span>
        </v-btn>
      </div>
    </div>
    
    <!-- Delete Confirmation Dialog -->
    <v-dialog 
      v-model="deleteDialog" 
      max-width="440"
      persistent
    >
      <v-card class="delete-dialog">
        <v-card-title class="delete-dialog-title">
          Delete Charging Station
        </v-card-title>
        
        <v-card-text class="delete-dialog-content">
          <p class="delete-dialog-text">
            Are you sure you want to delete this charging station?
          </p>
          <div class="delete-warning">
            <v-icon size="16" class="warning-icon">mdi-alert-circle-outline</v-icon>
            <p class="warning-text">
              This action cannot be undone and will permanently remove all station data.
            </p>
          </div>
        </v-card-text>
        
        <v-card-actions class="delete-dialog-actions">
          <v-spacer></v-spacer>
          <v-btn
            variant="text"
            @click="deleteDialog = false"
            class="cancel-btn"
          >
            <span class="btn-text-content">Cancel</span>
          </v-btn>
          <v-btn
            color="error"
            variant="elevated"
            @click="deleteStation"
            :loading="deleteLoading"
            class="delete-btn"
          >
            <span class="btn-text-content">Delete</span>
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  name: 'StationList',
  data() {
    return {
      search: '',
      showFilters: false,
      currentPage: 1,
      itemsPerPage: 10,
      filters: {
        status: null,
        connectorType: null,
        minPower: null,
        maxPower: null
      },
      statusOptions: ['Active', 'Inactive', 'Maintenance'],
      connectorOptions: ['Type 1', 'Type 2', 'CHAdeMO', 'CCS', 'Tesla'],
      deleteDialog: false,
      stationToDelete: null,
      deleteLoading: false
    };
  },
  computed: {
    ...mapGetters(['stations', 'loading']),
    
    filteredStations() {
      console.log("stations from store:", this.stations);
      let result = [...this.stations];

      // Filter out undefined or null items and items missing _id or status to avoid runtime errors
      result = result.filter(station => station && station._id && station.status !== undefined);

      console.log("filteredStations after filtering:", result);

      // Apply local filters (for fields not sent to the API)
      if (this.search) {
        const searchLower = this.search.toLowerCase();
        result = result.filter(station => 
          station.name.toLowerCase().includes(searchLower) ||
          (station.location && station.location.address && station.location.address.toLowerCase().includes(searchLower))
        );
      }

      return result;
    },
    
    totalItems() {
      return this.filteredStations.length;
    },
    
    totalPages() {
      return Math.ceil(this.totalItems / this.itemsPerPage);
    },
    
    startItem() {
      return this.totalItems === 0 ? 0 : (this.currentPage - 1) * this.itemsPerPage + 1;
    },
    
    endItem() {
      const end = this.currentPage * this.itemsPerPage;
      return end > this.totalItems ? this.totalItems : end;
    },
    
    paginatedStations() {
      const start = (this.currentPage - 1) * this.itemsPerPage;
      const end = start + this.itemsPerPage;
      return this.filteredStations.slice(start, end);
    }
  },
  methods: {
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
    
    applyFilters() {
      this.currentPage = 1; // Reset to first page when applying filters
      this.$store.dispatch('fetchStations', this.filters);
    },
    
    resetFilters() {
      this.filters = {
        status: null,
        connectorType: null,
        minPower: null,
        maxPower: null
      };
      this.currentPage = 1;
      this.applyFilters();
    },
    
    confirmDelete(station) {
      this.stationToDelete = station;
      this.deleteDialog = true;
    },
    
    async deleteStation() {
      if (this.stationToDelete) {
        this.deleteLoading = true;
        try {
          await this.$store.dispatch('deleteStation', this.stationToDelete._id);
          this.deleteDialog = false;
          this.stationToDelete = null;
          this.$store.commit('SET_ERROR', null);
        } catch (error) {
          // Error handled in store
        } finally {
          this.deleteLoading = false;
        }
      }
    },
    
    // Pagination methods
    goToFirstPage() {
      this.currentPage = 1;
    },
    
    goToPreviousPage() {
      if (this.currentPage > 1) {
        this.currentPage--;
      }
    },
    
    goToNextPage() {
      if (this.currentPage < this.totalPages) {
        this.currentPage++;
      }
    },
    
    goToLastPage() {
      this.currentPage = this.totalPages;
    }
  },

  created() {
    this.$store.dispatch('fetchStations');
  },
  
  watch: {
    itemsPerPage() {
      this.currentPage = 1; // Reset to first page when changing items per page
    }
  }
}
</script>

<style scoped>
/* Apple-inspired modern styling */
.station-list-container {
  min-height: 100vh;
  background: #f8f9fa;
  padding: 0;
}

/* Button Text Alignment Fix */
.btn-text-content {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  text-align: center;
}

/* Header Section */
.header-section {
  background: white;
  padding: 40px 48px 40px 80px; /* Added left padding */
  border-bottom: 1px solid rgba(0, 0, 0, 0.04);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.04);
  margin-bottom: 32px;
}

.header-content {
  max-width: 1400px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.title-section {
  flex: 1;
  margin-left: 50px;
}

.page-title {
  font-size: 3rem;
  font-weight: 300;
  color: #1d1d1f;
  margin: 0 0 8px 0;
  letter-spacing: -1px;
  line-height: 1.1;
}

.page-subtitle {
  font-size: 1.125rem;
  color: #86868b;
  margin: 0;
  font-weight: 400;
}

.add-station-btn {
  background: #007aff !important;
  color: white !important;
  border-radius: 12px !important;
  padding: 12px 24px !important;
  font-weight: 500 !important;
  text-transform: none !important;
  box-shadow: 0 4px 20px rgba(0, 122, 255, 0.3) !important;
  display: flex !important;
  align-items: center !important;
  justify-content: center !important;
}

/* Search Section */
.search-section {
  max-width: 1400px;
  margin: 0 auto 32px auto;
  padding: 0 48px 0 80px; /* Added left padding */
}

.search-content {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 24px;
}

.search-bar {
  flex: 1;
  max-width: 400px;
}

.search-input {
  border-radius: 12px;
}

.search-input :deep(.v-field) {
  border-radius: 12px !important;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08) !important;
  border: 1px solid #e5e7eb !important;
}

.filters-btn {
  border-radius: 12px !important;
  padding: 0 20px !important;
  font-weight: 500 !important;
  text-transform: none !important;
  display: flex !important;
  align-items: center !important;
  justify-content: center !important;
  margin-left: auto; /* Push to right side */
}

.filters-expanded {
  background: white;
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  border: 1px solid rgba(0, 0, 0, 0.04);
}

.filters-row {
  margin-bottom: 16px;
}

.filter-select :deep(.v-field),
.filter-input :deep(.v-field) {
  border-radius: 12px !important;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08) !important;
  border: 1px solid #e5e7eb !important;
}

.filter-actions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}

.filter-action-btn {
  border-radius: 12px !important;
  padding: 8px 20px !important;
  font-weight: 500 !important;
  text-transform: none !important;
  display: flex !important;
  align-items: center !important;
  justify-content: center !important;
}

.apply-btn {
  background: #007aff !important;
  color: white !important;
  box-shadow: 0 2px 10px rgba(0, 122, 255, 0.3) !important;
}

/* Stations Container */
.stations-container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 48px 48px 80px; /* Added left padding */
}

.loading-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 80px 20px;
  gap: 16px;
}

.loading-text {
  font-size: 1rem;
  color: #86868b;
  margin: 0;
}

/* Stations List */
.stations-list {
  background: white;
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  border: 1px solid rgba(0, 0, 0, 0.04);
  overflow: hidden;
}

/* Table Header */
.table-header {
  display: grid;
  grid-template-columns: 2fr 2fr 1fr 1fr 1fr 120px;
  gap: 16px;
  padding: 20px 24px;
  background: #f8f9fa;
  border-bottom: 2px solid #e5e7eb;
}

.header-cell {
  font-size: 0.875rem;
  font-weight: 600;
  color: #374151;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

/* Stations Body */
.stations-body {
  background: white;
}

.station-item {
  display: grid;
  grid-template-columns: 2fr 2fr 1fr 1fr 1fr 120px;
  gap: 16px;
  padding: 20px 24px;
  border-bottom: 1px solid #f1f5f9;
  transition: all 0.2s ease;
  align-items: center;
}

.station-item:last-child {
  border-bottom: none;
}

.station-item:hover {
  background: rgba(0, 122, 255, 0.02);
}

.station-cell {
  display: flex;
  align-items: center;
}

/* Station Name Cell */
.station-name {
  font-size: 1rem;
  font-weight: 600;
  color: #1d1d1f;
  margin: 0;
}

/* Location Cell */
.location-content {
  display: flex;
  align-items: center;
  gap: 6px;
}

.location-icon {
  color: #86868b;
}

.location-text {
  font-size: 0.875rem;
  color: #86868b;
}

/* Power Cell */
.power-content {
  display: flex;
  align-items: center;
  gap: 6px;
}

.power-icon {
  color: #86868b;
}

.power-value {
  font-size: 0.875rem;
  font-weight: 500;
  color: #1d1d1f;
}

/* Connector Cell */
.connector-type {
  font-size: 0.875rem;
  color: #1d1d1f;
  font-weight: 500;
}

/* Status Cell */
.status-chip {
  border-radius: 8px !important;
  font-weight: 500 !important;
  font-size: 0.75rem !important;
}

/* Actions Cell */
.action-buttons {
  display: flex;
  align-items: center;
  gap: 4px;
  justify-content: flex-end;
}

.action-btn {
  border-radius: 8px !important;
  color: #86868b !important;
}

.action-btn:hover {
  background: rgba(0, 0, 0, 0.04) !important;
}

/* Pagination */
.pagination-section {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 24px;
  border-top: 1px solid #f1f5f9;
  background: white;
}

.pagination-info {
  display: flex;
  align-items: center;
  gap: 12px;
}

.items-per-page-label {
  font-size: 0.875rem;
  color: #86868b;
}

.items-per-page-select {
  width: 80px;
}

.items-per-page-select :deep(.v-field) {
  border-radius: 8px !important;
}

.pagination-text {
  font-size: 0.875rem;
  color: #86868b;
}

.pagination-controls {
  display: flex;
  align-items: center;
  gap: 4px;
}

.pagination-btn {
  border-radius: 8px !important;
  color: #86868b !important;
}

.pagination-btn:hover {
  background: rgba(0, 0, 0, 0.04) !important;
}

.pagination-btn:disabled {
  opacity: 0.3 !important;
}

/* Empty State */
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 80px 20px;
  text-align: center;
  background: white;
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  border: 1px solid rgba(0, 0, 0, 0.04);
}

.empty-icon {
  width: 80px;
  height: 80px;
  background: linear-gradient(135deg, #f1f5f9, #e2e8f0);
  border-radius: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 24px;
}

.empty-title {
  font-size: 1.5rem;
  font-weight: 600;
  color: #1d1d1f;
  margin: 0 0 12px 0;
}

.empty-text {
  font-size: 1rem;
  color: #86868b;
  margin: 0 0 32px 0;
  max-width: 400px;
  line-height: 1.5;
}

.empty-action-btn {
  background: #007aff !important;
  color: white !important;
  border-radius: 12px !important;
  padding: 12px 24px !important;
  font-weight: 500 !important;
  text-transform: none !important;
  box-shadow: 0 4px 20px rgba(0, 122, 255, 0.3) !important;
  display: flex !important;
  align-items: center !important;
  justify-content: center !important;
}

/* Delete Dialog */
.delete-dialog {
  border-radius: 20px !important;
  padding: 8px;
}

.delete-dialog-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: #1d1d1f;
  padding: 24px 24px 16px 24px;
}

.delete-dialog-content {
  padding: 0 24px 24px 24px;
}

.delete-dialog-text {
  font-size: 1rem;
  color: #1d1d1f;
  margin-bottom: 16px;
}

.delete-warning {
  padding: 16px;
  background: rgba(244, 67, 54, 0.08);
  border-radius: 12px;
  display: flex;
  align-items: flex-start;
  gap: 8px;
}

.warning-icon {
  color: #f44336;
  margin-top: 2px;
}

.warning-text {
  font-size: 0.875rem;
  color: #f44336;
  margin: 0;
  line-height: 1.4;
}

.delete-dialog-actions {
  padding: 0 24px 24px 24px;
}

.cancel-btn {
  border-radius: 12px !important;
  padding: 12px 24px !important;
  font-weight: 500 !important;
  text-transform: none !important;
  display: flex !important;
  align-items: center !important;
  justify-content: center !important;
}

.delete-btn {
  border-radius: 12px !important;
  padding: 12px 24px !important;
  font-weight: 500 !important;
  text-transform: none !important;
  margin-left: 12px !important;
  display: flex !important;
  align-items: center !important;
  justify-content: center !important;
}

/* Responsive */
@media (max-width: 1200px) {
  .header-section,
  .search-section,
  .stations-container {
    padding-left: 60px;
    padding-right: 32px;
  }
  
  .table-header,
  .station-item {
    grid-template-columns: 1.5fr 1.5fr 1fr 1fr 1fr 100px;
  }
}

@media (max-width: 768px) {
  .header-section,
  .search-section,
  .stations-container {
    padding-left: 40px;
    padding-right: 24px;
  }
  
  .header-content {
    flex-direction: column;
    align-items: flex-start;
    gap: 24px;
  }
  
  .add-station-btn {
    align-self: stretch;
    justify-content: center;
  }
  
  .page-title {
    font-size: 2.5rem;
  }
  
  .search-content {
    flex-direction: column;
    align-items: stretch;
  }
  
  .search-bar {
    max-width: none;
  }
  
  .filters-btn {
    margin-left: 0;
  }
  
  .table-header,
  .station-item {
    grid-template-columns: 1fr;
    gap: 8px;
  }
  
  .table-header {
    display: none; /* Hide header on mobile */
  }
  
  .station-item {
    display: block;
    padding: 16px;
  }
  
  .station-cell {
    margin-bottom: 8px;
    justify-content: flex-start;
  }
  
  .action-buttons {
    justify-content: flex-start;
    margin-top: 12px;
  }
  
  .pagination-section {
    flex-direction: column;
    gap: 16px;
  }
}

@media (max-width: 480px) {
  .header-section,
  .search-section,
  .stations-container {
    padding-left: 24px;
    padding-right: 16px;
  }
  
  .page-title {
    font-size: 2rem;
  }
}
</style>
