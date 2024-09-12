import React, { useState, useEffect } from "react";
import { collection, addDoc, updateDoc, deleteDoc, doc, orderBy, query, getDocs } from "firebase/firestore";
import { db } from "./firebase"; // Adjust the path based on your folder structure
import "./ContactList.css";
import { FaEdit, FaTrashAlt } from "react-icons/fa"; // Import icons from react-icons

const ContactList = () => {
  const [contacts, setContacts] = useState([]);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [email, setEmail] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortConfig, setSortConfig] = useState({ key: "firstName", direction: "ascending" });
  const [isEditing, setIsEditing] = useState(false);
  const [currentContactId, setCurrentContactId] = useState(null);

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

  // Add or update contact in Firestore
  const handleAddOrUpdateContact = async (e) => {
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
      if (isEditing) {
        // Update contact
        const contactDoc = doc(db, "contacts", currentContactId);
        await updateDoc(contactDoc, newContact);
        setContacts((prevContacts) =>
          prevContacts.map((contact) =>
            contact.id === currentContactId ? { id: currentContactId, ...newContact } : contact
          )
        );
        alert("Contact updated successfully");
      } else {
        // Add new contact
        const docRef = await addDoc(collection(db, "contacts"), newContact);
        setContacts([...contacts, { id: docRef.id, ...newContact }]);
        alert("Contact added successfully");
      }
      setFirstName("");
      setLastName("");
      setPhoneNumber("");
      setEmail("");
      setIsEditing(false);
      setCurrentContactId(null);
    } catch (error) {
      console.error("Error adding or updating contact: ", error);
    }
  };

  // Start editing a contact
  const handleEditContact = (contact) => {
    setFirstName(contact.firstName);
    setLastName(contact.lastName);
    setPhoneNumber(contact.phoneNumber);
    setEmail(contact.email);
    setIsEditing(true);
    setCurrentContactId(contact.id);
  };

  // Delete contact from Firestore
  const handleDeleteContact = async (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this contact?");
    if (!confirmDelete) return;

    try {
      await deleteDoc(doc(db, "contacts", id));
      setContacts(contacts.filter((contact) => contact.id !== id));
      alert("Contact deleted successfully");
    } catch (error) {
      console.error("Error deleting contact: ", error);
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
      
      <div className="contact-form-container">
        <form className="add-contact-form" onSubmit={handleAddOrUpdateContact}>
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
          <button type="submit">{isEditing ? "Update Contact" : "Add Contact"}</button>
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
      </div>
  
      <div className="contact-table-container">
        <table className="contact-table">
          <thead>
            <tr>
              <th>First Name</th>
              <th>Last Name</th>
              <th>Phone Number</th>
              <th>Email</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {sortedContacts.map((contact) => (
              <tr key={contact.id}>
                <td data-label="First Name">{contact.firstName}</td>
                <td data-label="Last Name">{contact.lastName}</td>
                <td data-label="Phone Number">{contact.phoneNumber}</td>
                <td data-label="Email">{contact.email || "N/A"}</td>
                <td data-label="Actions">
                  <button className="edit-button" onClick={() => handleEditContact(contact)}>
                    <FaEdit />
                  </button>
                  <button className="delete-button" onClick={() => handleDeleteContact(contact.id)}>
                    <FaTrashAlt />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ContactList;
