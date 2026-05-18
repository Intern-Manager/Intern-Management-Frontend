import axiosInstance from './constant/axiosInstance';

export interface UploadResponse {
  url: string;
}

export const uploadService = {
  uploadFile: async (file: File, folder: string = 'general'): Promise<string> => {
    const formData = new FormData();
    formData.append('file', file);

    const response = await axiosInstance.post<UploadResponse>(`/api/uploads/file?folder=${encodeURIComponent(folder)}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return response.data.url;
  },
};
