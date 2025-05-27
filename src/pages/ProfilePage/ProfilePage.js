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

// import React, { useState, useEffect, useCallback } from "react";
// import { useParams } from "react-router-dom";
// import { Container, Button, Badge, Form } from "react-bootstrap";
// import {
//   Camera,
//   Grid,
//   Mail,
//   Phone,
//   Cake,
//   Lock,
//   CheckSquare,
//   Crown,
//   Ruler,
//   Scale,
//   Star,
//   Wallet,
// } from "lucide-react";
// import ProfileService from "../../services/ProfileService/ProfileService.js";
// import "bootstrap/dist/css/bootstrap.min.css";
// import "../../styles/ProfilePage.scss";
// import Box from "@mui/material/Box";
// import LinearProgress from "@mui/material/LinearProgress";
// import Skeleton from "@mui/material/Skeleton";
// import { Image } from "antd";
// import { jwtDecode } from "jwt-decode";

// // Hàm lấy thông tin người dùng hiện tại từ token
// const getCurrentUserInfo = () => {
//   try {
//     const accessToken = localStorage.getItem("accessToken");
//     if (!accessToken) {
//       console.warn("No accessToken found in localStorage");
//       return null;
//     }
//     const decodedToken = jwtDecode(accessToken);
//     console.log("Decoded JWT token:", decodedToken);
//     const userId =
//       decodedToken.Id ||
//       decodedToken.id ||
//       decodedToken.sub ||
//       decodedToken.userId;
//     const role = decodedToken.role;
//     if (!userId || !role) {
//       console.warn("No Id or role found in decoded JWT token");
//       return null;
//     }
//     return { userId, role };
//   } catch (error) {
//     console.error("Error decoding JWT token:", error);
//     return null;
//   }
// };

// // Hàm định dạng ngày tháng
// const formatDate = (dateString, forApi = false) => {
//   if (!dateString) return forApi ? "" : "N/A";

//   const dateRegexDDMMYYYY = /^(\d{2})\/(\d{2})\/(\d{4})$/;
//   const dateRegexYYYYMMDD = /^\d{4}-\d{2}-\d{2}$/;

//   let date;
//   if (dateRegexDDMMYYYY.test(dateString)) {
//     const [day, month, year] = dateString.split("/");
//     date = new Date(`${year}-${month}-${day}`);
//   } else if (dateRegexYYYYMMDD.test(dateString)) {
//     date = new Date(dateString);
//   } else {
//     date = new Date(dateString);
//   }

//   if (isNaN(date.getTime())) return forApi ? "" : "N/A";

//   if (forApi) {
//     return date.toISOString().split("T")[0]; // YYYY-MM-DD
//   }

//   const day = String(date.getDate()).padStart(2, "0");
//   const month = String(date.getMonth() + 1).padStart(2, "0");
//   const year = date.getFullYear();
//   return `${day}/${month}/${year}`; // DD/MM/YYYY
// };

// // Hàm kiểm tra định dạng số điện thoại
// const validatePhoneNumber = (phone) => {
//   const phoneRegex = /^0\d{8,10}$/;
//   return phoneRegex.test(phone);
// };

// const ProfilePage = () => {
//   const { id } = useParams();
//   const [profile, setProfile] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [activeTab, setActiveTab] = useState("posts");
//   const [isEditing, setIsEditing] = useState(false);
//   const [formData, setFormData] = useState({});
//   const [avatarFile, setAvatarFile] = useState(null);
//   const [additionalImages, setAdditionalImages] = useState([]);
//   const [feedbacks, setFeedbacks] = useState([]);
//   const [feedbackLoading, setFeedbackLoading] = useState(false);
//   const [isCosplayer, setIsCosplayer] = useState(false);

//   const currentUserInfo = getCurrentUserInfo();
//   const normalizedId = String(id).trim();
//   const normalizedCurrentUserId = currentUserInfo
//     ? String(currentUserInfo.userId).trim()
//     : null;
//   const isProfileOwner =
//     normalizedCurrentUserId && normalizedId === normalizedCurrentUserId;
//   const userRole = currentUserInfo?.role;

//   // Hàm lấy dữ liệu hồ sơ và kiểm tra vai trò
//   const fetchProfileAndCheckRole = useCallback(async () => {
//     try {
//       setLoading(true);
//       const profileData = await ProfileService.getProfileById(id);
//       setProfile(profileData);

//       const cosplayerAccounts = await ProfileService.getAccountsByRoleId("R004");
//       const isCosplayerAccount = cosplayerAccounts.some(
//         (account) => account.accountId === id
//       );
//       setIsCosplayer(isCosplayerAccount);

//       setFormData({
//         accountId: id,
//         name: profileData.name || "",
//         email: profileData.email || "",
//         password: "N/A", // Không lưu password thật
//         description: profileData.description || "",
//         birthday: profileData.birthday ? formatDate(profileData.birthday) : "",
//         phone: profileData.phone || "",
//         height: profileData.height || "",
//         weight: profileData.weight || "",
//         avatar: null,
//         images: [],
//       });
//     } catch (err) {
//       setError(err.message || "Failed to load profile");
//     } finally {
//       setLoading(false);
//     }
//   }, [id]);

//   // Hàm lấy feedback
//   const fetchFeedbacks = useCallback(async () => {
//     try {
//       setFeedbackLoading(true);
//       const data = await ProfileService.getFeedbackByCosplayerId(id);
//       setFeedbacks(Array.isArray(data) ? data : []);
//     } catch (err) {
//       console.error("Error fetching feedbacks:", err);
//       setError("Failed to load feedbacks");
//     } finally {
//       setFeedbackLoading(false);
//     }
//   }, [id]);

//   useEffect(() => {
//     fetchProfileAndCheckRole();
//   }, [fetchProfileAndCheckRole]);

//   useEffect(() => {
//     if (isCosplayer) {
//       fetchFeedbacks();
//     }
//   }, [isCosplayer, fetchFeedbacks]);

//   // Xử lý thay đổi input
//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({ ...prev, [name]: value }));
//   };

//   // Xử lý thay đổi avatar
//   const handleAvatarChange = (e) => {
//     const file = e.target.files[0];
//     if (file && file.size <= 5 * 1024 * 1024) {
//       setAvatarFile(file);
//       setFormData((prev) => ({ ...prev, avatar: file }));
//     } else if (file) {
//       setError("Avatar file size must be less than 5MB");
//     }
//   };

//   // Xử lý thay đổi danh sách hình ảnh (chỉ cho Cosplayer)
//   const handleImagesChange = (e) => {
//     const files = Array.from(e.target.files).filter(
//       (file) => file.size <= 5 * 1024 * 1024
//     );
//     if (files.length !== e.target.files.length) {
//       setError("Some images were not added due to size limit (5MB per image)");
//     }
//     const uniqueFiles = Array.from(
//       new Map(files.map((file) => [`${file.name}-${file.size}`, file])).values()
//     );
//     setAdditionalImages(uniqueFiles);
//     setFormData((prev) => ({ ...prev, images: uniqueFiles }));
//   };

//   // Xử lý submit form
//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     // Chỉ validate phone khi người dùng chỉnh sửa trường phone
//     if (formData.phone && formData.phone !== profile.phone && !validatePhoneNumber(formData.phone)) {
//       setError("Phone number must start with 0 and be 9-11 digits long");
//       return;
//     }
//     try {
//       const updatedData = {
//         accountId: id,
//         name: profile.name, // read-only
//         email: profile.email, // read-only
//         password: profile.password || "", // read-only
//         description: formData.description || profile.description || "",
//         birthday: formData.birthday ? formatDate(formData.birthday, true) : profile.birthday || "",
//         phone: formData.phone || profile.phone || "",
//         height: userRole === "Cosplayer" ? (formData.height || profile.height || "") : profile.height || "",
//         weight: userRole === "Cosplayer" ? (formData.weight || profile.weight || "") : profile.weight || "",
//         avatar: formData.avatar || null,
//         images: userRole === "Cosplayer" ? (formData.images.length > 0 ? formData.images : []) : [],
//         userName: profile.name, // Match API requirement
//       };
//       console.log("Data sent to API:", updatedData);
//       const response = await ProfileService.updateProfile(id, updatedData);
//       console.log("Update response:", response);
//       await fetchProfileAndCheckRole();
//       setIsEditing(false);
//       setAvatarFile(null);
//       setAdditionalImages([]);
//       setError(null);
//     } catch (err) {
//       setError(err.message || "Error updating profile");
//     }
//   };

//   // Chuyển đổi chế độ chỉnh sửa
//   const toggleEditMode = () => {
//     if (!isProfileOwner) {
//       setError("You do not have permission to edit this profile.");
//       return;
//     }
//     setIsEditing(!isEditing);
//     setError(null);
//   };

//   // Lấy URL avatar
//   const getAvatarUrl = () => {
//     if (avatarFile) {
//       return URL.createObjectURL(avatarFile);
//     }
//     if (profile?.images?.length) {
//       const avatarImage = profile.images.find((img) => img.isAvatar);
//       return avatarImage
//         ? avatarImage.urlImage
//         : "https://cdn.pixabay.com/photo/2023/12/04/13/23/ai-generated-8429472_1280.png";
//     }
//     return "https://cdn.pixabay.com/photo/2023/12/04/13/23/ai-generated-8429472_1280.png";
//   };

//   // Lấy danh sách hình ảnh duy nhất (loại bỏ avatar)
//   const getUniqueImages = (images) => {
//     if (!Array.isArray(images) || images.length === 0) return [];
//     const seenUrls = new Set();
//     return images.filter((image) => {
//       if (!image?.urlImage || seenUrls.has(image.urlImage) || image.isAvatar) {
//         return false;
//       }
//       seenUrls.add(image.urlImage);
//       return true;
//     });
//   };

//   // Tính toán thống kê feedback
//   const calculateFeedbackStats = () => {
//     if (!Array.isArray(feedbacks) || feedbacks.length === 0) {
//       return {
//         averageStar: 0,
//         starCounts: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
//         totalVotes: 0,
//       };
//     }

//     const totalStars = feedbacks.reduce((sum, fb) => sum + (fb.star || 0), 0);
//     const averageStar = (totalStars / feedbacks.length).toFixed(1);
//     const starCounts = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
//     feedbacks.forEach((fb) => {
//       if (fb.star >= 1 && fb.star <= 5) {
//         starCounts[fb.star] = (starCounts[fb.star] || 0) + 1;
//       }
//     });
//     const totalVotes = feedbacks.length;

//     return { averageStar, starCounts, totalVotes };
//   };

//   const { averageStar, starCounts, totalVotes } = calculateFeedbackStats();

//   // Hiển thị skeleton khi loading
//   if (loading) {
//     return (
//       <div className="profile-page">
//         <Container>
//           <Skeleton variant="rectangular" width="100%" height={200} />
//           <Skeleton variant="text" width="60%" height={40} />
//           <Skeleton variant="circular" width={180} height={180} />
//           <Skeleton variant="text" width="80%" height={30} />
//           <Skeleton variant="rectangular" width="100%" height={100} />
//         </Container>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="error-message">
//         Error: {error}
//         <Box sx={{ width: "100%" }}>
//           <LinearProgress />
//         </Box>
//       </div>
//     );
//   }

//   if (!profile) {
//     return <div className="error-message">Profile not found</div>;
//   }

//   const uniqueImages = getUniqueImages(profile.images);

//   // Xác định các trường hiển thị trong details-grid
//   const getVisibleFields = () => {
//     if (isProfileOwner && userRole === "Customer") {
//       return ["email", "phone", "birthday"];
//     }
//     return ["email", "phone", "birthday", "taskQuantity", "height", "weight", "averageStar", "salaryIndex"];
//   };

//   const visibleFields = getVisibleFields();

//   return (
//     <div className="profile-page">
//       <div className="profile-container" style={{ maxWidth: "1200px" }}>
//         <Container>
//           <div className="tabs">
//             <div
//               className={`tab ${activeTab === "posts" ? "active" : ""}`}
//               onClick={() => setActiveTab("posts")}
//             >
//               <Grid size={12} className="icon" /> Profile
//             </div>
//           </div>

//           <div className="profile-header">
//             <div className="left-side">
//               {isEditing ? (
//                 <>
//                   <div className="avatar-wrapper">
//                     <img
//                       src={getAvatarUrl()}
//                       alt={profile.name}
//                       className="profile-image"
//                     />
//                   </div>
//                   <Form.Group controlId="avatar" className="mt-3">
//                     <Form.Label className="form-label">Change Avatar (Optional)</Form.Label>
//                     <Form.Control
//                       type="file"
//                       accept="image/*"
//                       onChange={handleAvatarChange}
//                       className="form-control-custom"
//                     />
//                   </Form.Group>
//                   {userRole === "Cosplayer" && isEditing && uniqueImages.length > 0 && (
//                     <Form.Group controlId="images" className="mt-3">
//                       <Form.Label className="form-label">Add Images (Optional)</Form.Label>
//                       <Form.Control
//                         type="file"
//                         accept="image/*"
//                         multiple
//                         onChange={handleImagesChange}
//                         className="form-control-custom"
//                       />
//                     </Form.Group>
//                   )}
//                 </>
//               ) : (
//                 <div className="avatar-wrapper">
//                   <img
//                     src={getAvatarUrl()}
//                     alt={profile.name}
//                     className="profile-image"
//                   />
//                 </div>
//               )}
//               <div className="action-buttons">
//                 {isEditing ? (
//                   <>
//                     <Button
//                       variant="success"
//                       className="btn-custom btn-save"
//                       onClick={handleSubmit}
//                     >
//                       Save
//                     </Button>
//                     <Button
//                       variant="secondary"
//                       className="btn-custom btn-cancel"
//                       onClick={toggleEditMode}
//                     >
//                       Cancel
//                     </Button>
//                   </>
//                 ) : (
//                   isProfileOwner && (
//                     <Button
//                       className="btn-custom btn-edit"
//                       onClick={toggleEditMode}
//                     >
//                       Edit Profile
//                     </Button>
//                   )
//                 )}
//               </div>
//             </div>
//             <div className="profile-info">
//               <div className="username">
//                 {isEditing ? (
//                   <Form.Group controlId="name">
//                     <Form.Label className="form-label">Name</Form.Label>
//                     <Form.Control
//                       type="text"
//                       name="name"
//                       value={formData.name}
//                       onChange={handleInputChange}
//                       className="form-control-custom"
//                       readOnly
//                     />
//                   </Form.Group>
//                 ) : (
//                   <h3 className="name">{profile.name}</h3>
//                 )}
//               </div>

//               <div className="description-card">
//                 {isEditing ? (
//                   <Form.Group controlId="description">
//                     <Form.Label className="form-label">Description</Form.Label>
//                     <Form.Control
//                       as="textarea"
//                       name="description"
//                       value={formData.description}
//                       onChange={handleInputChange}
//                       className="form-control-custom textarea-custom"
//                     />
//                   </Form.Group>
//                 ) : (
//                   <p className="description">{profile.description || "N/A"}</p>
//                 )}
//               </div>

//               <div className="status-badges">
//                 {profile.isActive && (
//                   <Badge className="status-badge active">Active</Badge>
//                 )}
//                 {profile.onTask && (
//                   <Badge className="status-badge on-task">On Task</Badge>
//                 )}
//                 {profile.leader && (
//                   <Badge className="status-badge leader">
//                     <Crown size={14} /> Team Leader
//                   </Badge>
//                 )}
//               </div>

//               <div className="details-grid" style={{ gridTemplateColumns: "repeat(2, 1fr)" }}>
//                 {visibleFields.includes("email") && (
//                   <div className="detail-item" style={{ minWidth: "300px" }}>
//                     <Mail size={20} />
//                     {isEditing ? (
//                       <Form.Control
//                         type="email"
//                         name="email"
//                         value={formData.email}
//                         onChange={handleInputChange}
//                         className="form-control-custom"
//                         readOnly
//                       />
//                     ) : (
//                       <span style={{ whiteSpace: "nowrap", overflow: "visible" }}>{profile.email}</span>
//                     )}
//                   </div>
//                 )}
//                 {visibleFields.includes("phone") && (
//                   <div className="detail-item" style={{ minWidth: "300px" }}>
//                     <Phone size={20} />
//                     {isEditing ? (
//                       <Form.Control
//                         type="text"
//                         name="phone"
//                         value={formData.phone}
//                         onChange={handleInputChange}
//                         className="form-control-custom"
//                       />
//                     ) : (
//                       <span>{profile.phone || "N/A"}</span>
//                     )}
//                   </div>
//                 )}
//                 {visibleFields.includes("birthday") && (
//                   <div className="detail-item" style={{ minWidth: "300px" }}>
//                     <Cake size={20} />
//                     {isEditing ? (
//                       <Form.Control
//                         type="text"
//                         name="birthday"
//                         value={formData.birthday}
//                         onChange={handleInputChange}
//                         placeholder="DD/MM/YYYY"
//                         className="form-control-custom"
//                       />
//                     ) : (
//                       <span>{formatDate(profile.birthday)}</span>
//                     )}
//                   </div>
//                 )}
//                 {visibleFields.includes("taskQuantity") && (
//                   <div className="detail-item" style={{ minWidth: "300px" }}>
//                     <CheckSquare size={20} />
//                     <span>{profile.taskQuantity || 0} Tasks</span>
//                   </div>
//                 )}
//                 {visibleFields.includes("height") && (
//                   <div className="detail-item" style={{ minWidth: "300px" }}>
//                     <Ruler size={20} />
//                     {isEditing && userRole === "Cosplayer" ? (
//                       <Form.Control
//                         type="text"
//                         name="height"
//                         value={formData.height}
//                         onChange={handleInputChange}
//                         className="form-control-custom"
//                       />
//                     ) : (
//                       <span>{profile.height || "N/A"}</span>
//                     )}
//                   </div>
//                 )}
//                 {visibleFields.includes("weight") && (
//                   <div className="detail-item" style={{ minWidth: "300px" }}>
//                     <Scale size={20} />
//                     {isEditing && userRole === "Cosplayer" ? (
//                       <Form.Control
//                         type="text"
//                         name="weight"
//                         value={formData.weight}
//                         onChange={handleInputChange}
//                         className="form-control-custom"
//                       />
//                     ) : (
//                       <span>{profile.weight || "N/A"}</span>
//                     )}
//                   </div>
//                 )}
//                 {visibleFields.includes("averageStar") && (
//                   <div className="detail-item" style={{ minWidth: "300px" }}>
//                     <Star size={20} />
//                     <span>{profile.averageStar || "N/A"} Stars</span>
//                   </div>
//                 )}
//                 {visibleFields.includes("salaryIndex") && (
//                   <div className="detail-item" style={{ minWidth: "300px" }}>
//                     <Wallet size={20} />
//                     <span>Salary Index: {profile.salaryIndex || "N/A"}</span>
//                   </div>
//                 )}
//                 {isEditing && (
//                   <div className="detail-item" style={{ minWidth: "300px" }}>
//                     <Lock size={20} />
//                     <Form.Control
//                       type="password"
//                       name="password"
//                       value={formData.password}
//                       onChange={handleInputChange}
//                       placeholder="Enter new password (optional)"
//                       className="form-control-custom"
//                       readOnly
//                     />
//                   </div>
//                 )}
//               </div>
//             </div>
//           </div>

//           {isCosplayer && !isEditing ? (
//             <div className="additional-images">
//               {/* Tiêu đề phần hình ảnh */}
//               <h5>Images</h5>
//               {uniqueImages.length > 0 ? (
//                 <div
//                   className="image-gallery"
//                   style={{
//                     display: "grid",
//                     gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
//                     gap: "16px",
//                     marginTop: "16px",
//                   }}
//                 >
//                   {/* Sử dụng grid để hiển thị 2-3 hình trên một hàng, tận dụng toàn bộ không gian */}
//                   {uniqueImages.map((image, index) => (
//                     <img
//                       key={index}
//                       src={image.urlImage}
//                       alt={`Profile Image ${index + 1}`}
//                       style={{
//                         width: "350px",
//                         height: "350px",
//                         objectFit: "cover",
//                         borderRadius: "8px",
//                         border: "1px solid #e0e0e0",
//                       }}
//                     />
//                   ))}
//                 </div>
//               ) : (
//                 /* Hiển thị thông báo tùy theo người xem */
//                 <>
//                   {isProfileOwner && userRole === "Cosplayer" ? (
//                     /* Thông báo cho Cosplayer khi xem profile của chính mình */
//                     <div className="empty-state">
//                       <div className="camera-icon">
//                         <Camera size={24} />
//                       </div>
//                       <h2>Share Photos</h2>
//                       <p>Your photos will appear on your profile once shared.</p>
//                       <a href="#" className="share-button">
//                         Share Your First Photo
//                       </a>
//                     </div>
//                   ) : (
//                     /* Thông báo cho Customer hoặc người khác khi Cosplayer chưa có hình */
//                     <div className="empty-state">
//                       <div className="camera-icon">
//                         <Camera size={24} />
//                       </div>
//                       <p>No images available.</p>
//                     </div>
//                   )}
//                 </>
//               )}
//             </div>
//           ) : null}

//           {isCosplayer && (
//             <div className="feedback-section">
//               <h5>Feedback</h5>
//               {feedbackLoading ? (
//                 <Box sx={{ width: "100%" }}>
//                   <LinearProgress />
//                 </Box>
//               ) : feedbacks.length === 0 ? (
//                 <div className="empty-state">
//                   <div className="camera-icon">
//                     <Star size={24} />
//                   </div>
//                   <h2>No Feedback Yet</h2>
//                   <p>This cosplayer has not received any feedback.</p>
//                 </div>
//               ) : (
//                 <>
//                   <div className="feedback-stats">
//                     <div className="average-star">
//                       <Star size={24} className="star-icon" />
//                       <span>{averageStar} Stars (Average)</span>
//                       <span className="total-votes">
//                         • {totalVotes} {totalVotes === 1 ? "vote" : "votes"}
//                       </span>
//                     </div>
//                     <div className="star-distribution">
//                       {[5, 4, 3, 2, 1].map((star) => (
//                         <div key={star} className="star-row">
//                           <span>{star} Star{star > 1 ? "s" : ""}</span>
//                           <div className="progress-bar">
//                             <div
//                               className="progress-fill"
//                               style={{
//                                 width: `${(starCounts[star] / feedbacks.length) * 100}%`,
//                               }}
//                             ></div>
//                           </div>
//                           <span>{starCounts[star]} votes</span>
//                         </div>
//                       ))}
//                     </div>
//                   </div>

//                   <div className="feedback-list">
//                     {feedbacks.map((feedback, index) => (
//                       <div key={index} className="feedback-item">
//                         <div className="feedback-header">
//                           <span className="character-name">
//                             Cosplayed as {feedback.characterName}
//                           </span>
//                           <div className="star-rating">
//                             {[...Array(5)].map((_, i) => (
//                               <Star
//                                 key={i}
//                                 size={16}
//                                 className={
//                                   i < feedback.star ? "filled-star" : "empty-star"
//                                 }
//                               />
//                             ))}
//                           </div>
//                         </div>
//                         <p className="feedback-description">
//                           {feedback.description}
//                         </p>
//                       </div>
//                     ))}
//                   </div>
//                 </>
//               )}
//             </div>
//           )}
//         </Container>
//       </div>
//     </div>
//   );
// };

// export default ProfilePage;

//---------------------------------------------------------------------------------------------------//

//sửa ngày 27/05/2025

import React, { useState, useEffect, useCallback } from "react";
import { useParams } from "react-router-dom";
import { Container, Button, Badge, Form } from "react-bootstrap";
import {
  Camera,
  Grid,
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
import Skeleton from "@mui/material/Skeleton";
import { jwtDecode } from "jwt-decode";

// Hàm lấy thông tin người dùng hiện tại từ token
const getCurrentUserInfo = () => {
  try {
    const accessToken = localStorage.getItem("accessToken");
    if (!accessToken) {
      console.warn("No accessToken found in localStorage");
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
      console.warn("No Id or role found in decoded JWT token");
      return null;
    }
    return { userId, role };
  } catch (error) {
    console.error("Error decoding JWT token:", error);
    return null;
  }
};

// Hàm định dạng ngày tháng
const formatDate = (dateString, forApi = false) => {
  if (!dateString) return forApi ? "" : "N/A";

  const dateRegexDDMMYYYY = /^(\d{2})\/(\d{2})\/(\d{4})$/;
  const dateRegexYYYYMMDD = /^\d{4}-\d{2}-\d{2}$/;

  let date;
  if (dateRegexDDMMYYYY.test(dateString)) {
    const [day, month, year] = dateString.split("/");
    date = new Date(`${year}-${month}-${day}`);
  } else if (dateRegexYYYYMMDD.test(dateString)) {
    date = new Date(dateString);
  } else {
    date = new Date(dateString);
  }

  if (isNaN(date.getTime())) return forApi ? "" : "N/A";

  if (forApi) {
    return date.toISOString().split("T")[0]; // YYYY-MM-DD
  }

  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();
  return `${day}/${month}/${year}`; // DD/MM/YYYY
};

// Hàm kiểm tra định dạng số điện thoại
const validatePhoneNumber = (phone) => {
  const phoneRegex = /^0\d{8,10}$/;
  return phoneRegex.test(phone);
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
  const [feedbacks, setFeedbacks] = useState([]);
  const [feedbackLoading, setFeedbackLoading] = useState(false);
  const [isCosplayer, setIsCosplayer] = useState(false);

  const currentUserInfo = getCurrentUserInfo();
  const normalizedId = String(id).trim();
  const normalizedCurrentUserId = currentUserInfo
    ? String(currentUserInfo.userId).trim()
    : null;
  const isProfileOwner =
    normalizedCurrentUserId && normalizedId === normalizedCurrentUserId;
  const userRole = currentUserInfo?.role;

  // Hàm lấy dữ liệu hồ sơ và kiểm tra vai trò
  const fetchProfileAndCheckRole = useCallback(async () => {
    try {
      setLoading(true);
      const profileData = await ProfileService.getProfileById(id);
      setProfile(profileData);

      const cosplayerAccounts = await ProfileService.getAccountsByRoleId("R004");
      const isCosplayerAccount = cosplayerAccounts.some(
        (account) => account.accountId === id
      );
      setIsCosplayer(isCosplayerAccount);

      setFormData({
        accountId: id,
        name: profileData.name || "",
        email: profileData.email || "",
        password: "N/A", // Không lưu password thật
        description: profileData.description || "",
        birthday: profileData.birthday ? formatDate(profileData.birthday) : "",
        phone: profileData.phone || "",
        height: profileData.height || "",
        weight: profileData.weight || "",
        avatar: null,
        images: [],
      });
    } catch (err) {
      setError(err.message || "Failed to load profile");
    } finally {
      setLoading(false);
    }
  }, [id]);

  // Hàm lấy feedback
  const fetchFeedbacks = useCallback(async () => {
    try {
      setFeedbackLoading(true);
      const data = await ProfileService.getFeedbackByCosplayerId(id);
      setFeedbacks(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Error fetching feedbacks:", err);
      setError("Failed to load feedbacks");
    } finally {
      setFeedbackLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchProfileAndCheckRole();
  }, [fetchProfileAndCheckRole]);

  useEffect(() => {
    if (isCosplayer) {
      fetchFeedbacks();
    }
  }, [isCosplayer, fetchFeedbacks]);

  // Xử lý thay đổi input
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Xử lý thay đổi avatar
  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file && file.size <= 5 * 1024 * 1024) {
      setAvatarFile(file);
      setFormData((prev) => ({ ...prev, avatar: file }));
    } else if (file) {
      setError("Avatar file size must be less than 5MB");
    }
  };

  // Xử lý thay đổi danh sách hình ảnh
  const handleImagesChange = (e) => {
    const files = Array.from(e.target.files).filter(
      (file) => file.size <= 5 * 1024 * 1024
    );
    if (files.length !== e.target.files.length) {
      setError("Some images were not added due to size limit (5MB per image)");
    }
    const uniqueFiles = Array.from(
      new Map(files.map((file) => [`${file.name}-${file.size}`, file])).values()
    );
    setAdditionalImages(uniqueFiles);
    setFormData((prev) => ({ ...prev, images: uniqueFiles }));
  };

  // Xử lý submit form
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (
      formData.phone &&
      formData.phone !== profile.phone &&
      !validatePhoneNumber(formData.phone)
    ) {
      setError("Phone number must start with 0 and be 9-11 digits long");
      return;
    }
    try {
      const updatedData = {
        accountId: id,
        name: profile.name,
        email: profile.email,
        password: profile.password || "",
        description: formData.description || profile.description || "",
        birthday: formData.birthday
          ? formatDate(formData.birthday, true)
          : profile.birthday || "",
        phone: formData.phone || profile.phone || "",
        height:
          userRole === "Cosplayer"
            ? formData.height || profile.height || ""
            : profile.height || "",
        weight:
          userRole === "Cosplayer"
            ? formData.weight || profile.weight || ""
            : profile.weight || "",
        avatar: formData.avatar || null,
        images:
          userRole === "Cosplayer"
            ? formData.images.length > 0
              ? formData.images
              : []
            : [],
        userName: profile.name,
      };
      console.log("Data sent to API:", updatedData);
      const response = await ProfileService.updateProfile(id, updatedData);
      console.log("Update response:", response);
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
    if (profile?.images?.length) {
      const avatarImage = profile.images.find((img) => img.isAvatar);
      return avatarImage
        ? avatarImage.urlImage
        : "https://cdn.pixabay.com/photo/2023/12/04/13/23/ai-generated-8429472_1280.png";
    }
    return "https://cdn.pixabay.com/photo/2023/12/04/13/23/ai-generated-8429472_1280.png";
  };

  // Lấy danh sách hình ảnh duy nhất (loại bỏ avatar)
  const getUniqueImages = (images) => {
    if (!Array.isArray(images) || images.length === 0) return [];
    const seenUrls = new Set();
    return images.filter((image) => {
      if (!image?.urlImage || seenUrls.has(image.urlImage) || image.isAvatar) {
        return false;
      }
      seenUrls.add(image.urlImage);
      return true;
    });
  };

  // Tính toán thống kê feedback
  const calculateFeedbackStats = () => {
    if (!Array.isArray(feedbacks) || feedbacks.length === 0) {
      return {
        averageStar: 0,
        starCounts: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
        totalVotes: 0,
      };
    }

    const totalStars = feedbacks.reduce((sum, fb) => sum + (fb.star || 0), 0);
    const averageStar = (totalStars / feedbacks.length).toFixed(1);
    const starCounts = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    feedbacks.forEach((fb) => {
      if (fb.star >= 1 && fb.star <= 5) {
        starCounts[fb.star] = (starCounts[fb.star] || 0) + 1;
      }
    });
    const totalVotes = feedbacks.length;

    return { averageStar, starCounts, totalVotes };
  };

  const { averageStar, starCounts, totalVotes } = calculateFeedbackStats();

  // Hiển thị skeleton khi loading
  if (loading) {
    return (
      <div className="profile-page">
        <Container>
          <Skeleton variant="rectangular" width="100%" height={200} />
          <Skeleton variant="text" width="60%" height={40} />
          <Skeleton variant="circular" width={180} height={180} />
          <Skeleton variant="text" width="80%" height={30} />
          <Skeleton variant="rectangular" width="100%" height={100} />
        </Container>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-message">
        Error: {error}
        <Box sx={{ width: "100%" }}>
          <LinearProgress />
        </Box>
      </div>
    );
  }

  if (!profile) {
    return <div className="error-message">Profile not found</div>;
  }

  const uniqueImages = getUniqueImages(profile.images);

  // Xác định các trường hiển thị trong details-grid
  const getVisibleFields = () => {
    if (isProfileOwner && userRole === "Customer") {
      return ["email", "phone", "birthday"];
    }
    return [
      "email",
      "phone",
      "birthday",
      "taskQuantity",
      "height",
      "weight",
      "averageStar",
      "salaryIndex",
    ];
  };

  const visibleFields = getVisibleFields();

  return (
    <div className="profile-page">
      <div className="profile-container" style={{ maxWidth: "1200px" }}>
        <Container>
          <div className="tabs">
            <div
              className={`tab ${activeTab === "posts" ? "active" : ""}`}
              onClick={() => setActiveTab("posts")}
            >
              <Grid size={12} className="icon" /> Profile
            </div>
          </div>

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
                  {/* Cho phép Cosplayer thêm hình ảnh trong chế độ chỉnh sửa */}
                  {isEditing && userRole === "Cosplayer" && (
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
                  )}
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
                      readOnly
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

              <div
                className="details-grid"
                style={{ gridTemplateColumns: "repeat(2, 1fr)" }}
              >
                {visibleFields.includes("email") && (
                  <div className="detail-item" style={{ minWidth: "300px" }}>
                    <Mail size={20} />
                    {isEditing ? (
                      <Form.Control
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className="form-control-custom"
                        readOnly
                      />
                    ) : (
                      <span style={{ whiteSpace: "nowrap", overflow: "visible" }}>
                        {profile.email}
                      </span>
                    )}
                  </div>
                )}
                {visibleFields.includes("phone") && (
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
                )}
                {visibleFields.includes("birthday") && (
                  <div className="detail-item" style={{ minWidth: "300px" }}>
                    <Cake size={20} />
                    {isEditing ? (
                      <Form.Control
                        type="text"
                        name="birthday"
                        value={formData.birthday}
                        onChange={handleInputChange}
                        placeholder="DD/MM/YYYY"
                        className="form-control-custom"
                      />
                    ) : (
                      <span>{formatDate(profile.birthday)}</span>
                    )}
                  </div>
                )}
                {visibleFields.includes("taskQuantity") && (
                  <div className="detail-item" style={{ minWidth: "300px" }}>
                    <CheckSquare size={20} />
                    <span>{profile.taskQuantity || 0} Tasks</span>
                  </div>
                )}
                {visibleFields.includes("height") && (
                  <div className="detail-item" style={{ minWidth: "300px" }}>
                    <Ruler size={20} />
                    {isEditing && userRole === "Cosplayer" ? (
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
                )}
                {visibleFields.includes("weight") && (
                  <div className="detail-item" style={{ minWidth: "300px" }}>
                    <Scale size={20} />
                    {isEditing && userRole === "Cosplayer" ? (
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
                )}
                {visibleFields.includes("averageStar") && (
                  <div className="detail-item" style={{ minWidth: "300px" }}>
                    <Star size={20} />
                    <span>{profile.averageStar || "N/A"} Stars</span>
                  </div>
                )}
                {visibleFields.includes("salaryIndex") && (
                  <div className="detail-item" style={{ minWidth: "300px" }}>
                    <Wallet size={20} />
                    <span>Salary Index: {profile.salaryIndex || "N/A"}</span>
                  </div>
                )}
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
                      readOnly
                    />
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Phần hiển thị hình ảnh cho Cosplayer */}
          {isCosplayer && !isEditing ? (
            <div className="additional-images">
              <h5>Images</h5>
              {uniqueImages.length > 0 ? (
                <div
                  className="image-gallery"
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
                    gap: "16px",
                    marginTop: "16px",
                  }}
                >
                  {/* Sử dụng grid để hiển thị 2-3 hình trên một hàng, tận dụng toàn bộ không gian */}
                  {uniqueImages.map((image, index) => (
                    <img
                      key={index}
                      src={image.urlImage}
                      alt={`Profile Image ${index + 1}`}
                      style={{
                        width: "350px",
                        height: "350px",
                        objectFit: "cover",
                        borderRadius: "8px",
                        border: "1px solid #e0e0e0",
                      }}
                    />
                  ))}
                </div>
              ) : (
                <>
                  {isProfileOwner && userRole === "Cosplayer" ? (
                    /* Thông báo cho Cosplayer khi xem profile của chính mình */
                    <div className="empty-state">
                      <div className="camera-icon">
                        <Camera size={24} />
                      </div>
                      <h2>Share Photos</h2>
                      <p>
                        Your photos will appear on your profile once shared.
                      </p>
                      <a href="#" className="share-button">
                        Share Your First Photo
                      </a>
                    </div>
                  ) : (
                    /* Thông báo cho người khác khi Cosplayer chưa có hình */
                    <div className="empty-state">
                      <div className="camera-icon">
                        <Camera size={24} />
                      </div>
                      <p>No images available.</p>
                    </div>
                  )}
                </>
              )}
            </div>
          ) : null}

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
                  <div className="feedback-stats">
                    <div className="average-star">
                      <Star size={24} className="star-icon" />
                      <span>{averageStar} Stars (Average)</span>
                      <span className="total-votes">
                        • {totalVotes} {totalVotes === 1 ? "vote" : "votes"}
                      </span>
                    </div>
                    <div className="star-distribution">
                      {[5, 4, 3, 2, 1].map((star) => (
                        <div key={star} className="star-row">
                          <span>
                            {star} Star{star > 1 ? "s" : ""}
                          </span>
                          <div className="progress-bar">
                            <div
                              className="progress-fill"
                              style={{
                                width: `${(starCounts[star] / feedbacks.length) * 100
                                  }%`,
                              }}
                            ></div>
                          </div>
                          <span>{starCounts[star]} votes</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="feedback-list">
                    {feedbacks.map((feedback, index) => (
                      <div key={index} className="feedback-item">
                        <div className="feedback-header">
                          <span className="character-name">
                            Cosplayed as {feedback.characterName || "N/A"}
                          </span>
                          <div className="star-rating">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                size={16}
                                className={
                                  i < feedback.star
                                    ? "filled-star"
                                    : "empty-star"
                                }
                              />
                            ))}
                          </div>
                        </div>
                        <p className="feedback-description">
                          {feedback.description || "No description provided."}
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