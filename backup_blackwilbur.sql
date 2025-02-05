/*!999999\- enable the sandbox mode */ 
-- MariaDB dump 10.19  Distrib 10.11.8-MariaDB, for debian-linux-gnu (x86_64)
--
-- Host: 145.223.22.231    Database: blackwilbur
-- ------------------------------------------------------
-- Server version	10.11.8-MariaDB-0ubuntu0.24.04.1

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `auth_group`
--

DROP TABLE IF EXISTS `auth_group`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `auth_group` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(150) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `name` (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `auth_group`
--

LOCK TABLES `auth_group` WRITE;
/*!40000 ALTER TABLE `auth_group` DISABLE KEYS */;
/*!40000 ALTER TABLE `auth_group` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `auth_group_permissions`
--

DROP TABLE IF EXISTS `auth_group_permissions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `auth_group_permissions` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `group_id` int(11) NOT NULL,
  `permission_id` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `auth_group_permissions_group_id_permission_id_0cd325b0_uniq` (`group_id`,`permission_id`),
  KEY `auth_group_permissio_permission_id_84c5c92e_fk_auth_perm` (`permission_id`),
  CONSTRAINT `auth_group_permissio_permission_id_84c5c92e_fk_auth_perm` FOREIGN KEY (`permission_id`) REFERENCES `auth_permission` (`id`),
  CONSTRAINT `auth_group_permissions_group_id_b120cbf9_fk_auth_group_id` FOREIGN KEY (`group_id`) REFERENCES `auth_group` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `auth_group_permissions`
--

LOCK TABLES `auth_group_permissions` WRITE;
/*!40000 ALTER TABLE `auth_group_permissions` DISABLE KEYS */;
/*!40000 ALTER TABLE `auth_group_permissions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `auth_permission`
--

DROP TABLE IF EXISTS `auth_permission`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `auth_permission` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `content_type_id` int(11) NOT NULL,
  `codename` varchar(100) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `auth_permission_content_type_id_codename_01ab375a_uniq` (`content_type_id`,`codename`),
  CONSTRAINT `auth_permission_content_type_id_2f476e4b_fk_django_co` FOREIGN KEY (`content_type_id`) REFERENCES `django_content_type` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=77 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `auth_permission`
--

LOCK TABLES `auth_permission` WRITE;
/*!40000 ALTER TABLE `auth_permission` DISABLE KEYS */;
INSERT INTO `auth_permission` VALUES
(1,'Can add log entry',1,'add_logentry'),
(2,'Can change log entry',1,'change_logentry'),
(3,'Can delete log entry',1,'delete_logentry'),
(4,'Can view log entry',1,'view_logentry'),
(5,'Can add permission',2,'add_permission'),
(6,'Can change permission',2,'change_permission'),
(7,'Can delete permission',2,'delete_permission'),
(8,'Can view permission',2,'view_permission'),
(9,'Can add group',3,'add_group'),
(10,'Can change group',3,'change_group'),
(11,'Can delete group',3,'delete_group'),
(12,'Can view group',3,'view_group'),
(13,'Can add content type',4,'add_contenttype'),
(14,'Can change content type',4,'change_contenttype'),
(15,'Can delete content type',4,'delete_contenttype'),
(16,'Can view content type',4,'view_contenttype'),
(17,'Can add session',5,'add_session'),
(18,'Can change session',5,'change_session'),
(19,'Can delete session',5,'delete_session'),
(20,'Can view session',5,'view_session'),
(21,'Can add category',6,'add_category'),
(22,'Can change category',6,'change_category'),
(23,'Can delete category',6,'delete_category'),
(24,'Can view category',6,'view_category'),
(25,'Can add Discount',7,'add_discount'),
(26,'Can change Discount',7,'change_discount'),
(27,'Can delete Discount',7,'delete_discount'),
(28,'Can view Discount',7,'view_discount'),
(29,'Can add distribution partnership',8,'add_distributionpartnership'),
(30,'Can change distribution partnership',8,'change_distributionpartnership'),
(31,'Can delete distribution partnership',8,'delete_distributionpartnership'),
(32,'Can view distribution partnership',8,'view_distributionpartnership'),
(33,'Can add image',9,'add_image'),
(34,'Can change image',9,'change_image'),
(35,'Can delete image',9,'delete_image'),
(36,'Can view image',9,'view_image'),
(37,'Can add newsletter subscription',10,'add_newslettersubscription'),
(38,'Can change newsletter subscription',10,'change_newslettersubscription'),
(39,'Can delete newsletter subscription',10,'delete_newslettersubscription'),
(40,'Can view newsletter subscription',10,'view_newslettersubscription'),
(41,'Can add product variation',11,'add_productvariation'),
(42,'Can change product variation',11,'change_productvariation'),
(43,'Can delete product variation',11,'delete_productvariation'),
(44,'Can view product variation',11,'view_productvariation'),
(45,'Can add user',12,'add_user'),
(46,'Can change user',12,'change_user'),
(47,'Can delete user',12,'delete_user'),
(48,'Can view user',12,'view_user'),
(49,'Can add cart',13,'add_cart'),
(50,'Can change cart',13,'change_cart'),
(51,'Can delete cart',13,'delete_cart'),
(52,'Can view cart',13,'view_cart'),
(53,'Can add order',14,'add_order'),
(54,'Can change order',14,'change_order'),
(55,'Can delete order',14,'delete_order'),
(56,'Can view order',14,'view_order'),
(57,'Can add product',15,'add_product'),
(58,'Can change product',15,'change_product'),
(59,'Can delete product',15,'delete_product'),
(60,'Can view product',15,'view_product'),
(61,'Can add order item',16,'add_orderitem'),
(62,'Can change order item',16,'change_orderitem'),
(63,'Can delete order item',16,'delete_orderitem'),
(64,'Can view order item',16,'view_orderitem'),
(65,'Can add cart item',17,'add_cartitem'),
(66,'Can change cart item',17,'change_cartitem'),
(67,'Can delete cart item',17,'delete_cartitem'),
(68,'Can view cart item',17,'view_cartitem'),
(69,'Can add rating',18,'add_rating'),
(70,'Can change rating',18,'change_rating'),
(71,'Can delete rating',18,'delete_rating'),
(72,'Can view rating',18,'view_rating'),
(73,'Can add wishlist',19,'add_wishlist'),
(74,'Can change wishlist',19,'change_wishlist'),
(75,'Can delete wishlist',19,'delete_wishlist'),
(76,'Can view wishlist',19,'view_wishlist');
/*!40000 ALTER TABLE `auth_permission` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `blackwilbur_cart`
--

DROP TABLE IF EXISTS `blackwilbur_cart`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `blackwilbur_cart` (
  `id` uuid NOT NULL,
  `user_id` uuid NOT NULL,
  PRIMARY KEY (`id`),
  KEY `blackwilbur_cart_user_id_55fb36bc_fk_blackwilbur_user_id` (`user_id`),
  CONSTRAINT `blackwilbur_cart_user_id_55fb36bc_fk_blackwilbur_user_id` FOREIGN KEY (`user_id`) REFERENCES `blackwilbur_user` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `blackwilbur_cart`
--

LOCK TABLES `blackwilbur_cart` WRITE;
/*!40000 ALTER TABLE `blackwilbur_cart` DISABLE KEYS */;
/*!40000 ALTER TABLE `blackwilbur_cart` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `blackwilbur_cartitem`
--

DROP TABLE IF EXISTS `blackwilbur_cartitem`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `blackwilbur_cartitem` (
  `id` uuid NOT NULL,
  `quantity` int(10) unsigned NOT NULL CHECK (`quantity` >= 0),
  `cart_id` uuid NOT NULL,
  `product_id` uuid NOT NULL,
  `product_variation_id` uuid NOT NULL,
  PRIMARY KEY (`id`),
  KEY `blackwilbur_cartitem_cart_id_75b4ce17_fk_blackwilbur_cart_id` (`cart_id`),
  KEY `blackwilbur_cartitem_product_id_0bdef58a_fk_blackwilb` (`product_id`),
  KEY `blackwilbur_cartitem_product_variation_id_38411ef2_fk_blackwilb` (`product_variation_id`),
  CONSTRAINT `blackwilbur_cartitem_cart_id_75b4ce17_fk_blackwilbur_cart_id` FOREIGN KEY (`cart_id`) REFERENCES `blackwilbur_cart` (`id`),
  CONSTRAINT `blackwilbur_cartitem_product_id_0bdef58a_fk_blackwilb` FOREIGN KEY (`product_id`) REFERENCES `blackwilbur_product` (`id`),
  CONSTRAINT `blackwilbur_cartitem_product_variation_id_38411ef2_fk_blackwilb` FOREIGN KEY (`product_variation_id`) REFERENCES `blackwilbur_productvariation` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `blackwilbur_cartitem`
--

LOCK TABLES `blackwilbur_cartitem` WRITE;
/*!40000 ALTER TABLE `blackwilbur_cartitem` DISABLE KEYS */;
/*!40000 ALTER TABLE `blackwilbur_cartitem` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `blackwilbur_category`
--

DROP TABLE IF EXISTS `blackwilbur_category`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `blackwilbur_category` (
  `id` uuid NOT NULL,
  `name` varchar(255) NOT NULL,
  `description` longtext NOT NULL,
  `created_at` datetime(6) NOT NULL,
  `updated_at` datetime(6) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `name` (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `blackwilbur_category`
--

LOCK TABLES `blackwilbur_category` WRITE;
/*!40000 ALTER TABLE `blackwilbur_category` DISABLE KEYS */;
INSERT INTO `blackwilbur_category` VALUES
('a0288216-a26b-4ec3-8dca-e7db4754c702','Round Neck','Round neck t-shirt','2024-11-12 07:12:59.631906','2024-11-12 07:12:59.631932'),
('502b45ac-a740-4406-866d-ee2154895072','Knitted','Knitted t-shirt','2024-11-12 07:13:11.290033','2024-11-12 07:13:11.290055');
/*!40000 ALTER TABLE `blackwilbur_category` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `blackwilbur_discount`
--

DROP TABLE IF EXISTS `blackwilbur_discount`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `blackwilbur_discount` (
  `id` uuid NOT NULL,
  `coupon` varchar(50) DEFAULT NULL,
  `percent_discount` decimal(5,2) NOT NULL,
  `min_order_price` decimal(10,2) DEFAULT NULL,
  `created_at` datetime(6) NOT NULL,
  `updated_at` datetime(6) NOT NULL,
  `discount_type` varchar(10) NOT NULL,
  `quantity_threshold` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `coupon` (`coupon`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `blackwilbur_discount`
--

LOCK TABLES `blackwilbur_discount` WRITE;
/*!40000 ALTER TABLE `blackwilbur_discount` DISABLE KEYS */;
INSERT INTO `blackwilbur_discount` VALUES
('d7b8f191-7f7e-4e67-b2a1-61a6d8a1ff42',NULL,15.00,NULL,'2024-11-12 08:33:55.258547','2024-11-12 08:33:55.258565','QUANTITY',2),
('800f8491-16b5-47b8-bb38-bc2f0d9dd7db','',30.00,1000.00,'2024-11-12 08:33:55.258547','2024-11-12 08:33:55.258565','QUANTITY',3),
('aea31f48-5fa4-4052-94d7-fc7df67d777b','New20',20.00,1000.00,'2024-11-12 08:58:53.837085','2024-11-12 08:58:53.837108','COUPON',NULL);
/*!40000 ALTER TABLE `blackwilbur_discount` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `blackwilbur_distributionpartnership`
--

DROP TABLE IF EXISTS `blackwilbur_distributionpartnership`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `blackwilbur_distributionpartnership` (
  `id` uuid NOT NULL,
  `email` varchar(255) DEFAULT NULL,
  `phone` varchar(12) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `blackwilbur_distributionpartnership`
--

LOCK TABLES `blackwilbur_distributionpartnership` WRITE;
/*!40000 ALTER TABLE `blackwilbur_distributionpartnership` DISABLE KEYS */;
/*!40000 ALTER TABLE `blackwilbur_distributionpartnership` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `blackwilbur_image`
--

DROP TABLE IF EXISTS `blackwilbur_image`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `blackwilbur_image` (
  `id` uuid NOT NULL,
  `product_id` varchar(100) DEFAULT NULL,
  `image_url` longtext DEFAULT NULL,
  `image_type` varchar(20) NOT NULL,
  `created_at` datetime(6) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `blackwilbur_image`
--

LOCK TABLES `blackwilbur_image` WRITE;
/*!40000 ALTER TABLE `blackwilbur_image` DISABLE KEYS */;
INSERT INTO `blackwilbur_image` VALUES
('2fcc8c30-a0ea-4c16-9408-02734193a071','2b434338-28f2-4bdd-a358-4d8113be6ff7','https://blackwilbur.blob.core.windows.net/blackwilbur-image/bw-contrast-rib-polo/856161a3-f1ad-4823-8ca2-90a1ed98988e.jpg','product','2024-11-12 07:23:40.065249'),
('922e584a-e863-47f4-9f0b-032fbbef37d5','8aed539e-373a-42df-bc77-0ca0c36f5946','https://blackwilbur.blob.core.windows.net/blackwilbur-image/black-wilbur-contrast-collar-full-sleeve-polo/c7a2b7a2-3353-4e8f-af73-5adf93d7a8b2.jpg','product','2024-11-12 08:04:29.513846'),
('d8b2f343-dd16-4685-99e7-074f4f06cacb','feb9d193-b991-4be5-8a15-d02a3bf07b0b','https://blackwilbur.blob.core.windows.net/blackwilbur-image/bw-streak-knitted-polo/6a9f52ff-021e-4eda-ae92-cb7f8de26b47.jpg','product','2024-11-12 07:16:57.836863'),
('aa8d69cd-8d9a-4cd0-a6ed-0ba25231dbe1','4e64b45a-890a-48ed-ae1e-bdbe93434c50','https://blackwilbur.blob.core.windows.net/blackwilbur-image/bw-sophisticated-polo/60c52174-76a3-4406-80af-c7bd4152f04d.jpg','product','2024-11-12 07:21:40.728030'),
('5312619d-5580-4ee2-a4e2-113f53c2bb88','4de3ca11-3f7c-44af-b7ad-cbc92d97bbc2','https://blackwilbur.blob.core.windows.net/blackwilbur-image/bw wavy knit polo/58886401-8ce1-4588-a220-a77a292d1d20.jpg','product','2024-11-12 08:08:21.967359'),
('4d302c5c-ef86-415f-ae64-13635325ff2b','4af3369c-a41e-4ada-9130-e835ca50a328','https://blackwilbur.blob.core.windows.net/blackwilbur-image/black-wilbur-bar-knitted-shirt/c336da78-5e00-498d-9e33-ac58f2fbb478.jpg','product','2024-11-12 08:01:05.394714'),
('9c066a79-742c-4ea7-bffa-202d9f0d0278','94ea7a22-e815-454c-8408-52738b3e5664','https://blackwilbur.blob.core.windows.net/blackwilbur-image/black-wilbur-solid-polo/cb4e4084-e35f-404e-b31b-174ce2f3230d.jpg','product','2024-11-12 07:22:42.734906'),
('798c738b-a0e6-4932-9f6e-2035aaf76748','2b434338-28f2-4bdd-a358-4d8113be6ff7','https://blackwilbur.blob.core.windows.net/blackwilbur-image/bw-contrast-rib-polo/b2e5d7fe-2b46-4321-b152-9b90493d050a.jpg','product','2024-11-12 07:23:41.201556'),
('d7e6ccf9-94c7-4f6d-8a91-25f9555f14b2','0d7ae5c1-1202-430e-8179-7edc3f34a93f','https://blackwilbur.blob.core.windows.net/blackwilbur-image/black-wilbur-crossbar-zip-polo/92bdbd6d-c9fe-48dd-9d07-8e59e8a50103.jpg','product','2024-11-12 07:19:37.402994'),
('ab12c5bd-4ee5-4e2b-a3fd-286751c511e8','09bd2a23-ccaf-43f1-974f-7d09ddf52486','https://blackwilbur.blob.core.windows.net/blackwilbur-image/bw-binate-knit-tee/8b36d41c-5827-4d58-9c89-7d9e84da3414.jpg','product','2024-11-12 08:01:55.414584'),
('d27504dc-8b64-4ad1-ab20-2b303181e8df','5a70e7ef-c553-4b7a-899c-5ea558758292','https://blackwilbur.blob.core.windows.net/blackwilbur-image/bw-bars-knitted-shirt/1d24a684-1b60-463d-991f-73591917bf20.jpg','product','2024-11-12 07:18:09.157192'),
('e5061542-cbb3-4912-8375-2cbd54bb9b95','5f54314d-78be-44d7-a888-67cee5704d6d','https://blackwilbur.blob.core.windows.net/blackwilbur-image/the-og-bw-tee/121df457-2cc4-449e-a012-483f70c9a126.jpg','product','2024-11-12 08:22:20.008612'),
('5505e031-0b5e-49d8-8a38-2dd636ca068a','5a70e7ef-c553-4b7a-899c-5ea558758292','https://blackwilbur.blob.core.windows.net/blackwilbur-image/bw-bars-knitted-shirt/68f06181-d982-4889-9583-4dc710581390.jpg','product','2024-11-12 07:18:08.980692'),
('855a1f54-226d-4f41-960a-2e19aedbc1db','b50cb239-8e28-428b-ae98-81e1d2d7d900','https://blackwilbur.blob.core.windows.net/blackwilbur-image/black-wilbur-ramp-tee/-black-wilbur-gradient-tee/5371216d-22da-40b5-ae89-ba29237e41e0.jpg','product','2024-11-12 08:22:38.660826'),
('03af2754-356e-4ea1-b115-2eafd40084a2','2b434338-28f2-4bdd-a358-4d8113be6ff7','https://blackwilbur.blob.core.windows.net/blackwilbur-image/bw-contrast-rib-polo/6d7d4bc6-7aa9-4b85-8b38-dd69207fef3e.jpg','product','2024-11-12 07:23:37.545562'),
('e2c5f43f-8602-4432-96b3-3024f542daf6','b50cb239-8e28-428b-ae98-81e1d2d7d900','https://blackwilbur.blob.core.windows.net/blackwilbur-image/black-wilbur-ramp-tee/-black-wilbur-gradient-tee/3c6bf932-d714-4cb3-8a3b-291a9b642be7.jpg','product','2024-11-12 08:22:37.953669'),
('71de093d-b6c2-4e49-a87f-3bb83ce64da4','e39594fd-4154-409f-a7c7-d4d11dca7ce1','https://blackwilbur.blob.core.windows.net/blackwilbur-image/bw-regular-knit-polo/7c556899-d466-4fb0-9c25-13a9b9b088ff.jpg','product','2024-11-12 08:00:24.313545'),
('e6a25b97-9f68-437d-99ac-3bd79dfe3752','2b434338-28f2-4bdd-a358-4d8113be6ff7','https://blackwilbur.blob.core.windows.net/blackwilbur-image/bw-contrast-rib-polo/ca2f8716-7395-4d72-ad26-3467bac6928a.jpg','product','2024-11-12 07:23:37.926795'),
('3772cab2-1fff-4d1c-849c-4453c5c3a745','5f54314d-78be-44d7-a888-67cee5704d6d','https://blackwilbur.blob.core.windows.net/blackwilbur-image/the-og-bw-tee/098487d8-8974-453e-b4e7-afc49844f116.jpg','product','2024-11-12 08:22:20.786645'),
('e601c14a-aa76-4a7a-98cb-455099af30e6','4911204f-3201-4470-9f54-f43c7ae1a832','https://blackwilbur.blob.core.windows.net/blackwilbur-image/bw-bar-knit-polo/15f32b5a-6195-444b-9745-f367b51259b4.jpg','product','2024-11-12 08:03:49.956087'),
('3ad6aa9b-51aa-4871-bd0a-466ee34fa6d5','7a9f755a-f034-4164-ba96-5d7d80980f4f','https://blackwilbur.blob.core.windows.net/blackwilbur-image/bw-bold tee/050b94a6-e6ef-46d4-a0c7-2e6d936c5bc8.jpg','product','2024-11-12 08:27:27.055235'),
('6570c2d8-b562-4c8a-82d4-47669781e2b0','dd25927e-e33f-427d-866e-97b56b0a02d2','https://blackwilbur.blob.core.windows.net/blackwilbur-image/bw-trippy teddy tee/dc0fdc1a-6955-48b0-9b5d-59f8df67468f.jpg','product','2024-11-12 08:25:23.280524'),
('47f0fa87-3c04-4615-850f-4ba374a4345e','09bd2a23-ccaf-43f1-974f-7d09ddf52486','https://blackwilbur.blob.core.windows.net/blackwilbur-image/bw-binate-knit-tee/7dada56e-7470-459b-932c-791c0331a5af.jpg','product','2024-11-12 08:01:55.785072'),
('fa1aefe2-6b17-4585-9230-4c21cb87ef53','7a9f755a-f034-4164-ba96-5d7d80980f4f','https://blackwilbur.blob.core.windows.net/blackwilbur-image/bw-bold tee/4bedaf2a-c406-4a40-a28f-fbec0c5aaf14.jpg','product','2024-11-12 08:27:27.142473'),
('e7e9c93a-6485-4310-8331-4cb72f44f6a4','7a9f755a-f034-4164-ba96-5d7d80980f4f','https://blackwilbur.blob.core.windows.net/blackwilbur-image/bw-bold tee/3a30d303-6ffb-4bc7-8af6-90eea3fc47ad.jpg','product','2024-11-12 08:27:26.891032'),
('5557cb5a-96ef-41e5-b9d9-4cbe57b5b4dc','0d165e31-b554-4535-b3fc-d8996a357921','https://blackwilbur.blob.core.windows.net/blackwilbur-image/black-wilbur-distinct-knitted-shirt/c002e792-f908-4866-b6d3-d307747df815.jpg','product','2024-11-12 08:05:15.417364'),
('efcab1ea-ba3f-477b-bc68-4d4f16187a74','e9ce2024-8349-4a3b-89d5-a15d9b52b539','https://blackwilbur.blob.core.windows.net/blackwilbur-image/black-wilbur-delusional-tee/89bb094b-4fba-4f83-989a-6d0a051e8337.jpg','product','2024-11-12 08:15:33.572812'),
('aeb6d536-a3f6-4fb2-a9af-4ed75633b341','2b434338-28f2-4bdd-a358-4d8113be6ff7','https://blackwilbur.blob.core.windows.net/blackwilbur-image/bw-contrast-rib-polo/fe9bbb6d-62e6-492f-97ff-ba5c16e7c805.jpg','product','2024-11-12 07:23:42.658853'),
('69e2a994-3242-49f4-a6cc-4ee064114458','6a4645a1-1ac7-47b9-b2d6-8e88137ec9b5','https://blackwilbur.blob.core.windows.net/blackwilbur-image/bw-bold-tee/185b49a0-c2e8-4783-8772-cd7c8dbc37bd.jpg','product','2024-11-12 08:14:05.680065'),
('671146b5-d45a-4d2a-9003-4f0c86cdfc80','5eaa8f65-a7a0-44c7-a9e2-5ab651c60bec','https://blackwilbur.blob.core.windows.net/blackwilbur-image/bw-bar-knit-full-sleeve-polo/945ddb0c-0ace-4d4e-9fb3-c94a91ffa187.jpg','product','2024-11-12 08:06:11.388329'),
('8c5c9139-74b3-46a2-b0ce-4f89885bc4f8','4dacb68d-2d34-4eb8-9e82-418b012ab58a','https://blackwilbur.blob.core.windows.net/blackwilbur-image/black-wilbur-dorsal-tee/-black-wilbur-snakescale-tee/10b71ba6-c3b3-4777-b782-c835e177c9da.jpg','product','2024-11-12 08:14:44.581501'),
('69994a18-c016-4abd-b3ab-515501a63628','4dacb68d-2d34-4eb8-9e82-418b012ab58a','https://blackwilbur.blob.core.windows.net/blackwilbur-image/black-wilbur-dorsal-tee/-black-wilbur-snakescale-tee/36177257-290c-4a6b-8202-90e8967aa3c9.jpg','product','2024-11-12 08:14:43.838992'),
('bbf69c7c-7449-4cda-8612-53655333978d','4de3ca11-3f7c-44af-b7ad-cbc92d97bbc2','https://blackwilbur.blob.core.windows.net/blackwilbur-image/bw wavy knit polo/d57e247b-59a0-42a1-868b-8037dbd2a9bf.jpg','product','2024-11-12 08:08:21.688811'),
('bdecaef6-5ce5-4aa3-b0af-57d1fce4f9b1','09bd2a23-ccaf-43f1-974f-7d09ddf52486','https://blackwilbur.blob.core.windows.net/blackwilbur-image/bw-binate-knit-tee/13a79ef2-3c3f-4081-9669-c42b4ebcea13.jpg','product','2024-11-12 08:01:55.600921'),
('6b0da28f-b4ca-44b5-8171-5f92c5d8ff8d','feb9d193-b991-4be5-8a15-d02a3bf07b0b','https://blackwilbur.blob.core.windows.net/blackwilbur-image/bw-streak-knitted-polo/1fa59918-4f37-4dfe-9394-f9f8be98a2e2.jpg','product','2024-11-12 07:16:57.767241'),
('3313fc16-cb8d-4d4f-991b-606bd7662f18','3c163aa9-a1b4-41e1-85f2-8d199d283210','https://blackwilbur.blob.core.windows.net/blackwilbur-image/bw-crossbar-knit-polo/bde07f93-7e2a-439c-b233-7bf3bf5ed0fb.jpg','product','2024-11-12 08:03:13.596246'),
('09e2edba-45b4-4617-9451-62481906b560','4911204f-3201-4470-9f54-f43c7ae1a832','https://blackwilbur.blob.core.windows.net/blackwilbur-image/bw-bar-knit-polo/30380712-c5cd-44e2-bdba-24bb0eecf431.jpg','product','2024-11-12 08:03:49.646335'),
('1529c970-a906-4188-9733-6b4995af8959','d6d99337-5ae2-4551-8bdf-393ad58cd7aa','https://blackwilbur.blob.core.windows.net/blackwilbur-image/black-wilbur-bunny-tee/05e34aac-c962-4e44-aa99-7e39228bbfd0.jpg','product','2024-11-12 08:23:44.709754'),
('3db2937d-fbaa-4c51-9b03-7484518a94fe','5eaa8f65-a7a0-44c7-a9e2-5ab651c60bec','https://blackwilbur.blob.core.windows.net/blackwilbur-image/bw-bar-knit-full-sleeve-polo/1faeb4fb-7cab-4b32-9b4b-f7b746c16601.jpg','product','2024-11-12 08:06:11.622223'),
('d5596041-24c2-42fe-b08a-79d7abaa019b','5f54314d-78be-44d7-a888-67cee5704d6d','https://blackwilbur.blob.core.windows.net/blackwilbur-image/the-og-bw-tee/40aaf0a3-7980-42d5-bc33-3caefb9a88d8.jpg','product','2024-11-12 08:22:20.685237'),
('5a4c67c2-84a9-4ed8-abe3-7e3f19e792a2','2b434338-28f2-4bdd-a358-4d8113be6ff7','https://blackwilbur.blob.core.windows.net/blackwilbur-image/bw-contrast-rib-polo/45c4678a-2cd3-4b95-a38f-90ef27ae8af4.jpg','product','2024-11-12 07:23:38.455178'),
('dc1082a8-bbaa-44d8-9d39-7ee905f0f2e6','e9ce2024-8349-4a3b-89d5-a15d9b52b539','https://blackwilbur.blob.core.windows.net/blackwilbur-image/black-wilbur-delusional-tee/8f889319-314f-4eb1-ada4-3ab1616e7f37.jpg','product','2024-11-12 08:15:24.282554'),
('3866c701-26c8-4a8f-9a65-817bd4eaec3e','8aed539e-373a-42df-bc77-0ca0c36f5946','https://blackwilbur.blob.core.windows.net/blackwilbur-image/black-wilbur-contrast-collar-full-sleeve-polo/598246cc-affd-4eec-a0f6-0dd9611f85f1.jpg','product','2024-11-12 08:04:29.488829'),
('567e4cc5-b082-45a3-a6d0-81f131b0b099','dd25927e-e33f-427d-866e-97b56b0a02d2','https://blackwilbur.blob.core.windows.net/blackwilbur-image/bw-trippy teddy tee/0c72cf71-0a32-4a66-92a0-9ab5501edf4a.jpg','product','2024-11-12 08:25:24.644618'),
('1afc2e12-8326-452f-ae0a-851179264778','4af3369c-a41e-4ada-9130-e835ca50a328','https://blackwilbur.blob.core.windows.net/blackwilbur-image/black-wilbur-bar-knitted-shirt/eb87dc76-376e-4fd9-aa1a-5ab537e6b1d3.jpg','product','2024-11-12 08:01:05.714857'),
('840d9ddd-e22e-4dc4-ba2b-861f81fb1ea8','3c163aa9-a1b4-41e1-85f2-8d199d283210','https://blackwilbur.blob.core.windows.net/blackwilbur-image/bw-crossbar-knit-polo/feadcb8c-59fc-496b-b8f1-c903c3a029b3.jpg','product','2024-11-12 08:03:13.286881'),
('8466d8d6-d171-4e14-bdc5-8837aa49201f','4de3ca11-3f7c-44af-b7ad-cbc92d97bbc2','https://blackwilbur.blob.core.windows.net/blackwilbur-image/bw wavy knit polo/6b1ac676-ff05-4a1c-ad75-3b0e9ee6d6e3.jpg','product','2024-11-12 08:08:22.207444'),
('30930144-0f55-4438-ac64-92fbd1c54e3b','0d7ae5c1-1202-430e-8179-7edc3f34a93f','https://blackwilbur.blob.core.windows.net/blackwilbur-image/black-wilbur-crossbar-zip-polo/ba9d9455-7b50-41ce-8c7c-d8e2cf812fe1.jpg','product','2024-11-12 07:19:35.380150'),
('8fa78182-41b0-4f06-bf17-966ccf2be3d8','5f54314d-78be-44d7-a888-67cee5704d6d','https://blackwilbur.blob.core.windows.net/blackwilbur-image/the-og-bw-tee/12810099-3f5a-4610-a4e6-e6c1149e9c72.jpg','product','2024-11-12 08:22:20.731396'),
('f7d214ac-0d0c-4f74-8c0a-9abd8e190962','0d165e31-b554-4535-b3fc-d8996a357921','https://blackwilbur.blob.core.windows.net/blackwilbur-image/black-wilbur-distinct-knitted-shirt/e45ae4ca-11e6-4673-b387-13fe05382e91.jpg','product','2024-11-12 08:05:15.967795'),
('11df04a9-5b37-4ce8-93bb-a0cf4dab9723','e9ce2024-8349-4a3b-89d5-a15d9b52b539','https://blackwilbur.blob.core.windows.net/blackwilbur-image/black-wilbur-delusional-tee/7e8738d7-731e-4eb7-ba22-ea43589ead45.jpg','product','2024-11-12 08:15:32.890682'),
('b3598e4d-638b-421d-af6a-a57600b5475a','e39594fd-4154-409f-a7c7-d4d11dca7ce1','https://blackwilbur.blob.core.windows.net/blackwilbur-image/bw-regular-knit-polo/c4ad2261-5add-4235-8eec-51f49b9b1ead.jpg','product','2024-11-12 08:00:25.205058'),
('5d268631-cf74-4616-aae2-a5924264e031','57497d26-d3b4-4ca3-ade6-999d24e91d29','https://blackwilbur.blob.core.windows.net/blackwilbur-image/black-wilbur-bold-tee/354731f4-197d-4322-b5b8-5b3b8da6906f.jpg','product','2024-11-12 08:20:59.622018'),
('c26547aa-17d8-4b13-991e-a8fcd86c6726','4af3369c-a41e-4ada-9130-e835ca50a328','https://blackwilbur.blob.core.windows.net/blackwilbur-image/black-wilbur-bar-knitted-shirt/459f909c-af54-4913-a536-88e212517b73.jpg','product','2024-11-12 08:01:05.224288'),
('a78cfc5e-5c66-4bda-be75-aaac9595147f','0d7ae5c1-1202-430e-8179-7edc3f34a93f','https://blackwilbur.blob.core.windows.net/blackwilbur-image/black-wilbur-crossbar-zip-polo/44eb15ed-7cb3-4b7a-b3db-93e5e7b76885.jpg','product','2024-11-12 07:19:37.138609'),
('f6389b91-f309-479b-9975-b13c9c77b29a','dd25927e-e33f-427d-866e-97b56b0a02d2','https://blackwilbur.blob.core.windows.net/blackwilbur-image/bw-trippy teddy tee/f3ac9461-250a-4182-bf0f-051411cb3863.jpg','product','2024-11-12 08:25:24.230295'),
('17e426bd-2c56-4ec9-ae00-b3b54a50aa81','57497d26-d3b4-4ca3-ade6-999d24e91d29','https://blackwilbur.blob.core.windows.net/blackwilbur-image/black-wilbur-bold-tee/922d637d-a5d5-4bf6-a83b-8e2864b06436.jpg','product','2024-11-12 08:20:58.930654'),
('5aafb324-67bb-4015-a4c4-bc918ee37c13','62a40e06-da22-4ff2-a1ec-7b86c91dda91','https://blackwilbur.blob.core.windows.net/blackwilbur-image/bw-break-rules-tee/77acfc91-8e85-4513-a0b3-137465cb2469.jpg','product','2024-11-12 08:24:26.059484'),
('62234786-3edc-4498-b00d-bcd9d09e8444','4dacb68d-2d34-4eb8-9e82-418b012ab58a','https://blackwilbur.blob.core.windows.net/blackwilbur-image/black-wilbur-dorsal-tee/-black-wilbur-snakescale-tee/adcc71d7-afe1-4a40-9ab3-ec9e6a2aab0f.jpg','product','2024-11-12 08:14:44.171314'),
('6dbcee18-8bce-408f-ab8b-bdc548e39cc8','4e64b45a-890a-48ed-ae1e-bdbe93434c50','https://blackwilbur.blob.core.windows.net/blackwilbur-image/bw-sophisticated-polo/ffc72ead-0603-4011-a07e-72534511bffc.jpg','product','2024-11-12 07:21:41.602745'),
('9951265e-9ff1-48ce-afcd-c42a3761af16','0d7ae5c1-1202-430e-8179-7edc3f34a93f','https://blackwilbur.blob.core.windows.net/blackwilbur-image/black-wilbur-crossbar-zip-polo/3423ff01-ade3-4231-8ea9-00e3cb087e8b.jpg','product','2024-11-12 07:19:35.120436'),
('d2ed47bb-9b3b-41a1-ba0e-c5786a1a5665','d6d99337-5ae2-4551-8bdf-393ad58cd7aa','https://blackwilbur.blob.core.windows.net/blackwilbur-image/black-wilbur-bunny-tee/9c7fb224-31bb-479c-adcd-1301ace24d0b.jpg','product','2024-11-12 08:23:41.536825'),
('b8c97296-b70b-4761-90d9-cb2d93104510','5a70e7ef-c553-4b7a-899c-5ea558758292','https://blackwilbur.blob.core.windows.net/blackwilbur-image/bw-bars-knitted-shirt/373bb8ef-1c01-4de2-ab43-f47d1d113b66.jpg','product','2024-11-12 07:18:08.923617'),
('233e202d-d204-4171-bf3a-cc2883b39732','94ea7a22-e815-454c-8408-52738b3e5664','https://blackwilbur.blob.core.windows.net/blackwilbur-image/black-wilbur-solid-polo/699fbbfb-db0d-4b02-9535-8bb301dd5d8b.jpg','product','2024-11-12 07:22:43.694604'),
('b35a613d-1ade-4ecb-8c8e-d3b5352f4eea','09bd2a23-ccaf-43f1-974f-7d09ddf52486','https://blackwilbur.blob.core.windows.net/blackwilbur-image/bw-binate-knit-tee/5024ae79-d739-4812-be8b-107574c45481.jpg','product','2024-11-12 08:01:56.434671'),
('12100eb5-19ce-4fd1-8dad-e41533474eb5','94ea7a22-e815-454c-8408-52738b3e5664','https://blackwilbur.blob.core.windows.net/blackwilbur-image/black-wilbur-solid-polo/cd8a083a-f5ca-468e-a56a-8ac303d2be68.jpg','product','2024-11-12 07:22:42.038294'),
('4a2e5b35-7f1c-40d2-9549-e4406d1c3b6e','d6d99337-5ae2-4551-8bdf-393ad58cd7aa','https://blackwilbur.blob.core.windows.net/blackwilbur-image/black-wilbur-bunny-tee/1ec92d8a-166c-462e-87d9-018a594cc5cd.jpg','product','2024-11-12 08:23:44.963589'),
('af924a96-02b4-4c16-a987-e8a8543a8548','6a4645a1-1ac7-47b9-b2d6-8e88137ec9b5','https://blackwilbur.blob.core.windows.net/blackwilbur-image/bw-bold-tee/cfcdf7e4-244f-4a4c-9080-855102058232.jpg','product','2024-11-12 08:14:06.036664'),
('5e7c97f0-2049-4cea-9ccd-eac48e21be62','0d165e31-b554-4535-b3fc-d8996a357921','https://blackwilbur.blob.core.windows.net/blackwilbur-image/black-wilbur-distinct-knitted-shirt/73dfd6a3-5429-4d11-9e7a-16600a3c3b54.jpg','product','2024-11-12 08:05:16.391489'),
('82939f50-c4bc-4b57-b66c-f04dbbd2a9ca','dd25927e-e33f-427d-866e-97b56b0a02d2','https://blackwilbur.blob.core.windows.net/blackwilbur-image/bw-trippy teddy tee/11e50970-d749-43b2-b9d0-a28f8a593875.jpg','product','2024-11-12 08:25:24.653359'),
('94757c62-b650-485b-992d-f25528d87aac','0d7ae5c1-1202-430e-8179-7edc3f34a93f','https://blackwilbur.blob.core.windows.net/blackwilbur-image/black-wilbur-crossbar-zip-polo/79f3183d-f111-41f7-b5ed-b6b703322f24.jpg','product','2024-11-12 07:19:38.503343'),
('fa8ddfcf-7318-4d53-9f72-f36c1be52994','62a40e06-da22-4ff2-a1ec-7b86c91dda91','https://blackwilbur.blob.core.windows.net/blackwilbur-image/bw-break-rules-tee/22fbe731-6917-49e1-aa2c-a1b63d2d0f03.jpg','product','2024-11-12 08:24:26.510846'),
('72ab06c2-2312-4275-b994-f5cc31c1ecc6','2b434338-28f2-4bdd-a358-4d8113be6ff7','https://blackwilbur.blob.core.windows.net/blackwilbur-image/bw-contrast-rib-polo/f2050bec-84fa-481d-a315-cf9d7c0f1792.jpg','product','2024-11-12 07:23:39.807433'),
('c6af75b8-70d9-40b0-9d76-f8aa2bb363e4','e39594fd-4154-409f-a7c7-d4d11dca7ce1','https://blackwilbur.blob.core.windows.net/blackwilbur-image/bw-regular-knit-polo/da5f88e6-b1ae-4256-a36c-23bc2af48cb7.jpg','product','2024-11-12 08:00:23.731395'),
('98d23384-14d4-479f-a7d3-fa0808776369','d6d99337-5ae2-4551-8bdf-393ad58cd7aa','https://blackwilbur.blob.core.windows.net/blackwilbur-image/black-wilbur-bunny-tee/c2bd75f9-76c9-4b3b-8ed2-e7022b0d117d.jpg','product','2024-11-12 08:23:41.362640'),
('589a6eb6-aa74-4ee6-a0bd-fa31e5f84b81','94ea7a22-e815-454c-8408-52738b3e5664','https://blackwilbur.blob.core.windows.net/blackwilbur-image/black-wilbur-solid-polo/e977bd3e-bcd6-491c-aadd-688c334109cc.jpg','product','2024-11-12 07:22:43.860284'),
('f99f9def-92b8-439b-80b2-fad4e1a4010c','e39594fd-4154-409f-a7c7-d4d11dca7ce1','https://blackwilbur.blob.core.windows.net/blackwilbur-image/bw-regular-knit-polo/c03cae72-01cd-499c-b665-7ade027f89a9.jpg','product','2024-11-12 08:00:25.203879'),
('c4bfcb2c-54b9-4ebc-821e-fe20a6e88d46','0d7ae5c1-1202-430e-8179-7edc3f34a93f','https://blackwilbur.blob.core.windows.net/blackwilbur-image/black-wilbur-crossbar-zip-polo/8abf9d26-da45-4ec1-9321-33569847c34e.jpg','product','2024-11-12 07:19:33.037789');
/*!40000 ALTER TABLE `blackwilbur_image` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `blackwilbur_newslettersubscription`
--

DROP TABLE IF EXISTS `blackwilbur_newslettersubscription`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `blackwilbur_newslettersubscription` (
  `id` uuid NOT NULL,
  `email` varchar(254) NOT NULL,
  `subscribed_at` datetime(6) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `blackwilbur_newslettersubscription`
--

LOCK TABLES `blackwilbur_newslettersubscription` WRITE;
/*!40000 ALTER TABLE `blackwilbur_newslettersubscription` DISABLE KEYS */;
/*!40000 ALTER TABLE `blackwilbur_newslettersubscription` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `blackwilbur_order`
--

DROP TABLE IF EXISTS `blackwilbur_order`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `blackwilbur_order` (
  `id` uuid NOT NULL,
  `created_at` datetime(6) NOT NULL,
  `updated_at` datetime(6) NOT NULL,
  `status` varchar(50) NOT NULL,
  `phone_number` varchar(20) DEFAULT NULL,
  `address_line_1` varchar(255) NOT NULL,
  `address_line_2` varchar(255) NOT NULL,
  `city` varchar(100) NOT NULL,
  `state` varchar(100) NOT NULL,
  `zip_code` varchar(20) NOT NULL,
  `country` varchar(100) NOT NULL,
  `order_id` varchar(255) NOT NULL,
  `email` varchar(255) DEFAULT NULL,
  `payment_method` varchar(50) NOT NULL,
  `payment_status` varchar(20) NOT NULL,
  `subtotal` decimal(10,2) NOT NULL,
  `discount_amount` decimal(10,2) NOT NULL,
  `tax_amount` decimal(10,2) NOT NULL,
  `shipping_cost` decimal(10,2) NOT NULL,
  `total_amount` decimal(10,2) NOT NULL,
  `user_id` uuid NOT NULL,
  `transaction_id` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `order_id` (`order_id`),
  KEY `blackwilbur_order_user_id_7b04c8b3_fk_blackwilbur_user_id` (`user_id`),
  CONSTRAINT `blackwilbur_order_user_id_7b04c8b3_fk_blackwilbur_user_id` FOREIGN KEY (`user_id`) REFERENCES `blackwilbur_user` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `blackwilbur_order`
--

LOCK TABLES `blackwilbur_order` WRITE;
/*!40000 ALTER TABLE `blackwilbur_order` DISABLE KEYS */;
/*!40000 ALTER TABLE `blackwilbur_order` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `blackwilbur_orderitem`
--

DROP TABLE IF EXISTS `blackwilbur_orderitem`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `blackwilbur_orderitem` (
  `id` uuid NOT NULL,
  `quantity` int(10) unsigned NOT NULL CHECK (`quantity` >= 0),
  `price` decimal(10,2) NOT NULL,
  `discount_amount` decimal(10,2) NOT NULL,
  `tax_amount` decimal(10,2) NOT NULL,
  `total_price` decimal(10,2) NOT NULL,
  `order_id` uuid NOT NULL,
  `product_id` uuid NOT NULL,
  `product_variation_id` uuid DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `blackwilbur_orderitem_order_id_47e8c794_fk_blackwilbur_order_id` (`order_id`),
  KEY `blackwilbur_orderite_product_id_2ce3e7e8_fk_blackwilb` (`product_id`),
  KEY `blackwilbur_orderite_product_variation_id_7be4631d_fk_blackwilb` (`product_variation_id`),
  CONSTRAINT `blackwilbur_orderite_product_id_2ce3e7e8_fk_blackwilb` FOREIGN KEY (`product_id`) REFERENCES `blackwilbur_product` (`id`),
  CONSTRAINT `blackwilbur_orderite_product_variation_id_7be4631d_fk_blackwilb` FOREIGN KEY (`product_variation_id`) REFERENCES `blackwilbur_productvariation` (`id`),
  CONSTRAINT `blackwilbur_orderitem_order_id_47e8c794_fk_blackwilbur_order_id` FOREIGN KEY (`order_id`) REFERENCES `blackwilbur_order` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `blackwilbur_orderitem`
--

LOCK TABLES `blackwilbur_orderitem` WRITE;
/*!40000 ALTER TABLE `blackwilbur_orderitem` DISABLE KEYS */;
/*!40000 ALTER TABLE `blackwilbur_orderitem` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `blackwilbur_product`
--

DROP TABLE IF EXISTS `blackwilbur_product`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `blackwilbur_product` (
  `id` uuid NOT NULL,
  `name` varchar(255) NOT NULL,
  `description` longtext NOT NULL,
  `price` decimal(10,2) NOT NULL,
  `image` varchar(200) DEFAULT NULL,
  `category_id` uuid NOT NULL,
  PRIMARY KEY (`id`),
  KEY `blackwilbur_product_category_id_f27d6d72_fk_blackwilb` (`category_id`),
  CONSTRAINT `blackwilbur_product_category_id_f27d6d72_fk_blackwilb` FOREIGN KEY (`category_id`) REFERENCES `blackwilbur_category` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `blackwilbur_product`
--

LOCK TABLES `blackwilbur_product` WRITE;
/*!40000 ALTER TABLE `blackwilbur_product` DISABLE KEYS */;
INSERT INTO `blackwilbur_product` VALUES
('8aed539e-373a-42df-bc77-0ca0c36f5946','Black Wilbur Contrast Collar Full Sleeve Polo','Experience the cozy elegance of the Black Wilbur Contrast Collar Full Sleeve Polo, our knitted Product designed specifically for men who appreciate both comfort and style. The unique texture adds a touch of warmth, making it perfect for layering during cooler months or wearing solo in a relaxed setting. Pair it with your favorite jeans or chinos for a polished yet casual look that stands out!',1995.00,'https://blackwilbur.blob.core.windows.net/blackwilbur-image/black-wilbur-contrast-collar-full-sleeve-polo/8aed539e-373a-42df-bc77-0ca0c36f5946.jpg','502b45ac-a740-4406-866d-ee2154895072'),
('d6d99337-5ae2-4551-8bdf-393ad58cd7aa','Black Wilbur Bunny Tee','Introducing the Black Wilbur Bunny Tee , our classic round-neck Product that effortlessly combines comfort and style for the modern man. Crafted from soft, breathable fabric, this Product is ideal for everyday wear, whether you\'re relaxing at home or heading out with friends. The versatile design pairs perfectly with any outfit, making it a must-have in your wardrobe. Elevate your casual look with this Product today!',1595.00,'https://blackwilbur.blob.core.windows.net/blackwilbur-image/black-wilbur-bunny-tee/d6d99337-5ae2-4551-8bdf-393ad58cd7aa.jpg','a0288216-a26b-4ec3-8dca-e7db4754c702'),
('4dacb68d-2d34-4eb8-9e82-418b012ab58a','Black Wilbur Dorsal Tee/ Black Wilbur Snakescale Tee','Introducing the Black Wilbur Dorsal Tee, our classic round-neck Product that effortlessly combines comfort and style for the modern man. Crafted from soft, breathable fabric, this Product is ideal for everyday wear, whether you\'re relaxing at home or heading out with friends. The versatile design pairs perfectly with any outfit, making it a must-have in your wardrobe. Elevate your casual look with this Product today!',1395.00,'https://blackwilbur.blob.core.windows.net/blackwilbur-image/black-wilbur-dorsal-tee/-black-wilbur-snakescale-tee/4dacb68d-2d34-4eb8-9e82-418b012ab58a.jpg','a0288216-a26b-4ec3-8dca-e7db4754c702'),
('2b434338-28f2-4bdd-a358-4d8113be6ff7','BW Contrast Rib Polo','Experience the cozy elegance of the BW Contrast Rib Polo, our knitted Product designed specifically for men who appreciate both comfort and style. The unique texture adds a touch of warmth, making it perfect for layering during cooler months or wearing solo in a relaxed setting. Pair it with your favorite jeans or chinos for a polished yet casual look that stands out!',1925.00,'https://blackwilbur.blob.core.windows.net/blackwilbur-image/bw-contrast-rib-polo/2b434338-28f2-4bdd-a358-4d8113be6ff7.jpg','502b45ac-a740-4406-866d-ee2154895072'),
('94ea7a22-e815-454c-8408-52738b3e5664','Black Wilbur Solid Polo','Experience the cozy elegance of the Black Wilbur Solid Polo, our knitted Product designed specifically for men who appreciate both comfort and style. The unique texture adds a touch of warmth, making it perfect for layering during cooler months or wearing solo in a relaxed setting. Pair it with your favorite jeans or chinos for a polished yet casual look that stands out!',1895.00,'https://blackwilbur.blob.core.windows.net/blackwilbur-image/black-wilbur-solid-polo/94ea7a22-e815-454c-8408-52738b3e5664.jpg','502b45ac-a740-4406-866d-ee2154895072'),
('5eaa8f65-a7a0-44c7-a9e2-5ab651c60bec','BW Bar Knit Full Sleeve Polo','Experience the cozy elegance of the BW Bar Knit Full Sleeve Polo, our knitted Product designed specifically for men who appreciate both comfort and style. The unique texture adds a touch of warmth, making it perfect for layering during cooler months or wearing solo in a relaxed setting. Pair it with your favorite jeans or chinos for a polished yet casual look that stands out!',1725.00,'https://blackwilbur.blob.core.windows.net/blackwilbur-image/bw-bar-knit-full-sleeve-polo/5eaa8f65-a7a0-44c7-a9e2-5ab651c60bec.jpg','502b45ac-a740-4406-866d-ee2154895072'),
('7a9f755a-f034-4164-ba96-5d7d80980f4f','BW BOLD TEE','The BW Bold Tee is designed for those who love style and comfort. This round-neck t-shirt features a bold design that reflects confidence and strength. Made from high-quality, breathable fabric, it offers a comfortable fit perfect for any occasion. The BW Bold Tee is versatile and easy to pair with your favorite jeans, shorts, or joggers, making it a wardrobe essential for those who want to make a statement without compromising on comfort.',1245.00,'https://blackwilbur.blob.core.windows.net/blackwilbur-image/bw-bold tee/7a9f755a-f034-4164-ba96-5d7d80980f4f.jpg','a0288216-a26b-4ec3-8dca-e7db4754c702'),
('5a70e7ef-c553-4b7a-899c-5ea558758292','BW Bars Knitted Shirt','Experience the cozy elegance of the BW Bars Knitted Shirt, our knitted Product designed specifically for men who appreciate both comfort and style. The unique texture adds a touch of warmth, making it perfect for layering during cooler months or wearing solo in a relaxed setting. Pair it with your favorite jeans or chinos for a polished yet casual look that stands out!',2195.00,'https://blackwilbur.blob.core.windows.net/blackwilbur-image/bw-bars-knitted-shirt/5a70e7ef-c553-4b7a-899c-5ea558758292.jpg','502b45ac-a740-4406-866d-ee2154895072'),
('5f54314d-78be-44d7-a888-67cee5704d6d','The OG BW Tee','Introducing the The OG BW Tee , our classic round-neck Product that effortlessly combines comfort and style for the modern man. Crafted from soft, breathable fabric, this Product is ideal for everyday wear, whether you\'re relaxing at home or heading out with friends. The versatile design pairs perfectly with any outfit, making it a must-have in your wardrobe. Elevate your casual look with this Product today!',1345.00,'https://blackwilbur.blob.core.windows.net/blackwilbur-image/the-og-bw-tee/5f54314d-78be-44d7-a888-67cee5704d6d.jpg','a0288216-a26b-4ec3-8dca-e7db4754c702'),
('62a40e06-da22-4ff2-a1ec-7b86c91dda91','BW Break Rules Tee',' Introducing the BW Break Rules Tee , our classic round-neck Product that effortlessly combines comfort and style for the modern man. Crafted from soft, breathable fabric, this Product is ideal for everyday wear, whether you\'re relaxing at home or heading out with friends. The versatile design pairs perfectly with any outfit, making it a must-have in your wardrobe. Elevate your casual look with this Product today!',1595.00,'https://blackwilbur.blob.core.windows.net/blackwilbur-image/bw-break-rules-tee/62a40e06-da22-4ff2-a1ec-7b86c91dda91.jpg','a0288216-a26b-4ec3-8dca-e7db4754c702'),
('09bd2a23-ccaf-43f1-974f-7d09ddf52486','BW Binate Knit Tee','Experience the cozy elegance of the BW Binate Knit Tee, our knitted Product designed specifically for men who appreciate both comfort and style. The unique texture adds a touch of warmth, making it perfect for layering during cooler months or wearing solo in a relaxed setting. Pair it with your favorite jeans or chinos for a polished yet casual look that stands out!',1695.00,'https://blackwilbur.blob.core.windows.net/blackwilbur-image/bw-binate-knit-tee/09bd2a23-ccaf-43f1-974f-7d09ddf52486.jpg','502b45ac-a740-4406-866d-ee2154895072'),
('0d7ae5c1-1202-430e-8179-7edc3f34a93f','Black Wilbur Crossbar Zip Polo','Experience the cozy elegance of the BW Crossbar Zip Polo, our knitted Product designed specifically for men who appreciate both comfort and style. The unique texture adds a touch of warmth, making it perfect for layering during cooler months or wearing solo in a relaxed setting. Pair it with your favorite jeans or chinos for a polished yet casual look that stands out!',2195.00,'https://blackwilbur.blob.core.windows.net/blackwilbur-image/black-wilbur-crossbar-zip-polo/0d7ae5c1-1202-430e-8179-7edc3f34a93f.jpg','502b45ac-a740-4406-866d-ee2154895072'),
('b50cb239-8e28-428b-ae98-81e1d2d7d900','Black Wilbur Ramp Tee/ Black Wilbur Gradient Tee','Introducing the Black Wilbur Ramp Tee , our classic round-neck Product that effortlessly combines comfort and style for the modern man. Crafted from soft, breathable fabric, this Product is ideal for everyday wear, whether you\'re relaxing at home or heading out with friends. The versatile design pairs perfectly with any outfit, making it a must-have in your wardrobe. Elevate your casual look with this Product today!',1245.00,'https://blackwilbur.blob.core.windows.net/blackwilbur-image/black-wilbur-ramp-tee/-black-wilbur-gradient-tee/b50cb239-8e28-428b-ae98-81e1d2d7d900.jpg','a0288216-a26b-4ec3-8dca-e7db4754c702'),
('3c163aa9-a1b4-41e1-85f2-8d199d283210','BW Crossbar Knit Polo','Experience the cozy elegance of the BW Crossbar Knit Polo, our knitted Product designed specifically for men who appreciate both comfort and style. The unique texture adds a touch of warmth, making it perfect for layering during cooler months or wearing solo in a relaxed setting. Pair it with your favorite jeans or chinos for a polished yet casual look that stands out!',1595.00,'https://blackwilbur.blob.core.windows.net/blackwilbur-image/bw-crossbar-knit-polo/3c163aa9-a1b4-41e1-85f2-8d199d283210.jpg','502b45ac-a740-4406-866d-ee2154895072'),
('6a4645a1-1ac7-47b9-b2d6-8e88137ec9b5','BW Bold Tee','Introducing the BW Bold Tee, our classic round-neck Product that effortlessly combines comfort and style for the modern man. Crafted from soft, breathable fabric, this Product is ideal for everyday wear, whether you\'re relaxing at home or heading out with friends. The versatile design pairs perfectly with any outfit, making it a must-have in your wardrobe. Elevate your casual look with this Product today!',1395.00,'https://blackwilbur.blob.core.windows.net/blackwilbur-image/bw-bold-tee/6a4645a1-1ac7-47b9-b2d6-8e88137ec9b5.jpg','a0288216-a26b-4ec3-8dca-e7db4754c702'),
('dd25927e-e33f-427d-866e-97b56b0a02d2','BW Trippy Teddy Tee','Introducing the BW Trippy Teddy Tee , our classic round-neck Product that effortlessly combines comfort and style for the modern man. Crafted from soft, breathable fabric, this Product is ideal for everyday wear, whether you\'re relaxing at home or heading out with friends. The versatile design pairs perfectly with any outfit, making it a must-have in your wardrobe. Elevate your casual look with this Product today!',1595.00,'https://blackwilbur.blob.core.windows.net/blackwilbur-image/bw-trippy teddy tee/dd25927e-e33f-427d-866e-97b56b0a02d2.jpg','a0288216-a26b-4ec3-8dca-e7db4754c702'),
('57497d26-d3b4-4ca3-ade6-999d24e91d29','BLACK WILBUR Bold Tee','Introducing the BLACK WILBUR Bold Tee , our classic round-neck Product that effortlessly combines comfort and style for the modern man. Crafted from soft, breathable fabric, this Product is ideal for everyday wear, whether you\'re relaxing at home or heading out with friends. The versatile design pairs perfectly with any outfit, making it a must-have in your wardrobe. Elevate your casual look with this Product today!',1395.00,'https://blackwilbur.blob.core.windows.net/blackwilbur-image/black-wilbur-bold-tee/57497d26-d3b4-4ca3-ade6-999d24e91d29.jpg','a0288216-a26b-4ec3-8dca-e7db4754c702'),
('e9ce2024-8349-4a3b-89d5-a15d9b52b539','Black Wilbur Delusional Tee','Introducing the Black Wilbur Delusional Tee, our classic round-neck Product that effortlessly combines comfort and style for the modern man. Crafted from soft, breathable fabric, this Product is ideal for everyday wear, whether you\'re relaxing at home or heading out with friends. The versatile design pairs perfectly with any outfit, making it a must-have in your wardrobe. Elevate your casual look with this Product today!',1595.00,'https://blackwilbur.blob.core.windows.net/blackwilbur-image/black-wilbur-delusional-tee/e9ce2024-8349-4a3b-89d5-a15d9b52b539.jpg','a0288216-a26b-4ec3-8dca-e7db4754c702'),
('4e64b45a-890a-48ed-ae1e-bdbe93434c50','BW Sophisticated Polo','Experience the cozy elegance of the  BW Sophisticated Polo, our knitted Product designed specifically for men who appreciate both comfort and style. The unique texture adds a touch of warmth, making it perfect for layering during cooler months or wearing solo in a relaxed setting. Pair it with your favorite jeans or chinos for a polished yet casual look that stands out!',1845.00,'https://blackwilbur.blob.core.windows.net/blackwilbur-image/bw-sophisticated-polo/4e64b45a-890a-48ed-ae1e-bdbe93434c50.jpg','502b45ac-a740-4406-866d-ee2154895072'),
('4de3ca11-3f7c-44af-b7ad-cbc92d97bbc2','BW Wavy Knit Polo','Experience the cozy elegance of the BW Wavy Knit Polo, our knitted Product designed specifically for men who appreciate both comfort and style. The unique texture adds a touch of warmth, making it perfect for layering during cooler months or wearing solo in a relaxed setting. Pair it with your favorite jeans or chinos for a polished yet casual look that stands out!',1595.00,'https://blackwilbur.blob.core.windows.net/blackwilbur-image/bw wavy knit polo/4de3ca11-3f7c-44af-b7ad-cbc92d97bbc2.jpg','502b45ac-a740-4406-866d-ee2154895072'),
('feb9d193-b991-4be5-8a15-d02a3bf07b0b','BW Streak Knitted Polo','Experience the cozy elegance of the  BW Streak Knitted Polo, our knitted Product designed specifically for men who appreciate both comfort and style. The unique texture adds a touch of warmth, making it perfect for layering during cooler months or wearing solo in a relaxed setting. Pair it with your favorite jeans or chinos for a polished yet casual look that stands out!',1895.00,'https://blackwilbur.blob.core.windows.net/blackwilbur-image/bw-streak-knitted-polo/feb9d193-b991-4be5-8a15-d02a3bf07b0b.jpg','502b45ac-a740-4406-866d-ee2154895072'),
('e39594fd-4154-409f-a7c7-d4d11dca7ce1','BW Regular Knit Polo','Experience the cozy elegance of the BW Regular Knit Polo, our knitted Product designed specifically for men who appreciate both comfort and style. The unique texture adds a touch of warmth, making it perfect for layering during cooler months or wearing solo in a relaxed setting. Pair it with your favorite jeans or chinos for a polished yet casual look that stands out!',1595.00,'https://blackwilbur.blob.core.windows.net/blackwilbur-image/bw-regular-knit-polo/e39594fd-4154-409f-a7c7-d4d11dca7ce1.jpg','502b45ac-a740-4406-866d-ee2154895072'),
('0d165e31-b554-4535-b3fc-d8996a357921','Black Wilbur Distinct Knitted Shirt','Experience the cozy elegance of the Black Wilbur Distinct Knitted Shirt, our knitted Product designed specifically for men who appreciate both comfort and style. The unique texture adds a touch of warmth, making it perfect for layering during cooler months or wearing solo in a relaxed setting. Pair it with your favorite jeans or chinos for a polished yet casual look that stands out!',1895.00,'https://blackwilbur.blob.core.windows.net/blackwilbur-image/black-wilbur-distinct-knitted-shirt/0d165e31-b554-4535-b3fc-d8996a357921.jpg','502b45ac-a740-4406-866d-ee2154895072'),
('4af3369c-a41e-4ada-9130-e835ca50a328','Black Wilbur Bar Knitted Shirt',' Experience the cozy elegance of the Black Wilbur Bar Knitted Shirt, our knitted Product designed specifically for men who appreciate both comfort and style. The unique texture adds a touch of warmth, making it perfect for layering during cooler months or wearing solo in a relaxed setting. Pair it with your favorite jeans or chinos for a polished yet casual look that stands out!',1945.00,'https://blackwilbur.blob.core.windows.net/blackwilbur-image/black-wilbur-bar-knitted-shirt/4af3369c-a41e-4ada-9130-e835ca50a328.jpg','502b45ac-a740-4406-866d-ee2154895072'),
('4911204f-3201-4470-9f54-f43c7ae1a832','BW Bar Knit Polo','Experience the cozy elegance of the BW Bar Knit Polo, our knitted Product designed specifically for men who appreciate both comfort and style. The unique texture adds a touch of warmth, making it perfect for layering during cooler months or wearing solo in a relaxed setting. Pair it with your favorite jeans or chinos for a polished yet casual look that stands out!',1595.00,'https://blackwilbur.blob.core.windows.net/blackwilbur-image/bw-bar-knit-polo/4911204f-3201-4470-9f54-f43c7ae1a832.jpg','502b45ac-a740-4406-866d-ee2154895072');
/*!40000 ALTER TABLE `blackwilbur_product` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `blackwilbur_productvariation`
--

DROP TABLE IF EXISTS `blackwilbur_productvariation`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `blackwilbur_productvariation` (
  `id` uuid NOT NULL,
  `product` uuid NOT NULL,
  `size` varchar(5) NOT NULL,
  `quantity` int(10) unsigned NOT NULL CHECK (`quantity` >= 0),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `blackwilbur_productvariation`
--

LOCK TABLES `blackwilbur_productvariation` WRITE;
/*!40000 ALTER TABLE `blackwilbur_productvariation` DISABLE KEYS */;
INSERT INTO `blackwilbur_productvariation` VALUES
('c7b99fff-a0d0-11ef-bf7a-bc2411d1c354','d6d99337-5ae2-4551-8bdf-393ad58cd7aa','S',4),
('c7b9a129-a0d0-11ef-bf7a-bc2411d1c354','d6d99337-5ae2-4551-8bdf-393ad58cd7aa','M',4),
('c7b9a188-a0d0-11ef-bf7a-bc2411d1c354','d6d99337-5ae2-4551-8bdf-393ad58cd7aa','L',10),
('c7b9a198-a0d0-11ef-bf7a-bc2411d1c354','d6d99337-5ae2-4551-8bdf-393ad58cd7aa','XL',10),
('c7b9a1a7-a0d0-11ef-bf7a-bc2411d1c354','d6d99337-5ae2-4551-8bdf-393ad58cd7aa','XXL',4),
('c7b9a1c7-a0d0-11ef-bf7a-bc2411d1c354','4dacb68d-2d34-4eb8-9e82-418b012ab58a','S',4),
('c7b9a1d8-a0d0-11ef-bf7a-bc2411d1c354','4dacb68d-2d34-4eb8-9e82-418b012ab58a','M',4),
('c7b9a1e4-a0d0-11ef-bf7a-bc2411d1c354','4dacb68d-2d34-4eb8-9e82-418b012ab58a','L',10),
('c7b9a1f2-a0d0-11ef-bf7a-bc2411d1c354','4dacb68d-2d34-4eb8-9e82-418b012ab58a','XL',10),
('c7b9a1ff-a0d0-11ef-bf7a-bc2411d1c354','4dacb68d-2d34-4eb8-9e82-418b012ab58a','XXL',4),
('c7b9a210-a0d0-11ef-bf7a-bc2411d1c354','7a9f755a-f034-4164-ba96-5d7d80980f4f','S',4),
('c7b9a21c-a0d0-11ef-bf7a-bc2411d1c354','7a9f755a-f034-4164-ba96-5d7d80980f4f','M',4),
('c7b9a229-a0d0-11ef-bf7a-bc2411d1c354','7a9f755a-f034-4164-ba96-5d7d80980f4f','L',10),
('c7b9a237-a0d0-11ef-bf7a-bc2411d1c354','7a9f755a-f034-4164-ba96-5d7d80980f4f','XL',10),
('c7b9a242-a0d0-11ef-bf7a-bc2411d1c354','7a9f755a-f034-4164-ba96-5d7d80980f4f','XXL',4),
('c7b9a250-a0d0-11ef-bf7a-bc2411d1c354','5f54314d-78be-44d7-a888-67cee5704d6d','S',4),
('c7b9a25d-a0d0-11ef-bf7a-bc2411d1c354','5f54314d-78be-44d7-a888-67cee5704d6d','M',4),
('c7b9a269-a0d0-11ef-bf7a-bc2411d1c354','5f54314d-78be-44d7-a888-67cee5704d6d','L',10),
('c7b9a275-a0d0-11ef-bf7a-bc2411d1c354','5f54314d-78be-44d7-a888-67cee5704d6d','XL',10),
('c7b9a281-a0d0-11ef-bf7a-bc2411d1c354','5f54314d-78be-44d7-a888-67cee5704d6d','XXL',4),
('c7b9a292-a0d0-11ef-bf7a-bc2411d1c354','62a40e06-da22-4ff2-a1ec-7b86c91dda91','S',4),
('c7b9a29c-a0d0-11ef-bf7a-bc2411d1c354','62a40e06-da22-4ff2-a1ec-7b86c91dda91','M',4),
('c7b9a2a9-a0d0-11ef-bf7a-bc2411d1c354','62a40e06-da22-4ff2-a1ec-7b86c91dda91','L',10),
('c7b9a2b5-a0d0-11ef-bf7a-bc2411d1c354','62a40e06-da22-4ff2-a1ec-7b86c91dda91','XL',10),
('c7b9a2c0-a0d0-11ef-bf7a-bc2411d1c354','62a40e06-da22-4ff2-a1ec-7b86c91dda91','XXL',4),
('c7b9a2cd-a0d0-11ef-bf7a-bc2411d1c354','b50cb239-8e28-428b-ae98-81e1d2d7d900','S',4),
('c7b9a2d9-a0d0-11ef-bf7a-bc2411d1c354','b50cb239-8e28-428b-ae98-81e1d2d7d900','M',4),
('c7b9a2e4-a0d0-11ef-bf7a-bc2411d1c354','b50cb239-8e28-428b-ae98-81e1d2d7d900','L',10),
('c7b9a2f0-a0d0-11ef-bf7a-bc2411d1c354','b50cb239-8e28-428b-ae98-81e1d2d7d900','XL',10),
('c7b9a2fa-a0d0-11ef-bf7a-bc2411d1c354','b50cb239-8e28-428b-ae98-81e1d2d7d900','XXL',4),
('c7b9a307-a0d0-11ef-bf7a-bc2411d1c354','6a4645a1-1ac7-47b9-b2d6-8e88137ec9b5','S',4),
('c7b9a313-a0d0-11ef-bf7a-bc2411d1c354','6a4645a1-1ac7-47b9-b2d6-8e88137ec9b5','M',4),
('c7b9a31d-a0d0-11ef-bf7a-bc2411d1c354','6a4645a1-1ac7-47b9-b2d6-8e88137ec9b5','L',10),
('c7b9a329-a0d0-11ef-bf7a-bc2411d1c354','6a4645a1-1ac7-47b9-b2d6-8e88137ec9b5','XL',10),
('c7b9a334-a0d0-11ef-bf7a-bc2411d1c354','6a4645a1-1ac7-47b9-b2d6-8e88137ec9b5','XXL',4),
('c7b9a341-a0d0-11ef-bf7a-bc2411d1c354','dd25927e-e33f-427d-866e-97b56b0a02d2','S',4),
('c7b9a34c-a0d0-11ef-bf7a-bc2411d1c354','dd25927e-e33f-427d-866e-97b56b0a02d2','M',4),
('c7b9a358-a0d0-11ef-bf7a-bc2411d1c354','dd25927e-e33f-427d-866e-97b56b0a02d2','L',10),
('c7b9a364-a0d0-11ef-bf7a-bc2411d1c354','dd25927e-e33f-427d-866e-97b56b0a02d2','XL',10),
('c7b9a36e-a0d0-11ef-bf7a-bc2411d1c354','dd25927e-e33f-427d-866e-97b56b0a02d2','XXL',4),
('c7b9a37d-a0d0-11ef-bf7a-bc2411d1c354','57497d26-d3b4-4ca3-ade6-999d24e91d29','S',4),
('c7b9a389-a0d0-11ef-bf7a-bc2411d1c354','57497d26-d3b4-4ca3-ade6-999d24e91d29','M',4),
('c7b9a392-a0d0-11ef-bf7a-bc2411d1c354','57497d26-d3b4-4ca3-ade6-999d24e91d29','L',10),
('c7b9a39e-a0d0-11ef-bf7a-bc2411d1c354','57497d26-d3b4-4ca3-ade6-999d24e91d29','XL',10),
('c7b9a3ab-a0d0-11ef-bf7a-bc2411d1c354','57497d26-d3b4-4ca3-ade6-999d24e91d29','XXL',4),
('c7b9a3ba-a0d0-11ef-bf7a-bc2411d1c354','e9ce2024-8349-4a3b-89d5-a15d9b52b539','S',4),
('c7b9a3c4-a0d0-11ef-bf7a-bc2411d1c354','e9ce2024-8349-4a3b-89d5-a15d9b52b539','M',4),
('c7b9a3ce-a0d0-11ef-bf7a-bc2411d1c354','e9ce2024-8349-4a3b-89d5-a15d9b52b539','L',10),
('c7b9a3d9-a0d0-11ef-bf7a-bc2411d1c354','e9ce2024-8349-4a3b-89d5-a15d9b52b539','XL',10),
('c7b9a3e3-a0d0-11ef-bf7a-bc2411d1c354','e9ce2024-8349-4a3b-89d5-a15d9b52b539','XXL',4),
('c7b9a3ef-a0d0-11ef-bf7a-bc2411d1c354','8aed539e-373a-42df-bc77-0ca0c36f5946','S',4),
('c7b9a3fb-a0d0-11ef-bf7a-bc2411d1c354','8aed539e-373a-42df-bc77-0ca0c36f5946','M',4),
('c7b9a405-a0d0-11ef-bf7a-bc2411d1c354','8aed539e-373a-42df-bc77-0ca0c36f5946','L',10),
('c7b9a40f-a0d0-11ef-bf7a-bc2411d1c354','8aed539e-373a-42df-bc77-0ca0c36f5946','XL',10),
('c7b9a419-a0d0-11ef-bf7a-bc2411d1c354','8aed539e-373a-42df-bc77-0ca0c36f5946','XXL',4),
('c7b9a426-a0d0-11ef-bf7a-bc2411d1c354','2b434338-28f2-4bdd-a358-4d8113be6ff7','S',4),
('c7b9a431-a0d0-11ef-bf7a-bc2411d1c354','2b434338-28f2-4bdd-a358-4d8113be6ff7','M',4),
('c7b9a43b-a0d0-11ef-bf7a-bc2411d1c354','2b434338-28f2-4bdd-a358-4d8113be6ff7','L',10),
('c7b9a448-a0d0-11ef-bf7a-bc2411d1c354','2b434338-28f2-4bdd-a358-4d8113be6ff7','XL',10),
('c7b9a452-a0d0-11ef-bf7a-bc2411d1c354','2b434338-28f2-4bdd-a358-4d8113be6ff7','XXL',4),
('c7b9a460-a0d0-11ef-bf7a-bc2411d1c354','94ea7a22-e815-454c-8408-52738b3e5664','S',4),
('c7b9a46a-a0d0-11ef-bf7a-bc2411d1c354','94ea7a22-e815-454c-8408-52738b3e5664','M',4),
('c7b9a475-a0d0-11ef-bf7a-bc2411d1c354','94ea7a22-e815-454c-8408-52738b3e5664','L',10),
('c7b9a47f-a0d0-11ef-bf7a-bc2411d1c354','94ea7a22-e815-454c-8408-52738b3e5664','XL',10),
('c7b9a489-a0d0-11ef-bf7a-bc2411d1c354','94ea7a22-e815-454c-8408-52738b3e5664','XXL',4),
('c7b9a497-a0d0-11ef-bf7a-bc2411d1c354','5eaa8f65-a7a0-44c7-a9e2-5ab651c60bec','S',4),
('c7b9a4a1-a0d0-11ef-bf7a-bc2411d1c354','5eaa8f65-a7a0-44c7-a9e2-5ab651c60bec','M',4),
('c7b9a4ab-a0d0-11ef-bf7a-bc2411d1c354','5eaa8f65-a7a0-44c7-a9e2-5ab651c60bec','L',10),
('c7b9a4b7-a0d0-11ef-bf7a-bc2411d1c354','5eaa8f65-a7a0-44c7-a9e2-5ab651c60bec','XL',10),
('c7b9a4c1-a0d0-11ef-bf7a-bc2411d1c354','5eaa8f65-a7a0-44c7-a9e2-5ab651c60bec','XXL',4),
('c7b9a4cf-a0d0-11ef-bf7a-bc2411d1c354','5a70e7ef-c553-4b7a-899c-5ea558758292','S',4),
('c7b9a4da-a0d0-11ef-bf7a-bc2411d1c354','5a70e7ef-c553-4b7a-899c-5ea558758292','M',4),
('c7b9a4e5-a0d0-11ef-bf7a-bc2411d1c354','5a70e7ef-c553-4b7a-899c-5ea558758292','L',10),
('c7b9a52a-a0d0-11ef-bf7a-bc2411d1c354','5a70e7ef-c553-4b7a-899c-5ea558758292','XL',10),
('c7b9a536-a0d0-11ef-bf7a-bc2411d1c354','5a70e7ef-c553-4b7a-899c-5ea558758292','XXL',4),
('c7b9a542-a0d0-11ef-bf7a-bc2411d1c354','09bd2a23-ccaf-43f1-974f-7d09ddf52486','S',4),
('c7b9a54d-a0d0-11ef-bf7a-bc2411d1c354','09bd2a23-ccaf-43f1-974f-7d09ddf52486','M',4),
('c7b9a558-a0d0-11ef-bf7a-bc2411d1c354','09bd2a23-ccaf-43f1-974f-7d09ddf52486','L',10),
('c7b9a562-a0d0-11ef-bf7a-bc2411d1c354','09bd2a23-ccaf-43f1-974f-7d09ddf52486','XL',10),
('c7b9a56c-a0d0-11ef-bf7a-bc2411d1c354','09bd2a23-ccaf-43f1-974f-7d09ddf52486','XXL',4),
('c7b9a579-a0d0-11ef-bf7a-bc2411d1c354','0d7ae5c1-1202-430e-8179-7edc3f34a93f','S',4),
('c7b9a583-a0d0-11ef-bf7a-bc2411d1c354','0d7ae5c1-1202-430e-8179-7edc3f34a93f','M',4),
('c7b9a58e-a0d0-11ef-bf7a-bc2411d1c354','0d7ae5c1-1202-430e-8179-7edc3f34a93f','L',10),
('c7b9a598-a0d0-11ef-bf7a-bc2411d1c354','0d7ae5c1-1202-430e-8179-7edc3f34a93f','XL',10),
('c7b9a5a2-a0d0-11ef-bf7a-bc2411d1c354','0d7ae5c1-1202-430e-8179-7edc3f34a93f','XXL',4),
('c7b9a5ae-a0d0-11ef-bf7a-bc2411d1c354','3c163aa9-a1b4-41e1-85f2-8d199d283210','S',4),
('c7b9a5b9-a0d0-11ef-bf7a-bc2411d1c354','3c163aa9-a1b4-41e1-85f2-8d199d283210','M',4),
('c7b9a5c3-a0d0-11ef-bf7a-bc2411d1c354','3c163aa9-a1b4-41e1-85f2-8d199d283210','L',10),
('c7b9a5cd-a0d0-11ef-bf7a-bc2411d1c354','3c163aa9-a1b4-41e1-85f2-8d199d283210','XL',10),
('c7b9a5d7-a0d0-11ef-bf7a-bc2411d1c354','3c163aa9-a1b4-41e1-85f2-8d199d283210','XXL',4),
('c7b9a5e5-a0d0-11ef-bf7a-bc2411d1c354','4e64b45a-890a-48ed-ae1e-bdbe93434c50','S',4),
('c7b9a5f0-a0d0-11ef-bf7a-bc2411d1c354','4e64b45a-890a-48ed-ae1e-bdbe93434c50','M',4),
('c7b9a5fb-a0d0-11ef-bf7a-bc2411d1c354','4e64b45a-890a-48ed-ae1e-bdbe93434c50','L',10),
('c7b9a605-a0d0-11ef-bf7a-bc2411d1c354','4e64b45a-890a-48ed-ae1e-bdbe93434c50','XL',10),
('c7b9a60f-a0d0-11ef-bf7a-bc2411d1c354','4e64b45a-890a-48ed-ae1e-bdbe93434c50','XXL',4),
('c7b9a61d-a0d0-11ef-bf7a-bc2411d1c354','4de3ca11-3f7c-44af-b7ad-cbc92d97bbc2','S',4),
('c7b9a628-a0d0-11ef-bf7a-bc2411d1c354','4de3ca11-3f7c-44af-b7ad-cbc92d97bbc2','M',4),
('c7b9a632-a0d0-11ef-bf7a-bc2411d1c354','4de3ca11-3f7c-44af-b7ad-cbc92d97bbc2','L',10),
('c7b9a63d-a0d0-11ef-bf7a-bc2411d1c354','4de3ca11-3f7c-44af-b7ad-cbc92d97bbc2','XL',10),
('c7b9a646-a0d0-11ef-bf7a-bc2411d1c354','4de3ca11-3f7c-44af-b7ad-cbc92d97bbc2','XXL',4),
('c7b9a653-a0d0-11ef-bf7a-bc2411d1c354','feb9d193-b991-4be5-8a15-d02a3bf07b0b','S',4),
('c7b9a65d-a0d0-11ef-bf7a-bc2411d1c354','feb9d193-b991-4be5-8a15-d02a3bf07b0b','M',4),
('c7b9a668-a0d0-11ef-bf7a-bc2411d1c354','feb9d193-b991-4be5-8a15-d02a3bf07b0b','L',10),
('c7b9a672-a0d0-11ef-bf7a-bc2411d1c354','feb9d193-b991-4be5-8a15-d02a3bf07b0b','XL',10),
('c7b9a67c-a0d0-11ef-bf7a-bc2411d1c354','feb9d193-b991-4be5-8a15-d02a3bf07b0b','XXL',4),
('c7b9a689-a0d0-11ef-bf7a-bc2411d1c354','e39594fd-4154-409f-a7c7-d4d11dca7ce1','S',4),
('c7b9a693-a0d0-11ef-bf7a-bc2411d1c354','e39594fd-4154-409f-a7c7-d4d11dca7ce1','M',4),
('c7b9a69d-a0d0-11ef-bf7a-bc2411d1c354','e39594fd-4154-409f-a7c7-d4d11dca7ce1','L',10),
('c7b9a6a7-a0d0-11ef-bf7a-bc2411d1c354','e39594fd-4154-409f-a7c7-d4d11dca7ce1','XL',10),
('c7b9a6b2-a0d0-11ef-bf7a-bc2411d1c354','e39594fd-4154-409f-a7c7-d4d11dca7ce1','XXL',4),
('c7b9a6be-a0d0-11ef-bf7a-bc2411d1c354','0d165e31-b554-4535-b3fc-d8996a357921','S',4),
('c7b9a6c9-a0d0-11ef-bf7a-bc2411d1c354','0d165e31-b554-4535-b3fc-d8996a357921','M',4),
('c7b9a6d4-a0d0-11ef-bf7a-bc2411d1c354','0d165e31-b554-4535-b3fc-d8996a357921','L',10),
('c7b9a6de-a0d0-11ef-bf7a-bc2411d1c354','0d165e31-b554-4535-b3fc-d8996a357921','XL',10),
('c7b9a6e9-a0d0-11ef-bf7a-bc2411d1c354','0d165e31-b554-4535-b3fc-d8996a357921','XXL',4),
('c7b9a6f6-a0d0-11ef-bf7a-bc2411d1c354','4af3369c-a41e-4ada-9130-e835ca50a328','S',4),
('c7b9a701-a0d0-11ef-bf7a-bc2411d1c354','4af3369c-a41e-4ada-9130-e835ca50a328','M',4),
('c7b9a70b-a0d0-11ef-bf7a-bc2411d1c354','4af3369c-a41e-4ada-9130-e835ca50a328','L',10),
('c7b9a714-a0d0-11ef-bf7a-bc2411d1c354','4af3369c-a41e-4ada-9130-e835ca50a328','XL',10),
('c7b9a71e-a0d0-11ef-bf7a-bc2411d1c354','4af3369c-a41e-4ada-9130-e835ca50a328','XXL',4),
('c7b9a72b-a0d0-11ef-bf7a-bc2411d1c354','4911204f-3201-4470-9f54-f43c7ae1a832','S',4),
('c7b9a736-a0d0-11ef-bf7a-bc2411d1c354','4911204f-3201-4470-9f54-f43c7ae1a832','M',4),
('c7b9a740-a0d0-11ef-bf7a-bc2411d1c354','4911204f-3201-4470-9f54-f43c7ae1a832','L',10),
('c7b9a74a-a0d0-11ef-bf7a-bc2411d1c354','4911204f-3201-4470-9f54-f43c7ae1a832','XL',10),
('c7b9a755-a0d0-11ef-bf7a-bc2411d1c354','4911204f-3201-4470-9f54-f43c7ae1a832','XXL',4);
/*!40000 ALTER TABLE `blackwilbur_productvariation` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `blackwilbur_rating`
--

DROP TABLE IF EXISTS `blackwilbur_rating`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `blackwilbur_rating` (
  `id` uuid NOT NULL,
  `rating` int(10) unsigned NOT NULL CHECK (`rating` >= 0),
  `created_at` datetime(6) NOT NULL,
  `product_id` uuid NOT NULL,
  `user_id` uuid NOT NULL,
  PRIMARY KEY (`id`),
  KEY `blackwilbur_rating_product_id_0e969473_fk_blackwilbur_product_id` (`product_id`),
  KEY `blackwilbur_rating_user_id_f4bea733_fk_blackwilbur_user_id` (`user_id`),
  CONSTRAINT `blackwilbur_rating_product_id_0e969473_fk_blackwilbur_product_id` FOREIGN KEY (`product_id`) REFERENCES `blackwilbur_product` (`id`),
  CONSTRAINT `blackwilbur_rating_user_id_f4bea733_fk_blackwilbur_user_id` FOREIGN KEY (`user_id`) REFERENCES `blackwilbur_user` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `blackwilbur_rating`
--

LOCK TABLES `blackwilbur_rating` WRITE;
/*!40000 ALTER TABLE `blackwilbur_rating` DISABLE KEYS */;
/*!40000 ALTER TABLE `blackwilbur_rating` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `blackwilbur_user`
--

DROP TABLE IF EXISTS `blackwilbur_user`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `blackwilbur_user` (
  `password` varchar(128) NOT NULL,
  `last_login` datetime(6) DEFAULT NULL,
  `is_superuser` tinyint(1) NOT NULL,
  `first_name` varchar(150) NOT NULL,
  `last_name` varchar(150) NOT NULL,
  `is_staff` tinyint(1) NOT NULL,
  `is_active` tinyint(1) NOT NULL,
  `date_joined` datetime(6) NOT NULL,
  `id` uuid NOT NULL,
  `email` varchar(254) NOT NULL,
  `phone_number` varchar(15) DEFAULT NULL,
  `address_line_1` varchar(255) DEFAULT NULL,
  `address_line_2` varchar(255) DEFAULT NULL,
  `city` varchar(100) DEFAULT NULL,
  `state` varchar(100) DEFAULT NULL,
  `zip_code` varchar(20) DEFAULT NULL,
  `country` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `blackwilbur_user`
--

LOCK TABLES `blackwilbur_user` WRITE;
/*!40000 ALTER TABLE `blackwilbur_user` DISABLE KEYS */;
/*!40000 ALTER TABLE `blackwilbur_user` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `blackwilbur_user_groups`
--

DROP TABLE IF EXISTS `blackwilbur_user_groups`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `blackwilbur_user_groups` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `user_id` uuid NOT NULL,
  `group_id` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `blackwilbur_user_groups_user_id_group_id_aa046af1_uniq` (`user_id`,`group_id`),
  KEY `blackwilbur_user_groups_group_id_f7b13be0_fk_auth_group_id` (`group_id`),
  CONSTRAINT `blackwilbur_user_groups_group_id_f7b13be0_fk_auth_group_id` FOREIGN KEY (`group_id`) REFERENCES `auth_group` (`id`),
  CONSTRAINT `blackwilbur_user_groups_user_id_e26b65ea_fk_blackwilbur_user_id` FOREIGN KEY (`user_id`) REFERENCES `blackwilbur_user` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `blackwilbur_user_groups`
--

LOCK TABLES `blackwilbur_user_groups` WRITE;
/*!40000 ALTER TABLE `blackwilbur_user_groups` DISABLE KEYS */;
/*!40000 ALTER TABLE `blackwilbur_user_groups` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `blackwilbur_user_user_permissions`
--

DROP TABLE IF EXISTS `blackwilbur_user_user_permissions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `blackwilbur_user_user_permissions` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `user_id` uuid NOT NULL,
  `permission_id` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `blackwilbur_user_user_pe_user_id_permission_id_e48e7a5e_uniq` (`user_id`,`permission_id`),
  KEY `blackwilbur_user_use_permission_id_1ba5fb82_fk_auth_perm` (`permission_id`),
  CONSTRAINT `blackwilbur_user_use_permission_id_1ba5fb82_fk_auth_perm` FOREIGN KEY (`permission_id`) REFERENCES `auth_permission` (`id`),
  CONSTRAINT `blackwilbur_user_use_user_id_0ac3a3df_fk_blackwilb` FOREIGN KEY (`user_id`) REFERENCES `blackwilbur_user` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `blackwilbur_user_user_permissions`
--

LOCK TABLES `blackwilbur_user_user_permissions` WRITE;
/*!40000 ALTER TABLE `blackwilbur_user_user_permissions` DISABLE KEYS */;
/*!40000 ALTER TABLE `blackwilbur_user_user_permissions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `blackwilbur_wishlist`
--

DROP TABLE IF EXISTS `blackwilbur_wishlist`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `blackwilbur_wishlist` (
  `id` uuid NOT NULL,
  `user_id` uuid NOT NULL,
  PRIMARY KEY (`id`),
  KEY `blackwilbur_wishlist_user_id_1e5d194d_fk_blackwilbur_user_id` (`user_id`),
  CONSTRAINT `blackwilbur_wishlist_user_id_1e5d194d_fk_blackwilbur_user_id` FOREIGN KEY (`user_id`) REFERENCES `blackwilbur_user` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `blackwilbur_wishlist`
--

LOCK TABLES `blackwilbur_wishlist` WRITE;
/*!40000 ALTER TABLE `blackwilbur_wishlist` DISABLE KEYS */;
/*!40000 ALTER TABLE `blackwilbur_wishlist` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `blackwilbur_wishlist_products`
--

DROP TABLE IF EXISTS `blackwilbur_wishlist_products`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `blackwilbur_wishlist_products` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `wishlist_id` uuid NOT NULL,
  `product_id` uuid NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `blackwilbur_wishlist_pro_wishlist_id_product_id_57dc8d92_uniq` (`wishlist_id`,`product_id`),
  KEY `blackwilbur_wishlist_product_id_997deeea_fk_blackwilb` (`product_id`),
  CONSTRAINT `blackwilbur_wishlist_product_id_997deeea_fk_blackwilb` FOREIGN KEY (`product_id`) REFERENCES `blackwilbur_product` (`id`),
  CONSTRAINT `blackwilbur_wishlist_wishlist_id_6dfc9e2c_fk_blackwilb` FOREIGN KEY (`wishlist_id`) REFERENCES `blackwilbur_wishlist` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `blackwilbur_wishlist_products`
--

LOCK TABLES `blackwilbur_wishlist_products` WRITE;
/*!40000 ALTER TABLE `blackwilbur_wishlist_products` DISABLE KEYS */;
/*!40000 ALTER TABLE `blackwilbur_wishlist_products` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `django_admin_log`
--

DROP TABLE IF EXISTS `django_admin_log`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `django_admin_log` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `action_time` datetime(6) NOT NULL,
  `object_id` longtext DEFAULT NULL,
  `object_repr` varchar(200) NOT NULL,
  `action_flag` smallint(5) unsigned NOT NULL CHECK (`action_flag` >= 0),
  `change_message` longtext NOT NULL,
  `content_type_id` int(11) DEFAULT NULL,
  `user_id` uuid NOT NULL,
  PRIMARY KEY (`id`),
  KEY `django_admin_log_content_type_id_c4bce8eb_fk_django_co` (`content_type_id`),
  KEY `django_admin_log_user_id_c564eba6_fk_blackwilbur_user_id` (`user_id`),
  CONSTRAINT `django_admin_log_content_type_id_c4bce8eb_fk_django_co` FOREIGN KEY (`content_type_id`) REFERENCES `django_content_type` (`id`),
  CONSTRAINT `django_admin_log_user_id_c564eba6_fk_blackwilbur_user_id` FOREIGN KEY (`user_id`) REFERENCES `blackwilbur_user` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `django_admin_log`
--

LOCK TABLES `django_admin_log` WRITE;
/*!40000 ALTER TABLE `django_admin_log` DISABLE KEYS */;
/*!40000 ALTER TABLE `django_admin_log` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `django_content_type`
--

DROP TABLE IF EXISTS `django_content_type`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `django_content_type` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `app_label` varchar(100) NOT NULL,
  `model` varchar(100) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `django_content_type_app_label_model_76bd3d3b_uniq` (`app_label`,`model`)
) ENGINE=InnoDB AUTO_INCREMENT=20 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `django_content_type`
--

LOCK TABLES `django_content_type` WRITE;
/*!40000 ALTER TABLE `django_content_type` DISABLE KEYS */;
INSERT INTO `django_content_type` VALUES
(1,'admin','logentry'),
(3,'auth','group'),
(2,'auth','permission'),
(13,'blackwilbur','cart'),
(17,'blackwilbur','cartitem'),
(6,'blackwilbur','category'),
(7,'blackwilbur','discount'),
(8,'blackwilbur','distributionpartnership'),
(9,'blackwilbur','image'),
(10,'blackwilbur','newslettersubscription'),
(14,'blackwilbur','order'),
(16,'blackwilbur','orderitem'),
(15,'blackwilbur','product'),
(11,'blackwilbur','productvariation'),
(18,'blackwilbur','rating'),
(12,'blackwilbur','user'),
(19,'blackwilbur','wishlist'),
(4,'contenttypes','contenttype'),
(5,'sessions','session');
/*!40000 ALTER TABLE `django_content_type` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `django_migrations`
--

DROP TABLE IF EXISTS `django_migrations`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `django_migrations` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `app` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `applied` datetime(6) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=23 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `django_migrations`
--

LOCK TABLES `django_migrations` WRITE;
/*!40000 ALTER TABLE `django_migrations` DISABLE KEYS */;
INSERT INTO `django_migrations` VALUES
(1,'contenttypes','0001_initial','2024-11-12 06:50:15.335626'),
(2,'contenttypes','0002_remove_content_type_name','2024-11-12 06:50:15.349616'),
(3,'auth','0001_initial','2024-11-12 06:50:15.398670'),
(4,'auth','0002_alter_permission_name_max_length','2024-11-12 06:50:15.408366'),
(5,'auth','0003_alter_user_email_max_length','2024-11-12 06:50:15.410923'),
(6,'auth','0004_alter_user_username_opts','2024-11-12 06:50:15.413415'),
(7,'auth','0005_alter_user_last_login_null','2024-11-12 06:50:15.415853'),
(8,'auth','0006_require_contenttypes_0002','2024-11-12 06:50:15.416502'),
(9,'auth','0007_alter_validators_add_error_messages','2024-11-12 06:50:15.418811'),
(10,'auth','0008_alter_user_username_max_length','2024-11-12 06:50:15.421212'),
(11,'auth','0009_alter_user_last_name_max_length','2024-11-12 06:50:15.423640'),
(12,'auth','0010_alter_group_name_max_length','2024-11-12 06:50:15.430393'),
(13,'auth','0011_update_proxy_permissions','2024-11-12 06:50:15.432671'),
(14,'auth','0012_alter_user_first_name_max_length','2024-11-12 06:50:15.434890'),
(15,'blackwilbur','0001_initial','2024-11-12 06:50:15.697608'),
(16,'admin','0001_initial','2024-11-12 06:50:15.726489'),
(17,'admin','0002_logentry_remove_auto_add','2024-11-12 06:50:15.734261'),
(18,'admin','0003_logentry_add_action_flag_choices','2024-11-12 06:50:15.740640'),
(19,'blackwilbur','0002_order_transaction_id','2024-11-12 06:50:15.752917'),
(20,'blackwilbur','0003_discount_discount_type_discount_quantity_threshold_and_more','2024-11-12 06:50:15.778423'),
(21,'blackwilbur','0004_alter_product_price','2024-11-12 06:50:15.785519'),
(22,'sessions','0001_initial','2024-11-12 06:50:15.793801');
/*!40000 ALTER TABLE `django_migrations` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `django_session`
--

DROP TABLE IF EXISTS `django_session`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `django_session` (
  `session_key` varchar(40) NOT NULL,
  `session_data` longtext NOT NULL,
  `expire_date` datetime(6) NOT NULL,
  PRIMARY KEY (`session_key`),
  KEY `django_session_expire_date_a5c62663` (`expire_date`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `django_session`
--

LOCK TABLES `django_session` WRITE;
/*!40000 ALTER TABLE `django_session` DISABLE KEYS */;
/*!40000 ALTER TABLE `django_session` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2024-11-12  9:29:35
