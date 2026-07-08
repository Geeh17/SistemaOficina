import "dotenv/config";
import bcrypt from "bcrypt";
import { prisma } from "../src/lib/prisma";

async function main() {
  const senhaHash = await bcrypt.hash("admin123", 10);

  const admin = await prisma.usuario.upsert({
    where: { email: "admin@oficina.com" },
    update: {},
    create: {
      nome: "Administrador",
      email: "admin@oficina.com",
      senha: senhaHash,
      cargo: "ADMIN",
    },
  });

  console.log("Usuário admin criado/verificado:", admin.email);
  console.log("Login: admin@oficina.com | Senha: admin123");
  console.log("⚠️  Troque essa senha assim que possível.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    process.exit(0);
  });
