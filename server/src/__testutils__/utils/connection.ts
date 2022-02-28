import { createConnection, getConnection } from 'typeorm';
const connection = {
  // connect to db
  async create() {
    await createConnection();
  },

  // close connection
  async close() {
    await getConnection().close();
  },

  // clear all tables
  async clear() {
    const connection = getConnection();
    const entities = connection.entityMetadatas;

    entities.forEach(async (entity) => {
      await connection.query(`TRUNCATE ${entity.tableName};`);
    });
  },
};

export default connection;
