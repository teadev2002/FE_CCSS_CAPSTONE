import React, { useState, useEffect } from "react";
import { Container, Row, Col, Form, Card, Badge } from "react-bootstrap";
import {
  Pagination,
  Modal,
  Input,
  Button,
  Tabs,
  Image,
  Spin,
  Select,
} from "antd";
import { FileText, Calendar, Eye, Delete } from "lucide-react";
import { useDebounce } from "use-debounce";
import { jwtDecode } from "jwt-decode";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "antd/dist/reset.css";
import "../../styles/MyCustomerCharacter.scss";
import RequestCustomerCharacterService from "../../services/MyCustomerCharacterService/MyCustomerCharacterService.js";

const { TabPane } = Tabs;
const { Option } = Select;

const MyCustomerCharacter = () => {
  const [requests, setRequests] = useState([]);
  const [filteredPendingRequests, setFilteredPendingRequests] = useState([]);
  const [filteredBrowsedRequests, setFilteredBrowsedRequests] = useState([]);
  const [filteredCompletedRequests, setFilteredCompletedRequests] = useState(
    []
  );
  const [currentPendingPage, setCurrentPendingPage] = useState(1);
  const [currentBrowsedPage, setCurrentBrowsedPage] = useState(1);
  const [currentCompletedPage, setCurrentCompletedPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm] = useDebounce(searchTerm, 300);
  const [isModalVisible, setIsModalVisible] = useState(false); // Modal hợp nhất
  const [modalData, setModalData] = useState({
    customerCharacterId: "",
    name: "",
    description: "",
    categoryId: "",
    createDate: "",
    status: "",
    maxHeight: 0,
    maxWeight: 0,
    minHeight: 0,
    minWeight: 0,
    updateDate: null,
    createBy: "",
    reason: null,
    images: [],
  });
  const [newImages, setNewImages] = useState([]); // State để lưu trữ ảnh mới
  const [categories, setCategories] = useState([]); // State để lưu danh sách categories
  const [accounts, setAccounts] = useState({}); // State để lưu thông tin accounts
  const [loading, setLoading] = useState(false);

  const itemsPerPage = 5;

  // Lấy accountId từ token
  const accessToken = localStorage.getItem("accessToken");
  const decoded = jwtDecode(accessToken);
  const accountId = decoded?.Id;

  // Gọi API để lấy danh sách yêu cầu, categories và thông tin accounts
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Lấy danh sách yêu cầu
        const requestData =
          await RequestCustomerCharacterService.getRequestCustomerCharacterByAccountId(
            accountId
          );
        setRequests(Array.isArray(requestData) ? requestData : []);

        // Lấy danh sách categories
        const categoryData =
          await RequestCustomerCharacterService.getAllCategory();
        setCategories(Array.isArray(categoryData) ? categoryData : []);

        // Lấy thông tin accounts từ createBy
        const accountIds = [...new Set(requestData.map((req) => req.createBy))];
        const accountPromises = accountIds.map((id) =>
          RequestCustomerCharacterService.getAccountCustomerCharacter(id)
        );
        const accountResponses = await Promise.all(accountPromises);
        const accountsData = accountResponses.reduce((acc, account) => {
          acc[account.accountId] = account;
          return acc;
        }, {});
        setAccounts(accountsData);
      } catch (error) {
        console.error("Failed to fetch data:", error);
        toast.error("Failed to load data.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [accountId]);

  // Lọc các requests theo trạng thái và từ khóa tìm kiếm
  useEffect(() => {
    const filteredPending = requests
      .filter((req) => req.status === "Pending")
      .filter(
        (req) =>
          req.name.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
          req.createDate.includes(debouncedSearchTerm)
      );
    setFilteredPendingRequests(filteredPending);
    setCurrentPendingPage(1);

    const filteredBrowsed = requests
      .filter((req) => req.status === "Browsed")
      .filter(
        (req) =>
          req.name.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
          req.createDate.includes(debouncedSearchTerm)
      );
    setFilteredBrowsedRequests(filteredBrowsed);
    setCurrentBrowsedPage(1);

    const filteredCompleted = requests
      .filter((req) => req.status === "Completed")
      .filter(
        (req) =>
          req.name.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
          req.createDate.includes(debouncedSearchTerm)
      );
    setFilteredCompletedRequests(filteredCompleted);
    setCurrentCompletedPage(1);
  }, [debouncedSearchTerm, requests]);

  const paginate = (data, page, perPage) => {
    const start = (page - 1) * perPage;
    return data.slice(start, start + perPage);
  };

  const handleOpenModal = (request) => {
    setModalData({
      customerCharacterId: request.customerCharacterId,
      name: request.name,
      description: request.description,
      categoryId: request.categoryId,
      createDate: request.createDate,
      status: request.status,
      maxHeight: request.maxHeight,
      maxWeight: request.maxWeight,
      minHeight: request.minHeight,
      minWeight: request.minWeight,
      updateDate: request.updateDate,
      createBy: request.createBy,
      reason: request.reason,
      images: request.customerCharacterImageResponses || [],
    });
    setNewImages([]); // Reset ảnh mới khi mở modal
    setIsModalVisible(true);
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    setNewImages(files);
  };

  const handleRemoveImage = (imageId) => {
    setModalData((prev) => ({
      ...prev,
      images: prev.images.filter(
        (img) => img.customerCharacterImageId !== imageId
      ),
    }));
  };

  const handleUpdateRequest = async () => {
    setLoading(true);
    try {
      const updateData = {
        accountId: accountId,
        customerCharacterRequestId: modalData.customerCharacterId,
        name: modalData.name,
        description: modalData.description,
        categoryId: modalData.categoryId,
        minHeight: modalData.minHeight,
        maxHeight: modalData.maxHeight,
        minWeight: modalData.minWeight,
        maxWeight: modalData.maxWeight,
        images: newImages,
      };

      const response =
        await RequestCustomerCharacterService.UpdateCustomerCharacter(
          updateData
        );

      setRequests((prev) =>
        prev.map((req) =>
          req.customerCharacterId === modalData.customerCharacterId
            ? {
                ...req,
                ...modalData,
                customerCharacterImageResponses:
                  response.images || modalData.images,
              }
            : req
        )
      );

      toast.success("Customer character updated successfully!");
      setIsModalVisible(false);
      setNewImages([]);
    } catch (error) {
      console.error("Failed to update customer character:", error);
      toast.error(
        error.response?.data?.message || "Failed to update customer character."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field, value) => {
    setModalData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // Hàm tìm categoryName dựa trên categoryId
  const getCategoryNameById = (categoryId) => {
    const category = categories.find((cat) => cat.categoryId === categoryId);
    return category ? category.categoryName : "N/A";
  };

  // Hàm tìm name dựa trên accountId
  const getAccountNameById = (accountId) => {
    const account = accounts[accountId];
    return account ? account.name : "N/A";
  };

  const getStatusBadge = (status) => {
    const statusColors = {
      Pending: "primary",
      Browsed: "success",
      Completed: "success",
    };
    return <Badge bg={statusColors[status] || "secondary"}>{status}</Badge>;
  };

  const isEditable = modalData.status === "Pending"; // Kiểm tra nếu status là Pending thì cho phép chỉnh sửa

  const currentPendingItems = paginate(
    filteredPendingRequests,
    currentPendingPage,
    itemsPerPage
  );
  const currentBrowsedItems = paginate(
    filteredBrowsedRequests,
    currentBrowsedPage,
    itemsPerPage
  );
  const currentCompletedItems = paginate(
    filteredCompletedRequests,
    currentCompletedPage,
    itemsPerPage
  );

  return (
    <div className="rental-management bg-light min-vh-100">
      <Container className="py-5">
        <h1 className="text-center mb-5 fw-bold title-rental-management">
          <span>My Request Customer Character</span>
        </h1>

        <div className="filter-section bg-white p-4 rounded shadow mb-5">
          <Row>
            <Col md={12}>
              <Form.Control
                type="text"
                placeholder="Search by name or date..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input"
              />
            </Col>
          </Row>
        </div>

        {loading ? (
          <Spin
            tip="Loading..."
            style={{ display: "block", textAlign: "center" }}
          />
        ) : (
          <Tabs defaultActiveKey="1" type="card">
            <TabPane tab="Pending Requests" key="1">
              {currentPendingItems.length === 0 ? (
                <p className="text-center">No pending requests found.</p>
              ) : (
                <>
                  <Row className="g-4">
                    {currentPendingItems.map((req) => (
                      <Col key={req.customerCharacterId} xs={12}>
                        <Card className="rental-card shadow">
                          <Card.Body>
                            <div className="d-flex flex-column flex-md-row gap-4 align-items-md-center">
                              <div className="flex-grow-1">
                                <div className="d-flex gap-3">
                                  <div className="icon-circle">
                                    <FileText size={24} />
                                  </div>
                                  <div>
                                    <h3 className="rental-title">{req.name}</h3>
                                    <div className="text-muted small">
                                      <Calendar size={16} /> Create Date:{" "}
                                      {req.createDate}
                                    </div>
                                    {getStatusBadge(req.status)}
                                  </div>
                                </div>
                              </div>
                              <div className="d-flex gap-2 align-items-center">
                                <Button
                                  type="primary"
                                  size="small"
                                  className="btn-view"
                                  onClick={() => handleOpenModal(req)}
                                >
                                  <Eye size={16} /> View
                                </Button>
                              </div>
                            </div>
                          </Card.Body>
                        </Card>
                      </Col>
                    ))}
                  </Row>
                  <Pagination
                    current={currentPendingPage}
                    pageSize={itemsPerPage}
                    total={filteredPendingRequests.length}
                    onChange={(page) => setCurrentPendingPage(page)}
                    showSizeChanger={false}
                    style={{ marginTop: "20px", textAlign: "right" }}
                  />
                </>
              )}
            </TabPane>

            <TabPane tab="Browsed Requests" key="2">
              {currentBrowsedItems.length === 0 ? (
                <p className="text-center">No browsed requests found.</p>
              ) : (
                <>
                  <Row className="g-4">
                    {currentBrowsedItems.map((req) => (
                      <Col key={req.customerCharacterId} xs={12}>
                        <Card className="rental-card shadow">
                          <Card.Body>
                            <div className="d-flex flex-column flex-md-row gap-4 align-items-md-center">
                              <div className="flex-grow-1">
                                <div className="d-flex gap-3">
                                  <div className="icon-circle">
                                    <FileText size={24} />
                                  </div>
                                  <div>
                                    <h3 className="rental-title">{req.name}</h3>
                                    <div className="text-muted small">
                                      <Calendar size={16} /> Create Date:{" "}
                                      {req.createDate}
                                    </div>
                                    {getStatusBadge(req.status)}
                                  </div>
                                </div>
                              </div>
                              <div className="d-flex gap-2 align-items-center">
                                <Button
                                  type="primary"
                                  size="small"
                                  className="btn-view"
                                  onClick={() => handleOpenModal(req)}
                                >
                                  <Eye size={16} /> View
                                </Button>
                              </div>
                            </div>
                          </Card.Body>
                        </Card>
                      </Col>
                    ))}
                  </Row>
                  <Pagination
                    current={currentBrowsedPage}
                    pageSize={itemsPerPage}
                    total={filteredBrowsedRequests.length}
                    onChange={(page) => setCurrentBrowsedPage(page)}
                    showSizeChanger={false}
                    style={{ marginTop: "20px", textAlign: "right" }}
                  />
                </>
              )}
            </TabPane>

            <TabPane tab="Completed Requests" key="3">
              {currentCompletedItems.length === 0 ? (
                <p className="text-center">No completed requests found.</p>
              ) : (
                <>
                  <Row className="g-4">
                    {currentCompletedItems.map((req) => (
                      <Col key={req.customerCharacterId} xs={12}>
                        <Card className="rental-card shadow">
                          <Card.Body>
                            <div className="d-flex flex-column flex-md-row gap-4 align-items-md-center">
                              <div className="flex-grow-1">
                                <div className="d-flex gap-3">
                                  <div className="icon-circle">
                                    <FileText size={24} />
                                  </div>
                                  <div>
                                    <h3 className="rental-title">{req.name}</h3>
                                    <div className="text-muted small">
                                      <Calendar size={16} /> Create Date:{" "}
                                      {req.createDate}
                                    </div>
                                    {getStatusBadge(req.status)}
                                  </div>
                                </div>
                              </div>
                              <div className="d-flex gap-2 align-items-center">
                                <Button
                                  type="primary"
                                  size="small"
                                  className="btn-view"
                                  onClick={() => handleOpenModal(req)}
                                >
                                  <Eye size={16} /> View
                                </Button>
                              </div>
                            </div>
                          </Card.Body>
                        </Card>
                      </Col>
                    ))}
                  </Row>
                  <Pagination
                    current={currentCompletedPage}
                    pageSize={itemsPerPage}
                    total={filteredCompletedRequests.length}
                    onChange={(page) => setCurrentCompletedPage(page)}
                    showSizeChanger={false}
                    style={{ marginTop: "20px", textAlign: "right" }}
                  />
                </>
              )}
            </TabPane>
          </Tabs>
        )}

        {/* Modal hợp nhất View và Edit */}
        <Modal
          title={
            isEditable
              ? "Edit Customer Character Request"
              : "View Customer Character Request"
          }
          open={isModalVisible}
          onOk={
            isEditable ? handleUpdateRequest : () => setIsModalVisible(false)
          }
          onCancel={() => setIsModalVisible(false)}
          okText={isEditable ? "Update" : "Close"}
          cancelText="Cancel"
          confirmLoading={loading}
          width={600}
          footer={
            isEditable
              ? [
                  <Button key="cancel" onClick={() => setIsModalVisible(false)}>
                    Cancel
                  </Button>,
                  <Button
                    key="update"
                    type="primary"
                    onClick={handleUpdateRequest}
                    loading={loading}
                  >
                    Update
                  </Button>,
                ]
              : [
                  <Button key="close" onClick={() => setIsModalVisible(false)}>
                    Close
                  </Button>,
                ]
          }
        >
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Name</Form.Label>
              <Input
                value={modalData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                disabled={true} // Luôn disabled vì bạn đã disable trong modal Edit
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Description</Form.Label>
              <Input.TextArea
                value={modalData.description}
                onChange={(e) =>
                  handleInputChange("description", e.target.value)
                }
                rows={3}
                disabled={!isEditable}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Category</Form.Label>
              {isEditable ? (
                <Select
                  value={modalData.categoryId}
                  onChange={(value) => handleInputChange("categoryId", value)}
                  style={{ width: "100%" }}
                >
                  {categories.map((category) => (
                    <Option
                      key={category.categoryId}
                      value={category.categoryId}
                    >
                      {category.categoryName}
                    </Option>
                  ))}
                </Select>
              ) : (
                <Input
                  value={getCategoryNameById(modalData.categoryId)}
                  disabled
                />
              )}
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Max Height (cm)</Form.Label>
              <Input
                type="number"
                value={modalData.maxHeight}
                onChange={(e) =>
                  handleInputChange("maxHeight", Number(e.target.value))
                }
                disabled={!isEditable}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Max Weight (kg)</Form.Label>
              <Input
                type="number"
                value={modalData.maxWeight}
                onChange={(e) =>
                  handleInputChange("maxWeight", Number(e.target.value))
                }
                disabled={!isEditable}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Min Height (cm)</Form.Label>
              <Input
                type="number"
                value={modalData.minHeight}
                onChange={(e) =>
                  handleInputChange("minHeight", Number(e.target.value))
                }
                disabled={!isEditable}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Min Weight (kg)</Form.Label>
              <Input
                type="number"
                value={modalData.minWeight}
                onChange={(e) =>
                  handleInputChange("minWeight", Number(e.target.value))
                }
                disabled={!isEditable}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Create Date</Form.Label>
              <Input value={modalData.createDate} disabled />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Update Date</Form.Label>
              <Input value={modalData.updateDate || "N/A"} disabled />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Created By</Form.Label>
              <Input value={getAccountNameById(modalData.createBy)} disabled />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Status</Form.Label>
              <Input value={modalData.status} disabled />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Reason</Form.Label>
              <Input value={modalData.reason || "N/A"} disabled />
            </Form.Group>
            <h5>Images</h5>
            {modalData.images.length === 0 ? (
              <p>No images available.</p>
            ) : (
              modalData.images.map((img) => (
                <div
                  key={img.customerCharacterImageId}
                  className="mb-3 d-flex align-items-center"
                >
                  <Image
                    src={img.urlImage}
                    alt="Character Image"
                    width={100}
                    preview
                    style={{ display: "block", marginRight: "10px" }}
                  />
                  <div>
                    <p>Create Date: {img.createDate}</p>
                    {isEditable && (
                      <Button
                        danger
                        size="small"
                        onClick={() =>
                          handleRemoveImage(img.customerCharacterImageId)
                        }
                      >
                        <Delete size={16} /> Remove
                      </Button>
                    )}
                  </div>
                </div>
              ))
            )}
            {isEditable && (
              <Form.Group className="mb-3">
                <Form.Label>Upload New Images</Form.Label>
                <Input
                  type="file"
                  multiple
                  onChange={handleImageUpload}
                  accept="image/*"
                />
                {newImages.length > 0 && (
                  <p>Selected {newImages.length} new image(s)</p>
                )}
              </Form.Group>
            )}
          </Form>
        </Modal>
      </Container>
    </div>
  );
};

export default MyCustomerCharacter;
