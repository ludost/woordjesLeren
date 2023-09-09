import express from "npm:express"
import cookieParser from "npm:cookie-parser"
import logger from "npm:morgan"
import { join } from "https://deno.land/std@0.201.0/path/posix.ts"

import * as index from "./routes/index.js"
import * as list from "./routes/lijstjes.js"

const __dirname = new URL(".", import.meta.url).pathname
const app = express()

app.use(logger("dev"))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(express.static(join(__dirname, "public")))

app.use("/", index.router)
app.use("/lists", list.router)

var port = normalizePort(Deno.env.get("PORT") || "3000")
app.listen(port)

/**
 * Normalize a port into a number, string, or false.
 */

function normalizePort(val) {
  var port = parseInt(val, 10)

  if (isNaN(port)) {
    // named pipe
    return val
  }

  if (port >= 0) {
    // port number
    return port
  }

  return false
}
