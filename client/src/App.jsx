import { useEffect, useState } from "react";
import "./App.css";
import axios from "axios";

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

    // live email validation
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
      const res = await axios.get("VITE_API_URL/api/contacts");
      setContacts(res.data.contacts);
    } catch (error) {
      console.error(error);
      alert("❌ Failed to fetch contacts");
    }
  };

  const submit = async () => {
    if (!emailRegex.test(values.email)) {
      setEmailError("Please enter a valid email address");
      alert("❌ Invalid email");
      return;
    }

    try {
      await axios.post("VITE_API_URL/api/contacts", values);

      alert("✅ Contact saved successfully!");

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
      await axios.delete(`http://localhost:1000/api/contacts/${id}`);
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
      <section className="hero-section">
        <div className="contact-wrapper">
          <div className="contact-info">
            <h2>Contact Management</h2>
            <p>Have a question or business inquiry? Reach out to us.</p>
            <p>Provide accurate contact details so we can respond quickly.</p>
          </div>

          <div className="contact-form">
            <h1>Contact Form</h1>

            <div className="row">
              <div className="form-group">
                <label>First Name*</label>
                <input
                  type="text"
                  name="firstName"
                  value={values.firstName}
                  onChange={change}
                  placeholder="Enter first name"
                />
              </div>

              <div className="form-group">
                <label>Last Name*</label>
                <input
                  type="text"
                  name="lastName"
                  value={values.lastName}
                  onChange={change}
                  placeholder="Enter last name"
                />
              </div>
            </div>

            <div className="row">
              <div className="form-group">
                <label>Email*</label>
                <input
                  type="email"
                  name="email"
                  value={values.email}
                  onChange={change}
                  className={emailError ? "input-error" : ""}
                  placeholder="example@gmail.com"
                />
                {emailError && (
                  <p className="error-text">{emailError}</p>
                )}
              </div>

              <div className="form-group">
                <label>Phone No.*</label>
                <input
                  type="text"
                  name="phone"
                  value={values.phone}
                  onChange={change}
                  placeholder="9XXXXXXXXX"
                />
              </div>
            </div>

            <div className="form-group">
              <label>Message</label>
              <textarea
                name="message"
                value={values.message}
                onChange={change}
                placeholder="Optional message..."
              />
            </div>

            <button onClick={submit} disabled={isInvalid}>
              Submit
            </button>
          </div>
        </div>
      </section>

      <section className="contacts-section">
        <div className="saved-contacts">
          <h2>Saved Contacts</h2>

          {contacts.length === 0 ? (
            <p className="empty">No contacts found</p>
          ) : (
            <div className="contact-cards">
              {contacts.map((c) => (
                <div className="contact-card" key={c._id}>
                  <div>
                    <h3>
                      {c.firstName} {c.lastName}
                    </h3>
                    <p><strong>Email:</strong> {c.email}</p>
                    <p><strong>Phone:</strong> {c.phone}</p>
                    {c.message && (
                      <p><strong>Message:</strong> {c.message}</p>
                    )}
                  </div>

                  <button
                    className="delete-btn"
                    onClick={() => deleteContact(c._id)}
                  >
                    Delete
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default App;
