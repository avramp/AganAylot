import React from 'react';
import { Phone, MapPin, MessageCircle } from 'lucide-react';

const ContactCard = ({ contact }) => {
    const { lastName, firstName, street, houseNum, mobileFather, mobileMother, landline } = contact;

    const fullName = `${lastName} ${firstName}`;
    const address = `${street} ${houseNum}`.trim();

    const phones = [
        { label: "נייד אב", number: mobileFather, type: 'mobile' },
        { label: "נייד אם", number: mobileMother, type: 'mobile' },
        { label: "בית", number: landline, type: 'landline' }
    ].filter(p => p.number);

    const cleanPhone = (phone) => phone.replace(/\D/g, '');

    return (
        <div className="contact-card">
            <div className="card-header">
                <h3 className="contact-name">{fullName}</h3>
                {address && (
                    <div className="contact-address">
                        <MapPin size={16} />
                        <span>{address}</span>
                    </div>
                )}
            </div>

            <div className="card-actions">
                {phones.map((phone, idx) => (
                    <div key={idx} className="phone-row">
                        <span className="phone-label">{phone.label}:</span>
                        <div className="action-buttons">
                            <a href={`tel:${phone.number}`} className="phone-number">
                                {phone.number}
                            </a>
                            <a href={`tel:${phone.number}`} className="btn-icon btn-call" title="Call">
                                <Phone size={18} />
                            </a>
                            {phone.type === 'mobile' && (
                                <a
                                    href={`https://wa.me/972${cleanPhone(phone.number).substring(1)}`}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="btn-icon btn-whatsapp"
                                    title="WhatsApp"
                                >
                                    <MessageCircle size={18} />
                                </a>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ContactCard;
