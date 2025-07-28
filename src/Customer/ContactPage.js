import React, { useState } from "react";
import axios from "axios";
import ContactList from "./ContactList";

const ContactForm = () => {
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://175.29.21.7:8083/api/contact/", formData);
      setSubmitted(true);
      alert("submitted");
    } catch (error) {
      console.error("Failed to submit contact form:", error);
    }
  };

  return (
    <div className="container mt-4">
      <h3>Add Contact</h3>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label>Name</label>
            <input
              type="text"
              name="name"
              className="form-control"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>
          <div className="mb-3">
            <label>Email</label>
            <input
              type="email"
              name="email"
              className="form-control"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
          <div className="mb-3">
            <label>Message</label>
            <textarea
              name="message"
              className="form-control"
              value={formData.message}
              onChange={handleChange}
              required
            />
          </div>
          <button type="submit" className="btn btn-success">Submit</button>
        </form>
      <ContactList />
    </div>
  );
};

export default ContactForm;
