import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CreateFeatureTableMigration1588791888361 implements MigrationInterface {
  name: string = 'CreateFeatureTableMigration1588791888361';

  async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'feature',
        columns: [
          {
            name: 'id',
            type: 'integer',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          {
            name: 'name',
            type: 'varchar',
            length: '255',
            isNullable: false,
          },
          {
            name: 'status',
            type: 'varchar',
            length: '8',
            isNullable: false,
          },
        ],
      }),
      true
    );

    await queryRunner.query("INSERT INTO feature(name, status) VALUES('PRODUCT_ORDERING', 'ENABLED')");
  }

  async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('feature');
  }
}
