import { PrismaClient } from '@prisma/client';

// Этот сид создает тестовые данные

const prisma = new PrismaClient();

async function main() {
    const shops = await prisma.shop.createMany({
        data: Array.from({ length: 10 }).map((_, index) => ({
            name: `Shop ${index + 1}`,
            location: null
        }))
    });

    console.log('Shops created:', shops);

    const products = await prisma.product.createMany({
        data: Array.from({ length: 5 }).map((_, index) => ({
            plu: `PLU-${index + 1}`,
            name: `Product ${index + 1}`
        }))
    });

    console.log('Products created:', products);
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
