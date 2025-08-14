// server.ts
import express, { Express } from "express";
import session from "express-session";
import { createServer, Server } from "http";
import { storage } from "./storage";
import { loginSchema, otpSchema, securityAnswerSchema } from "@shared/schema";
import { randomUUID } from "crypto";
import { AgentService } from "./services/agent.service";
import { twilioClient, WhatsappService } from "./services/whatsapp.service";

const agentService = new AgentService();
const whatsappService = new WhatsappService();

export async function registerRoutes(app:Express): Promise<Server> {
  // const app: Express = express();

  // Middleware to parse incoming JSON and URL-encoded data
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Session middleware
  app.use(
    session({
      secret: "super-secret-key", // change to env var in production
      resave: false,
      saveUninitialized: false,
      cookie: {
        httpOnly: true,
        secure: false, // set to true in production with HTTPS
        maxAge: 1000 * 60 * 30, // 30 min
      },
    }),
  );

  // Agent routes
  app.post("/api/agent/security", async (req, res) => {
    console.log("Incoming body for security:", req.body);
    const { message, employeeId } = req.body;
    const response = await agentService.processMessage({ message, action: "SECURITY", employeeId });
    res.json({ message: response });
  });

  app.post("/api/agent/chat", async (req, res) => {
    console.log("Incoming body for chat:", req.body);
    const { Body, From, To, ProfileName } = req.body;
    const response = await agentService.processMessage({ message: Body, action: "CHAT", name: ProfileName });
    console.log(`Sending message to: ${To} from: ${From} with response: ${response}`);
    await twilioClient.messages.create({
      from: To,
      to: From,
      body: response,
    });
    console.log("message sent")
  });

  // Authentication routes
  app.post("/api/auth/login", async (req, res) => {
    try {
      console.log("Incoming body for login:", req.body); // Debug

      const { employeeId, password } = loginSchema.parse(req.body);

      const employee = await storage.getEmployeeByEmployeeId(employeeId);
      if (!employee || !employee.password) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      if (!employee.isActive) {
        return res.status(401).json({ message: "Account is inactive" });
      }

      req.session.pendingAuth = {
        employeeId: employee.id,
        step: 1,
      };

      res.json({
        message: "Credentials validated",
        nextStep: "otp",
      });
    } catch (error) {
      console.error("Login error:", error);
      res.status(400).json({ message: "Invalid request data" });
    }
  });

  app.post("/api/auth/verify-otp", async (req, res) => {
    try {
      console.log("Incoming body for OTP:", req.body); // Debug

      const { otp } = otpSchema.parse(req.body);

      if (!req.session.pendingAuth || req.session.pendingAuth.step !== 1) {
        return res
          .status(400)
          .json({ message: "Invalid authentication state" });
      }

      if (otp !== "832194") {
        return res.status(401).json({ message: "Invalid OTP" });
      }

      req.session.pendingAuth.step = 2;
      res.json({
        message: "OTP verified",
        nextStep: "security",
      });
    } catch (error) {
      console.error("OTP error:", error);
      res.status(400).json({ message: "Invalid OTP format" });
    }
  });

  app.post("/api/auth/verify-security", async (req, res) => {
    try {
      console.log("Incoming body for security answer:", req.body); // Debug

      const { answer } = securityAnswerSchema.parse(req.body);

      if (!req.session.pendingAuth || req.session.pendingAuth.step !== 2) {
        return res
          .status(400)
          .json({ message: "Invalid authentication state" });
      }

      if (answer.toLowerCase().trim() !== "sarah johnson") {
        return res.status(401).json({ message: "Incorrect security answer" });
      }

      const employee = await storage.getEmployee(
        req.session.pendingAuth.employeeId,
      );
      if (!employee) {
        return res.status(401).json({ message: "Employee not found" });
      }

      const token = randomUUID();
      await storage.createSession(employee.id, token);

      await storage.createActivity(
        employee.id,
        "login",
        "Employee logged in successfully",
      );

      delete req.session.pendingAuth;
      req.session.authToken = token;

      res.json({
        message: "Authentication complete",
        employee: {
          id: employee.id,
          name: employee.name,
          role: employee.role,
        },
        token,
      });
    } catch (error) {
      console.error("Security answer error:", error);
      res.status(400).json({ message: "Invalid security answer format" });
    }
  });

  app.post("/api/auth/logout", async (req, res) => {
    if (req.session.authToken) {
      await storage.deleteSession(req.session.authToken);
    }
    req.session.destroy(() => {
      res.json({ message: "Logged out successfully" });
    });
  });

  // Dashboard routes
  app.get("/api/dashboard/stats", async (req, res) => {
    const stats = await storage.getDashboardStats();
    res.json(stats);
  });

  app.get("/api/loans", async (req, res) => {
    const loans = await storage.getLoanApplications();
    res.json(loans.filter((loan) => loan.status === "pending"));
  });

  app.get("/api/transfers", async (req, res) => {
    const transfers = await storage.getTransferRequests();
    res.json(transfers.filter((transfer) => transfer.status === "pending"));
  });

  app.post("/api/loans/:id/approve", async (req, res) => {
    try {
      await storage.updateLoanStatus(req.params.id, "approved");

      if (req.session.authToken) {
        const sessionData = await storage.getSessionByToken(
          req.session.authToken,
        );
        if (sessionData) {
          await storage.createActivity(
            sessionData.employeeId,
            "loan_approved",
            `Loan application ${req.params.id} approved`,
          );
        }
      }

      res.json({ message: "Loan approved successfully" });
    } catch (error) {
      res.status(500).json({ message: "Failed to approve loan" });
    }
  });

  app.post("/api/loans/:id/reject", async (req, res) => {
    try {
      await storage.updateLoanStatus(req.params.id, "rejected");

      if (req.session.authToken) {
        const sessionData = await storage.getSessionByToken(
          req.session.authToken,
        );
        if (sessionData) {
          await storage.createActivity(
            sessionData.employeeId,
            "loan_rejected",
            `Loan application ${req.params.id} rejected`,
          );
        }
      }

      res.json({ message: "Loan rejected successfully" });
    } catch (error) {
      res.status(500).json({ message: "Failed to reject loan" });
    }
  });

  app.post("/api/transfers/:id/approve", async (req, res) => {
    try {
      await storage.updateTransferStatus(req.params.id, "approved");

      if (req.session.authToken) {
        const sessionData = await storage.getSessionByToken(
          req.session.authToken,
        );
        if (sessionData) {
          await storage.createActivity(
            sessionData.employeeId,
            "transfer_approved",
            `Transfer request ${req.params.id} approved`,
          );
        }
      }

      res.json({ message: "Transfer approved successfully" });
    } catch (error) {
      res.status(500).json({ message: "Failed to approve transfer" });
    }
  });

  app.post("/api/transfers/:id/reject", async (req, res) => {
    try {
      await storage.updateTransferStatus(req.params.id, "rejected");

      if (req.session.authToken) {
        const sessionData = await storage.getSessionByToken(
          req.session.authToken,
        );
        if (sessionData) {
          await storage.createActivity(
            sessionData.employeeId,
            "transfer_rejected",
            `Transfer request ${req.params.id} rejected`,
          );
        }
      }

      res.json({ message: "Transfer rejected successfully" });
    } catch (error) {
      res.status(500).json({ message: "Failed to reject transfer" });
    }
  });

  app.get("/api/activities", async (req, res) => {
    if (!req.session.authToken) {
      return res.status(401).json({ message: "Not authenticated" });
    }

    const sessionData = await storage.getSessionByToken(req.session.authToken);
    if (!sessionData) {
      return res.status(401).json({ message: "Invalid session" });
    }

    const activities = await storage.getActivitiesByEmployee(
      sessionData.employeeId,
    );
    res.json(activities.slice(0, 10));
  });

  const httpServer = createServer(app);
  return httpServer;
}
