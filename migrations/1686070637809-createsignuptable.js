const  Migration  = require('migrate');
const pg = require('pg')
const connection = require('../database/dbConnection')
module.exports.up = function (next) {
  pg.createTable('signup', {
    id: 'id',
    username: { type: 'varchar(255)', unique: true, notNull: true },
    password: { type: 'varchar(255)', notNull: true },
    file:{ type:'File',notNull:true},
    created_at: { type: 'timestamp', notNull: true, default: pgm.func('current_timestamp') },
    updated_at: { type: 'timestamp', notNull: true, default: pgm.func('current_timestamp') },
  });
  next()
}

module.exports.down = function (next) {
  pg.dropTable('signup');
  next()
}
