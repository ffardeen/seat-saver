import puppeteer from "puppeteer";
import dotenv from "dotenv";
dotenv.config();

export async function lockSeats() {
  const browser = await puppeteer.launch({
    headless: "new",
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

  const soapXml = `
    <soap:Envelope xmlns:soap="http://www.w3.org/2003/05/soap-envelope">
      <soap:Body>
        <objExecute xmlns="http://www.bookmyshow.com/">
          <strInput>
            <![CDATA[
              cmd=LOCKSEATS|VENUEID=${process.env.VENUEID}|SESSIONID=${process.env.SESSIONID}|SEATCODES=${process.env.SEATCODES}|PRICECODE=${process.env.PRICECODE}|TRANSACTIONID=${process.env.TRANSACTIONID}|UID=${process.env.UID}|
            ]]>
          </strInput>
        </objExecute>
      </soap:Body>
    </soap:Envelope>
  `.trim();

  try {
    const response = await page.evaluate(async (soapXml) => {
      const res = await fetch("https://in.bookmyshow.com/serv/doSecureTrans.bms", {
        method: "POST",
        headers: {
          "Content-Type": "application/soap+xml"
        },
        body: soapXml
      });
      return await res.text();
    }, soapXml);

    console.log("Seat lock response:", response);
  } catch (error) {
    console.error("Seat lock failed:", error);
  } finally {
    await browser.close();
  }
}
