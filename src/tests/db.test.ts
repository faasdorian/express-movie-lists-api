import { AppDataSource } from "../config/database";


beforeAll(async () => {
  await AppDataSource.initialize();
});

describe('Database tests', () => {

  it('can connect to the database', async () => {
    const queryRunner = AppDataSource.createQueryRunner();
    await queryRunner.connect();
    expect(async () => await queryRunner.release()).not.toThrow();
  });

});