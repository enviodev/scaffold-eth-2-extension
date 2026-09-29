/*
 * This file is auto-generated from scaffold-eth contracts
 */
import { describe, it } from "vitest";
import { createTestIndexer, TestHelpers } from "envio";
const { Addresses } = TestHelpers;

describe("YourContract GreetingChange event tests", () => {
  it("YourContract_GreetingChange is created correctly", async (t) => {
    const indexer = createTestIndexer();

    // Processing a simulated GreetingChange event on chain 31337
    await indexer.process({
      chains: {
        31337: {
          simulate: [
            {
              contract: "YourContract",
              event: "GreetingChange",
              params: {
                greetingSetter: Addresses.defaultAddress,
                newGreeting: "test",
                premium: true,
                value: 1n,
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
      greetingSetter: Addresses.defaultAddress,
      newGreeting: "test",
      premium: true,
      value: 1n,
    });
  });
});
