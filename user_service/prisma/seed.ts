import { PrismaClient, Gender } from '@prisma/client';
import { faker } from '@faker-js/faker';

const prisma = new PrismaClient();

async function seedUsers() {
    const users = Array.from({ length: 10000 }, () => ({
        firstName: faker.person.firstName(),
        lastName: faker.person.lastName(),
        age: faker.number.int({ min: 18, max: 90 }),
        gender: faker.helpers.enumValue(Gender),
        hasIssues: faker.datatype.boolean()
    }));

    await prisma.user.createMany({
        data: users
    });
}

seedUsers().catch((e) => {
    console.error(e);
    prisma.$disconnect();
});
