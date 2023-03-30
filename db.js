import knex from 'knex'
import dotenv from 'dotenv'

dotenv.config()

//database connection
const db = knex({
    client: 'mysql2',
      connection: {
        host : process.env.DB_HOST,
        port: process.env.DB_PORT,
        user : process.env.DB_USER,
        database : process.env.DB_DATABASE
      }
    });

//check the connection
db.raw("SELECT VERSION()").then(()=>{
    console.log('knex successfull');
    }).catch((err)=>{
      console.error(err.message);
    })

export default db
