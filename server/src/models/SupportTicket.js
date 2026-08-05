import mongoose from 'mongoose';

const conversationSchema = new mongoose.Schema(
  {
    senderRole: {
      type: String,
      enum: ['Super Admin', 'Company Admin', 'Customer', 'Employee'],
      required: true,
    },
    senderName: {
      type: String,
      required: true,
    },
    senderEmail: {
      type: String,
      required: true,
    },
    message: {
      type: String,
      required: [true, 'Message content is required'],
    },
    attachments: [
      {
        filename: String,
        url: String,
      },
    ],
  },
  { timestamps: true }
);

const internalNoteSchema = new mongoose.Schema(
  {
    authorName: {
      type: String,
      required: true,
    },
    note: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const supportTicketSchema = new mongoose.Schema(
  {
    ticketId: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    fullName: {
      type: String,
      required: [true, 'Full name is required'],
      trim: true,
    },
    companyName: {
      type: String,
      required: [true, 'Company name is required'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      trim: true,
      lowercase: true,
    },
    phone: {
      type: String,
      default: '',
    },
    countryCode: {
      type: String,
      default: '+1',
    },
    subject: {
      type: String,
      required: [true, 'Subject is required'],
      trim: true,
    },
    category: {
      type: String,
      enum: [
        'Technical Issue',
        'Billing',
        'Subscription',
        'Payment',
        'Bug Report',
        'Feature Request',
        'General Question',
        'Account Recovery',
        'General Inquiry',
      ],
      default: 'General Question',
    },
    message: {
      type: String,
      required: [true, 'Initial message is required'],
    },
    priority: {
      type: String,
      enum: ['Low', 'Medium', 'High', 'Critical'],
      default: 'Medium',
    },
    status: {
      type: String,
      enum: ['Open', 'Pending', 'In Progress', 'Waiting for Customer', 'Resolved', 'Closed'],
      default: 'Open',
    },
    tenantId: {
      type: String,
      default: null,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    conversation: [conversationSchema],
    internalNotes: [internalNoteSchema],
    rating: {
      score: { type: Number, min: 1, max: 5, default: null },
      feedback: { type: String, default: '' },
      ratedAt: { type: Date, default: null },
    },
  },
  { timestamps: true }
);

supportTicketSchema.index({ tenantId: 1, status: 1 });

const SupportTicket = mongoose.model('SupportTicket', supportTicketSchema);

export default SupportTicket;
