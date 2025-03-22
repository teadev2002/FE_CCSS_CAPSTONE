import React, { useState } from "react";
import CharacterList from "./CharacterList";
import CharacterForm from "./CharacterForm";
import Button from "@mui/material/Button";
import "../../../styles/Manager/ManageCharacter.scss"; // Giả sử bạn tạo file SCSS tương tự

const ManageCharacter = () => {
  const [characters, setCharacters] = useState([
    {
      characterId: "C001",
      categoryId: "CAT001",
      characterName: "Sailor Moon",
      description: "A magical girl from the Sailor Moon series.",
      price: 100,
      isActive: true,
      maxHeight: 170,
      maxWeight: 60,
      minHeight: 160,
      minWeight: 50,
      quantity: 5,
      createDate: "2025-01-01",
      updateDate: "2025-01-02",
      images: [
        { imageId: "IMG001", urlImage: "https://example.com/sailormoon1.jpg" },
        { imageId: "IMG002", urlImage: "https://example.com/sailormoon2.jpg" },
      ],
    },
    {
      characterId: "C002",
      categoryId: "CAT002",
      characterName: "Naruto Uzumaki",
      description: "A ninja from the Hidden Leaf Village.",
      price: 120,
      isActive: true,
      maxHeight: 180,
      maxWeight: 70,
      minHeight: 165,
      minWeight: 55,
      quantity: 3,
      createDate: "2025-01-03",
      updateDate: "2025-01-04",
      images: [
        { imageId: "IMG003", urlImage: "https://example.com/naruto1.jpg" },
      ],
    },
  ]);

  const [openModal, setOpenModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentCharacter, setCurrentCharacter] = useState(null);

  const handleShowModal = (character = null) => {
    if (character) {
      setIsEditing(true);
      setCurrentCharacter(character);
    } else {
      setIsEditing(false);
      setCurrentCharacter(null);
    }
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setIsEditing(false);
    setCurrentCharacter(null);
  };

  const handleCreateOrUpdate = (formData) => {
    if (isEditing) {
      setCharacters(
        characters.map((character) =>
          character.characterId === currentCharacter.characterId
            ? formData
            : character
        )
      );
    } else {
      setCharacters([...characters, formData]);
    }
    handleCloseModal();
  };

  const handleDelete = (characterId) => {
    if (window.confirm("Are you sure you want to delete this character?")) {
      setCharacters(
        characters.filter((character) => character.characterId !== characterId)
      );
    }
  };

  return (
    <div className="manage-character-container">
      <h2 className="manage-character-title">Manage Characters</h2>
      <Button
        variant="contained"
        color="primary"
        onClick={() => handleShowModal()}
        style={{ marginBottom: 16 }}
      >
        Add New Character
      </Button>

      <CharacterList
        characters={characters}
        onEdit={handleShowModal}
        onDelete={handleDelete}
      />

      {openModal && (
        <CharacterForm
          open={openModal}
          onClose={handleCloseModal}
          onSubmit={handleCreateOrUpdate}
          initialData={currentCharacter}
          isEditing={isEditing}
        />
      )}
    </div>
  );
};

export default ManageCharacter;
