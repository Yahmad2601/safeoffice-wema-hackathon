import { Agent } from "server/modules/agent";
import { WhatsappService } from "./whatsapp.service";
import dotenv from "dotenv";

dotenv.config();

interface AgentRequest {
    message: string;
    from?: string;
    action: "SECURITY" | "CHAT";
    employeeId?: string;
    name?: string;
    ip?: string;
    location?: string;
    device?: string;
    browser?: string;
    os?: string;
    network_health?: string;
}

const mock_metadata = {
    ip: "10123456",
    location: "NIGERIA",
    device: "IPHONE",
    browser: "CHROME",
    os: "IOS",
    network_health: "70%",
}

export class AgentService {
    private agent: any;
    private whatsappService: WhatsappService;
    private readonly threadId: string;

    constructor() {
        this.agent = Agent;
        this.whatsappService = new WhatsappService();
        this.threadId = "ABCD1234";
    }

    async processMessage(data: AgentRequest) {
        console.log("Processing message:", data);
        if (!data.message) {
            throw new Error("Message is required");
        }

        if (!data.action) {
            throw new Error("Action is required");
        }

        const config = {
            configurable: {
                thread_id: this.threadId,
            }
        }

        if(data.action === "SECURITY"){
            const response = await this.agent.invoke({
                securityAgentMessages: [
                    {
                        role: "user",
                        content: data.message,
                    }
                ],
                requestDetails: {
                    action: data.action,
                    ip: data.ip,
                    location: data.location,
                    device: data.device,
                    browser: data.browser,
                    os: data.os,
                    network_health: data.network_health,
                }
            }, config)
    
            const responseMessage = response.securityAgentMessages[response.securityAgentMessages.length - 1].content;
    
            console.log("Response from security agent:", responseMessage);
    
            return responseMessage;
        }

        const response = await this.agent.invoke({
            messages: [
                {
                    role: "user",
                    content: data.message,
                }
            ],
            userDetails: {
                employeeId: data.employeeId,
                ...mock_metadata
            },
            requestDetails: {
                action: data.action
            }
        }, config)

        const responseMessage = response.messages[response.messages.length - 1].content;

        console.log("Response from Work Padi:", responseMessage);

        return responseMessage;
    }
}