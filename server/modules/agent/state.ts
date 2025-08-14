import { Annotation, MessagesAnnotation, addMessages } from "@langchain/langgraph";
import { BaseMessage } from "@langchain/core/messages";

type UserDetails = {
    employeeId: string;
    ip: string;
    location: string;
    device: string;
    browser: string;
    os: string;
    network_health: string;
}

type requestDetails = {
    action: "SECURITY" | "CHAT";
    ip: string;
    location: string;
    device: string;
    browser: string;
    os: string;
    network_health: string;
}

const messages_state = Annotation<BaseMessage[]>({
    reducer: (left: BaseMessage[], right: BaseMessage | BaseMessage[]) => {
        if (Array.isArray(right)) {
          return left.concat(right);
        }
        return left.concat([right]);
    },
    default: () => []
});

export const GraphState = Annotation.Root({
    ...MessagesAnnotation.spec,
    userDetails: Annotation<UserDetails>(),
    requestDetails: Annotation<requestDetails>(),
    securityAgentMessages: messages_state,
})