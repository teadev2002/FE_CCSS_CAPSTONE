import React, { useState, useEffect } from "react";
import { Card, Form } from "react-bootstrap";
import { Button } from "antd";
import { toast } from "react-toastify";
import CharacterList from "./CharacterList";
import CharacterForm from "./CharacterForm";
import CharacterService from "../../../services/ManageServicePages/ManageCharacterService/CharacterService";
import "../../../styles/Manager/ManageCharacter.scss";

const ManageCharacter = () => {
  const [characters, setCharacters] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentCharacter, setCurrentCharacter] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

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
      toast.error("Failed to load characters.");
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
        setCurrentCharacter({ ...data, imageFiles: [] });
        setError(null);
      } catch (err) {
        setError(err.message);
        setCurrentCharacter({ ...character, imageFiles: [] });
        toast.error("Failed to load character details.");
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
      handleCloseModal();
    } catch (err) {
      toast.error(
        `Failed to ${isEditing ? "update" : "add"} character: ${err.message}`
      );
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (characterId) => {
    setLoading(true);
    try {
      await CharacterService.deleteCharacter(characterId);
      setCharacters(characters.filter((c) => c.characterId !== characterId));
      toast.success("Character deleted successfully!");
    } catch (err) {
      toast.error(`Failed to delete character: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="manage-character">
      <h2 className="manage-character-title">Manage Characters</h2>
      <div className="table-container">
        <Card className="character-table-card">
          <Card.Body>
            <div className="table-header">
              <h3>Characters</h3>
              <Form.Control
                type="text"
                placeholder="Search by name or description..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input"
                aria-label="Search characters"
                style={{ width: "50%" }}
              />
              <Button
                type="primary"
                onClick={() => handleShowModal()}
                disabled={loading}
              >
                Add New Character
              </Button>
            </div>
            {error && <p className="error-message">{error}</p>}
            <CharacterList
              characters={characters}
              onEdit={handleShowModal}
              onDelete={handleDelete}
              loading={loading}
              searchTerm={searchTerm}
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
          </Card.Body>
        </Card>
      </div>
    </div>
  );
};

export default ManageCharacter;
