const User = require("../models/User");
const { getLeaveQueryStrategy } = require("../utils/leaveQueryStrategy");
const BalanceService = require("../services/leaves/BalanceService");
const LeaveRequestFacade = require("../services/leaves/LeaveRequestFacade");

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

const getLeaves = async (req, res) => {
  try {
    const user = await getUser(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    // using strategy to query leaves
    const strategy = getLeaveQueryStrategy(user);
    const leaves = await strategy.queryLeaves();
    const remainingLeaveCount = await BalanceService.getLeaveBalance(user._id);

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
    
    const leaveRequestFacade = new LeaveRequestFacade();
    const result = await leaveRequestFacade.submitLeaveRequest(user._id, req.body);

    if (!result.success) return res.status(result.code).json({ message: result.message });
    
    res.status(200).send();
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

async function makeDecision(leaveId, adminId, decision) {
  const leaveRequestFacade = new LeaveRequestFacade();
  const result = await leaveRequestFacade.makeDecision(leaveId, adminId, decision);

  return result;
}

const approveLeave = async (req, res) => {
  try {
    const result = await makeDecision(req.params.id, req.user.id, "approve");
    if (!result.success) return res.status(result.code).json({ message: result.message });

    return res.status(200).send();
  } catch (error) {
    res.status(error.code || 500).json({ message: error.message });
  }
};

const rejectLeave = async (req, res) => {
  try {
    const result = await makeDecision(req.params.id, req.user.id, "reject");
    if (!result.success) return res.status(result.code).json({ message: result.message });

    return res.status(200).send();
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
