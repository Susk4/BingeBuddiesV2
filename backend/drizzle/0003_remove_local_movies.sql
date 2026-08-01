PRAGMA foreign_keys=OFF;
--> statement-breakpoint
DROP TABLE IF EXISTS `movie_credit_sync`;
--> statement-breakpoint
DROP TABLE IF EXISTS `movie_people`;
--> statement-breakpoint
DROP TABLE IF EXISTS `movie_genres`;
--> statement-breakpoint
DROP TABLE IF EXISTS `movie_production_companies`;
--> statement-breakpoint
DROP TABLE IF EXISTS `movie_production_countries`;
--> statement-breakpoint
DROP TABLE IF EXISTS `movie_spoken_languages`;
--> statement-breakpoint
DROP TABLE IF EXISTS `movie_origin_countries`;
--> statement-breakpoint
DROP TABLE IF EXISTS `movies`;
--> statement-breakpoint
DROP TABLE IF EXISTS `movie_catalog`;
--> statement-breakpoint
CREATE TABLE `user_movies_new` (
	`user_id` text NOT NULL,
	`movie_id` integer NOT NULL,
	`created_at` integer DEFAULT (unixepoch() * 1000) NOT NULL,
	PRIMARY KEY(`user_id`, `movie_id`),
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
INSERT INTO `user_movies_new` SELECT `user_id`, `movie_id`, `created_at` FROM `user_movies`;
--> statement-breakpoint
DROP TABLE `user_movies`;
--> statement-breakpoint
ALTER TABLE `user_movies_new` RENAME TO `user_movies`;
--> statement-breakpoint
PRAGMA foreign_keys=ON;
