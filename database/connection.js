import mysql from "mysql2/promise"; // imports my sql which allows us to connect to database
import dotenv from 'dotenv' // imports .env, this holds passwords that we dont want writen in plain text in the code - the .env will not be seen in the files as it hold sestitive passwords and if trying to run tis aplication a .env should be created in the root directory
dotenv.config() // initilises .env file 

export const pool = mysql.createPool({ // creates connection to the sql databse
  host: 'localhost', // tells mysql that its accesesing a locally hosted database
  user: 'jimmy', // the username to the database
  password: process.env.SQL_PASSWORD, // the password to the database seen in the .env file
  database: 'ecoproject', // the name of the database

  // other configurations
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,

  enableKeepAlive: true,
  keepAliveInitialDelay: 0,
});


export async function query(sql, params = []) { // creates a exported function for making a query to the database easily, by handling errors and returning the data
  try { 
    const [result] = await pool.execute(sql, params); // tells the database connection to execute the passed sql query and the parameters 
    return result; // returns the result of the database query to the users, this 'result' would typically be called rows as it returns rows from the databse
  } catch (cause) { // This just runs if an error occurs
    // throws and prints the error
    throw new Error("Database request failed.", {
      message: "DATABASE_QUERY_FAILED"
    });
  }
}



// old other tested code the should not be worried about:


// export async function insert(query, params = []) {
//   try {
//     const [response] = await pool.query(
//       `INSERT ${query}`,
//       params
//     );

//     console.log(response);
//     return response;
//   } catch (databaseError) {
//     throw new MatrixError(
//       "Unable to insert the data.",
//       {
//         code: "DATABASE_QUERY_FAILED",
//         safeToShow: true,
//         cause: databaseError,
//       }
//     );
//   }
// }


// try {
//   const users = await get("qwe FROM users");
//   console.log(users);
// } catch (error) {
//     console.error(error)
//     const message =
//       error instanceof MatrixError && error.safeToShow
//         ? error.message
//         : "Something went wrong. Please try again.";
//     console.log(message)
// }