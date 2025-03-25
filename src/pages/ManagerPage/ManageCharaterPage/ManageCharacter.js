// còn lỗi  và update

//boot
import React, { useState, useEffect } from "react";
import CharacterList from "./CharacterList";
import CharacterForm from "./CharacterForm";
import Button from "react-bootstrap/Button";
import CharacterService from "../../../services/ManageServicePages/ManageCharacterService/CharacterService";
import { toast } from "react-toastify";
import "../../../styles/Manager/ManageCharacter.scss";

const ManageCharacter = () => {
  const [characters, setCharacters] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentCharacter, setCurrentCharacter] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

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
        console.log("API Response for character:", data);
        setCurrentCharacter({
          ...data,
          imageFiles: [],
        });
        setError(null);
      } catch (err) {
        setError(err.message);
        setCurrentCharacter({
          ...character,
          imageFiles: [],
        });
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
        await CharacterService.updateCharacter(formData.characterId, formData);
        toast.success("Character updated successfully!");
      } else {
        await CharacterService.createCharacter(formData);
        toast.success("Character added successfully!");
      }
      await fetchCharacters();
      setError(null);
      handleCloseModal();
    } catch (err) {
      setError(err.message);
      toast.error(
        `Failed to ${isEditing ? "update" : "add"} character: ${err.message}`
      );
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
        toast.success("Character deleted successfully!");
      } catch (err) {
        setError(err.message);
        toast.error(`Failed to delete character: ${err.message}`);
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="manage-character-container">
      <h2 className="manage-character-title">Manage Characters</h2>
      <Button
        variant="primary"
        onClick={() => handleShowModal()}
        className="mb-3"
        disabled={loading}
      >
        Add New Character
      </Button>

      {error && <p className="text-danger">{error}</p>}
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
