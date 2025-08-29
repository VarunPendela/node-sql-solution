import axios from "axios";

// Your details
const NAME = "John Doe";
const REG_NO = "REG12347"; // change this
const EMAIL = "john@example.com";

(async function main() {
  try {
    // Step 1: Generate webhook
    const genResp = await axios.post(
      "https://bfhldevapigw.healthrx.co.in/hiring/generateWebhook/JAVA",
      { name: NAME, regNo: REG_NO, email: EMAIL }
    );

    const { webhook, accessToken } = genResp.data;
    console.log("Generated Webhook:", webhook);
    console.log("Access Token:", accessToken);

    // Step 2: Choose SQL query
    const lastTwo = parseInt(REG_NO.slice(-2), 10);
    let finalQuery;

    if (lastTwo % 2 === 1) {
      // Odd → Question 1
      finalQuery = `
        SELECT 
            p.AMOUNT AS SALARY,
            CONCAT(e.FIRST_NAME, ' ', e.LAST_NAME) AS NAME,
            TIMESTAMPDIFF(YEAR, e.DOB, CURDATE()) AS AGE,
            d.DEPARTMENT_NAME
        FROM PAYMENTS p
        JOIN EMPLOYEE e ON p.EMP_ID = e.EMP_ID
        JOIN DEPARTMENT d ON e.DEPARTMENT = d.DEPARTMENT_ID
        WHERE DAY(p.PAYMENT_TIME) <> 1
        ORDER BY p.AMOUNT DESC
        LIMIT 1;
      `;
    } else {
      // Even → Question 2
      finalQuery = `
        SELECT 
            e1.EMP_ID,
            e1.FIRST_NAME,
            e1.LAST_NAME,
            d.DEPARTMENT_NAME,
            COUNT(e2.EMP_ID) AS YOUNGER_EMPLOYEES_COUNT
        FROM EMPLOYEE e1
        JOIN DEPARTMENT d ON e1.DEPARTMENT = d.DEPARTMENT_ID
        LEFT JOIN EMPLOYEE e2 
            ON e1.DEPARTMENT = e2.DEPARTMENT
           AND e2.DOB > e1.DOB
        GROUP BY e1.EMP_ID, e1.FIRST_NAME, e1.LAST_NAME, d.DEPARTMENT_NAME
        ORDER BY e1.EMP_ID DESC;
      `;
    }

    // Step 3: Submit SQL query
    const submitResp = await axios.post(
      webhook,
      { finalQuery },
      {
        headers: {
          Authorization: accessToken,
          "Content-Type": "application/json",
        },
      }
    );

    console.log("Submission Response:", submitResp.data);

  } catch (err) {
    console.error("Error:", err.response?.data || err.message);
  }
})();
