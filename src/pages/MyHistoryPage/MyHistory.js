// import React, { useState, useEffect } from "react";
// import {
//   Pagination,
//   Modal,
//   Input,
//   List,
//   Button,
//   Radio,
//   message,
//   Tabs,
// } from "antd";
// import { CloseOutlined } from "@ant-design/icons";
// import MyHistoryService from "../../services/HistoryService/MyHistoryService";
// import RequestService from "../../services/ManageServicePages/ManageRequestService/RequestService.js";
// import { toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
// import "../../styles/MyHistory.scss";
// import { jwtDecode } from "jwt-decode";

// const { TextArea } = Input;
// const { TabPane } = Tabs;

// const MyHistory = () => {
//   const [requests, setRequests] = useState([]);
//   const [filteredPendingRequests, setFilteredPendingRequests] = useState([]);
//   const [contracts, setContracts] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [currentPendingPage, setCurrentPendingPage] = useState(1);
//   const [currentContractPage, setCurrentContractPage] = useState(1);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });
//   const [isViewModalVisible, setIsViewModalVisible] = useState(false);
//   const [isPaymentModalVisible, setIsPaymentModalVisible] = useState(false);
//   const [modalData, setModalData] = useState({
//     name: "",
//     description: "",
//     startDate: "",
//     endDate: "",
//     location: "",
//     listRequestCharacters: [],
//     price: 0,
//   });
//   const [selectedRequestId, setSelectedRequestId] = useState(null);
//   const [depositAmount, setDepositAmount] = useState(null);
//   const [paymentLoading, setPaymentLoading] = useState(false);

//   const itemsPerPage = 5;
//   const accessToken = localStorage.getItem("accessToken");

//   const decoded = jwtDecode(accessToken);
//   const accountId = decoded?.Id;

//   const calculateCosplayerPrice = (salaryIndex, quantity) => {
//     return 100 * salaryIndex * quantity;
//   };

//   const calculateTotalPrice = (characters) => {
//     return characters.reduce(
//       (total, char) =>
//         total + calculateCosplayerPrice(char.salaryIndex, char.quantity),
//       0
//     );
//   };

//   // Fetch requests
//   useEffect(() => {
//     const fetchRequests = async () => {
//       setLoading(true);
//       try {
//         const data = await MyHistoryService.GetAllRequestByAccountId(accountId);
//         const requestsArray = Array.isArray(data) ? data : [data];
//         setRequests(requestsArray);
//       } catch (error) {
//         console.error("Failed to fetch requests:", error);
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchRequests();
//   }, [accountId]);

//   // Fetch contracts
//   useEffect(() => {
//     const fetchContracts = async () => {
//       setLoading(true);
//       try {
//         const data = await MyHistoryService.getAllContractByAccountId(
//           accountId
//         );
//         console.log("Contracts from API:", data);
//         const contractsArray = Array.isArray(data) ? data : [data];
//         setContracts(contractsArray);
//       } catch (error) {
//         console.error("Failed to fetch contracts:", error);
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchContracts();
//   }, [accountId]);

//   // Filter pending requests based on search term and exclude paid requests
//   useEffect(() => {
//     const contractRequestIds = contracts.map((contract) => contract.requestId);
//     const filtered = requests
//       .filter((request) => !contractRequestIds.includes(request.requestId))
//       .filter(
//         (request) =>
//           request.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
//           new Date(request.startDate)
//             .toLocaleDateString("en-GB")
//             .includes(searchTerm)
//       );
//     setFilteredPendingRequests(filtered);
//     setCurrentPendingPage(1);
//   }, [searchTerm, requests, contracts]);

//   // Handle payment and update both requests and contracts
//   useEffect(() => {
//     if (selectedRequestId && depositAmount !== null && paymentLoading) {
//       const processPayment = async () => {
//         try {
//           await MyHistoryService.depositRequest(
//             selectedRequestId,
//             depositAmount
//           );
//           toast.success("Payment successful!", {
//             position: "top-right",
//             autoClose: 3000,
//           });

//           const requestData = await MyHistoryService.GetAllRequestByAccountId(
//             accountId
//           );
//           const requestsArray = Array.isArray(requestData)
//             ? requestData
//             : [requestData];
//           setRequests(requestsArray);

//           const contractData = await MyHistoryService.getAllContractByAccountId(
//             accountId
//           );
//           const contractsArray = Array.isArray(contractData)
//             ? contractData
//             : [contractData];
//           setContracts(contractsArray);
//         } catch (error) {
//           toast.error("Cannot payment, waiting for manager to browsed!", {
//             position: "top-right",
//             autoClose: 3000,
//           });
//         } finally {
//           setPaymentLoading(false);
//           setIsPaymentModalVisible(false);
//           setSelectedRequestId(null);
//           setDepositAmount(null);
//         }
//       };
//       processPayment();
//     }
//   }, [selectedRequestId, depositAmount, paymentLoading, accountId]);

//   const handleSort = (key, tab) => {
//     let direction = "asc";
//     if (sortConfig.key === key && sortConfig.direction === "asc") {
//       direction = "desc";
//     }
//     setSortConfig({ key, direction });

//     if (tab === "pending") {
//       const sorted = [...filteredPendingRequests].sort((a, b) => {
//         if (key === "startDate") {
//           return direction === "asc"
//             ? new Date(a[key]) - new Date(b[key])
//             : new Date(b[key]) - new Date(a[key]);
//         }
//         if (a[key] < b[key]) return direction === "asc" ? -1 : 1;
//         if (a[key] > b[key]) return direction === "asc" ? 1 : -1;
//         return 0;
//       });
//       setFilteredPendingRequests(sorted);
//     } else if (tab === "contracts") {
//       const sorted = [...contracts].sort((a, b) => {
//         const aValue = key === "contractName" ? a.contractName : a[key];
//         const bValue = key === "contractName" ? b.contractName : b[key];
//         if (key === "startDate") {
//           return direction === "asc"
//             ? new Date(aValue) - new Date(bValue)
//             : new Date(bValue) - new Date(aValue);
//         }
//         if (aValue < bValue) return direction === "asc" ? -1 : 1;
//         if (aValue > bValue) return direction === "asc" ? 1 : -1;
//         return 0;
//       });
//       setContracts(sorted);
//     }
//   };

//   const handleViewRequest = async (requestId) => {
//     setLoading(true);
//     setIsViewModalVisible(true);

//     try {
//       const data = await RequestService.getRequestByRequestId(requestId);
//       if (!data) throw new Error("Request data not found");

//       const formattedData = {
//         name: data.name || "N/A",
//         description: data.description || "N/A",
//         startDate: data.startDate || "",
//         endDate: data.endDate || "",
//         location: data.location || "N/A",
//         listRequestCharacters: [],
//         price: 0,
//       };

//       const charactersList = data.charactersListResponse || [];
//       if (charactersList.length > 0) {
//         const listRequestCharacters = await Promise.all(
//           charactersList.map(async (char) => {
//             try {
//               const characterData = await RequestService.getNameCharacterById(
//                 char.characterId
//               );
//               let cosplayerName = "Not Assigned";
//               let salaryIndex = 1;

//               if (char.cosplayerId) {
//                 try {
//                   const cosplayerData =
//                     await RequestService.getNameCosplayerInRequestByCosplayerId(
//                       char.cosplayerId
//                     );
//                   cosplayerName = cosplayerData?.name || "Unknown";
//                   salaryIndex = cosplayerData?.salaryIndex || 1;
//                 } catch (cosplayerError) {
//                   console.warn(
//                     `Failed to fetch cosplayer data for ID ${char.cosplayerId}:`,
//                     cosplayerError
//                   );
//                 }
//               }

//               const price = calculateCosplayerPrice(
//                 salaryIndex,
//                 char.quantity || 0
//               );

//               return {
//                 cosplayerId: char.cosplayerId || null,
//                 characterId: char.characterId,
//                 cosplayerName,
//                 characterName: characterData?.characterName || "Unknown",
//                 quantity: char.quantity || 0,
//                 salaryIndex,
//                 price,
//               };
//             } catch (charError) {
//               console.warn(
//                 `Failed to fetch character data for ID ${char.characterId}:`,
//                 charError
//               );
//               return {
//                 cosplayerId: char.cosplayerId || null,
//                 characterId: char.characterId,
//                 cosplayerName: "Not Assigned",
//                 characterName: "Unknown",
//                 quantity: char.quantity || 0,
//                 salaryIndex: 1,
//                 price: 0,
//               };
//             }
//           })
//         );

//         formattedData.listRequestCharacters = listRequestCharacters;
//         formattedData.price = calculateTotalPrice(listRequestCharacters);
//       }

//       setModalData(formattedData);
//       setLoading(false);
//     } catch (error) {
//       console.error("Failed to fetch request details:", error);
//       setLoading(false);
//     }
//   };

//   const handlePayment = (requestId) => {
//     setSelectedRequestId(requestId);
//     setIsPaymentModalVisible(true);
//   };

//   const handlePaymentConfirm = () => {
//     if (depositAmount === null) {
//       message.warning("Please select a deposit amount.");
//       return;
//     }
//     setPaymentLoading(true);
//   };

//   const handleModalConfirm = () => {
//     console.log("Modal confirmed with data:", modalData);
//     setIsViewModalVisible(false);
//   };

//   const handleRemoveCosplayer = (cosplayerId, characterId) => {
//     console.log(`Removing cosplayer ${cosplayerId} - character ${characterId}`);
//   };

//   const pendingIndexOfLastItem = currentPendingPage * itemsPerPage;
//   const pendingIndexOfFirstItem = pendingIndexOfLastItem - itemsPerPage;
//   const currentPendingItems = filteredPendingRequests.slice(
//     pendingIndexOfFirstItem,
//     pendingIndexOfLastItem
//   );
//   const totalPendingItems = filteredPendingRequests.length;

//   const contractIndexOfLastItem = currentContractPage * itemsPerPage;
//   const contractIndexOfFirstItem = contractIndexOfLastItem - itemsPerPage;
//   const currentContractItems = contracts.slice(
//     contractIndexOfFirstItem,
//     contractIndexOfLastItem
//   );
//   const totalContractItems = contracts.length;

//   const handlePendingPageChange = (page) => {
//     setCurrentPendingPage(page);
//   };

//   const handleContractPageChange = (page) => {
//     setCurrentContractPage(page);
//   };

//   const getStatusText = (status) => {
//     let className = "";
//     let text = "";

//     switch (status) {
//       case "Pending":
//         className = "text-primary";
//         text = "Pending";
//         break;
//       case "Browsed":
//         className = "text-success";
//         text = "Browsed";
//         break;
//       case "Cancel":
//         className = "text-secondary";
//         text = "Cancel";
//         break;
//       case "Active":
//         className = "text-success";
//         text = "Active";
//         break;
//       default:
//         className = "text-secondary";
//         text = "Unknown";
//     }

//     return <span className={className}>{text}</span>;
//   };

//   const formatDate = (dateString) => {
//     if (!dateString || typeof dateString !== "string") return "N/A";
//     try {
//       let dateObj;
//       if (dateString.includes(" ")) {
//         // Định dạng "HH:MM DD/MM/YYYY" từ contracts
//         const [time, date] = dateString.split(" ");
//         const [hours, minutes] = time.split(":");
//         const [day, month, year] = date.split("/");
//         dateObj = new Date(`${year}-${month}-${day}T${hours}:${minutes}:00`);
//       } else {
//         // Định dạng ISO "YYYY-MM-DDTHH:MM:SS" từ requests
//         dateObj = new Date(dateString);
//       }
//       if (isNaN(dateObj.getTime())) throw new Error("Invalid date");
//       return dateObj.toLocaleDateString("vi-VN");
//     } catch (error) {
//       console.warn("Invalid date format:", dateString, error);
//       return "N/A";
//     }
//   };

//   return (
//     <div className="my-history container vh-100">
//       <div className="title-my-history text-center my-4">
//         <span>My History</span>
//       </div>

//       <div className="mb-3">
//         <input
//           type="text"
//           className="form-control"
//           placeholder="Search by name or date..."
//           value={searchTerm}
//           onChange={(e) => setSearchTerm(e.target.value)}
//         />
//       </div>

//       <Tabs defaultActiveKey="1" type="card">
//         <TabPane tab="Pending Requests" key="1">
//           <div className="card">
//             <div className="card-body">
//               {loading ? (
//                 <p className="text-center">Loading...</p>
//               ) : currentPendingItems.length === 0 ? (
//                 <p className="text-center">No pending requests found.</p>
//               ) : (
//                 <>
//                   <table className="table table-hover text-center">
//                     <thead>
//                       <tr>
//                         <th
//                           scope="col"
//                           onClick={() => handleSort("name", "pending")}
//                         >
//                           Customer Name{" "}
//                           {sortConfig.key === "name" &&
//                             (sortConfig.direction === "asc" ? "↑" : "↓")}
//                         </th>
//                         <th scope="col">Status</th>
//                         <th
//                           scope="col"
//                           onClick={() => handleSort("price", "pending")}
//                         >
//                           Total Price{" "}
//                           {sortConfig.key === "price" &&
//                             (sortConfig.direction === "asc" ? "↑" : "↓")}
//                         </th>
//                         <th
//                           scope="col"
//                           onClick={() => handleSort("startDate", "pending")}
//                         >
//                           Start Date{" "}
//                           {sortConfig.key === "startDate" &&
//                             (sortConfig.direction === "asc" ? "↑" : "↓")}
//                         </th>
//                         <th scope="col">Action</th>
//                       </tr>
//                     </thead>
//                     <tbody>
//                       {currentPendingItems.map((request) => (
//                         <tr key={request.requestId}>
//                           <td className="shop-name">{request.name || "N/A"}</td>
//                           <td>{getStatusText(request.status)}</td>
//                           <td className="total-price">
//                             {(request.price || 0).toLocaleString()} $
//                           </td>
//                           <td>{formatDate(request.startDate)}</td>
//                           <td>
//                             <div className="request-buttons">
//                               <button
//                                 className="btn btn-outline-primary btn-sm"
//                                 onClick={() =>
//                                   handleViewRequest(request.requestId)
//                                 }
//                               >
//                                 View
//                               </button>
//                               <button
//                                 className="btn btn-outline-secondary btn-sm"
//                                 onClick={() => handlePayment(request.requestId)}
//                               >
//                                 Select deposit
//                               </button>
//                             </div>
//                           </td>
//                         </tr>
//                       ))}
//                     </tbody>
//                   </table>
//                   <div className="text-center mt-3">
//                     <Pagination
//                       current={currentPendingPage}
//                       pageSize={itemsPerPage}
//                       total={totalPendingItems}
//                       onChange={handlePendingPageChange}
//                       showSizeChanger={false}
//                     />
//                   </div>
//                 </>
//               )}
//             </div>
//           </div>
//         </TabPane>

//         <TabPane tab="Contracts" key="2">
//           <div className="card">
//             <div className="card-body">
//               {loading ? (
//                 <p className="text-center">Loading...</p>
//               ) : currentContractItems.length === 0 ? (
//                 <p className="text-center">No contracts found.</p>
//               ) : (
//                 <>
//                   <table className="table table-hover text-center">
//                     <thead>
//                       <tr>
//                         <th
//                           scope="col"
//                           onClick={() =>
//                             handleSort("contractName", "contracts")
//                           }
//                         >
//                           Contract Name{" "}
//                           {sortConfig.key === "contractName" &&
//                             (sortConfig.direction === "asc" ? "↑" : "↓")}
//                         </th>
//                         <th scope="col">Status</th>
//                         <th
//                           scope="col"
//                           onClick={() => handleSort("price", "contracts")}
//                         >
//                           Total Price{" "}
//                           {sortConfig.key === "price" &&
//                             (sortConfig.direction === "asc" ? "↑" : "↓")}
//                         </th>
//                         <th scope="col">Deposit</th>
//                         <th
//                           scope="col"
//                           onClick={() => handleSort("startDate", "contracts")}
//                         >
//                           Start Date{" "}
//                           {sortConfig.key === "startDate" &&
//                             (sortConfig.direction === "asc" ? "↑" : "↓")}
//                         </th>
//                         <th scope="col">Action</th>
//                       </tr>
//                     </thead>
//                     <tbody>
//                       {currentContractItems.map((contract) => (
//                         <tr key={contract.requestId}>
//                           <td className="shop-name">
//                             {contract.contractName || "N/A"}
//                           </td>
//                           <td>{contract.status}</td>
//                           <td className="total-price">
//                             {(contract.price || 0).toLocaleString()} $
//                           </td>
//                           <td>
//                             {(Number(contract.deposit) || 0).toLocaleString()} $
//                           </td>
//                           <td>{formatDate(contract.startDate)}</td>
//                           <td>
//                             <button
//                               className="btn btn-outline-primary btn-sm"
//                               onClick={() =>
//                                 handleViewRequest(contract.requestId)
//                               }
//                             >
//                               View
//                             </button>{" "}
//                             &nbsp;
//                             <button className="btn btn-outline-success btn-sm">
//                               Update Status
//                             </button>
//                           </td>
//                         </tr>
//                       ))}
//                     </tbody>
//                   </table>
//                   <div className="text-center mt-3">
//                     <Pagination
//                       current={currentContractPage}
//                       pageSize={itemsPerPage}
//                       total={totalContractItems}
//                       onChange={handleContractPageChange}
//                       showSizeChanger={false}
//                     />
//                   </div>
//                 </>
//               )}
//             </div>
//           </div>
//         </TabPane>
//       </Tabs>

//       <Modal
//         title="Confirm Your Request"
//         visible={isViewModalVisible}
//         onOk={handleModalConfirm}
//         onCancel={() => setIsViewModalVisible(false)}
//         okText="Send Request"
//         cancelText="Edit"
//       >
//         <p>
//           <strong>Name:</strong>
//         </p>
//         <Input
//           value={modalData.name}
//           onChange={(e) => setModalData({ ...modalData, name: e.target.value })}
//           placeholder="Your account name"
//           style={{ width: "250px" }}
//         />
//         <p>
//           <strong>Description:</strong>
//         </p>
//         <TextArea
//           value={modalData.description}
//           onChange={(e) =>
//             setModalData({ ...modalData, description: e.target.value })
//           }
//           placeholder="Enter description"
//           style={{ width: "300px" }}
//         />
//         <p>
//           <strong>Start DateTime:</strong> {formatDate(modalData.startDate)}
//         </p>
//         <p>
//           <strong>End DateTime:</strong> {formatDate(modalData.endDate)}
//         </p>
//         <p>
//           <strong>Location:</strong> {modalData.location || "N/A"}
//         </p>
//         <p>
//           <strong>Coupon ID:</strong> {"N/A"}
//         </p>
//         <h4>List of Requested Characters:</h4>
//         <List
//           dataSource={modalData.listRequestCharacters}
//           renderItem={(item, index) => (
//             <List.Item
//               key={index}
//               actions={[
//                 <Button
//                   type="link"
//                   icon={<CloseOutlined />}
//                   onClick={() =>
//                     handleRemoveCosplayer(item.cosplayerId, item.characterId)
//                   }
//                 />,
//               ]}
//             >
//               <p>
//                 {item.cosplayerName} - {item.characterName} - Quantity:{" "}
//                 {item.quantity} - Price: ${item.price.toLocaleString()}
//               </p>
//             </List.Item>
//           )}
//         />
//         <p>
//           <strong>Total Price:</strong> ${modalData.price.toLocaleString() || 0}
//         </p>
//       </Modal>

//       <Modal
//         title="Select Payment Amount"
//         visible={isPaymentModalVisible}
//         onOk={handlePaymentConfirm}
//         onCancel={() => {
//           setIsPaymentModalVisible(false);
//           setDepositAmount(null);
//         }}
//         okText="Confirm Deposit"
//         cancelText="Cancel"
//         confirmLoading={paymentLoading}
//       >
//         <p>Please select a deposit amount:</p>
//         <Radio.Group
//           onChange={(e) => setDepositAmount(e.target.value)}
//           value={depositAmount}
//         >
//           <Radio value={30}>$30</Radio>
//           <Radio value={50}>$50</Radio>
//           <Radio value={70}>$70</Radio>
//         </Radio.Group>
//       </Modal>
//     </div>
//   );
// };

// export default MyHistory;

//=========================

import React, { useState, useEffect } from "react";
import {
  Pagination,
  Modal,
  Input,
  List,
  Button,
  Radio,
  message,
  Tabs,
  Popconfirm,
} from "antd";
import { CloseOutlined } from "@ant-design/icons";
import MyHistoryService from "../../services/HistoryService/MyHistoryService";
import RequestService from "../../services/ManageServicePages/ManageRequestService/RequestService.js";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../../styles/MyHistory.scss";
import { jwtDecode } from "jwt-decode";

const { TextArea } = Input;
const { TabPane } = Tabs;

const MyHistory = () => {
  const [requests, setRequests] = useState([]);
  const [filteredPendingRequests, setFilteredPendingRequests] = useState([]);
  const [contracts, setContracts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPendingPage, setCurrentPendingPage] = useState(1);
  const [currentContractPage, setCurrentContractPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });
  const [isViewModalVisible, setIsViewModalVisible] = useState(false);
  const [isPaymentModalVisible, setIsPaymentModalVisible] = useState(false);
  const [modalData, setModalData] = useState({
    name: "",
    description: "",
    startDate: "",
    endDate: "",
    location: "",
    listRequestCharacters: [],
    price: 0,
  });
  const [selectedRequestId, setSelectedRequestId] = useState(null);
  const [depositAmount, setDepositAmount] = useState(null);
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [updateContractId, setUpdateContractId] = useState(null); // Trạng thái để theo dõi contract cần update

  const itemsPerPage = 5;
  const accessToken = localStorage.getItem("accessToken");

  const decoded = jwtDecode(accessToken);
  const accountId = decoded?.Id;

  const calculateCosplayerPrice = (salaryIndex, quantity) => {
    return 100 * salaryIndex * quantity;
  };

  const calculateTotalPrice = (characters) => {
    return characters.reduce(
      (total, char) =>
        total + calculateCosplayerPrice(char.salaryIndex, char.quantity),
      0
    );
  };

  // Fetch requests
  useEffect(() => {
    const fetchRequests = async () => {
      setLoading(true);
      try {
        const data = await MyHistoryService.GetAllRequestByAccountId(accountId);
        const requestsArray = Array.isArray(data) ? data : [data];
        setRequests(requestsArray);
      } catch (error) {
        console.error("Failed to fetch requests:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchRequests();
  }, [accountId]);

  // Fetch contracts
  useEffect(() => {
    const fetchContracts = async () => {
      setLoading(true);
      try {
        const data = await MyHistoryService.getAllContractByAccountId(
          accountId
        );
        const contractsArray = Array.isArray(data) ? data : [data];
        setContracts(contractsArray);
      } catch (error) {
        console.error("Failed to fetch contracts:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchContracts();
  }, [accountId]);

  // Filter pending requests
  useEffect(() => {
    const contractRequestIds = contracts.map((contract) => contract.requestId);
    const filtered = requests
      .filter((request) => !contractRequestIds.includes(request.requestId))
      .filter(
        (request) =>
          request.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          new Date(request.startDate)
            .toLocaleDateString("en-GB")
            .includes(searchTerm)
      );
    setFilteredPendingRequests(filtered);
    setCurrentPendingPage(1);
  }, [searchTerm, requests, contracts]);

  // Handle payment
  useEffect(() => {
    if (selectedRequestId && depositAmount !== null && paymentLoading) {
      const processPayment = async () => {
        try {
          await MyHistoryService.depositRequest(
            selectedRequestId,
            depositAmount
          );
          toast.success("Payment successful!");
          const requestData = await MyHistoryService.GetAllRequestByAccountId(
            accountId
          );
          setRequests(Array.isArray(requestData) ? requestData : [requestData]);
          const contractData = await MyHistoryService.getAllContractByAccountId(
            accountId
          );
          setContracts(
            Array.isArray(contractData) ? contractData : [contractData]
          );
        } catch (error) {
          toast.error("Cannot payment, waiting for manager to browsed!");
        } finally {
          setPaymentLoading(false);
          setIsPaymentModalVisible(false);
          setSelectedRequestId(null);
          setDepositAmount(null);
        }
      };
      processPayment();
    }
  }, [selectedRequestId, depositAmount, paymentLoading, accountId]);

  // Handle contract status update
  useEffect(() => {
    if (updateContractId) {
      const updateStatus = async () => {
        setLoading(true);
        try {
          await MyHistoryService.updateStatusContract(
            updateContractId,
            "Progressing"
          );
          toast.success("Contract status updated to Processing!");
          const contractData = await MyHistoryService.getAllContractByAccountId(
            accountId
          );
          setContracts(
            Array.isArray(contractData) ? contractData : [contractData]
          );
        } catch (error) {
          toast.error("Failed to update contract status!");
        } finally {
          setLoading(false);
          setUpdateContractId(null); // Reset sau khi hoàn thành
        }
      };
      updateStatus();
    }
  }, [updateContractId, accountId]);

  const handleSort = (key, tab) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });

    if (tab === "pending") {
      const sorted = [...filteredPendingRequests].sort((a, b) => {
        if (key === "startDate") {
          return direction === "asc"
            ? new Date(a[key]) - new Date(b[key])
            : new Date(b[key]) - new Date(a[key]);
        }
        if (a[key] < b[key]) return direction === "asc" ? -1 : 1;
        if (a[key] > b[key]) return direction === "asc" ? 1 : -1;
        return 0;
      });
      setFilteredPendingRequests(sorted);
    } else if (tab === "contracts") {
      const sorted = [...contracts].sort((a, b) => {
        const aValue = key === "contractName" ? a.contractName : a[key];
        const bValue = key === "contractName" ? b.contractName : b[key];
        if (key === "startDate") {
          return direction === "asc"
            ? new Date(aValue) - new Date(bValue)
            : new Date(bValue) - new Date(aValue);
        }
        if (aValue < bValue) return direction === "asc" ? -1 : 1;
        if (aValue > bValue) return direction === "asc" ? 1 : -1;
        return 0;
      });
      setContracts(sorted);
    }
  };

  const handleViewRequest = async (requestId) => {
    setLoading(true);
    setIsViewModalVisible(true);
    try {
      const data = await RequestService.getRequestByRequestId(requestId);
      if (!data) throw new Error("Request data not found");

      const formattedData = {
        name: data.name || "N/A",
        description: data.description || "N/A",
        startDate: data.startDate || "",
        endDate: data.endDate || "",
        location: data.location || "N/A",
        listRequestCharacters: [],
        price: 0,
      };

      const charactersList = data.charactersListResponse || [];
      if (charactersList.length > 0) {
        const listRequestCharacters = await Promise.all(
          charactersList.map(async (char) => {
            try {
              const characterData = await RequestService.getNameCharacterById(
                char.characterId
              );
              let cosplayerName = "Not Assigned";
              let salaryIndex = 1;

              if (char.cosplayerId) {
                try {
                  const cosplayerData =
                    await RequestService.getNameCosplayerInRequestByCosplayerId(
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

              const price = calculateCosplayerPrice(
                salaryIndex,
                char.quantity || 0
              );

              return {
                cosplayerId: char.cosplayerId || null,
                characterId: char.characterId,
                cosplayerName,
                characterName: characterData?.characterName || "Unknown",
                quantity: char.quantity || 0,
                salaryIndex,
                price,
              };
            } catch (charError) {
              console.warn(
                `Failed to fetch character data for ID ${char.characterId}:`,
                charError
              );
              return {
                cosplayerId: char.cosplayerId || null,
                characterId: char.characterId,
                cosplayerName: "Not Assigned",
                characterName: "Unknown",
                quantity: char.quantity || 0,
                salaryIndex: 1,
                price: 0,
              };
            }
          })
        );

        formattedData.listRequestCharacters = listRequestCharacters;
        formattedData.price = calculateTotalPrice(listRequestCharacters);
      }

      setModalData(formattedData);
    } catch (error) {
      console.error("Failed to fetch request details:", error);
    } finally {
      setLoading(false);
    }
  };

  const handlePayment = (requestId) => {
    setSelectedRequestId(requestId);
    setIsPaymentModalVisible(true);
  };

  const handlePaymentConfirm = () => {
    if (depositAmount === null) {
      message.warning("Please select a deposit amount.");
      return;
    }
    setPaymentLoading(true);
  };

  const handleModalConfirm = () => {
    console.log("Modal confirmed with data:", modalData);
    setIsViewModalVisible(false);
  };

  const handleRemoveCosplayer = (cosplayerId, characterId) => {
    console.log(`Removing cosplayer ${cosplayerId} - character ${characterId}`);
  };

  const handleUpdateStatus = (contractId) => {
    setUpdateContractId(contractId); // Kích hoạt useEffect để cập nhật status
  };

  const pendingIndexOfLastItem = currentPendingPage * itemsPerPage;
  const pendingIndexOfFirstItem = pendingIndexOfLastItem - itemsPerPage;
  const currentPendingItems = filteredPendingRequests.slice(
    pendingIndexOfFirstItem,
    pendingIndexOfLastItem
  );
  const totalPendingItems = filteredPendingRequests.length;

  const contractIndexOfLastItem = currentContractPage * itemsPerPage;
  const contractIndexOfFirstItem = contractIndexOfLastItem - itemsPerPage;
  const currentContractItems = contracts.slice(
    contractIndexOfFirstItem,
    contractIndexOfLastItem
  );
  const totalContractItems = contracts.length;

  const handlePendingPageChange = (page) => {
    setCurrentPendingPage(page);
  };

  const handleContractPageChange = (page) => {
    setCurrentContractPage(page);
  };

  const getStatusText = (status) => {
    let className = "";
    let text = "";

    switch (status) {
      case "Pending":
        className = "text-primary";
        text = "Pending";
        break;
      case "Browsed":
        className = "text-success";
        text = "Browsed";
        break;
      case "Cancel":
        className = "text-secondary";
        text = "Cancel";
        break;
      case "Active":
        className = "text-success";
        text = "Active";
        break;
      case "Progressing":
        className = "text-warning";
        text = "Progressing";
        break;
      default:
        className = "text-secondary";
        text = "Unknown";
    }

    return <span className={className}>{text}</span>;
  };

  const formatDate = (dateString) => {
    if (!dateString || typeof dateString !== "string") return "N/A";
    try {
      let dateObj;
      if (dateString.includes(" ")) {
        const [time, date] = dateString.split(" ");
        const [hours, minutes] = time.split(":");
        const [day, month, year] = date.split("/");
        dateObj = new Date(`${year}-${month}-${day}T${hours}:${minutes}:00`);
      } else {
        dateObj = new Date(dateString);
      }
      if (isNaN(dateObj.getTime())) throw new Error("Invalid date");
      return dateObj.toLocaleDateString("vi-VN");
    } catch (error) {
      console.warn("Invalid date format:", dateString, error);
      return "N/A";
    }
  };

  return (
    <div className="my-history container vh-100">
      <div className="title-my-history text-center my-4">
        <span>My History</span>
      </div>

      <div className="mb-3">
        <input
          type="text"
          className="form-control"
          placeholder="Search by name or date..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <Tabs defaultActiveKey="1" type="card">
        <TabPane tab="Pending Requests" key="1">
          <div className="card">
            <div className="card-body">
              {loading ? (
                <p className="text-center">Loading...</p>
              ) : currentPendingItems.length === 0 ? (
                <p className="text-center">No pending requests found.</p>
              ) : (
                <>
                  <table className="table table-hover text-center">
                    <thead>
                      <tr>
                        <th
                          scope="col"
                          onClick={() => handleSort("name", "pending")}
                        >
                          Customer Name{" "}
                          {sortConfig.key === "name" &&
                            (sortConfig.direction === "asc" ? "↑" : "↓")}
                        </th>
                        <th scope="col">Status</th>
                        <th
                          scope="col"
                          onClick={() => handleSort("price", "pending")}
                        >
                          Total Price{" "}
                          {sortConfig.key === "price" &&
                            (sortConfig.direction === "asc" ? "↑" : "↓")}
                        </th>
                        <th
                          scope="col"
                          onClick={() => handleSort("startDate", "pending")}
                        >
                          Start Date{" "}
                          {sortConfig.key === "startDate" &&
                            (sortConfig.direction === "asc" ? "↑" : "↓")}
                        </th>
                        <th scope="col">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {currentPendingItems.map((request) => (
                        <tr key={request.requestId}>
                          <td className="shop-name">{request.name || "N/A"}</td>
                          <td>{getStatusText(request.status)}</td>
                          <td className="total-price">
                            {(request.price || 0).toLocaleString()} $
                          </td>
                          <td>{request.startDate}</td>
                          <td>
                            <div className="request-buttons">
                              <button
                                className="btn btn-outline-primary btn-sm"
                                onClick={() =>
                                  handleViewRequest(request.requestId)
                                }
                              >
                                View
                              </button>
                              <button
                                className="btn btn-outline-secondary btn-sm"
                                onClick={() => handlePayment(request.requestId)}
                              >
                                Select deposit
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  <div className="text-center mt-3">
                    <Pagination
                      current={currentPendingPage}
                      pageSize={itemsPerPage}
                      total={totalPendingItems}
                      onChange={handlePendingPageChange}
                      showSizeChanger={false}
                    />
                  </div>
                </>
              )}
            </div>
          </div>
        </TabPane>

        <TabPane tab="Contracts" key="2">
          <div className="card">
            <div className="card-body">
              {loading ? (
                <p className="text-center">Loading...</p>
              ) : currentContractItems.length === 0 ? (
                <p className="text-center">No contracts found.</p>
              ) : (
                <>
                  <table className="table table-hover text-center">
                    <thead>
                      <tr>
                        <th
                          scope="col"
                          onClick={() =>
                            handleSort("contractName", "contracts")
                          }
                        >
                          Contract Name{" "}
                          {sortConfig.key === "contractName" &&
                            (sortConfig.direction === "asc" ? "↑" : "↓")}
                        </th>
                        <th scope="col">Status</th>
                        <th
                          scope="col"
                          onClick={() => handleSort("price", "contracts")}
                        >
                          Total Price{" "}
                          {sortConfig.key === "price" &&
                            (sortConfig.direction === "asc" ? "↑" : "↓")}
                        </th>
                        <th scope="col">Deposit</th>
                        <th
                          scope="col"
                          onClick={() => handleSort("startDate", "contracts")}
                        >
                          Start Date{" "}
                          {sortConfig.key === "startDate" &&
                            (sortConfig.direction === "asc" ? "↑" : "↓")}
                        </th>
                        <th scope="col">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {currentContractItems.map((contract) => (
                        <tr key={contract.requestId}>
                          <td className="shop-name">
                            {contract.contractName || "N/A"}
                          </td>
                          <td>{getStatusText(contract.status)}</td>
                          <td className="total-price">
                            {(contract.price || 0).toLocaleString()} $
                          </td>
                          <td>
                            {(Number(contract.deposit) || 0).toLocaleString()} $
                          </td>
                          <td>{contract.startDate}</td>
                          <td>
                            <button
                              className="btn btn-outline-primary btn-sm"
                              onClick={() =>
                                handleViewRequest(contract.requestId)
                              }
                            >
                              View
                            </button>{" "}
                            <Popconfirm
                              title="Are you sure you want to update status to Processing?"
                              onConfirm={() =>
                                handleUpdateStatus(contract.contractId)
                              }
                              okText="Yes"
                              cancelText="No"
                            >
                              <button className="btn btn-outline-success btn-sm">
                                Update Status
                              </button>
                            </Popconfirm>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  <div className="text-center mt-3">
                    <Pagination
                      current={currentContractPage}
                      pageSize={itemsPerPage}
                      total={totalContractItems}
                      onChange={handleContractPageChange}
                      showSizeChanger={false}
                    />
                  </div>
                </>
              )}
            </div>
          </div>
        </TabPane>
      </Tabs>

      <Modal
        title="Confirm Your Request"
        visible={isViewModalVisible}
        onOk={handleModalConfirm}
        onCancel={() => setIsViewModalVisible(false)}
        okText="Send Request"
        cancelText="Edit"
      >
        <p>
          <strong>Name:</strong>
        </p>
        <Input
          value={modalData.name}
          onChange={(e) => setModalData({ ...modalData, name: e.target.value })}
          placeholder="Your account name"
          style={{ width: "250px" }}
        />
        <p>
          <strong>Description:</strong>
        </p>
        <TextArea
          value={modalData.description}
          onChange={(e) =>
            setModalData({ ...modalData, description: e.target.value })
          }
          placeholder="Enter description"
          style={{ width: "300px" }}
        />
        <p>
          <strong>Start DateTime:</strong> {modalData.startDate}
        </p>
        <p>
          <strong>End DateTime:</strong> {modalData.endDate}
        </p>
        <p>
          <strong>Location:</strong> {modalData.location || "N/A"}
        </p>
        <p>
          <strong>Coupon ID:</strong> {"N/A"}
        </p>
        <h4>List of Requested Characters:</h4>
        <List
          dataSource={modalData.listRequestCharacters}
          renderItem={(item, index) => (
            <List.Item
              key={index}
              actions={[
                <Button
                  type="link"
                  icon={<CloseOutlined />}
                  onClick={() =>
                    handleRemoveCosplayer(item.cosplayerId, item.characterId)
                  }
                />,
              ]}
            >
              <p>
                {item.cosplayerName} - {item.characterName} - Quantity:{" "}
                {item.quantity} - Price: ${item.price.toLocaleString()}
              </p>
            </List.Item>
          )}
        />
        <p>
          <strong>Total Price:</strong> ${modalData.price.toLocaleString() || 0}
        </p>
      </Modal>

      <Modal
        title="Select Payment Amount"
        visible={isPaymentModalVisible}
        onOk={handlePaymentConfirm}
        onCancel={() => {
          setIsPaymentModalVisible(false);
          setDepositAmount(null);
        }}
        okText="Confirm Deposit"
        cancelText="Cancel"
        confirmLoading={paymentLoading}
      >
        <p>Please select a deposit amount:</p>
        <Radio.Group
          onChange={(e) => setDepositAmount(e.target.value)}
          value={depositAmount}
        >
          <Radio value={30}>$30</Radio>
          <Radio value={50}>$50</Radio>
          <Radio value={70}>$70</Radio>
        </Radio.Group>
      </Modal>
    </div>
  );
};

export default MyHistory;
