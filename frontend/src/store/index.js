import { createStore } from "vuex"
import axios from "axios"

// Set base URL for API requests
axios.defaults.baseURL = process.env.VUE_APP_API_URL || "http://localhost:5000/api"

// Add token to requests if available
axios.interceptors.request.use((config) => {
  const token = localStorage.getItem("token")
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

export default createStore({
  state: {
    token: localStorage.getItem("token") || null,
    user: JSON.parse(localStorage.getItem("user")) || null,
    stations: [],
    currentStation: null,
    loading: false,
    error: null,
  },
  getters: {
    isAuthenticated: (state) => !!state.token,
    currentUser: (state) => state.user,
    stations: (state) => state.stations,
    currentStation: (state) => state.currentStation,
    isLoading: (state) => state.loading,
    error: (state) => state.error,
  },
  mutations: {
    SET_TOKEN(state, token) {
      state.token = token
    },
    SET_USER(state, user) {
      state.user = user
    },
    SET_STATIONS(state, stations) {
      state.stations = stations
    },
    SET_CURRENT_STATION(state, station) {
      state.currentStation = station
    },
    ADD_STATION(state, station) {
      state.stations.unshift(station)
    },
    UPDATE_STATION(state, updatedStation) {
      const index = state.stations.findIndex((s) => s._id === updatedStation._id)
      if (index !== -1) {
        state.stations.splice(index, 1, updatedStation)
      }
      if (state.currentStation && state.currentStation._id === updatedStation._id) {
        state.currentStation = updatedStation
      }
    },
    REMOVE_STATION(state, stationId) {
      state.stations = state.stations.filter((s) => s._id !== stationId)
      if (state.currentStation && state.currentStation._id === stationId) {
        state.currentStation = null
      }
    },
    SET_LOADING(state, status) {
      state.loading = status
    },
    SET_ERROR(state, error) {
      state.error = error
    },
    CLEAR_ERROR(state) {
      state.error = null
    },
    LOGOUT(state) {
      state.token = null
      state.user = null
      state.stations = []
      state.currentStation = null
    },
  },
  actions: {
    // Auth actions
    async register({ commit }, userData) {
      try {
        commit("SET_LOADING", true)
        commit("CLEAR_ERROR")

        const response = await axios.post("/auth/register", userData)

        const { token, user } = response.data

        localStorage.setItem("token", token)
        localStorage.setItem("user", JSON.stringify(user))

        commit("SET_TOKEN", token)
        commit("SET_USER", user)
        commit("SET_LOADING", false)

        return user
      } catch (error) {
        commit("SET_LOADING", false)
        commit("SET_ERROR", error.response?.data?.message || "Registration failed")
        throw error
      }
    },

    async login({ commit }, credentials) {
      try {
        commit("SET_LOADING", true)
        commit("CLEAR_ERROR")

        const response = await axios.post("/auth/login", credentials)

        const { token, user } = response.data

        localStorage.setItem("token", token)
        localStorage.setItem("user", JSON.stringify(user))

        commit("SET_TOKEN", token)
        commit("SET_USER", user)
        commit("SET_LOADING", false)

        return user
      } catch (error) {
        commit("SET_LOADING", false)
        commit("SET_ERROR", error.response?.data?.message || "Login failed")
        throw error
      }
    },

    logout({ commit }) {
      localStorage.removeItem("token")
      localStorage.removeItem("user")
      commit("LOGOUT")
    },

    checkAuth({ commit }) {
      const token = localStorage.getItem("token")
      const user = JSON.parse(localStorage.getItem("user"))

      if (token && user) {
        commit("SET_TOKEN", token)
        commit("SET_USER", user)
      }
    },

    // Station actions
    async fetchStations({ commit }, filters = {}) {
      try {
        commit("SET_LOADING", true)

        // Build query string from filters
        const queryParams = new URLSearchParams()
        Object.entries(filters).forEach(([key, value]) => {
          if (value) queryParams.append(key, value)
        })

        const response = await axios.get(`/stations?${queryParams.toString()}`)

        console.log("fetchStations response data:", response.data);

        commit("SET_STATIONS", response.data)
        commit("SET_LOADING", false)

        return response.data
      } catch (error) {
        commit("SET_LOADING", false)
        commit("SET_ERROR", error.response?.data?.message || "Failed to fetch stations")
        throw error
      }
    },

    async fetchStationById({ commit }, stationId) {
      try {
        commit("SET_LOADING", true)

        const response = await axios.get(`/stations/${stationId}`)

        commit("SET_CURRENT_STATION", response.data)
        commit("SET_LOADING", false)

        return response.data
      } catch (error) {
        commit("SET_LOADING", false)
        commit("SET_ERROR", error.response?.data?.message || "Failed to fetch station")
        throw error
      }
    },

    async createStation({ commit }, stationData) {
      try {
        commit("SET_LOADING", true)

        const response = await axios.post("/stations", stationData)

        commit("ADD_STATION", response.data)
        commit("SET_LOADING", false)

        return response.data
      } catch (error) {
        commit("SET_LOADING", false)
        commit("SET_ERROR", error.response?.data?.message || "Failed to create station")
        throw error
      }
    },

    async updateStation({ commit }, { stationId, stationData }) {
      try {
        commit("SET_LOADING", true)

        const response = await axios.put(`/stations/${stationId}`, stationData)

        commit("UPDATE_STATION", response.data)
        commit("SET_LOADING", false)

        return response.data
      } catch (error) {
        commit("SET_LOADING", false)
        commit("SET_ERROR", error.response?.data?.message || "Failed to update station")
        throw error
      }
    },

    async deleteStation({ commit }, stationId) {
      try {
        commit("SET_LOADING", true)

        await axios.delete(`/stations/${stationId}`)

        commit("REMOVE_STATION", stationId)
        commit("SET_LOADING", false)

        return true
      } catch (error) {
        commit("SET_LOADING", false)
        commit("SET_ERROR", error.response?.data?.message || "Failed to delete station")
        throw error
      }
    },

    async fetchNearbyStations({ commit }, { lat, lng, distance = 10 }) {
      try {
        commit("SET_LOADING", true)

        const response = await axios.get(`/stations/near/${lat}/${lng}/${distance}`)

        commit("SET_STATIONS", response.data)
        commit("SET_LOADING", false)

        return response.data
      } catch (error) {
        commit("SET_LOADING", false)
        commit("SET_ERROR", error.response?.data?.message || "Failed to fetch nearby stations")
        throw error
      }
    },
  },
})
