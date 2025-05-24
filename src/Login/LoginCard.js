// import React from "react";
// import {
//   Container,
//   Row,
//   Col,
//   Card,
//   Form,
//   Button,
//   Alert,
//   InputGroup,
// } from "react-bootstrap";
// import { EyeFill, EyeSlashFill } from "react-bootstrap-icons";
// import logo from "../Images/hvac-company-flame.jpg";

// const LoginCard = ({
//   title,
//   email,
//   password,
//   showPassword,
//   setEmail,
//   setPassword,
//   setShowPassword,
//   handleSubmit,
//   error,
//   success,
// }) => (
//   <Container
//     fluid
//     className="d-flex vh-100 align-items-center justify-content-center bg-light"
//   >
//     <Row className="w-100 justify-content-center">
//       <Col xs={12} sm={8} md={6} lg={4}>
//         <Card className="shadow-lg p-3">
//           <Card.Body>
//             <div className="text-center mb-4">
//               <img
//                 src={logo}
//                 alt="Company Logo"
//                 style={{ maxWidth: "120px", height: "120px" }}
//               />
//             </div>
//             <h3 className="text-center mb-3">{title}</h3>

//             {error && <Alert variant="danger">{error}</Alert>}
//             {success && <Alert variant="success">{success}</Alert>}

//             <Form onSubmit={handleSubmit}>
//               <Form.Group className="mb-3" controlId="formBasicEmail">
//                 <Form.Label>Email address</Form.Label>
//                 <Form.Control
//                   type="email"
//                   placeholder="Enter email"
//                   value={email}
//                   onChange={(e) => setEmail(e.target.value)}
//                   required
//                 />
//               </Form.Group>

//               <Form.Group className="mb-3" controlId="formBasicPassword">
//                 <Form.Label>Password</Form.Label>
//                 <InputGroup>
//                   <Form.Control
//                     type={showPassword ? "text" : "password"}
//                     placeholder="Password"
//                     value={password}
//                     onChange={(e) => setPassword(e.target.value)}
//                     required
//                   />
//                   <Button
//                     variant="outline-secondary"
//                     onClick={() => setShowPassword(!showPassword)}
//                     tabIndex={-1}
//                   >
//                     {showPassword ? <EyeSlashFill /> : <EyeFill />}
//                   </Button>
//                 </InputGroup>
//               </Form.Group>

//               <div className="d-grid">
//                 <Button variant="primary" type="submit">
//                   Login
//                 </Button>
//               </div>
//             </Form>
//           </Card.Body>
//         </Card>
//       </Col>
//     </Row>
//   </Container>
// );

// export default LoginCard;









// LoginCard.js
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
import logo from "../Logos/hvac-logo-new.jpg";

const LoginCard = ({
  title,
  email,
  password,
  showPassword,
  setEmail,
  setPassword,
  setShowPassword,
  handleSubmit,
  error,
}) => {
  return (
    <Container className="mt-5">
      <Row className="justify-content-center">
        <Col md={6} lg={4}>
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
                  <Form.Label>Email address</Form.Label>
                  <Form.Control
                    type="email"
                    placeholder="Enter email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
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

                <Button variant="primary" type="submit" className="w-100">
                  Login
                </Button>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default LoginCard;