const prisma = require("./config/prisma");

async function main() {
    const destinations = await prisma.destination.findMany();

    console.log(destinations);
}

main()
    .catch(console.error)
    .finally(async () => {
        await prisma.$disconnect();
    });