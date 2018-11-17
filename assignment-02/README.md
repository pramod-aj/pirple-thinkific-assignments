## Homework Assignment #2

> _You are building the API for a pizza-delivery company. Don't _worry_ about a frontend, just build the API. Here's the spec from your project manager:_

- The project contains only server side, REST API code for the pizza-delivery application. 
- The assignment can be found under `assignment-02` folder. OR please refer to the `assignment-02` branch
- In order to start the server, please navigate to `assignment-02` and type `node index.js` OR
- From the main project, type `npm start`

```bash
# triggers assignment-02 server
npm start 
# also triggers assignment-02 server
npm run hw02
```

---

> 1. _New users can be created, their information can be edited, and they can be deleted. We should store their name, email address, and street address._

- Code to handle users (CRUD) is available under `lib/handlers/users.js`

---

> 2. _Users can log in and log out by creating or destroying a token._

- Code to handle tokens (CRUD) is available under `lib/handlers/tokens.js`

---

> 3. _When a user is logged in, they should be able to GET all the possible menu items (these items can be hardcoded into the system)._

- In order to login, The application layer / UI sends a **POST** request containing  details (see `lib/handlers/tokens.js`) to the tokens router

---

> 4. _A logged-in user should be able to fill a shopping cart with menu items_

---

> 5. _A logged-in user should be able to create an order. You should integrate with the Sandbox of Stripe.com to accept their payment. Note: Use the stripe sandbox for your testing._ _Follow this link and click on the "tokens" tab to see the fake tokens you can use server-side to confirm the integration is working: https://stripe.com/docs/testing#cards_

---

> 6. _When an order is placed, you should email the user a receipt. You should integrate with the sandbox of Mailgun.com for this._ _Note: Every Mailgun account comes with a sandbox email account domain (whatever@sandbox123.mailgun.org) that you can send from by default. So, there's no need to setup any DNS for your domain for this task_ _https://documentation.mailgun.com/en/latest/faqs.html#how-do-i-pick-a-domain-name-for-my-mailgun-account_

---