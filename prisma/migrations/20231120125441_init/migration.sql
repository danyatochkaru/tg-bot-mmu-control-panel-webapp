-- CreateTable
CREATE TABLE "Profile" (
    "id" TEXT NOT NULL,
    "requestToken" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT,
    "tgId" TEXT,

    CONSTRAINT "Profile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Mailing" (
    "id" TEXT NOT NULL,
    "recipients" INTEGER[],
    "message" TEXT NOT NULL,
    "senderId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Mailing_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Mailing" ADD CONSTRAINT "Mailing_senderId_fkey" FOREIGN KEY ("senderId") REFERENCES "Profile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
