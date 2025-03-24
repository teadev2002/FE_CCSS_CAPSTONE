import React, { useState, useEffect } from "react";
import CharacterList from "./CharacterList";
import CharacterForm from "./CharacterForm";
import Button from "@mui/material/Button";
import CharacterService from "../../../services/ManageServicePages/ManageCharacterService/CharacterService"; // Import service
import "../../../styles/Manager/ManageCharacter.scss";

const ManageCharacter = () => {
  const [characters, setCharacters] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentCharacter, setCurrentCharacter] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Lấy tất cả characters khi component mount
  useEffect(() => {
    fetchCharacters();
  }, []);

  const fetchCharacters = async () => {
    setLoading(true);
    try {
      const data = await CharacterService.getAllCharacters();
      setCharacters(data);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleShowModal = async (character = null) => {
    if (character) {
      setIsEditing(true);
      setLoading(true);
      try {
        const data = await CharacterService.getCharacterById(
          character.characterId
        );
        setCurrentCharacter(data);
        setError(null);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
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

  const handleCreateOrUpdate = async (formData) => {
    setLoading(true);
    try {
      if (isEditing) {
        const updatedCharacter = await CharacterService.updateCharacter(
          formData.characterId,
          formData
        );
        setCharacters(
          characters.map((c) =>
            c.characterId === updatedCharacter.characterId
              ? updatedCharacter
              : c
          )
        );
      } else {
        const newCharacter = await CharacterService.createCharacter(formData);
        setCharacters([...characters, newCharacter]);
      }
      setError(null);
      handleCloseModal();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (characterId) => {
    if (window.confirm("Are you sure you want to delete this character?")) {
      setLoading(true);
      try {
        await CharacterService.deleteCharacter(characterId);
        setCharacters(characters.filter((c) => c.characterId !== characterId));
        setError(null);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
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
        disabled={loading}
      >
        Add New Character
      </Button>

      {error && <p style={{ color: "red" }}>{error}</p>}
      <CharacterList
        characters={characters}
        onEdit={handleShowModal}
        onDelete={handleDelete}
        loading={loading}
      />

      {openModal && (
        <CharacterForm
          open={openModal}
          onClose={handleCloseModal}
          onSubmit={handleCreateOrUpdate}
          initialData={currentCharacter}
          isEditing={isEditing}
          loading={loading}
        />
      )}
    </div>
  );
};

export default ManageCharacter;
