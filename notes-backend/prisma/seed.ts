import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  // Create sample users
  const ownerPassword = await bcrypt.hash('owner123', 10);
  const userPassword = await bcrypt.hash('user123', 10);

  const owner = await prisma.user.upsert({
    where: { username: 'owner' },
    update: {},
    create: {
      username: 'owner',
      password: ownerPassword,
      role: 'owner',
    },
  });

  const user = await prisma.user.upsert({
    where: { username: 'user' },
    update: {},
    create: {
      username: 'user',
      password: userPassword,
      role: 'user',
    },
  });

  // Create sample notes for the user
  const sampleNotes = [
    {
      title: 'Dobrodošli u Notes aplikaciju',
      content: '<p>Ovo je vaša prva beleška. Možete koristiti ovaj editor za kreiranje bogatog sadržaja.</p><p>Funkcionalnosti:</p><ul><li>Bold i italic tekst</li><li>Liste</li><li>Naslovi</li><li>I još mnogo toga!</li></ul>',
      userId: user.id,
    },
    {
      title: 'Dnevni plan',
      content: '<h2>Plan za danas</h2><ol><li>Doručak</li><li>Rad na projektu</li><li>Vežbanje</li><li>Čitanje</li></ol><p><strong>Važno:</strong> Ne zaboraviti na sastanak u 14h!</p>',
      userId: user.id,
    },
  ];

  for (const note of sampleNotes) {
    await prisma.note.create({
      data: note,
    });
  }

  // Create sample table for the user
  const sampleTableRows = [
    { id: Date.now(), title: "Web development", price: "500" },
    { id: Date.now() + 1, title: "Mobile app", price: "800" },
    { id: Date.now() + 2, title: "Design", price: "300" }
  ];

  await prisma.table.create({
    data: {
      name: 'Dnevna tabela',
      rows: JSON.stringify(sampleTableRows),
      userId: user.id,
    },
  });

  console.log('Seed data created successfully!');
  console.log('Test users:');
  console.log('- Username: owner, Password: owner123, Role: owner');
  console.log('- Username: user, Password: user123, Role: user');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
