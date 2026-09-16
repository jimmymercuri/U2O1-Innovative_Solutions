import express from "express";
import http from "node:http";
import WebSocket, { WebSocketServer } from "ws";
import { randomUUID } from "node:crypto";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { query } from "./database/connection.js";

const app = express();
const server = http.createServer(app);
const wss = new WebSocketServer({ server });

const PORT = 3134;
const pendingRequests = new Map();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const frontendPath = path.join(__dirname, './Frontend');

console.log(frontendPath)


app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(frontendPath));

const issueNames = {
    1: "Active bushfire",
    2: "Flood",
    3: "Grass fire",
    4: "Severe storm damage",
    5: "Fallen tree",
    6: "Dangerous wildlife",
    7: "Major track damage",
    8: "Water contamination",
    9: "Invasive species",
    10: "Pest outbreak",
    11: "Erosion",
    12: "Illegal dumping",
    13: "Minor track damage",
    14: "Minor vegetation damage",
    15: "Litter",
    16: "Minor maintenance issue"
};


function getNextId(id) { // function is for getting the next id
    const currentId = id.id
    // 1. Split the ID into the prefix ("RPT-") and the numeric part ("0400")
    const parts = currentId.split('-');
    const prefix = parts[0];
    const numberStr = parts[1];

    // 2. Convert the string to a number and add 1
    const nextNumber = parseInt(numberStr, 10) + 1;

    // 3. Pad the new number with leading zeros to match the original length
    const paddedNumber = String(nextNumber).padStart(numberStr.length, '0');

    // 4. Recombine and return the new ID
    return `${prefix}-${paddedNumber}`;
}

function formatDate(date = new Date()) { // gets formated date dd/mm/yyyy
    return new Intl.DateTimeFormat('en-GB').format(date);
}

function requestEvent(event, data = {}, timeoutMs = 10_000) {
    const requestId = randomUUID();

    // Find a connected Python program that registered this event.
    const client = [...wss.clients].find(
        client =>
            client.readyState === WebSocket.OPEN &&
            client.registeredEvents?.has(event)
    );

    if (!client) {
        return Promise.reject(
            new Error(`No connected program handles the "${event}" event`)
        );
    }

    return new Promise((resolve, reject) => {
        const timeout = setTimeout(() => {
            pendingRequests.delete(requestId);

            reject(
                new Error(`The "${event}" request timed out`)
            );
        }, timeoutMs);

        pendingRequests.set(requestId, {
            client,
            resolve,
            reject,
            timeout
        });

        const message = JSON.stringify({
            type: "event",
            requestId,
            event,
            data
        });

        console.log("Sending:", message);

        client.send(message, error => {
            if (!error) {
                return;
            }

            const pending = pendingRequests.get(requestId);

            if (!pending) {
                return;
            }

            clearTimeout(pending.timeout);
            pendingRequests.delete(requestId);
            pending.reject(error);
        });
    });
}

function calculatePriority(issue, hazard, extent, escalation, exposure) {
    return requestEvent("calculate", {
        issue,
        hazard,
        extent,
        escalation,
        exposure
    });
}

app.get("/", (req, res) => {
  res.sendFile(path.join(frontendPath, 'index.html'));
});

app.get('/submit-report', async (req, res) => {
    res.sendFile(path.join(frontendPath, 'index.html'));
})
app.post("/submit-report", async (req, res) => {
    const body = req.body ?? {};
    const requiredFields = [
        "hazard",
        "extent",
        "escalation",
        "exposure"
    ];

    const missingFields = requiredFields.filter(field =>
        body[field] === undefined ||
        body[field] === null ||
        body[field] === ""
    );

    if (missingFields.length > 0) {
        return res.status(400).json({
            success: false,
            error: `Missing fields: ${missingFields.join(", ")}`
        });
    }

    // Form inputs arrive as strings, so convert them into numbers.
    const issue = Number(body.issue);
    const issue_id = Number(body.issue_id);
    const hazard = Number(body.hazard);
    const extent = Number(body.extent);
    const escalation = Number(body.escalation);
    const exposure = Number(body.exposure);

    const values = {
        issue,
        hazard,
        extent,
        escalation,
        exposure
    };

    const invalidFields = Object.entries(values)
        .filter(([, value]) => !Number.isFinite(value))
        .map(([field]) => field);

    if (invalidFields.length > 0) {
        return res.status(400).json({
            success: false,
            error: `These fields must be numbers: ${invalidFields.join(", ")}`
        });
    }

    try {
        const response = await calculatePriority(
            issue,
            hazard,
            extent,
            escalation,
            exposure
        );

        const priorityScore = response.priority_score;

        const last_id = await query('SELECT id FROM sites ORDER BY id DESC LIMIT 1', null)
        const id = getNextId(last_id[0])
        const date = formatDate(new Date())

        const issueName = issueNames[issue_id];
        // console.log({ id, site_id: null, name: body.name, description: body.description, date, hazard: hazard, extent: extent, escalation: escalation, exposure: exposure, priorityScore, issue: issue });
        const sql_response = await query('INSERT INTO sites (id, site_id, site_name, site_description, date_added, site_hazard, site_extent, site_escalation, site_exposure, site_priority, site_issue) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)', [id, null, body.name, body.description, date, hazard, extent, escalation, exposure, priorityScore, issueName]);

        // console.log(sql_response)

        return res.redirect('/')
    } catch (error) {
        console.error("Calculation failed:", error);

        return res.status(503).json({
            success: false,
            error: error.message
        });
    }
});






app.get("/testing", (req, res) => {
    res.sendFile(
        path.join(__dirname, "/Frontend/public", "submit.html")
    );
});

app.post("/testing", async (req, res) => {
    const body = req.body ?? {};
    const requiredFields = [
        "hazard",
        "extent",
        "escalation",
        "exposure"
    ];

    const missingFields = requiredFields.filter(field =>
        body[field] === undefined ||
        body[field] === null ||
        body[field] === ""
    );

    if (missingFields.length > 0) {
        return res.status(400).json({
            success: false,
            error: `Missing fields: ${missingFields.join(", ")}`
        });
    }

    // Form inputs arrive as strings, so convert them into numbers.
    const hazard = Number(body.hazard);
    const extent = Number(body.extent);
    const escalation = Number(body.escalation);
    const exposure = Number(body.exposure);

    const values = {
        hazard,
        extent,
        escalation,
        exposure
    };

    const invalidFields = Object.entries(values)
        .filter(([, value]) => !Number.isFinite(value))
        .map(([field]) => field);

    if (invalidFields.length > 0) {
        return res.status(400).json({
            success: false,
            error: `These fields must be numbers: ${invalidFields.join(", ")}`
        });
    }

    try {
        const response = await calculatePriority(
            hazard,
            extent,
            escalation,
            exposure
        );

        return res.json({
            success: true,
            response
        });
    } catch (error) {
        console.error("Calculation failed:", error);

        return res.status(503).json({
            success: false,
            error: error.message
        });
    }
});


// API CALLS
app.get("/api/sites", async (req, res) => {
  const amount = Number(req.query.length);

  res.json({
    sites: await query(
      "SELECT * FROM sites ORDER BY id DESC LIMIT ?",
      [amount]
    )
  });
});

app.get("/api/sites/:id", async (req, res) => {
  const id = req.params.id
  res.json({
    site: await query(
      "SELECT * FROM sites WHERE id = ?",
      [id]
    )
  });
});




wss.on("connection", ws => {
    console.log("WebSocket connected");

    // These are filled when Python sends its registration message.
    ws.programName = null;
    ws.registeredEvents = new Set();

    ws.on("message", rawMessage => {
        let message;

        try {
            message = JSON.parse(rawMessage.toString());
        } catch {
            console.log(
                "Invalid JSON received:",
                rawMessage.toString()
            );
            return;
        }

        console.log("Received:", message);

        if (message.type === "register") {
            ws.programName = message.program;
            ws.registeredEvents = new Set(
                Array.isArray(message.events) ? message.events : []
            );

            console.log(
                `Program registered: ${ws.programName}`,
                [...ws.registeredEvents]
            );

            return;
        }

        if (message.type !== "result" && message.type !== "error") {
            return;
        }

        const pending = pendingRequests.get(message.requestId);

        if (!pending) {
            console.log(
                `No pending request found for ${message.requestId}`
            );
            return;
        }

        // Only accept a response from the program that received the request.
        if (pending.client !== ws) {
            return;
        }

        clearTimeout(pending.timeout);
        pendingRequests.delete(message.requestId);

        if (message.type === "error") {
            pending.reject(
                new Error(message.error || "Unknown Python error")
            );
        } else {
            pending.resolve(message.data);
        }
    });

    ws.on("close", () => {
        console.log(
            `WebSocket disconnected: ${ws.programName ?? "unregistered client"}`
        );

        // Reject requests that were waiting on this program.
        for (const [requestId, pending] of pendingRequests) {
            if (pending.client !== ws) {
                continue;
            }

            clearTimeout(pending.timeout);
            pendingRequests.delete(requestId);

            pending.reject(
                new Error("Python program disconnected before responding")
            );
        }
    });

    ws.on("error", error => {
        console.error("WebSocket error:", error);
    });
});

server.listen(PORT, "127.0.0.1", () => {
    console.log(`Server running on http://127.0.0.1:${PORT}`);
});