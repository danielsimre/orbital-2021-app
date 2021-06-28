import { Comment } from "../models/BaseText.js";
import { BaseTask } from "../models/BaseTask.js";

const getAllInfo = (req, res) => {
  BaseTask.find({ assignedTo: req.user.id })
    .select("_id")
    .then((arr) => Comment.find({ classId: { $in: arr } }))
    .then((comments) => res.json(comments))
    .catch((err) => console.log(err));
};

export default getAllInfo;
