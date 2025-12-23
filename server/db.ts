import { drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";
import * as schema from "@shared/schema";

let db: any;
const url = process.env.DATABASE_URL;
if (url && url.length > 0) {
  const poolConnection = mysql.createPool(url);
  db = drizzle(poolConnection, { schema, mode: "default" });
} else {
  db = new Proxy(
    {},
    {
      get() {
        throw new Error("Database not configured. Set DATABASE_URL to enable persistence.");
      },
    },
  );
}

export { db };
