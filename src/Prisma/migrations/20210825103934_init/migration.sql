-- CreateEnum
CREATE TYPE "user_type_enum" AS ENUM ('business', 'personal');

-- CreateTable
CREATE TABLE "codes" (
    "id" SERIAL NOT NULL,
    "phone" VARCHAR NOT NULL,
    "value" VARCHAR NOT NULL,
    "attempt" INTEGER NOT NULL DEFAULT 1,
    "next_check_at" TIMESTAMP(3),
    "expires_at" TIMESTAMP(3) NOT NULL,
    "created_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "users" (
    "id" SERIAL NOT NULL,
    "type" "user_type_enum" NOT NULL DEFAULT E'business',
    "name" VARCHAR NOT NULL,
    "phone" VARCHAR NOT NULL,
    "email" VARCHAR,
    "created_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "codes.phone_unique" ON "codes"("phone");

-- CreateIndex
CREATE UNIQUE INDEX "users.phone_unique" ON "users"("phone");

-- CreateIndex
CREATE UNIQUE INDEX "users.email_unique" ON "users"("email");
