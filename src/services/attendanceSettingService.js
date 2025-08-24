import api from "../utils/api";

const attendanceSettingService = {
    getAttendanceSetting: async (token) => {
        try {
            const response = await api.get('master-settings/attendance-settings')
            if (response.data) {
                return response.data;
            }
        } catch (error) {
            throw error.response ? error.response.data : { message: 'Network error' };
        }
    },

    updateAttendanceSetting: async (data,id) => {
        try {
            const response = await api.put(`master-settings/attendance-settings/${id}`, data)
            if (response.data) {
                return response.data;
            }
        } catch (error) {
            throw error.response ? error.response.data : { message: 'Network error' };
        }
    }
}

export default attendanceSettingService;