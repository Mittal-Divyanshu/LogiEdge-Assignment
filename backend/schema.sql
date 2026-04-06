CREATE TABLE customers (
  id SERIAL PRIMARY KEY,
  name VARCHAR(150) NOT NULL,
  email VARCHAR(150) UNIQUE NOT NULL,
  phone VARCHAR(15),
  address TEXT,
  gstin VARCHAR(15),
  is_gst_registered BOOLEAN DEFAULT FALSE,
  status VARCHAR(10) DEFAULT 'active',
  pan VARCHAR(10),
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE items (
  id SERIAL PRIMARY KEY,
  name VARCHAR(150) NOT NULL,
  description TEXT,
  price NUMERIC(10, 2) NOT NULL,
  unit VARCHAR(30) DEFAULT 'pcs',
  status VARCHAR(10) DEFAULT 'active',
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE invoices (
  id SERIAL PRIMARY KEY,
  invoice_id VARCHAR(10) UNIQUE NOT NULL,
  customer_id INTEGER REFERENCES customers(id),
  subtotal NUMERIC(10, 2) NOT NULL,
  gst_amount NUMERIC(10, 2) DEFAULT 0,
  total NUMERIC(10, 2) NOT NULL,
  is_gst_applied BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE invoice_items (
  id SERIAL PRIMARY KEY,
  invoice_id INTEGER REFERENCES invoices(id) ON DELETE CASCADE,
  item_id INTEGER REFERENCES items(id),
  item_name VARCHAR(150),
  quantity INTEGER NOT NULL,
  price NUMERIC(10, 2) NOT NULL,
  amount NUMERIC(10, 2) NOT NULL
);


