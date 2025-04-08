-- contacts table
CREATE TABLE contacts (
    id SERIAL PRIMARY KEY,
    phone_number VARCHAR NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- messages table
CREATE TABLE messages (
    id SERIAL PRIMARY KEY,
    contact_id INTEGER NOT NULL,
    content TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT contact_fk
      FOREIGN KEY (contact_id)
      REFERENCES contacts(id)
      ON DELETE CASCADE
);