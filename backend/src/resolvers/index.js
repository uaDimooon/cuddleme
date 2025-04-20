import { db } from '../config/db.js';
import { handleNaturalRequest } from '../conversation/handler.js';

export const resolvers = {
  Query: {
    sitter: async (_, { id }) => {
      const { rows } = await db.query('SELECT * FROM sitter WHERE id = $1', [id]);
      return rows[0];
    },
    allSitters: async () => {
      const { rows } = await db.query('SELECT * FROM sitter');
      return rows;
    },
    family: async (_, { id }) => {
      const { rows } = await db.query('SELECT * FROM family WHERE id = $1', [id]);
      return rows[0];
    },
    familiesBySitter: async (_, { sitterId }) => {
      const { rows } = await db.query('SELECT * FROM family WHERE sitter_id = $1', [sitterId]);
      return rows;
    },
    bookingsBySitter: async (_, { sitterId }) => {
      const { rows } = await db.query('SELECT * FROM booking WHERE sitter_id = $1', [sitterId]);
      return rows;
    }
  },

  Mutation: {
    createSitter: async (_, { name, email, passwordHash }) => {
      const { rows } = await db.query(
        'INSERT INTO sitter (name, email, password_hash) VALUES ($1, $2, $3) RETURNING *',
        [name, email, passwordHash]
      );
      return rows[0];
    },
    createFamily: async (_, { sitterId, familyName, dogNames, parentNames }) => {
      const { rows: familyRows } = await db.query(
        'INSERT INTO family (name, sitter_id) VALUES ($1, $2) RETURNING *',
        [familyName, sitterId]
      );
      const familyId = familyRows[0].id;

      // Create dogs
      dogNames.forEach(async (name) => {
        await db.query('INSERT INTO dog (name, family_id) VALUES ($1, $2)', [name, familyId]);
      });

      // Create parents
      parentNames.forEach(async (name) => {
        await db.query('INSERT INTO parent (name, family_id) VALUES ($1, $2)', [name, familyId]);
      });

      return familyRows[0];
    },
    createBooking: async (_, { sitterId, familyId, dogId, startTime, endTime, notes }) => {
      const { rows } = await db.query(
        'INSERT INTO booking (sitter_id, family_id, dog_id, start_time, end_time, notes) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
        [sitterId, familyId, dogId, startTime, endTime, notes]
      );
      return rows[0];
    },
    updateBooking: async (_, { bookingId, startTime, endTime, notes }) => {
      const { rows } = await db.query(
        'UPDATE booking SET start_time = COALESCE($1, start_time), end_time = COALESCE($2, end_time), notes = COALESCE($3, notes) WHERE id = $4 RETURNING *',
        [startTime, endTime, notes, bookingId]
      );
      return rows[0];
    },
    handleNaturalRequest
  },

  Sitter: {
    families: async (sitter) => {
      const { rows } = await db.query('SELECT * FROM family WHERE sitter_id = $1', [sitter.id]);
      return rows;
    },
    bookings: async (sitter) => {
      const { rows } = await db.query('SELECT * FROM booking WHERE sitter_id = $1', [sitter.id]);
      return rows;
    }
  },

  Family: {
    parents: async (family) => {
      const { rows } = await db.query('SELECT * FROM parent WHERE family_id = $1', [family.id]);
      return rows;
    },
    dogs: async (family) => {
      const { rows } = await db.query('SELECT * FROM dog WHERE family_id = $1', [family.id]);
      return rows;
    },
    bookings: async (family) => {
      const { rows } = await db.query('SELECT * FROM booking WHERE family_id = $1', [family.id]);
      return rows;
    }
  },

  Booking: {
    sitter: async (booking) => {
      const { rows } = await db.query('SELECT * FROM sitter WHERE id = $1', [booking.sitter_id]);
      return rows[0];
    },
    family: async (booking) => {
      const { rows } = await db.query('SELECT * FROM family WHERE id = $1', [booking.family_id]);
      return rows[0];
    },
    dog: async (booking) => {
      const { rows } = await db.query('SELECT * FROM dog WHERE id = $1', [booking.dog_id]);
      return rows[0];
    }
  }
};
