const Leave = require("../../models/Leave");
const config = require("../../config/config");

class LeaveBalanceService {
    async checkLeaveBalance(employeeId) {
        const remainingLeaves = await this.getLeaveBalance(employeeId);

        return remainingLeaves > 0;
    }

    async getLeaveBalance(employeeId) {
        const year = new Date().getFullYear();

        const requestedLeaves = await Leave.countDocuments({
            applier: employeeId,
            status: ['approved', 'pending'],
            selectedDate: {
                $gte: new Date(year, 0, 1),
                $lte: new Date(year, 11, 31, 23, 59, 59)
            }
        });

        return config.ANNUAL_LIMIT_COUNT - requestedLeaves;
    }
}

module.exports = new LeaveBalanceService();
