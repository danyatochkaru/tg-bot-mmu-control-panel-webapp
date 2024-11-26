-- CreateTable
CREATE TABLE "MailingGroups" (
    "id" TEXT NOT NULL,
    "groupId" TEXT NOT NULL,
    "recipients" INTEGER NOT NULL DEFAULT 0,
    "mailingId" TEXT NOT NULL,

    CONSTRAINT "MailingGroups_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "MailingGroups" ADD CONSTRAINT "MailingGroups_mailingId_fkey" FOREIGN KEY ("mailingId") REFERENCES "Mailing"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
