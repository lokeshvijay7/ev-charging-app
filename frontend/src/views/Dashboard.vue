<template>
  <div class="dashboard-container">
    <div class="dashboard-content">
      <!-- Header Section -->
      <div class="header-section">
        <div class="header-content">
          <h1 class="page-title">Dashboard</h1>
          <p class="page-subtitle">Manage your charging stations</p>
        </div>
        <div class="header-stats">
          <span class="total-count">{{ stations ? stations.length : 0 }}</span>
          <span class="count-label">Total Stations</span>
        </div>
      </div>

      <div v-if="error" class="error-alert">
        <v-icon color="error" class="mr-2">mdi-alert-circle</v-icon>
        {{ error }}
      </div>

      <!-- Quick Stats -->
      <div class="stats-section">
        <div class="stat-item">
          <div class="stat-icon-wrapper active-bg">
            <v-icon color="white" size="20">mdi-check-circle</v-icon>
          </div>
          <div class="stat-info">
            <div class="stat-number">{{ activeStations }}</div>
            <div class="stat-label">Active</div>
            <div class="stat-bar">
              <div class="stat-progress active" :style="{ width: activePercentage + '%' }"></div>
            </div>
          </div>
        </div>

        <div class="stat-item">
          <div class="stat-icon-wrapper inactive-bg">
            <v-icon color="white" size="20">mdi-close-circle</v-icon>
          </div>
          <div class="stat-info">
            <div class="stat-number">{{ inactiveStations }}</div>
            <div class="stat-label">Inactive</div>
            <div class="stat-bar">
              <div class="stat-progress inactive" :style="{ width: inactivePercentage + '%' }"></div>
            </div>
          </div>
        </div>

        <div class="stat-item">
          <div class="stat-icon-wrapper maintenance-bg">
            <v-icon color="white" size="20">mdi-wrench</v-icon>
          </div>
          <div class="stat-info">
            <div class="stat-number">{{ maintenanceStations }}</div>
            <div class="stat-label">Maintenance</div>
            <div class="stat-bar">
              <div class="stat-progress maintenance" :style="{ width: maintenancePercentage + '%' }"></div>
            </div>
          </div>
        </div>
      </div>

      <!-- Main Content -->
      <div class="main-content">
        <!-- Recent Stations -->
        <div class="content-section">
          <div class="section-header">
            <h2 class="section-title">Recent Stations</h2>
            <v-btn 
              variant="text" 
              color="primary" 
              to="/stations"
              class="view-all-link"
            >
              View all
              <v-icon size="16" class="ml-1">mdi-arrow-right</v-icon>
            </v-btn>
          </div>

          <div class="stations-container">
            <div v-if="recentStations && recentStations.length > 0" class="stations-grid">
              <div 
                v-for="station in recentStations" 
                :key="station._id"
                class="station-card"
              >
                <div class="station-header">
                  <div class="station-main-info">
                    <h3 class="station-name">{{ station.name }}</h3>
                    <p class="station-location">
                      <v-icon size="12" class="location-icon">mdi-map-marker</v-icon>
                      {{ station.location?.address || 'No address' }}
                    </p>
                  </div>
                  <div class="station-status">
                    <div class="status-dot" :class="getStatusClass(station.status)"></div>
                    <span class="status-text">{{ station.status }}</span>
                  </div>
                </div>

                <div class="station-details">
                  <div class="detail-item">
                    <v-icon size="14" class="detail-icon">mdi-lightning-bolt</v-icon>
                    <span class="detail-label">Power Output</span>
                    <span class="detail-value">{{ station.powerOutput || 0 }}kW</span>
                  </div>
                  <div class="detail-item">
                    <v-icon size="14" class="detail-icon">mdi-power-plug</v-icon>
                    <span class="detail-label">Connector</span>
                    <span class="detail-value">{{ station.connectorType || 'N/A' }}</span>
                  </div>
                </div>

                <div class="station-actions">
                  <v-btn 
                    v-if="station._id" 
                    variant="outlined" 
                    size="small"
                    :to="`/stations/${station._id}`"
                    class="station-btn"
                  >
                    View Details
                  </v-btn>
                </div>
              </div>
            </div>

            <div v-else class="empty-state">
              <div class="empty-icon">
                <v-icon size="48" color="grey-lighten-1">mdi-ev-station</v-icon>
              </div>
              <h3 class="empty-title">No stations found</h3>
              <p class="empty-text">Add your first charging station to get started</p>
            </div>
          </div>
        </div>

        <!-- Connector Types -->
        <div class="content-section chart-section">
          <div class="section-header">
            <h2 class="section-title">Connector Distribution</h2>
          </div>

          <div class="chart-wrapper">
            <div v-if="chartOption && chartOption.series && chartOption.series[0].data.length > 0" class="chart-container">
              <v-chart
                :key="chartOption.series[0].data.length"
                class="chart"
                :option="chartOption"
                autoresize
              />
            </div>
            <div v-else class="empty-chart">
              <div class="empty-icon">
                <v-icon size="48" color="grey-lighten-1">mdi-chart-donut</v-icon>
              </div>
              <h3 class="empty-title">No data available</h3>
              <p class="empty-text">Connector data will appear here</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import { use } from "echarts/core";
import { CanvasRenderer } from "echarts/renderers";
import { PieChart } from "echarts/charts";
import {
  TitleComponent,
  TooltipComponent,
  LegendComponent,
} from "echarts/components";
import VChart from "vue-echarts";

use([
  CanvasRenderer,
  PieChart,
  TitleComponent,
  TooltipComponent,
  LegendComponent,
]);

export default {
  name: "DashboardView",
  components: {
    VChart,
  },
  computed: {
    ...mapGetters(["stations", "loading", "error"]),
    recentStations() {
      return this.stations ? this.stations.slice(-5) : [];
    },
    activeStations() {
      return this.stations ? this.stations.filter(s => s.status === "Active").length : 0;
    },
    inactiveStations() {
      return this.stations ? this.stations.filter(s => s.status === "Inactive").length : 0;
    },
    maintenanceStations() {
      return this.stations ? this.stations.filter(s => s.status === "Maintenance").length : 0;
    },
    activePercentage() {
      if (!this.stations || this.stations.length === 0) return 0;
      return (this.activeStations / this.stations.length) * 100;
    },
    inactivePercentage() {
      if (!this.stations || this.stations.length === 0) return 0;
      return (this.inactiveStations / this.stations.length) * 100;
    },
    maintenancePercentage() {
      if (!this.stations || this.stations.length === 0) return 0;
      return (this.maintenanceStations / this.stations.length) * 100;
    },
    chartOption() {
      if (!this.stations || this.stations.length === 0) {
        return null;
      }
      
      const connectorCounts = {};
      this.stations.forEach(station => {
        if (station.connectorType && typeof station.connectorType === 'string') {
          connectorCounts[station.connectorType] = (connectorCounts[station.connectorType] || 0) + 1;
        }
      });
      
      const data = Object.entries(connectorCounts).map(([name, value]) => ({ name, value }));
      
      return {
        tooltip: {
          trigger: 'item',
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
          borderRadius: 8,
          padding: [8, 12],
          textStyle: {
            color: '#fff',
            fontSize: 12
          },
          formatter: '{a} <br/>{b}: {c} ({d}%)'
        },
        legend: {
          orient: 'vertical',
          right: 20,
          top: 'center',
          textStyle: {
            fontSize: 12,
            color: '#666'
          }
        },
        series: [
          {
            name: 'Connectors',
            type: 'pie',
            radius: ['40%', '70%'],
            center: ['40%', '50%'],
            avoidLabelOverlap: false,
            itemStyle: {
              borderRadius: 6,
              borderColor: '#fff',
              borderWidth: 2
            },
            label: {
              show: false
            },
            emphasis: {
              scale: true,
              scaleSize: 5
            },
            labelLine: {
              show: false
            },
            color: ['#4A90E2', '#7ED321', '#F5A623', '#D0021B', '#9013FE', '#50E3C2'],
            data
          }
        ]
      };
    },
  },
  methods: {
    getStatusClass(status) {
      switch (status) {
        case "Active":
          return "active";
        case "Inactive":
          return "inactive";
        case "Maintenance":
          return "maintenance";
        default:
          return "default";
      }
    },
  },
  created() {
    this.$store.dispatch("fetchStations");
  },
};
</script>

<style scoped>
/* Apple-inspired modern styling */
.dashboard-container {
  min-height: 100vh;
  background: #f8f9fa;
  padding: 0;
}

.dashboard-content {
  max-width: 1400px;
  margin: 0 auto;
  padding: 32px 48px;
}

/* Header */
.header-section {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 48px;
}

.header-content {
  flex: 1;
}

.page-title {
  font-size: 3.5rem;
  font-weight: 300;
  color: #1d1d1f;
  margin: 0;
  letter-spacing: -1px;
  line-height: 1.1;
}

.page-subtitle {
  font-size: 1.25rem;
  color: #86868b;
  margin: 8px 0 0 0;
  font-weight: 400;
}

.header-stats {
  text-align: center;
  padding: 24px 32px;
  background: white;
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  border: 1px solid rgba(0, 0, 0, 0.04);
  min-width: 160px;
}

.total-count {
  display: block;
  font-size: 2.75rem;
  font-weight: 600;
  color: #1d1d1f;
  line-height: 1;
}

.count-label {
  font-size: 0.875rem;
  color: #86868b;
  font-weight: 500;
  margin-top: 4px;
}

.error-alert {
  background: #fef2f2;
  border: 1px solid #fecaca;
  color: #dc2626;
  padding: 16px 20px;
  border-radius: 12px;
  margin-bottom: 32px;
  display: flex;
  align-items: center;
}

/* Stats Section */
.stats-section {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: 24px;
  margin-bottom: 48px;
}

.stat-item {
  background: white;
  padding: 32px;
  border-radius: 20px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  border: 1px solid rgba(0, 0, 0, 0.04);
  display: flex;
  align-items: center;
  gap: 24px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.stat-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.12);
}

.stat-icon-wrapper {
  width: 64px;
  height: 64px;
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.active-bg { background: linear-gradient(135deg, #34d399, #10b981); }
.inactive-bg { background: linear-gradient(135deg, #f87171, #ef4444); }
.maintenance-bg { background: linear-gradient(135deg, #fbbf24, #f59e0b); }

.stat-info {
  flex: 1;
}

.stat-number {
  font-size: 2.5rem;
  font-weight: 600;
  color: #1d1d1f;
  margin-bottom: 4px;
  line-height: 1;
}

.stat-label {
  font-size: 1rem;
  color: #86868b;
  margin-bottom: 16px;
  font-weight: 500;
}

.stat-bar {
  height: 4px;
  background: #f1f5f9;
  border-radius: 2px;
  overflow: hidden;
}

.stat-progress {
  height: 100%;
  border-radius: 2px;
  transition: width 1s cubic-bezier(0.4, 0, 0.2, 1);
}

.stat-progress.active { background: #10b981; }
.stat-progress.inactive { background: #ef4444; }
.stat-progress.maintenance { background: #f59e0b; }

/* Main Content */
.main-content {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 32px;
}

.content-section {
  background: white;
  border-radius: 20px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  border: 1px solid rgba(0, 0, 0, 0.04);
  overflow: hidden;
}

.section-header {
  padding: 32px 32px 24px 32px;
  border-bottom: 1px solid #f1f5f9;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.section-title {
  font-size: 1.5rem;
  font-weight: 600;
  color: #1d1d1f;
  margin: 0;
}

.view-all-link {
  text-transform: none;
  font-weight: 500;
  color: #007aff !important;
}

/* Stations */
.stations-container {
  padding: 24px 32px 32px 32px;
}

.stations-grid {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.station-card {
  border: 1px solid #f1f5f9;
  border-radius: 16px;
  padding: 24px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  background: #fafbfc;
}

.station-card:hover {
  border-color: #007aff;
  background: white;
  transform: translateY(-1px);
  box-shadow: 0 4px 20px rgba(0, 122, 255, 0.1);
}

.station-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 20px;
}

.station-name {
  font-size: 1.125rem;
  font-weight: 600;
  color: #1d1d1f;
  margin: 0 0 6px 0;
}

.station-location {
  font-size: 0.875rem;
  color: #86868b;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 4px;
}

.location-icon {
  color: #86868b;
}

.station-status {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 6px 12px;
  background: white;
  border-radius: 20px;
  border: 1px solid #f1f5f9;
}

.status-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
}

.status-dot.active { background: #10b981; }
.status-dot.inactive { background: #ef4444; }
.status-dot.maintenance { background: #f59e0b; }
.status-dot.default { background: #94a3b8; }

.status-text {
  font-size: 0.8rem;
  font-weight: 500;
  color: #64748b;
}

.station-details {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
  margin-bottom: 20px;
}

.detail-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px;
  background: white;
  border-radius: 12px;
  border: 1px solid #f1f5f9;
}

.detail-icon {
  color: #86868b;
}

.detail-label {
  font-size: 0.8rem;
  color: #86868b;
  font-weight: 500;
  margin-right: auto;
}

.detail-value {
  font-size: 0.875rem;
  color: #1d1d1f;
  font-weight: 600;
}

.station-actions {
  display: flex;
  justify-content: flex-end;
}

.station-btn {
  text-transform: none;
  font-weight: 500;
  border-radius: 12px;
}

/* Chart Section */
.chart-section {
  height: fit-content;
}

.chart-wrapper {
  padding: 24px 32px 32px 32px;
}

.chart-container {
  height: 320px;
}

.chart {
  width: 100%;
  height: 100%;
}

/* Empty States */
.empty-state,
.empty-chart {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 64px 20px;
  text-align: center;
}

.empty-icon {
  margin-bottom: 20px;
  opacity: 0.6;
}

.empty-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: #1d1d1f;
  margin: 0 0 8px 0;
}

.empty-text {
  font-size: 1rem;
  color: #86868b;
  margin: 0;
}

/* Responsive */
@media (max-width: 1200px) {
  .dashboard-content {
    padding: 24px 32px;
  }
  
  .main-content {
    grid-template-columns: 1fr;
    gap: 24px;
  }
}

@media (max-width: 768px) {
  .dashboard-content {
    padding: 20px 16px;
  }
  
  .header-section {
    flex-direction: column;
    align-items: flex-start;
    gap: 24px;
  }
  
  .header-stats {
    align-self: stretch;
    text-align: center;
  }
  
  .page-title {
    font-size: 2.5rem;
  }
  
  .stats-section {
    grid-template-columns: 1fr;
    gap: 16px;
  }
  
  .stat-item {
    padding: 24px;
  }
  
  .section-header {
    padding: 24px 20px 20px 20px;
  }
  
  .stations-container,
  .chart-wrapper {
    padding: 20px 20px 24px 20px;
  }
  
  .station-header {
    flex-direction: column;
    gap: 16px;
  }
  
  .station-details {
    grid-template-columns: 1fr;
    gap: 12px;
  }
}
</style>
