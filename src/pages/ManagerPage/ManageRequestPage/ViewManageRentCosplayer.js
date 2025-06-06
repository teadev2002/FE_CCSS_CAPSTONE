// import React, { useState, useEffect, useRef } from "react";
// import { Button, Modal, List, Spin, Steps, Popover, Switch } from "antd";
// import { Eye } from "lucide-react";
// import MyHistoryService from "../../../services/HistoryService/MyHistoryService";
// import { toast } from "react-toastify";
// import dayjs from "dayjs";

// const TaskStatus = {
//   Pending: "Pending",
//   Assignment: "Assignment",
//   Progressing: "Progressing",
//   Completed: "Completed",
//   Cancel: "Cancel",
// };

// const ViewManageRentCosplayer = ({ requestId }) => {
//   const [isViewModalVisible, setIsViewModalVisible] = useState(false);
//   const [loading, setLoading] = useState(false);
//   const [modalData, setModalData] = useState({
//     name: "",
//     description: "",
//     location: "",
//     deposit: "N/A",
//     listRequestCharacters: [],
//     price: 0,
//     status: "Unknown",
//     reason: null,
//   });
//   const [currentPage, setCurrentPage] = useState(1);
//   const pageSize = 2;
//   const isMounted = useRef(true);

//   // State for contract and toggle
//   const [hasContract, setHasContract] = useState(false);
//   const [contractData, setContractData] = useState(null);
//   // State to store tasks and toggle for each cosplayer
//   const [cosplayerTasks, setCosplayerTasks] = useState({});
//   const [cosplayerToggles, setCosplayerToggles] = useState({});

//   useEffect(() => {
//     return () => {
//       isMounted.current = false;
//     };
//   }, []);

//   const calculateCharacterDuration = (requestDateResponses) => {
//     let totalHours = 0;
//     const uniqueDays = new Set();

//     (requestDateResponses || []).forEach((dateResponse) => {
//       const start = dayjs(dateResponse.startDate, "HH:mm DD/MM/YYYY");
//       const end = dayjs(dateResponse.endDate, "HH:mm DD/MM/YYYY");

//       if (start.isValid() && end.isValid() && start < end) {
//         const durationHours = end.diff(start, "hour", true);
//         totalHours += durationHours;

//         let current = start.startOf("day");
//         const endDay = end.startOf("day");
//         while (current <= endDay) {
//           uniqueDays.add(current.format("DD/MM/YYYY"));
//           current = current.add(1, "day");
//         }
//       }
//     });

//     return { totalHours, totalDays: uniqueDays.size };
//   };

//   const calculateCosplayerPrice = (
//     totalHours,
//     totalDays,
//     hourlyRate,
//     characterPrice
//   ) => {
//     const hoursCost = totalHours * hourlyRate;
//     const daysCost = characterPrice * totalDays;
//     return (hoursCost + daysCost).toLocaleString();
//   };

//   const fetchTasksForCosplayer = async (cosplayerId, contractId) => {
//     try {
//       const tasksResponse =
//         await MyHistoryService.getTaskByCosplayerIdInContract(cosplayerId);
//       if (tasksResponse) {
//         // Lọc tasks theo contractId
//         const matchingTasks = tasksResponse.filter(
//           (task) => task.contractId === contractId
//         );
//         // Sắp xếp tasks theo startDate
//         return matchingTasks.sort((a, b) =>
//           dayjs(a.startDate, "HH:mm DD/MM/YYYY").diff(
//             dayjs(b.startDate, "HH:mm DD/MM/YYYY")
//           )
//         );
//       }
//       return [];
//     } catch (error) {
//       console.warn(
//         `Failed to fetch tasks for cosplayer ${cosplayerId}:`,
//         error
//       );
//       return [];
//     }
//   };

//   const handleToggleStatusProgression = async (
//     cosplayerId,
//     contractId,
//     checked
//   ) => {
//     setCosplayerToggles((prev) => ({
//       ...prev,
//       [cosplayerId]: checked,
//     }));

//     if (checked && !cosplayerTasks[cosplayerId]) {
//       const tasks = await fetchTasksForCosplayer(cosplayerId, contractId);
//       setCosplayerTasks((prev) => ({
//         ...prev,
//         [cosplayerId]: tasks,
//       }));
//     }
//   };

//   const handleViewRequest = async () => {
//     setLoading(true);
//     setIsViewModalVisible(true);
//     try {
//       const data = await MyHistoryService.getRequestByRequestId(requestId);
//       if (!data) throw new Error("Request data not found");

//       const formattedData = {
//         name: data.name || "N/A",
//         description: data.description || "N/A",
//         location: data.location || "N/A",
//         deposit: data.deposit || "N/A",
//         listRequestCharacters: [],
//         price: data.price || 0,
//         status: data.status || "Unknown",
//         reason: data.reason || null,
//       };

//       const charactersList = data.charactersListResponse || [];
//       const sharedRequestDates = [];
//       const dateSet = new Set();
//       charactersList.forEach((char) => {
//         const dates = char.requestDateResponses || [];
//         dates.forEach((date) => {
//           const dateKey = `${date.startDate}-${date.endDate}`;
//           if (!dateSet.has(dateKey)) {
//             dateSet.add(dateKey);
//             sharedRequestDates.push({
//               startDate: date.startDate || "",
//               endDate: date.endDate || "",
//               totalHour: date.totalHour || 0,
//             });
//           }
//         });
//       });

//       if (charactersList.length > 0) {
//         const listRequestCharacters = await Promise.all(
//           charactersList.map(async (char) => {
//             const { totalHours, totalDays } =
//               calculateCharacterDuration(sharedRequestDates);

//             let cosplayerName = "Not Assigned";
//             let salaryIndex = 1;
//             let characterPrice = 0;

//             const characterData = await MyHistoryService.getCharacterById(
//               char.characterId
//             );
//             characterPrice = characterData?.price || 0;

//             if (char.cosplayerId) {
//               try {
//                 const cosplayerData =
//                   await MyHistoryService.gotoHistoryByAccountId(
//                     char.cosplayerId
//                   );
//                 cosplayerName = cosplayerData?.name || "Unknown";
//                 salaryIndex = cosplayerData?.salaryIndex || 1;
//               } catch (cosplayerError) {
//                 console.warn(
//                   `Failed to fetch cosplayer data for ID ${char.cosplayerId}:`,
//                   cosplayerError
//                 );
//               }
//             }

//             return {
//               cosplayerId: char.cosplayerId || null,
//               characterId: char.characterId,
//               cosplayerName,
//               characterName: characterData?.characterName || "Unknown",
//               characterImage: char.characterImages?.[0]?.urlImage || "",
//               quantity: char.quantity || 1,
//               salaryIndex,
//               characterPrice,
//               totalHours,
//               totalDays,
//               requestDates: sharedRequestDates,
//               status: char.status || "Unknown",
//             };
//           })
//         );

//         formattedData.listRequestCharacters = listRequestCharacters;
//       }

//       // Check for contract using accountId and filter by requestId
//       try {
//         const accountId = data.accountId;
//         if (!accountId) throw new Error("Account ID not found in request data");

//         const contracts = await MyHistoryService.getAllContractByAccountId(
//           accountId
//         );
//         console.log("All contracts for account:", contracts);

//         const matchingContract = contracts.find(
//           (contract) => contract.requestId === requestId
//         );
//         console.log("Matching contract:", matchingContract);

//         if (matchingContract && matchingContract.contractId) {
//           const contractResponse =
//             await MyHistoryService.getContractByContractId(
//               matchingContract.contractId
//             );
//           console.log("Contract response:", contractResponse);

//           setHasContract(true);
//           setContractData(contractResponse);
//         } else {
//           setHasContract(false);
//           setContractData(null);
//         }
//       } catch (contractError) {
//         console.warn("No contract found for this request:", contractError);
//         setHasContract(false);
//         setContractData(null);
//       }

//       if (isMounted.current) {
//         setModalData(formattedData);
//       }
//     } catch (error) {
//       console.error("Failed to fetch request details:", error);
//       if (isMounted.current) {
//         toast.error("Failed to load request details.");
//       }
//     } finally {
//       if (isMounted.current) {
//         setLoading(false);
//       }
//     }
//   };

//   const handleModalConfirm = () => {
//     setIsViewModalVisible(false);
//     setCosplayerToggles({}); // Reset toggles when closing modal
//     setCosplayerTasks({}); // Reset tasks when closing modal
//   };

//   const handlePageChange = (page) => {
//     setCurrentPage(page);
//   };

//   // Status Progression Logic for a single cosplayer
//   const getStatusProgression = (cosplayerId, contractId) => {
//     const tasks = cosplayerTasks[cosplayerId] || [];
//     const today = dayjs();

//     // Lọc tasks theo contractId (đảm bảo chỉ lấy tasks của hợp đồng hiện tại)
//     const contractTasks = tasks.filter(
//       (task) => task.contractId === contractId
//     );

//     if (contractTasks.length === 0) {
//       return {
//         currentStatusIndex: -1,
//         isCancelled: false,
//         filteredStepsItems: [],
//         dailyProgress: [],
//       };
//     }

//     // Tạo danh sách các ngày làm việc
//     const dailyProgress = contractTasks.map((task) => {
//       const startDate = dayjs(task.startDate, "HH:mm DD/MM/YYYY");
//       const endDate = dayjs(task.endDate, "HH:mm DD/MM/YYYY");
//       const day = startDate.startOf("day");

//       // Suy ra trạng thái dựa trên ngày và trạng thái task
//       let status = task.status;
//       if (task.status === "Cancel") {
//         status = "Cancel";
//       } else if (day.isBefore(today, "day")) {
//         status = "Completed"; // Ngày đã qua được coi là hoàn thành
//       } else if (day.isSame(today, "day")) {
//         status = "Progressing"; // Ngày hiện tại đang thực hiện
//       } else {
//         status = "Pending"; // Ngày tương lai chưa bắt đầu
//       }

//       return {
//         date: day.format("DD/MM/YYYY"),
//         status,
//         details: `  (${startDate.format("HH:mm")} - ${endDate.format(
//           "HH:mm"
//         )})`, // Chỉ lấy giờ
//       };
//     });

//     // Tạo các bước cho Steps
//     const stepsItems = dailyProgress.map((day, index) => ({
//       title: `Day ${index + 1} (${day.date})`,
//       description: day.details,
//       status:
//         day.status === "Completed"
//           ? "finish"
//           : day.status === "Progressing"
//           ? "process"
//           : day.status === "Cancel"
//           ? "error"
//           : "wait",
//     }));

//     // Xác định bước hiện tại
//     const currentStatusIndex = dailyProgress.findIndex(
//       (day) => day.status === "Progressing"
//     );
//     const isCancelled = dailyProgress.some((day) => day.status === "Cancel");

//     return {
//       currentStatusIndex:
//         currentStatusIndex >= 0 ? currentStatusIndex : dailyProgress.length - 1,
//       isCancelled,
//       filteredStepsItems: isCancelled
//         ? stepsItems
//         : stepsItems.filter((item) => item.status !== "error"),
//       dailyProgress,
//     };
//   };
//   return (
//     <>
//       <Button size="small" className="btn-view" onClick={handleViewRequest}>
//         View
//       </Button>
//       <Modal
//         title="View Details"
//         open={isViewModalVisible}
//         onOk={handleModalConfirm}
//         onCancel={() => setIsViewModalVisible(false)}
//         okText="Close"
//         width={800}
//       >
//         {loading ? (
//           <div style={{ textAlign: "center", padding: "20px" }}>
//             <Spin />
//           </div>
//         ) : (
//           <>
//             <p>
//               <strong>Total Price:</strong>{" "}
//               <strong>{(modalData.price || 0).toLocaleString()} VND</strong>
//             </p>
//             <hr />
//             <div style={{ display: "flex", flexWrap: "wrap", gap: "20px" }}>
//               <div className="mb-3" style={{ flex: "1 1 10%", padding: "5px" }}>
//                 <p>
//                   <strong>Name:</strong> {modalData.name}
//                 </p>
//               </div>
//               <div className="mb-3" style={{ flex: "1 1 10%", padding: "5px" }}>
//                 <p>
//                   <strong>Deposit:</strong> {modalData.deposit}%
//                 </p>
//               </div>
//               <div className="mb-3" style={{ flex: "1 1 10%", padding: "5px" }}>
//                 <p>
//                   <strong>Location:</strong> {modalData.location}
//                 </p>
//               </div>
//               <div className="mb-3" style={{ flex: "1 1 10%", padding: "5px" }}>
//                 <p>
//                   <strong>Description:</strong> {modalData.description}
//                 </p>
//               </div>
//             </div>

//             <h4>List of Requested Characters:</h4>
//             {modalData.listRequestCharacters.length > 0 ? (
//               <List
//                 dataSource={modalData.listRequestCharacters}
//                 pagination={{
//                   current: currentPage,
//                   pageSize: pageSize,
//                   total: modalData.listRequestCharacters.length,
//                   onChange: handlePageChange,
//                   showSizeChanger: false,
//                 }}
//                 renderItem={(item, index) => {
//                   const showToggle =
//                     hasContract &&
//                     item.cosplayerId &&
//                     item.cosplayerId !== "Not Assigned";
//                   const {
//                     currentStatusIndex,
//                     isCancelled,
//                     filteredStepsItems,
//                     dailyProgress, // Lấy dailyProgress từ getStatusProgression
//                   } = showToggle
//                     ? getStatusProgression(
//                         item.cosplayerId,
//                         contractData.contractId
//                       )
//                     : {
//                         currentStatusIndex: -1,
//                         isCancelled: false,
//                         filteredStepsItems: [],
//                         dailyProgress: [],
//                       };

//                   // Tạo customDot động với dailyProgress
//                   const customDot = (dot, { status, index }) => (
//                     <Popover
//                       content={
//                         <span>
//                           Day {index + 1} status: {status} <br />
//                           Details:{" "}
//                           {dailyProgress[index]?.details ||
//                             "No details available"}
//                         </span>
//                       }
//                     >
//                       {dot}
//                     </Popover>
//                   );

//                   return (
//                     <List.Item key={index}>
//                       <div
//                         style={{
//                           display: "flex",
//                           alignItems: "center",
//                           width: "100%",
//                         }}
//                       >
//                         <div style={{ flex: 1 }}>
//                           <div
//                             style={{
//                               display: index === 0 ? "block" : "none",
//                             }}
//                           >
//                             <p>
//                               <strong>
//                                 Request Dates (for All Cosplayers):
//                               </strong>
//                             </p>
//                             <ul>
//                               {item.requestDates.length > 0 ? (
//                                 item.requestDates.map((date, idx) => (
//                                   <li key={idx}>
//                                     {date.startDate} - {date.endDate} (Total
//                                     Hours: {date.totalHour || 0})
//                                   </li>
//                                 ))
//                               ) : (
//                                 <li>No date-time data available</li>
//                               )}
//                             </ul>
//                           </div>
//                           <p>
//                             <strong>{item.cosplayerName}</strong> as{" "}
//                             <strong>{item.characterName}</strong>
//                           </p>
//                           <p className="d-flex">
//                             <strong>Request Character Status: </strong> &nbsp;
//                             <i>
//                               <u>{item.status}</u>
//                             </i>
//                           </p>
//                           <p>
//                             Quantity: {item.quantity} | Hourly Rate:{" "}
//                             {item.salaryIndex.toLocaleString()} VND/h |
//                             Character Price:{" "}
//                             {item.characterPrice.toLocaleString()} VND
//                           </p>
//                           <p>
//                             <strong>Cost for this Cosplayer:</strong>{" "}
//                             {calculateCosplayerPrice(
//                               item.totalHours,
//                               item.totalDays,
//                               item.salaryIndex,
//                               item.characterPrice
//                             )}{" "}
//                             VND
//                           </p>

//                           {/* Toggle for Status Progression for each cosplayer */}
//                           {showToggle && (
//                             <div
//                               style={{
//                                 marginTop: "10px",
//                                 marginBottom: "10px",
//                               }}
//                             >
//                               <Switch
//                                 checked={
//                                   cosplayerToggles[item.cosplayerId] || false
//                                 }
//                                 onChange={(checked) =>
//                                   handleToggleStatusProgression(
//                                     item.cosplayerId,
//                                     contractData.contractId,
//                                     checked
//                                   )
//                                 }
//                                 checkedChildren="Hide Status Progression"
//                                 unCheckedChildren="View Status Progression"
//                               />
//                             </div>
//                           )}

//                           {/* Status Progression Section for each cosplayer */}
//                           {showToggle && cosplayerToggles[item.cosplayerId] && (
//                             <>
//                               <h5>
//                                 Task Status Progression for {item.cosplayerName}
//                               </h5>
//                               {cosplayerTasks[item.cosplayerId]?.length > 0 ? (
//                                 <Steps
//                                   current={currentStatusIndex}
//                                   progressDot={customDot} // Sử dụng customDot động
//                                   items={filteredStepsItems}
//                                   style={{ marginBottom: "20px" }}
//                                 />
//                               ) : (
//                                 <p>
//                                   No tasks found for this cosplayer in the
//                                   contract.
//                                 </p>
//                               )}
//                             </>
//                           )}
//                         </div>
//                       </div>
//                     </List.Item>
//                   );
//                 }}
//               />
//             ) : (
//               <p>No characters requested.</p>
//             )}
//             {modalData.status === "Cancel" && modalData.reason && (
//               <h4 className="reason-text" style={{ color: "red" }}>
//                 <strong>Reason:</strong>{" "}
//                 <span style={{ color: "red" }}>{modalData.reason}</span>
//               </h4>
//             )}
//           </>
//         )}
//       </Modal>
//     </>
//   );
// };

// export default ViewManageRentCosplayer;

// fix thanh tiến trình của cosplayer:
import React, { useState, useEffect, useRef } from "react";
import { Button, Modal, List, Spin, Steps, Popover, Switch } from "antd";
import { Eye } from "lucide-react";
import MyHistoryService from "../../../services/HistoryService/MyHistoryService";
import { toast } from "react-toastify";
import dayjs from "dayjs";

// Custom CSS for dynamic line colors
const styles = `
  .custom-steps .ant-steps-item-tail::after {
    height: 2px !important;
  }
  .custom-steps .step-past .ant-steps-item-tail::after {
    background-color: #1890ff !important;
  }
  .custom-steps .step-future .ant-steps-item-tail::after {
    background-color: #d9d9d9 !important;
  }
  .custom-steps .ant-steps-item-tail::after {
    transition: background-color 0.3s;
  }
`;

const TaskStatus = {
  Pending: "Pending",
  Assignment: "Assignment",
  Progressing: "Progressing",
  Completed: "Completed",
  Cancel: "Cancel",
};

const ViewManageRentCosplayer = ({ requestId }) => {
  const [isViewModalVisible, setIsViewModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [modalData, setModalData] = useState({
    name: "",
    description: "",
    location: "",
    deposit: "N/A",
    listRequestCharacters: [],
    price: 0,
    status: "Unknown",
    reason: null,
  });
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 2;
  const isMounted = useRef(true);

  // State for contract and toggle
  const [hasContract, setHasContract] = useState(false);
  const [contractData, setContractData] = useState(null);
  // State to store tasks and toggle for each cosplayer
  const [cosplayerTasks, setCosplayerTasks] = useState({});
  const [cosplayerToggles, setCosplayerToggles] = useState({});

  // Current date for comparison
  const currentDate = dayjs(); // May 27, 2025, 04:27 PM +07

  // Inject custom styles
  useEffect(() => {
    const styleSheet = document.createElement("style");
    styleSheet.type = "text/css";
    styleSheet.innerText = styles;
    document.head.appendChild(styleSheet);

    return () => {
      document.head.removeChild(styleSheet);
    };
  }, []);

  useEffect(() => {
    return () => {
      isMounted.current = false;
    };
  }, []);

  const calculateCharacterDuration = (requestDateResponses) => {
    let totalHours = 0;
    const uniqueDays = new Set();

    (requestDateResponses || []).forEach((dateResponse) => {
      const start = dayjs(dateResponse.startDate, "HH:mm DD/MM/YYYY");
      const end = dayjs(dateResponse.endDate, "HH:mm DD/MM/YYYY");

      if (start.isValid() && end.isValid() && start < end) {
        const durationHours = end.diff(start, "hour", true);
        totalHours += durationHours;

        let current = start.startOf("day");
        const endDay = end.startOf("day");
        while (current <= endDay) {
          uniqueDays.add(current.format("DD/MM/YYYY"));
          current = current.add(1, "day");
        }
      }
    });

    return { totalHours, totalDays: uniqueDays.size };
  };

  const calculateCosplayerPrice = (
    totalHours,
    totalDays,
    hourlyRate,
    characterPrice
  ) => {
    const hoursCost = totalHours * hourlyRate;
    const daysCost = characterPrice * totalDays;
    return (hoursCost + daysCost).toLocaleString();
  };

  const fetchTasksForCosplayer = async (cosplayerId, contractId) => {
    try {
      // Fetch tasks from the old API for date-time information
      const tasksWithDates =
        await MyHistoryService.getTaskByCosplayerIdInContract(cosplayerId);
      // Fetch tasks from the new API for status information
      const tasksWithStatus = await MyHistoryService.getTaskByContractId(
        contractId
      );

      if (tasksWithDates && tasksWithStatus) {
        // Filter tasks by contractId (for old API) and cosplayerId (for new API)
        const matchingTasksWithDates = tasksWithDates.filter(
          (task) => task.contractId === contractId
        );
        const matchingTasksWithStatus = tasksWithStatus.filter(
          (task) => task.accountId === cosplayerId
        );

        // Combine data: match tasks by startDate and taskName
        const combinedTasks = matchingTasksWithDates.map((taskWithDate) => {
          const matchingStatusTask = matchingTasksWithStatus.find(
            (taskWithStatus) =>
              dayjs(taskWithStatus.startDate, "DD/MM/YYYY").isSame(
                dayjs(taskWithDate.startDate, "HH:mm DD/MM/YYYY"),
                "day"
              ) && taskWithStatus.taskName === taskWithDate.taskName
          );

          return {
            ...taskWithDate,
            status: matchingStatusTask
              ? matchingStatusTask.status
              : taskWithDate.status || "Unknown",
          };
        });

        // Sort tasks by startDate
        return combinedTasks.sort((a, b) =>
          dayjs(a.startDate, "HH:mm DD/MM/YYYY").diff(
            dayjs(b.startDate, "HH:mm DD/MM/YYYY")
          )
        );
      }
      return [];
    } catch (error) {
      console.warn(
        `Failed to fetch tasks for cosplayer ${cosplayerId} in contract ${contractId}:`,
        error
      );
      return [];
    }
  };

  const handleToggleStatusProgression = async (
    cosplayerId,
    contractId,
    checked
  ) => {
    setCosplayerToggles((prev) => ({
      ...prev,
      [cosplayerId]: checked,
    }));

    if (checked && !cosplayerTasks[cosplayerId]) {
      const tasks = await fetchTasksForCosplayer(cosplayerId, contractId);
      setCosplayerTasks((prev) => ({
        ...prev,
        [cosplayerId]: tasks,
      }));
    }
  };

  const handleViewRequest = async () => {
    setLoading(true);
    setIsViewModalVisible(true);
    try {
      const data = await MyHistoryService.getRequestByRequestId(requestId);
      if (!data) throw new Error("Request data not found");

      const formattedData = {
        name: data.name || "N/A",
        description: data.description || "N/A",
        location: data.location || "N/A",
        deposit: data.deposit || "N/A",
        listRequestCharacters: [],
        price: data.price || 0,
        status: data.status || "Unknown",
        reason: data.reason || null,
      };

      const charactersList = data.charactersListResponse || [];
      const sharedRequestDates = [];
      const dateSet = new Set();
      charactersList.forEach((char) => {
        const dates = char.requestDateResponses || [];
        dates.forEach((date) => {
          const dateKey = `${date.startDate}-${date.endDate}`;
          if (!dateSet.has(dateKey)) {
            dateSet.add(dateKey);
            sharedRequestDates.push({
              startDate: date.startDate || "",
              endDate: date.endDate || "",
              totalHour: date.totalHour || 0,
            });
          }
        });
      });

      if (charactersList.length > 0) {
        const listRequestCharacters = await Promise.all(
          charactersList.map(async (char) => {
            const { totalHours, totalDays } =
              calculateCharacterDuration(sharedRequestDates);

            let cosplayerName = "Not Assigned";
            let salaryIndex = 1;
            let characterPrice = 0;

            const characterData = await MyHistoryService.getCharacterById(
              char.characterId
            );
            characterPrice = characterData?.price || 0;

            if (char.cosplayerId) {
              try {
                const cosplayerData =
                  await MyHistoryService.gotoHistoryByAccountId(
                    char.cosplayerId
                  );
                cosplayerName = cosplayerData?.name || "Unknown";
                salaryIndex = cosplayerData?.salaryIndex || 1;
              } catch (cosplayerError) {
                console.warn(
                  `Failed to fetch cosplayer data for ID ${char.cosplayerId}:`,
                  cosplayerError
                );
              }
            }

            return {
              cosplayerId: char.cosplayerId || null,
              characterId: char.characterId,
              cosplayerName,
              characterName: characterData?.characterName || "Unknown",
              characterImage: char.characterImages?.[0]?.urlImage || "",
              quantity: char.quantity || 1,
              salaryIndex,
              characterPrice,
              totalHours,
              totalDays,
              requestDates: sharedRequestDates,
              status: char.status || "Unknown",
            };
          })
        );

        formattedData.listRequestCharacters = listRequestCharacters;
      }

      try {
        const accountId = data.accountId;
        if (!accountId) throw new Error("Account ID not found in request data");

        const contracts = await MyHistoryService.getAllContractByAccountId(
          accountId
        );
        console.log("All contracts for account:", contracts);

        const matchingContract = contracts.find(
          (contract) => contract.requestId === requestId
        );
        console.log("Matching contract:", matchingContract);

        if (matchingContract && matchingContract.contractId) {
          const contractResponse =
            await MyHistoryService.getContractByContractId(
              matchingContract.contractId
            );
          console.log("Contract response:", contractResponse);

          setHasContract(true);
          setContractData(contractResponse);
        } else {
          setHasContract(false);
          setContractData(null);
        }
      } catch (contractError) {
        console.warn("No contract found for this request:", contractError);
        setHasContract(false);
        setContractData(null);
      }

      if (isMounted.current) {
        setModalData(formattedData);
      }
    } catch (error) {
      console.error("Failed to fetch request details:", error);
      if (isMounted.current) {
        toast.error("Failed to load request details.");
      }
    } finally {
      if (isMounted.current) {
        setLoading(false);
      }
    }
  };

  const handleModalConfirm = () => {
    setIsViewModalVisible(false);
    setCosplayerToggles({});
    setCosplayerTasks({});
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const getStatusProgression = (cosplayerId, contractId) => {
    const tasks = cosplayerTasks[cosplayerId] || [];

    if (tasks.length === 0) {
      return {
        currentStatusIndex: -1,
        isCancelled: false,
        filteredStepsItems: [],
        dailyProgress: [],
      };
    }

    // Create daily progress using date-time from old API and status from new API
    const dailyProgress = tasks.map((task) => {
      const startDate = dayjs(task.startDate, "HH:mm DD/MM/YYYY");
      const endDate = dayjs(task.endDate, "HH:mm DD/MM/YYYY");

      return {
        date: startDate.format("DD/MM/YYYY"),
        startDate: startDate, // Keep the full date for comparison
        status: task.status, // Status from new API
        details: `(${startDate.format("HH:mm")} - ${endDate.format("HH:mm")})`, // Time from old API
      };
    });

    // Create steps for the Steps component
    const stepsItems = dailyProgress.map((day, index) => {
      // Determine if this step's date is on or before the current date
      const isPastOrCurrent =
        day.startDate.isBefore(currentDate, "day") ||
        day.startDate.isSame(currentDate, "day");

      return {
        title: `Day ${index + 1} (${day.date})`,
        description: day.details,
        status: day.status, // Use API status for dot color
        className: isPastOrCurrent ? "step-past" : "step-future", // Add class for styling
      };
    });

    // Find the current step (first non-completed task)
    const currentStatusIndex = dailyProgress.findIndex(
      (day) => day.status !== "Completed" && day.status !== "Cancel"
    );
    const isCancelled = dailyProgress.some((day) => day.status === "Cancel");

    return {
      currentStatusIndex:
        currentStatusIndex >= 0 ? currentStatusIndex : dailyProgress.length - 1,
      isCancelled,
      filteredStepsItems: isCancelled
        ? stepsItems
        : stepsItems.filter((item) => item.status !== "error"),
      dailyProgress,
    };
  };

  return (
    <>
      <Button className="btn-view" onClick={handleViewRequest}>
        View
      </Button>
      <Modal
        title="View Details"
        open={isViewModalVisible}
        onOk={handleModalConfirm}
        onCancel={() => setIsViewModalVisible(false)}
        width={800}
        footer={null}
      >
        {loading ? (
          <div style={{ textAlign: "center", padding: "20px" }}>
            <Spin />
          </div>
        ) : (
          <>
            <p>
              <strong>Total Price:</strong>{" "}
              <strong>{(modalData.price || 0).toLocaleString()} VND</strong>
            </p>
            <hr />
            <div style={{ display: "flex", flexWrap: "wrap", gap: "20px" }}>
              <div className="mb-3" style={{ flex: "1 1 10%", padding: "5px" }}>
                <p>
                  <strong>Name:</strong> {modalData.name}
                </p>
              </div>
              <div className="mb-3" style={{ flex: "1 1 10%", padding: "5px" }}>
                <p>
                  <strong>Deposit:</strong> {modalData.deposit}%
                </p>
              </div>
              <div className="mb-3" style={{ flex: "1 1 10%", padding: "5px" }}>
                <p>
                  <strong>Location:</strong> {modalData.location}
                </p>
              </div>
              <div className="mb-3" style={{ flex: "1 1 10%", padding: "5px" }}>
                <p>
                  <strong>Description:</strong> {modalData.description}
                </p>
              </div>
            </div>

            <h4>List of Requested Characters:</h4>
            {modalData.listRequestCharacters.length > 0 ? (
              <List
                dataSource={modalData.listRequestCharacters}
                pagination={{
                  current: currentPage,
                  pageSize: pageSize,
                  total: modalData.listRequestCharacters.length,
                  onChange: handlePageChange,
                  showSizeChanger: false,
                }}
                renderItem={(item, index) => {
                  const showToggle =
                    hasContract &&
                    item.cosplayerId &&
                    item.cosplayerId !== "Not Assigned";
                  const {
                    currentStatusIndex,
                    isCancelled,
                    filteredStepsItems,
                    dailyProgress,
                  } = showToggle
                    ? getStatusProgression(
                        item.cosplayerId,
                        contractData.contractId
                      )
                    : {
                        currentStatusIndex: -1,
                        isCancelled: false,
                        filteredStepsItems: [],
                        dailyProgress: [],
                      };

                  const customDot = (dot, { status, index }) => {
                    const statusColors = {
                      Pending: "#1890ff", // Blue
                      Assignment: "#1890ff", // Blue
                      Progressing: "#faad14", // Yellow
                      Completed: "#52c41a", // Green
                      Cancel: "#ff4d4f", // Red
                      Wait: "#d9d9d9", // Gray
                    };

                    const dotColor = statusColors[status] || "#d9d9d9";

                    return (
                      <Popover
                        content={
                          <span>
                            Day {index + 1} status: {status} <br />
                            Details:{" "}
                            {dailyProgress[index]?.details ||
                              "No details available"}
                          </span>
                        }
                      >
                        <span
                          style={{
                            display: "inline-block",
                            width: "15px",
                            height: "15px",
                            borderRadius: "50%",
                            backgroundColor: dotColor,
                            margin: "0px -10px",
                          }}
                        />
                      </Popover>
                    );
                  };

                  return (
                    <List.Item key={index}>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          width: "100%",
                        }}
                      >
                        <div style={{ flex: 1 }}>
                          <div
                            style={{
                              display: index === 0 ? "block" : "none",
                            }}
                          >
                            <p>
                              <strong>
                                Request Dates (for All Cosplayers):
                              </strong>
                            </p>
                            <ul>
                              {item.requestDates.length > 0 ? (
                                item.requestDates.map((date, idx) => (
                                  <li key={idx}>
                                    {date.startDate} - {date.endDate} (Total
                                    Hours: {date.totalHour || 0})
                                  </li>
                                ))
                              ) : (
                                <li>No date-time data available</li>
                              )}
                            </ul>
                          </div>
                          <p>
                            <strong>{item.cosplayerName}</strong> as{" "}
                            <strong>{item.characterName}</strong>
                          </p>
                          <p className="d-flex">
                            <strong>Request Character Status: &nbsp; </strong>
                            <i
                              className={`fw-bold ${
                                item.status === "Accept"
                                  ? "text-success"
                                  : item.status === "Busy"
                                  ? "text-danger"
                                  : "text-danger"
                              }`}
                            >
                              {item.status}
                            </i>
                          </p>
                          <p>
                            Quantity: {item.quantity} | Hourly Rate:{" "}
                            {item.salaryIndex.toLocaleString()} VND/h |
                            Character Price:{" "}
                            {item.characterPrice.toLocaleString()} VND
                          </p>
                          <p>
                            <strong>Cost for this Cosplayer:</strong>{" "}
                            {calculateCosplayerPrice(
                              item.totalHours,
                              item.totalDays,
                              item.salaryIndex,
                              item.characterPrice
                            )}{" "}
                            VND
                          </p>

                          {showToggle && (
                            <div
                              style={{
                                marginTop: "10px",
                                marginBottom: "10px",
                              }}
                            >
                              <Switch
                                checked={
                                  cosplayerToggles[item.cosplayerId] || false
                                }
                                onChange={(checked) =>
                                  handleToggleStatusProgression(
                                    item.cosplayerId,
                                    contractData.contractId,
                                    checked
                                  )
                                }
                                checkedChildren="Hide Status Progression"
                                unCheckedChildren="View Status Progression"
                              />
                            </div>
                          )}

                          {showToggle && cosplayerToggles[item.cosplayerId] && (
                            <>
                              <h5>
                                Task Status Progression for {item.cosplayerName}
                              </h5>
                              {cosplayerTasks[item.cosplayerId]?.length > 0 ? (
                                <Steps
                                  current={currentStatusIndex}
                                  progressDot={customDot}
                                  items={filteredStepsItems}
                                  style={{ marginBottom: "20px" }}
                                  className="custom-steps"
                                />
                              ) : (
                                <p>
                                  No tasks found for this cosplayer in the
                                  contract.
                                </p>
                              )}
                            </>
                          )}
                        </div>
                      </div>
                    </List.Item>
                  );
                }}
              />
            ) : (
              <p>No characters requested.</p>
            )}
            {modalData.status === "Cancel" && modalData.reason && (
              <h4 className="reason-text" style={{ color: "red" }}>
                <strong>Reason:</strong>{" "}
                <span style={{ color: "red" }}>{modalData.reason}</span>
              </h4>
            )}
          </>
        )}
      </Modal>
    </>
  );
};

export default ViewManageRentCosplayer;
