import * as fs from 'fs';
import type { ContractInfo, EventInfo } from './parseFiles';

/**
 * Map Solidity types to GraphQL types
 */
function mapSolidityToGraphQLType(solidityType: string): string {
  const typeMap: Record<string, string> = {
    'address': 'String!',
    'string': 'String!',
    'bool': 'Boolean!',
    'uint8': 'BigInt!',
    'uint16': 'BigInt!',
    'uint32': 'BigInt!',
    'uint64': 'BigInt!',
    'uint128': 'BigInt!',
    'uint256': 'BigInt!',
    'int8': 'BigInt!',
    'int16': 'BigInt!',
    'int32': 'BigInt!',
    'int64': 'BigInt!',
    'int128': 'BigInt!',
    'int256': 'BigInt!',
    'bytes': 'String!',
    'bytes1': 'String!',
    'bytes2': 'String!',
    'bytes4': 'String!',
    'bytes8': 'String!',
    'bytes16': 'String!',
    'bytes32': 'String!',
  };

  // Handle arrays
  if (solidityType.endsWith('[]')) {
    const baseType = solidityType.slice(0, -2);
    const graphqlType = mapSolidityToGraphQLType(baseType);
    return `[${graphqlType}]!`;
  }

  // Handle fixed-size arrays
  const fixedArrayMatch = solidityType.match(/^(.+)\[(\d+)\]$/);
  if (fixedArrayMatch?.[1]) {
    const baseType = fixedArrayMatch[1];
    const graphqlType = mapSolidityToGraphQLType(baseType);
    return `[${graphqlType}]!`;
  }

  return typeMap[solidityType] || 'String!';
}

/**
 * Generate GraphQL entity name from contract and event names
 */
function generateEntityName(contractName: string, eventName: string): string {
  return `${contractName}_${eventName}`;
}

/**
 * Generate GraphQL schema for a single event
 */
function generateEventSchema(contractName: string, event: EventInfo): string {
  const entityName = generateEntityName(contractName, event.name);
  
  let schema = `type ${entityName} {\n`;
  schema += `  id: ID!\n`;
  
  // Add event input parameters as entity fields
  event.inputs.forEach(input => {
    const fieldName = input.name || 'param';
    const graphqlType = mapSolidityToGraphQLType(input.type);
    schema += `  ${fieldName}: ${graphqlType}\n`;
  });
  
  schema += `}\n\n`;
  
  return schema;
}

/**
 * Generate complete GraphQL schema for all contracts
 */
export function generateGraphQLSchema(contracts: ContractInfo[]): string {
  let schema = '';
  
  // Create a map to track unique contract types (by name)
  const uniqueContracts = new Map<string, ContractInfo>();
  
  contracts.forEach(contract => {
    if (!uniqueContracts.has(contract.name)) {
      uniqueContracts.set(contract.name, contract);
    }
  });
  
  // Generate schema only for unique contract types
  uniqueContracts.forEach(contract => {
    contract.events.forEach(event => {
      schema += generateEventSchema(contract.name, event);
    });
  });
  
  return schema;
}

/**
 * Generate event handler for a single event
 */
function generateEventHandler(contractName: string, event: EventInfo): string {
  const entityName = generateEntityName(contractName, event.name);
  
  let handler = `indexer.onEvent(\n`;
  handler += `  { contract: "${contractName}", event: "${event.name}" },\n`;
  handler += `  async ({ event, context }) => {\n`;
  handler += `    const entity: ${entityName} = {\n`;
  handler += `      id: \`\${event.chainId}_\${event.block.number}_\${event.logIndex}\`,\n`;
  
  // Add event parameters
  event.inputs.forEach(input => {
    const fieldName = input.name || 'param';
    handler += `      ${fieldName}: event.params.${fieldName},\n`;
  });
  
  handler += `    };\n\n`;
  handler += `    context.${entityName}.set(entity);\n`;
  handler += `  },\n`;
  handler += `);\n\n`;
  
  return handler;
}

/**
 * Generate complete event handlers file
 */
export function generateEventHandlers(contracts: ContractInfo[]): string {
  let handlers = `/*\n`;
  handlers += ` * Please refer to https://docs.envio.dev for a thorough guide on all Envio indexer features\n`;
  handlers += ` * This file is auto-generated from scaffold-eth contracts\n`;
  handlers += ` */\n`;
  handlers += `import {\n`;
  handlers += `  indexer,\n`;
  
  // Create a map to track unique contract types (by name)
  const uniqueContracts = new Map<string, ContractInfo>();
  
  contracts.forEach(contract => {
    if (!uniqueContracts.has(contract.name)) {
      uniqueContracts.set(contract.name, contract);
    }
  });
  
  // Generate entity type imports
  const imports = new Set<string>();
  uniqueContracts.forEach(contract => {
    contract.events.forEach(event => {
      const entityName = generateEntityName(contract.name, event.name);
      imports.add(entityName);
    });
  });
  
  handlers += Array.from(imports).map(imp => `  type ${imp},\n`).join('');
  handlers += `} from "envio";\n\n`;
  
  // Generate handlers for unique contract types only
  uniqueContracts.forEach(contract => {
    contract.events.forEach(event => {
      handlers += generateEventHandler(contract.name, event);
    });
  });
  
  return handlers;
}

/**
 * Update schema.graphql file
 */
export function updateSchemaFile(schemaPath: string, contracts: ContractInfo[]): void {
  const schema = generateGraphQLSchema(contracts);
  
  console.log('Generated GraphQL schema:');
  console.log(schema);
  
  // Write to file
  fs.writeFileSync(schemaPath, schema, 'utf-8');
  console.log(`Updated schema file: ${schemaPath}`);
}

/**
 * Update EventHandlers.ts file
 */
export function updateEventHandlersFile(handlersPath: string, contracts: ContractInfo[]): void {
  const handlers = generateEventHandlers(contracts);
  
  console.log('Generated event handlers:');
  console.log(handlers);
  
  // Write to file
  fs.writeFileSync(handlersPath, handlers, 'utf-8');
  console.log(`Updated event handlers file: ${handlersPath}`);
}

/**
 * Build a sample value for an event parameter in the generated test.
 * Returns undefined for types the generated test does not cover (tuples, fixed-size arrays).
 */
function sampleValueForType(solidityType: string): string | undefined {
  if (solidityType.endsWith('[]')) {
    return sampleValueForType(solidityType.slice(0, -2)) === undefined ? undefined : '[]';
  }
  if (solidityType === 'address') return 'Addresses.defaultAddress';
  if (solidityType === 'string') return '"test"';
  if (solidityType === 'bool') return 'true';
  if (/^u?int\d*$/.test(solidityType)) return '1n';
  if (solidityType === 'bytes') return '"0x"';
  const fixedBytes = solidityType.match(/^bytes(\d+)$/);
  if (fixedBytes?.[1]) return `"0x${'00'.repeat(Number(fixedBytes[1]))}"`;
  return undefined;
}

/**
 * Generate src/indexer.test.ts for the first contract event whose parameters the test can simulate.
 * Returns undefined when no such event exists.
 */
export function generateIndexerTest(contracts: ContractInfo[]): string | undefined {
  for (const contract of contracts) {
    for (const event of contract.events) {
      const params = event.inputs.map(input => ({
        name: input.name || 'param',
        value: sampleValueForType(input.type),
      }));
      if (params.some(p => p.value === undefined)) continue;

      const entityName = generateEntityName(contract.name, event.name);
      const paramLines = params.map(p => `                ${p.name}: ${p.value},\n`).join('');
      const expectLines = params.map(p => `      ${p.name}: ${p.value},\n`).join('');

      let test = `/*\n`;
      test += ` * This file is auto-generated from scaffold-eth contracts\n`;
      test += ` */\n`;
      test += `import { describe, it } from "vitest";\n`;
      test += `import { createTestIndexer, TestHelpers } from "envio";\n`;
      test += `const { Addresses } = TestHelpers;\n\n`;
      test += `describe("${contract.name} ${event.name} event tests", () => {\n`;
      test += `  it("${entityName} is created correctly", async (t) => {\n`;
      test += `    const indexer = createTestIndexer();\n\n`;
      test += `    // Processing a simulated ${event.name} event on chain ${contract.chainId}\n`;
      test += `    await indexer.process({\n`;
      test += `      chains: {\n`;
      test += `        ${contract.chainId}: {\n`;
      test += `          simulate: [\n`;
      test += `            {\n`;
      test += `              contract: "${contract.name}",\n`;
      test += `              event: "${event.name}",\n`;
      test += `              params: {\n`;
      test += paramLines;
      test += `              },\n`;
      test += `            },\n`;
      test += `          ],\n`;
      test += `        },\n`;
      test += `      },\n`;
      test += `    });\n\n`;
      test += `    // Getting the entity written by the handler\n`;
      test += `    const entities = await indexer.${entityName}.getAll();\n`;
      test += `    t.expect(entities).toHaveLength(1);\n`;
      test += `    t.expect(entities[0]).toMatchObject({\n`;
      test += expectLines;
      test += `    });\n`;
      test += `  });\n`;
      test += `});\n`;
      return test;
    }
  }
  return undefined;
}

/**
 * Update src/indexer.test.ts so it matches the generated handlers, or remove it when no event can be simulated
 */
export function updateIndexerTestFile(testPath: string, contracts: ContractInfo[]): void {
  const test = generateIndexerTest(contracts);

  if (test === undefined) {
    if (fs.existsSync(testPath)) {
      fs.unlinkSync(testPath);
      console.log(`Removed test file (no event with supported parameter types): ${testPath}`);
    }
    return;
  }

  fs.writeFileSync(testPath, test, 'utf-8');
  console.log(`Updated test file: ${testPath}`);
}
