import mysql from "mysql2/promise";
import dotenv from 'dotenv'
dotenv.config()

export const pool = mysql.createPool({
  host: 'localhost',
  user: 'jimmy',
  password: process.env.SQL_PASSWORD,
  database: 'ecoproject',

  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,

  enableKeepAlive: true,
  keepAliveInitialDelay: 0,
});


export async function query(sql, params = []) {
  try {
    const [result] = await pool.execute(sql, params);
    return result;
  } catch (cause) {
    throw new Error("Database request failed.", {
      message: "DATABASE_QUERY_FAILED"
    });
  }
}


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