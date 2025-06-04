import React, { useState, useEffect } from "react";
import { Modal, Button, Card, Container } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { Carousel } from "antd";
import DetailEventOrganizationPageService from "../../services/DetailEventOrganizationPageService/DetailEventOrganizationPageService";
import HireCosplayerService from "../../services/HireCosplayerService/HireCosplayerService";
import "antd/dist/reset.css";
import "../../styles/PackageDetailPage.scss";

const PackageDetailModal = ({ packageId, show, onHide }) => {
  const navigate = useNavigate();
  const [packageData, setPackageData] = useState(null);
  const [characters, setCharacters] = useState([]);
  const [cosplayers, setCosplayers] = useState([]);
  const [loading, setLoading] = useState(true);

  const placeholderImages = [
    "https://cdn.prod.website-files.com/6769617aecf082b10bb149ff/67763d8a2775bee07438e7a5_Events.png",
    "https://jjrmarketing.com/wp-content/uploads/2019/12/International-Event.jpg",
    "https://i.pinimg.com/originals/29/14/28/291428085a037fa45b04fd94ad02e5d2.jpg",
    "https://img.lovepik.com/photo/40102/3929.jpg_wh860.jpg",
    "https://scandiweb.com/blog/wp-content/uploads/2020/01/ecom360_conference_hosting_successful_event.jpeg",
  ];

  const getImageIndex = (id) => {
    if (!id) return 0;
    let hash = 0;
    for (let i = 0; i < id.length; i++) {
      hash = (hash << 5) - hash + id.charCodeAt(i);
      hash |= 0;
    }
    return Math.abs(hash) % placeholderImages.length;
  };

  useEffect(() => {
    const fetchData = async () => {
      if (!packageId) {
        toast.error("Invalid package ID.");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const pkg = await DetailEventOrganizationPageService.getPackageById(
          packageId
        );
        console.log("Package API Response:", pkg);

        const chars =
          await DetailEventOrganizationPageService.getAllCharacters();
        const charactersWithImages = await Promise.all(
          chars
            .filter((char) => char.quantity >= 1)
            .map(async (char) => {
              const images =
                await DetailEventOrganizationPageService.getCharacterImageByCharacterId(
                  char.characterId
                );
              return { ...char, images: images || [] };
            })
        );

        const cosplayersData = await HireCosplayerService.getAllCosplayers();
        console.log("Cosplayers API Response:", cosplayersData);
        const cosplayersWithImages = cosplayersData
          .filter((cosplayer) => cosplayer.isActive && cosplayer.salaryIndex)
          .map((cosplayer) => {
            const uniqueImages = Array.from(
              new Map(
                cosplayer.images.map((img) => [img.accountImageId, img])
              ).values()
            );
            const primaryImage =
              uniqueImages.find((img) => img.isAvatar) || uniqueImages[0];
            return {
              cosplayerId: cosplayer.accountId,
              cosplayerName: cosplayer.name,
              description: cosplayer.description,
              price: cosplayer.salaryIndex,
              images: uniqueImages,
              primaryImage: primaryImage ? [primaryImage] : [],
              averageStar: cosplayer.averageStar,
            };
          });

        setPackageData({
          ...pkg,
          image: pkg.image || placeholderImages[getImageIndex(packageId)],
        });
        setCharacters(charactersWithImages.slice(0, 3)); // Limit to 3 characters
        setCosplayers(cosplayersWithImages.slice(0, 3)); // Limit to 3 cosplayers
      } catch (error) {
        console.error("API Error:", error);
        if (error.response?.status === 404) {
          toast.error("Package, characters, or cosplayers not found.");
        } else {
          toast.error("Failed to fetch package, character, or cosplayer data.");
        }
      } finally {
        setLoading(false);
      }
    };
    if (show) fetchData();
  }, [packageId, show]);

  if (!show) return null;

  return (
    <Modal
      show={show}
      onHide={onHide}
      centered
      size="xl"
      className="package-detail-modal"
      scrollable
    >
      <Modal.Header closeButton>
        <Modal.Title>Package Details</Modal.Title>
      </Modal.Header>
      <Modal.Body className="package-detail-page">
        <Container className="py-4">
          {loading ? (
            <p className="text-center py-5">Loading...</p>
          ) : !packageData ? (
            <p className="text-center py-5">Package not found.</p>
          ) : (
            <>
              {/* Package Details Section */}
              <section className="package-section">
                <div className="text-center">
                  {placeholderImages.length > 0 ? (
                    <Carousel autoplay className="event-carousel">
                      {placeholderImages.map((image, index) => (
                        <div
                          key={`event-image-${index}`}
                          className="carousel-slide"
                        >
                          <img
                            src={image}
                            alt={`Event showcase image ${index + 1}`}
                            className="event-img"
                            loading="lazy"
                          />
                        </div>
                      ))}
                    </Carousel>
                  ) : (
                    <p className="text-center">No event images available.</p>
                  )}
                  <h2 className="display-4">{packageData.packageName}</h2>
                  <h4>Package Details</h4>
                  <p className="lead">
                    {packageData.description ||
                      "Discover the perfect package for your event, tailored to create lasting memories."}
                  </p>
                  <div className="price-display">
                    <h3>
                      {packageData.price.toLocaleString("vi-VN", {
                        style: "currency",
                        currency: "VND",
                      })}
                    </h3>
                  </div>
                  <Button
                    className="btn-booking"
                    onClick={() => {
                      onHide();
                      navigate("/event");
                    }}
                    aria-label="Book this package now"
                  >
                    Book Now
                  </Button>
                </div>
              </section>
            </>
          )}
        </Container>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default PackageDetailModal;
