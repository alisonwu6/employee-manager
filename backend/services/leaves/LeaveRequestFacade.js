const BalanceService = require('./BalanceService');
const Leave = require('../../models/Leave');
const User = require('../../models/User');
const NotifierService = require('../../services/NotifierService');
const notifier = new NotifierService();

class LeaveRequestFacade {
  async submitLeaveRequest(employeeId, leaveDetails) {
    // This won't work because checkLeaveBalance() returns a Promise but we're not awaiting it
    // Need to await the async call to properly check the balance
    const hasRemainingLeave = await BalanceService.checkLeaveBalance(employeeId);
    if (!hasRemainingLeave) {
      return { success: false, code: 400, message: 'Insufficient leave balance.' };
    }

    const { selectedDate, reason, leaveType } = leaveDetails;
    const applier = await User.findById(employeeId);
    await Leave.create({
      applier: applier._id,
      leaveType: leaveType,
      reason: reason,
      selectedDate: new Date(selectedDate).setHours(0,0,0,0)
    });

    // Notify department managers about the leave request
    const managers = await User.find({ 
        role: "admin",
        department: applier.department
    });

    for (const manager of managers) {
        notifier.sendNotification(
            {
                from: applier._id,
                to: manager._id,
                body: `New leave request from ${applier.name}`,
                options: { link: '/leaves' }
            }
        )
    }

    return { success: true, message: 'Leave request submitted.' };
  }

  async makeDecision(leaveId, adminId, decision) {

    const leave = await Leave.findById(leaveId);
    if (!leave) return { success: false, code: 404, message: "Leave not found" };
    if (leave.status !== "pending") return { success: false, code: 400, message: "Decision has been made" };

    const admin = await User.findById(adminId);
    if (!admin) return { success: false, code: 404, message: "Admin not found" };
    if (!admin.isAdmin()) return { success: false, code: 403, message: "Forbidden" };

    if (decision === "approve") {
        leave.status = "approved";
    } else {
        leave.status = "rejected";
    }

    await leave.save();

    // Send notification to leave applier
    notifier.sendNotification(
        {
            from: adminId,
            to: leave.applier,
            body: `Your leave request has been ${leave.status}`, 
            options: { link: '/leaves' }
        }
    )

    return { success: true, message: 'Leave approved.' };
  }
}

module.exports = LeaveRequestFacade;
