import Department from '../models/Department.js';
import ApiError from '../utils/ApiError.js';
import ApiFeatures from '../utils/apiFeatures.js';

export const createDepartment = async (tenantId, companyId, data) => {
  if (!tenantId) {
    throw new ApiError(403, 'Tenant isolation required to create department');
  }

  const existing = await Department.findOne({
    tenantId,
    $or: [{ name: data.name }, { code: data.code.toUpperCase() }],
  });

  if (existing) {
    throw new ApiError(400, 'Department with this name or code already exists in your workspace');
  }

  return await Department.create({
    ...data,
    tenantId,
    companyId: companyId || null,
  });
};

export const getDepartments = async (tenantId, queryString) => {
  if (!tenantId) {
    return { departments: [], pagination: { total: 0, page: 1, limit: 10, totalPages: 0 } };
  }

  const features = new ApiFeatures(
    Department.find({ tenantId }).populate('head', 'name email employeeId'),
    queryString
  )
    .filter()
    .search(['name', 'code', 'description'])
    .sort();

  const pagination = await features.paginate();
  const departments = await features.query;

  return { departments, pagination };
};

export const getDepartmentById = async (id, tenantId) => {
  const query = tenantId ? { _id: id, tenantId } : { _id: id };
  const department = await Department.findOne(query).populate('head', 'name email employeeId');
  if (!department) {
    throw new ApiError(404, 'Department not found');
  }
  return department;
};

export const updateDepartment = async (id, tenantId, data) => {
  const query = tenantId ? { _id: id, tenantId } : { _id: id };
  const department = await Department.findOneAndUpdate(query, data, {
    new: true,
    runValidators: true,
  });
  if (!department) {
    throw new ApiError(404, 'Department not found');
  }
  return department;
};

export const deleteDepartment = async (id, tenantId) => {
  const query = tenantId ? { _id: id, tenantId } : { _id: id };
  const department = await Department.findOneAndDelete(query);
  if (!department) {
    throw new ApiError(404, 'Department not found');
  }
};
