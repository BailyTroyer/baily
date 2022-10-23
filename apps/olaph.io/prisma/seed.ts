import { PrismaClient, Prisma } from "@prisma/client";

const prisma = new PrismaClient();

const postData: Prisma.PostCreateInput[] = [
  {
    createdAt: new Date(),
    title: "post 1",
    contents: "hello world",
    description: "description 1",
    published: true,
    author: {
      create: {
        email: "user@baily.io",
        name: "Baily",
        profile: {
          create: {
            bio: "my bio",
            url: "https://images.unsplash.com/photo-1571816119607-57e48af1caa9?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=687&q=80",
          },
        },
      },
    },
    categories: {
      create: [{ name: "tag1" }, { name: "tag2" }],
    },
  },
  {
    createdAt: new Date(),
    title: "post 2",
    contents: "hello world 2",
    description: "description 2",
    published: true,
    author: {
      create: {
        email: "user2@baily.io",
        name: "Matthew",
        profile: {
          create: {
            bio: "my bio 2",
            url: "https://images.unsplash.com/photo-1571816119607-57e48af1caa9?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=687&q=80",
          },
        },
      },
    },
    categories: {
      create: [{ name: "tag3" }, { name: "tag4" }],
      connect: [{ id: 1 }],
    },
  },
];

async function main() {
  console.log(`Start seeding ...`);
  for (const p of postData) {
    const post = await prisma.post.create({
      data: p,
    });
    console.log(`Created post & author with ids: ${post.id}, ${post.authorId}`);
  }

  console.log(`Seeding finished.`);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
