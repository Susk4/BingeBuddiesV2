CREATE TABLE `tv_series` (
	`id` integer PRIMARY KEY NOT NULL,
	`data_json` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `people` (
	`id` integer PRIMARY KEY NOT NULL,
	`data_json` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `movie_catalog` (
	`id` integer PRIMARY KEY NOT NULL,
	`original_title` text NOT NULL,
	`popularity` real NOT NULL,
	`export_date` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `tv_series_catalog` (
	`id` integer PRIMARY KEY NOT NULL,
	`original_name` text NOT NULL,
	`popularity` real NOT NULL,
	`export_date` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `person_catalog` (
	`id` integer PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`popularity` real NOT NULL,
	`export_date` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `collection_catalog` (
	`id` integer PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`export_date` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `tv_network_catalog` (
	`id` integer PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`export_date` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `keyword_catalog` (
	`id` integer PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`export_date` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `production_company_catalog` (
	`id` integer PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`export_date` text NOT NULL
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
CREATE TABLE `movie_credit_sync` (
	`movie_id` integer PRIMARY KEY NOT NULL,
	FOREIGN KEY (`movie_id`) REFERENCES `movies`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `tv_credit_sync` (
	`tv_id` integer PRIMARY KEY NOT NULL,
	FOREIGN KEY (`tv_id`) REFERENCES `tv_series`(`id`) ON UPDATE no action ON DELETE cascade
);
