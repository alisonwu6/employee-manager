const User = require("../../models/User");
const Leave = require("../../models/Leave");

class ApprovalService {
    async requestApproval(leaveId, adminId, decision) {
        const leave = await Leave.findById(leaveId);
        if (!leave) return { success: false, code: 404, message: "Leave not found" };

        const admin = await User.findById(adminId);
        if (!admin) return { success: false, code: 404, message: "Admin not found" };

        return this.makeDecision(leaveId, adminId, decision);
    }

    async makeDecision(leaveId, adminId, decision) {
        const ERROR_CODES = {
          USER_NOT_FOUND: { code: 404, message: "User not found" },
          NOT_ADMIN: { code: 403, message: "Forbidden" },
          LEAVE_NOT_FOUND: { code: 404, message: "Leave not found" },
          ALREADY_DECIDED: { code: 400, message: "Decision has been made" }
        };
      
        try {
          const admin = await getUser(adminId);
          if (!admin) return { success: false, ...ERROR_CODES.USER_NOT_FOUND };
          if (!admin.isAdmin()) return { success: false, ...ERROR_CODES.FORBIDDEN };
      
          const leave = await Leave.findById(leaveId);
          if (!leave) return { success: false, ...ERROR_CODES.LEAVE_NOT_FOUND };
          if (leave.status !== "pending") return { success: false, ...ERROR_CODES.ALREADY_DECIDED };
      
          leave.status = decision;
          await leave.save();
      
          return { success: true, leave };
        } catch (error) {
          return { success: false, code: 500, message: error.message };
        }
      }
}
module.exports = new ApprovalService();
  