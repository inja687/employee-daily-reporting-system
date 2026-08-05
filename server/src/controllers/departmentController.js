import asyncHandler from '../utils/asyncHandler.js';
import ApiResponse from '../utils/ApiResponse.js';
import * as departmentService from '../services/departmentService.js';

export const createDepartment = asyncHandler(async (req, res) => {
  const tenantId = req.user.role === 'Super Admin' ? req.body.tenantId || req.user.tenantId : req.user.tenantId;
  const companyId = req.user.companyId?._id || req.user.companyId;

  const department = await departmentService.createDepartment(tenantId, companyId, req.body);
  res.status(201).json(new ApiResponse(201, department, 'Department created successfully'));
});

export const getDepartments = asyncHandler(async (req, res) => {
  const tenantId = req.user.role === 'Super Admin' ? req.query.tenantId || req.user.tenantId : req.user.tenantId;

  const result = await departmentService.getDepartments(tenantId, req.query);
  res.status(200).json(new ApiResponse(200, result, 'Departments retrieved successfully'));
});

export const getDepartmentById = asyncHandler(async (req, res) => {
  const tenantId = req.user.role === 'Super Admin' ? null : req.user.tenantId;
  const department = await departmentService.getDepartmentById(req.params.id, tenantId);
  res.status(200).json(new ApiResponse(200, department, 'Department details retrieved'));
});

export const updateDepartment = asyncHandler(async (req, res) => {
  const tenantId = req.user.role === 'Super Admin' ? null : req.user.tenantId;
  const department = await departmentService.updateDepartment(req.params.id, tenantId, req.body);
  res.status(200).json(new ApiResponse(200, department, 'Department updated successfully'));
});

export const deleteDepartment = asyncHandler(async (req, res) => {
  const tenantId = req.user.role === 'Super Admin' ? null : req.user.tenantId;
  await departmentService.deleteDepartment(req.params.id, tenantId);
  res.status(200).json(new ApiResponse(200, null, 'Department deleted successfully'));
});
