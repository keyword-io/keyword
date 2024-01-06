-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT,
    "create_time" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "update_time" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Feed" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "create_time" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "update_time" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Feed_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
