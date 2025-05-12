const User = require("../models/User");
const Leave = require("../models/Leave");
const { getLeaveQueryStrategy } = require("../utils/LeaveQueryStrategy");
const config = require('../config/config');
const NotifierService = require("../utils/notifier/NotifierService");

const notifier = new NotifierService();

function getUser(userId) {
  return new Promise((resolve, reject) => {
    User.findById(userId)
      .then((user) => {
        if (!user) {
          reject(new Error("User not found"));
        } else {
          resolve(user);
        }
      })
      .catch((error) => {
        reject(error);
      });
  });
}

async function getRemainingLeaveCount(userId) {
  const year = new Date().getFullYear();

  // count the approved leaves in this year
  const count = await Leave.countDocuments({
    applier: userId,
    status: ['approved', 'pending'],
    createdAt: {
      $gte: new Date(year, 0, 1),
      $lte: new Date(year, 11, 31, 23, 59, 59)
    }
  });

  return config.ANNUAL_LIMIT_COUNT - count;
}

const getLeaves = async (req, res) => {
  try {
    const user = await getUser(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    // using strategy to query leaves
    const strategy = getLeaveQueryStrategy(user);
    const leaves = await strategy.queryLeaves();
    const remainingLeaveCount = await getRemainingLeaveCount(user._id);

    const data = Object.assign({}, leaves, { remainingLeaveCount: remainingLeaveCount });
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
}

const createLeave = async (req, res) => {
  try {
    const user = await getUser(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found" });
    
    const remainingLeaveCount = await getRemainingLeaveCount(user._id);
    if (remainingLeaveCount <= 0) return res.status(403).json({ message: "You've reach the annual leave request limit" });

    const { selectedDate, reason, leaveType } = req.body;
    await Leave.create({
      applier: user._id,
      leaveType: leaveType,
      reason: reason,
      selectedDate: new Date(selectedDate).setHours(0,0,0,0)
    });

    // Notify department managers about the leave request
    const managers = await User.find({ 
      role: "admin",
      department: user.department
    });

    for (const manager of managers) {
      notifier.sendNotification(
        {
          from: user._id,
          to: manager._id,
          body: `New leave request from ${user.name}`,
          options: { link: '/leaves' }
        }
      )
    }

    res.status(200).send();
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

async function makeDecision(leaveId, adminId, decision) {
  const ERROR_CODES = {
    USER_NOT_FOUND: { code: 404, message: "User not found" },
    NOT_ADMIN: { code: 403, message: "Forbidden" },
    LEAVE_NOT_FOUND: { code: 404, message: "Leave not found" },
    ALREADY_DECIDED: { code: 400, message: "Decision has been made" }
  };

  try {
    const admin = await getUser(adminId);
    if (!admin) throw ERROR_CODES.USER_NOT_FOUND;
    if (!admin.isAdmin()) throw ERROR_CODES.NOT_ADMIN;

    const leave = await Leave.findById(leaveId);
    if (!leave) throw ERROR_CODES.LEAVE_NOT_FOUND;
    if (leave.status !== "pending") throw ERROR_CODES.ALREADY_DECIDED;

    leave.status = decision;
    await leave.save();

    // Send notification to leave applier
    notifier.notify(
      {
        from: adminId,
        to: leave.applier,
        body: `Your leave request has been ${decision}`, 
        options: { link: '/leaves' }
      }
    )

    return leave;
  } catch (error) {
    if (error.code) {
      throw error;
    }
    throw { code: 500, message: error.message };
  }
}

const approveLeave = async (req, res) => {
  try {
    await makeDecision(req.params.id, req.user.id, "approved");
    res.status(200).send();
  } catch (error) {
    res.status(error.code || 500).json({ message: error.message });
  }
};

const rejectLeave = async (req, res) => {
  try {
    await makeDecision(req.params.id, req.user.id, "rejected"); 
    res.status(200).send();
  } catch (error) {
    res.status(error.code || 500).json({ message: error.message });
  }
};

module.exports = {
  getLeaves,
  createLeave,
  approveLeave,
  rejectLeave
};
