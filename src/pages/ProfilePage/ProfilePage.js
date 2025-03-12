// import React, { useState } from "react";
// import { Container, Row, Col, Form, Button, Image } from "react-bootstrap";
// import "../../styles/ProfilePage.scss";

// const ProfilePage = () => {
//   const [profilePhoto, setProfilePhoto] = useState(null);
//   const [isEditMode, setIsEditMode] = useState(false);
//   const [formData, setFormData] = useState({
//     firstName: "Steve",
//     lastName: "Smith",
//     email: "steve_@email.com",
//     phone: "+1 213-548-6015",
//   });

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prevData) => ({ ...prevData, [name]: value }));
//   };

//   const handlePhotoUpload = (e) => {
//     const file = e.target.files[0];
//     if (file) {
//       const reader = new FileReader();
//       reader.onloadend = () => {
//         setProfilePhoto(reader.result);
//       };
//       reader.readAsDataURL(file);
//     }
//   };

//   const handleToggleEdit = () => {
//     if (isEditMode) {
//       handleSaveChanges();
//       setIsEditMode(false);
//     } else {
//       setIsEditMode(true);
//     }
//   };

//   const handleSaveChanges = () => {
//     console.log("Form Data:", formData);
//     if (profilePhoto) console.log("Profile Photo:", profilePhoto);
//   };

//   const handleDeactivate = () => {
//     console.log("Account deactivation requested");
//   };

//   return (
//     <div className="user-profile min-vh-100 bg-light">
//       <Container className="wrapper bg-white mt-sm-5">
//         <h4 className="pb-4 border-bottom">User profile</h4>
//         <div className="d-flex align-items-start py-3 border-bottom">
//           <Image
//             src={
//               profilePhoto ||
//               "https://images.pexels.com/photos/1037995/pexels-photo-1037995.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500"
//             }
//             alt="Profile"
//             rounded
//             className="img"
//           />
//           <div className="pl-sm-4 pl-2" id="img-section">
//             <b>Profile Photo</b>
//             <p className="text-muted mb-2">
//               Accepted file type .png. Less than 1MB
//             </p>
//             <Form.Control
//               type="file"
//               accept=".png"
//               onChange={handlePhotoUpload}
//               className="d-none"
//               id="profile-upload"
//               disabled={!isEditMode}
//             />
//             <label
//               htmlFor="profile-upload"
//               className={`btn button border ${!isEditMode ? "disabled" : ""}`}
//             >
//               <b>Upload</b>
//             </label>
//           </div>
//         </div>
//         <div className="py-2">
//           <Row className="py-2">
//             <Col md={6}>
//               <Form.Label>First Name</Form.Label>
//               <Form.Control
//                 type="text"
//                 name="firstName"
//                 value={formData.firstName}
//                 onChange={handleInputChange}
//                 placeholder="Steve"
//                 className="bg-light"
//                 disabled={!isEditMode}
//               />
//             </Col>
//             <Col md={6} className="pt-md-0 pt-3">
//               <Form.Label>Last Name</Form.Label>
//               <Form.Control
//                 type="text"
//                 name="lastName"
//                 value={formData.lastName}
//                 onChange={handleInputChange}
//                 placeholder="Smith"
//                 className="bg-light"
//                 disabled={!isEditMode}
//               />
//             </Col>
//           </Row>
//           <Row className="py-2">
//             <Col md={6}>
//               <Form.Label>Email Address</Form.Label>
//               <Form.Control
//                 type="email"
//                 name="email"
//                 value={formData.email}
//                 onChange={handleInputChange}
//                 placeholder="steve_@email.com"
//                 className="bg-light"
//                 disabled={!isEditMode}
//               />
//             </Col>
//             <Col md={6} className="pt-md-0 pt-3">
//               <Form.Label>Phone Number</Form.Label>
//               <Form.Control
//                 type="tel"
//                 name="phone"
//                 value={formData.phone}
//                 onChange={handleInputChange}
//                 placeholder="+1 213-548-6015"
//                 className="bg-light"
//                 disabled={!isEditMode}
//               />
//             </Col>
//           </Row>
//           <div className="py-3 pb-4 border-bottom">
//             <Button
//               variant="primary"
//               className="mr-3"
//               onClick={handleToggleEdit}
//             >
//               {isEditMode ? "Save Changes" : "Edit"}
//             </Button>
//             <Button
//               variant="outline-secondary"
//               className="button"
//               onClick={() => {
//                 if (isEditMode) {
//                   setFormData({
//                     firstName: "Steve",
//                     lastName: "Smith",
//                     email: "steve_@email.com",
//                     phone: "+1 213-548-6015",
//                   });
//                   setProfilePhoto(null);
//                   setIsEditMode(false);
//                 }
//               }}
//               disabled={!isEditMode}
//             >
//               Cancel
//             </Button>
//           </div>
//           <div className="d-sm-flex align-items-center pt-3" id="deactivate">
//             <div>
//               <b>Deactivate your account</b>
//               <p className="text-muted">
//                 Details about your company account and password
//               </p>
//             </div>
//             <div className="ml-auto">
//               <Button
//                 variant="outline-danger"
//                 className="danger"
//                 onClick={handleDeactivate}
//               >
//                 Deactivate
//               </Button>
//             </div>
//           </div>
//         </div>
//       </Container>
//     </div>
//   );
// };

// export default ProfilePage;

// import React, { useState } from "react";
// import { Container, Row, Col, Button, Form } from "react-bootstrap";
// import {
//   MapPin,
//   Mail,
//   Phone,
//   Star,
//   Play,
//   Building2,
//   MessageSquare,
//   Twitter,
//   Linkedin,
// } from "lucide-react";
// import "bootstrap/dist/css/bootstrap.min.css";
// import "../../styles/ProfilePage.scss";

// const ProfilePage = () => {
//   const [profilePhoto, setProfilePhoto] = useState(null);
//   const [isEditMode, setIsEditMode] = useState(false);
//   const [formData, setFormData] = useState({
//     firstName: "Steve",
//     lastName: "Smith",
//     email: "steve_@email.com",
//     phone: "+1 213-548-6015",
//   });

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prevData) => ({ ...prevData, [name]: value }));
//   };

//   const handlePhotoUpload = (e) => {
//     const file = e.target.files[0];
//     if (file) {
//       const reader = new FileReader();
//       reader.onloadend = () => {
//         setProfilePhoto(reader.result);
//       };
//       reader.readAsDataURL(file);
//     }
//   };

//   const handleToggleEdit = () => {
//     if (isEditMode) {
//       handleSaveChanges();
//       setIsEditMode(false);
//     } else {
//       setIsEditMode(true);
//     }
//   };

//   const handleSaveChanges = () => {
//     console.log("Form Data:", formData);
//     if (profilePhoto) console.log("Profile Photo:", profilePhoto);
//   };

//   const handleDeactivate = () => {
//     console.log("Account deactivation requested");
//   };

//   return (
//     <>
//       <div className="profile-page">
//         <div className="profile-header">
//           <img
//             src="https://images.unsplash.com/photo-1519681393784-d120267933ba?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1200&q=80"
//             alt="Cover"
//             className="cover-image"
//           />
//         </div>

//         <Container>
//           <div className="profile-info">
//             <Row>
//               <Col lg={8}>
//                 <div className="profile-picture-container">
//                   <img
//                     src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=300&q=80"
//                     alt="Profile"
//                     className="profile-picture"
//                   />
//                 </div>
//                 <h1 className="profile-name">Kevin Smith</h1>
//                 <p className="profile-title">
//                   Advisor and Consultant at Stripe Inc.
//                 </p>

//                 <div className="profile-meta">
//                   <div className="location">
//                     <MapPin size={16} />
//                     <span>Saint-Petersburg, Russia</span>
//                   </div>
//                   <a href="#twitter">
//                     <Twitter size={16} />
//                     @kevinsmith95
//                   </a>
//                   <a href="#linkedin">
//                     <Linkedin size={16} />
//                     kevin_smith
//                   </a>
//                 </div>
//               </Col>

//               <Col lg={4}>
//                 <Row className="py-2">
//                   <Col md={6}>
//                     <Form.Label>Email Address</Form.Label>
//                     <Form.Control
//                       type="email"
//                       name="email"
//                       value={formData.email}
//                       onChange={handleInputChange}
//                       placeholder="steve_@email.com"
//                       className="bg-light"
//                       disabled={!isEditMode}
//                     />
//                   </Col>
//                   <Col md={6} className="pt-md-0 pt-3">
//                     <Form.Label>Phone Number</Form.Label>
//                     <Form.Control
//                       type="tel"
//                       name="phone"
//                       value={formData.phone}
//                       onChange={handleInputChange}
//                       placeholder="+1 213-548-6015"
//                       className="bg-light"
//                       disabled={!isEditMode}
//                     />
//                   </Col>
//                 </Row>
//                 <div className="py-3 pb-4 border-bottom">
//                   <Button
//                     variant="primary"
//                     className="mr-3"
//                     onClick={handleToggleEdit}
//                   >
//                     {isEditMode ? "Save Changes" : "Edit"}
//                   </Button>
//                   <Button
//                     variant="outline-secondary"
//                     className="button"
//                     onClick={() => {
//                       if (isEditMode) {
//                         setFormData({
//                           firstName: "Steve",
//                           lastName: "Smith",
//                           email: "steve_@email.com",
//                           phone: "+1 213-548-6015",
//                         });
//                         setProfilePhoto(null);
//                         setIsEditMode(false);
//                       }
//                     }}
//                     disabled={!isEditMode}
//                   >
//                     Cancel
//                   </Button>
//                 </div>
//               </Col>
//             </Row>

//             <Row className="mt-4">
//               <Col lg={8}>
//                 <div className="content-card introduction">
//                   <div className="play-button">
//                     <Play size={24} />
//                   </div>
//                 </div>
//               </Col>

//               <Col lg={4}>
//                 <div className="content-card calculator">
//                   <Building2 size={32} className="calculator-icon" />
//                   <h3>Loan Calculator</h3>
//                   <p>Get great rates and an effortless close.</p>
//                   <Button className="btn-calculate">Calculate →</Button>
//                 </div>
//               </Col>
//             </Row>
//           </div>
//         </Container>
//       </div>
//     </>
//   );
// };

// export default ProfilePage;

// import React, { useState } from "react";
// import { Container, Row, Col, Form, Button, Image } from "react-bootstrap";
// import {
//   MapPin,
//   Mail,
//   Phone,
//   Star,
//   Play,
//   Building2,
//   MessageSquare,
//   Twitter,
//   Linkedin,
// } from "lucide-react";
// import "bootstrap/dist/css/bootstrap.min.css";
// import "../../styles/ProfilePage.scss";

// const ProfilePage = () => {
//   const [profilePhoto, setProfilePhoto] = useState(null);
//   const [isEditMode, setIsEditMode] = useState(false);
//   const [formData, setFormData] = useState({
//     email: "steve_@email.com",
//     phone: "+1 213-548-6015",
//   });

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prevData) => ({ ...prevData, [name]: value }));
//   };

//   const handlePhotoUpload = (e) => {
//     const file = e.target.files[0];
//     if (file) {
//       const reader = new FileReader();
//       reader.onloadend = () => {
//         setProfilePhoto(reader.result);
//       };
//       reader.readAsDataURL(file);
//     }
//   };

//   const handleToggleEdit = () => {
//     if (isEditMode) {
//       handleSaveChanges();
//       setIsEditMode(false);
//     } else {
//       setIsEditMode(true);
//     }
//   };

//   const handleSaveChanges = () => {
//     console.log("Form Data:", formData);
//     if (profilePhoto) console.log("Profile Photo:", profilePhoto);
//   };

//   return (
//     <div className="profile-page">
//       <div className="profile-header">
//         <img
//           src="https://images.unsplash.com/photo-1519681393784-d120267933ba?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1200&q=80"
//           alt="Cover"
//           className="cover-image"
//         />
//       </div>

//       <Container>
//         <div className="profile-info">
//           <Row>
//             <Col lg={8}>
//               <div className="profile-picture-container">
//                 <Image
//                   src={
//                     profilePhoto ||
//                     "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=300&q=80"
//                   }
//                   alt="Profile"
//                   roundedCircle
//                   className="profile-picture"
//                 />
//                 {isEditMode && (
//                   <>
//                     <Form.Control
//                       type="file"
//                       accept=".png,.jpg,.jpeg"
//                       onChange={handlePhotoUpload}
//                       className="d-none"
//                       id="profile-upload"
//                     />
//                     <label
//                       htmlFor="profile-upload"
//                       className="btn button border profile-upload-btn"
//                     >
//                       Change Photo
//                     </label>
//                   </>
//                 )}
//               </div>
//               <h1 className="profile-name">Kevin Smith</h1>
//               <p className="profile-title">
//                 Advisor and Consultant at Stripe Inc.
//               </p>

//               <Row className="py-2">
//                 <Col md={6}>
//                   <Form.Label>Email Address</Form.Label>
//                   <Form.Control
//                     type="email"
//                     name="email"
//                     value={formData.email}
//                     onChange={handleInputChange}
//                     placeholder="steve_@email.com"
//                     className="bg-light"
//                     disabled={!isEditMode}
//                   />
//                 </Col>
//                 <Col md={6} className="pt-md-0 pt-3">
//                   <Form.Label>Phone Number</Form.Label>
//                   <Form.Control
//                     type="tel"
//                     name="phone"
//                     value={formData.phone}
//                     onChange={handleInputChange}
//                     placeholder="+1 213-548-6015"
//                     className="bg-light"
//                     disabled={!isEditMode}
//                   />
//                 </Col>
//               </Row>
//               <div className="py-3 pb-4 border-bottom">
//                 <Button
//                   variant="primary"
//                   className="mr-3"
//                   onClick={handleToggleEdit}
//                 >
//                   {isEditMode ? "Save Changes" : "Edit"}
//                 </Button>
//                 <Button
//                   variant="outline-secondary"
//                   className="button"
//                   onClick={() => {
//                     if (isEditMode) {
//                       setFormData({
//                         email: "steve_@email.com",
//                         phone: "+1 213-548-6015",
//                       });
//                       setProfilePhoto(null);
//                       setIsEditMode(false);
//                     }
//                   }}
//                   disabled={!isEditMode}
//                 >
//                   Cancel
//                 </Button>
//               </div>
//             </Col>

//             <Col className="edit-profile" lg={4}>
//               <div
//                 className="d-sm-flex align-items-center pt-3"
//                 id="deactivate"
//               >
//                 <div className="content-card introduction">
//                   <h3>Introduction</h3>
//                   <p>
//                     Hi, I'm Kevin Smith, an advisor and consultant at Stripe
//                     Inc. I specialize in helping businesses grow through
//                     strategic planning and innovative solutions. With over 10
//                     years of experience in the fintech industry, I'm passionate
//                     about empowering companies to achieve their goals.
//                   </p>
//                 </div>
//               </div>
//             </Col>
//           </Row>

//           <Row className="mt-4">
//             <Col lg={8}>
//               {/* <div className="content-card introduction">
//                 <h3> </h3>
//                 <p>

//                 </p>
//               </div> */}
//             </Col>

//             <Col lg={4}>
//               {/* <div className="content-card calculator">

//               </div> */}
//             </Col>
//           </Row>
//         </div>
//       </Container>
//     </div>
//   );
// };

// export default ProfilePage;

// import React, { useState } from "react";
// import { Container, Row, Col, Form, Button, Image } from "react-bootstrap";
// import {
//   MapPin,
//   Mail,
//   Phone,
//   Star,
//   Play,
//   Building2,
//   MessageSquare,
//   Twitter,
//   Linkedin,
// } from "lucide-react";
// import "bootstrap/dist/css/bootstrap.min.css";
// import "../../styles/ProfilePage.scss";

// const ProfilePage = () => {
//   const [profilePhoto, setProfilePhoto] = useState(null);
//   const [isEditMode, setIsEditMode] = useState(false);
//   const [formData, setFormData] = useState({
//     name: "Kevin Smith",
//     title: "Advisor and Consultant at Stripe Inc.",
//     location: "Saint-Petersburg, Russia",
//     twitter: "@kevinsmith95",
//     linkedin: "kevin_smith",
//     email: "steve_@email.com",
//     phone: "+1 213-548-6015",
//     introduction:
//       "Hi, I'm Kevin Smith, an advisor and consultant at Stripe Inc. I specialize in helping businesses grow through strategic planning and innovative solutions. With over 10 years of experience in the fintech industry, I'm passionate about empowering companies to achieve their goals.",
//   });

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prevData) => ({ ...prevData, [name]: value }));
//   };

//   const handlePhotoUpload = (e) => {
//     const file = e.target.files[0];
//     if (file) {
//       const reader = new FileReader();
//       reader.onloadend = () => {
//         setProfilePhoto(reader.result);
//       };
//       reader.readAsDataURL(file);
//     }
//   };

//   const handleToggleEdit = () => {
//     if (isEditMode) {
//       handleSaveChanges();
//       setIsEditMode(false);
//     } else {
//       setIsEditMode(true);
//     }
//   };

//   const handleSaveChanges = () => {
//     console.log("Form Data:", formData);
//     if (profilePhoto) console.log("Profile Photo:", profilePhoto);
//   };

//   return (
//     <div className="profile-page">
//       <div className="profile-header">
//         <img
//           src="https://images.unsplash.com/photo-1519681393784-d120267933ba?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1200&q=80"
//           alt="Cover"
//           className="cover-image"
//         />
//       </div>

//       <Container>
//         <div className="profile-info">
//           <Row>
//             <Col lg={8}>
//               <div className="profile-picture-container">
//                 <Image
//                   src={
//                     profilePhoto ||
//                     "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=300&q=80"
//                   }
//                   alt="Profile"
//                   roundedCircle
//                   className="profile-picture"
//                 />
//                 {isEditMode && (
//                   <>
//                     <Form.Control
//                       type="file"
//                       accept=".png,.jpg,.jpeg"
//                       onChange={handlePhotoUpload}
//                       className="d-none"
//                       id="profile-upload"
//                     />
//                     <label
//                       htmlFor="profile-upload"
//                       className="btn button border profile-upload-btn"
//                     >
//                       Change Photo
//                     </label>
//                   </>
//                 )}
//               </div>
//               {isEditMode ? (
//                 <Form.Control
//                   type="text"
//                   name="name"
//                   value={formData.name}
//                   onChange={handleInputChange}
//                   placeholder="Enter your name"
//                   className="bg-light profile-name-input"
//                 />
//               ) : (
//                 <h1 className="profile-name">{formData.name}</h1>
//               )}
//               {isEditMode ? (
//                 <Form.Control
//                   type="text"
//                   name="title"
//                   value={formData.title}
//                   onChange={handleInputChange}
//                   placeholder="Enter your title"
//                   className="bg-light profile-title-input"
//                 />
//               ) : (
//                 <p className="profile-title">{formData.title}</p>
//               )}

//               <div className="profile-meta">
//                 {isEditMode ? (
//                   <Form.Control
//                     type="text"
//                     name="location"
//                     value={formData.location}
//                     onChange={handleInputChange}
//                     placeholder="Enter your location"
//                     className="bg-light location-input"
//                   />
//                 ) : (
//                   <div className="location">
//                     <MapPin size={16} />
//                     <span>{formData.location}</span>
//                   </div>
//                 )}
//                 {isEditMode ? (
//                   <Form.Control
//                     type="text"
//                     name="twitter"
//                     value={formData.twitter}
//                     onChange={handleInputChange}
//                     placeholder="Enter Twitter handle"
//                     className="bg-light social-input"
//                   />
//                 ) : (
//                   <a href="#twitter">
//                     <Twitter size={16} />
//                     {formData.twitter}
//                   </a>
//                 )}
//                 {isEditMode ? (
//                   <Form.Control
//                     type="text"
//                     name="linkedin"
//                     value={formData.linkedin}
//                     onChange={handleInputChange}
//                     placeholder="Enter LinkedIn handle"
//                     className="bg-light social-input"
//                   />
//                 ) : (
//                   <a href="#linkedin">
//                     <Linkedin size={16} />
//                     {formData.linkedin}
//                   </a>
//                 )}
//               </div>

//               <Row className="py-2">
//                 <Col md={6}>
//                   <Form.Label>Email Address</Form.Label>
//                   <Form.Control
//                     type="email"
//                     name="email"
//                     value={formData.email}
//                     onChange={handleInputChange}
//                     placeholder="steve_@email.com"
//                     className="bg-light"
//                     disabled={!isEditMode}
//                   />
//                 </Col>
//                 <Col md={6} className="pt-md-0 pt-3">
//                   <Form.Label>Phone Number</Form.Label>
//                   <Form.Control
//                     type="tel"
//                     name="phone"
//                     value={formData.phone}
//                     onChange={handleInputChange}
//                     placeholder="+1 213-548-6015"
//                     className="bg-light"
//                     disabled={!isEditMode}
//                   />
//                 </Col>
//               </Row>
//               <div className="py-3 pb-4 border-bottom">
//                 <Button
//                   variant="primary"
//                   className="mr-3"
//                   onClick={handleToggleEdit}
//                 >
//                   {isEditMode ? "Save Changes" : "Edit"}
//                 </Button>
//                 <Button
//                   variant="outline-secondary"
//                   className="button"
//                   onClick={() => {
//                     if (isEditMode) {
//                       setFormData({
//                         name: "Kevin Smith",
//                         title: "Advisor and Consultant at Stripe Inc.",
//                         location: "Saint-Petersburg, Russia",
//                         twitter: "@kevinsmith95",
//                         linkedin: "kevin_smith",
//                         email: "steve_@email.com",
//                         phone: "+1 213-548-6015",
//                         introduction:
//                           "Hi, I'm Kevin Smith, an advisor and consultant at Stripe Inc. I specialize in helping businesses grow through strategic planning and innovative solutions. With over 10 years of experience in the fintech industry, I'm passionate about empowering companies to achieve their goals.",
//                       });
//                       setProfilePhoto(null);
//                       setIsEditMode(false);
//                     }
//                   }}
//                   disabled={!isEditMode}
//                 >
//                   Cancel
//                 </Button>
//               </div>
//             </Col>

//             <Col lg={4}>
//               <div className="content-card introduction">
//                 <h3>Introduction</h3>
//                 {isEditMode ? (
//                   <Form.Control
//                     as="textarea"
//                     rows={5}
//                     name="introduction"
//                     value={formData.introduction}
//                     onChange={handleInputChange}
//                     placeholder="Enter your introduction"
//                     className="bg-light introduction-input"
//                   />
//                 ) : (
//                   <p>{formData.introduction}</p>
//                 )}
//               </div>
//             </Col>
//           </Row>
//         </div>
//       </Container>
//     </div>
//   );
// };

// export default ProfilePage;

import React, { useState } from "react";
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
import "bootstrap/dist/css/bootstrap.min.css";
import "../../styles/ProfilePage.scss";

const ProfilePage = () => {
  const [activeTab, setActiveTab] = useState("posts");

  const profile = {
    name: "Anh Hoang",
    email: "anh.hoang@example.com",
    description: "Senior Full Stack Developer ",
    birthday: "1990-05-15",
    phone: "+1 (555) 123-4567",
    isActive: true,
    onTask: true,
    leader: true,

    imageUrl:
      "https://images.unsplash.com/photo-1502790671504-542ad42d5189?auto=format&fit=crop&w=800&q=60",
    taskQuantity: 15,
    height: "180cm",
    weight: "75kg",
    // posts: 0,
  };
  return (
    <div className="profile-page">
      <div className="profile-container">
        <Container>
          <div className="profile-header">
            <Row className="align-items-center">
              <Col xs={4} className="left-side">
                <img
                  src={profile.imageUrl}
                  alt={profile.username}
                  className="profile-image"
                />
                <div className="action-buttons">
                  <Button className="btn text-white">Edit profile</Button>
                </div>
              </Col>
              <Col xs={8}>
                <div className="username">
                  {" "}
                  <h3 className="name">{profile.name}</h3>
                </div>

                <div className="profile-info">
                  <p className="description">{profile.description}</p>

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
                      <span>{profile.phone}</span>
                    </div>
                    <div className="detail-item">
                      <Calendar size={16} />
                      <span>{profile.birthday}</span>
                    </div>

                    <div className="detail-item">
                      <Activity size={16} />
                      <span>{profile.taskQuantity} Tasks</span>
                    </div>
                    <div className="detail-item">
                      <Ruler size={16} />
                      <span>{profile.height}</span>
                    </div>
                    <div className="detail-item">
                      <Weight size={16} />
                      <span>{profile.weight}</span>
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
