import mongoose from "mongoose";

const appointmentSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  docId: { type: String, required: true },
  
  slotDate: { type: String, required: true },  // Changed from String to Date
  slotTime: { type: String, required: true }, 

  userData: { type: Object, required: true }, // Fixed typo (userbata -> userData)
  docData: { type: Object, required: true },

  amount: { type: Number, required: true },

  date: { type: Number, required: true }, // Changed from Number to Date for better handling
  cancelled: { type: Boolean, default: false },
  payment: { type: Boolean, default: false },
  isCompleted: { type: Boolean, default: false }
});

const appointmentModel = mongoose.models.appointment || mongoose.model('appointment', appointmentSchema);

export default appointmentModel;
