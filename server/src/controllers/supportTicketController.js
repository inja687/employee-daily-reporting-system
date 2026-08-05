import asyncHandler from '../utils/asyncHandler.js';
import ApiResponse from '../utils/ApiResponse.js';
import * as ticketService from '../services/supportTicketService.js';

export const createPublicTicket = asyncHandler(async (req, res) => {
  const ticket = await ticketService.createPublicTicket(req.body);
  res.status(201).json(new ApiResponse(201, ticket, `Support ticket ${ticket.ticketId} created successfully`));
});

export const createCompanyTicket = asyncHandler(async (req, res) => {
  const ticket = await ticketService.createCompanyTicket(req.user, req.body);
  res.status(201).json(new ApiResponse(201, ticket, `Help Desk ticket ${ticket.ticketId} created successfully`));
});

export const getCompanyTickets = asyncHandler(async (req, res) => {
  const tickets = await ticketService.getCompanyTickets(req.user.tenantId);
  res.status(200).json(new ApiResponse(200, tickets, 'Company support tickets retrieved successfully'));
});

export const getAllTicketsSuperAdmin = asyncHandler(async (req, res) => {
  const data = await ticketService.getAllTicketsSuperAdmin();
  res.status(200).json(new ApiResponse(200, data, 'All platform support tickets retrieved for Super Admin'));
});

export const getTicketById = asyncHandler(async (req, res) => {
  const ticket = await ticketService.getTicketById(req.params.id);
  res.status(200).json(new ApiResponse(200, ticket, 'Support ticket details retrieved'));
});

export const addReply = asyncHandler(async (req, res) => {
  const ticket = await ticketService.addReply(req.user, req.params.id, req.body.message);
  res.status(200).json(new ApiResponse(200, ticket, 'Reply added to support ticket conversation'));
});

export const addInternalNote = asyncHandler(async (req, res) => {
  const ticket = await ticketService.addInternalNote(req.user, req.params.id, req.body.note);
  res.status(200).json(new ApiResponse(200, ticket, 'Private internal note logged successfully'));
});

export const submitTicketRating = asyncHandler(async (req, res) => {
  const { score, feedback } = req.body;
  const ticket = await ticketService.submitTicketRating(req.params.id, score, feedback);
  res.status(200).json(new ApiResponse(200, ticket, 'Customer satisfaction rating saved'));
});

export const updateTicketStatus = asyncHandler(async (req, res) => {
  const ticket = await ticketService.updateTicketStatus(req.user, req.params.id, req.body);
  res.status(200).json(new ApiResponse(200, ticket, 'Support ticket updated successfully'));
});

export const reopenTicket = asyncHandler(async (req, res) => {
  const ticket = await ticketService.reopenTicket(req.user, req.params.id);
  res.status(200).json(new ApiResponse(200, ticket, 'Support ticket reopened'));
});

export const deleteTicket = asyncHandler(async (req, res) => {
  await ticketService.deleteTicket(req.user, req.params.id);
  res.status(200).json(new ApiResponse(200, null, 'Support ticket deleted successfully'));
});
