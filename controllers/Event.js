import express from "express";
import Event from "../models/Event.js"; // Assuming this is your Event model
import multer from "multer";

const router = express.Router();

// Set up multer for image upload
const upload = multer({ dest: "uploads/" }); // Change to your preferred destination

// POST API to create a new event
router.post("/challenges/insert", upload.single("image"), async (req, res) => {
  try {
    const { challengeName, startDate, endDate, description, levelType } = req.body;

    // Create a new event document
    const newEvent = new Event({
      challengeName,
      startDate,
      endDate,
      description,
      levelType,
      image: req.file ? req.file.path : null, // Save the image path if provided
    });

    await newEvent.save();

    res.status(201).json({ success: true, message: "Challenge created successfully", data: newEvent });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error creating challenge", error });
  }
});

// GET API to fetch all events
router.get("/challenges/getdata", async (req, res) => {
  try {
    const events = await Event.find(); // Fetch all events from the database
    res.status(200).json({ success: true, data: events });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error fetching events", error });
  }
});

// DELETE API to delete a particular event by ID
router.delete("/challenges/delete/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const deletedEvent = await Event.findByIdAndDelete(id);

    if (!deletedEvent) {
      return res.status(404).json({ success: false, message: "Event not found" });
    }

    res.status(200).json({ success: true, message: "Event deleted successfully", data: deletedEvent });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error deleting event", error });
  }
});

// PUT API to update a particular event by ID
router.put("/challenges/update/:id", upload.single("image"), async (req, res) => {
  try {
    const { id } = req.params;
    const { challengeName, startDate, endDate, description, levelType } = req.body;

    const updatedEvent = await Event.findByIdAndUpdate(
      id,
      {
        challengeName,
        startDate,
        endDate,
        description,
        levelType,
        image: req.file ? req.file.path : undefined,
      },
      { new: true } // Return the updated document
    );

    if (!updatedEvent) {
      return res.status(404).json({ success: false, message: "Event not found" });
    }

    res.status(200).json({ success: true, message: "Event updated successfully", data: updatedEvent });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error updating event", error });
  }
});

export default router;
