import Contact from '../models/Contact.js';

// Get all contacts for admin's department
export const getAllContacts = async (req, res) => {
  try {
    const contacts = await Contact.find({
      department: req.session.department
    }).sort({ createdAt: -1 });
    res.json({ contacts });
  } catch (error) {
    console.error('Error fetching contacts:', error);
    res.status(500).json({ message: 'Error fetching contacts' });
  }
};

// Create new contact
export const createContact = async (req, res) => {
  try {
    const { name, email, phone, role, officeLocation } = req.body;
    const contact = new Contact({
      name,
      email,
      phone,
      role,
      officeLocation,
      department: req.session.department,
      createdBy: req.session.adminId
    });
    await contact.save();
    res.status(201).json({ contact });
  } catch (error) {
    console.error('Error creating contact:', error);
    res.status(500).json({ message: 'Error creating contact' });
  }
};

// Update contact
export const updateContact = async (req, res) => {
  try {
    const { name, email, phone, role, officeLocation } = req.body;
    const contact = await Contact.findOneAndUpdate(
      {
        _id: req.params.id,
        department: req.session.department
      },
      { name, email, phone, role, officeLocation, updatedAt: new Date() },
      { new: true }
    );

    if (!contact) {
      return res.status(404).json({ message: 'Contact not found' });
    }

    res.json({ contact });
  } catch (error) {
    console.error('Error updating contact:', error);
    res.status(500).json({ message: 'Error updating contact' });
  }
};

// Delete contact
export const deleteContact = async (req, res) => {
  try {
    const contact = await Contact.findOneAndDelete({
      _id: req.params.id,
      department: req.session.department
    });

    if (!contact) {
      return res.status(404).json({ message: 'Contact not found' });
    }

    res.json({ message: 'Contact deleted successfully' });
  } catch (error) {
    console.error('Error deleting contact:', error);
    res.status(500).json({ message: 'Error deleting contact' });
  }
}; 