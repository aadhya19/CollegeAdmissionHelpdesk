import Query from '../models/Query.js';
import path from 'path';
import fs from 'fs';
import createUploader from '../middleware/upload.js';

// Generate a unique query ID
const generateQueryId = () => {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substring(2, 8);
  return `${timestamp}-${random}`;
};

// Middleware to handle file upload with queryId
export const handleFileUpload = (req, res, next) => {
  const queryId =  req.params.id || generateQueryId();
  console.log('Handling file upload with queryId:', queryId);
  
  // Create uploader with the queryId
  const upload = createUploader(queryId);
  
  // Use the upload middleware with the queryId
  upload.array('files')(req, res, (err) => {
    if (err) {
      console.error('Error in file upload:', err);
      return res.status(400).json({
        success: false,
        message: err.message
      });
    }
    // Set queryId in req.body for the controller
    req.body.queryId = queryId;
    console.log('Files after upload:', req.files);
    next();
  });
};

export const postQuery = async (req, res) => {
  try {
    const { name, email, department, title, description, publicConsent } = req.body;
    const queryId = req.body.queryId;
    
    console.log('Processing postQuery with files:', req.files);
    
    // Handle files if they exist
    const files = req.files ? req.files.map(file => {
      console.log('Processing file:', file);
      if (!file || !file.filename) {
        console.error('Invalid file object:', file);
        return null;
      }
      return {
        filename: file.filename,
        originalname: file.originalname,
        path: path.join('server', 'uploads', queryId, file.filename),
        mimetype: file.mimetype
      };
    }).filter(Boolean) : [];

    // Create new query
    const query = new Query({
      queryId,
      name,
      email,
      department,
      title,
      description,
      publicConsent,
      conversationHistory: [{
        message: description,
        from: 'User',
        timestamp: new Date(),
        files: files
      }]
    });

    await query.save();

    res.status(201).json({
      success: true,
      queryId: query.queryId
    });
  } catch (error) {
    console.error('Error posting query:', error);
    res.status(500).json({
      success: false,
      message: 'Error posting query',
      error: error.message
    });
  }
};

export const getQueryStatus = async (req, res) => {
  try {
    const { queryId, email } = req.query;
    console.log(queryId, email);
    if (!queryId || !email) {
      return res.status(400).json({
        success: false,
        message: 'Query ID and email are required'
      });
    }

    const query = await Query.findOne({ queryId, email });
    console.log(query);

    if (!query) {
      return res.status(404).json({
        success: false,
        message: 'Query not found'
      });
    }

    res.json({
      success: true,
      query
    });
  } catch (error) {
    console.error('Error getting query status:', error);
    res.status(500).json({
      success: false,
      message: 'Error getting query status',
      error: error.message
    });
  }
};

export const addFollowUp = async (req, res) => {
  try {
    const { queryId, email, message } = req.body;
    
    console.log('Processing addFollowUp with files:', req.files);
    
    // Create uploader with the queryId
    const upload = createUploader(queryId);
    
    // Handle files if they exist
    const files = req.files ? req.files.map(file => {
      console.log('Processing file:', file);
      if (!file || !file.filename) {
        console.error('Invalid file object:', file);
        return null;
      }
      return {
        filename: file.filename,
        originalname: file.originalname,
        path: path.join('server', 'uploads', queryId, file.filename),
        mimetype: file.mimetype
      };
    }).filter(Boolean) : [];

    if (!queryId || !email || !message) {
      return res.status(400).json({
        success: false,
        message: 'Query ID, email, and message are required'
      });
    }

    const query = await Query.findOne({ queryId, email });

    if (!query) {
      return res.status(404).json({
        success: false,
        message: 'Query not found'
      });
    }

    // Add new message to conversation history
    query.conversationHistory.push({
      message,
      from: 'User',
      timestamp: new Date(),
      files: files
    });

    await query.save();

    res.json(query);

    
  } catch (error) {
    console.error('Error adding follow-up:', error);
    res.status(500).json({
      success: false,
      message: 'Error adding follow-up message',
      error: error.message
    });
  }
};

// Add this new function to serve files
export const serveFile = async (req, res) => {
  try {
    const { filename } = req.params;
    const { queryId } = req.query;
    
    console.log('Serving file request:', { filename, queryId });
    
    // Construct the file path
    const filePath = path.join('uploads', queryId || 'new', filename);
    console.log('Full file path:', filePath);

    // Check if file exists
    if (!fs.existsSync(filePath)) {
      console.log('File not found at path:', filePath);
      return res.status(404).json({
        success: false,
        message: 'File not found'
      });
    }

    console.log('Serving file:', filePath);
    // Send the file
    res.sendFile(filePath, { root: process.cwd() });
  } catch (error) {
    console.error('Error serving file:', error);
    res.status(500).json({
      success: false,
      message: 'Error serving file'
    });
  }
}; 