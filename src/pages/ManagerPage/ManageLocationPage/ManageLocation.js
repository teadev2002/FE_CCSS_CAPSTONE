import React, { useState, useEffect } from "react";
import {
    Table,
    Modal,
    Form,
    Card,
    Pagination,
    Dropdown,
    Row,
    Col,
} from "react-bootstrap";
import LocationService from "../../../services/ManageServicePages/ManageLocationService/LocationService.js"; // Service cho Location
import "../../../styles/Manager/ManageLocation.scss"; // File SCSS
import { Button, message, Popconfirm } from "antd"; // Import từ antd
import { toast } from "react-toastify";
import { ArrowUp, ArrowDown, PlusCircle } from "lucide-react";
import Box from "@mui/material/Box";
import LinearProgress from "@mui/material/LinearProgress";

// Component chính để quản lý Location
const ManageLocation = () => {
    // State để lưu danh sách địa điểm
    const [locations, setLocations] = useState([]);
    // State kiểm soát hiển thị modal
    const [showModal, setShowModal] = useState(false);
    // State lưu thông tin địa điểm hiện tại (khi xem chi tiết)
    const [currentLocation, setCurrentLocation] = useState(null);
    // State kiểm soát trạng thái đang tải
    const [isLoading, setIsLoading] = useState(false);
    // State lưu lỗi nếu có
    const [error, setError] = useState(null);
    // State lưu dữ liệu form
    const [formData, setFormData] = useState({
        address: "",
        capacityMin: "",
        capacityMax: "",
    });
    // State lưu từ khóa tìm kiếm
    const [searchTerm, setSearchTerm] = useState("");
    // State lưu thông tin sắp xếp
    const [sortLocation, setSortLocation] = useState({
        field: "locationId",
        order: "asc",
    });
    // State lưu trang hiện tại
    const [currentPage, setCurrentPage] = useState(1);
    // State lưu số hàng mỗi trang
    const [rowsPerPage, setRowsPerPage] = useState(5);
    // Các tùy chọn số hàng mỗi trang
    const rowsPerPageOptions = [5, 10, 20];
    const [isFormValid, setIsFormValid] = useState(false);

    // Hàm validate form
    const validateForm = (data, existingLocations) => {
        const { address, capacityMin, capacityMax } = data;

        // Kiểm tra address không trống
        if (!address || address.trim() === "") {
            return { isValid: false, errorMessage: "Address cannot be empty!" };
        }

        // Kiểm tra address trùng lặp (so sánh không phân biệt hoa thường)
        const isDuplicate = existingLocations.some(
            (location) => location.address.toLowerCase() === address.trim().toLowerCase()
        );
        if (isDuplicate) {
            return { isValid: false, errorMessage: "This address already exists!" };
        }

        // Kiểm tra capacityMin là số hợp lệ (cho phép 0)
        if (isNaN(capacityMin) || capacityMin < 0) {
            return { isValid: false, errorMessage: "Capacity Min cannot be negative!" };
        }

        // Kiểm tra capacityMax là số hợp lệ và > capacityMin
        if (isNaN(capacityMax) || capacityMax <= capacityMin) {
            return { isValid: false, errorMessage: "Capacity Max must be greater than Capacity Min!" };
        }

        return { isValid: true, errorMessage: "" };
    };

    // Hàm lấy danh sách địa điểm từ API
    const fetchLocations = async () => {
        setIsLoading(true); // Bắt đầu tải
        setError(null); // Xóa lỗi trước đó
        try {
            const data = await LocationService.getAllLocations(); // Gọi API GET /api/Location
            setLocations(data); // Lưu dữ liệu vào state
        } catch (error) {
            setError(
                error.response?.data?.message || error.message || "Failed to fetch locations."
            ); // Xử lý lỗi
        } finally {
            setIsLoading(false); // Kết thúc tải
        }
    };

    // Gọi hàm fetchLocations khi component mount
    useEffect(() => {
        fetchLocations();
    }, []);

    // Hàm lọc và sắp xếp dữ liệu
    const filterAndSortData = (data, search, sort) => {
        let filtered = [...data];
        // Lọc theo từ khóa tìm kiếm
        if (search) {
            filtered = filtered.filter((item) =>
                (item.address?.toLowerCase() || "").includes(search.toLowerCase())
            );
        }
        // Sắp xếp dữ liệu
        return filtered.sort((a, b) => {
            if (sort.field === "capacityMin" || sort.field === "capacityMax") {
                // Sắp xếp theo số
                const valueA = Number(a[sort.field]) || 0;
                const valueB = Number(b[sort.field]) || 0;
                return sort.order === "asc" ? valueA - valueB : valueB - valueA;
            } else {
                // Sắp xếp theo chuỗi (locationId)
                const valueA = String(a[sort.field]).toLowerCase();
                const valueB = String(b[sort.field]).toLowerCase();
                return sort.order === "asc"
                    ? valueA.localeCompare(valueB)
                    : valueB.localeCompare(valueA);
            }
        });
    };

    // Lọc và phân trang dữ liệu
    const filteredLocations = filterAndSortData(locations, searchTerm, sortLocation);
    const totalEntries = filteredLocations.length;
    const totalPages = Math.ceil(totalEntries / rowsPerPage);
    const paginatedLocations = paginateData(filteredLocations, currentPage);

    // Hàm phân trang dữ liệu
    function paginateData(data, page) {
        const startIndex = (page - 1) * rowsPerPage;
        const endIndex = startIndex + rowsPerPage;
        return data.slice(startIndex, endIndex);
    }

    // Tính toán thông tin phân trang
    const startEntry = (currentPage - 1) * rowsPerPage + 1;
    const endEntry = Math.min(currentPage * rowsPerPage, totalEntries);
    const showingText = `Showing ${startEntry} to ${endEntry} of ${totalEntries} entries`;

    // Hàm mở modal (thêm mới hoặc xem chi tiết)
    const handleShowModal = (location = null) => {
        if (location) {
            // Chế độ xem chi tiết
            setCurrentLocation(location);
            setFormData({
                address: location.address ?? "",
                capacityMin: location.capacityMin ?? 0,
                capacityMax: location.capacityMax ?? "",
            });
        } else {
            // Chế độ thêm mới
            setCurrentLocation(null);
            setFormData({
                address: "",
                capacityMin: 0, // Mặc định là 0
                capacityMax: "",
            });
        }
        setShowModal(true); // Hiển thị modal
    };

    // Hàm đóng modal
    const handleCloseModal = () => {
        setShowModal(false);
        setCurrentLocation(null);
    };

    // Hàm xử lý thay đổi input trong form
    const handleInputChange = (e) => {
        const { name, value, type } = e.target;
        const val = type === "number" ? (value === "" ? "" : Number(value)) : value;
        setFormData((prev) => ({ ...prev, [name]: val }));
    };

    // Hàm xử lý tạo location mới
    const handleSubmit = async () => {
        // Kiểm tra validate trước khi gửi
        const { isValid, errorMessage } = validateForm(formData, locations);
        if (!isValid) {
            toast.error(errorMessage);
            return;
        }

        setIsLoading(true); // Bắt đầu tải
        setError(null); // Xóa lỗi trước đó

        try {
            const locationData = {
                address: formData.address,
                capacityMin: Number(formData.capacityMin) || 0,
                capacityMax: Number(formData.capacityMax) || 0,
            };
            await LocationService.createLocation(locationData); // Gọi API POST /api/Location
            handleCloseModal(); // Đóng modal
            await fetchLocations(); // Làm mới danh sách
            toast.success("Location created successfully!"); // Thông báo thành công
        } catch (error) {
            setError(
                error.response?.data?.title ||
                error.response?.data?.message ||
                error.message ||
                "Failed to create location."
            ); // Xử lý lỗi
            toast.error("Failed to create location.");
        } finally {
            setIsLoading(false); // Kết thúc tải
        }
    };

    // Hàm xóa địa điểm
    const handleDelete = async (locationId) => {
        setIsLoading(true); // Bắt đầu tải
        setError(null); // Xóa lỗi trước đó
        try {
            await LocationService.deleteLocation(locationId); // Gọi API DELETE /api/Location/{id}
            await fetchLocations(); // Làm mới danh sách
            message.success("Location deleted successfully!"); // Thông báo thành công
        } catch (error) {
            setError(
                error.response?.data?.message ||
                error.message ||
                "Failed to delete location."
            ); // Xử lý lỗi
            message.error("Failed to delete location.");
        } finally {
            setIsLoading(false); // Kết thúc tải
        }
    };

    // Hàm xử lý tìm kiếm
    const handleSearch = (e) => {
        setSearchTerm(e.target.value);
        setCurrentPage(1); // Reset về trang đầu
    };

    // Hàm xử lý sắp xếp
    const handleSort = (field) => {
        setSortLocation((prev) => ({
            field,
            order: prev.field === field && prev.order === "asc" ? "desc" : "asc",
        }));
        setCurrentPage(1); // Reset về trang đầu
    };

    // Hàm thay đổi trang
    const handlePageChange = (page) => setCurrentPage(page);

    // Hàm thay đổi số hàng mỗi trang
    const handleRowsPerPageChange = (value) => {
        setRowsPerPage(value);
        setCurrentPage(1); // Reset về trang đầu
    };

    return (
        <div className="manage-locations">
            {/* Tiêu đề trang */}
            <h2 className="manage-locations-title">Manage Locations</h2>
            <div className="table-container">
                <Card className="location-table-card">
                    <Card.Body>
                        <div className="table-header">
                            <h3>Locations</h3>
                            {/* Ô tìm kiếm */}
                            <Form.Control
                                type="text"
                                placeholder="Search by address..."
                                value={searchTerm}
                                onChange={handleSearch}
                                className="search-input"
                            />
                            {/* Nút thêm địa điểm mới */}
                            <Button
                                type="primary"
                                onClick={() => handleShowModal()}
                                style={{
                                    padding: "20px 7px",
                                    fontSize: "14px",
                                    borderRadius: "4px",
                                    background: "linear-gradient(135deg, #660545, #22668a)",
                                    border: "none",
                                    color: "#fff",
                                    display: "flex",
                                    alignItems: "center",
                                }}
                                onMouseEnter={(e) =>
                                    (e.target.style.background = "linear-gradient(135deg, #22668a, #660545)")
                                }
                                onMouseLeave={(e) =>
                                    (e.target.style.background = "linear-gradient(135deg, #660545, #22668a)")
                                }
                            >
                                <PlusCircle size={16} style={{ marginRight: "8px" }} />
                                Add New Location
                            </Button>
                        </div>
                        {/* Hiển thị thanh tiến trình khi đang tải */}
                        {isLoading && (
                            <Box sx={{ width: "100%", marginY: 2 }}>
                                <LinearProgress />
                            </Box>
                        )}
                        {/* Hiển thị thông báo lỗi nếu có */}
                        {error && <p className="error-message">{error}</p>}
                        {!isLoading && !error && (
                            <>
                                {/* Bảng hiển thị danh sách địa điểm */}
                                <Table striped bordered hover responsive>
                                    <thead>
                                        <tr>
                                            <th className="text-center">
                                                <span
                                                    className="sortable"
                                                    onClick={() => handleSort("locationId")}
                                                >
                                                    Location ID
                                                    {sortLocation.field === "locationId" ? (
                                                        sortLocation.order === "asc" ? (
                                                            <ArrowUp size={16} />
                                                        ) : (
                                                            <ArrowDown size={16} />
                                                        )
                                                    ) : (
                                                        <ArrowUp size={16} className="default-sort-icon" />
                                                    )}
                                                </span>
                                            </th>
                                            <th className="text-center">Address</th> {/* Không sortable */}
                                            <th className="text-center">
                                                <span
                                                    className="sortable"
                                                    onClick={() => handleSort("capacityMin")}
                                                >
                                                    Capacity Min
                                                    {sortLocation.field === "capacityMin" ? (
                                                        sortLocation.order === "asc" ? (
                                                            <ArrowUp size={16} />
                                                        ) : (
                                                            <ArrowDown size={16} />
                                                        )
                                                    ) : (
                                                        <ArrowUp size={16} className="default-sort-icon" />
                                                    )}
                                                </span>
                                            </th>
                                            <th className="text-center">
                                                <span
                                                    className="sortable"
                                                    onClick={() => handleSort("capacityMax")}
                                                >
                                                    Capacity Max
                                                    {sortLocation.field === "capacityMax" ? (
                                                        sortLocation.order === "asc" ? (
                                                            <ArrowUp size={16} />
                                                        ) : (
                                                            <ArrowDown size={16} />
                                                        )
                                                    ) : (
                                                        <ArrowUp size={16} className="default-sort-icon" />
                                                    )}
                                                </span>
                                            </th>
                                            <th className="text-center">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {paginatedLocations.length === 0 ? (
                                            <tr>
                                                <td colSpan="5" className="text-center text-muted">
                                                    No locations found {searchTerm && "matching your search"}.
                                                </td>
                                            </tr>
                                        ) : (
                                            paginatedLocations.map((location) => (
                                                <tr key={location.locationId}>
                                                    <td className="text-center">{location.locationId}</td>
                                                    <td className="text-center">
                                                        {location.address?.length > 50
                                                            ? `${location.address.substring(0, 50)}...`
                                                            : location.address}
                                                    </td>
                                                    <td className="text-center">{location.capacityMin}</td>
                                                    <td className="text-center">{location.capacityMax}</td>
                                                    <td className="text-center">
                                                        {/* Nút xem chi tiết */}
                                                        <Button
                                                            type="primary"
                                                            size="small"
                                                            onClick={() => handleShowModal(location)}
                                                            style={{
                                                                padding: "17px 14px",
                                                                fontSize: "14px",
                                                                borderRadius: "4px",
                                                                background: "linear-gradient(135deg, #660545, #22668a)",
                                                                border: "none",
                                                                color: "#fff",
                                                                marginRight: "8px",
                                                            }}
                                                            onMouseEnter={(e) =>
                                                                (e.target.style.background = "linear-gradient(135deg, #22668a, #660545)")
                                                            }
                                                            onMouseLeave={(e) =>
                                                                (e.target.style.background = "linear-gradient(135deg, #660545, #22668a)")
                                                            }
                                                        >
                                                            View Details
                                                        </Button>
                                                        {/* Nút xóa */}
                                                        <Popconfirm
                                                            title="Delete the location"
                                                            description="Are you sure to delete this location?"
                                                            onConfirm={() => handleDelete(location.locationId)}
                                                            onCancel={() => message.info("Cancelled")}
                                                            okText="Yes"
                                                            cancelText="No"
                                                        >
                                                            <Button
                                                                type="primary"
                                                                danger
                                                                size="small"
                                                                style={{
                                                                    padding: "17px 14px",
                                                                    fontSize: "14px",
                                                                    borderRadius: "4px",
                                                                    background: "#d32f2f",
                                                                    border: "none",
                                                                    color: "#fff",
                                                                }}
                                                                onMouseEnter={(e) => (e.target.style.background = "#b71c1c")}
                                                                onMouseLeave={(e) => (e.target.style.background = "#d32f2f")}
                                                            >
                                                                Disable
                                                            </Button>
                                                        </Popconfirm>
                                                    </td>
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                </Table>
                                {/* Phân trang */}
                                <div
                                    className="pagination-controls"
                                    style={{
                                        display: "flex",
                                        justifyContent: "space-between",
                                        alignItems: "center",
                                        marginTop: "20px",
                                    }}
                                >
                                    <div className="pagination-info">
                                        <span>{showingText}</span>
                                        <div style={{ display: "inline-block", marginLeft: "10px" }}>
                                            <span>Rows per page: </span>
                                            <Dropdown
                                                onSelect={(value) => handleRowsPerPageChange(Number(value))}
                                                className="d-inline-block"
                                            >
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
                                            onClick={() => handlePageChange(1)}
                                            disabled={currentPage === 1}
                                        />
                                        <Pagination.Prev
                                            onClick={() => handlePageChange(currentPage - 1)}
                                            disabled={currentPage === 1}
                                        />
                                        {[...Array(totalPages).keys()].map((page) => (
                                            <Pagination.Item
                                                key={page + 1}
                                                active={page + 1 === currentPage}
                                                onClick={() => handlePageChange(page + 1)}
                                            >
                                                {page + 1}
                                            </Pagination.Item>
                                        ))}
                                        <Pagination.Next
                                            onClick={() => handlePageChange(currentPage + 1)}
                                            disabled={currentPage === totalPages}
                                        />
                                        <Pagination.Last
                                            onClick={() => handlePageChange(totalPages)}
                                            disabled={currentPage === totalPages}
                                        />
                                    </Pagination>
                                </div>
                            </>
                        )}
                    </Card.Body>
                </Card>
            </div>

            {/* Modal thêm/xem chi tiết địa điểm */}
            <Modal show={showModal} onHide={handleCloseModal} centered className="location-modal">
                <Modal.Header closeButton={!isLoading}>
                    <Modal.Title>{currentLocation ? "Location Details" : "Add New Location"}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {error && !isLoading && <p className="error-message">{error}</p>}
                    <Form>
                        <Form.Group className="mb-3">
                            <Form.Label>Address</Form.Label>
                            <Form.Control
                                type="text"
                                name="address"
                                value={formData.address}
                                onChange={handleInputChange}
                                required
                                disabled={isLoading || currentLocation} // Vô hiệu hóa khi xem chi tiết
                                placeholder="Enter address"
                            />
                        </Form.Group>
                        <Row>
                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Capacity Min</Form.Label>
                                    <Form.Control
                                        type="number"
                                        name="capacityMin"
                                        value={formData.capacityMin}
                                        onChange={handleInputChange}
                                        required
                                        min="0"
                                        disabled={isLoading || currentLocation} // Vô hiệu hóa khi xem chi tiết
                                        placeholder="0"
                                    />
                                </Form.Group>
                            </Col>
                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Capacity Max</Form.Label>
                                    <Form.Control
                                        type="number"
                                        name="capacityMax"
                                        value={formData.capacityMax}
                                        onChange={handleInputChange}
                                        required
                                        min="0"
                                        disabled={isLoading || currentLocation} // Vô hiệu hóa khi xem chi tiết
                                        placeholder="0"
                                    />
                                </Form.Group>
                            </Col>
                        </Row>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button
                        type="default"
                        onClick={handleCloseModal}
                        disabled={isLoading}
                        style={{
                            padding: "10px 20px",
                            fontSize: "14px",
                            borderRadius: "4px",
                            background: "#e0e0e0",
                            border: "none",
                            color: "#333",
                        }}
                        onMouseEnter={(e) => (e.target.style.background = "#d0d0d0")}
                        onMouseLeave={(e) => (e.target.style.background = "#e0e0e0")}
                    >
                        {currentLocation ? "Close" : "Cancel"}
                    </Button>
                    {!currentLocation && (
                        <Popconfirm
                            title="Create new location"
                            description="Are you sure to create this location?"
                            onConfirm={handleSubmit}
                            onCancel={() => message.info("Cancelled")}
                            okText="Yes"
                            cancelText="No"
                            placement="top" // Hiển thị Popconfirm phía trên nút
                            overlayStyle={{ zIndex: 2000 }} // Đảm bảo Popconfirm hiển thị trên modal
                        >
                            <Button
                                type="primary"
                                disabled={isLoading} // Chỉ vô hiệu hóa khi đang tải
                                style={{
                                    padding: "10px 20px",
                                    fontSize: "14px",
                                    borderRadius: "4px",
                                    background: "linear-gradient(135deg, #660545, #22668a)",
                                    border: "none",
                                    color: "#fff",
                                }}
                                onMouseEnter={(e) =>
                                    (e.target.style.background = "linear-gradient(135deg, #22668a, #660545)")
                                }
                                onMouseLeave={(e) =>
                                    (e.target.style.background = "linear-gradient(135deg, #660545, #22668a)")
                                }
                            >
                                {isLoading ? "Creating..." : "Add Location"}
                            </Button>
                        </Popconfirm>
                    )}
                </Modal.Footer>
            </Modal>
        </div>
    );
};

export default ManageLocation;