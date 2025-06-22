import { scheduleJob } from "node-schedule";
import { lockSeats } from "./seatLock.js";

console.log("Starting seat locker worker...");

// Run immediately
lockSeats();

// Then run every 5 minutes
scheduleJob("*/5 * * * *", () => {
  lockSeats();
});
