import Query from '../models/Query.js';

// Get all public queries for admin's department
export const getPublicQueries_public = async (req, res) => {
  try {
    const queries = await Query.find({
       markedPublic: true,
       publicConsent: true,
       status: 'Resolved'
      }).sort({ createdAt: -1 });
    res.json(queries);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching public queries', error: error.message });
  }
};


export const getPublicQueries = async (req, res) => {
  try {
    const { 
      status,
      sortBy, 
      sortOrder,
      startDate,
      endDate,
      queryId,
      email,
      keyword,
      department
    } = req.query;

    // Build filter object with required public query conditions
    const filter = {
      markedPublic: true,
      publicConsent: true,
      department: req.session.department,
      status: 'Resolved'
    };

    // Date range filter
    if (startDate && endDate) {
      filter.createdAt = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    }

    // Query ID filter
    if (queryId) {
      filter.queryId = { $regex: queryId, $options: 'i' };
    }

    // Email filter
    if (email) {
      filter.email = { $regex: email, $options: 'i' };
    }

    // Department filter
    if (department) {
      filter.department = department;
    }

    // Keyword search in public title and description
    if (keyword) {
      filter.$or = [
        { 'public.title': { $regex: keyword, $options: 'i' } },
        { 'public.description': { $regex: keyword, $options: 'i' } }
      ];
    }

    // Build sort object
    const sort = {};
    if (sortBy) {
      sort[sortBy] = sortOrder === 'asc' ? 1 : -1;
    } else {
      sort.createdAt = -1; // Default sort by creation date
    }

    const queries = await Query.find(filter)
      .sort(sort)
      .select('public department updatedAt createdAt queryId email'); // Added queryId and email to selected fields

    res.json(queries);
  } catch (error) {
    console.error('Error fetching public queries:', error);
    res.status(500).json({ message: 'Error fetching public queries', error: error.message });
  }
};

// Get public query details
export const getPublicQueryDetails = async (req, res) => {
  try {
    const query = await Query.findOne({
      _id: req.params.id,
      markedPublic: true,
      publicConsent: true,
      status: 'Resolved'
    });

    if (!query) {
      return res.status(404).json({ message: 'Public query not found' });
    }

    res.json(query);
  } catch (error) {
    console.error('Error fetching public query details:', error);
    res.status(500).json({ message: 'Error fetching public query details' });
  }
};

// Create new public query
export const createPublicQuery = async (req, res) => {
  try {
    const { title, description, category } = req.body;
    const query = new Query({
      title,
      description,
      category,
      department: req.session.department,
      createdBy: req.session.adminId,
      markedPublic: true,
      publicConsent: true
    });
    await query.save();
    res.status(201).json({ query });
  } catch (error) {
    console.error('Error creating public query:', error);
    res.status(500).json({ message: 'Error creating public query' });
  }
};

// Update public query
export const updatePublicQuery = async (req, res) => {
  try {
    const { title, description, category } = req.body;
    const query = await Query.findOneAndUpdate(
      {
        _id: req.params.id,
        department: req.session.department,
        markedPublic: true
      },
      { title, description, category, updatedAt: new Date() },
      { new: true }
    );

    if (!query) {
      return res.status(404).json({ message: 'Public query not found' });
    }

    res.json({ query });
  } catch (error) {
    console.error('Error updating public query:', error);
    res.status(500).json({ message: 'Error updating public query' });
  }
};

// Delete public query
export const deletePublicQuery = async (req, res) => {
  try {
    const query = await Query.findOneAndDelete({
      _id: req.params.id,
      department: req.session.department,
      markedPublic: true
    });

    if (!query) {
      return res.status(404).json({ message: 'Public query not found' });
    }

    res.json({ message: 'Public query deleted successfully' });
  } catch (error) {
    console.error('Error deleting public query:', error);
    res.status(500).json({ message: 'Error deleting public query' });
  }
}; 