import React, { useState } from "react";
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
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [eventName, setEventName] = useState("");
  const [location, setLocation] = useState("");
  const [startDate, setStartDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endDate, setEndDate] = useState("");
  const [endTime, setEndTime] = useState("");
  const [description, setDescription] = useState("");
  const [venueDescription, setVenueDescription] = useState("");
  const [images, setImages] = useState([]);
  const [selectedCosplayers, setSelectedCosplayers] = useState([]); // Each item: { cosplayer, character }
  const [manualQuantity, setManualQuantity] = useState(1);
  const [useCosplayerList, setUseCosplayerList] = useState(true);
  const [showSummaryModal, setShowSummaryModal] = useState(false);
  const [characterSearch, setCharacterSearch] = useState("");
  const [genderFilter, setGenderFilter] = useState("All");
  const [showTermsModal, setShowTermsModal] = useState(false);
  const [termsAgreed, setTermsAgreed] = useState(false);

  // Sample data for categories (unchanged)
  const categories = [
    { name: "Halloween", image: "https://static-images.vnncdn.net/files/publish/2023/10/26/le-hoi-halloween-2023-la-ngay-nao-611.jpg?width=0&s=WBL23e8H3tbjOtgDXA7h3w" },
    { name: "Anime", image: "https://www.avisanime.fr/wp-content/uploads/2024/02/Scan-Jujutsu-Kaisen-apres-anime-que-lire-et-ou-commencer.jpg" },
    { name: "Game", image: "https://hoanghamobile.com/tin-tuc/wp-content/uploads/2024/02/game-hot-thumb.jpg" },
    { name: "Comic Con", image: "https://offloadmedia.feverup.com/secretlosangeles.com/wp-content/uploads/2022/12/13103130/unnamed-2-1024x576.jpg" },
    { name: "Fantasy", image: "https://images2.thanhnien.vn/528068263637045248/2023/9/15/fantasy-16947704442011729238363.jpg" },
    { name: "Sci-Fi", image: "https://static.scientificamerican.com/sciam/cache/file/C51BE585-F913-4327-9F0E02FCB6321923_source.jpg?w=1200" },
    { name: "Superheroes", image: "https://www.mensjournal.com/.image/t_share/MTk2MTM3MzYwNzA2OTcxMTQx/batman-superman-aquaman-wonder-woman-flash-cyborg-of-the-justice-league.jpg" },
    { name: "Historical", image: "https://clickhole.com/wp-content/uploads/2023/10/historical-figurs.png" },
    { name: "Music Festival", image: "https://www.anarapublishing.com/wp-content/uploads/2019/04/photo-1506157786151-b8491531f063.jpeg" },
    { name: "Cultural", image: "https://ohmyfacts.com/wp-content/uploads/2024/09/28-facts-about-cultural-sensitivity-1726202634.jpg" },
    { name: "Sports", image: "https://nativespeaker.vn/uploaded/page_1656_1712278968_1715676497.jpg" },
    { name: "Technology", image: "https://blog.hyperiondev.com/wp-content/uploads/2019/02/Blog-Tech-Events.jpg" },
    { name: "Fashion", image: "https://iso.500px.com/wp-content/uploads/2020/02/Christophe-Josse-Finale-By-Milton-Tan.jpeg" },
    { name: "Food & Drink", image: "https://eventbrite-s3.s3.amazonaws.com/marketing/landingpages/assets/2023/loce/food-drinks-festivals/hero_festivals_food2.jpg" },
    { name: "Art & Design", image: "https://images.prestigeonline.com/wp-content/uploads/sites/8/2022/07/12140511/national_museum.6d2b3175946.original-min-1349x900.jpg" },
    { name: "Business & Networking", image: "https://promoambitions.com/wp-content/uploads/2019/05/Business-Networking-Events-1.jpg" },
    { name: "Education", image: "https://cdn.unischolarz.com/blog/wp-content/uploads/2021/05/24174820/alphagamma-bett-show-2020-opportuniries-min-1024x576.jpg" },
    { name: "Charity & Causes", image: "https://cdn.evbstatic.com/s3-build/fe/build/images/fa71a953ce0560ebed3dcc2b89dd1217-charity_and_causes.webp" },
    { name: "Film & Media", image: "https://rightmedia.vn/wp-content/uploads/2024/05/don-vi-san-xuat-tvc-uy-tin.png" },
    { name: "Seasonal", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ7ADgrg2CBJXXDwJaeVSIoFZufahUEkqcZnw&s" },
    { name: "Science & Tech", image: "https://cdn.evbstatic.com/s3-build/fe/build/images/1d87d01c25d690d5564dd4184cd39f8e-science.webp" },
    { name: "Other", image: "https://stepup.edu.vn/wp-content/uploads/2020/08/the-other-1.jpg" },
  ];

  // Expanded cosplayers data with crossGenderAllowed for some
  const cosplayers = [
    { id: 1, name: "Hana", gender: "Female", categories: ["Superheroes", "Sci-Fi"], crossGenderAllowed: false, image: "https://laforce.vn/wp-content/uploads/2023/08/trang-phuc-cosplay-dep.jpg" },
    { id: 2, name: "Kai", gender: "Male", categories: ["Superheroes", "Anime"], crossGenderAllowed: true, image: "https://laforce.vn/wp-content/uploads/2023/08/trang-phuc-cosplay-dep.jpg" },
    { id: 3, name: "Miko", gender: "Female", categories: ["Anime"], crossGenderAllowed: false, image: "https://laforce.vn/wp-content/uploads/2023/08/trang-phuc-cosplay-dep.jpg" },
    { id: 4, name: "Yuki", gender: "Female", categories: ["Anime", "Fantasy"], crossGenderAllowed: true, image: "https://laforce.vn/wp-content/uploads/2023/08/trang-phuc-cosplay-dep.jpg" },
    { id: 5, name: "Taro", gender: "Male", categories: ["Fantasy", "Anime"], crossGenderAllowed: false, image: "https://laforce.vn/wp-content/uploads/2023/08/trang-phuc-cosplay-dep.jpg" },
    { id: 6, name: "Rin", gender: "Female", categories: ["Anime", "Game"], crossGenderAllowed: false, image: "https://laforce.vn/wp-content/uploads/2023/08/trang-phuc-cosplay-dep.jpg" },
    { id: 7, name: "Sora", gender: "Male", categories: ["Game", "Fantasy"], crossGenderAllowed: false, image: "https://laforce.vn/wp-content/uploads/2023/08/trang-phuc-cosplay-dep.jpg" },
    { id: 8, name: "Aki", gender: "Female", categories: ["Superheroes", "Sci-Fi"], crossGenderAllowed: true, image: "https://laforce.vn/wp-content/uploads/2023/08/trang-phuc-cosplay-dep.jpg" },
    { id: 9, name: "Jin", gender: "Male", categories: ["Anime", "Game"], crossGenderAllowed: false, image: "https://laforce.vn/wp-content/uploads/2023/08/trang-phuc-cosplay-dep.jpg" },
    { id: 10, name: "Luna", gender: "Female", categories: ["Fantasy", "Sci-Fi"], crossGenderAllowed: false, image: "https://laforce.vn/wp-content/uploads/2023/08/trang-phuc-cosplay-dep.jpg" },
    { id: 11, name: "Kenta", gender: "Male", categories: ["Superheroes", "Historical"], crossGenderAllowed: false, image: "https://laforce.vn/wp-content/uploads/2023/08/trang-phuc-cosplay-dep.jpg" },
    { id: 12, name: "Nami", gender: "Female", categories: ["Anime", "Game"], crossGenderAllowed: false, image: "https://laforce.vn/wp-content/uploads/2023/08/trang-phuc-cosplay-dep.jpg" },
    { id: 13, name: "Haru", gender: "Male", categories: ["Fantasy", "Historical"], crossGenderAllowed: true, image: "https://laforce.vn/wp-content/uploads/2023/08/trang-phuc-cosplay-dep.jpg" },
    { id: 14, name: "Sakura", gender: "Female", categories: ["Anime", "Historical"], crossGenderAllowed: false, image: "https://laforce.vn/wp-content/uploads/2023/08/trang-phuc-cosplay-dep.jpg" },
    { id: 15, name: "Riku", gender: "Male", categories: ["Sci-Fi", "Game"], crossGenderAllowed: false, image: "https://laforce.vn/wp-content/uploads/2023/08/trang-phuc-cosplay-dep.jpg" },
  ];

  // Expanded characters data
  const characters = [
    { name: "Superman", category: "Superheroes", gender: "Male" },
    { name: "Wonder Woman", category: "Superheroes", gender: "Female" },
    { name: "Naruto", category: "Anime", gender: "Male" },
    { name: "Sailor Moon", category: "Anime", gender: "Female" },
    { name: "Gandalf", category: "Fantasy", gender: "Male" },
    { name: "Ellen Ripley", category: "Sci-Fi", gender: "Female" },
    { name: "Batman", category: "Superheroes", gender: "Male" },
    { name: "Catwoman", category: "Superheroes", gender: "Female" },
    { name: "Luffy", category: "Anime", gender: "Male" },
    { name: "Nami", category: "Anime", gender: "Female" },
    { name: "Aragorn", category: "Fantasy", gender: "Male" },
    { name: "Galadriel", category: "Fantasy", gender: "Female" },
    { name: "Master Chief", category: "Game", gender: "Male" },
    { name: "Lara Croft", category: "Game", gender: "Female" },
    { name: "Darth Vader", category: "Sci-Fi", gender: "Male" },
    { name: "Leia Organa", category: "Sci-Fi", gender: "Female" },
    { name: "Geralt of Rivia", category: "Fantasy", gender: "Male" },
    { name: "Yennefer", category: "Fantasy", gender: "Female" },
    { name: "Ichigo Kurosaki", category: "Anime", gender: "Male" },
    { name: "Rukia Kuchiki", category: "Anime", gender: "Female" },
    { name: "Samurai Jack", category: "Historical", gender: "Male" },
    { name: "Joan of Arc", category: "Historical", gender: "Female" },
    { name: "Link", category: "Game", gender: "Male" },
    { name: "Zelda", category: "Game", gender: "Female" },
    { name: "Iron Man", category: "Superheroes", gender: "Male" },
    { name: "Black Widow", category: "Superheroes", gender: "Female" },
  ];

  // Handle next step
  const handleNextStep = () => {
    if (step === 1 && !selectedCategory) return alert("Please select a category!");
    if (
      step === 2 &&
      (!eventName || !location || !startDate || !startTime || !endDate || !endTime || !description || !venueDescription)
    )
      return alert("Please fill in all required fields!");
    if (step === 3) {
      if (useCosplayerList) {
        if (
          selectedCosplayers.length === 0 ||
          selectedCosplayers.some((sc) => !sc.character)
        ) {
          return alert("Please select cosplayers and assign a character to each!");
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
      selectedCategory,
      eventName,
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

  // Filter categories by search term
  const filteredCategories = categories.filter((cat) =>
    cat.name.toLowerCase().includes(searchTerm.toLowerCase())
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
          cosplayer.categories.includes(searchedCharacter.category)
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

  // Toggle cosplayer selection
  const toggleCosplayerSelection = (cosplayer) => {
    setSelectedCosplayers((prev) =>
      prev.some((sc) => sc.cosplayer.id === cosplayer.id)
        ? prev.filter((sc) => sc.cosplayer.id !== cosplayer.id)
        : [...prev, { cosplayer, character: null }]
    );
  };

  // Assign character to cosplayer with conditional gender matching
  const handleCharacterSelect = (cosplayerId, selectedCharacter) => {
    setSelectedCosplayers((prev) =>
      prev.map((sc) =>
        sc.cosplayer.id === cosplayerId ? { ...sc, character: selectedCharacter } : sc
      )
    );
  };

  return (
    <div className="event-organize-page min-vh-100">
      <div className="hero-section text-white py-5">
        <Container>
          <h1 className="display-4 fw-bold text-center">Event Organization</h1>
          <p className="lead text-center mt-3">
            Organize your event and book your favorite cosplayers!
          </p>
        </Container>
      </div>

      <Container className="py-4">
        <ProgressBar now={(step / 4) * 100} className="progress-custom" />
        <p className="text-center mt-2">Step {step} of 4</p>
      </Container>

      <Container className="py-5">
        {step === 1 && (
          <div className="step-section fade-in">
            <h2 className="text-center mb-4">Select Event Category</h2>
            <div className="search-container mb-4">
              <InputGroup>
                <InputGroup.Text>
                  <Search size={20} />
                </InputGroup.Text>
                <FormControl
                  placeholder="Search categories..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </InputGroup>
            </div>
            <Row>
              {filteredCategories.map((category) => (
                <Col md={4} className="mb-4" key={category.name}>
                  <Card
                    className={`category-card ${selectedCategory === category.name ? "selected" : ""}`}
                    onClick={() => setSelectedCategory(category.name)}
                  >
                    <Card.Img variant="top" src={category.image} />
                    <Card.Body>
                      <Card.Title>{category.name}</Card.Title>
                    </Card.Body>
                  </Card>
                </Col>
              ))}
            </Row>
          </div>
        )}

        {step === 2 && (
          <div className="step-section fade-in">
            <h2 className="text-center mb-4">Event Information</h2>
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
                  Upload images to illustrate your requirements or venue
                </small>
              </Form.Group>
            </Form>
          </div>
        )}

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
                      placeholder="Search for a character (e.g., Superman, Naruto)"
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
                        className={`cosplayer-card ${
                          selectedCosplayers.some((sc) => sc.cosplayer.id === cosplayer.id)
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
                          <Button
                            variant="primary"
                            size="sm"
                            className="mt-2"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleViewProfile(cosplayer);
                            }}
                          >
                            <User size={16} /> View Profile
                          </Button>
                        </Card.Body>
                      </Card>
                    </Col>
                  ))}
                </Row>
                {filterCosplayersByCharacterAndGender().length === 0 && (
                  <p className="text-center mt-4">
                    No cosplayers found for "{characterSearch}" with selected filters.
                  </p>
                )}
                {selectedCosplayers.length > 0 && (
                  <div className="selected-cosplayers mt-4">
                    <h4>Assign Characters to Selected Cosplayers</h4>
                    <p className="text-muted">
                      Please select the character each cosplayer will portray. Some cosplayers can cross-gender cosplay.
                    </p>
                    {selectedCosplayers.map((sc) => (
                      <div key={sc.cosplayer.id} className="d-flex align-items-center mb-3">
                        <span className="me-3">{sc.cosplayer.name}</span>
                        <Form.Select
                          value={sc.character || ""}
                          onChange={(e) => handleCharacterSelect(sc.cosplayer.id, e.target.value)}
                          style={{ width: "200px" }}
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
                          className="ms-2"
                          onClick={() =>
                            setSelectedCosplayers((prev) =>
                              prev.filter((item) => item.cosplayer.id !== sc.cosplayer.id)
                            )
                          }
                        >
                          Remove
                        </Button>
                      </div>
                    ))}
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
                  Enter the number of cosplayers you need. The system will select them randomly.
                </Form.Text>
              </Form.Group>
            )}
          </div>
        )}

        {step === 4 && (
          <div className="step-section fade-in">
            <h2 className="text-center mb-4">Review Your Event</h2>
            <Card>
              <Card.Body>
                <p><strong>Category:</strong> {selectedCategory}</p>
                <p><strong>Event Name:</strong> {eventName}</p>
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
              Previous
            </Button>
          )}
          <div>
            <Button variant="outline-secondary" onClick={handleSaveDraft} className="me-2">
              Save as Draft
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
          <p><strong>Category:</strong> {selectedCategory}</p>
          <p><strong>Event Name:</strong> {eventName}</p>
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
          <Button variant="primary" onClick={() => setShowSummaryModal(false)}>
            Confirm & Submit
          </Button>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default DetailEventOrganizationPage;