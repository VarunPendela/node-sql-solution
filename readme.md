# Node.js SQL Solution

## Overview
This project is built for the Bajaj Finserv Health | Qualifier 1 challenge.  
I implemented the required flow in **Node.js (Express not needed)** since I am proficient in it.  
The logic is identical to the Spring Boot version described in the problem.

## Flow
1. On startup, sends POST request to generate webhook
2. Gets webhook URL and access token
3. Chooses SQL query (Q1 for odd regNo, Q2 for even regNo)
4. Submits SQL query with JWT Authorization header

## Run
```bash
npm install
node app.js
