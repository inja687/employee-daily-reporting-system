import Notice from '../models/Notice.js';
import ApiError from '../utils/ApiError.js';
import ApiFeatures from '../utils/apiFeatures.js';

export const createNotice = async (user, data) => {
  return await Notice.create({
    ...data,
    postedBy: user._id,
    tenantId: user.tenantId,
    companyId: user.companyId?._id || user.companyId || null,
  });
};

export const getNotices = async (user, queryString) => {
  const tenantId = user.tenantId;
  if (!tenantId) {
    return { notices: [], pagination: { total: 0, page: 1, limit: 10, totalPages: 0 } };
  }

  const query = Notice.find({
    tenantId,
    $or: [{ targetRoles: { $size: 0 } }, { targetRoles: user.role }],
  }).populate('postedBy', 'name email role');

  const features = new ApiFeatures(query, queryString)
    .filter()
    .search(['title', 'content', 'priority'])
    .sort('-isPinned -createdAt');

  const pagination = await features.paginate();
  const notices = await features.query;

  return { notices, pagination };
};

export const getNoticeById = async (id, user) => {
  const query = user.role === 'Super Admin' ? { _id: id } : { _id: id, tenantId: user.tenantId };
  const notice = await Notice.findOne(query).populate('postedBy', 'name email role');
  if (!notice) {
    throw new ApiError(404, 'Notice not found');
  }
  return notice;
};

export const updateNotice = async (id, user, data) => {
  const query = user.role === 'Super Admin' ? { _id: id } : { _id: id, tenantId: user.tenantId };
  const notice = await Notice.findOneAndUpdate(query, data, {
    new: true,
    runValidators: true,
  });
  if (!notice) {
    throw new ApiError(404, 'Notice not found');
  }
  return notice;
};

export const deleteNotice = async (id, user) => {
  const query = user.role === 'Super Admin' ? { _id: id } : { _id: id, tenantId: user.tenantId };
  const notice = await Notice.findOneAndDelete(query);
  if (!notice) {
    throw new ApiError(404, 'Notice not found');
  }
};
