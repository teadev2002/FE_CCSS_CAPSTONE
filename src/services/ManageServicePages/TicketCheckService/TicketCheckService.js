import { apiClient } from "../../../api/apiClient.js";

const TicketCheckService = {
  checkTicket: async ({ eventId, ticketCode, quantity }) => {
    try {
      console.log(`Checking ticket: eventId=${eventId}, ticketCode=${ticketCode}, quantity=${quantity}`);
      const response = await apiClient.put("/api/TicketAccount/Ticketcheck", {
        eventId,
        ticketCode,
        quantity,
      });
      console.log("CheckTicket response:", response.data);
      return response.data; // Trả về { notification, totalInitialTickets, totalRemainingTickets, ... }
    } catch (error) {
      console.error("Error checking ticket:", error.response?.data || error);
      const errorMessage =
        error.response?.data?.notification || // Ưu tiên notification
        error.response?.data?.message || // Hoặc message
        "Error checking ticket";
      throw new Error(errorMessage);
    }
  },
};

export default TicketCheckService;