///====================================bảng gôp chung================================================
// import React, { useState, useEffect } from "react";
// import {
//   Table,
//   Modal as BootstrapModal,
//   Form,
//   Card,
//   Pagination,
//   Dropdown,
// } from "react-bootstrap";
// import { Button, Popconfirm, Modal, Input, List, message } from "antd";
// import { toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
// import { ArrowUp, ArrowDown } from "lucide-react";
// import "../../../styles/Manager/ManageContract.scss";
// import ManageContractService from "../../../services/ManageServicePages/ManageContractService/ManageContractService.js";

// const { TextArea } = Input;

// const ManageContract = () => {
//   const [contracts, setContracts] = useState([]);
//   const [loading, setLoading] = useState(true);

//   // State cho modal chỉnh sửa/thêm mới
//   const [showModal, setShowModal] = useState(false);
//   const [isEditing, setIsEditing] = useState(false);
//   const [currentItem, setCurrentItem] = useState(null);
//   const [formData, setFormData] = useState({
//     contractName: "",
//     price: "",
//     status: "",
//     startDate: "",
//     endDate: "",
//   });

//   // State cho modal chi tiết
//   const [isViewModalVisible, setIsViewModalVisible] = useState(false);
//   const [modalData, setModalData] = useState({
//     name: "",
//     description: "",
//     startDate: "",
//     endDate: "",
//     location: "",
//     price: 0,
//     listRequestCharacters: [],
//   });

//   const [searchContract, setSearchContract] = useState("");
//   const [sortContract, setSortContract] = useState({
//     field: "status",
//     order: "asc",
//   });

//   const [currentPageContract, setCurrentPageContract] = useState(1);
//   const [rowsPerPage, setRowsPerPage] = useState(10);
//   const rowsPerPageOptions = [10, 15, 30];

//   useEffect(() => {
//     let isMounted = true;

//     const fetchContracts = async () => {
//       try {
//         setLoading(true);
//         const data = await ManageContractService.getAllContracts();
//         if (isMounted) {
//           setContracts(data);
//           setLoading(false);
//         }
//       } catch (error) {
//         if (isMounted) {
//           toast.error("Failed to fetch contracts");
//           setLoading(false);
//         }
//       }
//     };

//     fetchContracts();

//     return () => {
//       isMounted = false;
//     };
//   }, []);

//   const filterAndSortData = (data, search, sort) => {
//     let filtered = [...data];
//     if (search) {
//       filtered = filtered.filter((item) => {
//         const name = item.contractName ? item.contractName.toLowerCase() : "";
//         const status = item.status ? item.status.toLowerCase() : "";
//         return (
//           name.includes(search.toLowerCase()) ||
//           status.includes(search.toLowerCase())
//         );
//       });
//     }
//     return filtered.sort((a, b) => {
//       const valueA = a[sort.field] ? a[sort.field].toLowerCase() : "";
//       const valueB = b[sort.field] ? b[sort.field].toLowerCase() : "";
//       return sort.order === "asc"
//         ? valueA.localeCompare(valueB)
//         : valueB.localeCompare(valueA);
//     });
//   };

//   const filteredContracts = filterAndSortData(
//     contracts,
//     searchContract,
//     sortContract
//   );
//   const totalPagesContract = Math.ceil(filteredContracts.length / rowsPerPage);
//   const paginatedContracts = paginateData(
//     filteredContracts,
//     currentPageContract
//   );

//   function paginateData(data, page) {
//     const startIndex = (page - 1) * rowsPerPage;
//     const endIndex = startIndex + rowsPerPage;
//     return data.slice(startIndex, endIndex);
//   }

//   // Modal chỉnh sửa/thêm mới
//   const handleShowModal = (item = null) => {
//     if (item) {
//       setIsEditing(true);
//       setCurrentItem(item);
//       setFormData({
//         contractName: item.contractName || "",
//         price: item.price || "",
//         status: item.status || "",
//         startDate: item.startDate || "",
//         endDate: item.endDate || "",
//       });
//     } else {
//       setIsEditing(false);
//       setFormData({
//         contractName: "",
//         price: "",
//         status: "",
//         startDate: "",
//         endDate: "",
//       });
//     }
//     setShowModal(true);
//   };

//   const handleCloseModal = () => {
//     setShowModal(false);
//     setIsEditing(false);
//     setCurrentItem(null);
//   };

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setFormData({ ...formData, [name]: value });
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     if (isEditing) {
//       const updatedContracts = contracts.map((con) =>
//         con.contractId === currentItem.contractId
//           ? { ...con, ...formData }
//           : con
//       );
//       setContracts(updatedContracts);
//       toast.success("Contract updated successfully!");
//     } else {
//       setContracts([
//         ...contracts,
//         { ...formData, contractId: Date.now().toString() },
//       ]);
//       toast.success("Contract added successfully!");
//     }
//     handleCloseModal();
//   };

//   const handleDelete = (contractId) => {
//     setContracts(contracts.filter((con) => con.contractId !== contractId));
//     toast.success("Contract deleted successfully!");
//   };

//   // Modal chi tiết
//   const handleViewDetail = async (contract) => {
//     if (contract.contractName === "Cosplay Rental") {
//       try {
//         const requestData = await ManageContractService.getRequestByRequestId(
//           contract.requestId
//         );
//         setModalData({
//           name: requestData.name || contract.contractName,
//           description: requestData.description || "",
//           startDate: contract.startDate,
//           endDate: contract.endDate,
//           location: requestData.location || "N/A",
//           price: contract.price || 0,
//           listRequestCharacters: contract.contractCharacters || [],
//         });
//         setIsViewModalVisible(true);
//       } catch (error) {
//         message.error("Failed to fetch contract details");
//       }
//     }
//   };

//   const handleModalConfirm = () => {
//     setIsViewModalVisible(false);
//   };

//   const handleEditInViewModal = () => {
//     message.info("Edit functionality not implemented yet");
//   };

//   const handleSort = (field) => {
//     setSortContract((prev) => ({
//       field,
//       order: prev.field === field && prev.order === "asc" ? "desc" : "asc",
//     }));
//     setCurrentPageContract(1);
//   };

//   const handlePageChange = (page) => setCurrentPageContract(page);
//   const handleRowsPerPageChange = (value) => {
//     setRowsPerPage(value);
//     setCurrentPageContract(1);
//   };

//   if (loading) {
//     return <div>Loading contracts...</div>;
//   }

//   return (
//     <div className="manage-general">
//       <h2 className="manage-general-title">Manage Contracts</h2>
//       <div className="table-container">
//         <Card className="status-table-card">
//           <Card.Body>
//             <div className="table-header">
//               <h3>Contracts</h3>
//               <Form.Control
//                 type="text"
//                 placeholder="Search by Name or Status..."
//                 value={searchContract}
//                 onChange={(e) => setSearchContract(e.target.value)}
//                 className="search-input"
//               />
//               {/* <Button type="primary" onClick={() => handleShowModal(null)}>
//                 Add Contract
//               </Button> */}
//             </div>
//             <Table striped bordered hover responsive>
//               <thead>
//                 <tr>
//                   <th className="text-center">
//                     <span
//                       className="sortable"
//                       onClick={() => handleSort("contractName")}
//                     >
//                       Contract Name
//                       {sortContract.field === "contractName" &&
//                         (sortContract.order === "asc" ? (
//                           <ArrowUp size={16} />
//                         ) : (
//                           <ArrowDown size={16} />
//                         ))}
//                     </span>
//                   </th>
//                   <th className="text-center">Price</th>
//                   <th className="text-center">
//                     <span
//                       className="sortable"
//                       onClick={() => handleSort("status")}
//                     >
//                       Status
//                       {sortContract.field === "status" &&
//                         (sortContract.order === "asc" ? (
//                           <ArrowUp size={16} />
//                         ) : (
//                           <ArrowDown size={16} />
//                         ))}
//                     </span>
//                   </th>
//                   <th className="text-center">Start Date</th>
//                   <th className="text-center">End Date</th>
//                   <th className="text-center">Actions</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {paginatedContracts.map((con) => (
//                   <tr key={con.contractId}>
//                     <td className="text-center">{con.contractName}</td>
//                     <td className="text-center">{con.price}</td>
//                     <td className="text-center">{con.status}</td>
//                     <td className="text-center">{con.startDate}</td>
//                     <td className="text-center">{con.endDate}</td>
//                     <td className="text-center">
//                       {con.contractName === "Cosplay Rental" && (
//                         <Button
//                           type="default"
//                           size="small"
//                           onClick={() => handleViewDetail(con)}
//                           style={{ marginRight: "8px" }}
//                         >
//                           View Detail
//                         </Button>
//                       )}
//                       <Popconfirm
//                         title="Are you sure to delete this contract?"
//                         onConfirm={() => handleDelete(con.contractId)}
//                         okText="Yes"
//                         cancelText="No"
//                       >
//                         <Button type="primary" danger size="small">
//                           Delete
//                         </Button>
//                       </Popconfirm>
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </Table>
//             <PaginationControls
//               currentPage={currentPageContract}
//               totalPages={totalPagesContract}
//               totalEntries={filteredContracts.length}
//               rowsPerPage={rowsPerPage}
//               onPageChange={handlePageChange}
//               onRowsPerPageChange={handleRowsPerPageChange}
//               rowsPerPageOptions={rowsPerPageOptions}
//             />
//           </Card.Body>
//         </Card>
//       </div>

//       {/* Modal chỉnh sửa/thêm mới */}
//       <BootstrapModal show={showModal} onHide={handleCloseModal} centered>
//         <BootstrapModal.Header closeButton>
//           <BootstrapModal.Title>
//             {isEditing ? "Edit Contract" : "Add Contract"}
//           </BootstrapModal.Title>
//         </BootstrapModal.Header>
//         <BootstrapModal.Body>
//           <Form onSubmit={handleSubmit}>
//             <Form.Group className="mb-2">
//               <Form.Label>Contract Name</Form.Label>
//               <Form.Control
//                 type="text"
//                 name="contractName"
//                 value={formData.contractName}
//                 onChange={handleInputChange}
//                 required
//               />
//             </Form.Group>
//             <Form.Group className="mb-2">
//               <Form.Label>Price</Form.Label>
//               <Form.Control
//                 type="number"
//                 name="price"
//                 value={formData.price}
//                 onChange={handleInputChange}
//                 required
//               />
//             </Form.Group>
//             <Form.Group className="mb-2">
//               <Form.Label>Status</Form.Label>
//               <Form.Select
//                 name="status"
//                 value={formData.status}
//                 onChange={handleInputChange}
//                 required
//               >
//                 <option value="">Select Status</option>
//                 <option value="Draft">Draft</option>
//                 <option value="Signed">Signed</option>
//                 <option value="Expired">Expired</option>
//                 <option value="Completed">Completed</option>
//               </Form.Select>
//             </Form.Group>
//             <Form.Group className="mb-2">
//               <Form.Label>Start Date</Form.Label>
//               <Form.Control
//                 type="text"
//                 name="startDate"
//                 value={formData.startDate}
//                 onChange={handleInputChange}
//                 required
//               />
//             </Form.Group>
//             <Form.Group className="mb-2">
//               <Form.Label>End Date</Form.Label>
//               <Form.Control
//                 type="text"
//                 name="endDate"
//                 value={formData.endDate}
//                 onChange={handleInputChange}
//                 required
//               />
//             </Form.Group>
//           </Form>
//         </BootstrapModal.Body>
//         <BootstrapModal.Footer>
//           <Button variant="secondary" onClick={handleCloseModal}>
//             Cancel
//           </Button>
//           <Button variant="primary" onClick={handleSubmit}>
//             {isEditing ? "Update" : "Add"}
//           </Button>
//         </BootstrapModal.Footer>
//       </BootstrapModal>

//       {/* Modal chi tiết cho Cosplay Rental */}
//       <Modal
//         title="View Detail Contract"
//         open={isViewModalVisible}
//         onOk={handleModalConfirm}
//         onCancel={() => setIsViewModalVisible(false)}
//         okText="OK"
//         footer={[
//           <Button key="edit" type="primary" onClick={handleEditInViewModal}>
//             Edit
//           </Button>,
//           <Button key="ok" type="primary" onClick={handleModalConfirm}>
//             OK
//           </Button>,
//         ]}
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
//           <strong>Start DateTime:</strong> {modalData.startDate}
//         </p>
//         <p>
//           <strong>End DateTime:</strong> {modalData.endDate}
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
//             <List.Item key={index}>
//               <p>
//                 {item.cosplayerName} - {item.characterName} - Quantity:{" "}
//                 {item.quantity} - Price:{" "}
//                 {item.price ? item.price.toLocaleString() : 0} VND
//               </p>
//             </List.Item>
//           )}
//         />
//         <p>
//           <strong>Total Price:</strong> {modalData.price.toLocaleString() || 0}{" "}
//           VND
//         </p>
//       </Modal>
//     </div>
//   );
// };

// const PaginationControls = ({
//   currentPage,
//   totalPages,
//   totalEntries,
//   onPageChange,
//   rowsPerPage,
//   onRowsPerPageChange,
//   rowsPerPageOptions,
// }) => {
//   const startEntry = (currentPage - 1) * rowsPerPage + 1;
//   const endEntry = Math.min(currentPage * rowsPerPage, totalEntries);
//   const showingText = `Showing ${startEntry} to ${endEntry} of ${totalEntries} entries`;

//   return (
//     <div className="pagination-controls">
//       <div className="pagination-info">
//         <span className="showing-entries">{showingText}</span>
//         <div className="rows-per-page" style={{ marginLeft: "20px" }}>
//           <span>Rows per page: </span>
//           <Dropdown onSelect={(value) => onRowsPerPageChange(Number(value))}>
//             <Dropdown.Toggle variant="secondary" id="dropdown-rows-per-page">
//               {rowsPerPage}
//             </Dropdown.Toggle>
//             <Dropdown.Menu>
//               {rowsPerPageOptions.map((option) => (
//                 <Dropdown.Item key={option} eventKey={option}>
//                   {option}
//                 </Dropdown.Item>
//               ))}
//             </Dropdown.Menu>
//           </Dropdown>
//         </div>
//       </div>
//       <Pagination>
//         <Pagination.First
//           onClick={() => onPageChange(1)}
//           disabled={currentPage === 1}
//         />
//         <Pagination.Prev
//           onClick={() => onPageChange(currentPage - 1)}
//           disabled={currentPage === 1}
//         />
//         {[...Array(totalPages).keys()].map((page) => (
//           <Pagination.Item
//             key={page + 1}
//             active={page + 1 === currentPage}
//             onClick={() => onPageChange(page + 1)}
//           >
//             {page + 1}
//           </Pagination.Item>
//         ))}
//         <Pagination.Next
//           onClick={() => onPageChange(currentPage + 1)}
//           disabled={currentPage === totalPages}
//         />
//         <Pagination.Last
//           onClick={() => onPageChange(totalPages)}
//           disabled={currentPage === totalPages}
//         />
//       </Pagination>
//     </div>
//   );
// };

// export default ManageContract;

//=====================================select bảng==========================
import React, { useState, useEffect } from "react";
import {
  Table,
  Modal as BootstrapModal,
  Form,
  Card,
  Pagination,
  Dropdown,
} from "react-bootstrap";
import { Button, Popconfirm, Modal, Input, List, message, Select } from "antd";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ArrowUp, ArrowDown } from "lucide-react";
import "../../../styles/Manager/ManageContract.scss";
import ManageContractService from "../../../services/ManageServicePages/ManageContractService/ManageContractService.js";

const { TextArea } = Input;
const { Option } = Select;

const ManageContract = () => {
  const [contracts, setContracts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedContractType, setSelectedContractType] =
    useState("Cosplay Rental"); // State cho loại hợp đồng được chọn

  // State cho modal chỉnh sửa/thêm mới
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentItem, setCurrentItem] = useState(null);
  const [formData, setFormData] = useState({
    contractName: "",
    price: "",
    status: "",
    startDate: "",
    endDate: "",
  });

  // State cho modal chi tiết
  const [isViewModalVisible, setIsViewModalVisible] = useState(false);
  const [modalData, setModalData] = useState({
    name: "",
    description: "",
    startDate: "",
    endDate: "",
    location: "",
    price: 0,
    listRequestCharacters: [],
  });

  const [searchContract, setSearchContract] = useState("");
  const [sortContract, setSortContract] = useState({
    field: "status",
    order: "asc",
  });

  const [currentPageContract, setCurrentPageContract] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const rowsPerPageOptions = [10, 15, 30];

  useEffect(() => {
    let isMounted = true;

    const fetchContracts = async () => {
      try {
        setLoading(true);
        const data = await ManageContractService.getAllContracts();
        if (isMounted) {
          setContracts(data);
          setLoading(false);
        }
      } catch (error) {
        if (isMounted) {
          toast.error("Failed to fetch contracts");
          setLoading(false);
        }
      }
    };

    fetchContracts();

    return () => {
      isMounted = false;
    };
  }, []);

  const filterAndSortData = (data, search, sort) => {
    let filtered = [...data];
    // Lọc theo loại hợp đồng được chọn
    filtered = filtered.filter(
      (item) => item.contractName === selectedContractType
    );
    if (search) {
      filtered = filtered.filter((item) => {
        const name = item.contractName ? item.contractName.toLowerCase() : "";
        const status = item.status ? item.status.toLowerCase() : "";
        return (
          name.includes(search.toLowerCase()) ||
          status.includes(search.toLowerCase())
        );
      });
    }
    return filtered.sort((a, b) => {
      const valueA = a[sort.field] ? a[sort.field].toLowerCase() : "";
      const valueB = b[sort.field] ? b[sort.field].toLowerCase() : "";
      return sort.order === "asc"
        ? valueA.localeCompare(valueB)
        : valueB.localeCompare(valueA);
    });
  };

  const filteredContracts = filterAndSortData(
    contracts,
    searchContract,
    sortContract
  );
  const totalPagesContract = Math.ceil(filteredContracts.length / rowsPerPage);
  const paginatedContracts = paginateData(
    filteredContracts,
    currentPageContract
  );

  function paginateData(data, page) {
    const startIndex = (page - 1) * rowsPerPage;
    const endIndex = startIndex + rowsPerPage;
    return data.slice(startIndex, endIndex);
  }

  // Modal chỉnh sửa/thêm mới
  const handleShowModal = (item = null) => {
    if (item) {
      setIsEditing(true);
      setCurrentItem(item);
      setFormData({
        contractName: item.contractName || "",
        price: item.price || "",
        status: item.status || "",
        startDate: item.startDate || "",
        endDate: item.endDate || "",
      });
    } else {
      setIsEditing(false);
      setFormData({
        contractName: selectedContractType, // Mặc định là loại hợp đồng đang chọn
        price: "",
        status: "",
        startDate: "",
        endDate: "",
      });
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setIsEditing(false);
    setCurrentItem(null);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isEditing) {
      const updatedContracts = contracts.map((con) =>
        con.contractId === currentItem.contractId
          ? { ...con, ...formData }
          : con
      );
      setContracts(updatedContracts);
      toast.success("Contract updated successfully!");
    } else {
      setContracts([
        ...contracts,
        { ...formData, contractId: Date.now().toString() },
      ]);
      toast.success("Contract added successfully!");
    }
    handleCloseModal();
  };

  const handleDelete = (contractId) => {
    setContracts(contracts.filter((con) => con.contractId !== contractId));
    toast.success("Contract deleted successfully!");
  };

  // Modal chi tiết
  const handleViewDetail = async (contract) => {
    if (contract.contractName === "Cosplay Rental") {
      try {
        const requestData = await ManageContractService.getRequestByRequestId(
          contract.requestId
        );
        setModalData({
          name: requestData.name || contract.contractName,
          description: requestData.description || "",
          startDate: contract.startDate,
          endDate: contract.endDate,
          location: requestData.location || "N/A",
          price: contract.price || 0,
          listRequestCharacters: contract.contractCharacters || [],
        });
        setIsViewModalVisible(true);
      } catch (error) {
        message.error("Failed to fetch contract details");
      }
    }
  };

  const handleModalConfirm = () => {
    setIsViewModalVisible(false);
  };

  const handleEditInViewModal = () => {
    message.info("Edit functionality not implemented yet");
  };

  const handleSort = (field) => {
    setSortContract((prev) => ({
      field,
      order: prev.field === field && prev.order === "asc" ? "desc" : "asc",
    }));
    setCurrentPageContract(1);
  };

  const handlePageChange = (page) => setCurrentPageContract(page);
  const handleRowsPerPageChange = (value) => {
    setRowsPerPage(value);
    setCurrentPageContract(1);
  };

  if (loading) {
    return <div>Loading contracts...</div>;
  }

  return (
    <div className="manage-general">
      <h2 className="manage-general-title">Manage Contracts</h2>
      <div className="table-container">
        <Card className="status-table-card">
          <Card.Body>
            <div className="table-header">
              <h3>Contracts</h3>
              <div
                style={{ display: "flex", alignItems: "center", gap: "10px" }}
              >
                <Select
                  value={selectedContractType}
                  onChange={(value) => setSelectedContractType(value)}
                  style={{ width: 200 }}
                >
                  <Option value="Cosplay Rental">Cosplay Rental</Option>
                  <Option value="Character Rental">Character Rental</Option>
                </Select>
                <Form.Control
                  type="text"
                  placeholder="Search ..."
                  value={searchContract}
                  onChange={(e) => setSearchContract(e.target.value)}
                  className="search-input"
                />
                {/* <Button type="primary" onClick={() => handleShowModal(null)}>
                  Add Contract
                </Button> */}
              </div>
            </div>
            <Table striped bordered hover responsive>
              <thead>
                <tr>
                  <th className="text-center">
                    <span
                      className="sortable"
                      onClick={() => handleSort("contractName")}
                    >
                      Contract Name
                      {sortContract.field === "contractName" &&
                        (sortContract.order === "asc" ? (
                          <ArrowUp size={16} />
                        ) : (
                          <ArrowDown size={16} />
                        ))}
                    </span>
                  </th>
                  <th className="text-center">Price</th>
                  <th className="text-center">
                    <span
                      className="sortable"
                      onClick={() => handleSort("status")}
                    >
                      Status
                      {sortContract.field === "status" &&
                        (sortContract.order === "asc" ? (
                          <ArrowUp size={16} />
                        ) : (
                          <ArrowDown size={16} />
                        ))}
                    </span>
                  </th>
                  <th className="text-center">Start Date</th>
                  <th className="text-center">End Date</th>
                  <th className="text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {paginatedContracts.map((con) => (
                  <tr key={con.contractId}>
                    <td className="text-center">{con.contractName}</td>
                    <td className="text-center">{con.price}</td>
                    <td className="text-center">{con.status}</td>
                    <td className="text-center">{con.startDate}</td>
                    <td className="text-center">{con.endDate}</td>
                    <td className="text-center">
                      {con.contractName === "Cosplay Rental" && (
                        <Button
                          type="default"
                          size="small"
                          onClick={() => handleViewDetail(con)}
                          style={{ marginRight: "8px" }}
                        >
                          View Detail
                        </Button>
                      )}
                      <Popconfirm
                        title="Are you sure to delete this contract?"
                        onConfirm={() => handleDelete(con.contractId)}
                        okText="Yes"
                        cancelText="No"
                      >
                        <Button type="primary" danger size="small">
                          Delete
                        </Button>
                      </Popconfirm>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
            <PaginationControls
              currentPage={currentPageContract}
              totalPages={totalPagesContract}
              totalEntries={filteredContracts.length}
              rowsPerPage={rowsPerPage}
              onPageChange={handlePageChange}
              onRowsPerPageChange={handleRowsPerPageChange}
              rowsPerPageOptions={rowsPerPageOptions}
            />
          </Card.Body>
        </Card>
      </div>

      {/* Modal chỉnh sửa/thêm mới */}
      <BootstrapModal show={showModal} onHide={handleCloseModal} centered>
        <BootstrapModal.Header closeButton>
          <BootstrapModal.Title>
            {isEditing ? "Edit Contract" : "Add Contract"}
          </BootstrapModal.Title>
        </BootstrapModal.Header>
        <BootstrapModal.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-2">
              <Form.Label>Contract Name</Form.Label>
              <Form.Control
                type="text"
                name="contractName"
                value={formData.contractName}
                onChange={handleInputChange}
                required
                disabled={true} // Không cho chỉnh sửa contractName khi thêm mới
              />
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Label>Price</Form.Label>
              <Form.Control
                type="number"
                name="price"
                value={formData.price}
                onChange={handleInputChange}
                required
              />
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Label>Status</Form.Label>
              <Form.Select
                name="status"
                value={formData.status}
                onChange={handleInputChange}
                required
              >
                <option value="">Select Status</option>
                <option value="Draft">Draft</option>
                <option value="Signed">Signed</option>
                <option value="Expired">Expired</option>
                <option value="Completed">Completed</option>
              </Form.Select>
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Label>Start Date</Form.Label>
              <Form.Control
                type="text"
                name="startDate"
                value={formData.startDate}
                onChange={handleInputChange}
                required
              />
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Label>End Date</Form.Label>
              <Form.Control
                type="text"
                name="endDate"
                value={formData.endDate}
                onChange={handleInputChange}
                required
              />
            </Form.Group>
          </Form>
        </BootstrapModal.Body>
        <BootstrapModal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleSubmit}>
            {isEditing ? "Update" : "Add"}
          </Button>
        </BootstrapModal.Footer>
      </BootstrapModal>

      {/* Modal chi tiết cho Cosplay Rental */}
      <Modal
        title="View Detail Contract"
        open={isViewModalVisible}
        onOk={handleModalConfirm}
        onCancel={() => setIsViewModalVisible(false)}
        okText="OK"
        footer={[
          <Button key="edit" type="primary" onClick={handleEditInViewModal}>
            Edit
          </Button>,
          <Button key="ok" type="primary" onClick={handleModalConfirm}>
            OK
          </Button>,
        ]}
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
            <List.Item key={index}>
              <p>
                {item.cosplayerName} - {item.characterName} - Quantity:{" "}
                {item.quantity} - Price:{" "}
                {item.price ? item.price.toLocaleString() : 0} VND
              </p>
            </List.Item>
          )}
        />
        <p>
          <strong>Total Price:</strong> {modalData.price.toLocaleString() || 0}{" "}
          VND
        </p>
      </Modal>
    </div>
  );
};

const PaginationControls = ({
  currentPage,
  totalPages,
  totalEntries,
  onPageChange,
  rowsPerPage,
  onRowsPerPageChange,
  rowsPerPageOptions,
}) => {
  const startEntry = (currentPage - 1) * rowsPerPage + 1;
  const endEntry = Math.min(currentPage * rowsPerPage, totalEntries);
  const showingText = `Showing ${startEntry} to ${endEntry} of ${totalEntries} entries`;

  return (
    <div className="pagination-controls">
      <div className="pagination-info">
        <span className="showing-entries">{showingText}</span>
        <div className="rows-per-page" style={{ marginLeft: "20px" }}>
          <span>Rows per page: </span>
          <Dropdown onSelect={(value) => onRowsPerPageChange(Number(value))}>
            <Dropdown.Toggle variant="secondary" id="dropdown-rows-per-page">
              {rowsPerPage}
            </Dropdown.Toggle>
            <Dropdown.Menu>
              {rowsPerPageOptions.map((option) => (
                <Dropdown.Item key={option} eventKey={option}>
                  {option}
                </Dropdown.Item>
              ))}
            </Dropdown.Menu>
          </Dropdown>
        </div>
      </div>
      <Pagination>
        <Pagination.First
          onClick={() => onPageChange(1)}
          disabled={currentPage === 1}
        />
        <Pagination.Prev
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
        />
        {[...Array(totalPages).keys()].map((page) => (
          <Pagination.Item
            key={page + 1}
            active={page + 1 === currentPage}
            onClick={() => onPageChange(page + 1)}
          >
            {page + 1}
          </Pagination.Item>
        ))}
        <Pagination.Next
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
        />
        <Pagination.Last
          onClick={() => onPageChange(totalPages)}
          disabled={currentPage === totalPages}
        />
      </Pagination>
    </div>
  );
};

export default ManageContract;
