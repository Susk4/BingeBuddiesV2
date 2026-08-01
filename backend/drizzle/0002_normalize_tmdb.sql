PRAGMA foreign_keys=OFF;
--> statement-breakpoint
DROP TABLE IF EXISTS `movie_credit_sync`;
--> statement-breakpoint
DROP TABLE IF EXISTS `tv_credit_sync`;
--> statement-breakpoint
DROP TABLE IF EXISTS `movie_people`;
--> statement-breakpoint
DROP TABLE IF EXISTS `tv_people`;
--> statement-breakpoint
DROP TABLE IF EXISTS `movies`;
--> statement-breakpoint
DROP TABLE IF EXISTS `tv_series`;
--> statement-breakpoint
DROP TABLE IF EXISTS `people`;
--> statement-breakpoint
ALTER TABLE `collection_catalog` ADD COLUMN `poster_path` text;
--> statement-breakpoint
ALTER TABLE `collection_catalog` ADD COLUMN `backdrop_path` text;
--> statement-breakpoint
ALTER TABLE `tv_network_catalog` ADD COLUMN `logo_path` text;
--> statement-breakpoint
ALTER TABLE `tv_network_catalog` ADD COLUMN `origin_country` text;
--> statement-breakpoint
ALTER TABLE `production_company_catalog` ADD COLUMN `logo_path` text;
--> statement-breakpoint
ALTER TABLE `production_company_catalog` ADD COLUMN `origin_country` text;
--> statement-breakpoint
CREATE TABLE `tmdb_genres` (
	`id` integer PRIMARY KEY NOT NULL,
	`name` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `movies` (
	`id` integer PRIMARY KEY NOT NULL,
	`adult` integer DEFAULT false NOT NULL,
	`backdrop_path` text,
	`budget` integer DEFAULT 0 NOT NULL,
	`collection_id` integer,
	`homepage` text,
	`imdb_id` text,
	`original_language` text,
	`original_title` text NOT NULL,
	`overview` text,
	`popularity` real DEFAULT 0 NOT NULL,
	`poster_path` text,
	`release_date` text,
	`revenue` integer DEFAULT 0 NOT NULL,
	`runtime` integer,
	`status` text,
	`tagline` text,
	`title` text NOT NULL,
	`video` integer DEFAULT false NOT NULL,
	`vote_average` real DEFAULT 0 NOT NULL,
	`vote_count` integer DEFAULT 0 NOT NULL,
	FOREIGN KEY (`collection_id`) REFERENCES `collection_catalog`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `tv_series` (
	`id` integer PRIMARY KEY NOT NULL,
	`adult` integer DEFAULT false NOT NULL,
	`backdrop_path` text,
	`first_air_date` text,
	`homepage` text,
	`in_production` integer DEFAULT false NOT NULL,
	`last_air_date` text,
	`name` text NOT NULL,
	`number_of_episodes` integer DEFAULT 0 NOT NULL,
	`number_of_seasons` integer DEFAULT 0 NOT NULL,
	`original_language` text,
	`original_name` text NOT NULL,
	`overview` text,
	`popularity` real DEFAULT 0 NOT NULL,
	`poster_path` text,
	`status` text,
	`tagline` text,
	`type` text,
	`vote_average` real DEFAULT 0 NOT NULL,
	`vote_count` integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE TABLE `tv_last_episode` (
	`tv_id` integer PRIMARY KEY NOT NULL,
	`episode_id` integer NOT NULL,
	`name` text,
	`overview` text,
	`vote_average` real,
	`vote_count` integer,
	`air_date` text,
	`episode_number` integer,
	`production_code` text,
	`runtime` integer,
	`season_number` integer,
	`still_path` text,
	FOREIGN KEY (`tv_id`) REFERENCES `tv_series`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `tv_next_episode` (
	`tv_id` integer PRIMARY KEY NOT NULL,
	`episode_id` integer NOT NULL,
	`name` text,
	`overview` text,
	`vote_average` real,
	`vote_count` integer,
	`air_date` text,
	`episode_number` integer,
	`production_code` text,
	`runtime` integer,
	`season_number` integer,
	`still_path` text,
	FOREIGN KEY (`tv_id`) REFERENCES `tv_series`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `tv_seasons` (
	`id` integer PRIMARY KEY NOT NULL,
	`tv_id` integer NOT NULL,
	`air_date` text,
	`episode_count` integer DEFAULT 0 NOT NULL,
	`name` text,
	`overview` text,
	`poster_path` text,
	`season_number` integer NOT NULL,
	`vote_average` real,
	FOREIGN KEY (`tv_id`) REFERENCES `tv_series`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `people` (
	`id` integer PRIMARY KEY NOT NULL,
	`adult` integer DEFAULT false NOT NULL,
	`biography` text,
	`birthday` text,
	`deathday` text,
	`gender` integer DEFAULT 0 NOT NULL,
	`homepage` text,
	`imdb_id` text,
	`known_for_department` text,
	`name` text NOT NULL,
	`place_of_birth` text,
	`popularity` real DEFAULT 0 NOT NULL,
	`profile_path` text
);
--> statement-breakpoint
CREATE TABLE `person_aliases` (
	`person_id` integer NOT NULL,
	`name` text NOT NULL,
	PRIMARY KEY(`person_id`, `name`),
	FOREIGN KEY (`person_id`) REFERENCES `people`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `movie_genres` (
	`movie_id` integer NOT NULL,
	`genre_id` integer NOT NULL,
	PRIMARY KEY(`movie_id`, `genre_id`),
	FOREIGN KEY (`movie_id`) REFERENCES `movies`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`genre_id`) REFERENCES `tmdb_genres`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `movie_production_companies` (
	`movie_id` integer NOT NULL,
	`company_id` integer NOT NULL,
	PRIMARY KEY(`movie_id`, `company_id`),
	FOREIGN KEY (`movie_id`) REFERENCES `movies`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`company_id`) REFERENCES `production_company_catalog`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `movie_production_countries` (
	`movie_id` integer NOT NULL,
	`iso_3166_1` text NOT NULL,
	`name` text NOT NULL,
	PRIMARY KEY(`movie_id`, `iso_3166_1`),
	FOREIGN KEY (`movie_id`) REFERENCES `movies`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `movie_spoken_languages` (
	`movie_id` integer NOT NULL,
	`iso_639_1` text NOT NULL,
	`name` text,
	PRIMARY KEY(`movie_id`, `iso_639_1`),
	FOREIGN KEY (`movie_id`) REFERENCES `movies`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `movie_origin_countries` (
	`movie_id` integer NOT NULL,
	`country_code` text NOT NULL,
	PRIMARY KEY(`movie_id`, `country_code`),
	FOREIGN KEY (`movie_id`) REFERENCES `movies`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `tv_genres` (
	`tv_id` integer NOT NULL,
	`genre_id` integer NOT NULL,
	PRIMARY KEY(`tv_id`, `genre_id`),
	FOREIGN KEY (`tv_id`) REFERENCES `tv_series`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`genre_id`) REFERENCES `tmdb_genres`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `tv_production_companies` (
	`tv_id` integer NOT NULL,
	`company_id` integer NOT NULL,
	PRIMARY KEY(`tv_id`, `company_id`),
	FOREIGN KEY (`tv_id`) REFERENCES `tv_series`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`company_id`) REFERENCES `production_company_catalog`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `tv_production_countries` (
	`tv_id` integer NOT NULL,
	`iso_3166_1` text NOT NULL,
	`name` text NOT NULL,
	PRIMARY KEY(`tv_id`, `iso_3166_1`),
	FOREIGN KEY (`tv_id`) REFERENCES `tv_series`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `tv_spoken_languages` (
	`tv_id` integer NOT NULL,
	`iso_639_1` text NOT NULL,
	`english_name` text,
	`name` text,
	PRIMARY KEY(`tv_id`, `iso_639_1`),
	FOREIGN KEY (`tv_id`) REFERENCES `tv_series`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `tv_origin_countries` (
	`tv_id` integer NOT NULL,
	`country_code` text NOT NULL,
	PRIMARY KEY(`tv_id`, `country_code`),
	FOREIGN KEY (`tv_id`) REFERENCES `tv_series`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `tv_networks` (
	`tv_id` integer NOT NULL,
	`network_id` integer NOT NULL,
	PRIMARY KEY(`tv_id`, `network_id`),
	FOREIGN KEY (`tv_id`) REFERENCES `tv_series`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`network_id`) REFERENCES `tv_network_catalog`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `tv_languages` (
	`tv_id` integer NOT NULL,
	`language_code` text NOT NULL,
	PRIMARY KEY(`tv_id`, `language_code`),
	FOREIGN KEY (`tv_id`) REFERENCES `tv_series`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `tv_episode_run_times` (
	`tv_id` integer NOT NULL,
	`runtime_minutes` integer NOT NULL,
	PRIMARY KEY(`tv_id`, `runtime_minutes`),
	FOREIGN KEY (`tv_id`) REFERENCES `tv_series`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `tv_created_by` (
	`tv_id` integer NOT NULL,
	`tmdb_person_id` integer NOT NULL,
	`credit_id` text,
	`name` text,
	`gender` integer,
	`profile_path` text,
	PRIMARY KEY(`tv_id`, `tmdb_person_id`),
	FOREIGN KEY (`tv_id`) REFERENCES `tv_series`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `movie_credit_sync` (
	`movie_id` integer PRIMARY KEY NOT NULL,
	FOREIGN KEY (`movie_id`) REFERENCES `movies`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `tv_credit_sync` (
	`tv_id` integer PRIMARY KEY NOT NULL,
	FOREIGN KEY (`tv_id`) REFERENCES `tv_series`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `movie_people` (
	`movie_id` integer NOT NULL,
	`person_id` integer NOT NULL,
	`role` text NOT NULL,
	`character` text,
	`cast_order` integer,
	PRIMARY KEY(`movie_id`, `person_id`, `role`),
	FOREIGN KEY (`movie_id`) REFERENCES `movies`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`person_id`) REFERENCES `people`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `tv_people` (
	`tv_id` integer NOT NULL,
	`person_id` integer NOT NULL,
	`role` text NOT NULL,
	`character` text,
	`cast_order` integer,
	PRIMARY KEY(`tv_id`, `person_id`, `role`),
	FOREIGN KEY (`tv_id`) REFERENCES `tv_series`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`person_id`) REFERENCES `people`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
PRAGMA foreign_keys=ON;
