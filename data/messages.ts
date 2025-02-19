export const messages = [
  {
    from: "William Smith",
    email: "williamsmith@example.com",
    userId: "user-1",
    messages: [
      {
        id: "email-1-6c84fb90-12c4-11e1-840d-7b25c5ee775a",
        messageType: "email",
        name: "William Smith",
        subject: "Meeting Tomorrow",
        text: "Hi, let's have a meeting tomorrow to discuss the project. I've been reviewing the project details and have some ideas I'd like to share. It's crucial that we align on our next steps to ensure the project's success.\n\nPlease come prepared with any questions or insights you may have. Looking forward to our meeting!\n\nBest regards, William",
        date: "2023-10-22T09:00:00",
      },
      {
        id: "chat-1-6c84fb90-12c4-11e1-840d-7b25c5ee775a",
        messageType: "chat",
        name: "William Smith",
        subject: null,
        text: "Hey William, just confirming our meeting for tomorrow. See you then!",
        date: "2023-10-22T14:00:00",
      },
      {
        id: "email-2-6c84fb90-12c4-11e1-840d-7b25c5ee775a",
        messageType: "email",
        name: "William Smith",
        subject: "Meeting Tomorrow",
        text: "Hi, let's have a meeting tomorrow to discuss the project. I've been reviewing the project details and have some ideas I'd like to share. It's crucial that we align on our next steps to ensure the project's success.\n\nPlease come prepared with any questions or insights you may have. Looking forward to our meeting!\n\nBest regards, William",
        date: "2023-10-22T09:00:00",
      },
    ],
  },
  {
    from: "Alice Smith",
    email: "alicesmith@example.com",
    userId: "user-2",
    messages: [
      {
        id: "email-2-110e8400-e29b-11d4-a716-446655440000",
        messageType: "email",
        name: "Alice Smith",
        subject: "Re: Project Update",
        text: "Thank you for the project update. It looks great! I've gone through the report, and the progress is impressive. The team has done a fantastic job, and I appreciate the hard work everyone has put in.\n\nI have a few minor suggestions that I'll include in the attached document.\n\nLet's discuss these during our next meeting. Keep up the excellent work!\n\nBest regards, Alice",
        date: "2023-10-22T10:30:00",
      },
      {
        id: "chat-2-110e8400-e29b-11d4-a716-446655440000",
        messageType: "chat",
        name: "Alice Smith",
        subject: null,
        text: "Sounds good, Alice! Looking forward to the discussion.",
        date: "2023-10-22T15:15:00",
      },
    ],
  },
]

export type MessageType = (typeof messages)[number]
