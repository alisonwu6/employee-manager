const Leave = require("../models/Leave");

class UserQuery {
    constructor(user) {
      this.user = user;
    }
    async queryLeaves() {
      // normal users can only query their own leaves
      return {
        leaves: await this.queryOwnLeaves(),
        needToApproveLeaves: []
      };
    }

    async queryOwnLeaves() {
      return await Leave.find({ applier: this.user._id });
    }
}
  
class AdminQuery extends UserQuery {
    async queryLeaves() {
        return {
            leaves: await this.queryOwnLeaves(),
            needToApproveLeaves: await this.queryNeedToApproveLeaves()
        };
    }

    async queryNeedToApproveLeaves() {
        const pendingLeaves = await Leave.find({status: "pending" })
            .populate("applier", "department name");
    
        // Can only show pending leaves in their department
        return pendingLeaves.filter(
            leave => leave.applier.department === this.user.department
        );
    }
}
  
function getLeaveQueryStrategy(user) {
    if (user.role === "employee") {
      return new AdminQuery(user);
    }
    return new UserQuery(user);
}
  
module.exports = {
    UserQuery,
    AdminQuery,
    getLeaveQueryStrategy
};
  