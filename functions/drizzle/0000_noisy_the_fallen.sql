CREATE TABLE `interaction_logs` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`my_account_id` text NOT NULL,
	`target_user_id` text NOT NULL,
	`type` text NOT NULL,
	`content` text NOT NULL,
	`ai_analyzed` integer DEFAULT false,
	`created_at` text DEFAULT CURRENT_TIMESTAMP,
	FOREIGN KEY (`my_account_id`) REFERENCES `my_accounts`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`target_user_id`) REFERENCES `target_users`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `my_accounts` (
	`id` text PRIMARY KEY NOT NULL,
	`username` text NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP
);
--> statement-breakpoint
CREATE TABLE `target_users` (
	`id` text PRIMARY KEY NOT NULL,
	`my_account_id` text NOT NULL,
	`username` text NOT NULL,
	`status` text DEFAULT 'none' NOT NULL,
	`updated_at` text DEFAULT CURRENT_TIMESTAMP,
	FOREIGN KEY (`my_account_id`) REFERENCES `my_accounts`(`id`) ON UPDATE no action ON DELETE cascade
);
