CREATE TABLE `audit_log` (
	`id` bigint unsigned AUTO_INCREMENT NOT NULL,
	`tenant_id` bigint unsigned NOT NULL,
	`actor` varchar(191) NOT NULL,
	`action` varchar(96) NOT NULL,
	`entity` varchar(64) NOT NULL,
	`entity_id` varchar(64),
	`data` json,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `audit_log_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `brands` (
	`id` bigint unsigned AUTO_INCREMENT NOT NULL,
	`tenant_id` bigint unsigned NOT NULL,
	`slug` varchar(96) NOT NULL,
	`name` varchar(191) NOT NULL,
	CONSTRAINT `brands_id` PRIMARY KEY(`id`),
	CONSTRAINT `brand_tenant_slug` UNIQUE(`tenant_id`,`slug`)
);
--> statement-breakpoint
CREATE TABLE `categories` (
	`id` bigint unsigned AUTO_INCREMENT NOT NULL,
	`tenant_id` bigint unsigned NOT NULL,
	`parent_id` bigint unsigned,
	`slug` varchar(96) NOT NULL,
	`name_en` varchar(191) NOT NULL,
	`name_ar` varchar(191) NOT NULL,
	`blurb_en` varchar(255),
	`blurb_ar` varchar(255),
	`image` varchar(255),
	`sort` int NOT NULL DEFAULT 0,
	`active` boolean NOT NULL DEFAULT true,
	CONSTRAINT `categories_id` PRIMARY KEY(`id`),
	CONSTRAINT `cat_tenant_slug` UNIQUE(`tenant_id`,`slug`)
);
--> statement-breakpoint
CREATE TABLE `companies` (
	`id` bigint unsigned AUTO_INCREMENT NOT NULL,
	`tenant_id` bigint unsigned NOT NULL,
	`name` varchar(191) NOT NULL,
	`trn` varchar(32),
	`price_list_id` bigint unsigned,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `companies_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `company_users` (
	`id` bigint unsigned AUTO_INCREMENT NOT NULL,
	`company_id` bigint unsigned NOT NULL,
	`email` varchar(191) NOT NULL,
	`name` varchar(191) NOT NULL,
	`role` enum('owner','buyer','approver','viewer') NOT NULL DEFAULT 'buyer',
	`password_hash` varchar(255),
	`created_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `company_users_id` PRIMARY KEY(`id`),
	CONSTRAINT `cu_email` UNIQUE(`email`)
);
--> statement-breakpoint
CREATE TABLE `inventory` (
	`product_id` bigint unsigned NOT NULL,
	`on_hand_base` int NOT NULL DEFAULT 0,
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `inventory_product_id` PRIMARY KEY(`product_id`)
);
--> statement-breakpoint
CREATE TABLE `orders` (
	`id` bigint unsigned AUTO_INCREMENT NOT NULL,
	`tenant_id` bigint unsigned NOT NULL,
	`company_id` bigint unsigned,
	`number` varchar(32) NOT NULL,
	`status` enum('pending_payment','paid','processing','shipped','delivered','cancelled') NOT NULL DEFAULT 'pending_payment',
	`lines` json NOT NULL,
	`subtotal_minor` int NOT NULL,
	`vat_minor` int NOT NULL,
	`total_minor` int NOT NULL,
	`source_quote_id` bigint unsigned,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `orders_id` PRIMARY KEY(`id`),
	CONSTRAINT `orders_number_unique` UNIQUE(`number`)
);
--> statement-breakpoint
CREATE TABLE `price_lists` (
	`id` bigint unsigned AUTO_INCREMENT NOT NULL,
	`tenant_id` bigint unsigned NOT NULL,
	`code` varchar(64) NOT NULL,
	`name` varchar(191) NOT NULL,
	`is_default` boolean NOT NULL DEFAULT false,
	CONSTRAINT `price_lists_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `prices` (
	`id` bigint unsigned AUTO_INCREMENT NOT NULL,
	`price_list_id` bigint unsigned NOT NULL,
	`product_unit_id` bigint unsigned NOT NULL,
	`min_qty` int NOT NULL DEFAULT 1,
	`amount_minor` int NOT NULL,
	CONSTRAINT `prices_id` PRIMARY KEY(`id`),
	CONSTRAINT `price_tier` UNIQUE(`price_list_id`,`product_unit_id`,`min_qty`)
);
--> statement-breakpoint
CREATE TABLE `processed_events` (
	`event_key` varchar(191) NOT NULL,
	`source` varchar(64) NOT NULL,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `processed_events_event_key` PRIMARY KEY(`event_key`)
);
--> statement-breakpoint
CREATE TABLE `product_units` (
	`id` bigint unsigned AUTO_INCREMENT NOT NULL,
	`product_id` bigint unsigned NOT NULL,
	`unit` enum('each','pack','box','carton','ream') NOT NULL,
	`to_base` int NOT NULL,
	`label_en` varchar(96) NOT NULL,
	`label_ar` varchar(96) NOT NULL,
	`min_qty` int NOT NULL DEFAULT 1,
	CONSTRAINT `product_units_id` PRIMARY KEY(`id`),
	CONSTRAINT `unit_prod_unit` UNIQUE(`product_id`,`unit`)
);
--> statement-breakpoint
CREATE TABLE `products` (
	`id` bigint unsigned AUTO_INCREMENT NOT NULL,
	`tenant_id` bigint unsigned NOT NULL,
	`sku` varchar(64) NOT NULL,
	`category_id` bigint unsigned NOT NULL,
	`brand_id` bigint unsigned,
	`name_en` varchar(255) NOT NULL,
	`name_ar` varchar(255) NOT NULL,
	`desc_en` text,
	`desc_ar` text,
	`aliases` json NOT NULL,
	`base_unit` enum('each','pack','box','carton','ream') NOT NULL DEFAULT 'each',
	`image` varchar(255),
	`featured` boolean NOT NULL DEFAULT false,
	`status` enum('draft','published','archived') NOT NULL DEFAULT 'draft',
	`is_sample` boolean NOT NULL DEFAULT false,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `products_id` PRIMARY KEY(`id`),
	CONSTRAINT `prod_tenant_sku` UNIQUE(`tenant_id`,`sku`)
);
--> statement-breakpoint
CREATE TABLE `quote_versions` (
	`id` bigint unsigned AUTO_INCREMENT NOT NULL,
	`quote_id` bigint unsigned NOT NULL,
	`version` int NOT NULL,
	`lines` json NOT NULL,
	`subtotal_minor` int,
	`vat_minor` int,
	`total_minor` int,
	`expires_at` timestamp,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `quote_versions_id` PRIMARY KEY(`id`),
	CONSTRAINT `qv_quote_version` UNIQUE(`quote_id`,`version`)
);
--> statement-breakpoint
CREATE TABLE `quotes` (
	`id` bigint unsigned AUTO_INCREMENT NOT NULL,
	`tenant_id` bigint unsigned NOT NULL,
	`company_id` bigint unsigned,
	`number` varchar(32) NOT NULL,
	`status` enum('requested','in_review','priced','accepted','expired','converted','rejected') NOT NULL DEFAULT 'requested',
	`contact_email` varchar(191) NOT NULL,
	`current_version` int NOT NULL DEFAULT 1,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `quotes_id` PRIMARY KEY(`id`),
	CONSTRAINT `quotes_number_unique` UNIQUE(`number`)
);
--> statement-breakpoint
CREATE TABLE `tenants` (
	`id` bigint unsigned AUTO_INCREMENT NOT NULL,
	`slug` varchar(64) NOT NULL,
	`name` varchar(191) NOT NULL,
	`currency` varchar(3) NOT NULL DEFAULT 'AED',
	`vat_rate` decimal(5,4) NOT NULL DEFAULT '0.0500',
	`created_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `tenants_id` PRIMARY KEY(`id`),
	CONSTRAINT `tenants_slug_unique` UNIQUE(`slug`)
);
--> statement-breakpoint
CREATE INDEX `audit_tenant_time` ON `audit_log` (`tenant_id`,`created_at`);--> statement-breakpoint
CREATE INDEX `prod_cat` ON `products` (`category_id`);