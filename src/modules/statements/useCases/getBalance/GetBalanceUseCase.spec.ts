import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository";
import { GetBalanceError } from "./GetBalanceError";
import { GetBalanceUseCase } from "./GetBalanceUseCase";

let getBalanceUseCase: GetBalanceUseCase;
let inMemoryUsersRepository: InMemoryUsersRepository;
let inMemoryStatementsRepository: InMemoryStatementsRepository;

describe("Get Balance", () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    inMemoryStatementsRepository = new InMemoryStatementsRepository();
    getBalanceUseCase = new GetBalanceUseCase(
      inMemoryStatementsRepository,
      inMemoryUsersRepository
    );
  });

  it("should be able get balance", async () => {
    const { id } = await inMemoryUsersRepository.create({
      name: "batatinha",
      email: "quando@nasce.com",
      password: "12345",
    });

    const user_id = id!;

    const result = await getBalanceUseCase.execute({ user_id });

    expect(result).toHaveProperty("balance");
  });

  it("should be able to get a balance from non existent user", async () => {
    expect(async () => {
      const user_id = "";

      await getBalanceUseCase.execute({ user_id });
    }).rejects.toBeInstanceOf(GetBalanceError);
  });
});
