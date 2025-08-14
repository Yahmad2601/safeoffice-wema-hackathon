import {ChatPromptTemplate, MessagesPlaceholder} from "@langchain/core/prompts";
import { MemorySaver, StateGraph, START, END } from "@langchain/langgraph";
import {LLM} from "./utils/models";
import {GraphState} from "./state";
import { SECURITY_AGENT_PROMPT, MY_PADI } from "./prompts";
import { EXAMPLE_SECURITY_RESPONSE } from "./prompts";

const CallModel = async(state: typeof GraphState.State) => {
    console.log("Calling model");
    
    const {messages, requestDetails, securityAgentMessages, userDetails} = state;
    const {action} = requestDetails;

    if(action==="SECURITY"){
        console.log("inside security block...")
        const prompt = ChatPromptTemplate.fromMessages([
            ["system", SECURITY_AGENT_PROMPT],
            new MessagesPlaceholder("messages"),
        ]);

        console.log("security prompt template done")
    
        const chain = prompt.pipe(LLM);

        console.log("chain invoked")
    
        const response = await chain.invoke({
            messages: securityAgentMessages, EXAMPLE_SECURITY_RESPONSE, HISTORY:messages,  DEFAULT:userDetails
        });
    
        console.log(`The action is ${action}: And response is ${response.content}`);
    
        return {
            securityAgentMessages: [response]
        };
    }

    const prompt = ChatPromptTemplate.fromMessages([
        ["system", MY_PADI],
        new MessagesPlaceholder("messages"),
    ]);

    const chain = prompt.pipe(LLM);

    const response = await chain.invoke({
        messages
    });

    console.log(`The action is ${action}: And response is ${response.content}`);

    return {
        messages: [response],
    };
}

const memory = new MemorySaver();
const graph = new StateGraph(GraphState)
.addNode("callModel", CallModel)
.addEdge(START, "callModel")
.addEdge("callModel", END);

export const Agent = graph.compile({
    checkpointer: memory,
});