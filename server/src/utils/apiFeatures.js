class ApiFeatures {
  constructor(query, queryString) {
    this.query = query;
    this.queryString = queryString;
  }

  // 1. Search feature across specified model fields
  search(searchFields = []) {
    const searchTerm = this.queryString.search || this.queryString.keyword;

    if (searchTerm && searchFields.length > 0) {
      const regex = new RegExp(searchTerm, 'i');
      const searchQuery = {
        $or: searchFields.map((field) => ({ [field]: regex })),
      };
      this.query = this.query.find(searchQuery);
    }
    return this;
  }

  // 2. Filter feature (supports numeric & date operators: gt, gte, lt, lte, in)
  filter() {
    const queryObj = { ...this.queryString };
    const excludedFields = ['page', 'sort', 'limit', 'fields', 'search', 'keyword'];
    excludedFields.forEach((el) => delete queryObj[el]);

    // Advanced filtering (gt, gte, lt, lte, in)
    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt|in)\b/g, (match) => `$${match}`);

    this.query = this.query.find(JSON.parse(queryStr));
    return this;
  }

  // 3. Sort feature
  sort(defaultSort = '-createdAt') {
    if (this.queryString.sort) {
      const sortBy = this.queryString.sort.split(',').join(' ');
      this.query = this.query.sort(sortBy);
    } else {
      this.query = this.query.sort(defaultSort);
    }
    return this;
  }

  // 4. Limit fields feature
  limitFields() {
    if (this.queryString.fields) {
      const fields = this.queryString.fields.split(',').join(' ');
      this.query = this.query.select(fields);
    } else {
      this.query = this.query.select('-__v');
    }
    return this;
  }

  // 5. Pagination feature
  async paginate() {
    const page = parseInt(this.queryString.page, 10) || 1;
    const limit = parseInt(this.queryString.limit, 10) || 10;
    const skip = (page - 1) * limit;

    // Clone query to count total matching records before applying skip/limit
    const countQuery = this.query.model.find(this.query.getFilter());
    const total = await countQuery.countDocuments();

    this.query = this.query.skip(skip).limit(limit);

    const totalPages = Math.ceil(total / limit) || 1;

    return {
      page,
      limit,
      total,
      totalPages,
      hasNextPage: page < totalPages,
      hasPrevPage: page > 1,
    };
  }
}

export default ApiFeatures;
