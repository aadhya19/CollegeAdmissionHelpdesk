import mongoose from 'mongoose';

const DepartmentSchema = new mongoose.Schema({
  departmentName: { type: String, required: true, unique: true },
  contactInfo: {
    dean: { type: String, required: true },
    associateDean: { type: String },
    director: { type: String },
    email: { type: String, required: true },
    officeHours: { type: String, required: true }
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Update the updatedAt timestamp before saving
DepartmentSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

const Department = mongoose.model('Department', DepartmentSchema);

export default Department; 