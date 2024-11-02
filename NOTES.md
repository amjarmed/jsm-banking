# Project notes

---

## tools

- nextjs
- Plaid (sandbox) : bank functionality api
  -appwrite : back end devs
- Chart.js : chart
- tailwindcss :style
- shadcn/ui
- Sentry : monitor

## duration time

day-1 :00:21:00 minutes
day-2 :01:03:00 minutes
day-3 :02:34:14 minutes
day-4 : 03:05:55 minutes
day-5 : 03:16:30 minutes
day-6 : 3:37:01 minutes

---

## what i learned from this project

- how to get colors and font from figma to tailwind config
- route group in nextjs
- using task.json for automation
- declare interface: Used for globally available interfaces, typically in ambient declaration files (.d.ts).
- export interface: Used for modular interfaces that need to be imported where they’re used.

- using _query-string_ for formatting balance in account
- using _react-countup_ for count up animation

- every components in nextjs is a server component unnless you say otherwise "use client"/use external component.

- using chart.js for
- react-hook-form & zod for form validation

- the solution should be alway be a one way source of truth.
- get data from form using react-hook-form and zod
- working with **Server actions and mutations** and queries (api calls modification to db)
- using appwriter as backend solution
- working with .nev & .env.example files
- using PLAID + DWOLLA : add bank account and transactions

- It will run on the server by default since it's not considered a component. It does not require "use server" or "use client" directives, as these are only necessary for files that export React components (or contain JSX) to distinguish server and client components, it will be treated as a regular module and not as a component.
- `!` is a non-null assertion operator in TypeScript, It tells TypeScript that you are confident this value is not null or undefined, and it can treat it as defined.
- getter object pattern: allows for lazy loading—each property, optimizing memory and performance.

- 5 hour to figure that i need to use "use server " and session not created because of 2 chars made differences :)
- follow debug steps (variables...etc)
- `sentry` for error reporting, Code breaks, fix it faster

## notes from outside the tutorial

### CRUD

- import appwriter
- Initialize database [ databases.create | databases.createCollection | createStringAttribute | ]
- Add documents [databases.createDocument:add data into your collection]
- Retrieve documents [ databases.listDocuments()]
- Delete documents [databases.deleteDocument()]
- Update documents [databases.updateDocument()]

- Run all tasks [runAllTasks()]

## How BaaS works

In traditional app development, you'd need to set up and manage databases, write APIs, and handle other backend tasks yourself. But with BaaS, all these services are ready-made for you. You interact with them through APIs, without having to worry about scaling.

- BaaS handles things like:
- User authentication
- File storage
- Database management
- Serverless functions
- Real-time synchronization
- Push notifications

This way, you don’t have to reinvent the wheel. You can simply plug in these reliable, pre-built solutions and focus on building your app, making it easier to scale and grow without the hassle.
RED MORE <https://appwrite.io/blog/post/backend-as-a-service-baas?ref=dailydev>
