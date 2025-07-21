import React, { useEffect, useState } from "react";

const ContactList = () => {
  const [contacts, setContacts] = useState([]);

  useEffect(() => {
    // WebSocket connection to the Django Channels server
    const socket = new WebSocket("ws://175.29.21.7:8083/ws/contact/");

    socket.onopen = () => {
      console.log("✅ WebSocket connected");
    };

    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      console.log("📩 New message from server:", data);

      // Assume server sends a list or single contact update
      setContacts(prev => [data, ...prev]);
    };

    socket.onclose = () => {
      console.log("❌ WebSocket disconnected");
    };

    socket.onerror = (error) => {
      console.error("WebSocket error:", error);
    };

    return () => {
      socket.close(); // cleanup
    };
  }, []);

  return (
    <div className="container mt-4">
      <h3>Live Contact List</h3>
      <ul className="list-group">
        {contacts.map((contact, idx) => (
          <li key={idx} className="list-group-item">
            <strong>{contact.name}</strong> — {contact.email} <br />
            <em>{contact.message}</em>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ContactList;
