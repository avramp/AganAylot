import React, { useState, useMemo } from 'react';
import { Search } from 'lucide-react';
import ContactCard from './components/ContactCard';
import contactsData from './data/contacts.json';

function App() {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredContacts = useMemo(() => {
    if (!searchTerm) return contactsData;

    const lowerTerm = searchTerm.toLowerCase();
    const cleanTerm = searchTerm.replace(/\D/g, ''); // Term with only digits
    const searchTokens = lowerTerm.split(/\s+/).filter(t => t.length > 0);

    return contactsData.filter(contact => {
      // 1. Phone Search (High Priority)
      // If the user typed something that looks like a phone number (has digits), 
      // check if it matches any phone number in the record (normalized).
      if (cleanTerm.length > 2) {
        const phones = [
          contact.mobileFather,
          contact.mobileMother,
          contact.landline
        ].map(p => p ? p.toString().replace(/\D/g, '') : '');

        // If the cleaned search term is found in any phone number, it's a match.
        if (phones.some(p => p.includes(cleanTerm))) return true;
      }

      // 2. Text Search (Multi-token)
      // Check if ALL tokens from the search query are present in the contact info
      return searchTokens.every(token => {
        // Heuristic: If token is a short number (<= 3 digits), 
        // assume it's a House Number or part of the Name/Address, NOT a phone snippet.
        // This prevents "Street 35" from matching a phone number like "050...35..."
        const isShortNumber = /^\d{1,3}$/.test(token);

        if (isShortNumber) {
          const nonPhoneFields = `
             ${contact.firstName} 
             ${contact.lastName} 
             ${contact.street} 
             ${contact.houseNum}
           `.toLowerCase();
          return nonPhoneFields.includes(token);
        }

        // Otherwise, search everywhere
        const allFields = `
          ${contact.firstName} 
          ${contact.lastName} 
          ${contact.street} 
          ${contact.houseNum} 
          ${contact.mobileFather} 
          ${contact.mobileMother} 
          ${contact.landline}
        `.toLowerCase();

        return allFields.includes(token);
      });
    });
  }, [searchTerm]);

  return (
    <div className="app-container">
      <div className="search-container">
        <div className="search-input-wrapper">
          <input
            type="text"
            className="search-input"
            placeholder="חיפוש שם, כתובת, או טלפון..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            autoFocus
          />
          <Search className="search-icon" size={20} />
        </div>
      </div>

      <div className="contact-list">
        {filteredContacts.length > 0 ? (
          filteredContacts.map(contact => (
            <ContactCard key={contact.id} contact={contact} />
          ))
        ) : (
          <div className="empty-state">
            לא נמצאו תוצאות עבור "{searchTerm}"
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
