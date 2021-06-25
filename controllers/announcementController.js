import User from "../models/User.js";
import ClassRole from "../models/ClassRole.js";
import { Announcement } from "../models/BaseText.js";

const getAllAnnouncements = (req, res) => {
  User.findById(req.user.id)
    .populate({
      path: "classes",
      populate: {
        path: "classId",
      },
    })
    .then((user) => ClassRole.find({ userId: user.id }).select("classId"))
    // objects of { _id, classId } are returned here; map extracts classIds into an array
    .then((arr) => arr.map((obj) => obj.classId))
    .then((arr) => {
      console.log(arr);
      Announcement.find({ classId: { $in: arr } })
        .sort({ creationDate: "desc" })
        .then((result) => res.json(result));
    });
};

export default getAllAnnouncements;
