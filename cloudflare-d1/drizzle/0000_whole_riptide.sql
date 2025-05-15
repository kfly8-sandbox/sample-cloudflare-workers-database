CREATE TABLE `todos` (
	`id` integer PRIMARY KEY NOT NULL,
	`title` text,
	`description` text,
	`done` integer DEFAULT false
);
