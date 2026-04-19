const { gql } = require("apollo-server-express");

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
  type ChatbotResponse {
    answer: String!
  }

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
    ): Issue!

    updateIssueStatus(id: ID!, status: IssueStatus!): Issue!

    assignIssue(id: ID!, staffId: ID!): Issue!

    markNotificationAsRead(id: ID!): Notification!
  }
`;

module.exports = typeDefs;
