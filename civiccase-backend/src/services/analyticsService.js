const Issue = require("../models/Issue");

const getIssueCountsByCategory = async () => {
  return await Issue.aggregate([
    {
      $group: {
        _id: "$category",
        count: { $sum: 1 },
      },
    },
    { $sort: { count: -1 } },
  ]);
};

const getStatusCounts = async () => {
  return await Issue.aggregate([
    {
      $group: {
        _id: "$status",
        count: { $sum: 1 },
      },
    },
    { $sort: { count: -1 } },
  ]);
};

const getHighPriorityIssues = async () => {
  return await Issue.find({
    priority: { $in: ["HIGH", "URGENT"] },
  })
    .populate("reportedBy")
    .populate("assignedTo")
    .sort({ createdAt: -1 });
};

const getHeatmapPoints = async () => {
  return await Issue.aggregate([
    {
      $project: {
        lng: { $arrayElemAt: ["$location.coordinates", 0] },
        lat: { $arrayElemAt: ["$location.coordinates", 1] },
      },
    },
    {
      $group: {
        _id: {
          lat: "$lat",
          lng: "$lng",
        },
        count: { $sum: 1 },
      },
    },
    {
      $project: {
        _id: 0,
        lat: "$_id.lat",
        lng: "$_id.lng",
        count: 1,
      },
    },
  ]);
};

const getTrendInsights = async () => {
  const now = new Date();
  const last7Days = new Date();
  last7Days.setDate(now.getDate() - 7);

  const previous7Days = new Date();
  previous7Days.setDate(now.getDate() - 14);

  const current = await Issue.aggregate([
    {
      $match: {
        createdAt: { $gte: last7Days },
      },
    },
    {
      $group: {
        _id: "$category",
        count: { $sum: 1 },
      },
    },
  ]);

  const previous = await Issue.aggregate([
    {
      $match: {
        createdAt: { $gte: previous7Days, $lt: last7Days },
      },
    },
    {
      $group: {
        _id: "$category",
        count: { $sum: 1 },
      },
    },
  ]);

  const previousMap = new Map(previous.map((item) => [item._id, item.count]));

  return current.map((item) => {
    const oldCount = previousMap.get(item._id) || 0;
    const changePercent =
      oldCount === 0 ? 100 : ((item.count - oldCount) / oldCount) * 100;

    return {
      category: item._id,
      count: item.count,
      changePercent: Number(changePercent.toFixed(1)),
    };
  });
};

module.exports = {
  getIssueCountsByCategory,
  getStatusCounts,
  getHighPriorityIssues,
  getHeatmapPoints,
  getTrendInsights,
};
