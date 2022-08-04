import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "../createUser/CreateUserUseCase";
import { AuthenticateUserUseCase } from "./AuthenticateUserUseCase";
import { IncorrectEmailOrPasswordError } from "./IncorrectEmailOrPasswordError";

let authenticateUserUseCase: AuthenticateUserUseCase;
let inMemoryUsersRepository: InMemoryUsersRepository;
let createUserUseCase: CreateUserUseCase;

describe("Authenticate User", () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    authenticateUserUseCase = new AuthenticateUserUseCase(
      inMemoryUsersRepository
    );

    createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository);
  });

  it("Should be able authenticate a user", async () => {
    const user = await createUserUseCase.execute({
      email: "batata@email.com",
      password: "senhasuperforte123",
      name: "batata",
    });

    const result = await authenticateUserUseCase.execute({
      email: "batata@email.com",
      password: "senhasuperforte123",
    });

    expect(result).toHaveProperty("token");
  });

  it("Should not be able authenticate a user with incorrect password", async () => {
    expect(async () => {
      const user = await createUserUseCase.execute({
        email: "batata@email.com",
        password: "senhasuperforte123",
        name: "batata",
      });

      const result = await authenticateUserUseCase.execute({
        email: "batata@email.com",
        password: "senhasuperfortee123",
      });
    }).rejects.toBeInstanceOf(IncorrectEmailOrPasswordError);
  });

  it("Should not be able authenticate a user with incorrect email", async () => {
    expect(async () => {
      const user = await createUserUseCase.execute({
        email: "batata@email.com",
        password: "senhasuperforte123",
        name: "batata",
      });

      const result = await authenticateUserUseCase.execute({
        email: "bata45ta@email.com",
        password: "senhasuperforte123",
      });
    }).rejects.toBeInstanceOf(IncorrectEmailOrPasswordError);
  });
});
