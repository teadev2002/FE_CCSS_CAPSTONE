import React, { useState, useCallback } from "react";
import {
  Container,
  Row,
  Col,
  Form,
  Button,
  Card,
  Spinner,
  Alert,
} from "react-bootstrap";
import { Select, notification } from "antd";
import { Search, Save } from "lucide-react";
import ManageAssignTaskService from "../../../services/ManageServicePages/ManageAssignTaskService/ManageAssignTaskService.js";
import "../../../styles/Manager/ManageAssignTask.scss";
import dayjs from "dayjs";

const ManageAssignTask = () => {
  const [packageName, setPackageName] = useState("");
  const [request, setRequest] = useState(null);
  const [cosplayersByCharacter, setCosplayersByCharacter] = useState({});
  const [assignments, setAssignments] = useState(new Map());
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const dateTimeFormat = "HH:mm DD/MM/YYYY";

  const validatePackageName = (name) => {
    return name.trim().length >= 3;
  };

  const handleSearch = useCallback(async () => {
    const trimmedPackageName = packageName.trim();
    if (!validatePackageName(trimmedPackageName)) {
      setError("Package name must be at least 3 characters");
      return;
    }

    setError("");
    setIsLoading(true);
    setRequest(null);
    setCosplayersByCharacter({});
    setAssignments(new Map());

    try {
      // Fetch all packages
      const packages = await ManageAssignTaskService.getAllPackages();
      const matchingPackages = packages.filter((pkg) =>
        pkg.packageName.toLowerCase().includes(trimmedPackageName.toLowerCase())
      );

      if (matchingPackages.length === 0) {
        setError("No packages found with that name");
        setIsLoading(false);
        return;
      }

      // Fetch all requests
      const allRequests = await ManageAssignTaskService.getAllRequests();
      const filteredRequests = allRequests.filter(
        (req) =>
          req.packageId &&
          matchingPackages.some((pkg) => pkg.packageId === req.packageId)
      );

      if (filteredRequests.length === 0) {
        setError("No requests found for the matching packages");
        setIsLoading(false);
        return;
      }

      // Fetch request details
      const requestData = await ManageAssignTaskService.getRequestByRequestId(
        filteredRequests[0].requestId
      );
      setRequest(requestData);

      const startDateTime = dayjs(requestData.startDate).format(dateTimeFormat);
      const endDateTime = dayjs(requestData.endDate).format(dateTimeFormat);

      // Fetch all cosplayers once
      const allCosplayers = await ManageAssignTaskService.getAllCosplayers();

      // Filter cosplayers for each character
      const cosplayersMap = {};
      requestData.charactersListResponse.forEach((character) => {
        const mappedCosplayers = allCosplayers.map((cosplayer) => ({
          accountId: cosplayer.accountId,
          name: cosplayer.name,
          height: cosplayer.height ?? 0,
          weight: cosplayer.weight ?? 0,
          averageStar: cosplayer.salaryIndex,
          onTask: cosplayer.onTask, // Assuming API provides this
        }));

        cosplayersMap[character.characterId] = mappedCosplayers.filter(
          (cosplayer) =>
            cosplayer.height !== 0 &&
            cosplayer.weight !== 0 &&
            cosplayer.height > character.minHeight &&
            cosplayer.height < character.maxHeight &&
            cosplayer.weight > character.minWeight &&
            cosplayer.weight < character.maxWeight &&
            (cosplayer.onTask === null || cosplayer.onTask === false) // Check availability
        );

        if (cosplayersMap[character.characterId].length === 0) {
          console.warn(
            `No suitable cosplayers found for character ${character.characterId}`,
            {
              minHeight: character.minHeight,
              maxHeight: character.maxHeight,
              minWeight: character.minWeight,
              maxWeight: character.maxWeight,
            }
          );
        }
      });
      setCosplayersByCharacter(cosplayersMap);

      if (Object.values(cosplayersMap).every((arr) => arr.length === 0)) {
        setError(
          "No suitable cosplayers available for any character in this request."
        );
      }
    } catch (error) {
      notification.error({
        message: "Error",
        description: "Failed to fetch data",
      });
      console.error("Error in handleSearch:", error);
    } finally {
      setIsLoading(false);
    }
  }, [packageName]);

  const handleAssignment = useCallback((characterId, cosplayerId) => {
    setAssignments((prev) => new Map(prev.set(characterId, cosplayerId)));
  }, []);

  const handleSubmit = useCallback(async () => {
    if (!request) return;

    setIsLoading(true);
    try {
      const tasksToSubmit = Array.from(assignments.entries()).map(
        ([characterId, cosplayerId]) => ({
          requestId: request.requestId,
          characterId,
          cosplayerId,
        })
      );

      await ManageAssignTaskService.assignTask(
        request.requestId,
        tasksToSubmit
      );

      notification.success({
        message: "Success",
        description: "Tasks assigned successfully!",
      });

      setRequest(null);
      setPackageName("");
      setAssignments(new Map());
      setCosplayersByCharacter({});
    } catch (error) {
      notification.error({
        message: "Error",
        description: error.message || "Failed to assign tasks",
      });
      console.error("Error in handleSubmit:", error);
    } finally {
      setIsLoading(false);
    }
  }, [request, assignments]);

  const getCosplayerOptions = (characterId) => {
    const cosplayers = cosplayersByCharacter[characterId] || [];
    if (!cosplayers.length) {
      return [{ value: "", label: "No cosplayers available", disabled: true }];
    }
    return cosplayers.map((c) => ({
      value: c.accountId,
      label: `${c.name} (H: ${c.height}cm, W: ${c.weight}kg, R: ${
        c.averageStar || "N/A"
      })`,
      disabled: false,
    }));
  };

  const isCharacterAssigned = (characterId) => assignments.has(characterId);
  const canSubmit =
    request &&
    assignments.size === request.charactersListResponse.length &&
    !isLoading;

  return (
    <div className="mat-page-wrapper">
      <Container className="mat-container">
        <h1 className="mat-title">Cosplay Assignment Manager</h1>

        <Form.Group className="mat-search-form">
          <Form.Control
            type="text"
            placeholder="Enter Package Name (e.g., Ultimate Merchandise Pack)"
            value={packageName}
            onChange={(e) => setPackageName(e.target.value)}
            isInvalid={!!error}
            disabled={isLoading}
            className="mat-search-input"
          />
          <Form.Control.Feedback type="invalid">{error}</Form.Control.Feedback>
          <Button
            variant="primary"
            onClick={handleSearch}
            disabled={isLoading || !packageName.trim()}
            className="mat-search-button"
          >
            {isLoading ? (
              <Spinner animation="border" size="sm" />
            ) : (
              <Search size={20} />
            )}
          </Button>
        </Form.Group>

        {request && (
          <div className="mat-content">
            <Card className="mat-details-card">
              <Card.Body>
                <Card.Title>Request Details</Card.Title>
                <Card.Text>
                  <strong>Request ID:</strong> {request.requestId}
                  <br />
                  <strong>Name:</strong> {request.name}
                  <br />
                  <strong>Status:</strong> {request.status}
                  <br />
                  <strong>Date:</strong>{" "}
                  {dayjs(request.startDate).format(dateTimeFormat)} -{" "}
                  {dayjs(request.endDate).format(dateTimeFormat)}
                </Card.Text>
              </Card.Body>
            </Card>

            <Row>
              {request.charactersListResponse.map((character) => (
                <Col xs={12} sm={6} md={4} key={character.characterId}>
                  <Card className="mat-character-card">
                    {character.characterImages[0]?.urlImage && (
                      <Card.Img
                        variant="top"
                        src={character.characterImages[0].urlImage}
                        alt={character.description || "Character"}
                        className="mat-character-image"
                      />
                    )}
                    <Card.Body>
                      <Card.Title>
                        {character.characterName || "Unnamed Character"}
                      </Card.Title>
                      <Card.Title>
                        {character.description || "Unnamed Character"}
                      </Card.Title>
                      <Card.Text>
                        H: {character.minHeight}-{character.maxHeight}cm
                        <br />
                        W: {character.minWeight}-{character.maxWeight}kg
                      </Card.Text>
                      <Select
                        placeholder="Select Cosplayer"
                        value={assignments.get(character.characterId)}
                        onChange={(value) =>
                          handleAssignment(character.characterId, value)
                        }
                        options={getCosplayerOptions(character.characterId)}
                        disabled={isLoading}
                        showSearch
                        optionFilterProp="label"
                        className="mat-select"
                      />
                    </Card.Body>
                    <Card.Footer
                      className={`mat-status ${
                        isCharacterAssigned(character.characterId)
                          ? "mat-status-assigned"
                          : "mat-status-unassigned"
                      }`}
                    >
                      {isCharacterAssigned(character.characterId)
                        ? "Assigned"
                        : "Not Assigned"}
                    </Card.Footer>
                  </Card>
                </Col>
              ))}
            </Row>

            <div className="mat-actions">
              <Button
                variant="success"
                onClick={handleSubmit}
                disabled={!canSubmit}
                className="mat-submit-button"
              >
                {isLoading ? (
                  <Spinner animation="border" size="sm" />
                ) : (
                  <>
                    <Save size={20} className="mat-icon" /> Save Assignments
                  </>
                )}
              </Button>
            </div>
          </div>
        )}
      </Container>
    </div>
  );
};

export default ManageAssignTask;
