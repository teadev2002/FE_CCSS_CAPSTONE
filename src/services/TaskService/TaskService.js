import axios from "axios";

const TaskService = {
  getAllTaskByCosplayerId: async (accountId) => {
    try {
      const response = await axios.get(`api/Task/accountId/${accountId}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching tasks:", error);
      throw error;
    }
  },
};

export default TaskService;
