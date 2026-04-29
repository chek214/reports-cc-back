import snowflake from "snowflake-sdk"

const connection = snowflake.createConnection({
    account: process.env.SNOWFLAKE_ACCOUNT,
    username: process.env.SNOWFLAKE_USER,
    password: process.env.SNOWFLAKE_PASSWORD,
    warehouse: process.env.SNOWFLAKE_WAREHOUSE,
    database: process.env.SNOWFLAKE_DATABASE,
    role: process.env.SNOWFLAKE_ROLE,
    schema: process.env.SNOWFLAKE_SCHEMA,
    authenticator: "SNOWFLAKE",
    clientSessionKeepAlive: true
})

connection.connect(function(err, conn) {
    if (err) {
      	console.error("Unable to connect: " + err.message)
    } else {
      	console.info("[SNOWFLAKE] Successfully connected as id: " + connection.getId())
    }
})

async function query(sqlText, binds = [], options = { returnQueryId: false }) {
	return new Promise((resolve, reject) => {
      	connection.execute({
          	sqlText,
            binds,
          	complete: (err, stmt, rows) => {
            	if (err) {
					console.error("Failed to execute statement due to the following error: " + err.message)
					// console.error("Data: ", { stmt, rows , sqlText })
					reject(err)
              	} else {
                  	// Get the result set from the statement
                  	console.info("[SNOWFLAKE] Successfully executed statement:", { queryId: stmt.getQueryId(), sqlText: stmt.getSqlText() })
                  	// Convert the object keys to lower case
                    const normalizedRows = rows.map(row => {
                        const newRow = {}
                        Object.keys(row).forEach(key => {
                            newRow[key.toLowerCase()] = row[key]
                        })
                        return newRow
                    })

					if (options.returnQueryId) {
						resolve({
							rows: normalizedRows,
							queryId: stmt.getQueryId(),
						})
					} else {
						resolve(normalizedRows)
					}
              	}
          	}
      	})
  	})
}

/**
 * Executes a simple query to verify the connection is alive.
 * @returns {Promise<void>}
 */
const ping = () => {
    return new Promise((resolve, reject) => {
        connection.execute({
            sqlText: "SELECT 1",
            complete: (err) => {
                if (err) return reject(err)
                resolve()
            }
        })
    })
}

export { connection, query, ping }