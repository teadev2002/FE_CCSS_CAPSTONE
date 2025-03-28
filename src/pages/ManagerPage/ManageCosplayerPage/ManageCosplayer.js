// src/components/ManageCosplayer.jsx
import React, { useState } from "react";
import { Button, Form, Dropdown } from "react-bootstrap";
import CosplayerList from "./CosplayerList";
import CosplayerForm from "./CosplayerForm";
import "../../../styles/Manager/ManageCosplayer.scss";
const ManageCosplayer = () => {
  const [cosplayers, setCosplayers] = useState([
    {
      accountId: "A001",
      name: "Sailor Moon",
      email: "sailor.moon@example.com",
      password: "hashed_password_123",
      description: "A magical girl cosplayer.",
      birthday: "1992-06-30",
      phone: "123-456-7890",
      isActive: true,
      onTask: false,
      leader: "L001",
      code: "SM001",
      taskQuantity: 5,
      height: 165,
      weight: 55,
      averageStar: 4.5,
      salaryIndex: 1.2,
      roleId: "R001",
      images: [
        { imageId: "IMG001", urlImage: "https://example.com/sailormoon1.jpg" },
        { imageId: "IMG002", urlImage: "https://example.com/sailormoon2.jpg" },
      ],
    },
    {
      accountId: "A002",
      name: "Naruto Uzumaki",
      email: "naruto.uzumaki@example.com",
      password: "hashed_password_456",
      description: "A ninja cosplayer from Hidden Leaf.",
      birthday: "1990-10-10",
      phone: "987-654-3210",
      isActive: true,
      onTask: true,
      leader: "L002",
      code: "NU001",
      taskQuantity: 3,
      height: 170,
      weight: 60,
      averageStar: 4.8,
      salaryIndex: 1.5,
      roleId: "R002",
      images: [
        { imageId: "IMG003", urlImage: "https://example.com/naruto1.jpg" },
      ],
    },
  ]);

  const [filteredCosplayers, setFilteredCosplayers] = useState(cosplayers);
  const [searchTerm, setSearchTerm] = useState("");
  const [rowsPerPage, setRowsPerPage] = useState(5); // Mặc định là 5 như trong hình
  const rowsPerPageOptions = [5, 10, 20, 30];
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentCosplayer, setCurrentCosplayer] = useState(null);

  const handleShowModal = (cosplayer = null) => {
    if (cosplayer) {
      setIsEditing(true);
      setCurrentCosplayer(cosplayer);
    } else {
      setIsEditing(false);
      setCurrentCosplayer(null);
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setIsEditing(false);
    setCurrentCosplayer(null);
  };

  const handleCreateOrUpdate = (formData) => {
    if (isEditing) {
      const updatedCosplayers = cosplayers.map((cosplayer) =>
        cosplayer.accountId === currentCosplayer.accountId
          ? formData
          : cosplayer
      );
      setCosplayers(updatedCosplayers);
      setFilteredCosplayers(updatedCosplayers);
    } else {
      const updatedCosplayers = [...cosplayers, formData];
      setCosplayers(updatedCosplayers);
      setFilteredCosplayers(updatedCosplayers);
    }
    handleCloseModal();
  };

  const handleDelete = (accountId) => {
    const updatedCosplayers = cosplayers.filter(
      (cosplayer) => cosplayer.accountId !== accountId
    );
    setCosplayers(updatedCosplayers);
    setFilteredCosplayers(updatedCosplayers);
  };

  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    const filtered = cosplayers.filter(
      (cosplayer) =>
        cosplayer.name.toLowerCase().includes(value.toLowerCase()) ||
        cosplayer.description.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredCosplayers(filtered);
  };

  const handleRowsPerPageChange = (value) => {
    setRowsPerPage(value);
  };

  return (
    <div className="manage-cosplayer-container">
      <h2 className="manage-cosplayer-title">Manage Cosplayers</h2>
      <div className="header-controls">
        <div className="rows-per-page">
          <span>Rows per page: </span>
          <Dropdown
            onSelect={(value) => handleRowsPerPageChange(Number(value))}
            className="d-inline-block"
          >
            <Dropdown.Toggle
              variant="outline-secondary"
              id="dropdown-rows-per-page"
            >
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
        <Form.Control
          type="text"
          placeholder="Search by name or description"
          value={searchTerm}
          onChange={handleSearch}
          className="search-bar"
        />
        <Button
          variant="primary"
          onClick={() => handleShowModal()}
          className="add-cosplayer-btn"
        >
          + Add New Cosplayer
        </Button>
      </div>

      <CosplayerList
        cosplayers={filteredCosplayers}
        onEdit={handleShowModal}
        onDelete={handleDelete}
        rowsPerPage={rowsPerPage}
        setRowsPerPage={setRowsPerPage}
      />

      {showModal && (
        <CosplayerForm
          show={showModal}
          onClose={handleCloseModal}
          onSubmit={handleCreateOrUpdate}
          initialData={currentCosplayer}
          isEditing={isEditing}
        />
      )}
    </div>
  );
};

export default ManageCosplayer;
