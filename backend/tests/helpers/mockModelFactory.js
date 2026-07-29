const createModelMock = (modelName) => {
  const records = [];
  let counter = 1;

  const buildRecord = (doc) => ({
    _id: String(counter++),
    createdAt: new Date(),
    updatedAt: new Date(),
    ...doc,
  });

  const cloneRecord = (record) => ({ ...record });

  const filterRecords = (query = {}) => {
    return records.filter((record) => {
      return Object.entries(query).every(([key, value]) => {
        if (
          value &&
          typeof value === "object" &&
          !Array.isArray(value) &&
          value.$gt
        ) {
          return record[key] > value.$gt;
        }
        if (
          value &&
          typeof value === "object" &&
          !Array.isArray(value) &&
          value.$lte
        ) {
          return record[key] <= value.$lte;
        }
        if (
          typeof value === "object" &&
          value !== null &&
          !Array.isArray(value)
        ) {
          return record[key] === value[key];
        }
        return record[key] === value;
      });
    });
  };

  const create = async (doc) => {
    const record = buildRecord(doc);
    records.push(record);
    return record;
  };

  const findOne = async (query = {}) => {
    const match = filterRecords(query)[0];
    if (!match) {
      return null;
    }
    return withSelect(match);
  };

  const findById = async (id) => {
    const match = records.find(
      (record) => record._id.toString() === id.toString(),
    );
    if (!match) {
      return null;
    }
    return withSelect(match);
  };

  const find = (query = {}) => {
    const result = filterRecords(query).map((record) => cloneRecord(record));
    return new Query(result);
  };

  const countDocuments = async (query = {}) => filterRecords(query).length;

  const findByIdAndUpdate = async (id, update, options = {}) => {
    const index = records.findIndex(
      (record) => record._id.toString() === id.toString(),
    );
    if (index === -1) {
      return null;
    }
    const updated = { ...records[index], ...update, updatedAt: new Date() };
    records[index] = updated;
    return options.new === false
      ? cloneRecord(records[index])
      : withSelect(updated);
  };

  const findOneAndUpdate = async (query, update, options = {}) => {
    const match = filterRecords(query)[0];
    if (!match) {
      if (options.upsert) {
        const newDoc = { ...query };
        if (update && update.$set) {
          Object.assign(newDoc, update.$set);
        }
        const created = await create(newDoc);
        return options.new === false
          ? cloneRecord(created)
          : withSelect(created);
      }
      return null;
    }

    const updated = { ...match, ...update, updatedAt: new Date() };
    const index = records.findIndex(
      (record) => record._id.toString() === match._id.toString(),
    );
    records[index] = updated;
    return options.new === false ? cloneRecord(updated) : withSelect(updated);
  };

  const findByIdAndDelete = async (id) => {
    const index = records.findIndex(
      (record) => record._id.toString() === id.toString(),
    );
    if (index === -1) {
      return null;
    }
    const removed = records.splice(index, 1)[0];
    return removed;
  };

  const deleteMany = async (query = {}) => {
    const toRemove = filterRecords(query);
    for (const record of toRemove) {
      const index = records.findIndex(
        (item) => item._id.toString() === record._id.toString(),
      );
      if (index !== -1) {
        records.splice(index, 1);
      }
    }
    return { deletedCount: toRemove.length };
  };

  const reset = () => {
    records.length = 0;
    counter = 1;
  };

  const withSelect = (record) => ({
    ...record,
    select: () => ({ ...record }),
    lean: () => ({ ...record }),
  });

  class Query {
    constructor(result) {
      this.result = result;
    }

    populate() {
      return this;
    }

    sort() {
      return this;
    }

    skip() {
      return this;
    }

    limit() {
      return this;
    }

    lean() {
      return this;
    }

    then(resolve) {
      return Promise.resolve(this.result).then(resolve);
    }

    catch(reject) {
      return Promise.resolve(this.result).catch(reject);
    }
  }

  return {
    __modelName: modelName,
    create,
    findOne,
    findById,
    find,
    countDocuments,
    findByIdAndUpdate,
    findOneAndUpdate,
    findByIdAndDelete,
    deleteMany,
    reset,
  };
};

module.exports = {
  createModelMock,
};
