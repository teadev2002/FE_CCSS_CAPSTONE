import React, { useState, useEffect } from "react";
import { Search, ChevronRight, User } from "lucide-react";
import {
  Modal,
  Button,
  Form,
  Container,
  Row,
  Col,
  Badge,
  Card,
  ProgressBar,
  InputGroup,
  FormControl,
} from "react-bootstrap";
import "../../styles/DetailEventOrganizationPage.scss";

const DetailEventOrganizationPage = () => {
  const [step, setStep] = useState(1);
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [eventName, setEventName] = useState("");
  const [eventTheme, setEventTheme] = useState("");
  const [location, setLocation] = useState("");
  const [startDate, setStartDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endDate, setEndDate] = useState("");
  const [endTime, setEndTime] = useState("");
  const [description, setDescription] = useState("");
  const [venueDescription, setVenueDescription] = useState("");
  const [images, setImages] = useState([]);
  const [selectedCosplayers, setSelectedCosplayers] = useState([]);
  const [manualQuantity, setManualQuantity] = useState(1);
  const [useCosplayerList, setUseCosplayerList] = useState(true);
  const [showSummaryModal, setShowSummaryModal] = useState(false);
  const [characterSearch, setCharacterSearch] = useState("");
  const [genderFilter, setGenderFilter] = useState("All");
  const [showTermsModal, setShowTermsModal] = useState(false);
  const [termsAgreed, setTermsAgreed] = useState(false);
  const [showPriceList, setShowPriceList] = useState(false);
  const [characterPriceSearch, setCharacterPriceSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [isSidebarVisible, setIsSidebarVisible] = useState(true);
  const [discount, setDiscount] = useState("");
  const [customDiscount, setCustomDiscount] = useState("");

  // Sample data for packages
  const packages = [
    {
      name: "Small Package",
      description: "For up to 3 cosplayers",
      details: "Suitable for small events like birthdays or family gatherings. Includes basic support, standard costumes, and 1-hour performance.",
      image: "https://cdn.prod.website-files.com/6769617aecf082b10bb149ff/67763d8a2775bee07438e7a5_Events.png",
      maxAttendees: 50,
      benefits: ["Basic support", "Standard costumes", "1-hour performance"]
    },
    {
      name: "Medium Package",
      description: "For up to 5 cosplayers",
      details: "Perfect for medium-sized events. Includes themed decorations, enhanced support, premium costumes, and 2-hour performance.",
      image: "https://jjrmarketing.com/wp-content/uploads/2019/12/International-Event.jpg",
      maxAttendees: 100,
      benefits: ["Themed decorations", "Enhanced support", "Premium costumes", "2-hour performance"]
    },
    {
      name: "Large Package",
      description: "For up to 10 cosplayers",
      details: "Ideal for conferences or large events. Includes full setup, premium features, custom costumes, and 3-hour performance.",
      image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSnEys5tBHYLbhADjGJzoM5BloFy9AP-uyRzg&s",
      maxAttendees: 200,
      benefits: ["Full setup", "Premium features", "Custom costumes", "3-hour performance"]
    },
    {
      name: "VIP Package",
      description: "For up to 15 cosplayers",
      details: "Ultimate experience with exclusive access, VIP support, luxury costumes, and 4-hour performance.",
      image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ3DNasCvfOLMIxJyQtbNq7EfLkWnMazHE9xw&s",
      maxAttendees: 300,
      benefits: ["Exclusive access", "VIP support", "Luxury costumes", "4-hour performance"]
    },
    {
      name: "Custom Package",
      description: "Tailored to your needs",
      details: "Create a custom package with flexible options. Contact us for details.",
      image: "https://scandiweb.com/blog/wp-content/uploads/2020/01/ecom360_conference_hosting_successful_event.jpeg",
      maxAttendees: "Unlimited",
      benefits: ["Flexible options", "Personalized support", "Custom performance"]
    }
  ];

  // Sample cosplayer data with prices
  const cosplayers = [
    { id: 1, name: "Hana", gender: "Female", categories: ["Superheroes", "Sci-Fi"], crossGenderAllowed: false, image: "https://universo-nintendo.com.mx/my_uploads/2022/09/Chainsaw-Man-Makima-Cosplay-Rakukoo.jpg", price: 100 },
    { id: 2, name: "Kai", gender: "Male", categories: ["Superheroes", "Anime"], crossGenderAllowed: true, image: "https://universo-nintendo.com.mx/my_uploads/2022/09/Chainsaw-Man-Makima-Cosplay-Rakukoo.jpg", price: 120 },
    { id: 3, name: "Miko", gender: "Female", categories: ["Anime"], crossGenderAllowed: false, image: "https://universo-nintendo.com.mx/my_uploads/2022/09/Chainsaw-Man-Makima-Cosplay-Rakukoo.jpg", price: 80 },
    { id: 4, name: "Yuki", gender: "Female", categories: ["Anime", "Fantasy"], crossGenderAllowed: true, image: "https://universo-nintendo.com.mx/my_uploads/2022/09/Chainsaw-Man-Makima-Cosplay-Rakukoo.jpg", price: 150 },
    { id: 5, name: "Taro", gender: "Male", categories: ["Fantasy", "Anime"], crossGenderAllowed: false, image: "https://universo-nintendo.com.mx/my_uploads/2022/09/Chainsaw-Man-Makima-Cosplay-Rakukoo.jpg", price: 90 },
    { id: 6, name: "Rin", gender: "Female", categories: ["Anime", "Game"], crossGenderAllowed: false, image: "https://universo-nintendo.com.mx/my_uploads/2022/09/Chainsaw-Man-Makima-Cosplay-Rakukoo.jpg", price: 110 },
    { id: 7, name: "Sora", gender: "Male", categories: ["Game", "Fantasy"], crossGenderAllowed: false, image: "https://universo-nintendo.com.mx/my_uploads/2022/09/Chainsaw-Man-Makima-Cosplay-Rakukoo.jpg", price: 130 },
    { id: 8, name: "Aki", gender: "Female", categories: ["Superheroes", "Sci-Fi"], crossGenderAllowed: true, image: "https://universo-nintendo.com.mx/my_uploads/2022/09/Chainsaw-Man-Makima-Cosplay-Rakukoo.jpg", price: 140 },
    { id: 9, name: "Jin", gender: "Male", categories: ["Anime", "Game"], crossGenderAllowed: false, image: "https://universo-nintendo.com.mx/my_uploads/2022/09/Chainsaw-Man-Makima-Cosplay-Rakukoo.jpg", price: 95 },
    { id: 10, name: "Luna", gender: "Female", categories: ["Fantasy", "Sci-Fi"], crossGenderAllowed: false, image: "https://universo-nintendo.com.mx/my_uploads/2022/09/Chainsaw-Man-Makima-Cosplay-Rakukoo.jpg", price: 125 },
    { id: 11, name: "Kenta", gender: "Male", categories: ["Superheroes", "Historical"], crossGenderAllowed: false, image: "https://universo-nintendo.com.mx/my_uploads/2022/09/Chainsaw-Man-Makima-Cosplay-Rakukoo.jpg", price: 115 },
    { id: 12, name: "Nami", gender: "Female", categories: ["Anime", "Game"], crossGenderAllowed: false, image: "https://universo-nintendo.com.mx/my_uploads/2022/09/Chainsaw-Man-Makima-Cosplay-Rakukoo.jpg", price: 105 },
    { id: 13, name: "Haru", gender: "Male", categories: ["Fantasy", "Historical"], crossGenderAllowed: true, image: "https://universo-nintendo.com.mx/my_uploads/2022/09/Chainsaw-Man-Makima-Cosplay-Rakukoo.jpg", price: 135 },
    { id: 14, name: "Sakura", gender: "Female", categories: ["Anime", "Historical"], crossGenderAllowed: false, image: "https://universo-nintendo.com.mx/my_uploads/2022/09/Chainsaw-Man-Makima-Cosplay-Rakukoo.jpg", price: 85 },
    { id: 15, name: "Riku", gender: "Male", categories: ["Sci-Fi", "Game"], crossGenderAllowed: false, image: "https://universo-nintendo.com.mx/my_uploads/2022/09/Chainsaw-Man-Makima-Cosplay-Rakukoo.jpg", price: 145 },
  ];

  // Sample character data with prices
  const characters = [
    { name: "Superman", category: "Superheroes", gender: "Male", price: 80 },
    { name: "Wonder Woman", category: "Superheroes", gender: "Female", price: 90 },
    { name: "Naruto", category: "Anime", gender: "Male", price: 70 },
    { name: "Sailor Moon", category: "Anime", gender: "Female", price: 85 },
    { name: "Gandalf", category: "Fantasy", gender: "Male", price: 95 },
    { name: "Ellen Ripley", category: "Sci-Fi", gender: "Female", price: 75 },
    { name: "Batman", category: "Superheroes", gender: "Male", price: 100 },
    { name: "Catwoman", category: "Superheroes", gender: "Female", price: 80 },
    { name: "Luffy", category: "Anime", gender: "Male", price: 65 },
    { name: "Nami", category: "Anime", gender: "Female", price: 70 },
    { name: "Aragorn", category: "Fantasy", gender: "Male", price: 90 },
    { name: "Galadriel", category: "Fantasy", gender: "Female", price: 85 },
    { name: "Master Chief", category: "Game", gender: "Male", price: 95 },
    { name: "Lara Croft", category: "Game", gender: "Female", price: 80 },
    { name: "Darth Vader", category: "Sci-Fi", gender: "Male", price: 100 },
    { name: "Leia Organa", category: "Sci-Fi", gender: "Female", price: 75 },
    { name: "Geralt of Rivia", category: "Fantasy", gender: "Male", price: 90 },
    { name: "Yennefer", category: "Fantasy", gender: "Female", price: 85 },
    { name: "Ichigo Kurosaki", category: "Anime", gender: "Male", price: 70 },
    { name: "Rukia Kuchiki", category: "Anime", gender: "Female", price: 65 },
    { name: "Samurai Jack", category: "Historical", gender: "Male", price: 80 },
    { name: "Joan of Arc", category: "Historical", gender: "Female", price: 75 },
    { name: "Link", category: "Game", gender: "Male", price: 85 },
    { name: "Zelda", category: "Game", gender: "Female", price: 80 },
    { name: "Iron Man", category: "Superheroes", gender: "Male", price: 95 },
    { name: "Black Widow", category: "Superheroes", gender: "Female", price: 85 },
  ];

  // Sample discount options
  const discountOptions = [
    { code: "DISCOUNT10", value: 10 },
    { code: "DISCOUNT20", value: 20 },
    { code: "DISCOUNT30", value: 30 },
  ];

  // Handle next step
  const handleNextStep = () => {
    if (step === 1 && !selectedPackage) return alert("Please select an event package!");
    if (
      step === 2 &&
      (!eventName || !eventTheme || !location || !startDate || !startTime || !endDate || !endTime || !description || !venueDescription)
    )
      return alert("Please fill in all required fields!");
    if (step === 3) {
      if (useCosplayerList) {
        if (
          selectedCosplayers.length === 0 ||
          selectedCosplayers.some((sc) => !sc.character)
        ) {
          return alert("Please select cosplayers and assign characters to each!");
        }
      } else {
        if (manualQuantity < 1) {
          return alert("Please enter a valid number of cosplayers!");
        }
      }
    }
    if (step === 4 && !termsAgreed) {
      alert("Please agree to the terms and conditions before submitting!");
      return;
    }
    if (step < 4) setStep(step + 1);
    if (step === 4) setShowSummaryModal(true);
  };

  // Handle previous step
  const handlePrevStep = () => {
    if (step > 1) setStep(step - 1);
  };

  // Save draft
  const handleSaveDraft = () => {
    const draft = {
      step,
      selectedPackage,
      eventName,
      eventTheme,
      location,
      startDate,
      startTime,
      endDate,
      endTime,
      description,
      venueDescription,
      images,
      selectedCosplayers,
      manualQuantity,
      useCosplayerList,
      discount,
      customDiscount,
    };
    localStorage.setItem("eventDraft", JSON.stringify(draft));
    alert("Draft saved successfully!");
  };

  // Handle image upload
  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    setImages((prev) => [...prev, ...files]);
  };

  // Format date and time
  const getFormattedDateTime = (date, time) => {
    return date && time ? new Date(`${date}T${time}`).toLocaleString() : "N/A";
  };

  // Filter packages by search term
  const filteredPackages = packages.filter((pkg) =>
    pkg.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Filter cosplayers by character and gender
  const filterCosplayersByCharacterAndGender = () => {
    let filtered = cosplayers;

    if (characterSearch.trim()) {
      const searchedCharacter = characters.find((char) =>
        char.name.toLowerCase().includes(characterSearch.toLowerCase())
      );
      if (searchedCharacter) {
        filtered = filtered.filter((cosplayer) =>
          cosplayer.categories.includes(searchedCharacter.category) &&
          (cosplayer.gender === searchedCharacter.gender || cosplayer.crossGenderAllowed)
        );
      } else {
        return [];
      }
    }

    if (genderFilter !== "All") {
      filtered = filtered.filter((cosplayer) => cosplayer.gender === genderFilter);
    }

    return filtered;
  };

  // View cosplayer profile
  const handleViewProfile = (cosplayer) => {
    alert(`Viewing profile of ${cosplayer.name}`);
  };

  // Toggle cosplayer selection with auto character assignment
  const toggleCosplayerSelection = (cosplayer) => {
    setSelectedCosplayers((prev) =>
      prev.some((sc) => sc.cosplayer.id === cosplayer.id)
        ? prev.filter((sc) => sc.cosplayer.id !== cosplayer.id)
        : [
          ...prev,
          {
            cosplayer,
            character: characters
              .find(
                (char) =>
                  char.name.toLowerCase() === characterSearch.toLowerCase() &&
                  cosplayer.categories.includes(char.category) &&
                  (cosplayer.gender === char.gender || cosplayer.crossGenderAllowed)
              )?.name || null,
          },
        ]
    );
  };

  // Assign character to cosplayer
  const handleCharacterSelect = (cosplayerId, selectedCharacter) => {
    setSelectedCosplayers((prev) =>
      prev.map((sc) =>
        sc.cosplayer.id === cosplayerId ? { ...sc, character: selectedCharacter } : sc
      )
    );
  };

  // Calculate total price for selected cosplayers
  const calculateTotalPrice = () => {
    return selectedCosplayers.reduce((sum, sc) => {
      const cosplayerPrice = sc.cosplayer.price;
      const characterPrice = characters.find((char) => char.name === sc.character)?.price || 0;
      return sum + cosplayerPrice + characterPrice;
    }, 0);
  };

  // Apply discount
  const applyDiscount = () => {
    const total = calculateTotalPrice();
    const discountValue = discountOptions.find((d) => d.code === discount)?.value || 0;
    return total - (total * discountValue) / 100;
  };

  // Logic to hide/show sidebar based on scroll position
  useEffect(() => {
    const handleScroll = () => {
      const assignSection = document.getElementById("assign-characters-section");
      if (assignSection) {
        const rect = assignSection.getBoundingClientRect();
        const isVisible = rect.top >= 0 && rect.bottom <= window.innerHeight;
        setIsSidebarVisible(!isVisible);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [selectedCosplayers]);

  return (
    <div className="event-organize-page min-vh-100">
      <div className="hero-section text-white py-5">
        <Container>
          <h1 className="display-4 fw-bold text-center">Organize Your Event</h1>
          <p className="lead text-center mt-3">
            Plan your event and book your favorite cosplayers!
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
            <Row className="package-row">
              {filteredPackages.map((pkg) => (
                <Col md={4} className="mb-4" key={pkg.name}>
                  <Card
                    className={`package-card ${selectedPackage?.name === pkg.name ? "selected" : ""}`}
                    onClick={() => setSelectedPackage(pkg)}
                  >
                    <Card.Img variant="top" src={pkg.image} />
                    <Card.Body className="package-card-body">
                      <Card.Title>{pkg.name}</Card.Title>
                      <Card.Text>{pkg.description}</Card.Text>
                      <p><strong>Max Attendees:</strong> {pkg.maxAttendees}</p>
                      <p><strong>Benefits:</strong></p>
                      <ul className="benefits-list">
                        {pkg.benefits.map((benefit, index) => (
                          <li key={index}>{benefit}</li>
                        ))}
                      </ul>
                    </Card.Body>
                  </Card>
                </Col>
              ))}
            </Row>
          </div>
        )}

        {/* Step 2: Event Details */}
        {step === 2 && (
          <div className="step-section fade-in">
            <h2 className="text-center mb-4">Event Details</h2>
            <Form>
              <Form.Group className="mb-3">
                <Form.Label>Event Name</Form.Label>
                <Form.Control
                  type="text"
                  value={eventName}
                  onChange={(e) => setEventName(e.target.value)}
                  placeholder="Enter event name"
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Event Theme</Form.Label>
                <Form.Control
                  type="text"
                  value={eventTheme}
                  onChange={(e) => setEventTheme(e.target.value)}
                  placeholder="Enter event theme (e.g., Spider-Man, Anime, etc.)"
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Location</Form.Label>
                <Form.Control
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="Enter event location"
                />
              </Form.Group>
              <Row className="mb-2">
                <Col md={6}>
                  <Form.Group>
                    <Form.Label>Start Date</Form.Label>
                    <Form.Control
                      type="date"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      onFocus={(e) => e.target.showPicker && e.target.showPicker()}
                      className="custom-date-input"
                    />
                  </Form.Group>
                  <Form.Group className="mt-2">
                    <Form.Label>Start Time</Form.Label>
                    <Form.Control
                      type="time"
                      value={startTime}
                      onChange={(e) => setStartTime(e.target.value)}
                      onFocus={(e) => e.target.showPicker && e.target.showPicker()}
                      className="custom-time-input"
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group>
                    <Form.Label>End Date</Form.Label>
                    <Form.Control
                      type="date"
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      onFocus={(e) => e.target.showPicker && e.target.showPicker()}
                      className="custom-date-input"
                    />
                  </Form.Group>
                  <Form.Group className="mt-2">
                    <Form.Label>End Time</Form.Label>
                    <Form.Control
                      type="time"
                      value={endTime}
                      onChange={(e) => setEndTime(e.target.value)}
                      onFocus={(e) => e.target.showPicker && e.target.showPicker()}
                      className="custom-time-input"
                    />
                  </Form.Group>
                </Col>
              </Row>
              <Form.Group className="mb-3">
                <Form.Label>Description</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe your event requirements"
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Venue Description</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  value={venueDescription}
                  onChange={(e) => setVenueDescription(e.target.value)}
                  placeholder="Describe the event venue in detail"
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Upload Images</Form.Label>
                <Form.Control
                  type="file"
                  multiple
                  onChange={handleImageUpload}
                />
                <small className="text-muted">
                  Upload images illustrating your requirements or venue
                </small>
              </Form.Group>
            </Form>
          </div>
        )}

        {/* Step 3: Select Cosplayers */}
        {step === 3 && (
          <div className="step-section fade-in">
            <h2 className="text-center mb-4">Select Cosplayers</h2>
            <p className="text-center mb-4">
              Choose how you want to add cosplayers to your event:
            </p>
            <Form.Check
              type="switch"
              label={
                useCosplayerList
                  ? "Select specific cosplayers and characters"
                  : "Enter number of cosplayers"
              }
              checked={useCosplayerList}
              onChange={() => setUseCosplayerList(!useCosplayerList)}
              className="mb-4"
            />
            {useCosplayerList ? (
              <>
                <div className="search-container mb-4 d-flex align-items-center">
                  <InputGroup className="flex-grow-1">
                    <InputGroup.Text>
                      <Search size={20} />
                    </InputGroup.Text>
                    <FormControl
                      placeholder="Search characters (e.g., Superman, Naruto)"
                      value={characterSearch}
                      onChange={(e) => setCharacterSearch(e.target.value)}
                    />
                  </InputGroup>
                  <Form.Select
                    value={genderFilter}
                    onChange={(e) => setGenderFilter(e.target.value)}
                    className="ms-2"
                    style={{ width: "200px" }}
                  >
                    <option value="All">All Genders</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                  </Form.Select>
                </div>
                <Row>
                  {filterCosplayersByCharacterAndGender().map((cosplayer) => (
                    <Col md={4} className="mb-4" key={cosplayer.id}>
                      <Card
                        className={`cosplayer-card ${selectedCosplayers.some((sc) => sc.cosplayer.id === cosplayer.id)
                          ? "selected"
                          : ""
                          }`}
                        onClick={() => toggleCosplayerSelection(cosplayer)}
                      >
                        <Card.Img variant="top" src={cosplayer.image} />
                        <Card.Body>
                          <Card.Title>{cosplayer.name}</Card.Title>
                          <div>
                            {cosplayer.categories.map((cat) => (
                              <Badge key={cat} bg="secondary" className="me-1">
                                {cat}
                              </Badge>
                            ))}
                          </div>
                          <div className="cosplayer-footer">
                            <Button
                              variant="primary"
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleViewProfile(cosplayer);
                              }}
                            >
                              <User size={16} /> View Profile
                            </Button>
                            <p className="cosplayer-price">Price: ${cosplayer.price}</p>
                          </div>
                        </Card.Body>
                      </Card>
                    </Col>
                  ))}
                </Row>
                {filterCosplayersByCharacterAndGender().length === 0 && (
                  <p className="text-center mt-4">
                    No cosplayers found for "{characterSearch}" with the selected filters.
                  </p>
                )}
                {selectedCosplayers.length > 0 && (
                  <div className="selected-cosplayers mt-4" id="assign-characters-section">
                    <h4>Assign Characters to Selected Cosplayers</h4>
                    <p className="text-muted">
                      Please assign a character to each cosplayer. Some cosplayers can perform cross-gender roles.
                    </p>
                    <div className="assign-table">
                      <div className="assign-table-header">
                        <span>Cosplayer</span>
                        <span>Character</span>
                        <span>Action</span>
                        <span>Price</span>
                      </div>
                      {selectedCosplayers.map((sc) => {
                        const cosplayerPrice = sc.cosplayer.price;
                        const characterPrice = characters.find((char) => char.name === sc.character)?.price || 0;
                        const totalPrice = cosplayerPrice + characterPrice;
                        return (
                          <div key={sc.cosplayer.id} className="assign-table-row">
                            <span>{sc.cosplayer.name}</span>
                            <Form.Select
                              value={sc.character || ""}
                              onChange={(e) => handleCharacterSelect(sc.cosplayer.id, e.target.value)}
                              className="character-select"
                            >
                              <option value="">Select Character</option>
                              {characters
                                .filter((char) =>
                                  sc.cosplayer.categories.includes(char.category) &&
                                  (sc.cosplayer.gender === char.gender || sc.cosplayer.crossGenderAllowed)
                                )
                                .map((char) => (
                                  <option key={char.name} value={char.name}>
                                    {char.name}
                                  </option>
                                ))}
                            </Form.Select>
                            <Button
                              variant="outline-danger"
                              size="sm"
                              className="remove-btn"
                              onClick={() =>
                                setSelectedCosplayers((prev) =>
                                  prev.filter((item) => item.cosplayer.id !== sc.cosplayer.id)
                                )
                              }
                            >
                              Remove
                            </Button>
                            <span>${totalPrice}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </>
            ) : (
              <Form.Group>
                <Form.Label>Number of Cosplayers</Form.Label>
                <Form.Control
                  type="number"
                  min="1"
                  value={manualQuantity}
                  onChange={(e) => setManualQuantity(Math.max(1, e.target.value))}
                />
                <Form.Text className="text-muted">
                  Enter the number of cosplayers needed. The system will select randomly.
                </Form.Text>
              </Form.Group>
            )}
          </div>
        )}

        {/* Step 4: Review Event */}
        {step === 4 && (
          <div className="step-section fade-in">
            <h2 className="text-center mb-4">Review Your Event</h2>
            <Card>
              <Card.Body>
                <p><strong>Selected Package:</strong> {selectedPackage?.name || "N/A"}</p>
                <p><strong>Event Name:</strong> {eventName}</p>
                <p><strong>Event Theme:</strong> {eventTheme}</p>
                <p><strong>Location:</strong> {location}</p>
                <p><strong>Start:</strong> {getFormattedDateTime(startDate, startTime)}</p>
                <p><strong>End:</strong> {getFormattedDateTime(endDate, endTime)}</p>
                <p><strong>Description:</strong> {description}</p>
                <p><strong>Venue Description:</strong> {venueDescription}</p>
                <p><strong>Images:</strong> {images.length} images uploaded</p>
                <p>
                  <strong>Cosplayers:</strong>{" "}
                  {useCosplayerList
                    ? selectedCosplayers.map((sc) => `${sc.cosplayer.name} as ${sc.character}`).join(", ")
                    : manualQuantity}
                </p>
                {useCosplayerList && (
                  <p><strong>Total Price (before discount):</strong> ${calculateTotalPrice()}</p>
                )}
                <Form.Group className="mb-3">
                  <Form.Label>Discount Code</Form.Label>
                  <Form.Select
                    value={discount}
                    onChange={(e) => setDiscount(e.target.value)}
                    disabled={customDiscount}
                  >
                    <option value="">Select Discount</option>
                    {discountOptions.map((d) => (
                      <option key={d.code} value={d.code}>
                        {d.code} ({d.value}% off)
                      </option>
                    ))}
                  </Form.Select>
                  <Form.Control
                    type="text"
                    placeholder="Or enter custom discount code"
                    value={customDiscount}
                    onChange={(e) => setCustomDiscount(e.target.value)}
                    className="mt-2"
                  />
                </Form.Group>
                {useCosplayerList && (discount || customDiscount) && (
                  <p><strong>Total Price (after discount):</strong> ${applyDiscount()}</p>
                )}
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
            <Button variant="outline-secondary" onClick={handleSaveDraft} className="me-2">
              Save Draft
            </Button>
            <Button
              variant="primary"
              onClick={handleNextStep}
              disabled={step === 4 && !termsAgreed}
            >
              {step === 4 ? "Finish" : "Next"} <ChevronRight size={20} />
            </Button>
          </div>
        </div>
      </Container>

      {/* Terms Modal */}
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
              <li>All bookings are subject to cosplayer availability.</li>
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

      {/* Summary Modal */}
      <Modal
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
          <p><strong>Selected Package:</strong> {selectedPackage?.name || "N/A"}</p>
          <p><strong>Event Name:</strong> {eventName}</p>
          <p><strong>Event Theme:</strong> {eventTheme}</p>
          <p><strong>Location:</strong> {location}</p>
          <p><strong>Start:</strong> {getFormattedDateTime(startDate, startTime)}</p>
          <p><strong>End:</strong> {getFormattedDateTime(endDate, endTime)}</p>
          <p><strong>Description:</strong> {description}</p>
          <p><strong>Venue Description:</strong> {venueDescription}</p>
          <p><strong>Images:</strong> {images.length} images uploaded</p>
          <p>
            <strong>Cosplayers:</strong>{" "}
            {useCosplayerList
              ? selectedCosplayers.map((sc) => `${sc.cosplayer.name} as ${sc.character}`).join(", ")
              : manualQuantity}
          </p>
          {useCosplayerList && (
            <>
              <p><strong>Total Price (before discount):</strong> ${calculateTotalPrice()}</p>
              {(discount || customDiscount) && (
                <p><strong>Total Price (after discount):</strong> ${applyDiscount()}</p>
              )}
            </>
          )}
          <Button variant="primary" onClick={() => setShowSummaryModal(false)}>
            Confirm & Submit
          </Button>
        </Modal.Body>
      </Modal>

      {/* Sidebar for Selected Cosplayers */}
      {step === 3 && selectedCosplayers.length > 0 && (
        <div
          className={`selected-cosplayers-sidebar ${!isSidebarVisible ? "hidden" : ""}`}
          id="selected-cosplayers-sidebar"
        >
          <h5>Selected Cosplayers</h5>
          <ul className="selected-cosplayers-list">
            {selectedCosplayers.map((sc) => {
              const cosplayerPrice = sc.cosplayer.price;
              const characterPrice = characters.find((char) => char.name === sc.character)?.price || 0;
              const totalPrice = cosplayerPrice + characterPrice;
              return (
                <li key={sc.cosplayer.id}>
                  {sc.cosplayer.name} as {sc.character || "No character assigned"} - ${totalPrice}
                </li>
              );
            })}
          </ul>
        </div>
      )}

      {/* Sidebar for Character Price List */}
      {step === 3 && (
        <div className="price-list-sidebar">
          <Button className="toggle-price-list-btn" onClick={() => setShowPriceList(!showPriceList)}>
            {showPriceList ? "Hide Character Price List" : "Show Character Price List"}
          </Button>
          {showPriceList && (
            <div className="price-list-content">
              <h5>Character Price List</h5>
              <Form.Select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="mb-3"
              >
                <option value="All">All Categories</option>
                {[...new Set(characters.map((char) => char.category))].map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </Form.Select>
              <InputGroup className="mb-3">
                <FormControl
                  placeholder="Search characters"
                  onChange={(e) => setCharacterPriceSearch(e.target.value)}
                  value={characterPriceSearch}
                />
              </InputGroup>
              <ul className="character-list">
                {characters
                  .filter((char) =>
                    (selectedCategory === "All" || char.category === selectedCategory) &&
                    char.name.toLowerCase().includes(characterPriceSearch.toLowerCase())
                  )
                  .map((char) => (
                    <li key={char.name}>
                      {char.name} - ${char.price}
                    </li>
                  ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default DetailEventOrganizationPage;