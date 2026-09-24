import { describe, it } from "vitest";
import { createTestIndexer, TestHelpers } from "envio";
const { Addresses } = TestHelpers;

describe("YourContract GreetingChange event tests", () => {
  it("YourContract_GreetingChange is created correctly", async (t) => {
    const indexer = createTestIndexer();
    const greetingSetter = Addresses.defaultAddress;

    // Processing a simulated GreetingChange event on the local chain
    await indexer.process({
      chains: {
        31337: {
          simulate: [
            {
              contract: "YourContract",
              event: "GreetingChange",
              params: {
                greetingSetter,
                newGreeting: "Hello World!",
                premium: true,
                value: 1000n,
              },
            },
          ],
        },
      },
    });

    // Getting the entity written by the handler
    const entities = await indexer.YourContract_GreetingChange.getAll();
    t.expect(entities).toHaveLength(1);
    t.expect(entities[0]).toMatchObject({
      greetingSetter,
      newGreeting: "Hello World!",
      premium: true,
      value: 1000n,
    });
  });
});
