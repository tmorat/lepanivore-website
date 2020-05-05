import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CreateClosingPeriodTableMigration1588700997345 implements MigrationInterface {
  name: string = 'CreateClosingPeriodTableMigration1588700997345';

  async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'closing_period',
        columns: [
          {
            name: 'id',
            type: 'integer',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          {
            name: 'start_date',
            type: 'varchar',
            length: '24',
            isNullable: false,
          },
          {
            name: 'end_date',
            type: 'varchar',
            length: '24',
            isNullable: false,
          },
        ],
      }),
      true
    );
  }

  async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('closing_period');
  }
}
