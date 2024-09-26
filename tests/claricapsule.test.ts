import {
  Clarinet,
  Tx,
  Chain,
  Account,
  types,
} from 'https://deno.land/x/clarinet@v1.0.0/index.ts';
import { assertEquals } from 'https://deno.land/std@0.90.0/testing/asserts.ts';

const CONTRACT_NAME = 'nft-subscription-service';

Clarinet.test({
  name: "Ensure that contract owner can create a service",
  async fn(chain: Chain, accounts: Map<string, Account>) {
    const deployer = accounts.get('deployer')!;
    const wallet1 = accounts.get('wallet_1')!;

    let block = chain.mineBlock([
      Tx.contractCall(CONTRACT_NAME, 'create-service', [
        types.ascii("Premium Service"),
        types.uint(100000000), // 100 STX
        types.uint(144 * 30) // 30 days (assuming 144 blocks per day)
      ], deployer.address)
    ]);

    assertEquals(block.receipts.length, 1);
    assertEquals(block.height, 2);
    block.receipts[0].result.expectOk().expectUint(1);

    // Try creating a service with a non-owner account (should fail)
    block = chain.mineBlock([
      Tx.contractCall(CONTRACT_NAME, 'create-service', [
        types.ascii("Basic Service"),
        types.uint(50000000), // 50 STX
        types.uint(144 * 15) // 15 days
      ], wallet1.address)
    ]);

    assertEquals(block.receipts.length, 1);
    assertEquals(block.height, 3);
    block.receipts[0].result.expectErr().expectUint(100); // ERR_NOT_AUTHORIZED
  },
});

Clarinet.test({
  name: "Ensure that users can purchase a subscription",
  async fn(chain: Chain, accounts: Map<string, Account>) {
    const deployer = accounts.get('deployer')!;
    const wallet1 = accounts.get('wallet_1')!;

    // Create a service first
    let block = chain.mineBlock([
      Tx.contractCall(CONTRACT_NAME, 'create-service', [
        types.ascii("Premium Service"),
        types.uint(100000000), // 100 STX
        types.uint(144 * 30) // 30 days
      ], deployer.address)
    ]);

    // Purchase a subscription
    block = chain.mineBlock([
      Tx.contractCall(CONTRACT_NAME, 'purchase-subscription', [
        types.uint(1) // service-id
      ], wallet1.address)
    ]);

    assertEquals(block.receipts.length, 1);
    assertEquals(block.height, 3);
    block.receipts[0].result.expectOk().expectUint(2); // subscription-id

    // Check subscription details
    const subscriptionDetails = chain.callReadOnlyFn(
      CONTRACT_NAME,
      'get-subscription-details',
      [types.uint(2)],
      deployer.address
    );

    const expectedDetails = {
      owner: wallet1.address,
      'service-id': types.uint(1),
      'end-block': types.uint(block.height + 144 * 30),
    };

    subscriptionDetails.result.expectSome().expectTuple(expectedDetails);
  },
});

Clarinet.test({
  name: "Ensure that NFT can be transferred",
  async fn(chain: Chain, accounts: Map<string, Account>) {
    const deployer = accounts.get('deployer')!;
    const wallet1 = accounts.get('wallet_1')!;
    const wallet2 = accounts.get('wallet_2')!;

    // Create a service
    let block = chain.mineBlock([
      Tx.contractCall(CONTRACT_NAME, 'create-service', [
        types.ascii("Premium Service"),
        types.uint(100000000), // 100 STX
        types.uint(144 * 30) // 30 days
      ], deployer.address)
    ]);

    // Purchase a subscription
    block = chain.mineBlock([
      Tx.contractCall(CONTRACT_NAME, 'purchase-subscription', [
        types.uint(1) // service-id
      ], wallet1.address)
    ]);

    // Transfer NFT
    block = chain.mineBlock([
      Tx.contractCall(CONTRACT_NAME, 'transfer', [
        types.uint(2), // token-id
        types.principal(wallet1.address),
        types.principal(wallet2.address)
      ], wallet1.address)
    ]);

    assertEquals(block.receipts.length, 1);
    assertEquals(block.height, 4);
    block.receipts[0].result.expectOk().expectBool(true);

    // Check new owner
    const newOwner = chain.callReadOnlyFn(
      CONTRACT_NAME,
      'get-owner',
      [types.uint(2)],
      deployer.address
    );

    newOwner.result.expectOk().expectSome().expectPrincipal(wallet2.address);
  },
});

Clarinet.test({
  name: "Ensure that service and subscription details can be retrieved",
  async fn(chain: Chain, accounts: Map<string, Account>) {
    const deployer = accounts.get('deployer')!;
    const wallet1 = accounts.get('wallet_1')!;

    // Create a service
    let block = chain.mineBlock([
      Tx.contractCall(CONTRACT_NAME, 'create-service', [
        types.ascii("Premium Service"),
        types.uint(100000000), // 100 STX
        types.uint(144 * 30) // 30 days
      ], deployer.address)
    ]);

    // Get service details
    const serviceDetails = chain.callReadOnlyFn(
      CONTRACT_NAME,
      'get-service-details',
      [types.uint(1)],
      deployer.address
    );

    const expectedServiceDetails = {
      name: types.ascii("Premium Service"),
      price: types.uint(100000000),
      duration: types.uint(144 * 30),
    };

    serviceDetails.result.expectSome().expectTuple(expectedServiceDetails);

    // Purchase a subscription
    block = chain.mineBlock([
      Tx.contractCall(CONTRACT_NAME, 'purchase-subscription', [
        types.uint(1) // service-id
      ], wallet1.address)
    ]);

    // Get subscription details
    const subscriptionDetails = chain.callReadOnlyFn(
      CONTRACT_NAME,
      'get-subscription-details',
      [types.uint(2)],
      deployer.address
    );

    const expectedSubscriptionDetails = {
      owner: wallet1.address,
      'service-id': types.uint(1),
      'end-block': types.uint(block.height + 144 * 30),
    };

    subscriptionDetails.result.expectSome().expectTuple(expectedSubscriptionDetails);
  },
});