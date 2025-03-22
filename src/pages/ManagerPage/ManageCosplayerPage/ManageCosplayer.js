import React, { useState } from "react";
import CosplayerList from "./CosplayerList";
import CosplayerForm from "./CosplayerForm";
import Button from "@mui/material/Button";
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

  const [openModal, setOpenModal] = useState(false);
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
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setIsEditing(false);
    setCurrentCosplayer(null);
  };

  const handleCreateOrUpdate = (formData) => {
    if (isEditing) {
      setCosplayers(
        cosplayers.map((cosplayer) =>
          cosplayer.accountId === currentCosplayer.accountId
            ? formData
            : cosplayer
        )
      );
    } else {
      setCosplayers([...cosplayers, formData]);
    }
    handleCloseModal();
  };

  const handleDelete = (accountId) => {
    if (window.confirm("Are you sure you want to delete this cosplayer?")) {
      setCosplayers(
        cosplayers.filter((cosplayer) => cosplayer.accountId !== accountId)
      );
    }
  };

  return (
    <div className="manage-cosplayer-container">
      <h2 className="manage-cosplayer-title">Manage Cosplayers</h2>
      <Button
        variant="contained"
        color="primary"
        onClick={() => handleShowModal()}
        style={{ marginBottom: 16 }}
      >
        Add New Cosplayer
      </Button>

      <CosplayerList
        cosplayers={cosplayers}
        onEdit={handleShowModal}
        onDelete={handleDelete}
      />

      {openModal && (
        <CosplayerForm
          open={openModal}
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
