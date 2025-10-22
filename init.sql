-- Initialize medical consultations database
-- This script runs when the PostgreSQL container starts for the first time

CREATE TABLE IF NOT EXISTS consultations (
  id SERIAL PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  
  -- Patient Information
  name VARCHAR(255) NOT NULL,
  age INTEGER,
  gender VARCHAR(50),
  phone VARCHAR(100),
  height INTEGER,
  weight INTEGER,
  
  -- Medical Information
  complaints TEXT,
  examinations TEXT,
  
  -- Medical History
  chronic_diseases TEXT,
  has_chronic_diseases BOOLEAN DEFAULT FALSE,
  medications TEXT,
  takes_medications BOOLEAN DEFAULT FALSE,
  
  -- Additional Information
  pain_level INTEGER,
  has_allergy BOOLEAN DEFAULT FALSE,
  allergies TEXT,
  additional_notes TEXT
);

-- Insert sample consultation for testing
INSERT INTO consultations (
  name, 
  age, 
  gender, 
  phone, 
  complaints, 
  has_chronic_diseases,
  chronic_diseases,
  additional_notes
) VALUES (
  'Тестовий пацієнт',
  35,
  'чоловіча',
  '+380123456789',
  'Головний біль, запаморочення',
  false,
  null,
  'Створено автоматично при ініціалізації Docker PostgreSQL'
) ON CONFLICT DO NOTHING;