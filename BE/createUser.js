const prisma = require("./config/prisma");

async function main() {
  const user = await prisma.user.create({
    data: {
      email: "test1@test.com",
      password: "test123",
      nickname: "park"
    }
  });

  console.log(user);
}

main()
  .catch(console.error)
  .finally(async () => {
    await prisma.$disconnect();
  });