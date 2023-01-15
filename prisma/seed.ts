import { prisma } from "@/server/db";
import { posts } from "@/utils/data";

async function main() {
  for (const post of posts) {
    await prisma.post.create({
      data: post,
    });
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  // eslint-disable-next-line @typescript-eslint/no-misused-promises
  .finally(async () => await prisma.$disconnect());
