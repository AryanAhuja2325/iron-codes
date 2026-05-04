import axios from "axios"

const API_URL = import.meta.env.VITE_API_BASE_URL

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
})


api.interceptors.request.use((config) => {
  console.log("📤 REQUEST SENT:")
  console.log("URL:", config.url)
  console.log("Headers:", config.headers)
  console.log("WithCredentials:", config.withCredentials)

  return config
})

// ==============================
// ERROR HANDLER
// ==============================

const handleError = (error: any, defaultMsg: string) => {
  throw new Error(error.response?.data?.message || defaultMsg)
}

// ==============================
// TYPES
// ==============================

export type ProblemFilters = {
  difficulty?: string
  tag?: string
  search?: string
}

// ==============================
// API CALLS
// ==============================

// GET ALL PROBLEMS
export const getProblems = async (filters: ProblemFilters = {}) => {
  try {
    const res = await api.get("/problems", { params: filters })
    return res.data
  } catch (error: any) {
    handleError(error, "Failed to fetch problems")
  }
}

// GET SINGLE PROBLEM
export const getProblemBySlug = async (slug: string) => {
  try {
    const res = await api.get(`/problems/${slug}`)
    return res.data
  } catch (error: any) {
    handleError(error, "Failed to fetch problem")
  }
}

// CREATE PROBLEM
export const createProblem = async (data: any) => {
  try {
    const res = await api.post("/problems", data)
    return res.data
  } catch (error: any) {
    handleError(error, "Failed to create problem")
  }
}

// UPDATE PROBLEM
export const updateProblem = async (id: string, data: any) => {
  try {
    const res = await api.put(`/problems/${id}`, data)
    return res.data
  } catch (error: any) {
    handleError(error, "Failed to update problem")
  }
}

// DELETE PROBLEM
export const deleteProblem = async (id: string) => {
  try {
    const res = await api.delete(`/problems/${id}`)
    return res.data
  } catch (error: any) {
    handleError(error, "Failed to delete problem")
  }
}

// TOGGLE PUBLISH
export const togglePublish = async (id: string) => {
  try {
    const res = await api.patch(`/problems/${id}/toggle`, {})
    return res.data
  } catch (error: any) {
    handleError(error, "Failed to toggle publish")
  }
}

// SUBMIT CODE
export const submitCode = async (data: any) => {
  console.log(data)
  const res = await api.post("/submissions", data)
  return res.data
}