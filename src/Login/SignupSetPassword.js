






// import React, { useState, useEffect } from "react";
// import { useNavigate, useLocation } from "react-router-dom";
// import { FaArrowLeft, FaLock } from "react-icons/fa";
// import { EyeFill, EyeSlashFill } from "react-bootstrap-icons";
// import axios from "axios";
// import { Button, InputGroup, Form, Alert } from "react-bootstrap";
// import logo from "../Logos/hvac-logo-new.jpg";
// import "./SignupSetPassword.css";
// import baseURL from '../ApiUrl/Apiurl';

// const SECURITY_QUESTION_CHOICES = [
//   "What is your mother's maiden name?",
//   "What was the name of your first pet?",
//   "What was your first car?",
//   "What is the name of the town where you were born?",
//   "What was your childhood nickname?",
// ];

// const SignupSetPassword = () => {
//   const [password, setPassword] = useState("");
//   const [confirmPassword, setConfirmPassword] = useState("");
//   const [showPassword, setShowPassword] = useState(false);
//   const [showConfirmPassword, setShowConfirmPassword] = useState(false);
//   const [q1, setQ1] = useState("");
//   const [q2, setQ2] = useState("");
//   const [a1, setA1] = useState("");
//   const [a2, setA2] = useState("");
//   const [error, setError] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [user, setUser] = useState(null);

//   const navigate = useNavigate();
//   const location = useLocation();

//   useEffect(() => {
//     if (location.state?.user) {
//       setUser(location.state.user);
//     } else {
//       navigate("/signup");
//     }
//   }, [location, navigate]);

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setError("");

//     if (password !== confirmPassword) {
//       setError("Passwords do not match!");
//       return;
//     }

//     if (!q1 || !q2) {
//       setError("Please select both security questions");
//       return;
//     }

//     if (!a1 || !a2) {
//       setError("Please provide answers for both security questions");
//       return;
//     }

//     if (!user?.user_id) {
//       setError("User information is missing");
//       return;
//     }

//     setLoading(true);
//     try {
//       const response = await axios.put(`${baseURL}/users/${user.user_id}/`, {
//         password: password,
//         security_question1: q1,
//         security_question2: q2,
//         security_answer1: a1,
//         security_answer2: a2,
//         is_registered_by_user: true,
//       });

//       if (response.data && (response.data.success || response.data.status === "success")) {
//         alert("Registration completed successfully!");
//         navigate("/", { replace: true });
//       } else {
//         setError(response.data?.message || "Failed to complete registration");
//       }
//     } catch (error) {
//       console.error("Error completing registration:", error);
//       setError(
//         error.response?.data?.message || 
//         error.message ||
//         "An error occurred. Please try again later."
//       );
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="security-container">
//       <div className="security-card">
//         <Button 
//           variant="link" 
//           className="security-back-button" 
//           onClick={() => navigate("/signup")}
//         >
//           <FaArrowLeft size={20} />
//         </Button>

//         <div className="security-logo-container">
//           <img src={logo} alt="HVAC Logo" className="security-logo" />
//         </div>

//         <h4 className="security-title">Complete Your Registration</h4>
//         {user && (
//           <>
//             <p className="user-id-display">Username: {user.username}</p>
//             <p className="user-id-display">User ID: {user.user_id}</p>
//           </>
//         )}

//         {error && (
//           <Alert variant="danger" className="mt-3 mb-3">
//             {error}
//           </Alert>
//         )}

//         <Form onSubmit={handleSubmit}>
//           <Form.Group className="mb-3">
//             <Form.Label>Security Question 1</Form.Label>
//             <Form.Select
//               className="security-select"
//               value={q1}
//               onChange={(e) => setQ1(e.target.value)}
//               required
//             >
//               <option value="">Select Question 1</option>
//               {SECURITY_QUESTION_CHOICES.map((question, idx) => (
//                 <option key={`q1-${idx}`} value={question}>
//                   {question}
//                 </option>
//               ))}
//             </Form.Select>
//             <Form.Control
//               type="text"
//               className="security-input mt-2"
//               placeholder="Your answer"
//               value={a1}
//               onChange={(e) => setA1(e.target.value)}
//               required
//             />
//           </Form.Group>

//           <Form.Group className="mb-3">
//             <Form.Label>Security Question 2</Form.Label>
//             <Form.Select
//               className="security-select"
//               value={q2}
//               onChange={(e) => setQ2(e.target.value)}
//               required
//             >
//               <option value="">Select Question 2</option>
//               {SECURITY_QUESTION_CHOICES.map((question, idx) => (
//                 <option key={`q2-${idx}`} value={question}>
//                   {question}
//                 </option>
//               ))}
//             </Form.Select>
//             <Form.Control
//               type="text"
//               className="security-input mt-2"
//               placeholder="Your answer"
//               value={a2}
//               onChange={(e) => setA2(e.target.value)}
//               required
//             />
//           </Form.Group>

//           <Form.Group className="mb-3">
//             <Form.Label>Set Your Password</Form.Label>
//             <InputGroup>
//               <InputGroup.Text>
//                 <FaLock />
//               </InputGroup.Text>
//               <Form.Control
//                 type={showPassword ? "text" : "password"}
//                 placeholder="Enter Password"
//                 value={password}
//                 onChange={(e) => setPassword(e.target.value)}
//                 required
//                 minLength={8}
//               />
//               <Button
//                 variant="outline-secondary"
//                 onClick={() => setShowPassword(!showPassword)}
//               >
//                 {showPassword ? <EyeSlashFill /> : <EyeFill />}
//               </Button>
//             </InputGroup>
//           </Form.Group>

//           <Form.Group className="mb-3">
//             <Form.Label>Confirm Password</Form.Label>
//             <InputGroup>
//               <InputGroup.Text>
//                 <FaLock />
//               </InputGroup.Text>
//               <Form.Control
//                 type={showConfirmPassword ? "text" : "password"}
//                 placeholder="Confirm Password"
//                 value={confirmPassword}
//                 onChange={(e) => setConfirmPassword(e.target.value)}
//                 required
//                 minLength={8}
//               />
//               <Button
//                 variant="outline-secondary"
//                 onClick={() => setShowConfirmPassword(!showConfirmPassword)}
//               >
//                 {showConfirmPassword ? <EyeSlashFill /> : <EyeFill />}
//               </Button>
//             </InputGroup>
//           </Form.Group>

//           <Button
//             type="submit"
//             className="setpass-submit-button shadow mt-3"
//             disabled={loading}
//           >
//             {loading ? "Saving..." : "Complete Registration"}
//           </Button>
//         </Form>
//       </div>
//     </div>
//   );
// };

// export default SignupSetPassword;







import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { FaArrowLeft, FaLock } from "react-icons/fa";
import { EyeFill, EyeSlashFill } from "react-bootstrap-icons";
import axios from "axios";
import { Button, InputGroup, Form, Alert, Row, Col } from "react-bootstrap";
import logo from "../Logos/hvac-logo-new.jpg";
import "./SignupSetPassword.css";
import baseURL from '../ApiUrl/Apiurl';

const SECURITY_QUESTION_CHOICES = [
  "What is your mother's maiden name?",
  "What was the name of your first pet?",
  "What was your first car?",
  "What is the name of the town where you were born?",
  "What was your childhood nickname?",
];

const SignupSetPassword = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [q1, setQ1] = useState("");
  const [q2, setQ2] = useState("");
  const [a1, setA1] = useState("");
  const [a2, setA2] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(null);

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (location.state?.user) {
      setUser(location.state.user);
    } else {
      navigate("/signup");
    }
  }, [location, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match!");
      return;
    }

    if (!q1 || !q2) {
      setError("Please select both security questions");
      return;
    }

    if (!a1 || !a2) {
      setError("Please provide answers for both security questions");
      return;
    }

    if (!user?.user_id) {
      setError("User information is missing");
      return;
    }

    setLoading(true);
    try {
      const response = await axios.put(`${baseURL}/users/${user.user_id}/`, {
        password: password,
        security_question1: q1,
        security_question2: q2,
        security_answer1: a1,
        security_answer2: a2,
        is_registered_by_user: true,
      });

      if (response.data && (response.data.success || response.data.status === "success")) {
        alert("Registration completed successfully!");
        navigate("/", { replace: true });
      } else {
        setError(response.data?.message || "Failed to complete registration");
      }
    } catch (error) {
      console.error("Error completing registration:", error);
      setError(
        error.response?.data?.message || 
        error.message ||
        "An error occurred. Please try again later."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="security-container">
      <div className="security-card">
        <Button 
          variant="link" 
          className="security-back-button" 
          onClick={() => navigate("/signup")}
        >
          <FaArrowLeft size={20} />
        </Button>

        <div className="security-logo-container">
          <img src={logo} alt="HVAC Logo" className="security-logo" />
        </div>

        <h4 className="security-title">Complete Your Registration</h4>
        {/* {user && (
          <>
            <p className="user-id-display">Username: {user.username}</p>
            <p className="user-id-display">User ID: {user.user_id}</p>
          </>
        )} */}

        {error && (
          <Alert variant="danger" className="mt-3 mb-3">
            {error}
          </Alert>
        )}

        <Form onSubmit={handleSubmit}>
          <Row className="security-row">
            <Col md={6} className="security-col">
              <Form.Group className="mb-3">
                <Form.Label>Security Question 1</Form.Label>
                <Form.Select
                  className="security-select"
                  value={q1}
                  onChange={(e) => setQ1(e.target.value)}
                  required
                >
                  <option value="">Select Question 1</option>
                  {SECURITY_QUESTION_CHOICES.map((question, idx) => (
                    <option key={`q1-${idx}`} value={question}>
                      {question}
                    </option>
                  ))}
                </Form.Select>
                <Form.Control
                  type="text"
                  className="security-input mt-2"
                  placeholder="Your answer"
                  value={a1}
                  onChange={(e) => setA1(e.target.value)}
                  required
                />
              </Form.Group>
            </Col>

            <Col md={6} className="security-col">
              <Form.Group className="mb-3">
                <Form.Label>Security Question 2</Form.Label>
                <Form.Select
                  className="security-select"
                  value={q2}
                  onChange={(e) => setQ2(e.target.value)}
                  required
                >
                  <option value="">Select Question 2</option>
                  {SECURITY_QUESTION_CHOICES.map((question, idx) => (
                    <option key={`q2-${idx}`} value={question}>
                      {question}
                    </option>
                  ))}
                </Form.Select>
                <Form.Control
                  type="text"
                  className="security-input mt-2"
                  placeholder="Your answer"
                  value={a2}
                  onChange={(e) => setA2(e.target.value)}
                  required
                />
              </Form.Group>
            </Col>
          </Row>

          <Row className="security-row">
            <Col md={6} className="security-col">
              <Form.Group className="mb-3">
                <Form.Label>Set Your Password</Form.Label>
                <InputGroup>
                  <InputGroup.Text>
                    <FaLock />
                  </InputGroup.Text>
                  <Form.Control
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    minLength={8}
                  />
                  <Button
                    variant="outline-secondary"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeSlashFill /> : <EyeFill />}
                  </Button>
                </InputGroup>
              </Form.Group>
            </Col>

            <Col md={6} className="security-col">
              <Form.Group className="mb-3">
                <Form.Label>Confirm Password</Form.Label>
                <InputGroup>
                  <InputGroup.Text>
                    <FaLock />
                  </InputGroup.Text>
                  <Form.Control
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Confirm Password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    minLength={8}
                  />
                  <Button
                    variant="outline-secondary"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? <EyeSlashFill /> : <EyeFill />}
                  </Button>
                </InputGroup>
              </Form.Group>
            </Col>
          </Row>

          <Button
            type="submit"
            className="setpass-submit-button shadow mt-3"
            disabled={loading}
          >
            {loading ? "Saving..." : "Complete Registration"}
          </Button>
        </Form>
      </div>
    </div>
  );
};

export default SignupSetPassword;


