import express from "express";

import Project from "../../models/Project.js";
import ProjectRole from "../../models/ProjectRole.js";
import ensureAuthenticated from "../../config/auth.js";

const router = express.Router();

// @route GET api/v1/projects/info/:id
// @desc Get the information of the project (User must be a part of the project)
// @access Private
router.get("/info/:id", ensureAuthenticated, (req, res) => {
    Project.findById({ _id: req.params.id })
        .populate({
            path: "users",
            match: { userId: req.user.id },
            populate: {
                path: "userId",
            },
        })
        .then((curProject) => {
            // If the users array is empty, then the logged in user's id was not found in this project
            if (!curProject.users.length) {
                res.status(403).json({
                    msg: "Not authorized to view this project",
                });
            } else {
                res.json(curProject);
            }
        })
        .catch((err) => console.log(err));
});

// @route POST api/v1/projects/new
// @desc Create a new project
// @access Private
router.post("/new", ensureAuthenticated, (req, res) => {
    const { name, desc, dueDate } = req.body;

    // Ensure all fields are filled in
    if (!name || !desc || !dueDate) {
        res.status(400).json({ msg: "Please fill in all fields" });
        return;
    }

    const newProject = new Project({
        name,
        desc,
        dueDate,
        created_by: req.user.id,
    });

    // Check if date is valid
    if (!(newProject.dueDate instanceof Date)) {
        res.status(400).json({ msg: "Please enter a valid date" });
        return;
    }

    newProject
        .save()
        .then((savedProject) => {
            // Creator of the project is automatically considered a 'mentor'
            const newProjectRole = new ProjectRole({
                userId: req.user.id,
                projectId: savedProject.id,
                role: "MENTOR",
            });

            newProjectRole
                .save()
                .then((savedProjectRole) => {
                    res.json({
                        user: {
                            id: savedProject.id,
                            name: savedProject.name,
                            created_by: savedProject.created_by,
                        },
                        projectRole: {
                            userId: savedProjectRole.userId,
                            projectID: savedProjectRole.projectId,
                            role: savedProjectRole.role,
                        },
                    });
                })
                .catch((err) => console.log(err));
        })
        .catch((err) => console.log(err));
});

export default router;
