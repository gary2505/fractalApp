export const aiAgentChatApp = {
  id: 'ai-agent-chat',
  version: '0.1.0',
  status: 'skeleton',
  blocks: [
    'ai-agent-chat.chat-popup',
    'ai-agent-chat.context-gate',
    'ai-agent-chat.token-budget',
    'ai-agent-chat.model-router',
    'ai-agent-chat.parallel-runner',
    'ai-agent-chat.patch-planner',
    'ai-agent-chat.patch-review',
    'ai-agent-chat.gate-runner',
    'ai-agent-chat.error-memory',
    'ai-agent-chat.rule-improvement-proposals'
  ] as const
};

export type AiAgentChatBlockId = typeof aiAgentChatApp.blocks[number];
