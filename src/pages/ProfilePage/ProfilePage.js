// import React, { useState, useEffect } from "react";
// import { useParams } from "react-router-dom";
// import { Container, Row, Col, Button, Badge } from "react-bootstrap";
// import {
//   Settings,
//   Camera,
//   Grid,
//   Bookmark,
//   PersonStanding,
//   Mail,
//   Phone,
//   Calendar,
//   Code,
//   Activity,
//   Crown,
//   Ruler,
//   Weight,
// } from "lucide-react";
// import ProfileService from "../../services/ProfileService/ProfileService.js"; // Import service
// import "bootstrap/dist/css/bootstrap.min.css";
// import "../../styles/ProfilePage.scss";
// import Box from "@mui/material/Box";
// import LinearProgress from "@mui/material/LinearProgress";

// const ProfilePage = () => {
//   const { id } = useParams();
//   const [profile, setProfile] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [activeTab, setActiveTab] = useState("posts");

//   useEffect(() => {
//     const fetchProfile = async () => {
//       try {
//         const data = await ProfileService.getProfileById(id);
//         setProfile(data);
//       } catch (err) {
//         setError(err.message);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchProfile();
//   }, [id]);

//   if (loading) return <div></div>;
//   if (error)
//     return (
//       <div>
//         Lỗi: {error}{" "}
//         <Box sx={{ width: "100%" }}>
//           <LinearProgress />
//         </Box>
//       </div>
//     );
//   if (!profile) return <div>Không tìm thấy profile </div>;

//   return (
//     <div className="profile-page">
//       <div className="profile-container">
//         <Container>
//           <div className="profile-header">
//             <Row className="align-items-center">
//               <Col xs={4} className="left-side">
//                 <img
//                   src={
//                     profile.imageUrl ||
//                     "https://cdn.pixabay.com/photo/2023/12/04/13/23/ai-generated-8429472_1280.png"
//                   }
//                   alt={profile.name}
//                   className="profile-image"
//                 />
//                 <div className="action-buttons">
//                   <Button className="btn text-white">Edit profile</Button>
//                 </div>
//               </Col>
//               <Col xs={8}>
//                 <div className="username">
//                   <h3 className="name">{profile.name}</h3>
//                 </div>

//                 <div className="profile-info">
//                   <p className="description">{profile.description || "N/A"}</p>

//                   <div className="status-badges">
//                     {profile.isActive && (
//                       <Badge className="status-badge active">Active</Badge>
//                     )}
//                     {profile.onTask && (
//                       <Badge className="status-badge on-task">On Task</Badge>
//                     )}
//                     {profile.leader && (
//                       <Badge className="status-badge leader">
//                         <Crown size={14} /> Team Leader
//                       </Badge>
//                     )}
//                   </div>
//                   <div className="details-grid">
//                     <div className="detail-item">
//                       <Mail size={16} />
//                       <span>{profile.email}</span>
//                     </div>
//                     <div className="detail-item">
//                       <Phone size={16} />
//                       <span>{profile.phone || "N/A"}</span>
//                     </div>
//                     <div className="detail-item">
//                       <Calendar size={16} />
//                       <span>{profile.birthday || "N/A"}</span>
//                     </div>
//                     <div className="detail-item">
//                       <Activity size={16} />
//                       <span>{profile.taskQuantity || 0} Tasks</span>
//                     </div>
//                     <div className="detail-item">
//                       <Ruler size={16} />
//                       <span>{profile.height || "N/A"}</span>
//                     </div>
//                     <div className="detail-item">
//                       <Weight size={16} />
//                       <span>{profile.weight || "N/A"}</span>
//                     </div>
//                   </div>
//                 </div>
//               </Col>
//             </Row>
//           </div>

//           <div className="tabs">
//             <div
//               className={`tab ${activeTab === "posts" ? "active" : ""}`}
//               onClick={() => setActiveTab("posts")}
//             >
//               <Grid size={12} className="icon" /> Posts
//             </div>
//           </div>

//           <div className="empty-state">
//             <div className="camera-icon">
//               <Camera size={24} />
//             </div>
//             <h2>Share Photos</h2>
//             <p>When you share photos, they will appear on your profile.</p>
//             <a href="#" className="share-button">
//               Share your first photo
//             </a>
//           </div>
//         </Container>
//       </div>
//     </div>
//   );
// };

// export default ProfilePage;

// import React, { useState, useEffect } from "react";
// import { useParams } from "react-router-dom";
// import { Container, Row, Col, Button, Badge, Form } from "react-bootstrap";
// import {
//   Settings,
//   Camera,
//   Grid,
//   Bookmark,
//   PersonStanding,
//   Mail,
//   Phone,
//   Calendar,
//   Code,
//   Activity,
//   Crown,
//   Ruler,
//   Weight,
//   Star,
//   DollarSign,
// } from "lucide-react";
// import ProfileService from "../../services/ProfileService/ProfileService.js"; // Import service
// import "bootstrap/dist/css/bootstrap.min.css";
// import "../../styles/ProfilePage.scss";
// import Box from "@mui/material/Box";
// import LinearProgress from "@mui/material/LinearProgress";
// import { Image } from "antd"; // Import Ant Design Image component
// import { jwtDecode } from "jwt-decode"; // Import jwt-decode to decode the token

// // Function to get the current user's accountId by decoding the JWT token
// const getCurrentUserId = () => {
//   try {
//     // Retrieve the accessToken from localStorage
//     const accessToken = localStorage.getItem("accessToken");
//     if (!accessToken) {
//       console.warn("No accessToken found in localStorage");
//       return null;
//     }

//     // Decode the JWT token
//     const decodedToken = jwtDecode(accessToken);
//     console.log("Decoded JWT token:", decodedToken);

//     // Extract the Id field from the decoded token
//     // Note: The field name might be different depending on your JWT payload
//     // Common field names include "id", "sub", "userId", or "Id"
//     // Adjust the field name based on your token's payload structure
//     const userId =
//       decodedToken.Id ||
//       decodedToken.id ||
//       decodedToken.sub ||
//       decodedToken.userId;
//     if (!userId) {
//       console.warn("No Id field found in decoded JWT token");
//       return null;
//     }

//     return userId;
//   } catch (error) {
//     console.error("Error decoding JWT token:", error);
//     return null;
//   }
// };

// const ProfilePage = () => {
//   const { id } = useParams(); // The accountId of the profile being viewed
//   const [profile, setProfile] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [activeTab, setActiveTab] = useState("posts");
//   const [isEditing, setIsEditing] = useState(false);
//   const [formData, setFormData] = useState({});
//   const [avatarFile, setAvatarFile] = useState(null);
//   const [additionalImages, setAdditionalImages] = useState([]);

//   // Get the current user's accountId from the JWT token
//   const currentUserId = getCurrentUserId();

//   // Debug the comparison
//   console.log("Profile ID (id):", id);
//   console.log("Current User ID (currentUserId):", currentUserId);
//   console.log("Types - id:", typeof id, "currentUserId:", typeof currentUserId);

//   // Ensure both values are strings and trim any whitespace
//   const normalizedId = String(id).trim();
//   const normalizedCurrentUserId = currentUserId
//     ? String(currentUserId).trim()
//     : null;

//   // Check if the logged-in user is the owner of this profile
//   const isProfileOwner =
//     normalizedCurrentUserId && normalizedId === normalizedCurrentUserId;
//   console.log("Is Profile Owner:", isProfileOwner);

//   const fetchProfile = async () => {
//     try {
//       const data = await ProfileService.getProfileById(id);
//       setProfile(data);

//       let formattedBirthday = "";
//       if (data.birthday) {
//         const date = new Date(data.birthday);
//         if (!isNaN(date.getTime())) {
//           formattedBirthday = date.toISOString().split("T")[0];
//         }
//       }

//       setFormData({
//         accountId: id,
//         name: data.name || "",
//         email: data.email || "",
//         password: "",
//         description: data.description || "",
//         birthday: formattedBirthday,
//         phone: data.phone || "",
//         height: data.height || "",
//         weight: data.weight || "",
//         avatar: null,
//         images: [],
//       });
//     } catch (err) {
//       setError(err.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchProfile();
//   }, [id]);

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({ ...prev, [name]: value }));
//   };

//   const handleAvatarChange = (e) => {
//     const file = e.target.files[0];
//     if (file) {
//       setAvatarFile(file);
//       setFormData((prev) => ({ ...prev, avatar: file }));
//     }
//   };

//   const handleImagesChange = (e) => {
//     const files = Array.from(e.target.files);
//     // Deduplicate files based on name and size
//     const uniqueFiles = Array.from(
//       new Map(files.map((file) => [`${file.name}-${file.size}`, file])).values()
//     );
//     setAdditionalImages(uniqueFiles);
//     setFormData((prev) => ({ ...prev, images: uniqueFiles }));
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (!formData.password) {
//       setError("The Password field is required.");
//       return;
//     }
//     try {
//       const response = await ProfileService.updateProfile(id, formData);
//       console.log("Update response:", response);
//       await fetchProfile();
//       setIsEditing(false);
//       setAvatarFile(null);
//       setAdditionalImages([]);
//       setError(null);
//     } catch (err) {
//       setError(err.message || "Error updating profile");
//     }
//   };

//   const toggleEditMode = () => {
//     if (!isProfileOwner) {
//       setError("You do not have permission to edit this profile.");
//       return;
//     }
//     setIsEditing(!isEditing);
//     setError(null);
//   };

//   const getAvatarUrl = () => {
//     if (avatarFile) {
//       return URL.createObjectURL(avatarFile);
//     }
//     if (profile && profile.images) {
//       const avatarImage = profile.images.find((img) => img.isAvatar);
//       return avatarImage
//         ? avatarImage.urlImage
//         : "https://cdn.pixabay.com/photo/2023/12/04/13/23/ai-generated-8429472_1280.png";
//     }
//     return "https://cdn.pixabay.com/photo/2023/12/04/13/23/ai-generated-8429472_1280.png";
//   };

//   // Deduplicate images based on urlImage before rendering
//   const getUniqueImages = (images) => {
//     if (!images || images.length === 0) return [];
//     const seenUrls = new Set();
//     return images.filter((image) => {
//       if (seenUrls.has(image.urlImage)) {
//         return false;
//       }
//       seenUrls.add(image.urlImage);
//       return true;
//     });
//   };

//   if (loading) return <div></div>;
//   if (error)
//     return (
//       <div>
//         Lỗi: {error}{" "}
//         <Box sx={{ width: "100%" }}>
//           <LinearProgress />
//         </Box>
//       </div>
//     );
//   if (!profile) return <div>Không tìm thấy profile </div>;

//   const uniqueImages = getUniqueImages(profile.images);

//   return (
//     <div className="profile-page">
//       <div className="profile-container">
//         <Container>
//           <div className="profile-header">
//             <Row className="align-items-center">
//               <Col xs={4} className="left-side">
//                 {isEditing ? (
//                   <>
//                     <img
//                       src={getAvatarUrl()}
//                       alt={profile.name}
//                       className="profile-image"
//                     />
//                     <Form.Group controlId="avatar" className="mt-2">
//                       <Form.Label>Change Avatar</Form.Label>
//                       <Form.Control
//                         type="file"
//                         accept="image/*"
//                         onChange={handleAvatarChange}
//                       />
//                     </Form.Group>
//                     <Form.Group controlId="images" className="mt-2">
//                       <Form.Label>Add More Images</Form.Label>
//                       <Form.Control
//                         type="file"
//                         accept="image/*"
//                         multiple
//                         onChange={handleImagesChange}
//                       />
//                     </Form.Group>
//                   </>
//                 ) : (
//                   <img
//                     src={getAvatarUrl()}
//                     alt={profile.name}
//                     className="profile-image"
//                   />
//                 )}
//                 <div className="action-buttons">
//                   {isEditing ? (
//                     <>
//                       <Button
//                         variant="success"
//                         className="btn text-white me-2"
//                         onClick={handleSubmit}
//                       >
//                         Save
//                       </Button>
//                       <Button
//                         variant="secondary"
//                         className="btn text-white"
//                         onClick={toggleEditMode}
//                       >
//                         Cancel
//                       </Button>
//                     </>
//                   ) : (
//                     isProfileOwner && (
//                       <Button
//                         className="btn text-white"
//                         onClick={toggleEditMode}
//                       >
//                         Edit profile
//                       </Button>
//                     )
//                   )}
//                 </div>
//               </Col>
//               <Col xs={8}>
//                 <div className="username">
//                   {isEditing ? (
//                     <Form.Group controlId="name">
//                       <Form.Label>Name</Form.Label>
//                       <Form.Control
//                         type="text"
//                         name="name"
//                         value={formData.name}
//                         onChange={handleInputChange}
//                       />
//                     </Form.Group>
//                   ) : (
//                     <h3 className="name">{profile.name}</h3>
//                   )}
//                 </div>

//                 <div className="profile-info">
//                   {isEditing ? (
//                     <Form.Group controlId="description">
//                       <Form.Label>Description</Form.Label>
//                       <Form.Control
//                         as="textarea"
//                         name="description"
//                         value={formData.description}
//                         onChange={handleInputChange}
//                       />
//                     </Form.Group>
//                   ) : (
//                     <p className="description">
//                       {profile.description || "N/A"}
//                     </p>
//                   )}

//                   <div className="status-badges">
//                     {profile.isActive && (
//                       <Badge className="status-badge active">Active</Badge>
//                     )}
//                     {profile.onTask && (
//                       <Badge className="status-badge on-task">On Task</Badge>
//                     )}
//                     {profile.leader && (
//                       <Badge className="status-badge leader">
//                         <Crown size={14} /> Team Leader
//                       </Badge>
//                     )}
//                   </div>

//                   <div className="details-grid">
//                     <div className="detail-item">
//                       <Mail size={16} />
//                       {isEditing ? (
//                         <Form.Control
//                           type="email"
//                           name="email"
//                           value={formData.email}
//                           onChange={handleInputChange}
//                         />
//                       ) : (
//                         <span>{profile.email}</span>
//                       )}
//                     </div>
//                     <div className="detail-item">
//                       <Phone size={16} />
//                       {isEditing ? (
//                         <Form.Control
//                           type="text"
//                           name="phone"
//                           value={formData.phone}
//                           onChange={handleInputChange}
//                         />
//                       ) : (
//                         <span>{profile.phone || "N/A"}</span>
//                       )}
//                     </div>
//                     <div className="detail-item">
//                       <Calendar size={16} />
//                       {isEditing ? (
//                         <Form.Control
//                           type="date"
//                           name="birthday"
//                           value={formData.birthday}
//                           onChange={handleInputChange}
//                         />
//                       ) : (
//                         <span>{profile.birthday || "N/A"}</span>
//                       )}
//                     </div>
//                     <div className="detail-item">
//                       <Activity size={16} />
//                       <span>{profile.taskQuantity || 0} Tasks</span>
//                     </div>
//                     <div className="detail-item">
//                       <Ruler size={16} />
//                       {isEditing ? (
//                         <Form.Control
//                           type="text"
//                           name="height"
//                           value={formData.height}
//                           onChange={handleInputChange}
//                         />
//                       ) : (
//                         <span>{profile.height || "N/A"}</span>
//                       )}
//                     </div>
//                     <div className="detail-item">
//                       <Weight size={16} />
//                       {isEditing ? (
//                         <Form.Control
//                           type="text"
//                           name="weight"
//                           value={formData.weight}
//                           onChange={handleInputChange}
//                         />
//                       ) : (
//                         <span>{profile.weight || "N/A"}</span>
//                       )}
//                     </div>
//                     <div className="detail-item">
//                       <Star size={16} />
//                       <span>{profile.averageStar || "N/A"} Stars</span>
//                     </div>
//                     <div className="detail-item">
//                       <DollarSign size={16} />
//                       <span>Salary Index: {profile.salaryIndex || "N/A"}</span>
//                     </div>
//                     {isEditing && (
//                       <div className="detail-item">
//                         <Code size={16} />
//                         <Form.Control
//                           type="password"
//                           name="password"
//                           value={formData.password}
//                           onChange={handleInputChange}
//                           placeholder="Enter your password"
//                           required
//                         />
//                       </div>
//                     )}
//                   </div>
//                 </div>
//               </Col>
//             </Row>
//           </div>

//           <div className="tabs">
//             <div
//               className={`tab ${activeTab === "posts" ? "active" : ""}`}
//               on
//               visibly={() => setActiveTab("posts")}
//             >
//               <Grid size={12} className="icon" /> Posts
//             </div>
//           </div>

//           {/* Images section below POSTS tab using Ant Design Image.PreviewGroup */}
//           {!isEditing && uniqueImages.length > 0 ? (
//             <div className="additional-images mt-3">
//               <h5>Images</h5>
//               <div className="image-gallery">
//                 <Image.PreviewGroup
//                   preview={{
//                     onChange: (current, prev) =>
//                       console.log(
//                         `Current index: ${current}, Previous index: ${prev}`
//                       ),
//                   }}
//                 >
//                   {uniqueImages.map((image, index) => (
//                     <Image
//                       key={index}
//                       width={150}
//                       src={image.urlImage}
//                       alt={`Profile Image ${index + 1}`}
//                     />
//                   ))}
//                 </Image.PreviewGroup>
//               </div>
//             </div>
//           ) : (
//             <div className="empty-state">
//               <div className="camera-icon">
//                 <Camera size={24} />
//               </div>
//               <h2>Share Photos</h2>
//               <p>When you share photos, they will appear on your profile.</p>
//               <a href="#" className="share-button">
//                 Share your first photo
//               </a>
//             </div>
//           )}
//         </Container>
//       </div>
//     </div>
//   );
// };

// export default ProfilePage;

///////////////////////////cái tren input hình vs mk moi update dc ///////////////////////
////////////cai duoi sua

//---------------------------------------------------------------------------------------------------//

// import React, { useState, useEffect } from "react";
// import { useParams } from "react-router-dom";
// import { Container, Row, Col, Button, Badge, Form } from "react-bootstrap";
// import {
//   Settings,
//   Camera,
//   Grid,
//   Bookmark,
//   PersonStanding,
//   Mail,
//   Phone,
//   Calendar,
//   Code,
//   Activity,
//   Crown,
//   Ruler,
//   Weight,
//   Star,
//   DollarSign,
// } from "lucide-react";
// import ProfileService from "../../services/ProfileService/ProfileService.js"; // Import service
// import "bootstrap/dist/css/bootstrap.min.css";
// import "../../styles/ProfilePage.scss";
// import Box from "@mui/material/Box";
// import LinearProgress from "@mui/material/LinearProgress";
// import { Image } from "antd"; // Import Ant Design Image component
// import { jwtDecode } from "jwt-decode"; // Import jwt-decode to decode the token

// // Function to get the current user's accountId by decoding the JWT token
// const getCurrentUserId = () => {
//   try {
//     // Retrieve the accessToken from localStorage
//     const accessToken = localStorage.getItem("accessToken");
//     if (!accessToken) {
//       console.warn("No accessToken found in localStorage");
//       return null;
//     }

//     // Decode the JWT token
//     const decodedToken = jwtDecode(accessToken);
//     console.log("Decoded JWT token:", decodedToken);

//     // Extract the Id field from the decoded token
//     const userId =
//       decodedToken.Id ||
//       decodedToken.id ||
//       decodedToken.sub ||
//       decodedToken.userId;
//     if (!userId) {
//       console.warn("No Id field found in decoded JWT token");
//       return null;
//     }

//     return userId;
//   } catch (error) {
//     console.error("Error decoding JWT token:", error);
//     return null;
//   }
// };

// // Helper function to format date from YYYY-MM-DD to DD/MM/YYYY for display
// const formatDateForDisplay = (dateString) => {
//   if (!dateString) return "N/A";
//   const [year, month, day] = dateString.split("-");
//   return `${day}/${month}/${year}`;
// };

// // Helper function to format date from any format to YYYY-MM-DD for API
// const formatDateForApi = (dateString) => {
//   if (!dateString) return null;
//   const date = new Date(dateString);
//   if (isNaN(date.getTime())) return null;
//   return date.toISOString().split("T")[0]; // Returns YYYY-MM-DD
// };

// const ProfilePage = () => {
//   const { id } = useParams(); // The accountId of the profile being viewed
//   const [profile, setProfile] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [activeTab, setActiveTab] = useState("posts");
//   const [isEditing, setIsEditing] = useState(false);
//   const [formData, setFormData] = useState({});
//   const [avatarFile, setAvatarFile] = useState(null);
//   const [additionalImages, setAdditionalImages] = useState([]);

//   // Get the current user's accountId from the JWT token
//   const currentUserId = getCurrentUserId();

//   // Debug the comparison
//   console.log("Profile ID (id):", id);
//   console.log("Current User ID (currentUserId):", currentUserId);
//   console.log("Types - id:", typeof id, "currentUserId:", typeof currentUserId);

//   // Ensure both values are strings and trim any whitespace
//   const normalizedId = String(id).trim();
//   const normalizedCurrentUserId = currentUserId
//     ? String(currentUserId).trim()
//     : null;

//   // Check if the logged-in user is the owner of this profile
//   const isProfileOwner =
//     normalizedCurrentUserId && normalizedId === normalizedCurrentUserId;
//   console.log("Is Profile Owner:", isProfileOwner);

//   const fetchProfile = async () => {
//     try {
//       const data = await ProfileService.getProfileById(id);
//       setProfile(data);

//       // Format birthday to YYYY-MM-DD for formData (for <input type="date">)
//       let formattedBirthday = "";
//       if (data.birthday) {
//         const date = new Date(data.birthday);
//         if (!isNaN(date.getTime())) {
//           formattedBirthday = date.toISOString().split("T")[0]; // YYYY-MM-DD
//         }
//       }

//       setFormData({
//         accountId: id,
//         name: data.name || "",
//         email: data.email || "",
//         password: data.password || "", // Keep the original password
//         description: data.description || "",
//         birthday: formattedBirthday,
//         phone: data.phone || "",
//         height: data.height || "",
//         weight: data.weight || "",
//         avatar: null,
//         images: [],
//       });
//     } catch (err) {
//       setError(err.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchProfile();
//   }, [id]);

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({ ...prev, [name]: value }));
//   };

//   const handleAvatarChange = (e) => {
//     const file = e.target.files[0];
//     if (file) {
//       setAvatarFile(file);
//       setFormData((prev) => ({ ...prev, avatar: file }));
//     }
//   };

//   const handleImagesChange = (e) => {
//     const files = Array.from(e.target.files);
//     // Deduplicate files based on name and size
//     const uniqueFiles = Array.from(
//       new Map(files.map((file) => [`${file.name}-${file.size}`, file])).values()
//     );
//     setAdditionalImages(uniqueFiles);
//     setFormData((prev) => ({ ...prev, images: uniqueFiles }));
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       // Prepare the data to send to the API
//       const updatedData = {
//         accountId: id,
//         name: formData.name || profile.name,
//         email: formData.email || profile.email,
//         password: formData.password || profile.password, // Use existing password if not changed
//         description: formData.description || profile.description,
//         birthday: formData.birthday
//           ? formatDateForApi(formData.birthday)
//           : profile.birthday, // Format birthday for API
//         phone: formData.phone || profile.phone,
//         height: formData.height || profile.height,
//         weight: formData.weight || profile.weight,
//         avatar: formData.avatar || null, // Send null if no new avatar
//         images: formData.images.length > 0 ? formData.images : [], // Send empty array if no new images
//       };

//       console.log("Data being sent to API:", updatedData);

//       const response = await ProfileService.updateProfile(id, updatedData);
//       console.log("Update response:", response);
//       await fetchProfile();
//       setIsEditing(false);
//       setAvatarFile(null);
//       setAdditionalImages([]);
//       setError(null);
//     } catch (err) {
//       setError(err.message || "Error updating profile");
//     }
//   };

//   const toggleEditMode = () => {
//     if (!isProfileOwner) {
//       setError("You do not have permission to edit this profile.");
//       return;
//     }
//     setIsEditing(!isEditing);
//     setError(null);
//   };

//   const getAvatarUrl = () => {
//     if (avatarFile) {
//       return URL.createObjectURL(avatarFile);
//     }
//     if (profile && profile.images) {
//       const avatarImage = profile.images.find((img) => img.isAvatar);
//       return avatarImage
//         ? avatarImage.urlImage
//         : "https://cdn.pixabay.com/photo/2023/12/04/13/23/ai-generated-8429472_1280.png";
//     }
//     return "https://cdn.pixabay.com/photo/2023/12/04/13/23/ai-generated-8429472_1280.png";
//   };

//   // Deduplicate images based on urlImage before rendering
//   const getUniqueImages = (images) => {
//     if (!images || images.length === 0) return [];
//     const seenUrls = new Set();
//     return images.filter((image) => {
//       if (seenUrls.has(image.urlImage)) {
//         return false;
//       }
//       seenUrls.add(image.urlImage);
//       return true;
//     });
//   };

//   if (loading) return <div></div>;
//   if (error)
//     return (
//       <div>
//         Lỗi: {error}{" "}
//         <Box sx={{ width: "100%" }}>
//           <LinearProgress />
//         </Box>
//       </div>
//     );
//   if (!profile) return <div>Không tìm thấy profile </div>;

//   const uniqueImages = getUniqueImages(profile.images);

//   return (
//     <div className="profile-page">
//       <div className="profile-container">
//         <Container>
//           <div className="profile-header">
//             <Row className="align-items-center">
//               <Col xs={4} className="left-side">
//                 {isEditing ? (
//                   <>
//                     <img
//                       src={getAvatarUrl()}
//                       alt={profile.name}
//                       className="profile-image"
//                     />
//                     <Form.Group controlId="avatar" className="mt-2">
//                       <Form.Label>Change Avatar (Optional)</Form.Label>
//                       <Form.Control
//                         type="file"
//                         accept="image/*"
//                         onChange={handleAvatarChange}
//                       />
//                     </Form.Group>
//                     <Form.Group controlId="images" className="mt-2">
//                       <Form.Label>Add More Images (Optional)</Form.Label>
//                       <Form.Control
//                         type="file"
//                         accept="image/*"
//                         multiple
//                         onChange={handleImagesChange}
//                       />
//                     </Form.Group>
//                   </>
//                 ) : (
//                   <img
//                     src={getAvatarUrl()}
//                     alt={profile.name}
//                     className="profile-image"
//                   />
//                 )}
//                 <div className="action-buttons">
//                   {isEditing ? (
//                     <>
//                       <Button
//                         variant="success"
//                         className="btn text-white me-2"
//                         onClick={handleSubmit}
//                       >
//                         Save
//                       </Button>
//                       <Button
//                         variant="secondary"
//                         className="btn text-white"
//                         onClick={toggleEditMode}
//                       >
//                         Cancel
//                       </Button>
//                     </>
//                   ) : (
//                     isProfileOwner && (
//                       <Button
//                         className="btn text-white"
//                         onClick={toggleEditMode}
//                       >
//                         Edit profile
//                       </Button>
//                     )
//                   )}
//                 </div>
//               </Col>
//               <Col xs={8}>
//                 <div className="username">
//                   {isEditing ? (
//                     <Form.Group controlId="name">
//                       <Form.Label>Name</Form.Label>
//                       <Form.Control
//                         type="text"
//                         name="name"
//                         value={formData.name}
//                         onChange={handleInputChange}
//                       />
//                     </Form.Group>
//                   ) : (
//                     <h3 className="name">{profile.name}</h3>
//                   )}
//                 </div>

//                 <div className="profile-info">
//                   {isEditing ? (
//                     <Form.Group controlId="description">
//                       <Form.Label>Description</Form.Label>
//                       <Form.Control
//                         as="textarea"
//                         name="description"
//                         value={formData.description}
//                         onChange={handleInputChange}
//                       />
//                     </Form.Group>
//                   ) : (
//                     <p className="description">
//                       {profile.description || "N/A"}
//                     </p>
//                   )}

//                   <div className="status-badges">
//                     {profile.isActive && (
//                       <Badge className="status-badge active">Active</Badge>
//                     )}
//                     {profile.onTask && (
//                       <Badge className="status-badge on-task">On Task</Badge>
//                     )}
//                     {profile.leader && (
//                       <Badge className="status-badge leader">
//                         <Crown size={14} /> Team Leader
//                       </Badge>
//                     )}
//                   </div>

//                   <div className="details-grid">
//                     <div className="detail-item">
//                       <Mail size={16} />
//                       {isEditing ? (
//                         <Form.Control
//                           type="email"
//                           name="email"
//                           value={formData.email}
//                           onChange={handleInputChange}
//                         />
//                       ) : (
//                         <span>{profile.email}</span>
//                       )}
//                     </div>
//                     <div className="detail-item">
//                       <Phone size={16} />
//                       {isEditing ? (
//                         <Form.Control
//                           type="text"
//                           name="phone"
//                           value={formData.phone}
//                           onChange={handleInputChange}
//                         />
//                       ) : (
//                         <span>{profile.phone || "N/A"}</span>
//                       )}
//                     </div>
//                     <div className="detail-item">
//                       <Calendar size={16} />
//                       {isEditing ? (
//                         <Form.Control
//                           type="date"
//                           name="birthday"
//                           value={formData.birthday}
//                           onChange={handleInputChange}
//                         />
//                       ) : (
//                         <span>{profile.birthday}</span>
//                       )}
//                     </div>
//                     <div className="detail-item">
//                       <Activity size={16} />
//                       <span>{profile.taskQuantity || 0} Tasks</span>
//                     </div>
//                     <div className="detail-item">
//                       <Ruler size={16} />
//                       {isEditing ? (
//                         <Form.Control
//                           type="text"
//                           name="height"
//                           value={formData.height}
//                           onChange={handleInputChange}
//                         />
//                       ) : (
//                         <span>{profile.height || "N/A"}</span>
//                       )}
//                     </div>
//                     <div className="detail-item">
//                       <Weight size={16} />
//                       {isEditing ? (
//                         <Form.Control
//                           type="text"
//                           name="weight"
//                           value={formData.weight}
//                           onChange={handleInputChange}
//                         />
//                       ) : (
//                         <span>{profile.weight || "N/A"}</span>
//                       )}
//                     </div>
//                     <div className="detail-item">
//                       <Star size={16} />
//                       <span>{profile.averageStar || "N/A"} Stars</span>
//                     </div>
//                     <div className="detail-item">
//                       <DollarSign size={16} />
//                       <span>Salary Index: {profile.salaryIndex || "N/A"}</span>
//                     </div>
//                     {isEditing && (
//                       <div className="detail-item">
//                         <Code size={16} />
//                         <Form.Control
//                           type="password"
//                           name="password"
//                           value={formData.password}
//                           onChange={handleInputChange}
//                           placeholder="Enter new password (optional)"
//                         />
//                       </div>
//                     )}
//                   </div>
//                 </div>
//               </Col>
//             </Row>
//           </div>

//           <div className="tabs">
//             <div
//               className={`tab ${activeTab === "posts" ? "active" : ""}`}
//               onClick={() => setActiveTab("posts")}
//             >
//               <Grid size={12} className="icon" /> Posts
//             </div>
//           </div>

//           {/* Images section below POSTS tab using Ant Design Image.PreviewGroup */}
//           {!isEditing && uniqueImages.length > 0 ? (
//             <div className="additional-images mt-3">
//               <h5>Images</h5>
//               <div className="image-gallery">
//                 <Image.PreviewGroup
//                   preview={{
//                     onChange: (current, prev) =>
//                       console.log(
//                         `Current index: ${current}, Previous index: ${prev}`
//                       ),
//                   }}
//                 >
//                   {uniqueImages.map((image, index) => (
//                     <Image
//                       key={index}
//                       width={150}
//                       src={image.urlImage}
//                       alt={`Profile Image ${index + 1}`}
//                     />
//                   ))}
//                 </Image.PreviewGroup>
//               </div>
//             </div>
//           ) : (
//             <div className="empty-state">
//               <div className="camera-icon">
//                 <Camera size={24} />
//               </div>
//               <h2>Share Photos</h2>
//               <p>When you share photos, they will appear on your profile.</p>
//               <a href="#" className="share-button">
//                 Share your first photo
//               </a>
//             </div>
//           )}
//         </Container>
//       </div>
//     </div>
//   );
// };

// export default ProfilePage;

//---------------------------------------------------------------------------------------------------//

import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Container, Button, Badge, Form } from "react-bootstrap";
import {
  Settings,
  Camera,
  Grid,
  Bookmark,
  PersonStanding,
  Mail,
  Phone,
  Cake,
  Lock,
  CheckSquare,
  Crown,
  Ruler,
  Scale,
  Star,
  Wallet,
} from "lucide-react";
import ProfileService from "../../services/ProfileService/ProfileService.js";
import "bootstrap/dist/css/bootstrap.min.css";
import "../../styles/ProfilePage.scss";
import Box from "@mui/material/Box";
import LinearProgress from "@mui/material/LinearProgress";
import { Image } from "antd";
import { jwtDecode } from "jwt-decode";

// Hàm lấy thông tin người dùng hiện tại từ token, bao gồm ID và role
const getCurrentUserInfo = () => {
  try {
    const accessToken = localStorage.getItem("accessToken");
    if (!accessToken) {
      console.warn("Không tìm thấy accessToken trong localStorage");
      return null;
    }
    const decodedToken = jwtDecode(accessToken);
    console.log("Decoded JWT token:", decodedToken);
    const userId =
      decodedToken.Id ||
      decodedToken.id ||
      decodedToken.sub ||
      decodedToken.userId;
    const role = decodedToken.role;
    if (!userId || !role) {
      console.warn("Không tìm thấy Id hoặc role trong decoded JWT token");
      return null;
    }
    return { userId, role };
  } catch (error) {
    console.error("Lỗi khi decode JWT token:", error);
    return null;
  }
};

// Định dạng ngày hiển thị
const formatDateForDisplay = (dateString) => {
  if (!dateString) return "N/A";
  // Kiểm tra định dạng YYYY-MM-DD
  const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
  if (dateRegex.test(dateString)) {
    const [year, month, day] = dateString.split("-");
    return `${day}/${month}/${year}`;
  }
  // Nếu không đúng định dạng, thử parse bằng Date
  const date = new Date(dateString);
  if (!isNaN(date.getTime())) {
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  }
  return "N/A";
};

// Định dạng ngày cho API
const formatDateForApi = (dateString) => {
  if (!dateString) return null;
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return null;
  return date.toISOString().split("T")[0];
};

const ProfilePage = () => {
  const { id } = useParams();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("posts");
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({});
  const [avatarFile, setAvatarFile] = useState(null);
  const [additionalImages, setAdditionalImages] = useState([]);
  // State để lưu feedback
  const [feedbacks, setFeedbacks] = useState([]);
  const [feedbackLoading, setFeedbackLoading] = useState(true);
  // State để kiểm tra xem profile có phải Cosplayer không
  const [isCosplayer, setIsCosplayer] = useState(false);

  const currentUserInfo = getCurrentUserInfo();
  const normalizedId = String(id).trim();
  const normalizedCurrentUserId = currentUserInfo
    ? String(currentUserInfo.userId).trim()
    : null;
  const isProfileOwner =
    normalizedCurrentUserId && normalizedId === normalizedCurrentUserId;

  // Lấy dữ liệu hồ sơ và kiểm tra role Cosplayer
  const fetchProfileAndCheckRole = async () => {
    try {
      // Lấy thông tin profile
      const profileData = await ProfileService.getProfileById(id);
      setProfile(profileData);

      // Lấy danh sách Cosplayer
      const cosplayerAccounts = await ProfileService.getAccountsByRoleId("R004");
      // Kiểm tra xem accountId có trong danh sách Cosplayer không
      const isCosplayerAccount = cosplayerAccounts.some(
        (account) => account.accountId === id
      );
      setIsCosplayer(isCosplayerAccount);

      let formattedBirthday = "";
      if (profileData.birthday) {
        const date = new Date(profileData.birthday);
        if (!isNaN(date.getTime())) {
          formattedBirthday = date.toISOString().split("T")[0];
        }
      }
      setFormData({
        accountId: id,
        name: profileData.name || "",
        email: profileData.email || "",
        password: profileData.password || "",
        description: profileData.description || "",
        birthday: formattedBirthday,
        phone: profileData.phone || "",
        height: profileData.height || "",
        weight: profileData.weight || "",
        avatar: null,
        images: [],
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Lấy dữ liệu feedback theo cosplayerId
  const fetchFeedbacks = async () => {
    try {
      setFeedbackLoading(true);
      const data = await ProfileService.getFeedbackByCosplayerId(id);
      setFeedbacks(data);
    } catch (err) {
      console.error("Lỗi khi lấy feedback:", err);
      setError("Failed to load feedbacks");
    } finally {
      setFeedbackLoading(false);
    }
  };

  // Gọi API khi component mount hoặc id thay đổi
  useEffect(() => {
    fetchProfileAndCheckRole();
  }, [id]);

  // Gọi API feedback khi xác định profile là Cosplayer
  useEffect(() => {
    if (isCosplayer) {
      fetchFeedbacks();
    }
  }, [isCosplayer]);

  // Xử lý thay đổi input
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Xử lý thay đổi avatar
  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAvatarFile(file);
      setFormData((prev) => ({ ...prev, avatar: file }));
    }
  };

  // Xử lý thay đổi ảnh bổ sung
  const handleImagesChange = (e) => {
    const files = Array.from(e.target.files);
    const uniqueFiles = Array.from(
      new Map(files.map((file) => [`${file.name}-${file.size}`, file])).values()
    );
    setAdditionalImages(uniqueFiles);
    setFormData((prev) => ({ ...prev, images: uniqueFiles }));
  };

  // Gửi dữ liệu cập nhật
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const updatedData = {
        accountId: id,
        name: formData.name || profile.name,
        email: formData.email || profile.email,
        password: formData.password || profile.password,
        description: formData.description || profile.description,
        birthday: formData.birthday
          ? formatDateForApi(formData.birthday)
          : profile.birthday,
        phone: formData.phone || profile.phone,
        height: formData.height || profile.height,
        weight: formData.weight || profile.weight,
        avatar: formData.avatar || null,
        images: formData.images.length > 0 ? formData.images : [],
      };
      console.log("Dữ liệu gửi tới API:", updatedData);
      const response = await ProfileService.updateProfile(id, updatedData);
      console.log("Phản hồi cập nhật:", response);
      await fetchProfileAndCheckRole();
      setIsEditing(false);
      setAvatarFile(null);
      setAdditionalImages([]);
      setError(null);
    } catch (err) {
      setError(err.message || "Error updating profile");
    }
  };

  // Chuyển đổi chế độ chỉnh sửa
  const toggleEditMode = () => {
    if (!isProfileOwner) {
      setError("You do not have permission to edit this profile.");
      return;
    }
    setIsEditing(!isEditing);
    setError(null);
  };

  // Lấy URL avatar
  const getAvatarUrl = () => {
    if (avatarFile) {
      return URL.createObjectURL(avatarFile);
    }
    if (profile && profile.images) {
      const avatarImage = profile.images.find((img) => img.isAvatar);
      return avatarImage
        ? avatarImage.urlImage
        : "https://cdn.pixabay.com/photo/2023/12/04/13/23/ai-generated-8429472_1280.png";
    }
    return "https://cdn.pixabay.com/photo/2023/12/04/13/23/ai-generated-8429472_1280.png";
  };

  // Lấy danh sách ảnh duy nhất
  const getUniqueImages = (images) => {
    if (!images || images.length === 0) return [];
    const seenUrls = new Set();
    return images.filter((image) => {
      if (seenUrls.has(image.urlImage)) {
        return false;
      }
      seenUrls.add(image.urlImage);
      return true;
    });
  };

  // Tính tổng số sao trung bình và thống kê số lần nhận sao
  const calculateFeedbackStats = () => {
    if (!feedbacks || feedbacks.length === 0) {
      return {
        averageStar: 0,
        starCounts: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
      };
    }

    const totalStars = feedbacks.reduce((sum, fb) => sum + fb.star, 0);
    const averageStar = (totalStars / feedbacks.length).toFixed(1);

    const starCounts = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    feedbacks.forEach((fb) => {
      starCounts[fb.star] = (starCounts[fb.star] || 0) + 1;
    });

    return { averageStar, starCounts };
  };

  const { averageStar, starCounts } = calculateFeedbackStats();

  if (loading) return <div></div>;
  if (error)
    return (
      <div className="error-message">
        Error: {error}{" "}
        <Box sx={{ width: "100%" }}>
          <LinearProgress />
        </Box>
      </div>
    );
  if (!profile) return <div className="error-message">Profile not found</div>;

  const uniqueImages = getUniqueImages(profile.images);

  return (
    <div className="profile-page">
      <div className="profile-container" style={{ maxWidth: "1200px" }}>
        <Container>
          {/* Tabs điều hướng */}
          <div className="tabs">
            <div
              className={`tab ${activeTab === "posts" ? "active" : ""}`}
              onClick={() => setActiveTab("posts")}
            >
              <Grid size={12} className="icon" /> Profile
            </div>
          </div>

          {/* Header hồ sơ */}
          <div className="profile-header">
            <div className="left-side">
              {isEditing ? (
                <>
                  <div className="avatar-wrapper">
                    <img
                      src={getAvatarUrl()}
                      alt={profile.name}
                      className="profile-image"
                    />
                  </div>
                  <Form.Group controlId="avatar" className="mt-3">
                    <Form.Label className="form-label">Change Avatar (Optional)</Form.Label>
                    <Form.Control
                      type="file"
                      accept="image/*"
                      onChange={handleAvatarChange}
                      className="form-control-custom"
                    />
                  </Form.Group>
                  <Form.Group controlId="images" className="mt-3">
                    <Form.Label className="form-label">Add Images (Optional)</Form.Label>
                    <Form.Control
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handleImagesChange}
                      className="form-control-custom"
                    />
                  </Form.Group>
                </>
              ) : (
                <div className="avatar-wrapper">
                  <img
                    src={getAvatarUrl()}
                    alt={profile.name}
                    className="profile-image"
                  />
                </div>
              )}
              <div className="action-buttons">
                {isEditing ? (
                  <>
                    <Button
                      variant="success"
                      className="btn-custom btn-save"
                      onClick={handleSubmit}
                    >
                      Save
                    </Button>
                    <Button
                      variant="secondary"
                      className="btn-custom btn-cancel"
                      onClick={toggleEditMode}
                    >
                      Cancel
                    </Button>
                  </>
                ) : (
                  isProfileOwner && (
                    <Button
                      className="btn-custom btn-edit"
                      onClick={toggleEditMode}
                    >
                      Edit Profile
                    </Button>
                  )
                )}
              </div>
            </div>
            <div className="profile-info">
              <div className="username">
                {isEditing ? (
                  <Form.Group controlId="name">
                    <Form.Label className="form-label">Name</Form.Label>
                    <Form.Control
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="form-control-custom"
                    />
                  </Form.Group>
                ) : (
                  <h3 className="name">{profile.name}</h3>
                )}
              </div>

              <div className="description-card">
                {isEditing ? (
                  <Form.Group controlId="description">
                    <Form.Label className="form-label">Description</Form.Label>
                    <Form.Control
                      as="textarea"
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      className="form-control-custom textarea-custom"
                    />
                  </Form.Group>
                ) : (
                  <p className="description">{profile.description || "N/A"}</p>
                )}
              </div>

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

              <div className="details-grid" style={{ gridTemplateColumns: "repeat(2, 1fr)" }}>
                <div className="detail-item" style={{ minWidth: "300px" }}>
                  <Mail size={20} />
                  {isEditing ? (
                    <Form.Control
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="form-control-custom"
                    />
                  ) : (
                    <span style={{ whiteSpace: "nowrap", overflow: "visible" }}>{profile.email}</span>
                  )}
                </div>
                <div className="detail-item" style={{ minWidth: "300px" }}>
                  <Phone size={20} />
                  {isEditing ? (
                    <Form.Control
                      type="text"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="form-control-custom"
                    />
                  ) : (
                    <span>{profile.phone || "N/A"}</span>
                  )}
                </div>
                <div className="detail-item" style={{ minWidth: "300px" }}>
                  <Cake size={20} />
                  {isEditing ? (
                    <Form.Control
                      type="date"
                      name="birthday"
                      value={formData.birthday}
                      onChange={handleInputChange}
                      className="form-control-custom"
                    />
                  ) : (
                    <span>{formatDateForDisplay(profile.birthday)}</span>
                  )}
                </div>
                <div className="detail-item" style={{ minWidth: "300px" }}>
                  <CheckSquare size={20} />
                  <span>{profile.taskQuantity || 0} Tasks</span>
                </div>
                <div className="detail-item" style={{ minWidth: "300px" }}>
                  <Ruler size={20} />
                  {isEditing ? (
                    <Form.Control
                      type="text"
                      name="height"
                      value={formData.height}
                      onChange={handleInputChange}
                      className="form-control-custom"
                    />
                  ) : (
                    <span>{profile.height || "N/A"}</span>
                  )}
                </div>
                <div className="detail-item" style={{ minWidth: "300px" }}>
                  <Scale size={20} />
                  {isEditing ? (
                    <Form.Control
                      type="text"
                      name="weight"
                      value={formData.weight}
                      onChange={handleInputChange}
                      className="form-control-custom"
                    />
                  ) : (
                    <span>{profile.weight || "N/A"}</span>
                  )}
                </div>
                <div className="detail-item" style={{ minWidth: "300px" }}>
                  <Star size={20} />
                  <span>{profile.averageStar || "N/A"} Stars</span>
                </div>
                <div className="detail-item" style={{ minWidth: "300px" }}>
                  <Wallet size={20} />
                  <span>Salary Index: {profile.salaryIndex || "N/A"}</span>
                </div>
                {isEditing && (
                  <div className="detail-item" style={{ minWidth: "300px" }}>
                    <Lock size={20} />
                    <Form.Control
                      type="password"
                      name="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      placeholder="Enter new password (optional)"
                      className="form-control-custom"
                    />
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Gallery hoặc trạng thái trống */}
          {!isEditing && uniqueImages.length > 0 ? (
            <div className="additional-images">
              <h5>Images</h5>
              <div className="image-gallery">
                <Image.PreviewGroup
                  preview={{
                    onChange: (current, prev) =>
                      console.log(
                        `Current index: ${current}, Previous index: ${prev}`
                      ),
                  }}
                >
                  {uniqueImages.map((image, index) => (
                    <Image
                      key={index}
                      src={image.urlImage}
                      alt={`Profile Image ${index + 1}`}
                      className="gallery-image"
                    />
                  ))}
                </Image.PreviewGroup>
              </div>
            </div>
          ) : (
            <div className="empty-state">
              <div className="camera-icon">
                <Camera size={24} />
              </div>
              <h2>Share Photos</h2>
              <p>Your photos will appear on your profile once shared.</p>
              <a href="#" className="share-button">
                Share Your First Photo
              </a>
            </div>
          )}

          {/* Phần hiển thị feedback, chỉ hiển thị nếu profile là Cosplayer */}
          {isCosplayer && (
            <div className="feedback-section">
              <h5>Feedback</h5>
              {feedbackLoading ? (
                <Box sx={{ width: "100%" }}>
                  <LinearProgress />
                </Box>
              ) : feedbacks.length === 0 ? (
                <div className="empty-state">
                  <div className="camera-icon">
                    <Star size={24} />
                  </div>
                  <h2>No Feedback Yet</h2>
                  <p>This cosplayer has not received any feedback.</p>
                </div>
              ) : (
                <>
                  {/* Hiển thị tổng số sao trung bình và thống kê */}
                  <div className="feedback-stats">
                    <div className="average-star">
                      <Star size={24} className="star-icon" />
                      <span>{averageStar} Stars (Average)</span>
                    </div>
                    <div className="star-distribution">
                      {[5, 4, 3, 2, 1].map((star) => (
                        <div key={star} className="star-row">
                          <span>{star} Star{star > 1 ? "s" : ""}</span>
                          <div className="progress-bar">
                            <div
                              className="progress-fill"
                              style={{
                                width: `${
                                  (starCounts[star] / feedbacks.length) * 100
                                }%`,
                              }}
                            ></div>
                          </div>
                          <span>{starCounts[star]} votes</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Danh sách các feedback */}
                  <div className="feedback-list">
                    {feedbacks.map((feedback, index) => (
                      <div key={index} className="feedback-item">
                        <div className="feedback-header">
                          <span className="character-name">
                            Cosplayed as {feedback.characterName}
                          </span>
                          <div className="star-rating">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                size={16}
                                className={
                                  i < feedback.star ? "filled-star" : "empty-star"
                                }
                              />
                            ))}
                          </div>
                        </div>
                        <p className="feedback-description">
                          {feedback.description}
                        </p>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
          )}
        </Container>
      </div>
    </div>
  );
};

export default ProfilePage;