import { axiosInstance } from './axios'

export const approveApplication = async (applicationId: number | string) => {
  await axiosInstance.post(`/v1/applications/${applicationId}/accept`)
}

export const rejectApplication = async (applicationId: number | string) => {
  await axiosInstance.post(`/v1/applications/${applicationId}/reject`)
}
