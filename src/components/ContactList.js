import React, { useState, useEffect } from "react";
import { collection, addDoc, getDocs, orderBy, query } from "firebase/firestore";
import { db } from "./firebase"; // Adjust the path based on your folder structure
import "./ContactList.css";

const ContactList = () => {
  const [contacts, setContacts] = useState([]);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [email, setEmail] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortConfig, setSortConfig] = useState({ key: "firstName", direction: "ascending" });

  // Fetch contacts from Firestore
  useEffect(() => {
    const fetchContacts = async () => {
      const q = query(collection(db, "contacts"), orderBy("firstName"));
      const querySnapshot = await getDocs(q);
      const contactsArray = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setContacts(contactsArray);
    };
    fetchContacts();
  }, []);

  // Add new contact to Firestore
  const handleAddContact = async (e) => {
    e.preventDefault();
    if (!firstName || !lastName || !phoneNumber) {
      alert("First Name, Last Name, and Phone Number are required.");
      return;
    }
    const newContact = {
      firstName,
      lastName,
      phoneNumber,
      email,
    };

    try {
      await addDoc(collection(db, "contacts"), newContact);
      setContacts([...contacts, newContact]);
      setFirstName("");
      setLastName("");
      setPhoneNumber("");
      setEmail("");
      alert("Contact added successfully");
    } catch (error) {
      console.error("Error adding contact: ", error);
    }
  };

  // Filter contacts based on search query
  const filteredContacts = contacts.filter((contact) => {
    const query = searchQuery.toLowerCase();
    return (
      contact.firstName.toLowerCase().includes(query) ||
      contact.lastName.toLowerCase().includes(query) ||
      contact.phoneNumber.includes(query)
    );
  });

  // Sort contacts based on configuration
  const sortedContacts = [...filteredContacts].sort((a, b) => {
    if (a[sortConfig.key] < b[sortConfig.key]) {
      return sortConfig.direction === "ascending" ? -1 : 1;
    }
    if (a[sortConfig.key] > b[sortConfig.key]) {
      return sortConfig.direction === "ascending" ? 1 : -1;
    }
    return 0;
  });

  // Handle sort configuration change
  const handleSortChange = (key) => {
    setSortConfig((prevConfig) => ({
      key,
      direction: prevConfig.direction === "ascending" ? "descending" : "ascending",
    }));
  };
  
  return (
    <div className="contact-list-container">
      <h2>Contact List</h2>
      <form className="add-contact-form" onSubmit={handleAddContact}>
        <input
          type="text"
          placeholder="First Name"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Last Name"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
          required
        />
        <input
          type="tel"
          placeholder="Phone Number"
          value={phoneNumber}
          onChange={(e) => setPhoneNumber(e.target.value)}
          required
        />
        <input
          type="email"
          placeholder="Email Address (optional)"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <button type="submit">Add Contact</button>
      </form>

      <input
        type="text"
        className="search-bar"
        placeholder="Search contacts..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />

      <div className="sort-buttons">
        <button onClick={() => handleSortChange("firstName")}>
          Sort by First Name ({sortConfig.direction})
        </button>
        <button onClick={() => handleSortChange("lastName")}>
          Sort by Last Name ({sortConfig.direction})
        </button>
      </div>

      <ul className="contact-list">
        {sortedContacts.map((contact, index) => (
          <li key={index} className="contact-item">
            <span>
              <strong>{contact.firstName} {contact.lastName}</strong>
            </span>
            <span>{contact.phoneNumber}</span>
            {contact.email && <span>{contact.email}</span>}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ContactList;
