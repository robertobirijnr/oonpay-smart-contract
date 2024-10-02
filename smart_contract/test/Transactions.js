const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Transactions Contract", function () {
  let Transactions, transactionsContract, owner, addr1, addr2;

  beforeEach(async function () {
    // Get the ContractFactory and signers here
    Transactions = await ethers.getContractFactory("Transactions");
    [owner, addr1, addr2] = await ethers.getSigners();

    // Deploy the contract
    transactionsContract = await Transactions.deploy();
    // await transactionsContract.deployed();
  });

  it("Should initialize with a transaction count of 0", async function () {
    const transactionCount = await transactionsContract.getTransactionCount();
    expect(transactionCount).to.equal(0);
  });

  it("Should be able to add a transaction to the blockchain", async function () {
    const amount = ethers.utils.parseEther("1.0"); // Sending 1 ether
    const message = "Test transaction";
    const keyword = "TestKeyword";

    await transactionsContract
      .connect(addr1)
      .addToBlockchain(addr2.address, amount, message, keyword);

    const transactionCount = await transactionsContract.getTransactionCount();
    expect(transactionCount).to.equal(1);

    const transactions = await transactionsContract.getAllTransactions();
    expect(transactions.length).to.equal(1);

    const transaction = transactions[0];
    expect(transaction.sender).to.equal(addr1.address);
    expect(transaction.receiver).to.equal(addr2.address);
    expect(transaction.amount).to.equal(amount);
    expect(transaction.message).to.equal(message);
    expect(transaction.keyword).to.equal(keyword);
  });

  it("Should emit a Transfer event when a transaction is added", async function () {
    const amount = ethers.utils.parseEther("0.5"); // Sending 0.5 ether
    const message = "Another test";
    const keyword = "TestEvent";

    await expect(
      transactionsContract
        .connect(addr1)
        .addToBlockchain(addr2.address, amount, message, keyword)
    )
      .to.emit(transactionsContract, "Transfer")
      .withArgs(addr1.address, addr2.address, amount, message, anyValue, keyword);
  });
});
