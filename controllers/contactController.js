import Department from '../models/Department.js';

export const getContactInfo = async (req, res) => {
  try {
    const departments = await Department.find()
      .select('departmentName contactInfo')
      .sort('departmentName');

    res.json({
      success: true,
      departments
    });
  } catch (error) {
    console.error('Error fetching contact information:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching contact information',
      error: error.message
    });
  }
};

export const updateContactInfo = async (req, res) => {
  try {
    const { departmentName, contactInfo } = req.body;

    if (!departmentName || !contactInfo) {
      return res.status(400).json({
        success: false,
        message: 'Department name and contact information are required'
      });
    }

    const department = await Department.findOneAndUpdate(
      { departmentName },
      { 
        contactInfo,
        updatedAt: new Date()
      },
      { new: true, upsert: true }
    );

    res.json({
      success: true,
      department
    });
  } catch (error) {
    console.error('Error updating contact information:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating contact information',
      error: error.message
    });
  }
};

export const updateCampusMap = async (req, res) => {
  try {
    const { mapUrl } = req.body;

    if (!mapUrl) {
      return res.status(400).json({
        success: false,
        message: 'Map URL is required'
      });
    }

    // Update all departments with the new map URL
    await Department.updateMany(
      {},
      { 
        'contactInfo.campusMap': mapUrl,
        updatedAt: new Date()
      }
    );

    res.json({
      success: true,
      message: 'Campus map updated successfully'
    });
  } catch (error) {
    console.error('Error updating campus map:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating campus map',
      error: error.message
    });
  }
}; 