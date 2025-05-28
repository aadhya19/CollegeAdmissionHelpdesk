import Announcement from '../models/Announcement.js';

// Get all announcements
export const getAnnouncements = async (req, res) => {
  try {
    const announcements = await Announcement.find().sort({ createdAt: -1 });
    res.json(announcements);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching announcements', error: error.message });
  }
};

// Create new announcement
export const createAnnouncement = async (req, res) => {
  try {
    const { title, description, priority, department } = req.body;
    
    // Use department from session if available, otherwise use provided department
    const finalDepartment = req.session?.adminDetails?.department || department || '';
    
    const announcement = new Announcement({
      title,
      description,
      priority,
      department: finalDepartment
    });

    await announcement.save();
    res.status(201).json(announcement);
  } catch (error) {
    res.status(400).json({ message: 'Error creating announcement', error: error.message });
  }
};

// Update announcement
export const updateAnnouncement = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, priority, department } = req.body;

    // Use department from session if available, otherwise use provided department
    const finalDepartment = req.session?.adminDetails?.department || department || '';

    const announcement = await Announcement.findByIdAndUpdate(
      id,
      { title, description, priority, department: finalDepartment },
      { new: true }
    );

    if (!announcement) {
      return res.status(404).json({ message: 'Announcement not found' });
    }

    res.json(announcement);
  } catch (error) {
    res.status(400).json({ message: 'Error updating announcement', error: error.message });
  }
};

// Delete announcement
export const deleteAnnouncement = async (req, res) => {
  try {
    const { id } = req.params;
    const announcement = await Announcement.findByIdAndDelete(id);

    if (!announcement) {
      return res.status(404).json({ message: 'Announcement not found' });
    }

    res.json({ message: 'Announcement deleted successfully' });
  } catch (error) {
    res.status(400).json({ message: 'Error deleting announcement', error: error.message });
  }
}; 