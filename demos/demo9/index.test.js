const { createPool, migrate, addUser, getUser, listUsers, deleteUser } = require("./index");

let pool;

beforeAll(async () => {
  pool = createPool();
  await migrate(pool);
});

afterAll(async () => {
  await pool.query("DROP TABLE IF EXISTS users");
  await pool.end();
});

beforeEach(async () => {
  await pool.query("TRUNCATE users RESTART IDENTITY CASCADE");
});

describe("User CRUD with PostgreSQL", () => {
  test("adds a user and retrieves it by id", async () => {
    const user = await addUser(pool, "Alice", "alice@example.com");
    expect(user).toMatchObject({ name: "Alice", email: "alice@example.com" });
    expect(user.id).toBeDefined();

    const fetched = await getUser(pool, user.id);
    expect(fetched.name).toBe("Alice");
  });

  test("lists all users", async () => {
    await addUser(pool, "Bob", "bob@example.com");
    await addUser(pool, "Carol", "carol@example.com");

    const users = await listUsers(pool);
    expect(users).toHaveLength(2);
    expect(users[0].name).toBe("Bob");
    expect(users[1].name).toBe("Carol");
  });

  test("deletes a user", async () => {
    const user = await addUser(pool, "Dave", "dave@example.com");
    const deleted = await deleteUser(pool, user.id);
    expect(deleted.name).toBe("Dave");

    const fetched = await getUser(pool, user.id);
    expect(fetched).toBeNull();
  });

  test("rejects duplicate email", async () => {
    await addUser(pool, "Eve", "eve@example.com");
    await expect(addUser(pool, "Eve2", "eve@example.com")).rejects.toThrow();
  });
});
