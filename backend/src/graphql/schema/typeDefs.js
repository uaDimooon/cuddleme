export const typeDefs = /* GraphQL */ `
  scalar DateTime

  type Sitter {
  id: ID!
  name: String!
  email: String!
  passwordHash: String
  families: [Family!]
  bookings: [Booking!]
}

type Family {
  id: ID!
  name: String!
  sitter: Sitter!
  parents: [Parent!]
  dogs: [Dog!]
  bookings: [Booking!]
}

type Parent {
  id: ID!
  name: String!
  phoneNumber: String
  family: Family!
}

type Dog {
  id: ID!
  name: String!
  breed: String
  careInstructions: String
  family: Family!
}

type Booking {
  id: ID!
  sitter: Sitter!
  family: Family!
  dog: Dog!
  startTime: String!
  endTime: String!
  notes: String
}

type Query {
  sitter(id: ID!): Sitter
  allSitters: [Sitter!]
  family(id: ID!): Family
  familiesBySitter(sitterId: ID!): [Family!]
  bookingsBySitter(sitterId: ID!): [Booking!]
}

type Mutation {
  createSitter(name: String!, email: String!, passwordHash: String!): Sitter!
  createFamily(sitterId: ID!, familyName: String!, dogNames: [String!], parentNames: [String!]): Family!
  createBooking(sitterId: ID!, familyId: ID!, dogId: ID!, startTime: String!, endTime: String!, notes: String): Booking!
  updateBooking(bookingId: ID!, startTime: String, endTime: String, notes: String): Booking!
}

type SitterDashboard {
  sitter: Sitter!
  upcomingBookings: [Booking!]
  families: [Family!]
}
`;