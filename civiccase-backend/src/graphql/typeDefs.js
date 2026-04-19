<<<<<<< HEAD
const { gql } = require("apollo-server-express");
=======
const { gql } = require('apollo-server-express');
>>>>>>> 73e57ebb4e2b758352596fdc622371743863be7c

const typeDefs = gql`
  enum Role {
    RESIDENT
    MUNICIPAL_STAFF
  }

  enum IssueStatus {
    OPEN
    IN_PROGRESS
    RESOLVED
    REJECTED
  }

  enum IssueCategory {
    POTHOLE
    STREETLIGHT
    FLOODING
    SAFETY
    OTHER
  }

  enum Priority {
    LOW
    MEDIUM
    HIGH
    URGENT
  }

  enum NotificationType {
    STATUS_UPDATE
    ASSIGNMENT
    URGENT_ALERT
  }

  type User {
    id: ID!
    fullName: String!
    email: String!
    role: Role!
    phone: String
    createdAt: String
    updatedAt: String
  }

  type Location {
    type: String
    coordinates: [Float]
    address: String
  }
<<<<<<< HEAD
  type CountItem {
    label: String!
    count: Int!
  }

  type HeatmapPoint {
    lat: Float!
    lng: Float!
    count: Int!
  }

  type TrendInsight {
    category: String!
    count: Int!
    changePercent: Float!
  }
=======
>>>>>>> 73e57ebb4e2b758352596fdc622371743863be7c

  type Issue {
    id: ID!
    title: String!
    description: String!
    category: IssueCategory!
    status: IssueStatus!
    priority: Priority!
    imageUrl: String
    location: Location!
    reportedBy: User!
    assignedTo: User
    aiCategory: String
    aiSummary: String
    createdAt: String
    updatedAt: String
  }
<<<<<<< HEAD
  type ChatbotResponse {
    answer: String!
  }
=======
>>>>>>> 73e57ebb4e2b758352596fdc622371743863be7c

  type Notification {
    id: ID!
    user: User!
    issue: Issue!
    message: String!
    type: NotificationType!
    isRead: Boolean!
    createdAt: String
    updatedAt: String
  }

  type AuthPayload {
    token: String!
    user: User!
  }

  input LocationInput {
    longitude: Float!
    latitude: Float!
    address: String
  }

  type Query {
    me: User
    users: [User!]!
    issues: [Issue!]!
    issue(id: ID!): Issue
    myNotifications: [Notification!]!
<<<<<<< HEAD
    nearbyIssues(
      longitude: Float!
      latitude: Float!
      maxDistance: Int
    ): [Issue!]!
    issueCountsByCategory: [CountItem!]!
    statusCounts: [CountItem!]!
    highPriorityIssues: [Issue!]!
    heatmapPoints: [HeatmapPoint!]!
    trendInsights: [TrendInsight!]!
    askCivicBot(question: String!): ChatbotResponse!
=======
    nearbyIssues(longitude: Float!, latitude: Float!, maxDistance: Int): [Issue!]!
>>>>>>> 73e57ebb4e2b758352596fdc622371743863be7c
  }

  type Mutation {
    register(
      fullName: String!
      email: String!
      password: String!
      role: Role
      phone: String
    ): AuthPayload!

    login(email: String!, password: String!): AuthPayload!

    createIssue(
      title: String!
      description: String!
      category: IssueCategory
      priority: Priority
      imageUrl: String
      location: LocationInput!
<<<<<<< HEAD
=======
      aiCategory: String
      aiSummary: String
>>>>>>> 73e57ebb4e2b758352596fdc622371743863be7c
    ): Issue!

    updateIssueStatus(id: ID!, status: IssueStatus!): Issue!

    assignIssue(id: ID!, staffId: ID!): Issue!

    markNotificationAsRead(id: ID!): Notification!
  }
`;

module.exports = typeDefs;
