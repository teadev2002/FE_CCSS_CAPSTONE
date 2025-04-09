import React, { useState, useEffect } from "react";
import { Search, ChevronRight } from "lucide-react";
import {
  Modal,
  Button,
  Form,
  Container,
  Row,
  Col,
  Card,
  ProgressBar,
  InputGroup,
  FormControl,
} from "react-bootstrap";
import "../../styles/DetailEventOrganizationPage.scss";
import { toast, ToastContainer } from "react-toastify";
import DetailEventOrganizationPageService from "../../services/DetailEventOrganizationPageService/DetailEventOrganizationPageService.js";
import { jwtDecode } from "jwt-decode";

const DetailEventOrganizationPage = () => {
  const [step, setStep] = useState(1);
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [location, setLocation] = useState("");
  const [startDate, setStartDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endDate, setEndDate] = useState("");
  const [endTime, setEndTime] = useState("");
  const [description, setDescription] = useState("");
  const [images, setImages] = useState([]);
  const [selectedCharacters, setSelectedCharacters] = useState([]);
  const [showSummaryModal, setShowSummaryModal] = useState(false);
  const [characterSearch, setCharacterSearch] = useState("");
  const [showTermsModal, setShowTermsModal] = useState(false);
  const [termsAgreed, setTermsAgreed] = useState(false);
  const [isSidebarVisible, setIsSidebarVisible] = useState(true);
  const [characterNotes, setCharacterNotes] = useState({});
  const [characterQuantities, setCharacterQuantities] = useState({});
  const [packages, setPackages] = useState([]);
  const [characters, setCharacters] = useState([]);
  const [loadingPackages, setLoadingPackages] = useState(true);
  const [loadingCharacters, setLoadingCharacters] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false); // Added for API call
  const [placeholderImages] = useState([
    "https://cdn.prod.website-files.com/6769617aecf082b10bb149ff/67763d8a2775bee07438e7a5_Events.png",
    "https://jjrmarketing.com/wp-content/uploads/2019/12/International-Event.jpg",
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSnEys5tBHYLbhADjGJzoM5BloFy9AP-uyRzg&s",
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ3DNasCvfOLMIxJyQtbNq7EfLkWnMazHE9xw&s",
    "https://scandiweb.com/blog/wp-content/uploads/2020/01/ecom360_conference_hosting_successful_event.jpeg",
  ]);

  // Fetch packages
  useEffect(() => {
    const fetchPackages = async () => {
      try {
        setLoadingPackages(true);
        const data = await DetailEventOrganizationPageService.getAllPackages();
        const packagesWithImages = data.map((pkg, index) => ({
          ...pkg,
          image: placeholderImages[index % placeholderImages.length],
        }));
        setPackages(packagesWithImages);
      } catch (error) {
        toast.error("Failed to fetch packages. Please try again.");
        console.error(error);
      } finally {
        setLoadingPackages(false);
      }
    };
    fetchPackages();
  }, []);

  // Fetch characters when Step 3 is active
  useEffect(() => {
    if (step === 3) {
      const fetchCharacters = async () => {
        try {
          setLoadingCharacters(true);
          const data =
            await DetailEventOrganizationPageService.getAllCharacters();
          setCharacters(data);
        } catch (error) {
          toast.error("Failed to fetch characters. Please try again.");
          console.error(error);
        } finally {
          setLoadingCharacters(false);
        }
      };
      fetchCharacters();
    }
  }, [step]);

  // Decode accountId from accessToken
  const getAccountId = () => {
    try {
      const token = localStorage.getItem("accessToken");
      if (!token) throw new Error("No access token found");
      const decoded = jwtDecode(token);
      return decoded.Id || decoded.sub || "unknown";
    } catch (error) {
      console.error("Error decoding token:", error);
      return "unknown";
    }
  };

  // Format date and time to "HH:mm DD/MM/YYYY"
  const formatDateTime = (date, time) => {
    if (!date || !time) return "";
    const [year, month, day] = date.split("-");
    return `${time} ${day}/${month}/${year}`;
  };

  // Validate event data before API call
  const validateEventData = (data) => {
    const errors = [];
    if (!data.accountId || data.accountId === "unknown")
      errors.push("Invalid account ID");
    if (!data.name) errors.push("Package name is required");
    if (!data.description) errors.push("Description is required");
    if (!data.startDate) errors.push("Start date/time is required");
    if (!data.endDate) errors.push("End date/time is required");
    if (!data.location) errors.push("Location is required");
    if (!data.packageId) errors.push("Package ID is required");
    if (data.listRequestCharacters.length === 0)
      errors.push("At least one character is required");
    data.listRequestCharacters.forEach((char, index) => {
      if (!char.characterId)
        errors.push(`Character ${index + 1}: ID is required`);
      if (char.quantity < 1)
        errors.push(`Character ${index + 1}: Quantity must be at least 1`);
    });
    return errors;
  };

  // Save event data to localStorage and prepare for API
  const saveEventToLocalStorage = () => {
    const eventData = {
      accountId: getAccountId(),
      name: selectedPackage?.packageName || "",
      description: description || "",
      price: selectedPackage?.price || 0,
      startDate: formatDateTime(startDate, startTime),
      endDate: formatDateTime(endDate, endTime),
      location: location || "",
      serviceId: "S003",
      packageId: selectedPackage?.packageId || "",
      accountCouponId: null,
      listRequestCharacters: selectedCharacters.map((sc) => ({
        characterId: sc.characterId,
        cosplayerId: null,
        description: sc.note || null,
        quantity: sc.quantity || 1,
      })),
    };
    localStorage.setItem("eventData", JSON.stringify(eventData));
    return eventData;
  };

  // Handle API submission
  const handleSubmitEvent = async (eventData) => {
    setIsSubmitting(true);
    try {
      const response =
        await DetailEventOrganizationPageService.sendRequestEventOrganization(
          eventData
        );
      toast.success("Event created successfully!");
      console.log("API Response:", response);
      setShowSummaryModal(true);
    } catch (error) {
      toast.error("Failed to create event. Please try again.");
      console.error("API Error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle next step
  const handleNextStep = () => {
    if (step === 1 && !selectedPackage) {
      return toast.warn("Please select an event package!");
    }
    if (
      step === 2 &&
      (!location ||
        !startDate ||
        !startTime ||
        !endDate ||
        !endTime ||
        !description)
    ) {
      return toast.warn("Please fill in all required fields!");
    }
    if (step === 3 && selectedCharacters.length === 0) {
      return toast.warn("Please select at least one character!");
    }
    if (step === 4 && !termsAgreed) {
      toast.warn("Please agree to the terms and conditions before submitting!");
      return;
    }

    if (step === 1 || step === 2 || step === 3) {
      saveEventToLocalStorage();
    }

    if (step < 4) {
      setStep(step + 1);
    }
    if (step === 4) {
      const eventData = saveEventToLocalStorage();
      console.log("Event Data Before API:", JSON.stringify(eventData, null, 2));
      const validationErrors = validateEventData(eventData);
      if (validationErrors.length > 0) {
        validationErrors.forEach((error) => toast.error(error));
        return;
      }
      handleSubmitEvent(eventData);
    }
  };

  // Handle input changes in Step 2
  const handleInputChange = () => {
    const eventData = saveEventToLocalStorage();
    console.log("Updated Event Data:", JSON.stringify(eventData, null, 2));
  };

  const handlePrevStep = () => {
    if (step > 1) setStep(step - 1);
  };

  const getFormattedDateTime = (date, time) => {
    return date && time ? new Date(`${date}T${time}`).toLocaleString() : "N/A";
  };

  const filteredPackages = packages.filter((pkg) =>
    pkg.packageName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const toggleCharacterSelection = (character) => {
    setSelectedCharacters((prev) => {
      const exists = prev.some(
        (sc) => sc.characterId === character.characterId
      );
      if (exists) {
        return prev.filter((sc) => sc.characterId !== character.characterId);
      } else {
        return [
          ...prev,
          {
            characterId: character.characterId,
            characterName: character.characterName,
            note: characterNotes[character.characterId] || "",
            quantity: characterQuantities[character.characterId] || 1,
          },
        ];
      }
    });
  };

  const handleCharacterNote = (characterId, note) => {
    setCharacterNotes((prev) => ({ ...prev, [characterId]: note }));
    setSelectedCharacters((prev) =>
      prev.map((sc) => (sc.characterId === characterId ? { ...sc, note } : sc))
    );
  };

  const handleCharacterQuantity = (characterId, quantity) => {
    const qty = Math.max(1, parseInt(quantity) || 1);
    setCharacterQuantities((prev) => ({ ...prev, [characterId]: qty }));
    setSelectedCharacters((prev) =>
      prev.map((sc) =>
        sc.characterId === characterId ? { ...sc, quantity: qty } : sc
      )
    );
  };

  const calculateTotalPrice = () => {
    return selectedCharacters.reduce((sum, sc) => {
      const characterPrice =
        characters.find((char) => char.characterId === sc.characterId)?.price ||
        0;
      return sum + characterPrice * (sc.quantity || 1);
    }, 0);
  };

  useEffect(() => {
    const handleScroll = () => {
      const assignSection = document.getElementById(
        "assign-characters-section"
      );
      if (assignSection) {
        const rect = assignSection.getBoundingClientRect();
        const isVisible = rect.top >= 0 && rect.bottom <= window.innerHeight;
        setIsSidebarVisible(!isVisible);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [selectedCharacters]);

  return (
    <div className="event-organize-page min-vh-100">
      <div className="hero-section text-white py-5">
        <Container>
          <h1 className="display-4 fw-bold text-center">Organize Your Event</h1>
          <p className="lead text-center mt-3">
            Plan your event and book your favorite characters!
          </p>
        </Container>
      </div>

      <Container className="py-4">
        <ProgressBar now={(step / 4) * 100} className="progress-custom" />
        <p className="text-center mt-2">Step {step} of 4</p>
      </Container>

      <Container className="py-5">
        {/* Step 1: Select Package */}
        {step === 1 && (
          <div className="step-section fade-in">
            <h2 className="text-center mb-4">Select Event Package</h2>
            <div className="search-container mb-4">
              <InputGroup>
                <InputGroup.Text>
                  <Search size={20} />
                </InputGroup.Text>
                <FormControl
                  placeholder="Search for event packages..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </InputGroup>
            </div>
            {loadingPackages ? (
              <p className="text-center">Loading packages...</p>
            ) : (
              <Row className="package-row">
                {filteredPackages.length > 0 ? (
                  filteredPackages.map((pkg) => (
                    <Col md={4} className="mb-4" key={pkg.packageId}>
                      <Card
                        className={`package-card ${
                          selectedPackage?.packageId === pkg.packageId
                            ? "selected"
                            : ""
                        }`}
                        onClick={() => setSelectedPackage(pkg)}
                      >
                        <Card.Img variant="top" src={pkg.image} />
                        <Card.Body className="package-card-body">
                          <Card.Title>{pkg.packageName}</Card.Title>
                          <Card.Text>{pkg.description}</Card.Text>
                          <p>
                            <strong>Price: </strong>
                            {pkg.price.toLocaleString()} VND
                          </p>
                        </Card.Body>
                      </Card>
                    </Col>
                  ))
                ) : (
                  <p className="text-center">No packages found.</p>
                )}
              </Row>
            )}
          </div>
        )}

        {/* Step 2: Event Details */}
        {step === 2 && (
          <div className="step-section fade-in">
            <h2 className="text-center mb-4">Enter Event Details</h2>
            <p className="text-center mb-4">
              Provide the details for your event below. All fields are required.
            </p>
            <Form>
              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Start Date</Form.Label>
                    <Form.Control
                      type="date"
                      value={startDate}
                      onChange={(e) => {
                        setStartDate(e.target.value);
                        handleInputChange();
                      }}
                      onFocus={(e) =>
                        e.target.showPicker && e.target.showPicker()
                      }
                      className="custom-date-input"
                      required
                    />
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label>Start Time</Form.Label>
                    <Form.Control
                      type="time"
                      value={startTime}
                      onChange={(e) => {
                        setStartTime(e.target.value);
                        handleInputChange();
                      }}
                      onFocus={(e) =>
                        e.target.showPicker && e.target.showPicker()
                      }
                      className="custom-time-input"
                      required
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>End Date</Form.Label>
                    <Form.Control
                      type="date"
                      value={endDate}
                      onChange={(e) => {
                        setEndDate(e.target.value);
                        handleInputChange();
                      }}
                      onFocus={(e) =>
                        e.target.showPicker && e.target.showPicker()
                      }
                      className="custom-time-input"
                      required
                    />
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label>End Time</Form.Label>
                    <Form.Control
                      type="time"
                      value={endTime}
                      onChange={(e) => {
                        setEndTime(e.target.value);
                        handleInputChange();
                      }}
                      onFocus={(e) =>
                        e.target.showPicker && e.target.showPicker()
                      }
                      className="custom-time-input"
                      required
                    />
                  </Form.Group>
                </Col>
              </Row>
              <Form.Group className="mb-3">
                <Form.Label>Location</Form.Label>
                <Form.Control
                  type="text"
                  value={location}
                  onChange={(e) => {
                    setLocation(e.target.value);
                    handleInputChange();
                  }}
                  placeholder="Enter event location (e.g., District 12, HCMC)"
                  required
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Description</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={4}
                  value={description}
                  onChange={(e) => {
                    setDescription(e.target.value);
                    handleInputChange();
                  }}
                  placeholder="Describe your event (e.g., activities, special requirements)"
                  required
                />
              </Form.Group>
            </Form>
          </div>
        )}

        {/* Step 3: Select Characters */}
        {step === 3 && (
          <div className="step-section fade-in">
            <h2 className="text-center mb-4">Select Characters</h2>
            <p className="text-center mb-4">
              Choose characters for your event and specify quantities. You can
              select multiple characters.
            </p>
            {loadingCharacters ? (
              <p className="text-center">Loading characters...</p>
            ) : (
              <>
                <div className="search-container mb-4">
                  <InputGroup>
                    <InputGroup.Text>
                      <Search size={20} />
                    </InputGroup.Text>
                    <FormControl
                      placeholder="Search for characters..."
                      value={characterSearch}
                      onChange={(e) => setCharacterSearch(e.target.value)}
                    />
                  </InputGroup>
                </div>
                <Row className="package-row">
                  {characters
                    .filter((char) =>
                      char.characterName
                        .toLowerCase()
                        .includes(characterSearch.toLowerCase())
                    )
                    .map((character) => {
                      const isSelected = selectedCharacters.some(
                        (sc) => sc.characterId === character.characterId
                      );
                      return (
                        <Col
                          md={4}
                          className="mb-4"
                          key={character.characterId}
                        >
                          <Card
                            className={`package-card ${
                              isSelected ? "selected" : ""
                            }`}
                            onClick={() => toggleCharacterSelection(character)}
                          >
                            <Card.Img
                              variant="top"
                              src={
                                character.images.find((img) => img.isAvatar)
                                  ?.urlImage || placeholderImages[0]
                              }
                            />
                            <Card.Body className="package-card-body">
                              <Card.Title>{character.characterName}</Card.Title>
                              <Card.Text>{character.description}</Card.Text>
                              <p>
                                <strong>Price: </strong>
                                {character.price.toLocaleString()} VND
                              </p>
                              {isSelected && (
                                <>
                                  <Form.Control
                                    type="text"
                                    placeholder="Add a note (optional)"
                                    value={
                                      characterNotes[character.characterId] ||
                                      ""
                                    }
                                    onChange={(e) =>
                                      handleCharacterNote(
                                        character.characterId,
                                        e.target.value
                                      )
                                    }
                                    className="mt-2"
                                    onClick={(e) => e.stopPropagation()}
                                  />
                                  <Form.Control
                                    type="number"
                                    min="1"
                                    placeholder="Quantity"
                                    value={
                                      characterQuantities[
                                        character.characterId
                                      ] || 1
                                    }
                                    onChange={(e) =>
                                      handleCharacterQuantity(
                                        character.characterId,
                                        e.target.value
                                      )
                                    }
                                    className="mt-2"
                                    onClick={(e) => e.stopPropagation()}
                                  />
                                </>
                              )}
                            </Card.Body>
                          </Card>
                        </Col>
                      );
                    })}
                </Row>
              </>
            )}
          </div>
        )}

        {/* Step 4: Review */}
        {step === 4 && (
          <div className="step-section fade-in">
            <h2 className="text-center mb-4">Review Your Event</h2>
            <Card>
              <Card.Body>
                <p>
                  <strong>Selected Package:</strong>{" "}
                  {selectedPackage?.packageName || "N/A"}
                </p>
                <p>
                  <strong>Location:</strong> {location}
                </p>
                <p>
                  <strong>Start:</strong>{" "}
                  {getFormattedDateTime(startDate, startTime)}
                </p>
                <p>
                  <strong>End:</strong> {getFormattedDateTime(endDate, endTime)}
                </p>
                <p>
                  <strong>Description:</strong> {description}
                </p>
                <p>
                  <strong>Selected Characters:</strong>{" "}
                  {selectedCharacters.length > 0
                    ? selectedCharacters
                        .map(
                          (sc) =>
                            `${sc.characterName} (Quantity: ${
                              sc.quantity || 1
                            }, Note: ${sc.note || "None"})`
                        )
                        .join(", ")
                    : "None"}
                </p>
                <p>
                  <strong>Total Character Price: </strong>
                  {calculateTotalPrice().toLocaleString()} VND
                </p>
                <p>
                  <strong>Package Price: </strong>
                  {selectedPackage?.price.toLocaleString() || "N/A"} VND
                </p>
                <Button
                  variant="outline-secondary"
                  onClick={() => setShowTermsModal(true)}
                  className="mt-2"
                >
                  View Terms & Conditions
                </Button>
                <Form.Group className="mt-3">
                  <Form.Check
                    type="checkbox"
                    label="I have read and agree to the terms and conditions"
                    checked={termsAgreed}
                    onChange={(e) => setTermsAgreed(e.target.checked)}
                  />
                </Form.Group>
              </Card.Body>
            </Card>
          </div>
        )}

        <div className="d-flex justify-content-between mt-5">
          {step > 1 && (
            <Button variant="outline-secondary" onClick={handlePrevStep}>
              Back
            </Button>
          )}
          <div>
            <Button
              variant="outline-secondary"
              onClick={() => {
                saveEventToLocalStorage();
                toast.success("Draft saved successfully!");
              }}
              className="me-2"
            >
              Save Draft
            </Button>
            <Button
              variant="primary"
              onClick={handleNextStep}
              disabled={(step === 4 && !termsAgreed) || isSubmitting}
            >
              {isSubmitting ? (
                "Submitting..."
              ) : (
                <>
                  {step === 4 ? "Finish" : "Next"} <ChevronRight size={20} />
                </>
              )}
            </Button>
          </div>
        </div>
      </Container>

      {/* Modals */}
      <Modal
        show={showTermsModal}
        onHide={() => setShowTermsModal(false)}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Terms & Conditions</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>
            By organizing an event, you agree to the following terms:
            <ul>
              <li>All bookings are subject to availability.</li>
              <li>Event details must be accurate and complete.</li>
              <li>Cancellations must be made 48 hours in advance.</li>
              <li>Additional fees may apply for last-minute changes.</li>
            </ul>
          </p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowTermsModal(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>

      {/* <Modal
        show={showSummaryModal}
        onHide={() => setShowSummaryModal(false)}
        size="lg"
        centered
        className="summary-modal"
      >
        <Modal.Header closeButton>
          <Modal.Title>Event Summary</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>
            <strong>Selected Package:</strong>{" "}
            {selectedPackage?.packageName || "N/A"}
          </p>
          <p>
            <strong>Location:</strong> {location}
          </p>
          <p>
            <strong>Start:</strong> {getFormattedDateTime(startDate, startTime)}
          </p>
          <p>
            <strong>End:</strong> {getFormattedDateTime(endDate, endTime)}
          </p>
          <p>
            <strong>Description:</strong> {description}
          </p>
          <p>
            <strong>Selected Characters:</strong>{" "}
            {selectedCharacters.length > 0
              ? selectedCharacters
                  .map(
                    (sc) =>
                      `${sc.characterName} (Quantity: ${
                        sc.quantity || 1
                      }, Note: ${sc.note || "None"})`
                  )
                  .join(", ")
              : "None"}
          </p>
          <p>
            <strong>Total Character Price: </strong>
            {calculateTotalPrice().toLocaleString()} VND
          </p>
          <p>
            <strong>Package Price: </strong>
            {selectedPackage?.price.toLocaleString() || "N/A"} VND
          </p>
          <Button variant="primary" onClick={() => setShowSummaryModal(false)}>
            Close
          </Button>
        </Modal.Body>
      </Modal> */}

      {step === 3 && selectedCharacters.length > 0 && (
        <div
          className={`selected-cosplayers-sidebar ${
            !isSidebarVisible ? "hidden" : ""
          }`}
          id="selected-cosplayers-sidebar"
        >
          <h5>Selected Characters</h5>
          <ul className="selected-cosplayers-list">
            {selectedCharacters.map((sc) => {
              const characterPrice =
                characters.find((char) => char.characterId === sc.characterId)
                  ?.price || 0;
              return (
                <li key={sc.characterId}>
                  {sc.characterName} - {characterPrice.toLocaleString()} VND x{" "}
                  {sc.quantity || 1} (Note: {sc.note || "None"})
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
};

export default DetailEventOrganizationPage;
