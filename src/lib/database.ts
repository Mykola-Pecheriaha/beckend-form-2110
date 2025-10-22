import { Pool } from 'pg'

// Database connection with fallback support
const createDatabasePool = () => {
  // Try multiple environment variables
  const databaseUrl = 
    process.env.DB_CONNECTION_STRING ||
    process.env.DATABASE_URL ||
    process.env.POSTGRES_URL ||
    'postgresql://postgres:postgres@localhost:5432/medical_consultations'

  console.log('🐘 PostgreSQL connection:', {
    environment: process.env.NODE_ENV,
    vercel: !!process.env.VERCEL,
    urlType: databaseUrl.split(':')[0],
    hasConnection: !!databaseUrl
  })

  return new Pool({
    connectionString: databaseUrl,
    ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
    max: 20,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 2000,
  })
}

export const db = createDatabasePool()

// Database types
export interface Consultation {
  id: number
  created_at: Date
  name: string
  age?: number | null
  gender?: string | null
  phone?: string | null
  height?: number | null
  weight?: number | null
  complaints?: string | null
  examinations?: string | null
  chronic_diseases?: string | null
  has_chronic_diseases: boolean
  medications?: string | null
  takes_medications: boolean
  pain_level?: number | null
  has_allergy: boolean
  allergies?: string | null
  additional_notes?: string | null
}

// Database operations
export const consultationQueries = {
  // Get all consultations
  async getAll(): Promise<Consultation[]> {
    const result = await db.query('SELECT * FROM consultations ORDER BY created_at DESC')
    return result.rows
  },

  // Get consultation by ID
  async getById(id: number): Promise<Consultation | null> {
    const result = await db.query('SELECT * FROM consultations WHERE id = $1', [id])
    return result.rows[0] || null
  },

  // Create new consultation
  async create(data: Omit<Consultation, 'id' | 'created_at'>): Promise<Consultation> {
    const query = `
      INSERT INTO consultations (
        name, age, gender, phone, height, weight, complaints, examinations,
        chronic_diseases, has_chronic_diseases, medications, takes_medications,
        pain_level, has_allergy, allergies, additional_notes
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16)
      RETURNING *
    `
    
    const values = [
      data.name, data.age, data.gender, data.phone, data.height, data.weight,
      data.complaints, data.examinations, data.chronic_diseases, data.has_chronic_diseases,
      data.medications, data.takes_medications, data.pain_level, data.has_allergy,
      data.allergies, data.additional_notes
    ]

    const result = await db.query(query, values)
    return result.rows[0]
  },

  // Update consultation
  async update(id: number, data: Partial<Omit<Consultation, 'id' | 'created_at'>>): Promise<Consultation | null> {
    const fields = Object.keys(data).map((key, index) => `${key} = $${index + 2}`).join(', ')
    const values = [id, ...Object.values(data)]
    
    const query = `UPDATE consultations SET ${fields} WHERE id = $1 RETURNING *`
    const result = await db.query(query, values)
    return result.rows[0] || null
  },

  // Delete consultation
  async delete(id: number): Promise<boolean> {
    const result = await db.query('DELETE FROM consultations WHERE id = $1', [id])
    return (result.rowCount || 0) > 0
  },

  // Count consultations
  async count(): Promise<number> {
    const result = await db.query('SELECT COUNT(*) as count FROM consultations')
    return parseInt(result.rows[0].count)
  },

  // Test connection and create table if not exists
  async testConnection(): Promise<{ success: boolean, error?: string }> {
    try {
      await db.query('SELECT 1')
      
      // Try to create table if it doesn't exist
      await this.createTableIfNotExists()
      
      return { success: true }
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error'
      }
    }
  },

  // Create consultations table if it doesn't exist
  async createTableIfNotExists(): Promise<void> {
    const createTableQuery = `
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
      )
    `
    
    try {
      await db.query(createTableQuery)
      console.log('✅ Consultations table ready')
    } catch (error) {
      console.warn('⚠️ Could not create table:', error)
    }
  }
}
