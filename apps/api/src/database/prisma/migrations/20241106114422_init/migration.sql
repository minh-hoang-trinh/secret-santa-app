-- CreateEnum
CREATE TYPE "DrawStatus" AS ENUM ('OPEN', 'COMPLETED');

-- CreateTable
CREATE TABLE "Draw" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "ownerId" TEXT NOT NULL,
    "status" "DrawStatus" NOT NULL DEFAULT 'OPEN',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Draw_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User" (
    "username" TEXT NOT NULL,
    "hashedPassword" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("username")
);

-- CreateTable
CREATE TABLE "UserDraw" (
    "id" SERIAL NOT NULL,
    "userId" TEXT NOT NULL,
    "drawId" TEXT NOT NULL,
    "comment" TEXT,
    "receiverId" TEXT,

    CONSTRAINT "UserDraw_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Blacklist" (
    "drawId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "blacklistedUserId" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "UserDraw_userId_drawId_key" ON "UserDraw"("userId", "drawId");

-- CreateIndex
CREATE UNIQUE INDEX "UserDraw_userId_drawId_receiverId_key" ON "UserDraw"("userId", "drawId", "receiverId");

-- CreateIndex
CREATE UNIQUE INDEX "Blacklist_drawId_userId_blacklistedUserId_key" ON "Blacklist"("drawId", "userId", "blacklistedUserId");

-- AddForeignKey
ALTER TABLE "Draw" ADD CONSTRAINT "Draw_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "User"("username") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserDraw" ADD CONSTRAINT "UserDraw_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("username") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserDraw" ADD CONSTRAINT "UserDraw_drawId_fkey" FOREIGN KEY ("drawId") REFERENCES "Draw"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserDraw" ADD CONSTRAINT "UserDraw_receiverId_fkey" FOREIGN KEY ("receiverId") REFERENCES "User"("username") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Blacklist" ADD CONSTRAINT "Blacklist_drawId_fkey" FOREIGN KEY ("drawId") REFERENCES "Draw"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Blacklist" ADD CONSTRAINT "Blacklist_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("username") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Blacklist" ADD CONSTRAINT "Blacklist_blacklistedUserId_fkey" FOREIGN KEY ("blacklistedUserId") REFERENCES "User"("username") ON DELETE RESTRICT ON UPDATE CASCADE;
