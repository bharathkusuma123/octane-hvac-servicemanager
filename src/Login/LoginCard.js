
// import React from "react";
// import {
//   Form,
//   Button,
//   Container,
//   Row,
//   Col,
//   Card,
//   Alert,
//   InputGroup,
// } from "react-bootstrap";
// import { EyeFill, EyeSlashFill } from "react-bootstrap-icons";
// import logo from "../Logos/hvac-logo-new.jpg";
// import "./Login.css";

// const LoginCard = ({
//   title,
//   username,
//   password,
//   showPassword,
//   setUsername,
//   setPassword,
//   setShowPassword,
//   handleSubmit,
//   error,
// }) => {
//   return (
//      <div className="d-flex align-items-center justify-content-center min-vh-100">
//     <Container className="mt-3">
//       <Row className="justify-content-center">
//         <Col md={6} lg={4}>
//           <Card className="shadow">
//             <Card.Body>
//               <div className="text-center mb-4">
//                 <img
//                   src={logo}
//                   alt="Company Logo"
//                   style={{ width: "150px", height: "80px" }}
//                 />
//                 <h3 className="mt-3">{title}</h3>
//               </div>

//               {error && <Alert variant="danger">{error}</Alert>}

//               <Form onSubmit={handleSubmit}>
//                 <Form.Group className="mb-3">
//                   <Form.Label>Username</Form.Label>
//                   <Form.Control
//                     type="text"
//                     placeholder="Enter username"
//                     value={username}
//                     onChange={(e) => setUsername(e.target.value)}
//                     required
//                   />
//                 </Form.Group>

//                 <Form.Group className="mb-3">
//                   <Form.Label>Password</Form.Label>
//                   <InputGroup>
//                     <Form.Control
//                       type={showPassword ? "text" : "password"}
//                       placeholder="Password"
//                       value={password}
//                       onChange={(e) => setPassword(e.target.value)}
//                       required
//                     />
//                     <Button
//                       variant="outline-secondary"
//                       onClick={() => setShowPassword(!showPassword)}
//                     >
//                       {showPassword ? <EyeSlashFill /> : <EyeFill />}
//                     </Button>
//                   </InputGroup>
//                 </Form.Group>

//                 <Button
//                 style={{backgroundColor:'#0096D6'}}
//                   type="submit"
//                   className="loginButton shadow"
//                 >
//                   Login
//                 </Button>
//               </Form>
//             </Card.Body>
//           </Card>
//         </Col>
//       </Row>
//     </Container>
//     </div>
//   );
// };

// export default LoginCard;



import React from "react";
import {
  Form,
  Button,
  Container,
  Row,
  Col,
  Card,
  Alert,
  InputGroup,
  Spinner,
} from "react-bootstrap";
import { EyeFill, EyeSlashFill } from "react-bootstrap-icons";
import { useNavigate } from "react-router-dom";
import logo from "../Logos/hvac-logo-new.jpg";
import "./Login.css";

const LoginCard = ({
  title,
  username,
  password,
  showPassword,
  loading,
  setUsername,
  setPassword,
  setShowPassword,
  handleSubmit,
  error,
}) => {

  const navigate = useNavigate();

  return (
    <div className="d-flex align-items-center justify-content-center min-vh-100">
      <Container className="mt-3">
        <Row className="justify-content-center">

          <Col md={6} lg={5} xl={4}>

            <div className="login-card-container">

              <Card className="shadow">

                <Card.Body>

                  <div className="text-center mb-4">
                    <img
                      src={logo}
                      alt="Company Logo"
                      className="security-logo"
                    />
                    <h3 className="mt-3">{title}</h3>
                  </div>

                  {error && <Alert variant="danger">{error}</Alert>}

                  <Form onSubmit={handleSubmit}>

                    <Form.Group className="mb-3">
                      <Form.Label>Username</Form.Label>

                      <Form.Control
                        type="text"
                        placeholder="Enter username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                        disabled={loading}
                      />

                    </Form.Group>

                    <Form.Group className="mb-2">

                      <Form.Label>Password</Form.Label>

                      <InputGroup>

                        <Form.Control
                          type={showPassword ? "text" : "password"}
                          placeholder="Password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          required
                          disabled={loading}
                        />

                        <Button
                          variant="outline-secondary"
                          onClick={() => setShowPassword(!showPassword)}
                          disabled={loading}
                        >
                          {showPassword ? <EyeSlashFill /> : <EyeFill />}
                        </Button>

                      </InputGroup>

                    </Form.Group>

                    {/* Forgot Password */}

                    <div className="text-end mb-3">

                      <span
                        className="forgot"
                        style={{ cursor: "pointer", color: "#0096D6" }}
                        onClick={() => navigate("/forgot-password")}
                      >
                        Forgot Password?
                      </span>

                    </div>

                    <Button
                      style={{ backgroundColor: "#0096D6" }}
                      type="submit"
                      className="loginButton shadow w-100"
                      disabled={loading}
                    >

                      {loading ? (
                        <>
                          <Spinner
                            as="span"
                            animation="border"
                            size="sm"
                            role="status"
                            aria-hidden="true"
                            className="me-2"
                          />
                          Logging in...
                        </>
                      ) : (
                        "Login"
                      )}

                    </Button>

                  </Form>

                  {/* First Time Login */}

                  <p className="registerText text-center mt-3">

                    First time login?{" "}

                    <span
                      className="registerLink"
                      style={{ cursor: "pointer", color: "#0096D6" }}
                      onClick={() => navigate("/signup")}
                    >
                      Set your security questions
                    </span>

                  </p>

                </Card.Body>

              </Card>

            </div>

          </Col>

        </Row>
      </Container>
    </div>
  );
};

export default LoginCard;