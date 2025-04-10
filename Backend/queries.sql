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

WITH ranked_messages AS (
SELECT 
    m.contact_id,
    m.content AS last_message,
    m.created_at AS last_message_time,
    ROW_NUMBER() OVER (PARTITION BY m.contact_id ORDER BY m.created_at DESC) AS rank
FROM 
    messages m
)
SELECT 
    c.id AS contact_id,
    c.phone_number,
    rm.last_message,
    rm.last_message_time
FROM 
    contacts c
JOIN 
    ranked_messages rm ON c.id = rm.contact_id
WHERE 
    rm.rank = 1
AND (
    c.phone_number ILIKE $3 OR 
    rm.last_message ILIKE $3
)
ORDER BY 
    rm.last_message_time DESC
LIMIT $1 OFFSET $2;