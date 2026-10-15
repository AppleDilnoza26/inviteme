import { PrismaClient } from "@prisma/client";
import { TEMPLATES } from "../src/templates/catalog";

const prisma = new PrismaClient();

async function main() {
  for (const [index, t] of TEMPLATES.entries()) {
    const data = {
      category: t.category,
      layout: t.layout,
      isPremium: t.isPremium,
      defaults: JSON.stringify({ font: t.font, palette: t.palette, ru: t.defaults.ru, en: t.defaults.en }),
      sortOrder: index,
    };
    await prisma.template.upsert({ where: { slug: t.slug }, update: data, create: { slug: t.slug, ...data } });
  }
  // Templates removed from the catalog stay in the DB only while invitations still use them.
  const { count } = await prisma.template.deleteMany({
    where: { slug: { notIn: TEMPLATES.map((t) => t.slug) }, invitations: { none: {} } },
  });
  console.log(`Seeded ${TEMPLATES.length} templates, removed ${count} unused legacy templates`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
