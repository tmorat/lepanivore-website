import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CreateOrderTableMigration1586118263949 implements MigrationInterface {
  name: string = 'CreateOrderTableMigration1586118263949';

  async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'order',
        columns: [
          {
            name: 'id',
            type: 'integer',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          {
            name: 'client_name',
            type: 'varchar',
            length: '255',
            isNullable: false,
          },
          {
            name: 'client_phone_number',
            type: 'varchar',
            length: '255',
            isNullable: false,
          },
          {
            name: 'client_email_address',
            type: 'varchar',
            length: '255',
            isNullable: false,
          },
          {
            name: 'products',
            type: 'text',
            isNullable: false,
          },
          {
            name: 'type',
            type: 'varchar',
            length: '8',
            isNullable: false,
          },
          {
            name: 'pick_up_date',
            type: 'varchar',
            length: '24',
            isNullable: true,
          },
          {
            name: 'delivery_date',
            type: 'varchar',
            length: '24',
            isNullable: true,
          },
          {
            name: 'delivery_address',
            type: 'text',
            isNullable: true,
          },
        ],
      }),
      true
    );
  }

  async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('order');
  }
}
