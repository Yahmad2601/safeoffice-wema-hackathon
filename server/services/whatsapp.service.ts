import twilio from "twilio";
import dotenv from "dotenv";

dotenv.config();

type data = {
    from: string;
    to: string;
    message: string;
}

export const twilioClient = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

export class WhatsappService {
    private twilioClient: twilio.Twilio;

    constructor() {
        this.twilioClient = twilioClient;
    }
    
    async sendMessage(data: data) {
        console.log(`Sending whatsapp message with ${data}`);
        try {
            await this.twilioClient.messages.create({
                from: data.from,
                to: data.to,
                body: data.message
            })
            console.log(`Whatsapp message sent to ${data.to}`);
        } catch (error) {
            console.error(`Error sending whatsapp message to ${data.to}:`, error);
            throw error;
        }
    }
}