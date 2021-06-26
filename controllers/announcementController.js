import { Announcement } from "../models/BaseText.js";
import ClassRole from "../models/ClassRole.js";

const getAllAnnouncements = (req, res) => {
  ClassRole.find({ userId: req.user.id })
    .select("classId")
    // Objects of { _id, classId } are returned, this map extracts the classIds into an array
    .then((arr) => arr.map((obj) => obj.classId))
    .then((arr) => Announcement.find({ classId: { $in: arr } }))
    .then((announcements) => res.json(announcements))
    .catch((err) => console.log(err));
};

export default getAllAnnouncements;
