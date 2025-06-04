import React, { useState, useEffect } from "react";
import { Card, Spinner } from "react-bootstrap";
import { toast } from "react-toastify";
import DetailEventOrganizationPageService from "../../services/DetailEventOrganizationPageService/DetailEventOrganizationPageService.js";

const ViewDetailCharacter = ({ characterId }) => {
  const [character, setCharacter] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCharacterDetails = async () => {
      if (!characterId) {
        setLoading(false);
        return;
      }
      try {
        setLoading(true);
        const characterData =
          await DetailEventOrganizationPageService.getCharacterById(
            characterId
          );
        const images =
          await DetailEventOrganizationPageService.getCharacterImageByCharacterId(
            characterId
          );
        setCharacter({ ...characterData, images: images || [] });
      } catch (error) {
        toast.error("Failed to fetch character details. Please try again.");
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchCharacterDetails();
  }, [characterId]);

  if (loading) {
    return (
      <div className="text-center">
        <Spinner animation="border" />
        <p>Loading character details...</p>
      </div>
    );
  }

  if (!character) {
    return <div>No character data available.</div>;
  }

  return (
    <Card>
      {character.images?.[0]?.urlImage && (
        <Card.Img
          variant="top"
          src={character.images[0].urlImage}
          alt={character.characterName}
          style={{ maxHeight: "300px", objectFit: "cover" }}
        />
      )}
      <Card.Body>
        <Card.Title>{character.characterName}</Card.Title>
        <Card.Text>
          <strong>Description:</strong> {character.description || "N/A"}
        </Card.Text>
        <Card.Text>
          <strong>Price:</strong> {character.price?.toLocaleString() || 0} VND
        </Card.Text>
        <Card.Text>
          <strong>Quantity Available:</strong> {character.quantity || 0}
        </Card.Text>
        <Card.Text>
          <strong>Height:</strong> {character.minHeight || 0} -{" "}
          {character.maxHeight || 0} cm
        </Card.Text>
        <Card.Text>
          <strong>Weight:</strong> {character.minWeight || 0} -{" "}
          {character.maxWeight || 0} kg
        </Card.Text>
      </Card.Body>
    </Card>
  );
};

export default ViewDetailCharacter;
