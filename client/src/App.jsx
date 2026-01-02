import { useEffect, useState } from "react";
import "./App.css";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

const App = () => {
  const [values, setValues] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    message: "",
  });

  const [emailError, setEmailError] = useState("");
  const [contacts, setContacts] = useState([]);

  const change = (e) => {
    const { name, value } = e.target;
    setValues({ ...values, [name]: value });

    if (name === "email") {
      if (!emailRegex.test(value)) {
        setEmailError("Please enter a valid email address");
      } else {
        setEmailError("");
      }
    }
  };

  const fetchContacts = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/contacts`);
      setContacts(res.data.contacts);
    } catch (error) {
      console.error(error);
      alert("❌ Failed to fetch contacts");
    }
  };

  const submit = async () => {
    if (!emailRegex.test(values.email)) {
      setEmailError("Please enter a valid email address");
      return;
    }

    try {
      await axios.post(`${API_URL}/api/contacts`, values);

      alert("✅ Contact saved successfully");

      setValues({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        message: "",
      });

      setEmailError("");
      fetchContacts();
    } catch (error) {
      console.error(error);
      alert("❌ Failed to save contact");
    }
  };

  const deleteContact = async (id) => {
    try {
      await axios.delete(`${API_URL}/api/contacts/${id}`);
      alert("🗑️ Contact deleted");
      fetchContacts();
    } catch (error) {
      console.error(error);
      alert("❌ Failed to delete contact");
    }
  };

  useEffect(() => {
    fetchContacts();
  }, []);

  const isInvalid =
    !values.firstName ||
    !values.lastName ||
    !values.phone ||
    !emailRegex.test(values.email);

  return (
    <div className="page">
      <h1>Contact Form</h1>

      <input
        name="firstName"
        placeholder="First Name"
        value={values.firstName}
        onChange={change}
      />

      <input
        name="lastName"
        placeholder="Last Name"
        value={values.lastName}
        onChange={change}
      />

      <input
        name="email"
        placeholder="Email"
        value={values.email}
        onChange={change}
      />
      {emailError && <p style={{ color: "red" }}>{emailError}</p>}

      <input
        name="phone"
        placeholder="Phone"
        value={values.phone}
        onChange={change}
      />

      <textarea
        name="message"
        placeholder="Message (optional)"
        value={values.message}
        onChange={change}
      />

      <button onClick={submit} disabled={isInvalid}>
        Submit
      </button>

      <hr />

      <h2>Saved Contacts</h2>

      {contacts.length === 0 ? (
        <p>No contacts</p>
      ) : (
        contacts.map((c) => (
          <div key={c._id} style={{ border: "1px solid #ccc", margin: 10 }}>
            <p>
              <strong>{c.firstName} {c.lastName}</strong>
            </p>
            <p>{c.email}</p>
            <p>{c.phone}</p>
            {c.message && <p>{c.message}</p>}
            <button onClick={() => deleteContact(c._id)}>Delete</button>
          </div>
        ))
      )}
    </div>
  );
};

export default App;
