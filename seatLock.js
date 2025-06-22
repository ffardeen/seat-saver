import puppeteer from "puppeteer";
import dotenv from "dotenv";
import { execSync } from "child_process";
dotenv.config();

export async function lockSeats() {
  const browser = await puppeteer.launch({
    headless: "new",
    executablePath: "/usr/bin/chromium", // <== Use installed Chromium
    args: ["--no-sandbox", "--disable-setuid-sandbox"]
  });

  const page = await browser.newPage();

  if (process.env.COOKIE_NAME && process.env.COOKIE_VALUE) {
    await page.setCookie({
      name: process.env.COOKIE_NAME,
      value: process.env.COOKIE_VALUE,
      domain: "in.bookmyshow.com",
      path: "/"
    });
  }

  // ... rest of the code
}
