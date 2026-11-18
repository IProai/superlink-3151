/*M!999999\- enable the sandbox mode */ 
-- MariaDB dump 10.19-11.8.6-MariaDB, for debian-linux-gnu (x86_64)
--
-- Host: localhost    Database: superlink
-- ------------------------------------------------------
-- Server version	11.8.6-MariaDB-0+deb13u1 from Debian

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*M!100616 SET @OLD_NOTE_VERBOSITY=@@NOTE_VERBOSITY, NOTE_VERBOSITY=0 */;

--
-- Dumping data for table `audit_log`
--

SET @OLD_AUTOCOMMIT=@@AUTOCOMMIT, @@AUTOCOMMIT=0;
LOCK TABLES `audit_log` WRITE;
/*!40000 ALTER TABLE `audit_log` DISABLE KEYS */;
INSERT INTO `audit_log` (`id`, `tenant_id`, `actor`, `action`, `entity`, `entity_id`, `data`, `created_at`) VALUES (1,1,'system:seed','catalog.seed_sample','catalog',NULL,'{\"products\":18}','2026-11-18 17:00:00');
/*!40000 ALTER TABLE `audit_log` ENABLE KEYS */;
UNLOCK TABLES;
COMMIT;
SET AUTOCOMMIT=@OLD_AUTOCOMMIT;

--
-- Dumping data for table `brands`
--

SET @OLD_AUTOCOMMIT=@@AUTOCOMMIT, @@AUTOCOMMIT=0;
LOCK TABLES `brands` WRITE;
/*!40000 ALTER TABLE `brands` DISABLE KEYS */;
INSERT INTO `brands` (`id`, `tenant_id`, `slug`, `name`) VALUES (1,1,'double-a','Double A');
INSERT INTO `brands` (`id`, `tenant_id`, `slug`, `name`) VALUES (2,1,'faber-castell','Faber-Castell');
INSERT INTO `brands` (`id`, `tenant_id`, `slug`, `name`) VALUES (3,1,'cello','Cello');
INSERT INTO `brands` (`id`, `tenant_id`, `slug`, `name`) VALUES (4,1,'hp','HP');
INSERT INTO `brands` (`id`, `tenant_id`, `slug`, `name`) VALUES (5,1,'canon','Canon');
INSERT INTO `brands` (`id`, `tenant_id`, `slug`, `name`) VALUES (6,1,'brother','Brother');
INSERT INTO `brands` (`id`, `tenant_id`, `slug`, `name`) VALUES (7,1,'staedtler','Staedtler');
INSERT INTO `brands` (`id`, `tenant_id`, `slug`, `name`) VALUES (8,1,'pentel','Pentel');
INSERT INTO `brands` (`id`, `tenant_id`, `slug`, `name`) VALUES (9,1,'kangaro','Kangaro');
INSERT INTO `brands` (`id`, `tenant_id`, `slug`, `name`) VALUES (10,1,'max','MAX');
INSERT INTO `brands` (`id`, `tenant_id`, `slug`, `name`) VALUES (11,1,'rexel','Rexel');
INSERT INTO `brands` (`id`, `tenant_id`, `slug`, `name`) VALUES (12,1,'durable','Durable');
INSERT INTO `brands` (`id`, `tenant_id`, `slug`, `name`) VALUES (13,1,'zebra','Zebra');
INSERT INTO `brands` (`id`, `tenant_id`, `slug`, `name`) VALUES (14,1,'post-it','Post-it');
INSERT INTO `brands` (`id`, `tenant_id`, `slug`, `name`) VALUES (15,1,'casio','Casio');
INSERT INTO `brands` (`id`, `tenant_id`, `slug`, `name`) VALUES (16,1,'3m','3M');
INSERT INTO `brands` (`id`, `tenant_id`, `slug`, `name`) VALUES (17,1,'olfa','Olfa');
INSERT INTO `brands` (`id`, `tenant_id`, `slug`, `name`) VALUES (18,1,'epson','Epson');
/*!40000 ALTER TABLE `brands` ENABLE KEYS */;
UNLOCK TABLES;
COMMIT;
SET AUTOCOMMIT=@OLD_AUTOCOMMIT;

--
-- Dumping data for table `categories`
--

SET @OLD_AUTOCOMMIT=@@AUTOCOMMIT, @@AUTOCOMMIT=0;
LOCK TABLES `categories` WRITE;
/*!40000 ALTER TABLE `categories` DISABLE KEYS */;
INSERT INTO `categories` (`id`, `tenant_id`, `parent_id`, `slug`, `name_en`, `name_ar`, `blurb_en`, `blurb_ar`, `image`, `sort`, `active`) VALUES (1,1,NULL,'paper','Paper & Envelopes','الورق والأظرف','A4 copy, colour, roll & certificate paper, envelopes','ورق تصوير A4، ورق ملون، رولات، شهادات وأظرف','/images/cat/paper.webp',0,1);
INSERT INTO `categories` (`id`, `tenant_id`, `parent_id`, `slug`, `name_en`, `name_ar`, `blurb_en`, `blurb_ar`, `image`, `sort`, `active`) VALUES (2,1,NULL,'filing','Filing & Storage','الملفات والحفظ','Box files, ring binders, folders, display books, trays','ملفات صندوقية، ملفات حلقات، مجلدات، كتب عرض وصواني','/images/cat/filing.webp',1,1);
INSERT INTO `categories` (`id`, `tenant_id`, `parent_id`, `slug`, `name_en`, `name_ar`, `blurb_en`, `blurb_ar`, `image`, `sort`, `active`) VALUES (3,1,NULL,'writing','Writing Instruments','أدوات الكتابة','Pens, markers, highlighters & correction','أقلام، ماركرات، أقلام تحديد ومصححات','/images/cat/writing.webp',2,1);
INSERT INTO `categories` (`id`, `tenant_id`, `parent_id`, `slug`, `name_en`, `name_ar`, `blurb_en`, `blurb_ar`, `image`, `sort`, `active`) VALUES (4,1,NULL,'desk','Desk Essentials','مستلزمات المكتب','Staplers, punches, tape, glue, scissors, sticky notes','دباسات، خرامات، شريط لاصق، صمغ، مقصات وأوراق لاصقة','/images/cat/desk.webp',3,1);
INSERT INTO `categories` (`id`, `tenant_id`, `parent_id`, `slug`, `name_en`, `name_ar`, `blurb_en`, `blurb_ar`, `image`, `sort`, `active`) VALUES (5,1,NULL,'machines','Office Machines','الأجهزة المكتبية','Laminators, binders, shredders, calculators, label guns','أجهزة تغليف، تجليد، فرامات، آلات حاسبة وملصقات','/images/cat/machines.webp',4,1);
INSERT INTO `categories` (`id`, `tenant_id`, `parent_id`, `slug`, `name_en`, `name_ar`, `blurb_en`, `blurb_ar`, `image`, `sort`, `active`) VALUES (6,1,NULL,'toner','Printer Supplies','مستلزمات الطابعات','HP, Canon & Brother toners, cartridges, ribbons','أحبار HP وCanon وBrother، خراطيش وأشرطة','/images/cat/toner.webp',5,1);
INSERT INTO `categories` (`id`, `tenant_id`, `parent_id`, `slug`, `name_en`, `name_ar`, `blurb_en`, `blurb_ar`, `image`, `sort`, `active`) VALUES (7,1,NULL,'school','School & Art','المدرسة والفنون','Colours, sketch, geometry & classroom supplies','ألوان، رسم، أدوات هندسية ومستلزمات الصف','/images/cat/school.webp',6,1);
INSERT INTO `categories` (`id`, `tenant_id`, `parent_id`, `slug`, `name_en`, `name_ar`, `blurb_en`, `blurb_ar`, `image`, `sort`, `active`) VALUES (8,1,NULL,'boards','Boards & Presentation','اللوحات والعرض','Whiteboards, flip charts, markers, erasers, pins','سبورات بيضاء، لوحات ورقية، ماركرات، مساحات ودبابيس','/images/cat/boards.webp',7,1);
/*!40000 ALTER TABLE `categories` ENABLE KEYS */;
UNLOCK TABLES;
COMMIT;
SET AUTOCOMMIT=@OLD_AUTOCOMMIT;

--
-- Dumping data for table `companies`
--

SET @OLD_AUTOCOMMIT=@@AUTOCOMMIT, @@AUTOCOMMIT=0;
LOCK TABLES `companies` WRITE;
/*!40000 ALTER TABLE `companies` DISABLE KEYS */;
/*!40000 ALTER TABLE `companies` ENABLE KEYS */;
UNLOCK TABLES;
COMMIT;
SET AUTOCOMMIT=@OLD_AUTOCOMMIT;

--
-- Dumping data for table `company_users`
--

SET @OLD_AUTOCOMMIT=@@AUTOCOMMIT, @@AUTOCOMMIT=0;
LOCK TABLES `company_users` WRITE;
/*!40000 ALTER TABLE `company_users` DISABLE KEYS */;
/*!40000 ALTER TABLE `company_users` ENABLE KEYS */;
UNLOCK TABLES;
COMMIT;
SET AUTOCOMMIT=@OLD_AUTOCOMMIT;

--
-- Dumping data for table `inventory`
--

SET @OLD_AUTOCOMMIT=@@AUTOCOMMIT, @@AUTOCOMMIT=0;
LOCK TABLES `inventory` WRITE;
/*!40000 ALTER TABLE `inventory` DISABLE KEYS */;
INSERT INTO `inventory` (`product_id`, `on_hand_base`, `updated_at`) VALUES (1,84,'2026-11-18 17:00:00');
INSERT INTO `inventory` (`product_id`, `on_hand_base`, `updated_at`) VALUES (2,84,'2026-11-18 17:00:00');
INSERT INTO `inventory` (`product_id`, `on_hand_base`, `updated_at`) VALUES (3,121,'2026-11-18 17:00:00');
INSERT INTO `inventory` (`product_id`, `on_hand_base`, `updated_at`) VALUES (4,84,'2026-11-18 17:00:00');
INSERT INTO `inventory` (`product_id`, `on_hand_base`, `updated_at`) VALUES (5,84,'2026-11-18 17:00:00');
INSERT INTO `inventory` (`product_id`, `on_hand_base`, `updated_at`) VALUES (6,84,'2026-11-18 17:00:00');
INSERT INTO `inventory` (`product_id`, `on_hand_base`, `updated_at`) VALUES (7,47,'2026-11-18 17:00:00');
INSERT INTO `inventory` (`product_id`, `on_hand_base`, `updated_at`) VALUES (8,47,'2026-11-18 17:00:00');
INSERT INTO `inventory` (`product_id`, `on_hand_base`, `updated_at`) VALUES (9,121,'2026-11-18 17:00:00');
INSERT INTO `inventory` (`product_id`, `on_hand_base`, `updated_at`) VALUES (10,121,'2026-11-18 17:00:00');
INSERT INTO `inventory` (`product_id`, `on_hand_base`, `updated_at`) VALUES (11,121,'2026-11-18 17:00:00');
INSERT INTO `inventory` (`product_id`, `on_hand_base`, `updated_at`) VALUES (12,121,'2026-11-18 17:00:00');
INSERT INTO `inventory` (`product_id`, `on_hand_base`, `updated_at`) VALUES (13,121,'2026-11-18 17:00:00');
INSERT INTO `inventory` (`product_id`, `on_hand_base`, `updated_at`) VALUES (14,121,'2026-11-18 17:00:00');
INSERT INTO `inventory` (`product_id`, `on_hand_base`, `updated_at`) VALUES (15,121,'2026-11-18 17:00:00');
INSERT INTO `inventory` (`product_id`, `on_hand_base`, `updated_at`) VALUES (16,84,'2026-11-18 17:00:00');
INSERT INTO `inventory` (`product_id`, `on_hand_base`, `updated_at`) VALUES (17,84,'2026-11-18 17:00:00');
INSERT INTO `inventory` (`product_id`, `on_hand_base`, `updated_at`) VALUES (18,84,'2026-11-18 17:00:00');
/*!40000 ALTER TABLE `inventory` ENABLE KEYS */;
UNLOCK TABLES;
COMMIT;
SET AUTOCOMMIT=@OLD_AUTOCOMMIT;

--
-- Dumping data for table `orders`
--

SET @OLD_AUTOCOMMIT=@@AUTOCOMMIT, @@AUTOCOMMIT=0;
LOCK TABLES `orders` WRITE;
/*!40000 ALTER TABLE `orders` DISABLE KEYS */;
/*!40000 ALTER TABLE `orders` ENABLE KEYS */;
UNLOCK TABLES;
COMMIT;
SET AUTOCOMMIT=@OLD_AUTOCOMMIT;

--
-- Dumping data for table `price_lists`
--

SET @OLD_AUTOCOMMIT=@@AUTOCOMMIT, @@AUTOCOMMIT=0;
LOCK TABLES `price_lists` WRITE;
/*!40000 ALTER TABLE `price_lists` DISABLE KEYS */;
INSERT INTO `price_lists` (`id`, `tenant_id`, `code`, `name`, `is_default`) VALUES (1,1,'STD','Standard (SAMPLE)',1);
/*!40000 ALTER TABLE `price_lists` ENABLE KEYS */;
UNLOCK TABLES;
COMMIT;
SET AUTOCOMMIT=@OLD_AUTOCOMMIT;

--
-- Dumping data for table `prices`
--

SET @OLD_AUTOCOMMIT=@@AUTOCOMMIT, @@AUTOCOMMIT=0;
LOCK TABLES `prices` WRITE;
/*!40000 ALTER TABLE `prices` DISABLE KEYS */;
INSERT INTO `prices` (`id`, `price_list_id`, `product_unit_id`, `min_qty`, `amount_minor`) VALUES (1,1,1,1,1650);
INSERT INTO `prices` (`id`, `price_list_id`, `product_unit_id`, `min_qty`, `amount_minor`) VALUES (2,1,2,1,7900);
INSERT INTO `prices` (`id`, `price_list_id`, `product_unit_id`, `min_qty`, `amount_minor`) VALUES (3,1,3,1,3200);
INSERT INTO `prices` (`id`, `price_list_id`, `product_unit_id`, `min_qty`, `amount_minor`) VALUES (4,1,4,1,15500);
INSERT INTO `prices` (`id`, `price_list_id`, `product_unit_id`, `min_qty`, `amount_minor`) VALUES (5,1,5,1,650);
INSERT INTO `prices` (`id`, `price_list_id`, `product_unit_id`, `min_qty`, `amount_minor`) VALUES (6,1,6,1,6000);
INSERT INTO `prices` (`id`, `price_list_id`, `product_unit_id`, `min_qty`, `amount_minor`) VALUES (7,1,7,1,750);
INSERT INTO `prices` (`id`, `price_list_id`, `product_unit_id`, `min_qty`, `amount_minor`) VALUES (8,1,8,1,7000);
INSERT INTO `prices` (`id`, `price_list_id`, `product_unit_id`, `min_qty`, `amount_minor`) VALUES (9,1,9,1,900);
INSERT INTO `prices` (`id`, `price_list_id`, `product_unit_id`, `min_qty`, `amount_minor`) VALUES (10,1,10,1,16500);
INSERT INTO `prices` (`id`, `price_list_id`, `product_unit_id`, `min_qty`, `amount_minor`) VALUES (11,1,11,1,150);
INSERT INTO `prices` (`id`, `price_list_id`, `product_unit_id`, `min_qty`, `amount_minor`) VALUES (12,1,12,1,6500);
INSERT INTO `prices` (`id`, `price_list_id`, `product_unit_id`, `min_qty`, `amount_minor`) VALUES (13,1,13,1,1800);
INSERT INTO `prices` (`id`, `price_list_id`, `product_unit_id`, `min_qty`, `amount_minor`) VALUES (14,1,14,1,16500);
INSERT INTO `prices` (`id`, `price_list_id`, `product_unit_id`, `min_qty`, `amount_minor`) VALUES (15,1,15,1,450);
INSERT INTO `prices` (`id`, `price_list_id`, `product_unit_id`, `min_qty`, `amount_minor`) VALUES (16,1,16,1,4900);
INSERT INTO `prices` (`id`, `price_list_id`, `product_unit_id`, `min_qty`, `amount_minor`) VALUES (17,1,17,1,8500);
INSERT INTO `prices` (`id`, `price_list_id`, `product_unit_id`, `min_qty`, `amount_minor`) VALUES (18,1,18,1,2200);
INSERT INTO `prices` (`id`, `price_list_id`, `product_unit_id`, `min_qty`, `amount_minor`) VALUES (19,1,19,1,24500);
INSERT INTO `prices` (`id`, `price_list_id`, `product_unit_id`, `min_qty`, `amount_minor`) VALUES (20,1,20,1,300);
INSERT INTO `prices` (`id`, `price_list_id`, `product_unit_id`, `min_qty`, `amount_minor`) VALUES (21,1,21,1,5200);
INSERT INTO `prices` (`id`, `price_list_id`, `product_unit_id`, `min_qty`, `amount_minor`) VALUES (22,1,22,1,39500);
INSERT INTO `prices` (`id`, `price_list_id`, `product_unit_id`, `min_qty`, `amount_minor`) VALUES (23,1,23,1,6500);
INSERT INTO `prices` (`id`, `price_list_id`, `product_unit_id`, `min_qty`, `amount_minor`) VALUES (24,1,24,1,28500);
INSERT INTO `prices` (`id`, `price_list_id`, `product_unit_id`, `min_qty`, `amount_minor`) VALUES (25,1,25,1,31000);
INSERT INTO `prices` (`id`, `price_list_id`, `product_unit_id`, `min_qty`, `amount_minor`) VALUES (26,1,26,1,27500);
INSERT INTO `prices` (`id`, `price_list_id`, `product_unit_id`, `min_qty`, `amount_minor`) VALUES (27,1,27,1,1400);
INSERT INTO `prices` (`id`, `price_list_id`, `product_unit_id`, `min_qty`, `amount_minor`) VALUES (28,1,28,1,15000);
INSERT INTO `prices` (`id`, `price_list_id`, `product_unit_id`, `min_qty`, `amount_minor`) VALUES (29,1,29,1,2400);
INSERT INTO `prices` (`id`, `price_list_id`, `product_unit_id`, `min_qty`, `amount_minor`) VALUES (30,1,30,1,26500);
/*!40000 ALTER TABLE `prices` ENABLE KEYS */;
UNLOCK TABLES;
COMMIT;
SET AUTOCOMMIT=@OLD_AUTOCOMMIT;

--
-- Dumping data for table `processed_events`
--

SET @OLD_AUTOCOMMIT=@@AUTOCOMMIT, @@AUTOCOMMIT=0;
LOCK TABLES `processed_events` WRITE;
/*!40000 ALTER TABLE `processed_events` DISABLE KEYS */;
/*!40000 ALTER TABLE `processed_events` ENABLE KEYS */;
UNLOCK TABLES;
COMMIT;
SET AUTOCOMMIT=@OLD_AUTOCOMMIT;

--
-- Dumping data for table `product_units`
--

SET @OLD_AUTOCOMMIT=@@AUTOCOMMIT, @@AUTOCOMMIT=0;
LOCK TABLES `product_units` WRITE;
/*!40000 ALTER TABLE `product_units` DISABLE KEYS */;
INSERT INTO `product_units` (`id`, `product_id`, `unit`, `to_base`, `label_en`, `label_ar`, `min_qty`) VALUES (1,1,'ream',1,'Ream (500 sheets)','رزمة (500 ورقة)',1);
INSERT INTO `product_units` (`id`, `product_id`, `unit`, `to_base`, `label_en`, `label_ar`, `min_qty`) VALUES (2,1,'carton',5,'Carton of 5','كرتونة 5',1);
INSERT INTO `product_units` (`id`, `product_id`, `unit`, `to_base`, `label_en`, `label_ar`, `min_qty`) VALUES (3,2,'ream',1,'Ream (500 sheets)','رزمة (500 ورقة)',1);
INSERT INTO `product_units` (`id`, `product_id`, `unit`, `to_base`, `label_en`, `label_ar`, `min_qty`) VALUES (4,2,'carton',5,'Carton of 5','كرتونة 5',1);
INSERT INTO `product_units` (`id`, `product_id`, `unit`, `to_base`, `label_en`, `label_ar`, `min_qty`) VALUES (5,3,'each',1,'Each','قطعة',1);
INSERT INTO `product_units` (`id`, `product_id`, `unit`, `to_base`, `label_en`, `label_ar`, `min_qty`) VALUES (6,3,'box',10,'Box of 10','علبة 10',1);
INSERT INTO `product_units` (`id`, `product_id`, `unit`, `to_base`, `label_en`, `label_ar`, `min_qty`) VALUES (7,4,'each',1,'Each','قطعة',1);
INSERT INTO `product_units` (`id`, `product_id`, `unit`, `to_base`, `label_en`, `label_ar`, `min_qty`) VALUES (8,4,'box',10,'Box of 10','علبة 10',1);
INSERT INTO `product_units` (`id`, `product_id`, `unit`, `to_base`, `label_en`, `label_ar`, `min_qty`) VALUES (9,5,'pack',1,'Pack','عبوة',1);
INSERT INTO `product_units` (`id`, `product_id`, `unit`, `to_base`, `label_en`, `label_ar`, `min_qty`) VALUES (10,5,'carton',20,'Carton of 20','كرتونة 20',1);
INSERT INTO `product_units` (`id`, `product_id`, `unit`, `to_base`, `label_en`, `label_ar`, `min_qty`) VALUES (11,6,'each',1,'Each','قطعة',1);
INSERT INTO `product_units` (`id`, `product_id`, `unit`, `to_base`, `label_en`, `label_ar`, `min_qty`) VALUES (12,6,'box',50,'Box of 50','علبة 50',1);
INSERT INTO `product_units` (`id`, `product_id`, `unit`, `to_base`, `label_en`, `label_ar`, `min_qty`) VALUES (13,7,'pack',1,'Pack','عبوة',1);
INSERT INTO `product_units` (`id`, `product_id`, `unit`, `to_base`, `label_en`, `label_ar`, `min_qty`) VALUES (14,7,'box',10,'Box of 10','علبة 10',1);
INSERT INTO `product_units` (`id`, `product_id`, `unit`, `to_base`, `label_en`, `label_ar`, `min_qty`) VALUES (15,8,'each',1,'Each','قطعة',1);
INSERT INTO `product_units` (`id`, `product_id`, `unit`, `to_base`, `label_en`, `label_ar`, `min_qty`) VALUES (16,8,'box',12,'Box of 12','علبة 12',1);
INSERT INTO `product_units` (`id`, `product_id`, `unit`, `to_base`, `label_en`, `label_ar`, `min_qty`) VALUES (17,9,'each',1,'Each','قطعة',1);
INSERT INTO `product_units` (`id`, `product_id`, `unit`, `to_base`, `label_en`, `label_ar`, `min_qty`) VALUES (18,10,'pack',1,'Pack','عبوة',1);
INSERT INTO `product_units` (`id`, `product_id`, `unit`, `to_base`, `label_en`, `label_ar`, `min_qty`) VALUES (19,10,'box',12,'Box of 12','علبة 12',1);
INSERT INTO `product_units` (`id`, `product_id`, `unit`, `to_base`, `label_en`, `label_ar`, `min_qty`) VALUES (20,11,'box',1,'Box of 1','علبة 1',1);
INSERT INTO `product_units` (`id`, `product_id`, `unit`, `to_base`, `label_en`, `label_ar`, `min_qty`) VALUES (21,11,'carton',20,'Carton of 20','كرتونة 20',1);
INSERT INTO `product_units` (`id`, `product_id`, `unit`, `to_base`, `label_en`, `label_ar`, `min_qty`) VALUES (22,12,'each',1,'Each','قطعة',1);
INSERT INTO `product_units` (`id`, `product_id`, `unit`, `to_base`, `label_en`, `label_ar`, `min_qty`) VALUES (23,13,'each',1,'Each','قطعة',1);
INSERT INTO `product_units` (`id`, `product_id`, `unit`, `to_base`, `label_en`, `label_ar`, `min_qty`) VALUES (24,14,'each',1,'Each','قطعة',1);
INSERT INTO `product_units` (`id`, `product_id`, `unit`, `to_base`, `label_en`, `label_ar`, `min_qty`) VALUES (25,15,'each',1,'Each','قطعة',1);
INSERT INTO `product_units` (`id`, `product_id`, `unit`, `to_base`, `label_en`, `label_ar`, `min_qty`) VALUES (26,16,'each',1,'Each','قطعة',1);
INSERT INTO `product_units` (`id`, `product_id`, `unit`, `to_base`, `label_en`, `label_ar`, `min_qty`) VALUES (27,17,'pack',1,'Pack','عبوة',1);
INSERT INTO `product_units` (`id`, `product_id`, `unit`, `to_base`, `label_en`, `label_ar`, `min_qty`) VALUES (28,17,'box',12,'Box of 12','علبة 12',1);
INSERT INTO `product_units` (`id`, `product_id`, `unit`, `to_base`, `label_en`, `label_ar`, `min_qty`) VALUES (29,18,'pack',1,'Pack','عبوة',1);
INSERT INTO `product_units` (`id`, `product_id`, `unit`, `to_base`, `label_en`, `label_ar`, `min_qty`) VALUES (30,18,'box',12,'Box of 12','علبة 12',1);
/*!40000 ALTER TABLE `product_units` ENABLE KEYS */;
UNLOCK TABLES;
COMMIT;
SET AUTOCOMMIT=@OLD_AUTOCOMMIT;

--
-- Dumping data for table `products`
--

SET @OLD_AUTOCOMMIT=@@AUTOCOMMIT, @@AUTOCOMMIT=0;
LOCK TABLES `products` WRITE;
/*!40000 ALTER TABLE `products` DISABLE KEYS */;
INSERT INTO `products` (`id`, `tenant_id`, `sku`, `category_id`, `brand_id`, `name_en`, `name_ar`, `desc_en`, `desc_ar`, `aliases`, `base_unit`, `image`, `featured`, `status`, `is_sample`, `created_at`, `updated_at`) VALUES (1,1,'SL-PAP-A4-80',1,1,'A4 Copy Paper 80gsm','ورق تصوير A4 80 جم',NULL,NULL,'[\"a4\",\"copy paper\",\"printer paper\",\"ورق\",\"ورق تصوير\",\"a4 paper\"]','ream','/images/products/paper.webp',1,'published',1,'2026-11-18 17:00:00','2026-11-18 17:00:00');
INSERT INTO `products` (`id`, `tenant_id`, `sku`, `category_id`, `brand_id`, `name_en`, `name_ar`, `desc_en`, `desc_ar`, `aliases`, `base_unit`, `image`, `featured`, `status`, `is_sample`, `created_at`, `updated_at`) VALUES (2,1,'SL-PAP-A3-80',1,1,'A3 Copy Paper 80gsm','ورق تصوير A3 80 جم',NULL,NULL,'[\"a3\",\"copy paper\",\"ورق a3\"]','ream',NULL,0,'published',1,'2026-11-18 17:00:00','2026-11-18 17:00:00');
INSERT INTO `products` (`id`, `tenant_id`, `sku`, `category_id`, `brand_id`, `name_en`, `name_ar`, `desc_en`, `desc_ar`, `aliases`, `base_unit`, `image`, `featured`, `status`, `is_sample`, `created_at`, `updated_at`) VALUES (3,1,'SL-FIL-BOX-FS',2,12,'Box File, Foolscap','ملف صندوقي فولسكاب',NULL,NULL,'[\"box file\",\"lever arch\",\"ملف\",\"ملف بوكس\"]','each','/images/products/boxfile.webp',1,'published',1,'2026-11-18 17:00:00','2026-11-18 17:00:00');
INSERT INTO `products` (`id`, `tenant_id`, `sku`, `category_id`, `brand_id`, `name_en`, `name_ar`, `desc_en`, `desc_ar`, `aliases`, `base_unit`, `image`, `featured`, `status`, `is_sample`, `created_at`, `updated_at`) VALUES (4,1,'SL-FIL-RB-A4',2,11,'Ring Binder A4, 2-Ring','ملف حلقات A4 حلقتين',NULL,NULL,'[\"ring binder\",\"binder\",\"ملف حلقات\"]','each',NULL,0,'published',1,'2026-11-18 17:00:00','2026-11-18 17:00:00');
INSERT INTO `products` (`id`, `tenant_id`, `sku`, `category_id`, `brand_id`, `name_en`, `name_ar`, `desc_en`, `desc_ar`, `aliases`, `base_unit`, `image`, `featured`, `status`, `is_sample`, `created_at`, `updated_at`) VALUES (5,1,'SL-FIL-LF-A4',2,12,'L-Folder A4, Clear (12)','ملف L شفاف A4 (12)',NULL,NULL,'[\"l folder\",\"clear folder\",\"ملف شفاف\"]','pack',NULL,0,'published',1,'2026-11-18 17:00:00','2026-11-18 17:00:00');
INSERT INTO `products` (`id`, `tenant_id`, `sku`, `category_id`, `brand_id`, `name_en`, `name_ar`, `desc_en`, `desc_ar`, `aliases`, `base_unit`, `image`, `featured`, `status`, `is_sample`, `created_at`, `updated_at`) VALUES (6,1,'SL-WRI-BP-BL',3,2,'Ballpoint Pen 1.0mm, Blue','قلم حبر جاف 1.0 مم أزرق',NULL,NULL,'[\"pen\",\"ball pen\",\"biro\",\"قلم\",\"قلم أزرق\"]','each','/images/products/pens.webp',1,'published',1,'2026-11-18 17:00:00','2026-11-18 17:00:00');
INSERT INTO `products` (`id`, `tenant_id`, `sku`, `category_id`, `brand_id`, `name_en`, `name_ar`, `desc_en`, `desc_ar`, `aliases`, `base_unit`, `image`, `featured`, `status`, `is_sample`, `created_at`, `updated_at`) VALUES (7,1,'SL-WRI-HL-6',3,7,'Highlighter Set, 6 Colours','طقم أقلام تحديد 6 ألوان',NULL,NULL,'[\"highlighter\",\"marker\",\"قلم تحديد\",\"هايلايتر\"]','pack','/images/products/markers.webp',1,'published',1,'2026-11-18 17:00:00','2026-11-18 17:00:00');
INSERT INTO `products` (`id`, `tenant_id`, `sku`, `category_id`, `brand_id`, `name_en`, `name_ar`, `desc_en`, `desc_ar`, `aliases`, `base_unit`, `image`, `featured`, `status`, `is_sample`, `created_at`, `updated_at`) VALUES (8,1,'SL-WRI-CT-5',3,8,'Correction Tape 5mm','شريط تصحيح 5 مم',NULL,NULL,'[\"correction\",\"tipex\",\"white out\",\"مصحح\",\"كوريكشن\"]','each',NULL,0,'published',1,'2026-11-18 17:00:00','2026-11-18 17:00:00');
INSERT INTO `products` (`id`, `tenant_id`, `sku`, `category_id`, `brand_id`, `name_en`, `name_ar`, `desc_en`, `desc_ar`, `aliases`, `base_unit`, `image`, `featured`, `status`, `is_sample`, `created_at`, `updated_at`) VALUES (9,1,'SL-DSK-STP-HD',4,9,'Heavy-Duty Stapler, 100 Sheets','دباسة ثقيلة 100 ورقة',NULL,NULL,'[\"stapler\",\"دباسة\",\"كبس\"]','each','/images/products/stapler.webp',1,'published',1,'2026-11-18 17:00:00','2026-11-18 17:00:00');
INSERT INTO `products` (`id`, `tenant_id`, `sku`, `category_id`, `brand_id`, `name_en`, `name_ar`, `desc_en`, `desc_ar`, `aliases`, `base_unit`, `image`, `featured`, `status`, `is_sample`, `created_at`, `updated_at`) VALUES (10,1,'SL-DSK-NTS-76',4,14,'Sticky Notes 76×76, 5 Pads','أوراق لاصقة 76×76 (5 دفاتر)',NULL,NULL,'[\"sticky notes\",\"post it\",\"memo\",\"ورق لاصق\",\"بوست ات\"]','pack','/images/products/notes.webp',1,'published',1,'2026-11-18 17:00:00','2026-11-18 17:00:00');
INSERT INTO `products` (`id`, `tenant_id`, `sku`, `category_id`, `brand_id`, `name_en`, `name_ar`, `desc_en`, `desc_ar`, `aliases`, `base_unit`, `image`, `featured`, `status`, `is_sample`, `created_at`, `updated_at`) VALUES (11,1,'SL-DSK-STA-26',4,10,'Staples 26/6 (1000)','دبابيس دباسة 26/6 (1000)',NULL,NULL,'[\"staples\",\"pins\",\"دبابيس\"]','box',NULL,0,'published',1,'2026-11-18 17:00:00','2026-11-18 17:00:00');
INSERT INTO `products` (`id`, `tenant_id`, `sku`, `category_id`, `brand_id`, `name_en`, `name_ar`, `desc_en`, `desc_ar`, `aliases`, `base_unit`, `image`, `featured`, `status`, `is_sample`, `created_at`, `updated_at`) VALUES (12,1,'SL-MAC-LAM-A3',5,11,'A3 Laminator, Hot & Cold','جهاز تغليف A3 ساخن وبارد',NULL,NULL,'[\"laminator\",\"laminating\",\"تغليف\",\"لامينيتر\"]','each','/images/products/laminator.webp',1,'published',1,'2026-11-18 17:00:00','2026-11-18 17:00:00');
INSERT INTO `products` (`id`, `tenant_id`, `sku`, `category_id`, `brand_id`, `name_en`, `name_ar`, `desc_en`, `desc_ar`, `aliases`, `base_unit`, `image`, `featured`, `status`, `is_sample`, `created_at`, `updated_at`) VALUES (13,1,'SL-MAC-CAL-12',5,15,'Desktop Calculator, 12-Digit','آلة حاسبة مكتبية 12 خانة',NULL,NULL,'[\"calculator\",\"آلة حاسبة\",\"حاسبة\"]','each',NULL,0,'published',1,'2026-11-18 17:00:00','2026-11-18 17:00:00');
INSERT INTO `products` (`id`, `tenant_id`, `sku`, `category_id`, `brand_id`, `name_en`, `name_ar`, `desc_en`, `desc_ar`, `aliases`, `base_unit`, `image`, `featured`, `status`, `is_sample`, `created_at`, `updated_at`) VALUES (14,1,'SL-TON-HP-85A',6,4,'HP 85A Black Toner (CE285A)','حبر HP 85A أسود (CE285A)',NULL,NULL,'[\"toner\",\"hp 85a\",\"ce285a\",\"حبر\",\"تونر\"]','each','/images/products/toner.webp',1,'published',1,'2026-11-18 17:00:00','2026-11-18 17:00:00');
INSERT INTO `products` (`id`, `tenant_id`, `sku`, `category_id`, `brand_id`, `name_en`, `name_ar`, `desc_en`, `desc_ar`, `aliases`, `base_unit`, `image`, `featured`, `status`, `is_sample`, `created_at`, `updated_at`) VALUES (15,1,'SL-TON-CN-737',6,5,'Canon 737 Black Toner','حبر كانون 737 أسود',NULL,NULL,'[\"toner\",\"canon 737\",\"حبر كانون\"]','each',NULL,0,'published',1,'2026-11-18 17:00:00','2026-11-18 17:00:00');
INSERT INTO `products` (`id`, `tenant_id`, `sku`, `category_id`, `brand_id`, `name_en`, `name_ar`, `desc_en`, `desc_ar`, `aliases`, `base_unit`, `image`, `featured`, `status`, `is_sample`, `created_at`, `updated_at`) VALUES (16,1,'SL-BRD-WB-90',8,12,'Magnetic Whiteboard 90×120','سبورة بيضاء مغناطيسية 90×120',NULL,NULL,'[\"whiteboard\",\"board\",\"سبورة\",\"وايت بورد\"]','each',NULL,0,'published',1,'2026-11-18 17:00:00','2026-11-18 17:00:00');
INSERT INTO `products` (`id`, `tenant_id`, `sku`, `category_id`, `brand_id`, `name_en`, `name_ar`, `desc_en`, `desc_ar`, `aliases`, `base_unit`, `image`, `featured`, `status`, `is_sample`, `created_at`, `updated_at`) VALUES (17,1,'SL-BRD-WBM-4',8,8,'Whiteboard Markers, 4 Colours','ماركر سبورة 4 ألوان',NULL,NULL,'[\"whiteboard marker\",\"wb marker\",\"ماركر سبورة\"]','pack',NULL,0,'published',1,'2026-11-18 17:00:00','2026-11-18 17:00:00');
INSERT INTO `products` (`id`, `tenant_id`, `sku`, `category_id`, `brand_id`, `name_en`, `name_ar`, `desc_en`, `desc_ar`, `aliases`, `base_unit`, `image`, `featured`, `status`, `is_sample`, `created_at`, `updated_at`) VALUES (18,1,'SL-SCH-CP-24',7,2,'Colour Pencils, 24','أقلام تلوين 24 لون',NULL,NULL,'[\"colour pencils\",\"color pencils\",\"crayons\",\"ألوان خشبية\",\"أقلام تلوين\"]','pack',NULL,0,'published',1,'2026-11-18 17:00:00','2026-11-18 17:00:00');
/*!40000 ALTER TABLE `products` ENABLE KEYS */;
UNLOCK TABLES;
COMMIT;
SET AUTOCOMMIT=@OLD_AUTOCOMMIT;

--
-- Dumping data for table `quote_versions`
--

SET @OLD_AUTOCOMMIT=@@AUTOCOMMIT, @@AUTOCOMMIT=0;
LOCK TABLES `quote_versions` WRITE;
/*!40000 ALTER TABLE `quote_versions` DISABLE KEYS */;
/*!40000 ALTER TABLE `quote_versions` ENABLE KEYS */;
UNLOCK TABLES;
COMMIT;
SET AUTOCOMMIT=@OLD_AUTOCOMMIT;

--
-- Dumping data for table `quotes`
--

SET @OLD_AUTOCOMMIT=@@AUTOCOMMIT, @@AUTOCOMMIT=0;
LOCK TABLES `quotes` WRITE;
/*!40000 ALTER TABLE `quotes` DISABLE KEYS */;
/*!40000 ALTER TABLE `quotes` ENABLE KEYS */;
UNLOCK TABLES;
COMMIT;
SET AUTOCOMMIT=@OLD_AUTOCOMMIT;

--
-- Dumping data for table `tenants`
--

SET @OLD_AUTOCOMMIT=@@AUTOCOMMIT, @@AUTOCOMMIT=0;
LOCK TABLES `tenants` WRITE;
/*!40000 ALTER TABLE `tenants` DISABLE KEYS */;
INSERT INTO `tenants` (`id`, `slug`, `name`, `currency`, `vat_rate`, `created_at`) VALUES (1,'slst','Super Link Stationary Trading LLC','AED',0.0500,'2026-11-18 17:00:00');
/*!40000 ALTER TABLE `tenants` ENABLE KEYS */;
UNLOCK TABLES;
COMMIT;
SET AUTOCOMMIT=@OLD_AUTOCOMMIT;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*M!100616 SET NOTE_VERBOSITY=@OLD_NOTE_VERBOSITY */;

-- Dump completed on 2026-11-18 17:25:32
