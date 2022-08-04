import { CreateStatementUseCase } from "./CreateStatementUseCase";
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository";
import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { OperationType } from "../../entities/Statement";
import { CreateStatementError } from "./CreateStatementError";

let createStatementUseCase: CreateStatementUseCase;
let inMemoryStatementsRepository: InMemoryStatementsRepository;
let inMemoryUsersRepository: InMemoryUsersRepository;

describe("Create Statement", () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    inMemoryStatementsRepository = new InMemoryStatementsRepository();
    createStatementUseCase = new CreateStatementUseCase(
      inMemoryUsersRepository,
      inMemoryStatementsRepository
    );
  });

  it("should be able to create a new statement", async () => {
    const { id } = await inMemoryUsersRepository.create({
      name: "batatinha",
      email: "quando@nasce.com",
      password: "12345",
    });

    const user_id = id!;

    const statement = await createStatementUseCase.execute({
      user_id,
      amount: 5,
      description: "desc",
      type: OperationType.DEPOSIT,
    });
    expect(statement).toHaveProperty("id");
  });

  it("should not be able to create a new statement with non existent user", async () => {
    expect(async () => {
      const user_id = "batatinaasaha";

      await createStatementUseCase.execute({
        user_id,
        amount: 5,
        description: "desc",
        type: OperationType.DEPOSIT,
      });
    }).rejects.toBeInstanceOf(CreateStatementError.UserNotFound);
  });

  it("should not be able to create a new statement with insuficient funds", async () => {
    expect(async () => {
      const { id } = await inMemoryUsersRepository.create({
        name: "batatinha",
        email: "quando@nasce.com",
        password: "12345",
      });

      const user_id = id!;

      await createStatementUseCase.execute({
        user_id,
        amount: 5,
        description: "deposit 5 money",
        type: OperationType.DEPOSIT,
      });

      await createStatementUseCase.execute({
        user_id,
        amount: 10,
        description: "withdraw 10 money",
        type: OperationType.WITHDRAW,
      });
    }).rejects.toBeInstanceOf(CreateStatementError.InsufficientFunds);
  });
});
