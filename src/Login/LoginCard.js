
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
                    style={{ width: "150px", height: "80px" }}
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
                    />
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>Password</Form.Label>
                    <InputGroup>
                      <Form.Control
                        type={showPassword ? "text" : "password"}
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                      />
                      <Button
                        variant="outline-secondary"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <EyeSlashFill /> : <EyeFill />}
                      </Button>
                    </InputGroup>
                  </Form.Group>

                  <Button
                    style={{backgroundColor:'#0096D6'}}
                    type="submit"
                    className="loginButton shadow"
                  >
                    Login
                  </Button>

                  <p className="orText text-center mt-3 mb-3">Or</p>
                  <p className="registerText text-center">
                    Don't have an account?{' '}
                    <span 
                      className="registerLink" 
                      style={{color: '#0096D6', cursor: 'pointer'}}
                      onClick={() => navigate('/signup')}
                    >
                      Register
                    </span>
                  </p>
                </Form>
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