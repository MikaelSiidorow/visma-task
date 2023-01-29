# Visma - Request identifier

Visma solutions - programming task, Summer Trainee 2023

View my [solution](./lib/oop.ts) and [unit tests](./lib/oop.test.ts)!

## Description

I understood the problem as primarily a string parsing problem, that should be as secure as possible and not allow invalid inputs. I used test-driven development in my solution, first writing unit tests based on the requirements in the specification. My solution satisfies these requirements clearly, only allowing valid URIs.

I wanted to use TypeScript, since that's the language I'm most familiar with. I'm very familiar with OOP and classes from Scala and Python, but I hadn't used classes in TypeScript before, thus I first wrote an initial solution using functional programming, and then converted that into a class with OOP paradigms, using access modifiers and making my methods private, and values readonly.

I also tried to make my solution as flexible as possible. Now, it is easy to edit valid schemes, paths and params in just one place [types.ts](./lib/types.ts) and extend the switch case for validating params in `validateParams`.

I would've liked to also generate the `validateParams` function from the type definitions, but this quickly became too complicated for this simple assignment, that I cut some corners here.

I also compromised in what feedback I give in the error message, when parsing parameters fails. Now I only return back the parameters, but do not specify the exact reason (e.g. invalid type).

I didn't implement a client for the class, since I found it makes more sense in this case to just write a couple of unit tests for the class business logic. This better showcases what the class is supposed to do, along with the doc-comments.

_Regex?_

I debated using Regex for the solutions, but decided against it, since readability and cleanliness were main evaluation criteria. And since Regex is [bad practice](https://softwareengineering.stackexchange.com/questions/113237/when-you-should-not-use-regular-expressions), when there are clearer built-in solutions, like `str.split()`.

## Testing my solution

```bash
  # install pnpm
  npm install -g pnpm@7

  # install dependencies
  pnpm install

  # run tests
  pnpm test

  # build library
  pnpm build
```
