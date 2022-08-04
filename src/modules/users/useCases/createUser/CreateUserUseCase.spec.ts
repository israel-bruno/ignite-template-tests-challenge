import { User } from "../../entities/User";
import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";
import { CreateUserError } from "./CreateUserError";
import { CreateUserUseCase } from "./CreateUserUseCase";

let createUserUseCase: CreateUserUseCase;
let inMemoryUsersRepository: InMemoryUsersRepository;

describe("Create User", () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository);
  });

  it("Should be able to create a new user", async () => {
    const result = await createUserUseCase.execute({
      name: "batata",
      email: "batata@email.com",
      password: "supersecretpassword123",
    });

    expect(result).toBeInstanceOf(User);
  });

  it("Should not be able to create a new user with existing email", async () => {
    expect(async () => {
      await createUserUseCase.execute({
        name: "batata",
        email: "batata@email.com",
        password: "supersecretpassword123",
      });

      await createUserUseCase.execute({
        name: "batata0101",
        email: "batata@email.com",
        password: "supersecretpassword123",
      });
    }).rejects.toBeInstanceOf(CreateUserError);
  });
});
