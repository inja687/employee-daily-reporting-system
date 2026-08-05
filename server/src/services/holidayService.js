import Holiday from '../models/Holiday.js';
import ApiError from '../utils/ApiError.js';
import ApiFeatures from '../utils/apiFeatures.js';

export const createHoliday = async (data) => {
  return await Holiday.create(data);
};

export const getHolidays = async (queryString) => {
  const features = new ApiFeatures(Holiday.find(), queryString)
    .filter()
    .search(['title', 'description', 'type'])
    .sort('date');

  const pagination = await features.paginate();
  const holidays = await features.query;

  return { holidays, pagination };
};

export const getHolidayById = async (id) => {
  const holiday = await Holiday.findById(id);
  if (!holiday) {
    throw new ApiError(404, 'Holiday not found');
  }
  return holiday;
};

export const updateHoliday = async (id, data) => {
  const holiday = await Holiday.findByIdAndUpdate(id, data, {
    new: true,
    runValidators: true,
  });
  if (!holiday) {
    throw new ApiError(404, 'Holiday not found');
  }
  return holiday;
};

export const deleteHoliday = async (id) => {
  const holiday = await Holiday.findByIdAndDelete(id);
  if (!holiday) {
    throw new ApiError(404, 'Holiday not found');
  }
};
