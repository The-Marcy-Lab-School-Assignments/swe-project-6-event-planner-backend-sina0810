**1. What did you ask the AI to help you with, and why did you choose to use AI for that specific task?**

I asked AI to explain what to use for UNIQUE values for handling RSVP, because my VS code was throwing an error due to not handling `createRsvp` function correctly. The code silently was throwing an error when the same user tried to RSVP to the same event. AI suggested to use `23505` code because this is PostgreSQL code.


I chose to use AI because I needed a clear explanation how the database errors connect to backend logic. AI helped me to understand how to handle this error in my specific case.

**2. How did you evaluate whether the AI's output was correct or useful before using it?**

In the beginning, I didn't fully trust and understand what the code did and I was confused about where the `23505` code has to do with my function. The AI said it was a UNIQUE constraint violation, and I knew I had a UNIQUE constraint but I wasn't 100% sure it was this violation because that was the first time experiencing such a thing like that, so I had to test it myself to be more clear.

I tried to invoke the same function for making a new RSVP and it worked at the first time. Then I tried to RSVP the same event again. I noticed the server is not crashing but I got the message saying I had already RSVPed. That helped me confirm that the AI was right about the code and what the error meant and when it happens.

So instead just trusting the AI's explanation, I verify it by:
- Testing duplicate RSVP requests
- Watching the server response in the VS code


**3. How did what the AI produced differ from what you ultimately used, and what does that tell you about your own understanding of the problem?**

At first, the AI explained `23505` in a very general way in the database to prevent duplicates. It also showed example SQL syntax, but it wasn't similar to the one I had in my RSVP controller in the project. I couldn't just copy and paste what it gave me, I had to adjust it to fit my actual controller and model structure.

I handled duplicate RSVP error in my backend using:
```js
if (err.code === '23505') {
 return res.status(409).send({ message: 'You have already RSVPed to this event.' });
}
```
Instead of preventing the error in SQL I was catching the error at the backend and sending the error message to the users if they try to RSVP to the same event.

This gave a better understanding of handling errors at the backend and throwing error messages at the end. The AI helped me understand the idea, but I had to adapt it to match my project structure.


**4. What did you learn from using AI in this way?**

This whole process really clarified the purpose of using `23505` code and the backend concepts and helping translate the code to human language so I could understand it before I just copy and paste the code. I also learned I need to test the code and confirm it works for my case. I ended up using better approaches to handle duplicates in my RSVP file. This process also helped me to think of more ways of solving problems for upcoming projects, by understanding the issue and breaking it down, and testing it to verify everything works for my case.