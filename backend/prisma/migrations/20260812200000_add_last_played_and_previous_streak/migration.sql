-- AlterTable
ALTER TABLE "players" ADD COLUMN "last_played_game_date" DATE,
ADD COLUMN "last_attempt_correct" BOOLEAN;

-- AlterTable
ALTER TABLE "attempts" ADD COLUMN "previous_streak" INTEGER NOT NULL DEFAULT 0;
