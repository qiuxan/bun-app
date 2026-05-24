const conversations = new Map<string, string>();

export const conversationRepository = {
   getPreviousResponseId(conversationID: string) {
      return conversations.get(conversationID);
   },

   setPreviousResponseId(conversationID: string, responseID: string) {
      conversations.set(conversationID, responseID);
   },
};
