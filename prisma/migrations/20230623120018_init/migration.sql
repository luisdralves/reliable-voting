-- CreateTable
CREATE TABLE "Voter" (
    "id" INTEGER NOT NULL,

    CONSTRAINT "Voter_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Vote" (
    "id" INTEGER NOT NULL,
    "voterId" INTEGER NOT NULL,

    CONSTRAINT "Vote_pkey" PRIMARY KEY ("voterId")
);

-- CreateTable
CREATE TABLE "State" (
    "id" TEXT NOT NULL DEFAULT 'root',
    "locked" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "State_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Vote_voterId_key" ON "Vote"("voterId");

-- AddForeignKey
ALTER TABLE "Vote" ADD CONSTRAINT "Vote_voterId_fkey" FOREIGN KEY ("voterId") REFERENCES "Voter"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
