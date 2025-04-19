import mongoose from 'mongoose';

const listingSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  imageSrc: { type: String, required: true },
  category: { type: String, required: true },
  roomCount: { type: Number, required: true },
  bathroomCount: { type: Number, required: true },
  guestCount: { type: Number, required: true },
  locationValue: { type: String, required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  price: { type: Number, required: true }
}, {
  timestamps: true
});

const Listing = mongoose.models.Listing || mongoose.model('Listing', listingSchema);

export default Listing; 