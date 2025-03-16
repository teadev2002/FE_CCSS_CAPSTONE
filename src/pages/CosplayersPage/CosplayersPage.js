import React, { useState, useEffect, useRef } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Button,
  Form,
  ListGroup,
  Alert,
  Badge,
  InputGroup,
} from "react-bootstrap";
import { Search } from "lucide-react";
import "../../styles/CosplayersPage.scss";

const CosplayersPage = () => {
  const cosplayers = [
    {
      id: 1,
      name: "Luna Star",
      avatar:
        "https://images.pexels.com/photos/19231454/pexels-photo-19231454/free-photo-of-girl-in-anya-forger-costume.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
      description: "Specializes in anime and fantasy characters.",
      characters: [
        {
          name: "Sailor Moon",
          image:
            "https://th.bing.com/th/id/R.068d6e18db88dcfee0c5fef0e7d5f60f?rik=ZpQCwm59LxyECQ&pid=ImgRaw&r=0",
        },
        {
          name: "Naruto Uzumaki",
          image:
            "https://th.bing.com/th/id/OIP.kN5HWcrqUYMfIVN-rl96ZgHaLH?rs=1&pid=ImgDetMain",
        },
        {
          name: "Spider-Man",
          image:
            "https://th.bing.com/th/id/OIP.i6zQCyXX6AW0dBvKVx_xkwHaLH?rs=1&pid=ImgDetMain",
        },
      ],
      availability: [
        { date: "2025-03-15", start: "10:00", end: "17:00" },
        { date: "2025-03-16", start: "08:00", end: "17:00" },
        { date: "2025-03-20", start: "09:00", end: "17:00" },
      ],
    },
    {
      id: 2,
      name: "Kai Blade",
      avatar:
        "https://gambar.sgp1.digitaloceanspaces.com/wp-content/uploads/2021/02/kameaam.jpg",
      description: "Known for superhero and sci-fi roles.",
      characters: [
        {
          name: "Spider-Man",
          image:
            "https://th.bing.com/th/id/OIP.i6zQCyXX6AW0dBvKVx_xkwHaLH?rs=1&pid=ImgDetMain",
        },
        {
          name: "Iron Man",
          image:
            "https://th.bing.com/th/id/OIP.yYsRMvGWgsdr0FALLzcqNgHaLH?rs=1&pid=ImgDetMain",
        },
        {
          name: "Captain America",
          image:
            "https://th.bing.com/th/id/OIP.9WZgX8z5j5xY8q8Z9nX9ZwHaLH?rs=1&pid=ImgDetMain",
        },
      ],
      availability: [
        { date: "2025-03-16", start: "12:00", end: "20:00" },
        { date: "2025-03-21", start: "11:00", end: "19:00" },
        { date: "2025-03-26", start: "10:00", end: "18:00" },
      ],
    },
    {
      id: 3,
      name: "Mika Moon",
      avatar:
        "https://th.bing.com/th/id/OIF.9jqAjB9W9sQhS1bJbUH1sg?rs=1&pid=ImgDetMain",
      description: "Focuses on historical and mythology themes.",
      characters: [
        {
          name: "Cleopatra",
          image:
            "https://th.bing.com/th/id/OIP.hNItRKAu72Yt-X59Vi2DbgHaJQ?rs=1&pid=ImgDetMain",
        },
        {
          name: "Athena",
          image:
            "https://th.bing.com/th/id/OIP.yaqP-V5Tqj4Wtosp2enD9wHaLH?rs=1&pid=ImgDetMain",
        },
        {
          name: "Spider-Man",
          image:
            "https://th.bing.com/th/id/OIP.i6zQCyXX6AW0dBvKVx_xkwHaLH?rs=1&pid=ImgDetMain",
        },
      ],
      availability: [
        { date: "2025-03-17", start: "08:00", end: "16:00" },
        { date: "2025-03-22", start: "10:00", end: "18:00" },
        { date: "2025-03-27", start: "09:00", end: "17:00" },
      ],
    },
    {
      id: 4,
      name: "Ryu Storm",
      avatar:
        "https://th.bing.com/th/id/OIP.t8XgOZM7X4zQ7X8Z9X0Z0QHaLH?rs=1&pid=ImgDetMain",
      description: "Expert in martial arts and action characters.",
      characters: [
        {
          name: "Naruto Uzumaki",
          image:
            "https://th.bing.com/th/id/OIP.kN5HWcrqUYMfIVN-rl96ZgHaLH?rs=1&pid=ImgDetMain",
        },
        {
          name: "Goku",
          image:
            "https://th.bing.com/th/id/OIP.oAq64jTNwzi081joDeG2KAHaKe?rs=1&pid=ImgDetMain",
        },
        {
          name: "Batman",
          image:
            "https://th.bing.com/th/id/OIP.5X8Z9X0Z0Q7X8Z9X0Z0QHaLH?rs=1&pid=ImgDetMain",
        },
      ],
      availability: [
        { date: "2025-03-18", start: "14:00", end: "22:00" },
        { date: "2025-03-23", start: "13:00", end: "21:00" },
        { date: "2025-03-28", start: "15:00", end: "23:00" },
      ],
    },
    {
      id: 5,
      name: "Sera Flame",
      avatar:
        "https://th.bing.com/th/id/OIP.6X8Z9X0Z0Q7X8Z9X0Z0QHaLH?rs=1&pid=ImgDetMain",
      description: "Passionate about magical and mythical roles.",
      characters: [
        {
          name: "Sailor Moon",
          image:
            "https://th.bing.com/th/id/R.068d6e18db88dcfee0c5fef0e7d5f60f?rik=ZpQCwm59LxyECQ&pid=ImgRaw&r=0",
        },
        {
          name: "Hermione Granger",
          image:
            "https://th.bing.com/th/id/OIP.7X8Z9X0Z0Q7X8Z9X0Z0QHaLH?rs=1&pid=ImgDetMain",
        },
        {
          name: "Elsa",
          image:
            "https://th.bing.com/th/id/OIP.8X8Z9X0Z0Q7X8Z9X0Z0QHaLH?rs=1&pid=ImgDetMain",
        },
      ],
      availability: [
        { date: "2025-03-19", start: "09:00", end: "17:00" },
        { date: "2025-03-24", start: "08:00", end: "16:00" },
        { date: "2025-03-29", start: "10:00", end: "18:00" },
      ],
    },
  ];

  const [selectedDate, setSelectedDate] = useState("");
  const [searchCharacter, setSearchCharacter] = useState("");
  const [filteredCosplayers, setFilteredCosplayers] = useState(cosplayers); // Hiển thị tất cả khi mới vào
  const [selectedCosplayer, setSelectedCosplayer] = useState(null);
  const [selectedCharacter, setSelectedCharacter] = useState(null);
  const [contract, setContract] = useState([]);
  const [selectedDates, setSelectedDates] = useState([]);
  const [timeSlots, setTimeSlots] = useState({});
  const [error, setError] = useState("");

  const dateRef = useRef(null);

  // Khởi tạo hiển thị toàn bộ cosplayer khi component mount
  useEffect(() => {
    setFilteredCosplayers(cosplayers); // Đảm bảo hiển thị tất cả khi mới vào
  }, []);

  // Get available time slots for a specific date from cosplayer's availability
  const getAvailableTimeSlots = (cosplayer, date) => {
    const slot = cosplayer.availability.find((slot) => slot.date === date);
    return slot ? { start: slot.start, end: slot.end } : null;
  };

  // Get all available dates for a selected cosplayer
  const getAvailableDates = (cosplayer) => {
    return [...new Set(cosplayer.availability.map((slot) => slot.date))];
  };

  // Filter cosplayers based on selected date and character search
  const handleFilterCosplayers = () => {
    let result = [...cosplayers]; // Bắt đầu với toàn bộ danh sách

    // Filter by character if search term exists
    if (searchCharacter.trim()) {
      result = result.filter((cosplayer) =>
        cosplayer.characters.some((char) =>
          char.name
            .toLowerCase()
            .replace(/-/g, "")
            .includes(searchCharacter.toLowerCase().replace(/-/g, ""))
        )
      );
    }

    // Filter by date if selected
    if (selectedDate) {
      result = result.filter((cosplayer) =>
        cosplayer.availability.some((slot) => slot.date === selectedDate)
      );
    }

    setFilteredCosplayers(result);

    // Reset selection if the selected cosplayer is no longer in the filtered list
    if (
      selectedCosplayer &&
      !result.some((c) => c.id === selectedCosplayer.id)
    ) {
      setSelectedCosplayer(null);
      setSelectedCharacter(null);
      setSelectedDates([]);
      setTimeSlots({});
    }
  };

  // Trigger filter when selectedDate or searchCharacter changes
  useEffect(() => {
    handleFilterCosplayers();
  }, [selectedDate, searchCharacter]);

  const handleDateChange = (e) => {
    const value = e.target.value;
    setSelectedDate(value);
    setSelectedCosplayer(null);
    setSelectedCharacter(null);
    setSelectedDates([]);
    setTimeSlots({});
  };

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchCharacter(value);
  };

  const handleCosplayerSelect = (cosplayer) => {
    setSelectedCosplayer(cosplayer);
    setSelectedCharacter(null);
    setSelectedDates([selectedDate]); // Start with the initially selected date
    setTimeSlots({ [selectedDate]: {} });
    setError("");
  };

  const handleCharacterSelect = (character) => {
    setSelectedCharacter(character);
    setError("");
  };

  const handleDateTimeClick = (ref) => {
    if (ref.current) ref.current.showPicker();
  };

  const handleAddDate = (date) => {
    if (!selectedDates.includes(date)) {
      setSelectedDates([...selectedDates, date]);
      setTimeSlots({ ...timeSlots, [date]: {} });
    }
  };

  const handleTimeSlotChange = (date, field, value) => {
    setTimeSlots((prev) => ({
      ...prev,
      [date]: {
        ...(prev[date] || {}),
        [field]: value,
      },
    }));
  };

  const handleAddContract = () => {
    if (!selectedCosplayer || !selectedCharacter) {
      setError("Please select a cosplayer and character!");
      return;
    }

    if (selectedDates.length === 0) {
      setError("Please select at least one date!");
      return;
    }

    const invalidSlots = selectedDates.filter((date) => {
      const slot = timeSlots[date];
      if (!slot.start || !slot.end) return true;
      const startTime = new Date(`${date}T${slot.start}`);
      const endTime = new Date(`${date}T${slot.end}`);
      if (endTime <= startTime) return true;

      const availableSlot = selectedCosplayer.availability.find(
        (s) => s.date === date
      );
      if (!availableSlot) return true;
      const slotStart = new Date(`${date}T${availableSlot.start}`);
      const slotEnd = new Date(`${date}T${availableSlot.end}`);
      return startTime < slotStart || endTime > slotEnd;
    });

    if (invalidSlots.length > 0) {
      setError(
        `Invalid time slots for ${invalidSlots.join(
          ", "
        )}! Please ensure times are within the cosplayer's availability and end time is after start time.`
      );
      return;
    }

    const newContract = {
      cosplayer: selectedCosplayer.name,
      character: selectedCharacter.name,
      dates: selectedDates.map((date) => ({
        date,
        startTime: timeSlots[date].start,
        endTime: timeSlots[date].end,
      })),
    };
    setContract([...contract, newContract]);
    setSelectedCosplayer(null);
    setSelectedCharacter(null);
    setSelectedDate("");
    setSelectedDates([]);
    setTimeSlots({});
    setError("");
  };

  return (
    <div className="cosplay-rental-page min-vh-100">
      <div className="hero-section text-black py-5">
        <Container>
          <h1 className="display-4 fw-bold text-center">Cosplayer Rental</h1>
          <p className="lead text-center mt-3">
            Book your favorite cosplayers for events
          </p>
        </Container>
      </div>

      <Container className="py-5">
        {/* Filter Section: Search and Date */}
        <Row className="mb-5">
          {/* Search by Character (Left) */}
          <Col md={6}>
            <h3 className="section-title">Search by Character</h3>
            <Card className="filter-card">
              <Card.Body>
                <InputGroup>
                  <InputGroup.Text>
                    <Search size={20} />
                  </InputGroup.Text>
                  <Form.Control
                    type="text"
                    placeholder="Search for a character (e.g., Spider Man)"
                    value={searchCharacter}
                    onChange={handleSearchChange}
                  />
                </InputGroup>
              </Card.Body>
            </Card>
          </Col>

          {/* Filter by Date (Right) */}
          <Col md={6}>
            <h3 className="section-title">Select Date</h3>
            <Card className="filter-card">
              <Card.Body>
                <Form>
                  <div className="d-flex gap-3 mb-3">
                    <Form.Group className="flex-grow-1">
                      <Form.Label>Date</Form.Label>
                      <div
                        className="datetime-wrapper"
                        onClick={() => handleDateTimeClick(dateRef)}
                      >
                        <Form.Control
                          ref={dateRef}
                          type="date"
                          value={selectedDate}
                          onChange={handleDateChange}
                          min={new Date().toISOString().split("T")[0]}
                        />
                      </div>
                    </Form.Group>
                  </div>
                </Form>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* Cosplayer List and Character Selection/Time Slots side by side */}
        <Row className="mb-5">
          {/* Available Cosplayers (Left) */}
          <Col md={6}>
            <h3 className="section-title">Available Cosplayers</h3>
            <ListGroup className="cosplayer-list">
              {filteredCosplayers.length > 0 ? (
                filteredCosplayers.map((cosplayer) => {
                  const slot = selectedDate
                    ? getAvailableTimeSlots(cosplayer, selectedDate)
                    : null;
                  return (
                    <ListGroup.Item
                      key={cosplayer.id}
                      action
                      onClick={() => handleCosplayerSelect(cosplayer)}
                      active={selectedCosplayer?.id === cosplayer.id}
                      className="cosplayer-item"
                    >
                      <div className="d-flex align-items-center">
                        <img
                          src={cosplayer.avatar}
                          alt={cosplayer.name}
                          className="cosplayer-avatar"
                        />
                        <div className="ms-3 flex-grow-1">
                          <h5 className="mb-1">{cosplayer.name}</h5>
                          <p className="mb-0 text-muted">
                            {cosplayer.description}
                          </p>
                          {selectedDate && slot && (
                            <p className="mb-0 text-muted">
                              <strong>Working Hours:</strong>{" "}
                              {`${slot.start} - ${slot.end}`}
                            </p>
                          )}
                        </div>
                        <Badge bg="primary" className="select-badge">
                          {selectedCosplayer?.id === cosplayer.id
                            ? "Selected"
                            : "Select"}
                        </Badge>
                      </div>
                    </ListGroup.Item>
                  );
                })
              ) : (
                <Alert variant="info">
                  No cosplayers available based on your filters.
                </Alert>
              )}
            </ListGroup>
          </Col>

          {/* Select Character, Additional Dates, and Time Slots (Right) */}
          <Col md={6}>
            {selectedCosplayer && (
              <>
                <h3 className="section-title">Select Character & Schedule</h3>
                <Card className="character-selection-card">
                  <Card.Body>
                    <div className="character-grid mb-4">
                      {selectedCosplayer.characters.map((character) => (
                        <div
                          key={character.name}
                          className="character-card-wrapper"
                        >
                          <Card
                            className={`character-card ${
                              selectedCharacter?.name === character.name
                                ? "selected"
                                : ""
                            }`}
                            onClick={() => handleCharacterSelect(character)}
                          >
                            <div className="character-image-container">
                              <Card.Img
                                src={character.image}
                                alt={character.name}
                                className="character-image"
                              />
                            </div>
                            <Card.Body className="d-flex flex-column justify-content-end text-center">
                              <Card.Title>{character.name}</Card.Title>
                              <Badge
                                bg={
                                  selectedCharacter?.name === character.name
                                    ? "primary"
                                    : "success"
                                }
                                className="status-badge mt-2"
                              >
                                {selectedCharacter?.name === character.name
                                  ? "Selected"
                                  : "Available"}
                              </Badge>
                            </Card.Body>
                          </Card>
                        </div>
                      ))}
                    </div>

                    <h4 className="mb-3">Select Dates and Time Slots</h4>
                    {/* Display selected dates and their time slots */}
                    {selectedDates.map((date) => {
                      const slot = getAvailableTimeSlots(
                        selectedCosplayer,
                        date
                      );
                      if (!slot) return null;
                      return (
                        <div key={date} className="time-slot-section mb-3">
                          <h5>
                            {date} (Available: {slot.start} - {slot.end})
                          </h5>
                          <div className="d-flex gap-3">
                            <Form.Group className="flex-grow-1">
                              <Form.Label>Start Time</Form.Label>
                              <Form.Control
                                type="time"
                                value={timeSlots[date]?.start || ""}
                                onChange={(e) =>
                                  handleTimeSlotChange(
                                    date,
                                    "start",
                                    e.target.value
                                  )
                                }
                                onFocus={(e) =>
                                  e.target.showPicker && e.target.showPicker()
                                }
                                min={slot.start}
                                max={slot.end}
                              />
                            </Form.Group>
                            <Form.Group className="flex-grow-1">
                              <Form.Label>End Time</Form.Label>
                              <Form.Control
                                type="time"
                                value={timeSlots[date]?.end || ""}
                                onChange={(e) =>
                                  handleTimeSlotChange(
                                    date,
                                    "end",
                                    e.target.value
                                  )
                                }
                                onFocus={(e) =>
                                  e.target.showPicker && e.target.showPicker()
                                }
                                min={timeSlots[date]?.start || slot.start}
                                max={slot.end}
                                disabled={!timeSlots[date]?.start}
                              />
                            </Form.Group>
                          </div>
                        </div>
                      );
                    })}

                    {/* Display available dates to add */}
                    <h5 className="mb-2">Add Another Date</h5>
                    {selectedCosplayer && (
                      <ListGroup className="mb-3">
                        {getAvailableDates(selectedCosplayer)
                          .filter((date) => !selectedDates.includes(date))
                          .map((date) => {
                            const slot = getAvailableTimeSlots(
                              selectedCosplayer,
                              date
                            );
                            return (
                              <ListGroup.Item
                                key={date}
                                action
                                onClick={() => handleAddDate(date)}
                                className="cosplayer-item"
                              >
                                {date} (Available: {slot.start} - {slot.end})
                              </ListGroup.Item>
                            );
                          })}
                      </ListGroup>
                    )}

                    <Button
                      variant="primary"
                      onClick={handleAddContract}
                      className="mt-4 w-100 add-to-contract-btn"
                      disabled={
                        !selectedCharacter ||
                        selectedDates.some(
                          (date) =>
                            !timeSlots[date]?.start || !timeSlots[date]?.end
                        )
                      }
                    >
                      Add to Contract
                    </Button>
                  </Card.Body>
                </Card>
              </>
            )}
          </Col>
        </Row>

        {/* Error Message */}
        {error && (
          <Row className="mb-5">
            <Col>
              <Alert variant="warning">{error}</Alert>
            </Col>
          </Row>
        )}

        {/* Contracts */}
        {contract.length > 0 && (
          <Row>
            <Col>
              <h3 className="section-title">Your Contracts</h3>
              <div className="contract-list">
                {contract.map((item, index) => (
                  <Card key={index} className="contract-card mb-3">
                    <Card.Body>
                      <div className="d-flex justify-content-between align-items-start">
                        <div>
                          <Card.Title>{item.cosplayer}</Card.Title>
                          <Card.Text>
                            <strong>Character:</strong> {item.character}
                            <br />
                            {item.dates.map((date, i) => (
                              <span key={i}>
                                <strong>Date:</strong> {date.date}{" "}
                                {date.startTime} - {date.endTime}
                                <br />
                              </span>
                            ))}
                          </Card.Text>
                        </div>
                        <Badge bg="success">Confirmed</Badge>
                      </div>
                    </Card.Body>
                  </Card>
                ))}
              </div>
            </Col>
          </Row>
        )}
      </Container>
    </div>
  );
};

export default CosplayersPage;