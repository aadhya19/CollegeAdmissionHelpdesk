import FAQ from '../models/FAQ.js';

// Get all FAQs for admin's department
export const getAllFAQs = async (req, res) => {
  try {
    const faqs = await FAQ.find({
      department: req.session.department
    }).sort({ createdAt: -1 });
    res.json({ faqs });
  } catch (error) {
    console.error('Error fetching FAQs:', error);
    res.status(500).json({ message: 'Error fetching FAQs' });
  }
};

// Create new FAQ
export const createFAQ = async (req, res) => {
  try {
    const { question, answer, category } = req.body;
    const faq = new FAQ({
      question,
      answer,
      category,
      department: req.session.department,
      createdBy: req.session.adminId
    });
    await faq.save();
    res.status(201).json({ faq });
  } catch (error) {
    console.error('Error creating FAQ:', error);
    res.status(500).json({ message: 'Error creating FAQ' });
  }
};

// Update FAQ
export const updateFAQ = async (req, res) => {
  try {
    const { question, answer, category } = req.body;
    const faq = await FAQ.findOneAndUpdate(
      {
        _id: req.params.id,
        department: req.session.department
      },
      { question, answer, category, updatedAt: new Date() },
      { new: true }
    );

    if (!faq) {
      return res.status(404).json({ message: 'FAQ not found' });
    }

    res.json({ faq });
  } catch (error) {
    console.error('Error updating FAQ:', error);
    res.status(500).json({ message: 'Error updating FAQ' });
  }
};

// Delete FAQ
export const deleteFAQ = async (req, res) => {
  try {
    const faq = await FAQ.findOneAndDelete({
      _id: req.params.id,
      department: req.session.department
    });

    if (!faq) {
      return res.status(404).json({ message: 'FAQ not found' });
    }

    res.json({ message: 'FAQ deleted successfully' });
  } catch (error) {
    console.error('Error deleting FAQ:', error);
    res.status(500).json({ message: 'Error deleting FAQ' });
  }
}; 