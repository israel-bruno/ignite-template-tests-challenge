import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { OperationType } from "../../entities/Statement";
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository";
import { GetStatementOperationError } from "./GetStatementOperationError";
import { GetStatementOperationUseCase } from "./GetStatementOperationUseCase";
let getStatementOperationUseCase: GetStatementOperationUseCase;
let inMemoryUsersRepository: InMemoryUsersRepository;
let inMemoryStatementsRepository: InMemoryStatementsRepository;

describe("Get Balance", () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    inMemoryStatementsRepository = new InMemoryStatementsRepository();
    getStatementOperationUseCase = new GetStatementOperationUseCase(
      inMemoryUsersRepository,
      inMemoryStatementsRepository
    );
  });

  it("should be able get balance", async () => {
    const user = await inMemoryUsersRepository.create({
      name: "batatinha",
      email: "quando@nasce.com",
      password: "12345",
    });

    const user_id = user.id!;

    const statement = await inMemoryStatementsRepository.create({
      user_id,
      amount: 5,
      description: "asdas",
      type: OperationType.DEPOSIT,
    });

    const statement_id = statement.id!;

    const result = await getStatementOperationUseCase.execute({
      user_id,
      statement_id,
    });

    expect(result).toHaveProperty("description");
  });

  it("should not be able to get a balance from non existent user", async () => {
    expect(async () => {
      const user = await inMemoryUsersRepository.create({
        name: "batatinha",
        email: "quando@nasce.com",
        password: "12345",
      });

      const user_id = user.id!;

      const statement = await inMemoryStatementsRepository.create({
        user_id,
        amount: 5,
        description: "asdas",
        type: OperationType.DEPOSIT,
      });

      const statement_id = statement.id!;

      await getStatementOperationUseCase.execute({ user_id: "", statement_id });
    }).rejects.toBeInstanceOf(GetStatementOperationError.UserNotFound);
  });
  it("should not be able to get a balance from non existent statemet", async () => {
    expect(async () => {
      const user = await inMemoryUsersRepository.create({
        name: "batatinha",
        email: "quando@nasce.com",
        password: "12345",
      });

      const user_id = user.id!;

      const statement = await inMemoryStatementsRepository.create({
        user_id,
        amount: 5,
        description: "asdas",
        type: OperationType.DEPOSIT,
      });

      const statement_id = statement.id!;

      await getStatementOperationUseCase.execute({ user_id, statement_id: "" });
    }).rejects.toBeInstanceOf(GetStatementOperationError.StatementNotFound);
  });
});
