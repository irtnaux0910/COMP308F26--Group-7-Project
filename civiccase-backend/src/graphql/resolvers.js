const User = require("../models/User");
const Issue = require("../models/Issue");
const Notification = require("../models/Notification");
const generateToken = require("../utils/generateToken");
const { requireAuth, requireStaff } = require("../middleware/auth");
<<<<<<< HEAD
const {
  categorizeIssueWithAI,
} = require("../services/aiCategorizationService");
const {
  askCivicBot: askCivicBotService,
} = require("../services/chatbotService");
const {
  getIssueCountsByCategory,
  getStatusCounts,
  getHighPriorityIssues,
  getHeatmapPoints,
  getTrendInsights,
} = require("../services/analyticsService");
=======

>>>>>>> 73e57ebb4e2b758352596fdc622371743863be7c
const resolvers = {
  Query: {
    // Return the currently authenticated user
    me: async (_, __, { user }) => {
      requireAuth(user);
      return user;
    },

    // Return all users (staff only)
    users: async (_, __, { user }) => {
      requireStaff(user);
      return await User.find({}).select("-password");
    },

    // Return all issues
    issues: async (_, __, { user }) => {
      requireAuth(user);
      return await Issue.find({})
        .populate("reportedBy")
        .populate("assignedTo")
        .sort({ createdAt: -1 });
    },

    // Return a single issue by ID
    issue: async (_, { id }, { user }) => {
      requireAuth(user);
      const issue = await Issue.findById(id)
        .populate("reportedBy")
        .populate("assignedTo");
      if (!issue) throw new Error("Issue not found");
      return issue;
    },

    // Return notifications for the current user
    myNotifications: async (_, __, { user }) => {
      requireAuth(user);
      return await Notification.find({ user: user.id })
        .populate("user")
        .populate({
          path: "issue",
          populate: [{ path: "reportedBy" }, { path: "assignedTo" }],
        })
        .sort({ createdAt: -1 });
    },
<<<<<<< HEAD
    issueCountsByCategory: async (_, __, { user }) => {
      requireAuth(user);
      const results = await getIssueCountsByCategory();
      return results.map((item) => ({
        label: item._id || "OTHER",
        count: item.count,
      }));
    },

    statusCounts: async (_, __, { user }) => {
      requireAuth(user);
      const results = await getStatusCounts();
      return results.map((item) => ({
        label: item._id,
        count: item.count,
      }));
    },

    highPriorityIssues: async (_, __, { user }) => {
      requireStaff(user);
      return await getHighPriorityIssues();
    },

    heatmapPoints: async (_, __, { user }) => {
      requireAuth(user);
      return await getHeatmapPoints();
    },

    trendInsights: async (_, __, { user }) => {
      requireAuth(user);
      return await getTrendInsights();
    },
    askCivicBot: async (_, { question }, { user }) => {
      requireAuth(user);
      const answer = await askCivicBotService(question);
      return { answer };
    },
=======
>>>>>>> 73e57ebb4e2b758352596fdc622371743863be7c

    // Return issues near a given location using geospatial query
    nearbyIssues: async (
      _,
      { longitude, latitude, maxDistance = 5000 },
      { user },
    ) => {
      requireAuth(user);
      return await Issue.find({
        location: {
          $near: {
            $geometry: {
              type: "Point",
              coordinates: [longitude, latitude],
            },
            $maxDistance: maxDistance,
          },
        },
      })
        .populate("reportedBy")
        .populate("assignedTo");
    },
  },

  Mutation: {
    // Register a new user
    register: async (_, { fullName, email, password, role, phone }) => {
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        throw new Error("A user with this email already exists");
      }

      const user = await User.create({
        fullName,
        email,
        password,
        role: role || "RESIDENT",
        phone,
      });

      const token = generateToken(user._id);

      return {
        token,
        user,
      };
    },

    // Login with email and password
    login: async (_, { email, password }) => {
      const user = await User.findOne({ email });
      if (!user) {
        throw new Error("Invalid email or password");
      }

      const isMatch = await user.matchPassword(password);
      if (!isMatch) {
        throw new Error("Invalid email or password");
      }

      const token = generateToken(user._id);

      return {
        token,
        user,
      };
    },

<<<<<<< HEAD
    //Create
    createIssue: async (
      _,
      { title, description, category, priority, imageUrl, location },
=======
    // Create a new issue (authenticated users)
    createIssue: async (
      _,
      {
        title,
        description,
        category,
        priority,
        imageUrl,
        location,
        aiCategory,
        aiSummary,
      },
>>>>>>> 73e57ebb4e2b758352596fdc622371743863be7c
      { user },
    ) => {
      requireAuth(user);

<<<<<<< HEAD
      let aiCategory = null;
      let aiSummary = null;
      let aiPriority = null;

      try {
        const aiResult = await categorizeIssueWithAI(title, description);
        aiCategory = aiResult.aiCategory || null;
        aiSummary = aiResult.aiSummary || null;
        aiPriority = aiResult.priority || null;
      } catch (error) {
        console.error("AI categorization failed:", error.message);
      }

      const issue = await Issue.create({
        title,
        description,
        category: category || aiCategory || "OTHER",
        priority: priority || aiPriority || "MEDIUM",
=======
      const issue = await Issue.create({
        title,
        description,
        category: category || "OTHER",
        priority: priority || "MEDIUM",
>>>>>>> 73e57ebb4e2b758352596fdc622371743863be7c
        imageUrl,
        location: {
          type: "Point",
          coordinates: [location.longitude, location.latitude],
          address: location.address,
        },
        reportedBy: user.id,
        aiCategory,
        aiSummary,
      });

<<<<<<< HEAD
      const populatedIssue = await Issue.findById(issue._id)
        .populate("reportedBy")
        .populate("assignedTo");

      // Optional urgent alert for staff
      if (populatedIssue.priority === "URGENT") {
        const staffUsers = await User.find({ role: "MUNICIPAL_STAFF" });

        for (const staff of staffUsers) {
          await Notification.create({
            user: staff._id,
            issue: populatedIssue._id,
            message: `Urgent issue reported: "${populatedIssue.title}"`,
            type: "URGENT_ALERT",
          });
        }
      }

      return populatedIssue;
=======
      return await Issue.findById(issue._id)
        .populate("reportedBy")
        .populate("assignedTo");
>>>>>>> 73e57ebb4e2b758352596fdc622371743863be7c
    },

    // Update issue status (staff only)
    updateIssueStatus: async (_, { id, status }, { user }) => {
      requireStaff(user);

      const issue = await Issue.findById(id).populate("reportedBy");
      if (!issue) throw new Error("Issue not found");

      issue.status = status;
      await issue.save();

      // Create notification for the resident who reported the issue
      await Notification.create({
        user: issue.reportedBy._id,
        issue: issue._id,
        message: `Your issue "${issue.title}" status has been updated to ${status}.`,
        type: "STATUS_UPDATE",
      });

      return await Issue.findById(id)
        .populate("reportedBy")
        .populate("assignedTo");
    },

    // Assign issue to a staff member (staff only)
    assignIssue: async (_, { id, staffId }, { user }) => {
      requireStaff(user);

      const issue = await Issue.findById(id);
      if (!issue) throw new Error("Issue not found");

      const staffMember = await User.findById(staffId);
      if (!staffMember) throw new Error("Staff member not found");
      if (staffMember.role !== "MUNICIPAL_STAFF") {
        throw new Error("Can only assign issues to municipal staff members");
      }

      issue.assignedTo = staffId;
      await issue.save();

      // Create notification for the assigned staff member
      await Notification.create({
        user: staffId,
        issue: issue._id,
        message: `You have been assigned to the issue: "${issue.title}".`,
        type: "ASSIGNMENT",
      });

      return await Issue.findById(id)
        .populate("reportedBy")
        .populate("assignedTo");
    },

    // Mark a notification as read
    markNotificationAsRead: async (_, { id }, { user }) => {
      requireAuth(user);

      const notification = await Notification.findById(id);
      if (!notification) throw new Error("Notification not found");

      if (notification.user.toString() !== user.id.toString()) {
        throw new Error("Not authorized to update this notification");
      }

      notification.isRead = true;
      await notification.save();

      return await Notification.findById(id)
        .populate("user")
        .populate({
          path: "issue",
          populate: [{ path: "reportedBy" }, { path: "assignedTo" }],
        });
    },
  },

  // Resolver for Issue.location to return GeoJSON-compatible shape
  Issue: {
    location: (parent) => ({
      type: parent.location.type,
      coordinates: parent.location.coordinates,
      address: parent.location.address,
    }),
  },
};

module.exports = resolvers;
