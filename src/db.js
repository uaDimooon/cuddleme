import pkg from 'pg'
import dotenv from 'dotenv'
dotenv.config()

const { Pool } = pkg

export const db = new Pool({
  connectionString: process.env.DATABASE_URL,
})

// Test the connection
db.query('SELECT NOW()')
  .then(res => {
    console.log('✅ Connected to PostgreSQL at:', res.rows[0].now)
  })
  .catch(err => {
    console.error('❌ PostgreSQL connection error:', err)
  })
