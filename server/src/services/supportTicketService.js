import SupportTicket from '../models/SupportTicket.js';
import Company from '../models/Company.js';
import User from '../models/User.js';
import AuditLog from '../models/AuditLog.js';
import ApiError from '../utils/ApiError.js';

const generateUniqueTicketId = async () => {
  const count = await SupportTicket.countDocuments();
  const nextNum = (count + 101).toString().padStart(6, '0');
  return `SUP-${nextNum}`;
};

export const createPublicTicket = async (data) => {
  const ticketId = await generateUniqueTicketId();

  const ticket = await SupportTicket.create({
    ticketId,
    fullName: data.fullName || data.name,
    companyName: data.companyName || data.company,
    email: data.email,
    phone: data.phone || '',
    countryCode: data.countryCode || '+1',
    subject: data.subject || 'Public Landing Page Inquiry',
    category: data.category || 'General Question',
    message: data.message,
    priority: data.priority || 'Medium',
    status: 'Open',
    conversation: [
      {
        senderRole: 'Customer',
        senderName: data.fullName || data.name,
        senderEmail: data.email,
        message: data.message,
      },
    ],
  });

  return ticket;
};

export const createCompanyTicket = async (user, data) => {
  const ticketId = await generateUniqueTicketId();

  const ticket = await SupportTicket.create({
    ticketId,
    fullName: user.name,
    companyName: user.companyId?.companyName || user.companyName || 'Company Workspace',
    email: user.email,
    phone: user.phone || data.phone || '',
    countryCode: data.countryCode || '+1',
    subject: data.subject,
    category: data.category || 'Technical Issue',
    message: data.message,
    priority: data.priority || 'Medium',
    status: 'Open',
    tenantId: user.tenantId,
    createdBy: user._id,
    conversation: [
      {
        senderRole: user.role,
        senderName: user.name,
        senderEmail: user.email,
        message: data.message,
      },
    ],
  });

  await AuditLog.create({
    actor: user._id,
    actorName: user.name,
    action: 'CREATE_SUPPORT_TICKET',
    details: `Created support ticket ${ticket.ticketId}: ${ticket.subject}`,
  });

  return ticket;
};

export const getCompanyTickets = async (tenantId) => {
  return await SupportTicket.find({ tenantId }).sort({ updatedAt: -1 });
};

export const getAllTicketsSuperAdmin = async () => {
  const tickets = await SupportTicket.find().sort({ updatedAt: -1 }).lean();

  // Populate company metadata & subscription plan badges for Super Admin
  const enhancedTickets = await Promise.all(
    tickets.map(async (t) => {
      let companyInfo = null;
      let employeeCount = 0;

      if (t.tenantId) {
        companyInfo = await Company.findOne({ tenantId: t.tenantId }).lean();
        employeeCount = await User.countDocuments({ tenantId: t.tenantId, role: 'Employee' });
      }

      return {
        ...t,
        planName: companyInfo?.subscription?.planName || 'Free Trial',
        subscriptionStatus: companyInfo?.subscription?.status || 'trialing',
        companyCode: companyInfo?.companyCode || 'N/A',
        employeeCount,
      };
    })
  );

  const totalRatings = enhancedTickets.filter((t) => t.rating?.score);
  const avgRating = totalRatings.length
    ? (totalRatings.reduce((acc, t) => acc + t.rating.score, 0) / totalRatings.length).toFixed(1)
    : '5.0';

  const metrics = {
    total: enhancedTickets.length,
    open: enhancedTickets.filter((t) => t.status === 'Open').length,
    pending: enhancedTickets.filter((t) => t.status === 'Pending').length,
    inProgress: enhancedTickets.filter((t) => t.status === 'In Progress').length,
    waitingCustomer: enhancedTickets.filter((t) => t.status === 'Waiting for Customer').length,
    critical: enhancedTickets.filter((t) => t.priority === 'Critical' && t.status !== 'Closed').length,
    resolvedToday: enhancedTickets.filter((t) => t.status === 'Resolved').length,
    customerSatisfaction: avgRating,
    avgResponseTime: '< 15 mins',
  };

  return { tickets: enhancedTickets, metrics };
};

export const getTicketById = async (id) => {
  const ticket = await SupportTicket.findById(id).lean();
  if (!ticket) {
    throw new ApiError(404, 'Support ticket not found');
  }

  let companyInfo = null;
  let employeeCount = 0;
  if (ticket.tenantId) {
    companyInfo = await Company.findOne({ tenantId: ticket.tenantId }).lean();
    employeeCount = await User.countDocuments({ tenantId: ticket.tenantId, role: 'Employee' });
  }

  return {
    ...ticket,
    companyDetails: companyInfo,
    employeeCount,
    planName: companyInfo?.subscription?.planName || 'Free Trial',
    subscriptionStatus: companyInfo?.subscription?.status || 'trialing',
  };
};

export const addReply = async (user, id, message) => {
  const ticket = await SupportTicket.findById(id);
  if (!ticket) {
    throw new ApiError(404, 'Support ticket not found');
  }

  const senderRole = user?.role || 'Customer';
  const senderName = user?.name || ticket.fullName;
  const senderEmail = user?.email || ticket.email;

  ticket.conversation.push({
    senderRole,
    senderName,
    senderEmail,
    message,
  });

  if (senderRole === 'Super Admin') {
    ticket.status = 'In Progress';
  } else if (senderRole === 'Company Admin' || senderRole === 'Customer') {
    ticket.status = 'Open';
  }

  await ticket.save();

  if (user?._id) {
    await AuditLog.create({
      actor: user._id,
      actorName: user.name,
      action: 'REPLY_SUPPORT_TICKET',
      details: `Replied to ticket ${ticket.ticketId}`,
    });
  }

  return ticket;
};

export const addInternalNote = async (user, id, note) => {
  const ticket = await SupportTicket.findById(id);
  if (!ticket) {
    throw new ApiError(404, 'Support ticket not found');
  }

  ticket.internalNotes.push({
    authorName: user.name,
    note,
  });

  await ticket.save();

  await AuditLog.create({
    actor: user._id,
    actorName: user.name,
    action: 'ADD_SUPPORT_INTERNAL_NOTE',
    details: `Added private internal note to ticket ${ticket.ticketId}`,
  });

  return ticket;
};

export const submitTicketRating = async (id, score, feedback) => {
  const ticket = await SupportTicket.findById(id);
  if (!ticket) {
    throw new ApiError(404, 'Support ticket not found');
  }

  ticket.rating = {
    score,
    feedback: feedback || '',
    ratedAt: new Date(),
  };

  await ticket.save();
  return ticket;
};

export const updateTicketStatus = async (user, id, statusData) => {
  const ticket = await SupportTicket.findByIdAndUpdate(id, statusData, {
    new: true,
    runValidators: true,
  });
  if (!ticket) {
    throw new ApiError(404, 'Support ticket not found');
  }

  if (user?._id) {
    await AuditLog.create({
      actor: user._id,
      actorName: user.name,
      action: 'UPDATE_SUPPORT_TICKET_STATUS',
      details: `Updated ticket ${ticket.ticketId} status to ${ticket.status}`,
    });
  }

  return ticket;
};

export const reopenTicket = async (user, id) => {
  const ticket = await SupportTicket.findById(id);
  if (!ticket) {
    throw new ApiError(404, 'Support ticket not found');
  }

  ticket.status = 'Open';
  await ticket.save();

  if (user?._id) {
    await AuditLog.create({
      actor: user._id,
      actorName: user.name,
      action: 'REOPEN_SUPPORT_TICKET',
      details: `Reopened support ticket ${ticket.ticketId}`,
    });
  }

  return ticket;
};

export const deleteTicket = async (user, id) => {
  const ticket = await SupportTicket.findById(id);
  if (!ticket) {
    throw new ApiError(404, 'Support ticket not found');
  }

  await SupportTicket.findByIdAndDelete(id);

  if (user?._id) {
    await AuditLog.create({
      actor: user._id,
      actorName: user.name,
      action: 'DELETE_SUPPORT_TICKET',
      details: `Deleted ticket ${ticket.ticketId}`,
    });
  }
};
