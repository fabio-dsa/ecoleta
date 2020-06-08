import knex from 'knex';

const connection = knex({
    client: 'pg',
    connection: {
        host : '127.0.0.1',
        user : 'postgres',
        password : 'xuule115',
        database : 'ecoleta',
        port: 5433
    }
});

export default connection;