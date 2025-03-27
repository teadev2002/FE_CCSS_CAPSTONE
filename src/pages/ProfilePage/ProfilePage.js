import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Container, Row, Col, Button, Badge } from "react-bootstrap";
import {
  Settings,
  Camera,
  Grid,
  Bookmark,
  PersonStanding,
  Mail,
  Phone,
  Calendar,
  Code,
  Activity,
  Crown,
  Ruler,
  Weight,
} from "lucide-react";
import ProfileService from "../../services/ProfileService/ProfileService.js"; // Import service
import "bootstrap/dist/css/bootstrap.min.css";
import "../../styles/ProfilePage.scss";
import Box from "@mui/material/Box";
import LinearProgress from "@mui/material/LinearProgress";

const ProfilePage = () => {
  const { id } = useParams();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("posts");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await ProfileService.getProfileById(id);
        setProfile(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [id]);

  if (loading) return <div></div>;
  if (error)
    return (
      <div>
        Lỗi: {error}{" "}
        <Box sx={{ width: "100%" }}>
          <LinearProgress />
        </Box>
      </div>
    );
  if (!profile) return <div>Không tìm thấy profile </div>;

  return (
    <div className="profile-page">
      <div className="profile-container">
        <Container>
          <div className="profile-header">
            <Row className="align-items-center">
              <Col xs={4} className="left-side">
                <img
                  src={
                    profile.imageUrl ||
                    "https://cdn.pixabay.com/photo/2023/12/04/13/23/ai-generated-8429472_1280.png"
                  }
                  alt={profile.name}
                  className="profile-image"
                />
                <div className="action-buttons">
                  <Button className="btn text-white">Edit profile</Button>
                </div>
              </Col>
              <Col xs={8}>
                <div className="username">
                  <h3 className="name">{profile.name}</h3>
                </div>

                <div className="profile-info">
                  <p className="description">{profile.description || "N/A"}</p>

                  <div className="status-badges">
                    {profile.isActive && (
                      <Badge className="status-badge active">Active</Badge>
                    )}
                    {profile.onTask && (
                      <Badge className="status-badge on-task">On Task</Badge>
                    )}
                    {profile.leader && (
                      <Badge className="status-badge leader">
                        <Crown size={14} /> Team Leader
                      </Badge>
                    )}
                  </div>
                  <div className="details-grid">
                    <div className="detail-item">
                      <Mail size={16} />
                      <span>{profile.email}</span>
                    </div>
                    <div className="detail-item">
                      <Phone size={16} />
                      <span>{profile.phone || "N/A"}</span>
                    </div>
                    <div className="detail-item">
                      <Calendar size={16} />
                      <span>{profile.birthday || "N/A"}</span>
                    </div>
                    <div className="detail-item">
                      <Activity size={16} />
                      <span>{profile.taskQuantity || 0} Tasks</span>
                    </div>
                    <div className="detail-item">
                      <Ruler size={16} />
                      <span>{profile.height || "N/A"}</span>
                    </div>
                    <div className="detail-item">
                      <Weight size={16} />
                      <span>{profile.weight || "N/A"}</span>
                    </div>
                  </div>
                </div>
              </Col>
            </Row>
          </div>

          <div className="tabs">
            <div
              className={`tab ${activeTab === "posts" ? "active" : ""}`}
              onClick={() => setActiveTab("posts")}
            >
              <Grid size={12} className="icon" /> Posts
            </div>
          </div>

          <div className="empty-state">
            <div className="camera-icon">
              <Camera size={24} />
            </div>
            <h2>Share Photos</h2>
            <p>When you share photos, they will appear on your profile.</p>
            <a href="#" className="share-button">
              Share your first photo
            </a>
          </div>
        </Container>
      </div>
    </div>
  );
};

export default ProfilePage;
