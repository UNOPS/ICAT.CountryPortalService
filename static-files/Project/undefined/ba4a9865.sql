-- MySQL dump 10.13  Distrib 8.0.27, for Win64 (x86_64)
--
-- Host: localhost    Database: portelservice
-- ------------------------------------------------------
-- Server version	8.0.28-0ubuntu0.20.04.3

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `EmissionReductionDraftData`
--

DROP TABLE IF EXISTS `EmissionReductionDraftData`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `EmissionReductionDraftData` (
  `createdBy` varchar(255) DEFAULT NULL,
  `createdOn` datetime DEFAULT NULL,
  `editedBy` varchar(255) DEFAULT NULL,
  `editedOn` datetime DEFAULT NULL,
  `status` int NOT NULL DEFAULT '0',
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) DEFAULT NULL,
  `description` varchar(2500) DEFAULT NULL,
  `sortOrder` int NOT NULL DEFAULT '1',
  `baseYear` varchar(255) NOT NULL,
  `baseYearEmission` int NOT NULL,
  `targetYear` varchar(255) NOT NULL,
  `targetYearEmission` int NOT NULL,
  `unconditionaltco2` int DEFAULT NULL,
  `conditionaltco2` int DEFAULT NULL,
  `countryId` int DEFAULT NULL,
  `sectorId` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FK_903d3bbe21046e31495e9a0ec03` (`countryId`),
  KEY `FK_3aec1cc3c2511fc0edb63dd6b21` (`sectorId`),
  CONSTRAINT `FK_3aec1cc3c2511fc0edb63dd6b21` FOREIGN KEY (`sectorId`) REFERENCES `sector` (`id`),
  CONSTRAINT `FK_903d3bbe21046e31495e9a0ec03` FOREIGN KEY (`countryId`) REFERENCES `country` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `EmissionReductionDraftData`
--

LOCK TABLES `EmissionReductionDraftData` WRITE;
/*!40000 ALTER TABLE `EmissionReductionDraftData` DISABLE KEYS */;
INSERT INTO `EmissionReductionDraftData` VALUES ('-','2022-03-03 08:28:08','-','2022-03-03 08:28:08',0,1,NULL,NULL,1,'2016',125,'2030',155,60,91,1,1);
/*!40000 ALTER TABLE `EmissionReductionDraftData` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `applicability`
--

DROP TABLE IF EXISTS `applicability`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `applicability` (
  `createdBy` varchar(255) DEFAULT NULL,
  `createdOn` datetime DEFAULT NULL,
  `editedBy` varchar(255) DEFAULT NULL,
  `editedOn` datetime DEFAULT NULL,
  `status` int NOT NULL DEFAULT '0',
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) DEFAULT NULL,
  `description` varchar(2500) DEFAULT NULL,
  `sortOrder` int NOT NULL DEFAULT '1',
  `assessmentId` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FK_e5ad0e8cc607797a5183636e596` (`assessmentId`),
  CONSTRAINT `FK_e5ad0e8cc607797a5183636e596` FOREIGN KEY (`assessmentId`) REFERENCES `assessment` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `applicability`
--

LOCK TABLES `applicability` WRITE;
/*!40000 ALTER TABLE `applicability` DISABLE KEYS */;
INSERT INTO `applicability` VALUES (NULL,'2022-02-11 07:11:36',NULL,'2022-02-11 07:11:36',0,1,'Estimates the impact of fuel pricing policies on GHG emissions in the road transport sector','Estimates the impact of fuel pricing policies on GHG emissions in the road transport sector',1,NULL),(NULL,'2022-02-11 07:11:36',NULL,'2022-02-11 07:11:36',0,2,'Reduce traffic congestion','Reduce traffic congestion',2,NULL),(NULL,'2022-02-11 07:11:36',NULL,'2022-02-11 07:11:36',0,3,'Shift passenger from road to rail','Shift passenger from road to rail',3,NULL),(NULL,'2022-02-11 07:11:36',NULL,'2022-02-11 07:11:36',0,4,'Introduce vehicles with lower emissions per kilometer','Introduce vehicles with lower emissions per kilometer',4,NULL);
/*!40000 ALTER TABLE `applicability` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `assessment`
--

DROP TABLE IF EXISTS `assessment`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `assessment` (
  `createdBy` varchar(255) DEFAULT NULL,
  `createdOn` datetime DEFAULT NULL,
  `editedBy` varchar(255) DEFAULT NULL,
  `editedOn` datetime DEFAULT NULL,
  `status` int NOT NULL DEFAULT '0',
  `id` int NOT NULL AUTO_INCREMENT,
  `baseYear` int DEFAULT NULL,
  `projectStartDate` datetime DEFAULT NULL,
  `projectDuration` int DEFAULT NULL,
  `assessmentStage` varchar(255) DEFAULT NULL,
  `assessmentStatus` int NOT NULL DEFAULT '0',
  `assessmentType` varchar(255) DEFAULT NULL,
  `emmisionReductionValue` int DEFAULT NULL,
  `macValue` int DEFAULT NULL,
  `baselineScenario` varchar(255) DEFAULT NULL,
  `projectScenario` varchar(255) DEFAULT NULL,
  `isGuided` tinyint DEFAULT NULL,
  `isProposal` tinyint DEFAULT NULL,
  `lekageScenario` varchar(255) DEFAULT NULL,
  `projectionIndicator` varchar(255) DEFAULT NULL,
  `projectionBaseYear` int DEFAULT NULL,
  `easyOfUseDataCollection` varchar(255) DEFAULT NULL,
  `methodologyCode` varchar(255) DEFAULT NULL,
  `methodologyVersion` varchar(255) DEFAULT NULL,
  `countryId` int DEFAULT NULL,
  `methodologyId` int DEFAULT NULL,
  `userId` int DEFAULT NULL,
  `projectId` int DEFAULT NULL,
  `mitigationActionTypeId` int DEFAULT NULL,
  `ndcId` int DEFAULT NULL,
  `subNdcId` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FK_931a485488275ee306fde6f089c` (`countryId`),
  KEY `FK_6195d7baa268a1a0df1d8890b4d` (`methodologyId`),
  KEY `FK_95c69761e5ad360968c52a4c6af` (`userId`),
  KEY `FK_348255d2c8f960bdbec373dd722` (`projectId`),
  KEY `FK_4ea98d88a3eccb180237b353eb8` (`mitigationActionTypeId`),
  KEY `FK_ba63a30d14e147471a76b8650a1` (`ndcId`),
  KEY `FK_2866c64bc8d4a949fe1953246bc` (`subNdcId`),
  CONSTRAINT `FK_2866c64bc8d4a949fe1953246bc` FOREIGN KEY (`subNdcId`) REFERENCES `sub_ndc` (`id`),
  CONSTRAINT `FK_348255d2c8f960bdbec373dd722` FOREIGN KEY (`projectId`) REFERENCES `climateAction` (`id`),
  CONSTRAINT `FK_4ea98d88a3eccb180237b353eb8` FOREIGN KEY (`mitigationActionTypeId`) REFERENCES `mitigationActionType` (`id`),
  CONSTRAINT `FK_6195d7baa268a1a0df1d8890b4d` FOREIGN KEY (`methodologyId`) REFERENCES `methodology` (`id`),
  CONSTRAINT `FK_931a485488275ee306fde6f089c` FOREIGN KEY (`countryId`) REFERENCES `country` (`id`),
  CONSTRAINT `FK_95c69761e5ad360968c52a4c6af` FOREIGN KEY (`userId`) REFERENCES `user` (`id`),
  CONSTRAINT `FK_ba63a30d14e147471a76b8650a1` FOREIGN KEY (`ndcId`) REFERENCES `ndc` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=75 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `assessment`
--

LOCK TABLES `assessment` WRITE;
/*!40000 ALTER TABLE `assessment` DISABLE KEYS */;
INSERT INTO `assessment` VALUES ('','2022-03-02 16:45:19','','2022-03-02 16:45:19',0,54,2010,'2027-07-06 18:30:00',20,NULL,0,'Ex post',NULL,NULL,'erffd','mmfgfgf',0,0,'',NULL,NULL,NULL,'cdm_ams_iii_s','1',NULL,1,NULL,3,NULL,2,2),('','2022-03-03 05:32:12','','2022-03-03 05:32:12',0,55,2020,'2024-12-31 18:30:00',5,NULL,0,'Ex anthe',NULL,NULL,'Without fuel tax','With fuel tax',0,0,'','Population Growth (POP)',2025,NULL,'ICAT_TPM_FSR_2020_A','1',NULL,3,NULL,7,NULL,1,1),('','2022-03-03 06:40:44','','2022-03-03 06:40:44',0,56,2020,'2027-07-06 18:30:00',20,NULL,0,'Ex post',NULL,NULL,'hjsdjj','dwa',0,1,'',NULL,NULL,NULL,'ICAT_TPM_FSR_2020_B','1',NULL,4,NULL,3,NULL,2,2),('','2022-03-03 06:58:01','','2022-03-03 06:58:01',0,57,NULL,'2027-07-06 18:30:00',20,NULL,0,'MAC',12,-39,NULL,NULL,NULL,1,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,3,NULL,NULL,NULL),('','2022-03-03 08:26:09','','2022-03-03 08:26:09',0,58,2020,'2027-07-06 18:30:00',20,NULL,0,NULL,NULL,NULL,'aaa','ddd',0,1,'',NULL,NULL,NULL,'cdm_ams_iii_s','1',NULL,1,NULL,3,NULL,2,2),('','2022-03-03 08:37:58','','2022-03-03 08:37:58',0,59,2010,'2022-02-03 18:30:00',20,NULL,0,'Ex post',NULL,NULL,'dfdf','fdfddf',0,1,'',NULL,NULL,NULL,'cdm_ams_iii_s','1',NULL,1,NULL,6,NULL,2,2),('','2022-03-03 08:38:18','','2022-03-03 08:38:18',0,60,2020,'2023-03-15 18:30:00',2,NULL,0,'Ex anthe',NULL,NULL,'Diesel vehicles for passenger transportation','CNG Vehicles for passenger transportation',0,0,'','Population Growth (POP)',2023,NULL,'cdm_ams_iii_s','1',NULL,1,NULL,18,NULL,2,2),('','2022-03-03 08:42:14','','2022-03-03 08:42:14',0,61,2010,'2027-07-06 18:30:00',20,NULL,0,'Ex post',NULL,NULL,'wew','mmfgfgf',0,1,'',NULL,NULL,NULL,'ICAT_TPM_RP_2020_Toll_roads','1',NULL,2,NULL,3,NULL,2,2),('','2022-03-03 08:44:56','','2022-03-03 08:44:56',0,62,2020,'2027-07-06 18:30:00',20,NULL,0,NULL,NULL,NULL,'rrff','mmfgfgf',0,1,'',NULL,NULL,NULL,'cdm_ams_iii_s','1',NULL,1,NULL,3,NULL,2,2),('','2022-03-03 09:02:51','','2022-03-03 09:02:51',0,63,2020,'2027-07-06 18:30:00',20,NULL,0,'Ex post',NULL,NULL,'','',0,1,'',NULL,NULL,NULL,'cdm_ams_iii_s','1',NULL,1,NULL,3,NULL,2,2),('','2022-03-03 10:16:53','','2022-03-03 10:16:53',0,64,2020,'2027-07-06 18:30:00',20,NULL,0,'Ex post',NULL,NULL,'www','ddd',0,1,'',NULL,NULL,NULL,'cdm_ams_iii_s','1',NULL,1,NULL,3,NULL,2,2),('','2022-03-03 10:26:28','','2022-03-03 10:26:28',0,65,2020,'2027-07-06 18:30:00',20,NULL,0,'Ex post',NULL,NULL,'aa','ddd',0,1,'',NULL,NULL,NULL,'cdm_ams_iii_s','1',NULL,1,NULL,3,NULL,2,2),('','2022-03-03 10:44:04','','2022-03-03 10:44:04',0,66,2020,'2022-02-03 18:30:00',20,NULL,0,'Ex post',NULL,NULL,'','',0,1,'',NULL,NULL,NULL,'cdm_ams_iii_s','1',NULL,1,NULL,6,NULL,2,2),('','2022-03-03 10:49:02','','2022-03-03 10:49:02',0,67,2020,'2027-07-06 18:30:00',20,NULL,0,'Ex post',NULL,NULL,'','',0,1,'',NULL,NULL,NULL,'cdm_ams_iii_s','1',NULL,1,NULL,3,NULL,2,2),('','2022-03-03 10:56:11','','2022-03-03 10:56:11',0,68,2022,'2027-07-06 18:30:00',20,NULL,0,'Ex post',NULL,NULL,'','',0,1,'',NULL,NULL,NULL,'cdm_ams_iii_s','1',NULL,1,NULL,3,NULL,2,2),('','2022-03-03 11:00:33','','2022-03-03 11:00:33',0,69,2020,'2024-12-31 18:30:00',5,NULL,0,'Ex post',NULL,NULL,'','',0,1,'',NULL,NULL,NULL,'cdm_ams_iii_s','1',NULL,1,NULL,7,NULL,1,1),('','2022-03-03 11:09:04','','2022-03-03 11:09:04',0,70,2020,'2027-07-06 18:30:00',20,NULL,0,'Ex post',NULL,NULL,'','',0,1,'',NULL,NULL,NULL,'cdm_ams_iii_s','1',NULL,1,NULL,3,NULL,2,2),('','2022-03-03 11:28:50','','2022-03-03 11:28:50',0,71,2022,'2022-02-03 18:30:00',20,NULL,0,'Ex post',NULL,NULL,'','',0,1,'',NULL,NULL,NULL,'cdm_ams_iii_s','1',NULL,1,NULL,6,NULL,2,2),('','2022-03-03 11:49:07','','2022-03-03 11:49:07',0,72,2020,'2023-02-22 18:30:00',5,NULL,0,'Ex post',NULL,NULL,'','',0,1,'',NULL,NULL,NULL,'cdm_ams_iii_s','1',NULL,1,NULL,9,NULL,2,2),('','2022-03-03 11:55:29','','2022-03-03 11:55:29',0,73,2020,'2019-12-31 18:30:00',10,NULL,0,'Ex post',NULL,NULL,'','',0,1,'',NULL,NULL,NULL,'cdm_ams_iii_s','1',NULL,1,NULL,8,NULL,1,1),('','2022-03-03 12:47:43','','2022-03-03 12:47:43',0,74,2020,'2027-07-06 18:30:00',20,NULL,0,'Ex post',NULL,NULL,'dsdss','mmfgfgf',NULL,0,'',NULL,NULL,NULL,'cdm_ams_iii_s','1',NULL,1,NULL,3,NULL,2,2);
/*!40000 ALTER TABLE `assessment` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `assessmentObjective`
--

DROP TABLE IF EXISTS `assessmentObjective`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `assessmentObjective` (
  `createdBy` varchar(255) DEFAULT NULL,
  `createdOn` datetime DEFAULT NULL,
  `editedBy` varchar(255) DEFAULT NULL,
  `editedOn` datetime DEFAULT NULL,
  `status` int NOT NULL DEFAULT '0',
  `id` int NOT NULL AUTO_INCREMENT,
  `objective` varchar(255) NOT NULL,
  `assessmentId` int DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=15 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `assessmentObjective`
--

LOCK TABLES `assessmentObjective` WRITE;
/*!40000 ALTER TABLE `assessmentObjective` DISABLE KEYS */;
INSERT INTO `assessmentObjective` VALUES (NULL,'2022-02-01 18:46:50',NULL,'2022-02-01 18:46:50',0,1,'Prioritize policies',NULL),(NULL,'2022-02-01 18:46:50',NULL,'2022-02-01 18:46:50',0,2,'Mitigation planning',NULL),(NULL,'2022-02-01 18:46:50',NULL,'2022-02-01 18:46:50',0,3,'Report results',NULL),(NULL,'2022-02-01 18:46:50',NULL,'2022-02-01 18:46:50',0,4,'Emission trading',NULL),(NULL,NULL,NULL,NULL,0,14,'test',57);
/*!40000 ALTER TABLE `assessmentObjective` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `assessmentYear`
--

DROP TABLE IF EXISTS `assessmentYear`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `assessmentYear` (
  `createdBy` varchar(255) DEFAULT NULL,
  `createdOn` datetime DEFAULT NULL,
  `editedBy` varchar(255) DEFAULT NULL,
  `editedOn` datetime DEFAULT NULL,
  `status` int NOT NULL DEFAULT '0',
  `id` int NOT NULL AUTO_INCREMENT,
  `assessmentYear` varchar(255) NOT NULL,
  `qaStatus` int DEFAULT NULL,
  `qaDeadline` datetime DEFAULT NULL,
  `qaAssighnDate` datetime DEFAULT NULL,
  `verificationUser` int DEFAULT NULL,
  `verificationStatus` int DEFAULT NULL,
  `verificationAssighnDate` datetime DEFAULT NULL,
  `verificationDeadline` datetime DEFAULT NULL,
  `verifierComment` varchar(255) DEFAULT NULL,
  `isVerificationSuccess` tinyint NOT NULL DEFAULT '0',
  `assessmentId` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FK_4ae20ec4ff6ca5b478ac31269a2` (`assessmentId`),
  CONSTRAINT `FK_4ae20ec4ff6ca5b478ac31269a2` FOREIGN KEY (`assessmentId`) REFERENCES `assessment` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=67 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `assessmentYear`
--

LOCK TABLES `assessmentYear` WRITE;
/*!40000 ALTER TABLE `assessmentYear` DISABLE KEYS */;
INSERT INTO `assessmentYear` VALUES (NULL,NULL,NULL,NULL,0,46,'2024',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,0,54),(NULL,NULL,NULL,NULL,0,47,'2025',2,NULL,NULL,NULL,NULL,NULL,NULL,NULL,0,55),(NULL,NULL,NULL,NULL,0,48,'2020',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,0,56),(NULL,NULL,NULL,NULL,0,49,'2020',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,0,57),(NULL,NULL,NULL,NULL,0,50,'2022',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,0,58),(NULL,NULL,NULL,NULL,0,51,'2020',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,0,59),(NULL,NULL,NULL,NULL,0,52,'2023',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,0,60),(NULL,NULL,NULL,NULL,0,53,'2021',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,0,61),(NULL,NULL,NULL,NULL,0,54,'2022',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,0,62),(NULL,NULL,NULL,NULL,0,55,'2023',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,0,63),(NULL,NULL,NULL,NULL,0,56,'2022',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,0,64),(NULL,NULL,NULL,NULL,0,57,'2028',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,0,65),(NULL,NULL,NULL,NULL,0,58,'2022',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,0,66),(NULL,NULL,NULL,NULL,0,59,'2022',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,0,67),(NULL,NULL,NULL,NULL,0,60,'2028',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,0,68),(NULL,NULL,NULL,NULL,0,61,'2022',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,0,69),(NULL,NULL,NULL,NULL,0,62,'2024',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,0,70),(NULL,NULL,NULL,NULL,0,63,'2024',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,0,71),(NULL,NULL,NULL,NULL,0,64,'2024',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,0,72),(NULL,NULL,NULL,NULL,0,65,'2028',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,0,73),(NULL,NULL,NULL,NULL,0,66,'1993',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,0,74);
/*!40000 ALTER TABLE `assessmentYear` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `assessment_applicability_applicability`
--

DROP TABLE IF EXISTS `assessment_applicability_applicability`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `assessment_applicability_applicability` (
  `assessmentId` int NOT NULL,
  `applicabilityId` int NOT NULL,
  PRIMARY KEY (`assessmentId`,`applicabilityId`),
  KEY `IDX_2b1d8641b4ac0095f5c4a1acb8` (`assessmentId`),
  KEY `IDX_899cf5b6ae66de5a2f715f2c98` (`applicabilityId`),
  CONSTRAINT `FK_2b1d8641b4ac0095f5c4a1acb8c` FOREIGN KEY (`assessmentId`) REFERENCES `assessment` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `FK_899cf5b6ae66de5a2f715f2c987` FOREIGN KEY (`applicabilityId`) REFERENCES `applicability` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `assessment_applicability_applicability`
--

LOCK TABLES `assessment_applicability_applicability` WRITE;
/*!40000 ALTER TABLE `assessment_applicability_applicability` DISABLE KEYS */;
/*!40000 ALTER TABLE `assessment_applicability_applicability` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `assessment_assessment_objective_assessment_objective`
--

DROP TABLE IF EXISTS `assessment_assessment_objective_assessment_objective`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `assessment_assessment_objective_assessment_objective` (
  `assessmentId` int NOT NULL,
  `assessmentObjectiveId` int NOT NULL,
  PRIMARY KEY (`assessmentId`,`assessmentObjectiveId`),
  KEY `IDX_0cf100c4d91809032232bdc555` (`assessmentId`),
  KEY `IDX_77ee65132daa3cd38cfeaba477` (`assessmentObjectiveId`),
  CONSTRAINT `FK_0cf100c4d91809032232bdc555b` FOREIGN KEY (`assessmentId`) REFERENCES `assessment` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT `FK_77ee65132daa3cd38cfeaba4771` FOREIGN KEY (`assessmentObjectiveId`) REFERENCES `assessmentObjective` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `assessment_assessment_objective_assessment_objective`
--

LOCK TABLES `assessment_assessment_objective_assessment_objective` WRITE;
/*!40000 ALTER TABLE `assessment_assessment_objective_assessment_objective` DISABLE KEYS */;
INSERT INTO `assessment_assessment_objective_assessment_objective` VALUES (54,4),(55,2),(56,1),(56,2),(56,3),(56,4),(58,4),(59,4),(60,4),(61,1),(61,2),(61,4),(62,2),(63,4),(64,4),(65,3),(66,4),(67,4),(68,4),(69,4),(70,4),(71,4),(72,4),(73,2),(74,4);
/*!40000 ALTER TABLE `assessment_assessment_objective_assessment_objective` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `assessmentResult`
--

DROP TABLE IF EXISTS `assessmentResult`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `assessmentResult` (
  `createdBy` varchar(255) DEFAULT NULL,
  `createdOn` datetime DEFAULT NULL,
  `editedBy` varchar(255) DEFAULT NULL,
  `editedOn` datetime DEFAULT NULL,
  `status` int NOT NULL DEFAULT '0',
  `id` int NOT NULL AUTO_INCREMENT,
  `baselineResult` int DEFAULT NULL,
  `baselineResultUnit` varchar(255) DEFAULT NULL,
  `projectResult` int DEFAULT NULL,
  `projectResultUnit` varchar(255) DEFAULT NULL,
  `lekageResult` int DEFAULT NULL,
  `lekageResultUnit` varchar(255) DEFAULT NULL,
  `totalEmission` int DEFAULT NULL,
  `totalEmissionUnit` varchar(255) DEFAULT NULL,
  `bsTotalAnnualCost` int DEFAULT NULL,
  `psTotalAnnualCost` int DEFAULT NULL,
  `costDifference` int DEFAULT NULL,
  `macResult` int DEFAULT NULL,
  `qcComment` varchar(255) DEFAULT NULL,
  `qcStatusBaselineResult` int DEFAULT NULL,
  `qcStatuProjectResult` int DEFAULT NULL,
  `qcStatusLekageResult` int DEFAULT NULL,
  `qcStatusTotalEmission` int DEFAULT NULL,
  `assessmentYearId` int DEFAULT NULL,
  `assessmentId` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `REL_2abaf0b68ee7cb1c55a5d51551` (`assessmentYearId`),
  KEY `FK_1df0eedfacc4a46a3811bf3de78` (`assessmentId`),
  CONSTRAINT `FK_1df0eedfacc4a46a3811bf3de78` FOREIGN KEY (`assessmentId`) REFERENCES `assessment` (`id`),
  CONSTRAINT `FK_2abaf0b68ee7cb1c55a5d515513` FOREIGN KEY (`assessmentYearId`) REFERENCES `assessmentYear` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=40 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `assessmentResult`
--

LOCK TABLES `assessmentResult` WRITE;
/*!40000 ALTER TABLE `assessmentResult` DISABLE KEYS */;
INSERT INTO `assessmentResult` VALUES ('-','2022-03-03 06:40:52','-','2022-03-03 06:40:52',0,26,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,48,56),('-','2022-03-03 06:58:02','-','2022-03-03 06:58:02',0,27,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,1363,896,-467,-39,NULL,NULL,NULL,NULL,NULL,49,57),('-','2022-03-03 08:26:21','-','2022-03-03 08:26:21',0,28,NULL,NULL,0,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,50,58),('-','2022-03-03 09:02:53','-','2022-03-03 09:02:53',0,29,1,NULL,1,NULL,NULL,NULL,0,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,55,63),('-','2022-03-03 10:16:56','-','2022-03-03 10:16:56',0,30,NULL,NULL,0,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,56,64),('-','2022-03-03 10:26:30','-','2022-03-03 10:26:30',0,31,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,57,65),('-','2022-03-03 10:44:06','-','2022-03-03 10:44:06',0,32,NULL,NULL,7560,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,58,66),('-','2022-03-03 10:49:05','-','2022-03-03 10:49:05',0,33,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,59,67),('-','2022-03-03 10:56:13','-','2022-03-03 10:56:13',0,34,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,60,68),('-','2022-03-03 11:00:35','-','2022-03-03 11:00:35',0,35,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,61,69),('-','2022-03-03 11:09:05','-','2022-03-03 11:09:05',0,36,NULL,NULL,216,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,62,70),('-','2022-03-03 11:28:54','-','2022-03-03 11:28:54',0,37,72,NULL,0,NULL,NULL,NULL,72,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,63,71),('-','2022-03-03 11:49:09','-','2022-03-03 11:49:09',0,38,0,NULL,0,NULL,NULL,NULL,0,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,64,72),('-','2022-03-03 11:55:32','-','2022-03-03 11:55:32',0,39,370,NULL,220,NULL,NULL,NULL,150,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,65,73);
/*!40000 ALTER TABLE `assessmentResult` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `audit`
--

DROP TABLE IF EXISTS `audit`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `audit` (
  `createdBy` varchar(255) DEFAULT NULL,
  `createdOn` datetime DEFAULT NULL,
  `editedBy` varchar(255) DEFAULT NULL,
  `editedOn` datetime DEFAULT NULL,
  `status` int NOT NULL DEFAULT '0',
  `id` int NOT NULL AUTO_INCREMENT,
  `userName` varchar(255) DEFAULT NULL,
  `action` varchar(255) NOT NULL,
  `comment` varchar(255) NOT NULL,
  `actionStatus` varchar(255) NOT NULL,
  `userType` varchar(255) NOT NULL,
  `userId` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FK_7ae389e858ad6f2c0c63112e387` (`userId`),
  CONSTRAINT `FK_7ae389e858ad6f2c0c63112e387` FOREIGN KEY (`userId`) REFERENCES `user` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `audit`
--

LOCK TABLES `audit` WRITE;
/*!40000 ALTER TABLE `audit` DISABLE KEYS */;
/*!40000 ALTER TABLE `audit` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `climateAction`
--

DROP TABLE IF EXISTS `climateAction`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `climateAction` (
  `createdBy` varchar(255) DEFAULT NULL,
  `createdOn` datetime DEFAULT NULL,
  `editedBy` varchar(255) DEFAULT NULL,
  `editedOn` datetime DEFAULT NULL,
  `status` int NOT NULL DEFAULT '0',
  `id` int NOT NULL AUTO_INCREMENT,
  `climateActionName` varchar(255) NOT NULL,
  `description` varchar(255) DEFAULT NULL,
  `contactPersoFullName` varchar(50) DEFAULT NULL,
  `email` varchar(30) DEFAULT NULL,
  `contactPersonDesignation` varchar(30) DEFAULT NULL,
  `telephoneNumber` varchar(255) NOT NULL,
  `mobileNumber` varchar(255) DEFAULT NULL,
  `institution` varchar(50) DEFAULT NULL,
  `projectScope` varchar(255) DEFAULT NULL,
  `acceptedDate` datetime DEFAULT NULL,
  `proposeDateofCommence` datetime NOT NULL,
  `duration` int NOT NULL DEFAULT '0',
  `baseScenarioProjectLife` int NOT NULL DEFAULT '0',
  `projectScenarioTotalInvestment` int NOT NULL DEFAULT '0',
  `baseScenarioTotalInvestment` int NOT NULL DEFAULT '0',
  `objective` varchar(500) DEFAULT NULL,
  `subNationalLevl1` varchar(255) DEFAULT NULL,
  `subNationalLevl2` varchar(255) DEFAULT NULL,
  `subNationalLevl3` varchar(255) DEFAULT NULL,
  `longitude` decimal(10,6) DEFAULT '0.000000',
  `latitude` decimal(10,6) DEFAULT '0.000000',
  `outcome` varchar(500) DEFAULT NULL,
  `currentProgress` varchar(500) DEFAULT NULL,
  `chgEmissions` varchar(255) DEFAULT NULL,
  `adaptationBenefits` varchar(500) DEFAULT NULL,
  `directSDBenefit` varchar(500) DEFAULT NULL,
  `indirectSDBenefit` varchar(500) DEFAULT NULL,
  `implementingEntity` varchar(255) DEFAULT NULL,
  `executingEntity` varchar(255) DEFAULT NULL,
  `partiesInvolved` varchar(300) DEFAULT NULL,
  `beneficiaries` varchar(300) DEFAULT NULL,
  `donors` varchar(100) DEFAULT NULL,
  `investors` varchar(100) DEFAULT NULL,
  `fundingOrganization` varchar(300) DEFAULT NULL,
  `initialInvestment` decimal(10,2) DEFAULT NULL,
  `annualFunding` decimal(10,2) DEFAULT NULL,
  `annualRevenue` decimal(10,2) DEFAULT NULL,
  `expectedRecurrentExpenditure` decimal(10,2) DEFAULT NULL,
  `projectRejectComment` varchar(255) DEFAULT NULL,
  `projectDataRequsetComment` varchar(255) DEFAULT NULL,
  `mappedInstitutionId` int DEFAULT NULL,
  `countryId` int DEFAULT NULL,
  `projectStatusId` int DEFAULT NULL,
  `sectorId` int DEFAULT NULL,
  `ndcId` int DEFAULT NULL,
  `subNdcId` int DEFAULT NULL,
  `projectOwnerId` int DEFAULT NULL,
  `financingSchemeId` int DEFAULT NULL,
  `mitigationActionTypeId` int DEFAULT NULL,
  `projectApprovalStatusId` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FK_8c67478ebaf885a17a7f3ba2a2a` (`mappedInstitutionId`),
  KEY `FK_cb90295360fb75053021ca56024` (`countryId`),
  KEY `FK_79d7612e07dc96cd3df4d950edf` (`projectStatusId`),
  KEY `FK_54f6375c9abf2c890c562ac0056` (`sectorId`),
  KEY `FK_36d6f99c9f32370899605512ba0` (`ndcId`),
  KEY `FK_bcd47c9800671dee99ff9126908` (`subNdcId`),
  KEY `FK_f85da9240db0ec0d457ae7d2052` (`projectOwnerId`),
  KEY `FK_33b4c4b6600f96de9b0e5105458` (`financingSchemeId`),
  KEY `FK_ed93c833d58a02fa54d5a28d331` (`mitigationActionTypeId`),
  KEY `FK_ec7b6550d5f7fdac3b35d05d545` (`projectApprovalStatusId`),
  CONSTRAINT `FK_33b4c4b6600f96de9b0e5105458` FOREIGN KEY (`financingSchemeId`) REFERENCES `financing_scheme` (`id`),
  CONSTRAINT `FK_36d6f99c9f32370899605512ba0` FOREIGN KEY (`ndcId`) REFERENCES `ndc` (`id`),
  CONSTRAINT `FK_54f6375c9abf2c890c562ac0056` FOREIGN KEY (`sectorId`) REFERENCES `sector` (`id`),
  CONSTRAINT `FK_79d7612e07dc96cd3df4d950edf` FOREIGN KEY (`projectStatusId`) REFERENCES `projectstatus` (`id`),
  CONSTRAINT `FK_8c67478ebaf885a17a7f3ba2a2a` FOREIGN KEY (`mappedInstitutionId`) REFERENCES `institution` (`id`),
  CONSTRAINT `FK_bcd47c9800671dee99ff9126908` FOREIGN KEY (`subNdcId`) REFERENCES `sub_ndc` (`id`),
  CONSTRAINT `FK_cb90295360fb75053021ca56024` FOREIGN KEY (`countryId`) REFERENCES `country` (`id`),
  CONSTRAINT `FK_ec7b6550d5f7fdac3b35d05d545` FOREIGN KEY (`projectApprovalStatusId`) REFERENCES `project_approval_status` (`id`),
  CONSTRAINT `FK_ed93c833d58a02fa54d5a28d331` FOREIGN KEY (`mitigationActionTypeId`) REFERENCES `mitigationActionType` (`id`),
  CONSTRAINT `FK_f85da9240db0ec0d457ae7d2052` FOREIGN KEY (`projectOwnerId`) REFERENCES `project_owner` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=21 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `climateAction`
--

LOCK TABLES `climateAction` WRITE;
/*!40000 ALTER TABLE `climateAction` DISABLE KEYS */;
INSERT INTO `climateAction` VALUES ('','2022-03-03 12:47:43','','2022-03-03 12:47:43',0,3,'Purchase 50 LNG buses to the SLTB',NULL,'Shyamika','shyamika@gmail.com','Officer','+999999999','+714047715','Ministry of Transport','Under this project MoE will purchase 50 LNG powered buses. These will be operated within the city limit in the first two years of the trial.',NULL,'2027-07-06 18:30:00',20,0,0,0,'1. To reduce the tail pipe emission\n2. Promote public  transportation system\n','Ghana','Kunso','Kunso',-1.453865,8.120032,'Introduce 50 buses to Kunso','Proposal has being submitted to budget allocation','Not available','Not applicable','Reduce the GHG emissions','Improve the quality of life','Transport Board','Transport Board','Ministry of Transport, Ministry of Energy','General Public','ADB',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,1,1,1,2,2,2,1,NULL,5),('','2022-02-26 04:34:42','','2022-02-26 04:34:42',0,6,'Introduction of CNG powered buses in the main cities of Nigeria',NULL,'Shyamika Shiwanthi','shyamika@gmail.com','Officer','+947140477','+947140477','Public transport Authority','Introduction of CNG powered buses in the main cities of Nigeria',NULL,'2022-02-03 18:30:00',20,0,0,0,'Reduce GHG emissions from transport sector',NULL,NULL,NULL,7.118073,8.288701,'Improve public transportation','Proposal submitted for the budget approval','Not applicable','Not applicable','Reduce GHG emissions','Improve quality of life','Public Transport Authority','Ministry of Transport','Road development Authority','General Public',NULL,NULL,NULL,NULL,NULL,NULL,NULL,'No','req',NULL,1,2,1,2,2,3,1,NULL,1),('','2022-03-03 05:32:12','','2022-03-03 05:32:12',0,7,'National fuel levy on gasoline and diesel that will target low duty vehicles in the form of a fixed  sum per litre by 2025',NULL,'P. P. K. Wijethunga','wijethunga@environment.gov.lk','Director','0115344111','0715344111','Ministry of Environment','Entire country',NULL,'2024-12-31 18:30:00',5,0,0,0,'To reduce the transport sector emissions by introducing a fuel levy (Fuel mix)',NULL,NULL,NULL,0.000000,0.000000,'Reduce the transport sector emissions\nReduce fuel consumption\nPromote the use of electrical/ low emission vehicles ','At planning level',NULL,NULL,NULL,NULL,'Ministry of Environment','Ministry of Transport','Ministry of Finance, Sri Lanka Custom ',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,1,3,1,1,1,2,NULL,NULL,5),('','2022-02-27 10:54:14','','2022-02-27 10:54:14',0,8,'Introducing distance based charges for LDV travel via Colombo - Katunayake route',NULL,'Kasun Jayasinghe','Jayasinghe@menv. lk','Director','0115228160','0715228160','Ministry of Environment','Colombo- Katunayake route',NULL,'2019-12-31 18:30:00',10,0,0,0,NULL,NULL,NULL,NULL,0.000000,0.000000,'Emission reduction in the transport sector\nEncourage the transport via public vehicle\n','Implemented',NULL,NULL,NULL,NULL,'Ministry of Highway','Ministry of Highway','Ministry of Transport, Road Development Authority',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,1,3,1,1,1,2,NULL,NULL,4),('-','2022-02-28 11:15:26','-','2022-02-28 11:15:26',0,9,'30% of diesel buses converted to CNG by 2030',NULL,'Nilni Malsha Sandeepani','nilni@ngr.com','Technical officer','9425368923','9425369875','Local Transport authority','30% of diesel buses converted to CNG by 2030',NULL,'2023-02-22 18:30:00',5,0,0,0,'30% of diesel buses converted to CNG by 2030','Nigeria level1','Nigeria level2','Nigeria level 3',55.971848,74.949089,'30% of diesel buses converted to CNG by 2030','30% of diesel buses converted to CNG by 2030','300000','30% of diesel buses converted to CNG by 2030','30% of diesel buses converted to CNG by 2030','30% of diesel buses converted to CNG by 2030','Ministry of Transport','Ministry of Transport','Ministry of Transport','Public passengers','Ministry of Transport','Ministry of Transport','Ministry of Transport',34908.00,3000.00,300.00,4000.00,NULL,NULL,NULL,1,2,1,2,2,2,2,NULL,1),('-','2022-02-28 23:20:54','-','2022-02-28 23:20:54',0,11,'National fuel levy (5%) on gasoline that will target LDVs by 2025',NULL,'Bashi Samarasinghe','bashi@me.lk','Director','+94 112 03','+94 779 77','Climate Change Secretariat','A government plans to implement a national fuel levy on gasoline that will target LDVs in the form of a fixed sum per litre',NULL,'2019-12-31 18:30:00',5,0,0,0,'To reduce the GHG emissions due to gasoline consumption in transport sector',NULL,NULL,NULL,0.000000,0.000000,'GHG emissions reduction\nReduction of gasoline consumption','Planned',NULL,NULL,NULL,NULL,'Ministry of Transport','Petroleum Cooperation ','Sri Lanka Custom, Ministry of Environment',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,1,1,1,3,3,2,NULL,NULL,1),('','2022-03-03 08:38:18','','2022-03-03 08:38:18',0,18,'Introduction of LNG buses to main cities of Nigeria',NULL,'Shyamika Shiwanthi','shyamika22@gmail.com','Officer','0714047715','0714047715','National Transport Authority','Introduce 50 LNG buses to the city A, B and C in 2025',NULL,'2023-03-15 18:30:00',2,0,0,0,NULL,NULL,NULL,NULL,0.000000,0.000000,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,9,1,1,2,2,2,NULL,NULL,5),('-','2022-03-03 09:59:40','-','2022-03-03 09:59:40',0,19,'Test_Solar Powered Three Wheeler',NULL,'Test_Indike Dassanayake','indike@climatesi.com','Head, LEDI & IT','+94777286629','+94777286629','Test_Climate Smart Initiatives (Pvt.) Ltd.','Test_Introduction of 1,000 solar powered three wheelers in the Capital City',NULL,'2020-11-04 18:30:00',3,0,0,0,NULL,'Test_Province','Test_My District','Test_My Div Sec',81.135712,6.803332,'Emission Reduction\nReduction of passenger fares','Pre-feasibility report prepared. Looking for investor.','350 tCo2e per annum','','Retention of jobs affected by high fuel prices.','Improving the living conditions of the families of three wheeler operators','Test_ClimateSI','Test_ClimateSI','Test_Home Alone )Pvt) Ltd.','1,000 families of threewheeler operators',NULL,'Money Hunters (Pvt.) Ltd.',NULL,NULL,NULL,NULL,NULL,'As this is a test project','In order to approve this pls add more details ',NULL,7,1,1,3,NULL,1,2,NULL,3),('-','2022-03-03 13:25:58','-','2022-03-03 13:25:58',0,20,'Introduction of toll to the Kandy road Sri Lanka',NULL,'Shyamika Shiwanthi','shyamika22@gmail.com','Officer','0714047715','0714047715','Ministry of Transport','Introduce a toll to heavy-duty vehicles to heavy-duty vehicles to reduce the traffic',NULL,'2024-07-03 18:30:00',10,0,0,0,NULL,NULL,NULL,NULL,0.000000,0.000000,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,1,1,1,NULL,NULL,NULL,NULL,NULL,1);
/*!40000 ALTER TABLE `climateAction` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `climate_change_data_category`
--

DROP TABLE IF EXISTS `climate_change_data_category`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `climate_change_data_category` (
  `createdBy` varchar(255) DEFAULT NULL,
  `createdOn` datetime DEFAULT NULL,
  `editedBy` varchar(255) DEFAULT NULL,
  `editedOn` datetime DEFAULT NULL,
  `status` int NOT NULL DEFAULT '0',
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) DEFAULT NULL,
  `description` varchar(2500) DEFAULT NULL,
  `sortOrder` int NOT NULL DEFAULT '1',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `climate_change_data_category`
--

LOCK TABLES `climate_change_data_category` WRITE;
/*!40000 ALTER TABLE `climate_change_data_category` DISABLE KEYS */;
/*!40000 ALTER TABLE `climate_change_data_category` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `country`
--

DROP TABLE IF EXISTS `country`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `country` (
  `createdBy` varchar(255) DEFAULT NULL,
  `createdOn` datetime DEFAULT NULL,
  `editedBy` varchar(255) DEFAULT NULL,
  `editedOn` datetime DEFAULT NULL,
  `status` int NOT NULL DEFAULT '0',
  `id` int NOT NULL AUTO_INCREMENT,
  `code` varchar(255) DEFAULT NULL,
  `code_extended` varchar(255) DEFAULT NULL,
  `name` varchar(255) DEFAULT NULL,
  `description` varchar(300) DEFAULT NULL,
  `sortOrder` int NOT NULL DEFAULT '1',
  `submissions` varchar(255) NOT NULL,
  `emissionSummary` varchar(255) DEFAULT NULL,
  `ndcDocuments` varchar(255) DEFAULT NULL,
  `isSystemUse` tinyint DEFAULT NULL,
  `flagPath` varchar(255) DEFAULT NULL,
  `registeredDate` datetime DEFAULT NULL,
  `isMember` tinyint DEFAULT NULL,
  `countryStatus` varchar(255) DEFAULT NULL,
  `region` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=28 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `country`
--

LOCK TABLES `country` WRITE;
/*!40000 ALTER TABLE `country` DISABLE KEYS */;
INSERT INTO `country` VALUES (NULL,NULL,NULL,NULL,0,1,'SL','LKA','Sri Lanka','Sri lanka',1,'abc',NULL,NULL,1,'https://www.worldometers.info//img/flags/small/tn_ce-flag.gif',NULL,1,NULL,'Asia'),(NULL,NULL,NULL,NULL,0,2,'KE','KEN','Kenya','Kenya',2,'abc',NULL,NULL,1,'https://www.worldometers.info//img/flags/small/tn_ke-flag.gif',NULL,1,NULL,'Africa'),(NULL,NULL,NULL,NULL,0,3,'KG','KGZ','Kyrgyzstan','Kyrgyzstan',3,'abc',NULL,NULL,1,'https://www.worldometers.info//img/flags/small/tn_kg-flag.gif',NULL,1,NULL,'Asia'),(NULL,NULL,NULL,NULL,0,4,'LR','LBR','Liberia','Liberia',4,'abc',NULL,NULL,1,'https://www.worldometers.info//img/flags/small/tn_li-flag.gif',NULL,1,NULL,'Africa'),(NULL,NULL,NULL,NULL,0,5,'MV','MDV','Maldives','Maldives',5,'abc',NULL,NULL,1,'https://www.worldometers.info//img/flags/small/tn_mv-flag.gif',NULL,1,NULL,'Asia'),(NULL,NULL,NULL,NULL,0,6,'MX','MEX','Mexico','Mexico',6,'abc',NULL,NULL,1,'https://www.worldometers.info//img/flags/small/tn_mx-flag.gif',NULL,1,NULL,'Americas'),(NULL,NULL,NULL,NULL,0,7,'MA','MAR','Morocco','Morocco',7,'abc',NULL,NULL,1,'https://www.worldometers.info//img/flags/small/tn_mo-flag.gif',NULL,1,NULL,'Africa'),(NULL,NULL,NULL,NULL,0,8,'MZ','MOZ','Mozambique','Mozambique',8,'abc',NULL,NULL,1,'https://www.worldometers.info//img/flags/small/tn_mz-flag.gif',NULL,1,NULL,'Africa'),(NULL,NULL,NULL,NULL,0,9,'NG','NGA','Nigeria','Nigeria',9,'abc',NULL,NULL,1,'https://www.worldometers.info//img/flags/small/tn_ni-flag.gif',NULL,1,NULL,'Africa'),(NULL,NULL,NULL,NULL,0,10,'PE','PER','Peru','Peru',10,'abc',NULL,NULL,1,'https://www.worldometers.info//img/flags/small/tn_pe-flag.gif',NULL,1,NULL,'Americas'),(NULL,NULL,NULL,NULL,0,11,'PH','PHL','Philippines','Philippines',11,'abc',NULL,NULL,1,'https://www.worldometers.info//img/flags/small/tn_rp-flag.gif',NULL,1,NULL,'Asia'),(NULL,NULL,NULL,NULL,0,12,'CD','COD','Republic of the Congo','Republic of the Congo',12,'abc',NULL,NULL,1,'https://www.worldometers.info//img/flags/small/tn_congo-flag.gif',NULL,1,NULL,'Africa'),(NULL,NULL,NULL,NULL,0,13,'RW','RWA','Rwanda','Rwanda',13,'abc',NULL,NULL,1,'https://www.worldometers.info//img/flags/small/tn_rw-flag.gif',NULL,1,NULL,'Africa'),(NULL,NULL,NULL,NULL,0,14,'ST','STP','São Tomé and Príncipe','São Tomé and Príncipe',14,'abc',NULL,NULL,1,'https://www.worldometers.info//img/flags/small/tn_tp-flag.gif',NULL,1,NULL,'Africa'),(NULL,NULL,NULL,NULL,0,15,'SN','SEN','Senegal','Senegal',15,'abc',NULL,NULL,1,'https://www.worldometers.info//img/flags/small/tn_sg-flag.gif',NULL,1,NULL,'Africa'),(NULL,NULL,NULL,NULL,0,16,'ZA','ZAF','South Africa','South Africa',16,'abc',NULL,NULL,1,'https://www.worldometers.info//img/flags/small/tn_sf-flag.gif',NULL,1,NULL,'Africa'),(NULL,NULL,NULL,NULL,0,17,'SD','SDN','Sudan','Sudan',17,'abc',NULL,NULL,1,'https://www.worldometers.info//img/flags/small/tn_su-flag.gif',NULL,1,NULL,'Africa'),(NULL,NULL,NULL,NULL,0,18,'TJ','TJK','Tajikistan','Tajikistan',18,'abc',NULL,NULL,1,'https://www.worldometers.info//img/flags/small/tn_ti-flag.gif',NULL,1,NULL,'Asia'),(NULL,NULL,NULL,NULL,0,19,'TH','THA','Thailand','Thailand',19,'abc',NULL,NULL,1,'https://www.worldometers.info//img/flags/small/tn_th-flag.gif',NULL,1,NULL,'Asia'),(NULL,NULL,NULL,NULL,0,20,'TO','TON','Tonga','Tonga',20,'abc',NULL,NULL,1,'https://www.worldometers.info//img/flags/small/tn_tn-flag.gif',NULL,1,NULL,'Oceania'),(NULL,NULL,NULL,NULL,0,21,'TT','TTO','Trinidad and Tobago','Trinidad and Tobago',21,'abc',NULL,NULL,1,'https://www.worldometers.info//img/flags/small/tn_td-flag.gif',NULL,1,NULL,'Americas'),(NULL,NULL,NULL,NULL,0,22,'TN','TUN','Tunisia','Tunisia',22,'abc',NULL,NULL,1,'https://www.worldometers.info//img/flags/small/tn_ts-flag.gif',NULL,1,NULL,'Africa'),(NULL,NULL,NULL,NULL,0,23,'TM','TKM','Turkmenistan','Turkmenistan',23,'abc',NULL,NULL,1,'https://www.worldometers.info//img/flags/small/tn_tx-flag.gif',NULL,1,NULL,'Asia'),(NULL,NULL,NULL,NULL,0,24,'AE','URE','United Arab Emirates','United Arab Emirates',24,'abc',NULL,NULL,1,'https://www.worldometers.info//img/flags/small/tn_ae-flag.gif',NULL,1,NULL,'Asia'),(NULL,NULL,NULL,NULL,0,25,'UZ','UZB','Uzbekistan','Uzbekistan',25,'abc',NULL,NULL,1,'https://www.worldometers.info//img/flags/small/tn_uz-flag.gif',NULL,1,NULL,'Asia'),(NULL,NULL,NULL,NULL,0,26,'VN','UNM','Viet Nam','Viet Nam',26,'abc',NULL,NULL,1,'https://www.worldometers.info//img/flags/small/tn_vm-flag.gif',NULL,1,NULL,'Asia'),(NULL,NULL,NULL,NULL,0,27,'ZW','ZWE','Zimbabwe','Zimbabwe',27,'abc',NULL,NULL,1,'https://www.worldometers.info//img/flags/small/tn_zi-flag.gif',NULL,1,NULL,'Africa');
/*!40000 ALTER TABLE `country` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `country_sector`
--

DROP TABLE IF EXISTS `country_sector`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `country_sector` (
  `sectorId` int NOT NULL,
  `countryId` int NOT NULL,
  PRIMARY KEY (`sectorId`,`countryId`),
  KEY `IDX_ac9fae572f4d56580da4c77da0` (`sectorId`),
  KEY `IDX_876a3a24e621b0c8037ca4cf11` (`countryId`),
  CONSTRAINT `FK_876a3a24e621b0c8037ca4cf113` FOREIGN KEY (`countryId`) REFERENCES `country` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `FK_ac9fae572f4d56580da4c77da0e` FOREIGN KEY (`sectorId`) REFERENCES `sector` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `country_sector`
--

LOCK TABLES `country_sector` WRITE;
/*!40000 ALTER TABLE `country_sector` DISABLE KEYS */;
/*!40000 ALTER TABLE `country_sector` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `dataRequest`
--

DROP TABLE IF EXISTS `dataRequest`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `dataRequest` (
  `createdBy` varchar(255) DEFAULT NULL,
  `createdOn` datetime DEFAULT NULL,
  `editedBy` varchar(255) DEFAULT NULL,
  `editedOn` datetime DEFAULT NULL,
  `status` int NOT NULL DEFAULT '0',
  `id` int NOT NULL AUTO_INCREMENT,
  `deadline` datetime DEFAULT NULL,
  `deadlineDataEntry` datetime DEFAULT NULL,
  `reasonForExceedRange` varchar(255) DEFAULT NULL,
  `requestedDate` datetime DEFAULT NULL,
  `value` varchar(255) DEFAULT NULL,
  `valueInParameterStandard` varchar(255) DEFAULT NULL,
  `noteDataRequest` varchar(255) DEFAULT NULL,
  `noteDataEntry` varchar(255) DEFAULT NULL,
  `noteDataApprover` varchar(255) DEFAULT NULL,
  `noteCase1` varchar(255) DEFAULT NULL,
  `noteCase2` varchar(255) DEFAULT NULL,
  `noteCase3` varchar(255) DEFAULT NULL,
  `UserDataEntry` int DEFAULT NULL,
  `UserIdFerfyie` int DEFAULT NULL,
  `UserQA` int DEFAULT NULL,
  `dataRequestStatus` int DEFAULT NULL,
  `qaStatus` int DEFAULT NULL,
  `qaStatusUpdatedDate` datetime DEFAULT NULL,
  `qaDeadline` datetime DEFAULT NULL,
  `qaAssighnDate` datetime DEFAULT NULL,
  `qaComment` varchar(255) DEFAULT NULL,
  `ParameterId` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `REL_49a33ee0f7fd132bb3bf9f43a8` (`ParameterId`),
  CONSTRAINT `FK_49a33ee0f7fd132bb3bf9f43a8b` FOREIGN KEY (`ParameterId`) REFERENCES `parameter` (`id`) ON UPDATE RESTRICT
) ENGINE=InnoDB AUTO_INCREMENT=337 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `dataRequest`
--

LOCK TABLES `dataRequest` WRITE;
/*!40000 ALTER TABLE `dataRequest` DISABLE KEYS */;
INSERT INTO `dataRequest` VALUES ('','2022-03-02 16:45:19','','2022-03-02 16:45:19',0,211,'2022-03-02 18:30:00','2022-03-08 18:30:00',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,8,NULL,NULL,9,NULL,NULL,NULL,NULL,NULL,604),('','2022-03-02 16:45:19','','2022-03-02 16:45:19',0,212,'2022-03-02 18:30:00','2022-03-08 18:30:00',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,8,NULL,NULL,9,NULL,NULL,NULL,NULL,NULL,602),('','2022-03-02 16:45:19','','2022-03-02 16:45:19',0,213,'2022-03-02 18:30:00','2022-03-08 18:30:00',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,8,NULL,NULL,9,NULL,NULL,NULL,NULL,NULL,606),('','2022-03-02 16:45:19','','2022-03-02 16:45:19',0,214,'2022-03-02 18:30:00','2022-03-08 18:30:00',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,8,NULL,NULL,9,NULL,NULL,NULL,NULL,NULL,607),('','2022-03-02 16:45:19','','2022-03-02 16:45:19',0,215,'2022-03-02 18:30:00','2022-03-08 18:30:00',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,8,NULL,NULL,9,NULL,NULL,NULL,NULL,NULL,603),('','2022-03-02 16:45:19','','2022-03-02 16:45:19',0,216,'2022-03-02 18:30:00','2022-03-08 18:30:00',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,8,NULL,NULL,9,NULL,NULL,NULL,NULL,NULL,608),('','2022-03-02 16:45:19','','2022-03-02 16:45:19',0,217,'2022-03-02 18:30:00','2022-03-08 18:30:00',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,8,NULL,NULL,9,NULL,NULL,NULL,NULL,NULL,609),('','2022-03-02 16:45:19','','2022-03-02 16:45:19',0,218,'2022-03-02 18:30:00','2022-03-08 18:30:00',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,8,NULL,NULL,9,NULL,NULL,NULL,NULL,NULL,605),('','2022-03-02 16:45:19','','2022-03-02 16:45:19',0,219,'2022-03-02 18:30:00','2022-03-08 18:30:00',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,8,NULL,NULL,9,NULL,NULL,NULL,NULL,NULL,611),('','2022-03-02 16:45:19','','2022-03-02 16:45:19',0,220,'2022-03-02 18:30:00','2022-03-08 18:30:00',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,8,NULL,NULL,9,NULL,NULL,NULL,NULL,NULL,610),('','2022-03-02 16:45:19','','2022-03-02 16:45:19',0,221,'2022-03-02 18:30:00','2022-03-08 18:30:00',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,8,NULL,NULL,9,NULL,NULL,NULL,NULL,NULL,614),('','2022-03-02 16:45:19','','2022-03-02 16:45:19',0,222,'2022-03-02 18:30:00','2022-03-08 18:30:00',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,8,NULL,NULL,9,NULL,NULL,NULL,NULL,NULL,612),('','2022-03-02 16:45:19','','2022-03-02 16:45:19',0,223,'2022-03-02 18:30:00','2022-03-08 18:30:00',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,8,NULL,NULL,9,NULL,NULL,NULL,NULL,NULL,613),('','2022-03-03 05:32:12','','2022-03-03 05:32:12',0,224,'2022-03-30 18:30:00','2022-03-30 18:30:00',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,16,NULL,NULL,11,4,'2022-03-03 11:13:01',NULL,NULL,'',615),('','2022-03-03 05:32:12','','2022-03-03 05:32:12',0,225,'2022-03-30 18:30:00','2022-03-30 18:30:00',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,30,NULL,NULL,11,4,'2022-03-03 11:13:20',NULL,NULL,'Fine',616),('','2022-03-03 05:32:12','','2022-03-03 05:32:12',0,226,'2022-03-30 18:30:00','2022-04-29 18:30:00',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,8,NULL,NULL,11,4,'2022-03-03 11:14:23',NULL,NULL,'',619),('','2022-03-03 05:32:12','','2022-03-03 05:32:12',0,227,'2022-03-30 18:30:00','2022-03-30 18:30:00',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,16,NULL,NULL,11,4,'2022-03-03 11:13:32',NULL,NULL,'Fine',617),('','2022-03-03 05:32:12','','2022-03-03 05:32:12',0,228,'2022-03-30 18:30:00','2022-03-30 18:30:00',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,30,NULL,NULL,11,4,'2022-03-03 11:14:07',NULL,NULL,'Fine',620),('','2022-03-03 05:32:12','','2022-03-03 05:32:12',0,229,'2022-03-30 18:30:00','2022-03-29 18:30:00',NULL,NULL,NULL,NULL,'Not available\n',NULL,NULL,NULL,NULL,NULL,8,NULL,NULL,11,4,'2022-03-03 11:14:36',NULL,NULL,'',621),('','2022-03-03 05:32:12','','2022-03-03 05:32:12',0,230,'2022-03-30 18:30:00','2022-04-29 18:30:00',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,8,NULL,NULL,11,4,'2022-03-03 11:14:54',NULL,NULL,'',623),('','2022-03-03 05:32:12','','2022-03-03 05:32:12',0,231,'2022-03-30 18:30:00','2022-04-29 18:30:00',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,8,NULL,NULL,11,4,'2022-03-03 11:14:42',NULL,NULL,'',622),('','2022-03-03 05:32:12','','2022-03-03 05:32:12',0,232,'2022-03-30 18:30:00','2022-03-30 18:30:00',NULL,NULL,NULL,NULL,'Value',NULL,NULL,NULL,NULL,NULL,30,NULL,NULL,11,4,'2022-03-03 11:13:55',NULL,NULL,'Fine',618),('','2022-03-03 05:32:12','','2022-03-03 05:32:12',0,233,'2022-03-30 18:30:00','2022-04-29 18:30:00',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,8,NULL,NULL,11,4,'2022-03-03 11:14:58',NULL,NULL,'',624),('','2022-03-03 05:32:12','','2022-03-03 05:32:12',0,234,'2022-03-30 18:30:00','2022-03-30 18:30:00',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,33,NULL,NULL,11,4,'2022-03-03 11:55:38',NULL,NULL,'',625),('','2022-03-03 05:32:12','','2022-03-03 05:32:12',0,235,'2022-03-30 18:30:00','2022-03-30 18:30:00',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,33,NULL,NULL,11,4,'2022-03-03 11:16:09',NULL,NULL,'',626),('','2022-03-03 06:40:44','','2022-03-03 06:40:44',0,236,'2022-03-03 18:30:00',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,2,NULL,NULL,NULL,NULL,NULL,627),('','2022-03-03 06:40:44','','2022-03-03 06:40:44',0,237,'2022-03-03 18:30:00',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,2,NULL,NULL,NULL,NULL,NULL,628),('','2022-03-03 06:40:44','','2022-03-03 06:40:44',0,238,'2022-03-03 18:30:00',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,2,NULL,NULL,NULL,NULL,NULL,629),('','2022-03-03 06:40:44','','2022-03-03 06:40:44',0,239,'2022-03-03 18:30:00',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,2,NULL,NULL,NULL,NULL,NULL,630),('','2022-03-03 06:40:44','','2022-03-03 06:40:44',0,240,'2022-03-03 18:30:00',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,2,NULL,NULL,NULL,NULL,NULL,631),('','2022-03-03 08:26:09','','2022-03-03 08:26:09',0,241,'2022-03-03 18:30:00',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,2,NULL,NULL,NULL,NULL,NULL,656),('','2022-03-03 08:26:09','','2022-03-03 08:26:09',0,242,'2022-03-03 18:30:00',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,2,NULL,NULL,NULL,NULL,NULL,658),('','2022-03-03 08:38:18','','2022-03-03 08:38:18',0,243,'2022-03-23 18:30:00','2022-03-16 18:30:00',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,36,NULL,NULL,6,NULL,NULL,NULL,NULL,NULL,675),('','2022-03-03 08:38:18','','2022-03-03 08:38:18',0,244,'2022-03-23 18:30:00','2022-03-23 18:30:00',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,26,NULL,NULL,6,NULL,NULL,NULL,NULL,NULL,678),('','2022-03-03 08:38:18','','2022-03-03 08:38:18',0,245,'2022-03-23 18:30:00','2022-03-23 18:30:00',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,26,NULL,NULL,6,NULL,NULL,NULL,NULL,NULL,677),('','2022-03-03 08:38:18','','2022-03-03 08:38:18',0,246,'2022-03-23 18:30:00','2022-03-23 18:30:00',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,26,NULL,NULL,6,NULL,NULL,NULL,NULL,NULL,676),('','2022-03-03 08:38:18','','2022-03-03 08:38:18',0,247,'2022-03-23 18:30:00','2022-03-16 18:30:00',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,36,NULL,NULL,6,NULL,NULL,NULL,NULL,NULL,679),('','2022-03-03 08:38:18','','2022-03-03 08:38:18',0,248,'2022-03-23 18:30:00','2022-03-23 18:30:00',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,26,NULL,NULL,6,NULL,NULL,NULL,NULL,NULL,680),('','2022-03-03 08:38:18','','2022-03-03 08:38:18',0,249,'2022-03-23 18:30:00','2022-03-23 18:30:00',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,26,NULL,NULL,6,NULL,NULL,NULL,NULL,NULL,683),('','2022-03-03 08:38:18','','2022-03-03 08:38:18',0,250,'2022-03-23 18:30:00','2022-03-23 18:30:00',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,26,NULL,NULL,6,NULL,NULL,NULL,NULL,NULL,682),('','2022-03-03 08:38:18','','2022-03-03 08:38:18',0,251,'2022-03-23 18:30:00','2022-03-23 18:30:00',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,26,NULL,NULL,6,NULL,NULL,NULL,NULL,NULL,681),('','2022-03-03 08:38:18','','2022-03-03 08:38:18',0,252,'2022-03-23 18:30:00','2022-03-23 18:30:00',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,26,NULL,NULL,6,NULL,NULL,NULL,NULL,NULL,684),('','2022-03-03 08:38:18','','2022-03-03 08:38:18',0,253,'2022-03-23 18:30:00','2022-03-23 18:30:00',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,26,NULL,NULL,6,NULL,NULL,NULL,NULL,NULL,685),('','2022-03-03 08:38:18','','2022-03-03 08:38:18',0,254,'2022-03-23 18:30:00','2022-03-16 18:30:00',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,36,NULL,NULL,6,NULL,NULL,NULL,NULL,NULL,686),('','2022-03-03 08:38:18','','2022-03-03 08:38:18',0,255,'2022-03-23 18:30:00','2022-03-16 18:30:00',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,36,NULL,NULL,6,NULL,NULL,NULL,NULL,NULL,687),('','2022-03-03 08:38:18','','2022-03-03 08:38:18',0,256,'2022-03-23 18:30:00','2022-03-16 18:30:00',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,36,NULL,NULL,6,NULL,NULL,NULL,NULL,NULL,688),('','2022-03-03 08:38:18','','2022-03-03 08:38:18',0,257,'2022-03-23 18:30:00','2022-03-16 18:30:00',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,36,NULL,NULL,6,NULL,NULL,NULL,NULL,NULL,689),('','2022-03-03 08:38:18','','2022-03-03 08:38:18',0,258,'2022-03-23 18:30:00','2022-03-16 18:30:00',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,36,NULL,NULL,6,NULL,NULL,NULL,NULL,NULL,690),('','2022-03-03 08:38:18','','2022-03-03 08:38:18',0,259,'2022-03-23 18:30:00','2022-03-23 18:30:00',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,26,NULL,NULL,6,NULL,NULL,NULL,NULL,NULL,691),('','2022-03-03 08:38:18','','2022-03-03 08:38:18',0,260,'2022-03-23 18:30:00','2022-03-23 18:30:00',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,26,NULL,NULL,6,NULL,NULL,NULL,NULL,NULL,693),('','2022-03-03 08:38:18','','2022-03-03 08:38:18',0,261,'2022-03-23 18:30:00','2022-03-23 18:30:00',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,26,NULL,NULL,6,NULL,NULL,NULL,NULL,NULL,694),('','2022-03-03 08:38:18','','2022-03-03 08:38:18',0,262,'2022-03-23 18:30:00','2022-03-23 18:30:00',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,26,NULL,NULL,6,NULL,NULL,NULL,NULL,NULL,692),('','2022-03-03 08:38:18','','2022-03-03 08:38:18',0,263,'2022-03-23 18:30:00','2022-03-16 18:30:00',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,36,NULL,NULL,6,NULL,NULL,NULL,NULL,NULL,695),('','2022-03-03 08:38:18','','2022-03-03 08:38:18',0,264,'2022-03-23 18:30:00','2022-03-23 18:30:00',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,26,NULL,NULL,6,NULL,NULL,NULL,NULL,NULL,696),('','2022-03-03 08:38:18','','2022-03-03 08:38:18',0,265,'2022-03-23 18:30:00','2022-03-23 18:30:00',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,26,NULL,NULL,6,NULL,NULL,NULL,NULL,NULL,697),('','2022-03-03 08:38:18','','2022-03-03 08:38:18',0,266,'2022-03-23 18:30:00','2022-03-23 18:30:00',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,26,NULL,NULL,6,NULL,NULL,NULL,NULL,NULL,698),('','2022-03-03 08:38:18','','2022-03-03 08:38:18',0,267,'2022-03-23 18:30:00','2022-03-16 18:30:00',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,36,NULL,NULL,6,NULL,NULL,NULL,NULL,NULL,700),('','2022-03-03 08:38:18','','2022-03-03 08:38:18',0,268,'2022-03-23 18:30:00','2022-03-23 18:30:00',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,26,NULL,NULL,6,NULL,NULL,NULL,NULL,NULL,699),('','2022-03-03 08:38:18','','2022-03-03 08:38:18',0,269,'2022-03-23 18:30:00','2022-03-23 18:30:00',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,26,NULL,NULL,6,NULL,NULL,NULL,NULL,NULL,701),('','2022-03-03 08:38:18','','2022-03-03 08:38:18',0,270,'2022-03-23 18:30:00','2022-03-23 18:30:00',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,26,NULL,NULL,6,NULL,NULL,NULL,NULL,NULL,704),('','2022-03-03 08:38:18','','2022-03-03 08:38:18',0,271,'2022-03-23 18:30:00','2022-03-23 18:30:00',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,26,NULL,NULL,6,NULL,NULL,NULL,NULL,NULL,702),('','2022-03-03 08:38:18','','2022-03-03 08:38:18',0,272,'2022-03-23 18:30:00','2022-03-23 18:30:00',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,26,NULL,NULL,6,NULL,NULL,NULL,NULL,NULL,703),('','2022-03-03 08:38:19','','2022-03-03 08:38:19',0,273,'2022-03-23 18:30:00','2022-03-16 18:30:00',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,36,NULL,NULL,6,NULL,NULL,NULL,NULL,NULL,705),('','2022-03-03 08:38:19','','2022-03-03 08:38:19',0,274,'2022-03-23 18:30:00','2022-03-16 18:30:00',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,36,NULL,NULL,6,NULL,NULL,NULL,NULL,NULL,709),('','2022-03-03 08:38:19','','2022-03-03 08:38:19',0,275,'2022-03-23 18:30:00','2022-03-16 18:30:00',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,36,NULL,NULL,6,NULL,NULL,NULL,NULL,NULL,706),('','2022-03-03 08:38:19','','2022-03-03 08:38:19',0,276,'2022-03-23 18:30:00','2022-03-16 18:30:00',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,36,NULL,NULL,6,NULL,NULL,NULL,NULL,NULL,707),('','2022-03-03 08:38:19','','2022-03-03 08:38:19',0,277,'2022-03-23 18:30:00','2022-03-23 18:30:00',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,26,NULL,NULL,6,NULL,NULL,NULL,NULL,NULL,710),('','2022-03-03 08:38:19','','2022-03-03 08:38:19',0,278,'2022-03-23 18:30:00','2022-03-16 18:30:00',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,36,NULL,NULL,6,NULL,NULL,NULL,NULL,NULL,708),('','2022-03-03 08:38:19','','2022-03-03 08:38:19',0,279,'2022-03-23 18:30:00','2022-03-16 18:30:00',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,36,NULL,NULL,6,NULL,NULL,NULL,NULL,NULL,712),('','2022-03-03 08:38:19','','2022-03-03 08:38:19',0,280,'2022-03-23 18:30:00','2022-03-16 18:30:00',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,36,NULL,NULL,6,NULL,NULL,NULL,NULL,NULL,711),('','2022-03-03 10:16:53','','2022-03-03 10:16:53',0,281,'2022-03-03 18:30:00',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,2,NULL,NULL,NULL,NULL,NULL,761),('','2022-03-03 10:16:53','','2022-03-03 10:16:53',0,282,'2022-03-03 18:30:00',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,2,NULL,NULL,NULL,NULL,NULL,767),('','2022-03-03 10:16:53','','2022-03-03 10:16:53',0,283,'2022-03-03 18:30:00',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,2,NULL,NULL,NULL,NULL,NULL,770),('','2022-03-03 10:26:28','','2022-03-03 10:26:28',0,284,'2022-03-03 18:30:00',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,2,NULL,NULL,NULL,NULL,NULL,774),('','2022-03-03 10:26:28','','2022-03-03 10:26:28',0,285,'2022-03-03 18:30:00',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,2,NULL,NULL,NULL,NULL,NULL,783),('','2022-03-03 10:26:28','','2022-03-03 10:26:28',0,286,'2022-03-03 18:30:00',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,2,NULL,NULL,NULL,NULL,NULL,782),('','2022-03-03 10:44:04','','2022-03-03 10:44:04',0,287,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,-1,NULL,NULL,NULL,NULL,NULL,787),('','2022-03-03 10:44:04','','2022-03-03 10:44:04',0,288,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,-1,NULL,NULL,NULL,NULL,NULL,793),('','2022-03-03 10:44:04','','2022-03-03 10:44:04',0,289,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,-1,NULL,NULL,NULL,NULL,NULL,796),('','2022-03-03 10:49:02','','2022-03-03 10:49:02',0,290,'2022-03-03 18:30:00',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,2,NULL,NULL,NULL,NULL,NULL,799),('','2022-03-03 10:49:02','','2022-03-03 10:49:02',0,291,'2022-03-03 18:30:00',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,2,NULL,NULL,NULL,NULL,NULL,801),('','2022-03-03 10:49:02','','2022-03-03 10:49:02',0,292,'2022-03-03 18:30:00',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,2,NULL,NULL,NULL,NULL,NULL,802),('','2022-03-03 10:49:02','','2022-03-03 10:49:02',0,293,'2022-03-03 18:30:00',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,2,NULL,NULL,NULL,NULL,NULL,811),('','2022-03-03 10:56:11','','2022-03-03 10:56:11',0,294,'2022-03-03 18:30:00',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,2,NULL,NULL,NULL,NULL,NULL,812),('','2022-03-03 10:56:11','','2022-03-03 10:56:11',0,295,'2022-03-03 18:30:00',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,2,NULL,NULL,NULL,NULL,NULL,813),('','2022-03-03 10:56:11','','2022-03-03 10:56:11',0,296,'2022-03-03 18:30:00',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,2,NULL,NULL,NULL,NULL,NULL,822),('','2022-03-03 11:00:33','','2022-03-03 11:00:33',0,297,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,-1,NULL,NULL,NULL,NULL,NULL,825),('','2022-03-03 11:00:33','','2022-03-03 11:00:33',0,298,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,-1,NULL,NULL,NULL,NULL,NULL,826),('','2022-03-03 11:00:33','','2022-03-03 11:00:33',0,299,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,-1,NULL,NULL,NULL,NULL,NULL,835),('','2022-03-03 11:09:04','','2022-03-03 11:09:04',0,300,'2022-03-03 18:30:00',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,2,NULL,NULL,NULL,NULL,NULL,845),('','2022-03-03 11:09:04','','2022-03-03 11:09:04',0,301,'2022-03-03 18:30:00',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,2,NULL,NULL,NULL,NULL,NULL,848),('','2022-03-03 11:28:51','','2022-03-03 11:28:51',0,302,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,-1,NULL,NULL,NULL,NULL,NULL,851),('','2022-03-03 11:28:51','','2022-03-03 11:28:51',0,303,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,-1,NULL,NULL,NULL,NULL,NULL,852),('','2022-03-03 11:28:51','','2022-03-03 11:28:51',0,304,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,-1,NULL,NULL,NULL,NULL,NULL,861),('','2022-03-03 11:49:07','','2022-03-03 11:49:07',0,305,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,-1,NULL,NULL,NULL,NULL,NULL,865),('','2022-03-03 11:49:07','','2022-03-03 11:49:07',0,306,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,-1,NULL,NULL,NULL,NULL,NULL,871),('','2022-03-03 11:49:07','','2022-03-03 11:49:07',0,307,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,-1,NULL,NULL,NULL,NULL,NULL,874),('','2022-03-03 11:55:30','','2022-03-03 11:55:30',0,308,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,-1,NULL,NULL,NULL,NULL,NULL,878),('','2022-03-03 11:55:30','','2022-03-03 11:55:30',0,309,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,-1,NULL,NULL,NULL,NULL,NULL,887),('','2022-03-03 11:55:30','','2022-03-03 11:55:30',0,310,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,-1,NULL,NULL,NULL,NULL,NULL,883),('','2022-03-03 12:47:43','','2022-03-03 12:47:43',0,311,'2022-03-03 18:30:00',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,2,NULL,NULL,NULL,NULL,NULL,890),('','2022-03-03 12:47:43','','2022-03-03 12:47:43',0,312,'2022-03-03 18:30:00',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,2,NULL,NULL,NULL,NULL,NULL,894),('','2022-03-03 12:47:43','','2022-03-03 12:47:43',0,313,'2022-03-03 18:30:00',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,2,NULL,NULL,NULL,NULL,NULL,891),('','2022-03-03 12:47:43','','2022-03-03 12:47:43',0,314,'2022-03-03 18:30:00','2022-03-03 18:30:00',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,8,NULL,NULL,4,NULL,NULL,NULL,NULL,NULL,892),('','2022-03-03 12:47:43','','2022-03-03 12:47:43',0,315,'2022-03-03 18:30:00','2022-03-03 18:30:00',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,8,NULL,NULL,4,NULL,NULL,NULL,NULL,NULL,893),('','2022-03-03 12:47:43','','2022-03-03 12:47:43',0,316,'2022-03-03 18:30:00','2022-03-03 18:30:00',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,8,NULL,NULL,4,NULL,NULL,NULL,NULL,NULL,895),('','2022-03-03 12:47:43','','2022-03-03 12:47:43',0,317,'2022-03-03 18:30:00','2022-03-03 18:30:00',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,8,NULL,NULL,4,NULL,NULL,NULL,NULL,NULL,898),('','2022-03-03 12:47:43','','2022-03-03 12:47:43',0,318,'2022-03-03 18:30:00','2022-03-03 18:30:00',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,8,NULL,NULL,4,NULL,NULL,NULL,NULL,NULL,896),('','2022-03-03 12:47:43','','2022-03-03 12:47:43',0,319,'2022-03-03 18:30:00','2022-03-03 18:30:00',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,8,NULL,NULL,4,NULL,NULL,NULL,NULL,NULL,897),('','2022-03-03 12:47:43','','2022-03-03 12:47:43',0,320,'2022-03-03 18:30:00','2022-03-03 18:30:00',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,8,NULL,NULL,4,NULL,NULL,NULL,NULL,NULL,903),('','2022-03-03 12:47:43','','2022-03-03 12:47:43',0,321,'2022-03-03 18:30:00','2022-03-03 18:30:00',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,8,NULL,NULL,4,NULL,NULL,NULL,NULL,NULL,902),('','2022-03-03 12:47:43','','2022-03-03 12:47:43',0,322,'2022-03-03 18:30:00','2022-03-03 18:30:00',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,8,NULL,NULL,4,NULL,NULL,NULL,NULL,NULL,899),('','2022-03-03 12:47:43','','2022-03-03 12:47:43',0,323,'2022-03-03 18:30:00',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,2,NULL,NULL,NULL,NULL,NULL,900),('','2022-03-03 12:47:43','','2022-03-03 12:47:43',0,324,'2022-03-03 18:30:00',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,2,NULL,NULL,NULL,NULL,NULL,901),('','2022-03-03 12:47:43','','2022-03-03 12:47:43',0,325,'2022-03-03 18:30:00','2022-03-03 18:30:00',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,8,NULL,NULL,4,NULL,NULL,NULL,NULL,NULL,906),('','2022-03-03 12:47:43','','2022-03-03 12:47:43',0,326,'2022-03-03 18:30:00',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,2,NULL,NULL,NULL,NULL,NULL,904),('','2022-03-03 12:47:43','','2022-03-03 12:47:43',0,327,'2022-03-03 18:30:00',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,2,NULL,NULL,NULL,NULL,NULL,905),('','2022-03-03 12:47:43','','2022-03-03 12:47:43',0,328,'2022-03-03 18:30:00',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,2,NULL,NULL,NULL,NULL,NULL,909),('','2022-03-03 12:47:43','','2022-03-03 12:47:43',0,329,'2022-03-03 18:30:00',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,2,NULL,NULL,NULL,NULL,NULL,910),('','2022-03-03 12:47:43','','2022-03-03 12:47:43',0,330,'2022-03-03 18:30:00',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,2,NULL,NULL,NULL,NULL,NULL,911),('','2022-03-03 12:47:43','','2022-03-03 12:47:43',0,331,'2022-03-03 18:30:00',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,2,NULL,NULL,NULL,NULL,NULL,907),('','2022-03-03 12:47:43','','2022-03-03 12:47:43',0,332,'2022-03-03 18:30:00',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,2,NULL,NULL,NULL,NULL,NULL,908),('','2022-03-03 12:47:43','','2022-03-03 12:47:43',0,333,'2022-03-03 18:30:00',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,2,NULL,NULL,NULL,NULL,NULL,913),('','2022-03-03 12:47:43','','2022-03-03 12:47:43',0,334,'2022-03-03 18:30:00',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,2,NULL,NULL,NULL,NULL,NULL,912),('','2022-03-03 12:47:43','','2022-03-03 12:47:43',0,335,'2022-03-03 18:30:00',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,2,NULL,NULL,NULL,NULL,NULL,915),('','2022-03-03 12:47:43','','2022-03-03 12:47:43',0,336,'2022-03-03 18:30:00',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,2,NULL,NULL,NULL,NULL,NULL,914);
/*!40000 ALTER TABLE `dataRequest` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `default_value`
--

DROP TABLE IF EXISTS `default_value`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `default_value` (
  `createdBy` varchar(255) DEFAULT NULL,
  `createdOn` datetime DEFAULT NULL,
  `editedBy` varchar(255) DEFAULT NULL,
  `editedOn` datetime DEFAULT NULL,
  `status` int NOT NULL DEFAULT '0',
  `id` int NOT NULL AUTO_INCREMENT,
  `parameterName` varchar(255) NOT NULL,
  `unit` varchar(255) NOT NULL,
  `administrationLevel` varchar(255) NOT NULL,
  `source` varchar(255) NOT NULL,
  `year` int NOT NULL,
  `value` varchar(255) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `default_value`
--

LOCK TABLES `default_value` WRITE;
/*!40000 ALTER TABLE `default_value` DISABLE KEYS */;
INSERT INTO `default_value` VALUES (NULL,NULL,NULL,NULL,0,1,'CO2 emission factor','t-CO2/TJ','International','IPCC',2020,'640'),(NULL,NULL,NULL,NULL,0,2,'Net calorific value','TJ/t','International','IPCC',2020,'20');
/*!40000 ALTER TABLE `default_value` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `documents`
--

DROP TABLE IF EXISTS `documents`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `documents` (
  `createdBy` varchar(255) DEFAULT NULL,
  `createdOn` datetime DEFAULT NULL,
  `editedBy` varchar(255) DEFAULT NULL,
  `editedOn` datetime DEFAULT NULL,
  `status` int NOT NULL DEFAULT '0',
  `id` int NOT NULL AUTO_INCREMENT,
  `documentOwner` int NOT NULL,
  `documentOwnerId` int NOT NULL,
  `mimeType` varchar(255) NOT NULL,
  `fileName` varchar(255) NOT NULL,
  `relativePath` varchar(255) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `documents`
--

LOCK TABLES `documents` WRITE;
/*!40000 ALTER TABLE `documents` DISABLE KEYS */;
INSERT INTO `documents` VALUES ('-','2022-02-26 04:23:30','-','2022-02-26 04:23:30',0,4,1,3,'application/pdf','Test document.pdf','Project/3/3e2f15eb.pdf');
/*!40000 ALTER TABLE `documents` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `financing_scheme`
--

DROP TABLE IF EXISTS `financing_scheme`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `financing_scheme` (
  `createdBy` varchar(255) DEFAULT NULL,
  `createdOn` datetime DEFAULT NULL,
  `editedBy` varchar(255) DEFAULT NULL,
  `editedOn` datetime DEFAULT NULL,
  `status` int NOT NULL DEFAULT '0',
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) DEFAULT NULL,
  `description` varchar(2500) DEFAULT NULL,
  `sortOrder` int NOT NULL DEFAULT '1',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `financing_scheme`
--

LOCK TABLES `financing_scheme` WRITE;
/*!40000 ALTER TABLE `financing_scheme` DISABLE KEYS */;
INSERT INTO `financing_scheme` VALUES ('2021-11-30 00:00:00','2021-11-30 00:00:00','2021-11-30 00:00:00','2021-11-30 00:00:00',1,1,'Loan','Loan',1),('2021-11-30 00:00:00','2021-11-30 00:00:00','2021-11-30 00:00:00','2021-11-30 00:00:00',1,2,'Grant','Grant',1),('2021-11-30 00:00:00','2021-11-30 00:00:00','2021-11-30 00:00:00','2021-11-30 00:00:00',1,3,'Equity Only','Equity Only',1);
/*!40000 ALTER TABLE `financing_scheme` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `institution`
--

DROP TABLE IF EXISTS `institution`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `institution` (
  `createdBy` varchar(255) DEFAULT NULL,
  `createdOn` datetime DEFAULT NULL,
  `editedBy` varchar(255) DEFAULT NULL,
  `editedOn` datetime DEFAULT NULL,
  `status` int NOT NULL DEFAULT '0',
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `description` varchar(300) DEFAULT NULL,
  `sortOrder` int NOT NULL,
  `isNational` tinyint DEFAULT NULL,
  `deletedAt` datetime(6) DEFAULT NULL,
  `canNotDelete` tinyint NOT NULL DEFAULT '0',
  `address` varchar(100) DEFAULT NULL,
  `telephoneNumber` varchar(255) NOT NULL,
  `email` varchar(30) DEFAULT NULL,
  `categoryId` int DEFAULT NULL,
  `typeId` int DEFAULT NULL,
  `parentInstitutionId` int DEFAULT NULL,
  `sectorId` int DEFAULT NULL,
  `countryId` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `IDX_d218ad3566afa9e396f184fd7d` (`name`),
  KEY `FK_624b822b4a45197c6f0b88051bc` (`categoryId`),
  KEY `FK_4893e540d687978250eb88fa2dc` (`typeId`),
  KEY `FK_3ca64cf0f964345e07b4c469bbe` (`parentInstitutionId`),
  KEY `FK_f3f21862097ed00c4daee496c71` (`sectorId`),
  KEY `FK_44ff376c15f8ecc9e2290605050` (`countryId`),
  CONSTRAINT `FK_3ca64cf0f964345e07b4c469bbe` FOREIGN KEY (`parentInstitutionId`) REFERENCES `institution` (`id`),
  CONSTRAINT `FK_44ff376c15f8ecc9e2290605050` FOREIGN KEY (`countryId`) REFERENCES `country` (`id`),
  CONSTRAINT `FK_4893e540d687978250eb88fa2dc` FOREIGN KEY (`typeId`) REFERENCES `institution_type` (`id`),
  CONSTRAINT `FK_624b822b4a45197c6f0b88051bc` FOREIGN KEY (`categoryId`) REFERENCES `institution_category` (`id`),
  CONSTRAINT `FK_f3f21862097ed00c4daee496c71` FOREIGN KEY (`sectorId`) REFERENCES `sector` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=35 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `institution`
--

LOCK TABLES `institution` WRITE;
/*!40000 ALTER TABLE `institution` DISABLE KEYS */;
INSERT INTO `institution` VALUES (NULL,NULL,NULL,NULL,0,1,'Environment Ministry','Environment Ministry',1,NULL,NULL,0,'Test 1','0710892190','Test@Gmail.com',1,1,NULL,1,1),(NULL,NULL,NULL,NULL,0,2,'Transport Ministry','Transport Ministry',2,NULL,NULL,0,'Test 1','0710892190','Test@Gmail.com',1,2,1,1,1),(NULL,NULL,NULL,NULL,0,3,'Data Provider 1','Data Provider 1',3,NULL,NULL,0,'Test 1','0710892190','Test@Gmail.com',1,3,2,1,1),(NULL,NULL,NULL,NULL,0,4,'Data Provider 2','Data Provider 2',4,NULL,NULL,0,'Test 1','0710892190','Test@Gmail.com',1,3,2,1,1),(NULL,NULL,NULL,NULL,0,5,'Data Provider 3','Data Provider 3',5,NULL,NULL,0,'Test 1','0710892190','Test@Gmail.com',1,3,2,1,1),(NULL,NULL,NULL,NULL,0,6,'Technical Team','Technical Team',6,NULL,NULL,0,'Test 1','0710892190','Test@Gmail.com',1,4,2,1,1),(NULL,NULL,NULL,NULL,0,7,'Data Collection Team','Data Collection Team',7,NULL,NULL,0,'Test 1','0710892190','Test@Gmail.com',1,5,2,1,1),(NULL,NULL,NULL,NULL,0,8,'QCTeam','QCTeam',8,NULL,NULL,0,'Test 1','0710892190','Test@Gmail.com',1,6,2,1,1),('-','2022-02-25 14:35:02','-','2022-02-25 14:35:02',0,10,'National Transport Board','Institution responsible for the public transportation',0,0,NULL,0,'','+94 71-404-7715','NTB@gmail.com',1,3,NULL,1,NULL),('-','2022-02-25 14:41:46','-','2022-02-25 14:41:46',0,11,'Petroleum Corporation','Description',0,0,NULL,0,'Address','+94 71-564-2990','PC@gmail.com',2,3,NULL,1,NULL),('-','2022-02-25 14:43:30','-','2022-02-25 14:43:30',0,12,'Road Development Authority','Responsible for the development of roads ',0,0,NULL,0,NULL,'+94 71-562-5990','RDA@gmail.com',3,3,NULL,1,NULL),('-','2022-02-27 05:50:47','-','2022-02-27 05:50:47',0,13,'Sri Lanka Sustainable Energy Authority','Provide \"Total fuel used for ground transport\"',0,0,NULL,0,'No. 72\nAnanda Coomaraswamy Mawatha\nColombo 07\nSri Lanka','+94 11-257-5089','info@energy.gov.lk',1,3,NULL,1,NULL),('-','2022-02-27 13:01:12','-','2022-02-27 13:01:12',0,14,'Federal Ministry of Transportation-Nigeria','Federal Ministry of Transportation-Nigeria',0,0,NULL,0,'Federal Ministry of Transportation-Nigeria','+91 23-654-8953','Mintransport@ngr.com',1,3,NULL,1,NULL),('-','2022-02-27 13:04:24','-','2022-02-27 13:04:24',0,16,'Ministry of Petroleum and Natural Resources- Nigeria','Ministry of Petroleum and Natural Resources- Nigeria',0,0,NULL,0,'Ministry of Petroleum and Natural Resources- Nigeria','+91 23-654-8985','Minpetoleum@ngr.com',1,3,NULL,1,NULL),('-','2022-02-27 13:05:23','-','2022-02-27 13:05:23',0,17,'Ministry of Environment- Nigeria','Ministry of Environment- Nigeria',0,0,NULL,0,'Ministry of Environment- Nigeria','+91 23-654-5624','Minenvironment@ngr.com',1,2,NULL,1,NULL),('-','2022-02-27 13:06:44','-','2022-02-27 13:06:44',0,18,'Ministry of Energy- Nigeria','Ministry of Energy- Nigeria',0,0,NULL,0,'Ministry of Energy- Nigeria','+35 62-452-3653','Minenergy@ngr.com',1,5,NULL,1,NULL),('-','2022-03-02 10:27:09','-','2022-03-02 10:27:09',0,19,'test','122324',0,0,NULL,0,'no.102/3,\n\'Mawatha\',\nWewagedara','+94 71-589-5862','123445@gmail.com',1,3,NULL,1,NULL),('-','2022-03-03 04:03:11','-','2022-03-03 04:03:11',0,20,'Energy Authority','Data provider for the assessment',0,0,NULL,0,'Sri Lanka Sustainable Energy Authority\n72, Ananda Coomaraswamy Mawatha,\nColombo 07.','+94 11-257-5114','sea@dataentryuser.gov.lk',1,3,NULL,1,NULL),('-','2022-03-03 07:44:13','-','2022-03-03 07:44:13',1,21,'NoSpace',NULL,0,0,'2022-03-03 07:44:41.000000',0,NULL,'+23 __-___-____','joe@gm.com',1,5,NULL,1,NULL),('-','2022-03-03 07:52:09','-','2022-03-03 07:52:09',0,27,'NoSpaces','AdDescriptiondress',0,0,NULL,0,'Address','+94 12-345-6789','joe@gm.com',1,2,NULL,1,NULL),('-','2022-03-03 08:51:56','-','2022-03-03 08:51:56',0,30,'NoSpacess','Description',0,0,NULL,0,'Address','+94 12-345-6789','joe@gm.com',1,2,NULL,1,NULL),('-','2022-03-03 08:56:33','-','2022-03-03 08:56:33',0,31,'InName ','Description',0,0,NULL,0,'Address','+94 12-345-6789','joe@gm.com',4,1,NULL,1,NULL),('-','2022-03-03 09:09:48','-','2022-03-03 09:09:48',0,32,'Sri Lanka Transport Board','Main government-owned public transport provider ',0,0,NULL,0,'37, school lane, Gangodawila, Nugegoda','+07 72-595-819_','sltb@info.lk',1,3,NULL,1,NULL),('-','2022-03-03 13:38:37','-','2022-03-03 13:38:37',0,34,'Ministry of Land Transport',NULL,0,0,NULL,0,NULL,'+94 71-404-7715','NTC@gmail.com',1,3,NULL,1,NULL);
/*!40000 ALTER TABLE `institution` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `institution_category`
--

DROP TABLE IF EXISTS `institution_category`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `institution_category` (
  `createdBy` varchar(255) DEFAULT NULL,
  `createdOn` datetime DEFAULT NULL,
  `editedBy` varchar(255) DEFAULT NULL,
  `editedOn` datetime DEFAULT NULL,
  `status` int NOT NULL DEFAULT '0',
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) DEFAULT NULL,
  `description` varchar(2500) DEFAULT NULL,
  `sortOrder` int NOT NULL DEFAULT '1',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `institution_category`
--

LOCK TABLES `institution_category` WRITE;
/*!40000 ALTER TABLE `institution_category` DISABLE KEYS */;
INSERT INTO `institution_category` VALUES (NULL,NULL,NULL,NULL,0,1,'Government','Government',1),(NULL,NULL,NULL,NULL,0,2,'Semi-Government','Semi-Government',1),(NULL,NULL,NULL,NULL,0,3,'Private','Private',1),(NULL,NULL,NULL,NULL,0,4,'Public-privet partnership','Public-privet partnership',1),(NULL,NULL,NULL,NULL,0,5,'NGO','NGO',1),(NULL,NULL,NULL,NULL,0,6,'Other','Other',1);
/*!40000 ALTER TABLE `institution_category` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `institution_type`
--

DROP TABLE IF EXISTS `institution_type`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `institution_type` (
  `createdBy` varchar(255) DEFAULT NULL,
  `createdOn` datetime DEFAULT NULL,
  `editedBy` varchar(255) DEFAULT NULL,
  `editedOn` datetime DEFAULT NULL,
  `status` int NOT NULL DEFAULT '0',
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) DEFAULT NULL,
  `description` varchar(2500) DEFAULT NULL,
  `sortOrder` int NOT NULL DEFAULT '1',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `institution_type`
--

LOCK TABLES `institution_type` WRITE;
/*!40000 ALTER TABLE `institution_type` DISABLE KEYS */;
INSERT INTO `institution_type` VALUES (NULL,NULL,NULL,NULL,0,1,'UNFCCC Focal Point','UNFCCC Focal Point',1),(NULL,NULL,NULL,NULL,0,2,'NDC Unit','NDC Unit',1),(NULL,NULL,NULL,NULL,0,3,'Data provider institution','Data provider institution',1),(NULL,NULL,NULL,NULL,0,4,'Technical Team','Technical Team',1),(NULL,NULL,NULL,NULL,0,5,'Data Collection Team','Data Collection Team',1),(NULL,NULL,NULL,NULL,0,6,'QC Team','QC Team',1);
/*!40000 ALTER TABLE `institution_type` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `instype_usertype`
--

DROP TABLE IF EXISTS `instype_usertype`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `instype_usertype` (
  `institutionTypeId` int NOT NULL,
  `userTypeId` int NOT NULL,
  PRIMARY KEY (`institutionTypeId`,`userTypeId`),
  KEY `IDX_4c03eadc28c1215b41ebae1199` (`institutionTypeId`),
  KEY `IDX_9d5682e2e132e5921fdf9a9b62` (`userTypeId`),
  CONSTRAINT `FK_4c03eadc28c1215b41ebae11990` FOREIGN KEY (`institutionTypeId`) REFERENCES `institution_type` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `FK_9d5682e2e132e5921fdf9a9b629` FOREIGN KEY (`userTypeId`) REFERENCES `user_type` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `instype_usertype`
--

LOCK TABLES `instype_usertype` WRITE;
/*!40000 ALTER TABLE `instype_usertype` DISABLE KEYS */;
INSERT INTO `instype_usertype` VALUES (1,1),(1,2),(2,3),(2,4),(3,8),(3,9),(4,5),(5,6),(6,7);
/*!40000 ALTER TABLE `instype_usertype` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `learning_material`
--

DROP TABLE IF EXISTS `learning_material`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `learning_material` (
  `createdBy` varchar(255) DEFAULT NULL,
  `createdOn` datetime DEFAULT NULL,
  `editedBy` varchar(255) DEFAULT NULL,
  `editedOn` datetime DEFAULT NULL,
  `status` int NOT NULL DEFAULT '0',
  `id` int NOT NULL AUTO_INCREMENT,
  `documentType` varchar(255) DEFAULT NULL,
  `documentName` varchar(255) DEFAULT NULL,
  `document` varchar(255) DEFAULT NULL,
  `thumbnail` varchar(255) NOT NULL DEFAULT 'https://www.pngkey.com/png/detail/342-3428680_document-clipart.png',
  `isPublish` int DEFAULT NULL,
  `deletedAt` datetime(6) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `learning_material`
--

LOCK TABLES `learning_material` WRITE;
/*!40000 ALTER TABLE `learning_material` DISABLE KEYS */;
INSERT INTO `learning_material` VALUES (NULL,'2022-02-02 12:52:40',NULL,'2022-02-02 12:52:40',0,1,'User Guidance','test document','https://s1.q4cdn.com/806093406/files/doc_downloads/test.pdf','https://www.pngkey.com/png/detail/342-3428680_document-clipart.png',1,NULL),(NULL,'2022-02-02 12:52:40',NULL,'2022-02-02 12:52:40',0,2,'Learning Material','test','https://www.youtube.com/watch?v=X0Kj8dD_X_M','https://www.pngkey.com/png/detail/342-3428680_document-clipart.png',1,NULL),(NULL,'2022-02-02 12:52:40',NULL,'2022-02-02 12:52:40',0,3,'Learning Material','test2','https://www.youtube.com/watch?v=X0Kj8dD_X_M','https://www.pngkey.com/png/detail/342-3428680_document-clipart.png',1,NULL),(NULL,'2022-02-02 12:52:40',NULL,'2022-02-02 12:52:40',0,4,'User Guidence','Good data and research….helps us to focus on what matters and take the right action in our climate battle','https://www.youtube.com/watch?v=_8SWcuusWFI&list=PL72b4VTONst3uH_PfcsDKxrpVnnXnBT4N','https://www.pngkey.com/png/detail/342-3428680_document-clipart.png',1,NULL),(NULL,'2022-02-02 12:52:40',NULL,'2022-02-02 12:52:40',0,5,'User Guidence','Strengthening climate action through NDC and enhanced transparency initiative','https://www.youtube.com/watch?v=X8gjtdZOwuM&list=PL72b4VTONst3uH_PfcsDKxrpVnnXnBT4N','https://www.pngkey.com/png/detail/342-3428680_document-clipart.png',1,NULL);
/*!40000 ALTER TABLE `learning_material` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `learning_material_sector`
--

DROP TABLE IF EXISTS `learning_material_sector`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `learning_material_sector` (
  `createdBy` varchar(255) DEFAULT NULL,
  `createdOn` datetime DEFAULT NULL,
  `editedBy` varchar(255) DEFAULT NULL,
  `editedOn` datetime DEFAULT NULL,
  `status` int NOT NULL DEFAULT '0',
  `id` int NOT NULL AUTO_INCREMENT,
  `learningMaterial2Id` int DEFAULT NULL,
  `sectorId` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FK_896211865857258fb8cae3434d4` (`learningMaterial2Id`),
  KEY `FK_05475f6a338a7a5d6dcc19d3917` (`sectorId`),
  CONSTRAINT `FK_05475f6a338a7a5d6dcc19d3917` FOREIGN KEY (`sectorId`) REFERENCES `sector` (`id`),
  CONSTRAINT `FK_896211865857258fb8cae3434d4` FOREIGN KEY (`learningMaterial2Id`) REFERENCES `learning_material` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `learning_material_sector`
--

LOCK TABLES `learning_material_sector` WRITE;
/*!40000 ALTER TABLE `learning_material_sector` DISABLE KEYS */;
/*!40000 ALTER TABLE `learning_material_sector` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `learning_material_user_type`
--

DROP TABLE IF EXISTS `learning_material_user_type`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `learning_material_user_type` (
  `createdBy` varchar(255) DEFAULT NULL,
  `createdOn` datetime DEFAULT NULL,
  `editedBy` varchar(255) DEFAULT NULL,
  `editedOn` datetime DEFAULT NULL,
  `status` int NOT NULL DEFAULT '0',
  `id` int NOT NULL AUTO_INCREMENT,
  `learningMaterialId` int DEFAULT NULL,
  `userTypeId` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FK_79de6299326ccddcfa7ea877019` (`learningMaterialId`),
  KEY `FK_67aeae28f6be57ee476b6b68178` (`userTypeId`),
  CONSTRAINT `FK_67aeae28f6be57ee476b6b68178` FOREIGN KEY (`userTypeId`) REFERENCES `user_type` (`id`),
  CONSTRAINT `FK_79de6299326ccddcfa7ea877019` FOREIGN KEY (`learningMaterialId`) REFERENCES `learning_material` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `learning_material_user_type`
--

LOCK TABLES `learning_material_user_type` WRITE;
/*!40000 ALTER TABLE `learning_material_user_type` DISABLE KEYS */;
/*!40000 ALTER TABLE `learning_material_user_type` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `methodology`
--

DROP TABLE IF EXISTS `methodology`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `methodology` (
  `createdBy` varchar(255) DEFAULT NULL,
  `createdOn` datetime DEFAULT NULL,
  `editedBy` varchar(255) DEFAULT NULL,
  `editedOn` datetime DEFAULT NULL,
  `status` int NOT NULL DEFAULT '0',
  `id` int NOT NULL AUTO_INCREMENT,
  `version` varchar(255) DEFAULT NULL,
  `name` varchar(255) DEFAULT NULL,
  `developedBy` varchar(255) DEFAULT NULL,
  `parentId` int DEFAULT NULL,
  `applicableSector` varchar(255) DEFAULT NULL,
  `Documents` varchar(255) DEFAULT NULL,
  `easenessOfDataCollection` varchar(255) DEFAULT NULL,
  `countryId` int DEFAULT NULL,
  `sectorId` int DEFAULT NULL,
  `mitigationActionTypeId` int DEFAULT NULL,
  `applicabilityId` int DEFAULT NULL,
  `displayName` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FK_233d133d9992c1191c613a9b345` (`countryId`),
  KEY `FK_115ce1bdd3f8dbb2e36d49ff71f` (`sectorId`),
  KEY `FK_b9c3f66fd6907e1550008854ecc` (`mitigationActionTypeId`),
  KEY `FK_8db0e9afc027c589d41bea7e56d` (`applicabilityId`),
  CONSTRAINT `FK_115ce1bdd3f8dbb2e36d49ff71f` FOREIGN KEY (`sectorId`) REFERENCES `sector` (`id`),
  CONSTRAINT `FK_233d133d9992c1191c613a9b345` FOREIGN KEY (`countryId`) REFERENCES `country` (`id`),
  CONSTRAINT `FK_8db0e9afc027c589d41bea7e56d` FOREIGN KEY (`applicabilityId`) REFERENCES `applicability` (`id`),
  CONSTRAINT `FK_b9c3f66fd6907e1550008854ecc` FOREIGN KEY (`mitigationActionTypeId`) REFERENCES `mitigationActionType` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `methodology`
--

LOCK TABLES `methodology` WRITE;
/*!40000 ALTER TABLE `methodology` DISABLE KEYS */;
INSERT INTO `methodology` VALUES (NULL,NULL,NULL,NULL,0,1,'AMS-iii-S','AMS-iii-S_person','CDM',NULL,'Transport',NULL,'4',1,1,3,3,'AMS-III.S - Introduction of low-emission vehicles/technologies to commercial vehicle fleets (person)'),(NULL,NULL,NULL,NULL,0,2,'ICAT_TPM_RP_2020_Toll_roads','ICAT_TPM_RP_2020_Toll_roads','ICAT',NULL,'Transport',NULL,'4',1,1,3,3,'ICAT transport pricing guidance - Road pricing (road tolls and congestion pricing)'),(NULL,NULL,NULL,NULL,0,3,'ICAT_TPM_FSR_2020_A','ICAT_TPM_FSR_2020_A','ICAT',NULL,'Transport',NULL,'4',1,1,3,3,'ICAT methodology for fuel subsidy removal and increased fuel tax or levy Approach A (top-down energy-use data_Fuel mix)'),(NULL,NULL,NULL,NULL,0,4,'ICAT_TPM_FSR_2020_B','ICAT_TPM_FSR_2020_B','ICAT',NULL,'Transport',NULL,'4',1,1,3,3,'ICAT methodology for fuel subsidy removal and increased fuel tax or levy _Approach B (top-down energy-use data_Gasoline & Diesel)'),(NULL,NULL,NULL,NULL,0,5,'ICAT_TPM_FSR_2020_C','ICAT_TPM_FSR_2020_C','ICAT',NULL,'Transport',NULL,'4',1,1,3,3,'ICAT methodology for fuel subsidy removal and increased fuel tax or levy _Approach C (top-down energy-use data & bottom-up travel activity data )'),(NULL,NULL,NULL,NULL,0,6,'ICAT_TPM_RP_2020_cordon','ICAT_TPM_RP_2020_cordon','ICAT',NULL,'Transport',NULL,'4',1,1,3,3,'ICAT_TPM_RP_2020_cordon'),(NULL,NULL,NULL,NULL,0,7,'AMS-iii-S','AMS-iii-S_freight','CDM',NULL,'Transport',NULL,'4',1,1,3,3,'AMS-III.S - Introduction of low-emission vehicles/technologies to commercial vehicle fleets (Freight)');
/*!40000 ALTER TABLE `methodology` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `methodology_ndc`
--

DROP TABLE IF EXISTS `methodology_ndc`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `methodology_ndc` (
  `ndcId` int NOT NULL,
  `methodologyId` int NOT NULL,
  PRIMARY KEY (`ndcId`,`methodologyId`),
  KEY `IDX_2b2d4660abda99ab9f7d971dc5` (`ndcId`),
  KEY `IDX_2463571bae328e7725bba2af3c` (`methodologyId`),
  CONSTRAINT `FK_2463571bae328e7725bba2af3c3` FOREIGN KEY (`methodologyId`) REFERENCES `methodology` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `FK_2b2d4660abda99ab9f7d971dc5c` FOREIGN KEY (`ndcId`) REFERENCES `ndc` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `methodology_ndc`
--

LOCK TABLES `methodology_ndc` WRITE;
/*!40000 ALTER TABLE `methodology_ndc` DISABLE KEYS */;
/*!40000 ALTER TABLE `methodology_ndc` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `methodology_subndc`
--

DROP TABLE IF EXISTS `methodology_subndc`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `methodology_subndc` (
  `subNdcId` int NOT NULL,
  `methodologyId` int NOT NULL,
  PRIMARY KEY (`subNdcId`,`methodologyId`),
  KEY `IDX_89cf69a71a543fc436e4ca461f` (`subNdcId`),
  KEY `IDX_a92fe16339b57a384579b850d5` (`methodologyId`),
  CONSTRAINT `FK_89cf69a71a543fc436e4ca461fa` FOREIGN KEY (`subNdcId`) REFERENCES `sub_ndc` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `FK_a92fe16339b57a384579b850d5d` FOREIGN KEY (`methodologyId`) REFERENCES `methodology` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `methodology_subndc`
--

LOCK TABLES `methodology_subndc` WRITE;
/*!40000 ALTER TABLE `methodology_subndc` DISABLE KEYS */;
/*!40000 ALTER TABLE `methodology_subndc` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `methodology_subsection`
--

DROP TABLE IF EXISTS `methodology_subsection`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `methodology_subsection` (
  `createdBy` varchar(255) DEFAULT NULL,
  `createdOn` datetime DEFAULT NULL,
  `editedBy` varchar(255) DEFAULT NULL,
  `editedOn` datetime DEFAULT NULL,
  `status` int NOT NULL DEFAULT '0',
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) DEFAULT NULL,
  `description` varchar(2500) DEFAULT NULL,
  `sortOrder` int NOT NULL DEFAULT '1',
  `type` varchar(255) NOT NULL,
  `parentType` varchar(255) NOT NULL,
  `methodologyId` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FK_0ba5a9311f6e858d5ed20af94fa` (`methodologyId`),
  CONSTRAINT `FK_0ba5a9311f6e858d5ed20af94fa` FOREIGN KEY (`methodologyId`) REFERENCES `methodology` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `methodology_subsection`
--

LOCK TABLES `methodology_subsection` WRITE;
/*!40000 ALTER TABLE `methodology_subsection` DISABLE KEYS */;
/*!40000 ALTER TABLE `methodology_subsection` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `migrations`
--

DROP TABLE IF EXISTS `migrations`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `migrations` (
  `id` int NOT NULL AUTO_INCREMENT,
  `timestamp` bigint NOT NULL,
  `name` varchar(255) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `migrations`
--

LOCK TABLES `migrations` WRITE;
/*!40000 ALTER TABLE `migrations` DISABLE KEYS */;
/*!40000 ALTER TABLE `migrations` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `mitigationActionType`
--

DROP TABLE IF EXISTS `mitigationActionType`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `mitigationActionType` (
  `createdBy` varchar(255) DEFAULT NULL,
  `createdOn` datetime DEFAULT NULL,
  `editedBy` varchar(255) DEFAULT NULL,
  `editedOn` datetime DEFAULT NULL,
  `status` int NOT NULL DEFAULT '0',
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) DEFAULT NULL,
  `description` varchar(2500) DEFAULT NULL,
  `sortOrder` int NOT NULL DEFAULT '1',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `mitigationActionType`
--

LOCK TABLES `mitigationActionType` WRITE;
/*!40000 ALTER TABLE `mitigationActionType` DISABLE KEYS */;
INSERT INTO `mitigationActionType` VALUES (NULL,NULL,NULL,NULL,0,1,'Fuel Pricing Policices','Fuel Pricing Policices',1),(NULL,NULL,NULL,NULL,0,2,'Inter Urban Rail Infrastructure','Inter Urban Rail Infrastructure',2),(NULL,NULL,NULL,NULL,0,3,'Alternative Fuels Incentives,Regulation and Production ','Alternative Fuels Incentives,Regulation and Production ',3);
/*!40000 ALTER TABLE `mitigationActionType` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `ndc`
--

DROP TABLE IF EXISTS `ndc`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `ndc` (
  `createdBy` varchar(255) DEFAULT NULL,
  `createdOn` datetime DEFAULT NULL,
  `editedBy` varchar(255) DEFAULT NULL,
  `editedOn` datetime DEFAULT NULL,
  `status` int NOT NULL DEFAULT '0',
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) DEFAULT NULL,
  `description` varchar(2500) DEFAULT NULL,
  `sortOrder` int NOT NULL DEFAULT '1',
  `setId` int DEFAULT NULL,
  `countryId` int DEFAULT NULL,
  `sectorId` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FK_92389299b167ac885ba3bec8657` (`setId`),
  KEY `FK_7e561bde5bd1c89bb8a54e13a2f` (`countryId`),
  KEY `FK_654634fb70af569a33c1cdb994c` (`sectorId`),
  CONSTRAINT `FK_654634fb70af569a33c1cdb994c` FOREIGN KEY (`sectorId`) REFERENCES `sector` (`id`),
  CONSTRAINT `FK_7e561bde5bd1c89bb8a54e13a2f` FOREIGN KEY (`countryId`) REFERENCES `country` (`id`),
  CONSTRAINT `FK_92389299b167ac885ba3bec8657` FOREIGN KEY (`setId`) REFERENCES `ndc_set` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ndc`
--

LOCK TABLES `ndc` WRITE;
/*!40000 ALTER TABLE `ndc` DISABLE KEYS */;
INSERT INTO `ndc` VALUES ('-','2022-02-24 18:32:27','-','2022-02-24 18:32:27',1,1,'NDC','test',1,1,1,1),('-','2022-02-25 09:38:25','-','2022-02-25 09:38:25',1,2,'25% trucks and buses using CNG by 2030','test',1,1,1,1),('-','2022-02-28 11:29:18','-','2022-02-28 11:29:18',0,3,'Test_NDC 1','test',1,3,1,1),('-','2022-03-03 07:48:46','-','2022-03-03 07:48:46',0,4,'Promote electric mobility and hybrid vehicles','test',1,3,1,1);
/*!40000 ALTER TABLE `ndc` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `ndc_set`
--

DROP TABLE IF EXISTS `ndc_set`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `ndc_set` (
  `createdBy` varchar(255) DEFAULT NULL,
  `createdOn` datetime DEFAULT NULL,
  `editedBy` varchar(255) DEFAULT NULL,
  `editedOn` datetime DEFAULT NULL,
  `status` int NOT NULL DEFAULT '0',
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) DEFAULT NULL,
  `description` varchar(2500) DEFAULT NULL,
  `sortOrder` int NOT NULL DEFAULT '1',
  `submissionDate` datetime NOT NULL,
  `countryId` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FK_ca2befaabb1b648bef65426505e` (`countryId`),
  CONSTRAINT `FK_ca2befaabb1b648bef65426505e` FOREIGN KEY (`countryId`) REFERENCES `country` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ndc_set`
--

LOCK TABLES `ndc_set` WRITE;
/*!40000 ALTER TABLE `ndc_set` DISABLE KEYS */;
INSERT INTO `ndc_set` VALUES ('-','2022-02-24 18:32:07','-','2022-02-24 18:32:07',0,1,'Test 1',NULL,1,'2020-01-01 00:00:00',1),('-','2022-02-25 11:46:01','-','2022-02-25 11:46:01',0,2,'Test 1',NULL,1,'2925-01-01 00:00:00',1),('-','2022-02-28 11:24:22','-','2022-02-28 11:24:22',0,3,'Generic enabling activities',NULL,1,'2020-01-01 00:00:00',1);
/*!40000 ALTER TABLE `ndc_set` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `parameter`
--

DROP TABLE IF EXISTS `parameter`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `parameter` (
  `createdBy` varchar(255) DEFAULT NULL,
  `createdOn` datetime DEFAULT NULL,
  `editedBy` varchar(255) DEFAULT NULL,
  `editedOn` datetime DEFAULT NULL,
  `status` int NOT NULL DEFAULT '0',
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) DEFAULT NULL,
  `isAlternative` tinyint DEFAULT NULL,
  `ParentParameterId` int DEFAULT NULL,
  `isBaseline` tinyint DEFAULT NULL,
  `isProject` tinyint DEFAULT NULL,
  `isLekage` tinyint DEFAULT NULL,
  `isProjection` tinyint DEFAULT NULL,
  `vehical` varchar(255) DEFAULT NULL,
  `fuelType` varchar(255) DEFAULT NULL,
  `route` varchar(255) DEFAULT NULL,
  `powerPlant` varchar(255) DEFAULT NULL,
  `uomDataRequest` varchar(255) DEFAULT NULL,
  `uomDataEntry` varchar(255) DEFAULT NULL,
  `value` varchar(255) DEFAULT NULL,
  `conversionValue` varchar(255) DEFAULT NULL,
  `baseYear` int DEFAULT NULL,
  `projectionBaseYear` int DEFAULT NULL,
  `useDefaultValue` tinyint DEFAULT NULL,
  `AssessmentYear` int DEFAULT NULL,
  `projectionYear` int DEFAULT NULL,
  `code` varchar(255) DEFAULT NULL,
  `methodologyCode` varchar(255) DEFAULT NULL,
  `methodologyVersion` varchar(255) DEFAULT NULL,
  `institutionId` int DEFAULT NULL,
  `assessmentId` int DEFAULT NULL,
  `defaultValueId` int DEFAULT NULL,
  `originalName` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FK_c584a0d5a74c7cfb5bcc3ecf9f0` (`institutionId`),
  KEY `FK_f65f85e073aff8e11ef4f5c3d8a` (`assessmentId`),
  KEY `FK_86eff4c77820b616bf6ac0c19b2` (`defaultValueId`),
  CONSTRAINT `FK_86eff4c77820b616bf6ac0c19b2` FOREIGN KEY (`defaultValueId`) REFERENCES `default_value` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT `FK_c584a0d5a74c7cfb5bcc3ecf9f0` FOREIGN KEY (`institutionId`) REFERENCES `institution` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT `FK_f65f85e073aff8e11ef4f5c3d8a` FOREIGN KEY (`assessmentId`) REFERENCES `assessment` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE=InnoDB AUTO_INCREMENT=916 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `parameter`
--

LOCK TABLES `parameter` WRITE;
/*!40000 ALTER TABLE `parameter` DISABLE KEYS */;
INSERT INTO `parameter` VALUES (NULL,NULL,NULL,NULL,0,602,'The annual average distance of transportation per person - Diesel-Jeepneys - A24',0,NULL,1,0,0,0,'Jeepneys','Diesel','A24','','km','km','345','345',2010,NULL,0,2024,NULL,'dp','cdm_ams_iii_s','1',3,54,NULL,'The annual average distance of transportation per person'),(NULL,NULL,NULL,NULL,0,603,'Total annual passengers transported - Diesel-Jeepneys - A24',1,NULL,1,0,0,0,'Jeepneys','Diesel','A24','','passengers','passengers','344','344',2010,NULL,0,2024,NULL,'p','cdm_ams_iii_s','1',3,54,NULL,'Total annual passengers transported'),(NULL,NULL,NULL,NULL,0,604,'Total annual distance - Diesel-Jeepneys - A24',1,NULL,1,0,0,0,'Jeepneys','Diesel','A24','','km','km','34','34',2010,NULL,0,2024,NULL,'d','cdm_ams_iii_s','1',3,54,NULL,'Total annual distance'),(NULL,NULL,NULL,NULL,0,605,'Fuel efficiency - Diesel-Jeepneys - A24',0,NULL,1,0,0,0,'Jeepneys','Diesel','A24','','fuel/km','fuel/km','45','45',2010,NULL,0,2024,NULL,'n','cdm_ams_iii_s','1',3,54,NULL,'Fuel efficiency'),(NULL,NULL,NULL,NULL,0,606,'The annual average distance of transportation per person - Diesel-train - A24',1,NULL,0,1,0,0,'train','Diesel','A24','','km','km','543','543',2010,NULL,0,2024,NULL,'dp','cdm_ams_iii_s','1',3,54,NULL,'The annual average distance of transportation per person'),(NULL,NULL,NULL,NULL,0,607,'CO2 emission factor - Diesel',0,NULL,1,0,0,0,'','Diesel','','','t-CO2/TJ','t-CO2/TJ','343','343',2010,NULL,0,2024,NULL,'ef','cdm_ams_iii_s','1',3,54,NULL,'CO2 emission factor'),(NULL,NULL,NULL,NULL,0,608,'Net calorific value - Diesel',0,NULL,1,0,0,0,'','Diesel','','','TJ/t','TJ/t','344','344',2010,NULL,0,2024,NULL,'ncv','cdm_ams_iii_s','1',3,54,NULL,'Net calorific value'),(NULL,NULL,NULL,NULL,0,609,'Total annual distance - Diesel-train - A24',0,NULL,0,1,0,0,'train','Diesel','A24','','km','km','443','443',2010,NULL,0,2024,NULL,'d','cdm_ams_iii_s','1',3,54,NULL,'Total annual distance'),(NULL,NULL,NULL,NULL,0,610,'Total annual passengers transported - Diesel-train - A24',0,NULL,0,1,0,0,'train','Diesel','A24','','passengers','passengers','343','343',2010,NULL,0,2024,NULL,'p','cdm_ams_iii_s','1',3,54,NULL,'Total annual passengers transported'),(NULL,NULL,NULL,NULL,0,611,'Consumption of fuel - Diesel-train - A24',0,NULL,0,1,0,0,'train','Diesel','A24','','t/y','t/y','344','344',2010,NULL,0,2024,NULL,'fc','cdm_ams_iii_s','1',3,54,NULL,'Consumption of fuel'),(NULL,NULL,NULL,NULL,0,612,'Fuel efficiency - Diesel-train - A24',1,NULL,0,1,0,0,'train','Diesel','A24','','fuel/km','fuel/km','34','34',2010,NULL,0,2024,NULL,'n','cdm_ams_iii_s','1',3,54,NULL,'Fuel efficiency'),(NULL,NULL,NULL,NULL,0,613,'CO2 emission factor - Diesel',0,NULL,0,1,0,0,'','Diesel','','','t-CO2/TJ','t-CO2/TJ','343','343',2010,NULL,0,2024,NULL,'ef','cdm_ams_iii_s','1',3,54,NULL,'CO2 emission factor'),(NULL,NULL,NULL,NULL,0,614,'Net calorific value - Diesel',0,NULL,0,1,0,0,'','Diesel','','','TJ/t','TJ/t','343','343',2010,NULL,0,2024,NULL,'ncv','cdm_ams_iii_s','1',3,54,NULL,'Net calorific value'),(NULL,NULL,NULL,NULL,0,615,'Share of fuel type Petrol - Fuel Mix',0,NULL,1,0,0,0,'','Fuel Mix','','','%','%','50','50',2020,NULL,0,2025,NULL,'fuelShare','ICAT_TPM_FSR_2020_A','1',11,55,NULL,'Share of fuel type Petrol'),(NULL,NULL,NULL,NULL,0,616,'Total fuel used for ground transport(Fuel mix) - Fuel Mix',0,NULL,1,0,0,0,'','Fuel Mix','','','TJ','TJ','782000','782000',2020,NULL,0,2025,NULL,'fuelUsed','ICAT_TPM_FSR_2020_A','1',13,55,NULL,'Total fuel used for ground transport(Fuel mix)'),(NULL,NULL,NULL,NULL,0,617,'Share of fuel type Diesel - Fuel Mix',0,NULL,1,0,0,0,'','Fuel Mix','','','%','%','50','50',2020,NULL,0,2025,NULL,'fuelShare','ICAT_TPM_FSR_2020_A','1',11,55,NULL,'Share of fuel type Diesel'),(NULL,NULL,NULL,NULL,0,618,'CO2 emission factor of Diesel - Fuel Mix',0,NULL,1,0,0,0,'','Fuel Mix','','','t-CO2/TJ','t-CO2/TJ','74.1','74.1',2020,NULL,0,2025,NULL,'ef','ICAT_TPM_FSR_2020_A','1',13,55,NULL,'CO2 emission factor of Diesel'),(NULL,NULL,NULL,NULL,0,619,'Actual per capita income in local currency for the assessment year - Fuel Mix',1,NULL,0,1,0,0,'','Fuel Mix','','','price per capita','price per capita','664735','664735',2020,NULL,0,2025,NULL,'capitalIncome','ICAT_TPM_FSR_2020_A','1',3,55,NULL,'Actual per capita income in local currency for the assessment year'),(NULL,NULL,NULL,NULL,0,620,'CO2 emission factor of Petrol - Fuel Mix',0,NULL,1,0,0,0,'','Fuel Mix','','','t-CO2/TJ','t-CO2/TJ','69.3','69.3',2020,NULL,0,2025,NULL,'ef','ICAT_TPM_FSR_2020_A','1',13,55,NULL,'CO2 emission factor of Petrol'),(NULL,NULL,NULL,NULL,0,621,'Fuel mix own - price elasticity - Fuel Mix',0,NULL,0,1,0,0,'','Fuel Mix','','','','','-0.24','-0.24',2020,NULL,0,2025,NULL,'fuelMixPriceElasticity','ICAT_TPM_FSR_2020_A','1',3,55,NULL,'Fuel mix own - price elasticity'),(NULL,NULL,NULL,NULL,0,622,'Country Code - Fuel Mix',1,NULL,0,1,0,0,'','Fuel Mix','','','','','Sri Lanka','Sri Lanka',2020,NULL,0,2025,NULL,'countryCode','ICAT_TPM_FSR_2020_A','1',3,55,NULL,'Country Code'),(NULL,NULL,NULL,NULL,0,623,'Actual fuel mix price in local currency for the assessment year - Fuel Mix',1,NULL,0,1,0,0,'','Fuel Mix','','','price per liter','price per liter','148','148',2020,NULL,0,2025,NULL,'mixFuelPrice','ICAT_TPM_FSR_2020_A','1',3,55,NULL,'Actual fuel mix price in local currency for the assessment year'),(NULL,NULL,NULL,NULL,0,624,'Relative fuel mix price increase - Fuel Mix',0,NULL,0,1,0,0,'','Fuel Mix','','','%','%','10','10',2020,NULL,0,2025,NULL,'fuelMixPriceIncrease','ICAT_TPM_FSR_2020_A','1',3,55,NULL,'Relative fuel mix price increase'),(NULL,NULL,NULL,NULL,0,625,'Projection Base Year 2025',NULL,NULL,0,0,0,1,NULL,NULL,NULL,NULL,'population','population','50000000','50000000',2020,2025,0,NULL,NULL,NULL,NULL,NULL,5,55,NULL,'Projection Base Year 2025'),(NULL,NULL,NULL,NULL,0,626,'Projection Year POP 2025',NULL,NULL,0,0,0,1,NULL,NULL,NULL,NULL,'population','population','53900000','53900000',2020,2025,0,NULL,2025,NULL,NULL,NULL,5,55,NULL,'Projection Year POP 2025'),(NULL,NULL,NULL,NULL,0,627,'Density - Diesel',1,NULL,1,0,0,0,'','Diesel','','','Kg/m3','Kg/m3',NULL,NULL,2020,NULL,0,2020,NULL,'density','ICAT_TPM_FSR_2020_B','1',NULL,56,NULL,'Density'),(NULL,NULL,NULL,NULL,0,628,'Net calorific value - Diesel',0,NULL,1,0,0,0,'','Diesel','','','TJ/t','TJ/t',NULL,NULL,2020,NULL,0,2020,NULL,'ncv','ICAT_TPM_FSR_2020_B','1',NULL,56,NULL,'Net calorific value'),(NULL,NULL,NULL,NULL,0,629,'CO2 emission factor - Diesel',0,NULL,1,0,0,0,'','Diesel','','','t-CO2/TJ','t-CO2/TJ',NULL,NULL,2020,NULL,0,2020,NULL,'ef','ICAT_TPM_FSR_2020_B','1',NULL,56,NULL,'CO2 emission factor'),(NULL,NULL,NULL,NULL,0,630,'Total Diesel used for ground transport (Gg) - Diesel',0,NULL,1,0,0,0,'','Diesel','','','Gg','Gg',NULL,NULL,2020,NULL,0,2020,NULL,'used_weight','ICAT_TPM_FSR_2020_B','1',NULL,56,NULL,'Total Diesel used for ground transport (Gg)'),(NULL,NULL,NULL,NULL,0,631,'Total Diesel used for ground transport (liters) - Diesel',1,NULL,1,0,0,0,'','Diesel','','','liters','liters',NULL,NULL,2020,NULL,0,2020,NULL,'used_liters','ICAT_TPM_FSR_2020_B','1',NULL,56,NULL,'Total Diesel used for ground transport (liters)'),(NULL,NULL,NULL,NULL,0,632,'Diesel own-price elasticity - Diesel',0,NULL,0,1,0,0,'','Diesel','','','','','12434','12434',2020,NULL,0,2020,NULL,'priceElasticity','ICAT_TPM_FSR_2020_B','1',NULL,56,NULL,'Diesel own-price elasticity'),(NULL,NULL,NULL,NULL,0,633,'country Code - Diesel',1,NULL,0,1,0,0,'','Diesel','','','','','43','43',2020,NULL,0,2020,NULL,'countryCode','ICAT_TPM_FSR_2020_B','1',NULL,56,NULL,'country Code'),(NULL,NULL,NULL,NULL,0,634,'Actual fuel price (annual average) in local currency for the assessment year - Diesel',1,NULL,0,1,0,0,'','Diesel','','','price per liter','price per liter','535','535',2020,NULL,0,2020,NULL,'fuelPrice','ICAT_TPM_FSR_2020_B','1',NULL,56,NULL,'Actual fuel price (annual average) in local currency for the assessment year'),(NULL,NULL,NULL,NULL,0,635,'Actual per capita income in local currency for the assessment year - Diesel',1,NULL,0,1,0,0,'','Diesel','','','price per capita','price per capita','435','435',2020,NULL,0,2020,NULL,'capitalIncome','ICAT_TPM_FSR_2020_B','1',NULL,56,NULL,'Actual per capita income in local currency for the assessment year'),(NULL,NULL,NULL,NULL,0,636,'Relative fuel price increase  - Diesel',0,NULL,0,1,0,0,'','Diesel','','','%','%','53','53',2020,NULL,0,2020,NULL,'priceIncrease','ICAT_TPM_FSR_2020_B','1',NULL,56,NULL,'Relative fuel price increase '),(NULL,NULL,NULL,NULL,0,637,'discountrate',0,NULL,0,0,0,0,NULL,NULL,NULL,NULL,NULL,'%','12',NULL,NULL,NULL,NULL,2020,NULL,NULL,NULL,NULL,NULL,57,NULL,NULL),(NULL,NULL,NULL,NULL,0,638,'reduction',0,NULL,0,0,0,0,NULL,NULL,NULL,NULL,NULL,'tCo2e','12',NULL,NULL,NULL,NULL,2020,NULL,NULL,NULL,NULL,NULL,57,NULL,NULL),(NULL,NULL,NULL,NULL,0,639,'bsTotalInvestment',0,NULL,1,0,0,0,NULL,NULL,NULL,NULL,NULL,'$','212',NULL,NULL,NULL,NULL,2020,NULL,NULL,NULL,NULL,NULL,57,NULL,NULL),(NULL,NULL,NULL,NULL,0,640,'bsProjectLife',0,NULL,1,0,0,0,NULL,NULL,NULL,NULL,NULL,'years','12',NULL,NULL,NULL,NULL,2020,NULL,NULL,NULL,NULL,NULL,57,NULL,NULL),(NULL,NULL,NULL,NULL,0,641,'bsAnnualOM',0,NULL,1,0,0,0,NULL,NULL,NULL,NULL,NULL,'$','42',NULL,NULL,NULL,NULL,2020,NULL,NULL,NULL,NULL,NULL,57,NULL,NULL),(NULL,NULL,NULL,NULL,0,642,'bsOtherAnnualCost',0,NULL,1,0,0,0,NULL,NULL,NULL,NULL,NULL,'$','34',NULL,NULL,NULL,NULL,2020,NULL,NULL,NULL,NULL,NULL,57,NULL,NULL),(NULL,NULL,NULL,NULL,0,643,'bsAnnualFuel',0,NULL,1,0,0,0,NULL,NULL,NULL,NULL,NULL,'$','1253',NULL,NULL,NULL,NULL,2020,NULL,NULL,NULL,NULL,NULL,57,NULL,NULL),(NULL,NULL,NULL,NULL,0,644,'psOtherAnnualCost',0,NULL,0,1,0,0,NULL,NULL,NULL,NULL,NULL,'$','313',NULL,NULL,NULL,NULL,2020,NULL,NULL,NULL,NULL,NULL,57,NULL,NULL),(NULL,NULL,NULL,NULL,0,645,'psAnnualOM',0,NULL,0,1,0,0,NULL,NULL,NULL,NULL,NULL,'$','422',NULL,NULL,NULL,NULL,2020,NULL,NULL,NULL,NULL,NULL,57,NULL,NULL),(NULL,NULL,NULL,NULL,0,646,'psTotalInvestment',0,NULL,0,1,0,0,NULL,NULL,NULL,NULL,NULL,'$','1243',NULL,NULL,NULL,NULL,2020,NULL,NULL,NULL,NULL,NULL,57,NULL,NULL),(NULL,NULL,NULL,NULL,0,647,'psAnnualFuel',0,NULL,0,1,0,0,NULL,NULL,NULL,NULL,NULL,'$','12',NULL,NULL,NULL,NULL,2020,NULL,NULL,NULL,NULL,NULL,57,NULL,NULL),(NULL,NULL,NULL,NULL,0,648,'psProjectLife',0,NULL,0,1,0,0,NULL,NULL,NULL,NULL,NULL,'years','432',NULL,NULL,NULL,NULL,2020,NULL,NULL,NULL,NULL,NULL,57,NULL,NULL),(NULL,NULL,NULL,NULL,0,649,'The annual average distance of transportation per person - Petrol-Bus - ss',1,NULL,0,1,0,0,'Bus','Petrol','ss','','km','km','0.54','0.54',2020,NULL,0,2022,NULL,'dp','cdm_ams_iii_s','1',NULL,58,NULL,'The annual average distance of transportation per person'),(NULL,NULL,NULL,NULL,0,650,'The annual average distance of transportation per person - Diesel-Bus - ss',0,NULL,1,0,0,0,'Bus','Diesel','ss','','km','km','0.39030554','0.39030554',2020,NULL,0,2022,NULL,'dp','cdm_ams_iii_s','1',NULL,58,NULL,'The annual average distance of transportation per person'),(NULL,NULL,NULL,NULL,0,651,'Total annual passengers transported - Diesel-Bus - ss',1,NULL,1,0,0,0,'Bus','Diesel','ss','','passengers','passengers','65687','65687',2020,NULL,0,2022,NULL,'p','cdm_ams_iii_s','1',NULL,58,NULL,'Total annual passengers transported'),(NULL,NULL,NULL,NULL,0,652,'Total annual distance - Diesel-Bus - ss',1,NULL,1,0,0,0,'Bus','Diesel','ss','','km','km','25638','25638',2020,NULL,0,2022,NULL,'d','cdm_ams_iii_s','1',NULL,58,NULL,'Total annual distance'),(NULL,NULL,NULL,NULL,0,653,'Fuel efficiency - Diesel-Bus - ss',0,NULL,1,0,0,0,'Bus','Diesel','ss','','fuel/km','fuel/km','0.00336','0.00336',2020,NULL,0,2022,NULL,'n','cdm_ams_iii_s','1',NULL,58,NULL,'Fuel efficiency'),(NULL,NULL,NULL,NULL,0,654,'CO2 emission factor - Diesel',0,NULL,1,0,0,0,'','Diesel','','','t-CO2/TJ','t-CO2/TJ','75.243','75.243',2020,NULL,0,2022,NULL,'ef','cdm_ams_iii_s','1',NULL,58,NULL,'CO2 emission factor'),(NULL,NULL,NULL,NULL,0,655,'Net calorific value - Diesel',0,NULL,1,0,0,0,'','Diesel','','','TJ/t','TJ/t','0.043','0.043',2020,NULL,0,2022,NULL,'ncv','cdm_ams_iii_s','1',NULL,58,NULL,'Net calorific value'),(NULL,NULL,NULL,NULL,0,656,'Total annual distance - Petrol-Bus - ss',0,NULL,0,1,0,0,'Bus','Petrol','ss','','km','km',NULL,NULL,2020,NULL,0,2022,NULL,'d','cdm_ams_iii_s','1',NULL,58,NULL,'Total annual distance'),(NULL,NULL,NULL,NULL,0,657,'Total annual passengers transported - Petrol-Bus - ss',0,NULL,0,1,0,0,'Bus','Petrol','ss','','passengers','passengers','63000','63000',2020,NULL,0,2022,NULL,'p','cdm_ams_iii_s','1',NULL,58,NULL,'Total annual passengers transported'),(NULL,NULL,NULL,NULL,0,658,'Fuel efficiency - Petrol-Bus - ss',1,NULL,0,1,0,0,'Bus','Petrol','ss','','fuel/km','fuel/km',NULL,NULL,2020,NULL,0,2022,NULL,'n','cdm_ams_iii_s','1',NULL,58,NULL,'Fuel efficiency'),(NULL,NULL,NULL,NULL,0,659,'Consumption of fuel - Petrol-Bus - ss',0,NULL,0,1,0,0,'Bus','Petrol','ss','','t/y','t/y','77.17','77.17',2020,NULL,0,2022,NULL,'fc','cdm_ams_iii_s','1',NULL,58,NULL,'Consumption of fuel'),(NULL,NULL,NULL,NULL,0,660,'CO2 emission factor - Petrol',0,NULL,0,1,0,0,'','Petrol','','','t-CO2/TJ','t-CO2/TJ','59.471','59.471',2020,NULL,0,2022,NULL,'ef','cdm_ams_iii_s','1',NULL,58,NULL,'CO2 emission factor'),(NULL,NULL,NULL,NULL,0,661,'Net calorific value - Petrol',0,NULL,0,1,0,0,'','Petrol','','','TJ/t','TJ/t','0.048','0.048',2020,NULL,0,2022,NULL,'ncv','cdm_ams_iii_s','1',NULL,58,NULL,'Net calorific value'),(NULL,NULL,NULL,NULL,0,662,'The annual average distance of transportation per person - Diesel-Bus - A21',1,NULL,0,1,0,0,'Bus','Diesel','A21','','km','km','22','22',2010,NULL,0,2020,NULL,'dp','cdm_ams_iii_s','1',NULL,59,NULL,'The annual average distance of transportation per person'),(NULL,NULL,NULL,NULL,0,663,'The annual average distance of transportation per person - Diesel-Jeepneys - A21',0,NULL,1,0,0,0,'Jeepneys','Diesel','A21','','km','km','12','12',2010,NULL,0,2020,NULL,'dp','cdm_ams_iii_s','1',NULL,59,NULL,'The annual average distance of transportation per person'),(NULL,NULL,NULL,NULL,0,664,'Total annual passengers transported - Diesel-Jeepneys - A21',1,NULL,1,0,0,0,'Jeepneys','Diesel','A21','','passengers','passengers','24','24',2010,NULL,0,2020,NULL,'p','cdm_ams_iii_s','1',NULL,59,NULL,'Total annual passengers transported'),(NULL,NULL,NULL,NULL,0,665,'Total annual distance - Diesel-Jeepneys - A21',1,NULL,1,0,0,0,'Jeepneys','Diesel','A21','','km','km','54','54',2010,NULL,0,2020,NULL,'d','cdm_ams_iii_s','1',NULL,59,NULL,'Total annual distance'),(NULL,NULL,NULL,NULL,0,666,'Fuel efficiency - Diesel-Jeepneys - A21',0,NULL,1,0,0,0,'Jeepneys','Diesel','A21','','fuel/km','fuel/km','34','34',2010,NULL,0,2020,NULL,'n','cdm_ams_iii_s','1',NULL,59,NULL,'Fuel efficiency'),(NULL,NULL,NULL,NULL,0,667,'CO2 emission factor - Diesel',0,NULL,1,0,0,0,'','Diesel','','','t-CO2/TJ','t-CO2/TJ','343','343',2010,NULL,0,2020,NULL,'ef','cdm_ams_iii_s','1',NULL,59,NULL,'CO2 emission factor'),(NULL,NULL,NULL,NULL,0,668,'Net calorific value - Diesel',0,NULL,1,0,0,0,'','Diesel','','','TJ/t','TJ/t','234','234',2010,NULL,0,2020,NULL,'ncv','cdm_ams_iii_s','1',NULL,59,NULL,'Net calorific value'),(NULL,NULL,NULL,NULL,0,669,'Total annual distance - Diesel-Bus - A21',0,NULL,0,1,0,0,'Bus','Diesel','A21','','km','km','33','33',2010,NULL,0,2020,NULL,'d','cdm_ams_iii_s','1',NULL,59,NULL,'Total annual distance'),(NULL,NULL,NULL,NULL,0,670,'Total annual passengers transported - Diesel-Bus - A21',0,NULL,0,1,0,0,'Bus','Diesel','A21','','passengers','passengers','343','343',2010,NULL,0,2020,NULL,'p','cdm_ams_iii_s','1',NULL,59,NULL,'Total annual passengers transported'),(NULL,NULL,NULL,NULL,0,671,'Consumption of fuel - Diesel-Bus - A21',0,NULL,0,1,0,0,'Bus','Diesel','A21','','t/y','t/y','234','234',2010,NULL,0,2020,NULL,'fc','cdm_ams_iii_s','1',NULL,59,NULL,'Consumption of fuel'),(NULL,NULL,NULL,NULL,0,672,'Fuel efficiency - Diesel-Bus - A21',1,NULL,0,1,0,0,'Bus','Diesel','A21','','fuel/km','fuel/km','344','344',2010,NULL,0,2020,NULL,'n','cdm_ams_iii_s','1',NULL,59,NULL,'Fuel efficiency'),(NULL,NULL,NULL,NULL,0,673,'CO2 emission factor - Diesel',0,NULL,0,1,0,0,'','Diesel','','','t-CO2/TJ','t-CO2/TJ','33','33',2010,NULL,0,2020,NULL,'ef','cdm_ams_iii_s','1',NULL,59,NULL,'CO2 emission factor'),(NULL,NULL,NULL,NULL,0,674,'Net calorific value - Diesel',0,NULL,0,1,0,0,'','Diesel','','','TJ/t','TJ/t','33','33',2010,NULL,0,2020,NULL,'ncv','cdm_ams_iii_s','1',NULL,59,NULL,'Net calorific value'),(NULL,NULL,NULL,NULL,0,675,'Fuel efficiency - Diesel-Van - YY0002',0,NULL,1,0,0,0,'Van','Diesel','YY0002','','fuel/km','fuel/km','0.004368','0.004368',2020,NULL,0,2023,NULL,'n','cdm_ams_iii_s','1',16,60,NULL,'Fuel efficiency'),(NULL,NULL,NULL,NULL,0,676,'The annual average distance of transportation per person - Diesel-Bus - XX0001',0,NULL,1,0,0,0,'Bus','Diesel','XX0001','','km','km','0.390305540','0.390305540',2020,NULL,0,2023,NULL,'dp','cdm_ams_iii_s','1',14,60,NULL,'The annual average distance of transportation per person'),(NULL,NULL,NULL,NULL,0,677,'Total annual passengers transported - Diesel-Bus - XX0001',1,NULL,1,0,0,0,'Bus','Diesel','XX0001','','passengers','passengers','65687','65687',2020,NULL,0,2023,NULL,'p','cdm_ams_iii_s','1',14,60,NULL,'Total annual passengers transported'),(NULL,NULL,NULL,NULL,0,678,'Total annual distance - Diesel-Bus - XX0001',1,NULL,1,0,0,0,'Bus','Diesel','XX0001','','km','km','25638','25638',2020,NULL,0,2023,NULL,'d','cdm_ams_iii_s','1',14,60,NULL,'Total annual distance'),(NULL,NULL,NULL,NULL,0,679,'Fuel efficiency - Diesel-Bus - XX0001',0,NULL,1,0,0,0,'Bus','Diesel','XX0001','','fuel/km','fuel/km','0.00336','0.00336',2020,NULL,0,2023,NULL,'n','cdm_ams_iii_s','1',16,60,NULL,'Fuel efficiency'),(NULL,NULL,NULL,NULL,0,680,'The annual average distance of transportation per person - Diesel-Van - YY0002',0,NULL,1,0,0,0,'Van','Diesel','YY0002','','km','km','0.408608735','0.408608735',2020,NULL,0,2023,NULL,'dp','cdm_ams_iii_s','1',14,60,NULL,'The annual average distance of transportation per person'),(NULL,NULL,NULL,NULL,0,681,'Total annual passengers transported - Diesel-Van - YY0002',1,NULL,1,0,0,0,'Van','Diesel','YY0002','','passengers','passengers','50623','50623',2020,NULL,0,2023,NULL,'p','cdm_ams_iii_s','1',14,60,NULL,'Total annual passengers transported'),(NULL,NULL,NULL,NULL,0,682,'Total annual distance - Diesel-Van - YY0002',1,NULL,1,0,0,0,'Van','Diesel','YY0002','','km','km','20685','20685',2020,NULL,0,2023,NULL,'d','cdm_ams_iii_s','1',14,60,NULL,'Total annual distance'),(NULL,NULL,NULL,NULL,0,683,'The annual average distance of transportation per person - Petrol-Tricycles - ZZ0003',0,NULL,1,0,0,0,'Tricycles','Petrol','ZZ0003','','km','km','0.585555556','0.585555556',2020,NULL,0,2023,NULL,'dp','cdm_ams_iii_s','1',14,60,NULL,'The annual average distance of transportation per person'),(NULL,NULL,NULL,NULL,0,684,'Total annual passengers transported - Petrol-Tricycles - ZZ0003',1,NULL,1,0,0,0,'Tricycles','Petrol','ZZ0003','','passengers','passengers','45000','45000',2020,NULL,0,2023,NULL,'p','cdm_ams_iii_s','1',14,60,NULL,'Total annual passengers transported'),(NULL,NULL,NULL,NULL,0,685,'Total annual distance - Petrol-Tricycles - ZZ0003',1,NULL,1,0,0,0,'Tricycles','Petrol','ZZ0003','','km','km','26350','26350',2020,NULL,0,2023,NULL,'d','cdm_ams_iii_s','1',14,60,NULL,'Total annual distance'),(NULL,NULL,NULL,NULL,0,686,'Fuel efficiency - Petrol-Tricycles - ZZ0003',0,NULL,1,0,0,0,'Tricycles','Petrol','ZZ0003','','fuel/km','fuel/km','0.0042','0.0042',2020,NULL,0,2023,NULL,'n','cdm_ams_iii_s','1',16,60,NULL,'Fuel efficiency'),(NULL,NULL,NULL,NULL,0,687,'CO2 emission factor - Diesel',0,NULL,1,0,0,0,'','Diesel','','','t-CO2/TJ','t-CO2/TJ','75.243','75.243',2020,NULL,0,2023,NULL,'ef','cdm_ams_iii_s','1',16,60,NULL,'CO2 emission factor'),(NULL,NULL,NULL,NULL,0,688,'Net calorific value - Diesel',0,NULL,1,0,0,0,'','Diesel','','','TJ/t','TJ/t','0.043','0.043',2020,NULL,0,2023,NULL,'ncv','cdm_ams_iii_s','1',16,60,NULL,'Net calorific value'),(NULL,NULL,NULL,NULL,0,689,'CO2 emission factor - Petrol',0,NULL,1,0,0,0,'','Petrol','','','t-CO2/TJ','t-CO2/TJ','75.243','75.243',2020,NULL,0,2023,NULL,'ef','cdm_ams_iii_s','1',16,60,NULL,'CO2 emission factor'),(NULL,NULL,NULL,NULL,0,690,'Net calorific value - Petrol',0,NULL,1,0,0,0,'','Petrol','','','TJ/t','TJ/t','0.043','0.043',2020,NULL,0,2023,NULL,'ncv','cdm_ams_iii_s','1',16,60,NULL,'Net calorific value'),(NULL,NULL,NULL,NULL,0,691,'Total annual distance - CNG-Bus - XX0001',0,NULL,0,1,0,0,'Bus','CNG','XX0001','','km','km','34236','34236',2020,NULL,0,2023,NULL,'d','cdm_ams_iii_s','1',14,60,NULL,'Total annual distance'),(NULL,NULL,NULL,NULL,0,692,'The annual average distance of transportation per person - CNG-Bus - XX0001',1,NULL,0,1,0,0,'Bus','CNG','XX0001','','km','km','0.543429','0.543429',2020,NULL,0,2023,NULL,'dp','cdm_ams_iii_s','1',14,60,NULL,'The annual average distance of transportation per person'),(NULL,NULL,NULL,NULL,0,693,'Consumption of fuel - CNG-Bus - XX0001',0,NULL,0,1,0,0,'Bus','CNG','XX0001','','t/y','t/y','77.17','77.17',2020,NULL,0,2023,NULL,'fc','cdm_ams_iii_s','1',14,60,NULL,'Consumption of fuel'),(NULL,NULL,NULL,NULL,0,694,'Total annual passengers transported - CNG-Bus - XX0001',0,NULL,0,1,0,0,'Bus','CNG','XX0001','','passengers','passengers','63000','63000',2020,NULL,0,2023,NULL,'p','cdm_ams_iii_s','1',14,60,NULL,'Total annual passengers transported'),(NULL,NULL,NULL,NULL,0,695,'Fuel efficiency - CNG-Bus - XX0001',1,NULL,0,1,0,0,'Bus','CNG','XX0001','','fuel/km','fuel/km','0.002254071','0.002254071',2020,NULL,0,2023,NULL,'n','cdm_ams_iii_s','1',16,60,NULL,'Fuel efficiency'),(NULL,NULL,NULL,NULL,0,696,'Total annual distance - Electricity-Van - YY0002',0,NULL,0,1,0,0,'Van','Electricity','YY0002','','km','km','25000','25000',2020,NULL,0,2023,NULL,'d','cdm_ams_iii_s','1',14,60,NULL,'Total annual distance'),(NULL,NULL,NULL,NULL,0,697,'The annual average distance of transportation per person - Electricity-Van - YY0002',1,NULL,0,1,0,0,'Van','Electricity','YY0002','','km','km','0.45','0.45',2020,NULL,0,2023,NULL,'dp','cdm_ams_iii_s','1',14,60,NULL,'The annual average distance of transportation per person'),(NULL,NULL,NULL,NULL,0,698,'Total annual passengers transported - Electricity-Van - YY0002',0,NULL,0,1,0,0,'Van','Electricity','YY0002','','passengers','passengers','55000','55000',2020,NULL,0,2023,NULL,'p','cdm_ams_iii_s','1',14,60,NULL,'Total annual passengers transported'),(NULL,NULL,NULL,NULL,0,699,'Consumption of fuel - Electricity-Van - YY0002',0,NULL,0,1,0,0,'Van','Electricity','YY0002','','t/y','t/y','80.94','80.94',2020,NULL,0,2023,NULL,'fc','cdm_ams_iii_s','1',14,60,NULL,'Consumption of fuel'),(NULL,NULL,NULL,NULL,0,700,'Fuel efficiency - Electricity-Van - YY0002',1,NULL,0,1,0,0,'Van','Electricity','YY0002','','fuel/km','fuel/km','0.003237616','0.003237616',2020,NULL,0,2023,NULL,'n','cdm_ams_iii_s','1',16,60,NULL,'Fuel efficiency'),(NULL,NULL,NULL,NULL,0,701,'The annual average distance of transportation per person - LPG-Tricycles - ZZ0003',1,NULL,0,1,0,0,'Tricycles','LPG','ZZ0003','','km','km','0.53','0.53',2020,NULL,0,2023,NULL,'dp','cdm_ams_iii_s','1',14,60,NULL,'The annual average distance of transportation per person'),(NULL,NULL,NULL,NULL,0,702,'Total annual passengers transported - LPG-Tricycles - ZZ0003',0,NULL,0,1,0,0,'Tricycles','LPG','ZZ0003','','passengers','passengers','50000','50000',2020,NULL,0,2023,NULL,'p','cdm_ams_iii_s','1',14,60,NULL,'Total annual passengers transported'),(NULL,NULL,NULL,NULL,0,703,'Total annual distance - LPG-Tricycles - ZZ0003',0,NULL,0,1,0,0,'Tricycles','LPG','ZZ0003','','km','km','26500','26500',2020,NULL,0,2023,NULL,'d','cdm_ams_iii_s','1',14,60,NULL,'Total annual distance'),(NULL,NULL,NULL,NULL,0,704,'Consumption of fuel - LPG-Tricycles - ZZ0003',0,NULL,0,1,0,0,'Tricycles','LPG','ZZ0003','','t/y','t/y','99.14','99.14',2020,NULL,0,2023,NULL,'fc','cdm_ams_iii_s','1',14,60,NULL,'Consumption of fuel'),(NULL,NULL,NULL,NULL,0,705,'Fuel efficiency - LPG-Tricycles - ZZ0003',1,NULL,0,1,0,0,'Tricycles','LPG','ZZ0003','','fuel/km','fuel/km','0.003741203','0.003741203',2020,NULL,0,2023,NULL,'n','cdm_ams_iii_s','1',16,60,NULL,'Fuel efficiency'),(NULL,NULL,NULL,NULL,0,706,'CO2 emission factor - CNG',0,NULL,0,1,0,0,'','CNG','','','t-CO2/TJ','t-CO2/TJ','59.471','59.471',2020,NULL,0,2023,NULL,'ef','cdm_ams_iii_s','1',16,60,NULL,'CO2 emission factor'),(NULL,NULL,NULL,NULL,0,707,'Net calorific value - CNG',0,NULL,0,1,0,0,'','CNG','','','TJ/t','TJ/t','0.048','0.048',2020,NULL,0,2023,NULL,'ncv','cdm_ams_iii_s','1',16,60,NULL,'Net calorific value'),(NULL,NULL,NULL,NULL,0,708,'CO2 emission factor - Electricity',0,NULL,0,1,0,0,'','Electricity','','','t-CO2/TJ','t-CO2/TJ','2.854608','2.854608',2020,NULL,0,2023,NULL,'ef','cdm_ams_iii_s','1',16,60,NULL,'CO2 emission factor'),(NULL,NULL,NULL,NULL,0,709,'CO2 emission factor - LPG',0,NULL,0,1,0,0,'','LPG','','','t-CO2/TJ','t-CO2/TJ','59.471','59.471',2020,NULL,0,2023,NULL,'ef','cdm_ams_iii_s','1',16,60,NULL,'CO2 emission factor'),(NULL,NULL,NULL,NULL,0,710,'Projection Base Year 2023',NULL,NULL,0,0,0,1,NULL,NULL,NULL,NULL,'population','population','21580000','21580000',2020,2023,0,NULL,NULL,NULL,NULL,NULL,14,60,NULL,'Projection Base Year 2023'),(NULL,NULL,NULL,NULL,0,711,'Net calorific value - LPG',0,NULL,0,1,0,0,'','LPG','','','TJ/t','TJ/t','0.048','0.048',2020,NULL,0,2023,NULL,'ncv','cdm_ams_iii_s','1',16,60,NULL,'Net calorific value'),(NULL,NULL,NULL,NULL,0,712,'Projection Year POP 2020',NULL,NULL,0,0,0,1,NULL,NULL,NULL,NULL,'population','population','21203000','21203000',2020,2023,0,NULL,2020,NULL,NULL,NULL,16,60,NULL,'Projection Year POP 2020'),(NULL,NULL,NULL,NULL,0,713,'Net calorific value of Diesel  - Diesel',0,NULL,1,0,0,0,'','Diesel','','','TJ/t','TJ/t','34','34',2010,NULL,0,2021,NULL,'ncv','ICAT_TPM_RP_2020_Toll_roads','1',NULL,61,NULL,'Net calorific value of Diesel '),(NULL,NULL,NULL,NULL,0,714,'Specific fuel consumption - Diesel-car',0,NULL,1,0,0,0,'car','Diesel','','','L per VKT','L per VKT','23','23',2010,NULL,0,2021,NULL,'sfc','ICAT_TPM_RP_2020_Toll_roads','1',NULL,61,NULL,'Specific fuel consumption'),(NULL,NULL,NULL,NULL,0,715,'Vehicle kilometres travelled - Diesel-car',0,NULL,1,0,0,0,'car','Diesel','','','VKT','VKT','34','34',2010,NULL,0,2021,NULL,'vkt','ICAT_TPM_RP_2020_Toll_roads','1',NULL,61,NULL,'Vehicle kilometres travelled'),(NULL,NULL,NULL,NULL,0,716,' fuel economy - Diesel-car',0,NULL,1,0,0,0,'car','Diesel','','','liters/km','liters/km','45','45',2010,NULL,0,2021,NULL,'fuelEconomy','ICAT_TPM_RP_2020_Toll_roads','1',NULL,61,NULL,' fuel economy'),(NULL,NULL,NULL,NULL,0,717,'toll increase - Diesel-car',0,NULL,1,0,0,0,'car','Diesel','','','LKR/km','LKR/km','34','34',2010,NULL,0,2021,NULL,'toilIncrease','ICAT_TPM_RP_2020_Toll_roads','1',NULL,61,NULL,'toll increase'),(NULL,NULL,NULL,NULL,0,718,'existing toll - Diesel-car',0,NULL,1,0,0,0,'car','Diesel','','','LKR/km','LKR/km','34','34',2010,NULL,0,2021,NULL,'existingToil','ICAT_TPM_RP_2020_Toll_roads','1',NULL,61,NULL,'existing toll'),(NULL,NULL,NULL,NULL,0,719,'CO2 emission factor of Diesel - Diesel',0,NULL,1,0,0,0,'','Diesel','','','t-CO2/TJ','t-CO2/TJ','34','34',2010,NULL,0,2021,NULL,'ef','ICAT_TPM_RP_2020_Toll_roads','1',NULL,61,NULL,'CO2 emission factor of Diesel'),(NULL,NULL,NULL,NULL,0,720,'Density of Diesel - Diesel',0,NULL,1,0,0,0,'','Diesel','','','Kg/m3','Kg/m3','22','22',2010,NULL,0,2021,NULL,'density','ICAT_TPM_RP_2020_Toll_roads','1',NULL,61,NULL,'Density of Diesel'),(NULL,NULL,NULL,NULL,0,721,'Diesel Vehicle travel elasticity - Diesel',0,NULL,0,1,0,0,'','Diesel','','','','','234','234',2010,NULL,0,2021,NULL,'priceElasticity','ICAT_TPM_RP_2020_Toll_roads','1',NULL,61,NULL,'Diesel Vehicle travel elasticity'),(NULL,NULL,NULL,NULL,0,722,'country Code - Diesel',1,NULL,0,1,0,0,'','Diesel','','','','','','',2010,NULL,0,2021,NULL,'countryCode','ICAT_TPM_RP_2020_Toll_roads','1',NULL,61,NULL,'country Code'),(NULL,NULL,NULL,NULL,0,723,'Actual fuel price (annual average) in local currency for the assessment year - Diesel',1,NULL,0,1,0,0,'','Diesel','','','price','price','233','233',2010,NULL,0,2021,NULL,'fuelPrice','ICAT_TPM_RP_2020_Toll_roads','1',NULL,61,NULL,'Actual fuel price (annual average) in local currency for the assessment year'),(NULL,NULL,NULL,NULL,0,724,'Actual per capita income in local currency for the assessment year - Diesel',1,NULL,0,1,0,0,'','Diesel','','','price per liter','price per liter','23','23',2010,NULL,0,2021,NULL,'capitalIncome','ICAT_TPM_RP_2020_Toll_roads','1',NULL,61,NULL,'Actual per capita income in local currency for the assessment year'),(NULL,NULL,NULL,NULL,0,725,'Petrol Vehicle travel elasticity - Petrol',0,NULL,0,1,0,0,'','Petrol','','','','','12','12',2010,NULL,0,2021,NULL,'priceElasticity','ICAT_TPM_RP_2020_Toll_roads','1',NULL,61,NULL,'Petrol Vehicle travel elasticity'),(NULL,NULL,NULL,NULL,0,726,'Actual fuel price (annual average) in local currency for the assessment year - Petrol',1,NULL,0,1,0,0,'','Petrol','','','price','price','23','23',2010,NULL,0,2021,NULL,'fuelPrice','ICAT_TPM_RP_2020_Toll_roads','1',NULL,61,NULL,'Actual fuel price (annual average) in local currency for the assessment year'),(NULL,NULL,NULL,NULL,0,727,'Fuel efficiency - Diesel-Jeepneys - E3',0,NULL,1,0,0,0,'Jeepneys','Diesel','E3','','fuel/km','fuel/km','322','322',2020,NULL,0,2022,NULL,'n','cdm_ams_iii_s','1',NULL,62,NULL,'Fuel efficiency'),(NULL,NULL,NULL,NULL,0,728,'The annual average distance of transportation per person - Diesel-Jeepneys - E3',0,NULL,1,0,0,0,'Jeepneys','Diesel','E3','','km','km','45','45',2020,NULL,0,2022,NULL,'dp','cdm_ams_iii_s','1',NULL,62,NULL,'The annual average distance of transportation per person'),(NULL,NULL,NULL,NULL,0,729,'Total annual passengers transported - Diesel-Jeepneys - E3',1,NULL,1,0,0,0,'Jeepneys','Diesel','E3','','passengers','passengers','355','355',2020,NULL,0,2022,NULL,'p','cdm_ams_iii_s','1',NULL,62,NULL,'Total annual passengers transported'),(NULL,NULL,NULL,NULL,0,730,'Total annual distance - Diesel-Jeepneys - E3',1,NULL,1,0,0,0,'Jeepneys','Diesel','E3','','km','km','4566','4566',2020,NULL,0,2022,NULL,'d','cdm_ams_iii_s','1',NULL,62,NULL,'Total annual distance'),(NULL,NULL,NULL,NULL,0,731,'Total annual passengers transported - Diesel-Jeepneys - E3',0,NULL,0,1,0,0,'Jeepneys','Diesel','E3','','passengers','passengers','45','45',2020,NULL,0,2022,NULL,'p','cdm_ams_iii_s','1',NULL,62,NULL,'Total annual passengers transported'),(NULL,NULL,NULL,NULL,0,732,'CO2 emission factor - Diesel',0,NULL,1,0,0,0,'','Diesel','','','t-CO2/TJ','t-CO2/TJ','234','234',2020,NULL,0,2022,NULL,'ef','cdm_ams_iii_s','1',NULL,62,NULL,'CO2 emission factor'),(NULL,NULL,NULL,NULL,0,733,'Net calorific value - Diesel',0,NULL,1,0,0,0,'','Diesel','','','TJ/t','TJ/t','3455','3455',2020,NULL,0,2022,NULL,'ncv','cdm_ams_iii_s','1',NULL,62,NULL,'Net calorific value'),(NULL,NULL,NULL,NULL,0,734,'Total annual distance - Diesel-Jeepneys - E3',0,NULL,0,1,0,0,'Jeepneys','Diesel','E3','','km','km','12','12',2020,NULL,0,2022,NULL,'d','cdm_ams_iii_s','1',NULL,62,NULL,'Total annual distance'),(NULL,NULL,NULL,NULL,0,735,'Consumption of fuel - Diesel-Jeepneys - E3',0,NULL,0,1,0,0,'Jeepneys','Diesel','E3','','t/y','t/y','34','34',2020,NULL,0,2022,NULL,'fc','cdm_ams_iii_s','1',NULL,62,NULL,'Consumption of fuel'),(NULL,NULL,NULL,NULL,0,736,'The annual average distance of transportation per person - Diesel-Jeepneys - E3',1,NULL,0,1,0,0,'Jeepneys','Diesel','E3','','km','km','34','34',2020,NULL,0,2022,NULL,'dp','cdm_ams_iii_s','1',NULL,62,NULL,'The annual average distance of transportation per person'),(NULL,NULL,NULL,NULL,0,737,'Fuel efficiency - Diesel-Jeepneys - E3',1,NULL,0,1,0,0,'Jeepneys','Diesel','E3','','fuel/km','fuel/km','34','34',2020,NULL,0,2022,NULL,'n','cdm_ams_iii_s','1',NULL,62,NULL,'Fuel efficiency'),(NULL,NULL,NULL,NULL,0,738,'Total annual distance - Petrol-Jeepneys - E3',0,NULL,0,1,0,0,'Jeepneys','Petrol','E3','','km','km','32','32',2020,NULL,0,2022,NULL,'d','cdm_ams_iii_s','1',NULL,62,NULL,'Total annual distance'),(NULL,NULL,NULL,NULL,0,739,'The annual average distance of transportation per person - Petrol-Jeepneys - E3',1,NULL,0,1,0,0,'Jeepneys','Petrol','E3','','km','km','3','3',2020,NULL,0,2022,NULL,'dp','cdm_ams_iii_s','1',NULL,62,NULL,'The annual average distance of transportation per person'),(NULL,NULL,NULL,NULL,0,740,'Total annual passengers transported - Petrol-Jeepneys - E3',0,NULL,0,1,0,0,'Jeepneys','Petrol','E3','','passengers','passengers','34','34',2020,NULL,0,2022,NULL,'p','cdm_ams_iii_s','1',NULL,62,NULL,'Total annual passengers transported'),(NULL,NULL,NULL,NULL,0,741,'Consumption of fuel - Petrol-Jeepneys - E3',0,NULL,0,1,0,0,'Jeepneys','Petrol','E3','','t/y','t/y','34','34',2020,NULL,0,2022,NULL,'fc','cdm_ams_iii_s','1',NULL,62,NULL,'Consumption of fuel'),(NULL,NULL,NULL,NULL,0,742,'Fuel efficiency - Petrol-Jeepneys - E3',1,NULL,0,1,0,0,'Jeepneys','Petrol','E3','','fuel/km','fuel/km','34','34',2020,NULL,0,2022,NULL,'n','cdm_ams_iii_s','1',NULL,62,NULL,'Fuel efficiency'),(NULL,NULL,NULL,NULL,0,743,'CO2 emission factor - Diesel',0,NULL,0,1,0,0,'','Diesel','','','t-CO2/TJ','t-CO2/TJ','34','34',2020,NULL,0,2022,NULL,'ef','cdm_ams_iii_s','1',NULL,62,NULL,'CO2 emission factor'),(NULL,NULL,NULL,NULL,0,744,'Net calorific value - Diesel',0,NULL,0,1,0,0,'','Diesel','','','TJ/t','TJ/t','34','34',2020,NULL,0,2022,NULL,'ncv','cdm_ams_iii_s','1',NULL,62,NULL,'Net calorific value'),(NULL,NULL,NULL,NULL,0,745,'CO2 emission factor - Petrol',0,NULL,0,1,0,0,'','Petrol','','','t-CO2/TJ','t-CO2/TJ','53','53',2020,NULL,0,2022,NULL,'ef','cdm_ams_iii_s','1',NULL,62,NULL,'CO2 emission factor'),(NULL,NULL,NULL,NULL,0,746,'Net calorific value - Petrol',0,NULL,0,1,0,0,'','Petrol','','','TJ/t','TJ/t','23','23',2020,NULL,0,2022,NULL,'ncv','cdm_ams_iii_s','1',NULL,62,NULL,'Net calorific value'),(NULL,NULL,NULL,NULL,0,747,'The annual average distance of transportation per person - Diesel-Jeepneys - ss',1,NULL,0,1,0,0,'Jeepneys','Diesel','ss','','km','km','1','1',2020,NULL,0,2023,NULL,'dp','cdm_ams_iii_s','1',NULL,63,NULL,'The annual average distance of transportation per person'),(NULL,NULL,NULL,NULL,0,748,'The annual average distance of transportation per person - Diesel-Jeepneys - ss',0,NULL,1,0,0,0,'Jeepneys','Diesel','ss','','km','km','1','1',2020,NULL,0,2023,NULL,'dp','cdm_ams_iii_s','1',NULL,63,NULL,'The annual average distance of transportation per person'),(NULL,NULL,NULL,NULL,0,749,'Total annual passengers transported - Diesel-Jeepneys - ss',1,NULL,1,0,0,0,'Jeepneys','Diesel','ss','','passengers','passengers','1','1',2020,NULL,0,2023,NULL,'p','cdm_ams_iii_s','1',NULL,63,NULL,'Total annual passengers transported'),(NULL,NULL,NULL,NULL,0,750,'Total annual distance - Diesel-Jeepneys - ss',1,NULL,1,0,0,0,'Jeepneys','Diesel','ss','','km','km','1','1',2020,NULL,0,2023,NULL,'d','cdm_ams_iii_s','1',NULL,63,NULL,'Total annual distance'),(NULL,NULL,NULL,NULL,0,751,'Fuel efficiency - Diesel-Jeepneys - ss',0,NULL,1,0,0,0,'Jeepneys','Diesel','ss','','fuel/km','fuel/km','1','1',2020,NULL,0,2023,NULL,'n','cdm_ams_iii_s','1',NULL,63,NULL,'Fuel efficiency'),(NULL,NULL,NULL,NULL,0,752,'CO2 emission factor - Diesel',0,NULL,1,0,0,0,'','Diesel','','','t-CO2/TJ','t-CO2/TJ','1','1',2020,NULL,0,2023,NULL,'ef','cdm_ams_iii_s','1',NULL,63,NULL,'CO2 emission factor'),(NULL,NULL,NULL,NULL,0,753,'Net calorific value - Diesel',0,NULL,1,0,0,0,'','Diesel','','','TJ/t','TJ/t','1','1',2020,NULL,0,2023,NULL,'ncv','cdm_ams_iii_s','1',NULL,63,NULL,'Net calorific value'),(NULL,NULL,NULL,NULL,0,754,'Total annual distance - Diesel-Jeepneys - ss',0,NULL,0,1,0,0,'Jeepneys','Diesel','ss','','km','km','1','1',2020,NULL,0,2023,NULL,'d','cdm_ams_iii_s','1',NULL,63,NULL,'Total annual distance'),(NULL,NULL,NULL,NULL,0,755,'Total annual passengers transported - Diesel-Jeepneys - ss',0,NULL,0,1,0,0,'Jeepneys','Diesel','ss','','passengers','passengers','1','1',2020,NULL,0,2023,NULL,'p','cdm_ams_iii_s','1',NULL,63,NULL,'Total annual passengers transported'),(NULL,NULL,NULL,NULL,0,756,'Consumption of fuel - Diesel-Jeepneys - ss',0,NULL,0,1,0,0,'Jeepneys','Diesel','ss','','t/y','t/y','1','1',2020,NULL,0,2023,NULL,'fc','cdm_ams_iii_s','1',NULL,63,NULL,'Consumption of fuel'),(NULL,NULL,NULL,NULL,0,757,'Fuel efficiency - Diesel-Jeepneys - ss',1,NULL,0,1,0,0,'Jeepneys','Diesel','ss','','fuel/km','fuel/km','1','1',2020,NULL,0,2023,NULL,'n','cdm_ams_iii_s','1',NULL,63,NULL,'Fuel efficiency'),(NULL,NULL,NULL,NULL,0,758,'CO2 emission factor - Diesel',0,NULL,0,1,0,0,'','Diesel','','','t-CO2/TJ','t-CO2/TJ','1','1',2020,NULL,0,2023,NULL,'ef','cdm_ams_iii_s','1',NULL,63,NULL,'CO2 emission factor'),(NULL,NULL,NULL,NULL,0,759,'Net calorific value - Diesel',0,NULL,0,1,0,0,'','Diesel','','','TJ/t','TJ/t','1','1',2020,NULL,0,2023,NULL,'ncv','cdm_ams_iii_s','1',NULL,63,NULL,'Net calorific value'),(NULL,NULL,NULL,NULL,0,760,'The annual average distance of transportation per person - Petrol-Bus - ss',1,NULL,0,1,0,0,'Bus','Petrol','ss','','km','km','0.54','0.54',2020,NULL,0,2022,NULL,'dp','cdm_ams_iii_s','1',NULL,64,NULL,'The annual average distance of transportation per person'),(NULL,NULL,NULL,NULL,0,761,'The annual average distance of transportation per person - Diesel-Bus - ss',0,NULL,1,0,0,0,'Bus','Diesel','ss','','km','km',NULL,NULL,2020,NULL,0,2022,NULL,'dp','cdm_ams_iii_s','1',NULL,64,NULL,'The annual average distance of transportation per person'),(NULL,NULL,NULL,NULL,0,762,'Total annual passengers transported - Diesel-Bus - ss',1,NULL,1,0,0,0,'Bus','Diesel','ss','','passengers','passengers','65687','65687',2020,NULL,0,2022,NULL,'p','cdm_ams_iii_s','1',NULL,64,NULL,'Total annual passengers transported'),(NULL,NULL,NULL,NULL,0,763,'Total annual distance - Diesel-Bus - ss',1,NULL,1,0,0,0,'Bus','Diesel','ss','','km','km','25638','25638',2020,NULL,0,2022,NULL,'d','cdm_ams_iii_s','1',NULL,64,NULL,'Total annual distance'),(NULL,NULL,NULL,NULL,0,764,'Fuel efficiency - Diesel-Bus - ss',0,NULL,1,0,0,0,'Bus','Diesel','ss','','fuel/km','fuel/km','0.00336','0.00336',2020,NULL,0,2022,NULL,'n','cdm_ams_iii_s','1',NULL,64,NULL,'Fuel efficiency'),(NULL,NULL,NULL,NULL,0,765,'CO2 emission factor - Diesel',0,NULL,1,0,0,0,'','Diesel','','','t-CO2/TJ','t-CO2/TJ','0.043','0.043',2020,NULL,0,2022,NULL,'ef','cdm_ams_iii_s','1',NULL,64,NULL,'CO2 emission factor'),(NULL,NULL,NULL,NULL,0,766,'Net calorific value - Diesel',0,NULL,1,0,0,0,'','Diesel','','','TJ/t','TJ/t','75.243','75.243',2020,NULL,0,2022,NULL,'ncv','cdm_ams_iii_s','1',NULL,64,NULL,'Net calorific value'),(NULL,NULL,NULL,NULL,0,767,'Total annual distance - Petrol-Bus - ss',0,NULL,0,1,0,0,'Bus','Petrol','ss','','km','km',NULL,NULL,2020,NULL,0,2022,NULL,'d','cdm_ams_iii_s','1',NULL,64,NULL,'Total annual distance'),(NULL,NULL,NULL,NULL,0,768,'Total annual passengers transported - Petrol-Bus - ss',0,NULL,0,1,0,0,'Bus','Petrol','ss','','passengers','passengers','63000','63000',2020,NULL,0,2022,NULL,'p','cdm_ams_iii_s','1',NULL,64,NULL,'Total annual passengers transported'),(NULL,NULL,NULL,NULL,0,769,'Consumption of fuel - Petrol-Bus - ss',0,NULL,0,1,0,0,'Bus','Petrol','ss','','t/y','t/y','77.17','77.17',2020,NULL,0,2022,NULL,'fc','cdm_ams_iii_s','1',NULL,64,NULL,'Consumption of fuel'),(NULL,NULL,NULL,NULL,0,770,'Fuel efficiency - Petrol-Bus - ss',1,NULL,0,1,0,0,'Bus','Petrol','ss','','fuel/km','fuel/km',NULL,NULL,2020,NULL,0,2022,NULL,'n','cdm_ams_iii_s','1',NULL,64,NULL,'Fuel efficiency'),(NULL,NULL,NULL,NULL,0,771,'CO2 emission factor - Petrol',0,NULL,0,1,0,0,'','Petrol','','','t-CO2/TJ','t-CO2/TJ','59.471','59.471',2020,NULL,0,2022,NULL,'ef','cdm_ams_iii_s','1',NULL,64,NULL,'CO2 emission factor'),(NULL,NULL,NULL,NULL,0,772,'Net calorific value - Petrol',0,NULL,0,1,0,0,'','Petrol','','','TJ/t','TJ/t','0.048','0.048',2020,NULL,0,2022,NULL,'ncv','cdm_ams_iii_s','1',NULL,64,NULL,'Net calorific value'),(NULL,NULL,NULL,NULL,0,773,'Total annual distance - Diesel-Bus - ss',1,NULL,1,0,0,0,'Bus','Diesel','ss','','km','km','120','120',2020,NULL,0,2028,NULL,'d','cdm_ams_iii_s','1',NULL,65,NULL,'Total annual distance'),(NULL,NULL,NULL,NULL,0,774,'The annual average distance of transportation per person - Diesel-Bus - ss',0,NULL,1,0,0,0,'Bus','Diesel','ss','','km','km',NULL,NULL,2020,NULL,0,2028,NULL,'dp','cdm_ams_iii_s','1',NULL,65,NULL,'The annual average distance of transportation per person'),(NULL,NULL,NULL,NULL,0,775,'Total annual passengers transported - Diesel-Bus - ss',1,NULL,1,0,0,0,'Bus','Diesel','ss','','passengers','passengers','120','120',2020,NULL,0,2028,NULL,'p','cdm_ams_iii_s','1',NULL,65,NULL,'Total annual passengers transported'),(NULL,NULL,NULL,NULL,0,776,'Total annual passengers transported - Petrol-Bus - ss',0,NULL,0,1,0,0,'Bus','Petrol','ss','','passengers','passengers','12','12',2020,NULL,0,2028,NULL,'p','cdm_ams_iii_s','1',NULL,65,NULL,'Total annual passengers transported'),(NULL,NULL,NULL,NULL,0,777,'Fuel efficiency - Diesel-Bus - ss',0,NULL,1,0,0,0,'Bus','Diesel','ss','','fuel/km','fuel/km','1','1',2020,NULL,0,2028,NULL,'n','cdm_ams_iii_s','1',NULL,65,NULL,'Fuel efficiency'),(NULL,NULL,NULL,NULL,0,778,'CO2 emission factor - Diesel',0,NULL,1,0,0,0,'','Diesel','','','t-CO2/TJ','t-CO2/TJ','25','25',2020,NULL,0,2028,NULL,'ef','cdm_ams_iii_s','1',NULL,65,NULL,'CO2 emission factor'),(NULL,NULL,NULL,NULL,0,779,'Net calorific value - Diesel',0,NULL,1,0,0,0,'','Diesel','','','TJ/t','TJ/t','.33','.33',2020,NULL,0,2028,NULL,'ncv','cdm_ams_iii_s','1',NULL,65,NULL,'Net calorific value'),(NULL,NULL,NULL,NULL,0,780,'Total annual distance - Petrol-Bus - ss',0,NULL,0,1,0,0,'Bus','Petrol','ss','','km','km','125','125',2020,NULL,0,2028,NULL,'d','cdm_ams_iii_s','1',NULL,65,NULL,'Total annual distance'),(NULL,NULL,NULL,NULL,0,781,'Consumption of fuel - Petrol-Bus - ss',0,NULL,0,1,0,0,'Bus','Petrol','ss','','t/y','t/y','50','50',2020,NULL,0,2028,NULL,'fc','cdm_ams_iii_s','1',NULL,65,NULL,'Consumption of fuel'),(NULL,NULL,NULL,NULL,0,782,'The annual average distance of transportation per person - Petrol-Bus - ss',1,NULL,0,1,0,0,'Bus','Petrol','ss','','km','km',NULL,NULL,2020,NULL,0,2028,NULL,'dp','cdm_ams_iii_s','1',NULL,65,NULL,'The annual average distance of transportation per person'),(NULL,NULL,NULL,NULL,0,783,'Fuel efficiency - Petrol-Bus - ss',1,NULL,0,1,0,0,'Bus','Petrol','ss','','fuel/km','fuel/km',NULL,NULL,2020,NULL,0,2028,NULL,'n','cdm_ams_iii_s','1',NULL,65,NULL,'Fuel efficiency'),(NULL,NULL,NULL,NULL,0,784,'CO2 emission factor - Petrol',0,NULL,0,1,0,0,'','Petrol','','','t-CO2/TJ','t-CO2/TJ','25','25',2020,NULL,0,2028,NULL,'ef','cdm_ams_iii_s','1',NULL,65,NULL,'CO2 emission factor'),(NULL,NULL,NULL,NULL,0,785,'Net calorific value - Petrol',0,NULL,0,1,0,0,'','Petrol','','','TJ/t','TJ/t','25','25',2020,NULL,0,2028,NULL,'ncv','cdm_ams_iii_s','1',NULL,65,NULL,'Net calorific value'),(NULL,NULL,NULL,NULL,0,786,'The annual average distance of transportation per person - Petrol-Bus - ',1,NULL,0,1,0,0,'Bus','Petrol','','','km','km','8','8',2020,NULL,0,2022,NULL,'dp','cdm_ams_iii_s','1',NULL,66,NULL,'The annual average distance of transportation per person'),(NULL,NULL,NULL,NULL,0,787,'The annual average distance of transportation per person - Petrol-Van - ',0,NULL,1,0,0,0,'Van','Petrol','','','km','km',NULL,NULL,2020,NULL,0,2022,NULL,'dp','cdm_ams_iii_s','1',NULL,66,NULL,'The annual average distance of transportation per person'),(NULL,NULL,NULL,NULL,0,788,'Total annual passengers transported - Petrol-Van - ',1,NULL,1,0,0,0,'Van','Petrol','','','passengers','passengers','1','1',2020,NULL,0,2022,NULL,'p','cdm_ams_iii_s','1',NULL,66,NULL,'Total annual passengers transported'),(NULL,NULL,NULL,NULL,0,789,'Total annual distance - Petrol-Van - ',1,NULL,1,0,0,0,'Van','Petrol','','','km','km','2','2',2020,NULL,0,2022,NULL,'d','cdm_ams_iii_s','1',NULL,66,NULL,'Total annual distance'),(NULL,NULL,NULL,NULL,0,790,'Fuel efficiency - Petrol-Van - ',0,NULL,1,0,0,0,'Van','Petrol','','','fuel/km','fuel/km','2','2',2020,NULL,0,2022,NULL,'n','cdm_ams_iii_s','1',NULL,66,NULL,'Fuel efficiency'),(NULL,NULL,NULL,NULL,0,791,'CO2 emission factor - Petrol',0,NULL,1,0,0,0,'','Petrol','','','t-CO2/TJ','t-CO2/TJ','5','5',2020,NULL,0,2022,NULL,'ef','cdm_ams_iii_s','1',NULL,66,NULL,'CO2 emission factor'),(NULL,NULL,NULL,NULL,0,792,'Net calorific value - Petrol',0,NULL,1,0,0,0,'','Petrol','','','TJ/t','TJ/t','5','5',2020,NULL,0,2022,NULL,'ncv','cdm_ams_iii_s','1',NULL,66,NULL,'Net calorific value'),(NULL,NULL,NULL,NULL,0,793,'Total annual distance - Petrol-Bus - ',0,NULL,0,1,0,0,'Bus','Petrol','','','km','km',NULL,NULL,2020,NULL,0,2022,NULL,'d','cdm_ams_iii_s','1',NULL,66,NULL,'Total annual distance'),(NULL,NULL,NULL,NULL,0,794,'Total annual passengers transported - Petrol-Bus - ',0,NULL,0,1,0,0,'Bus','Petrol','','','passengers','passengers','8','8',2020,NULL,0,2022,NULL,'p','cdm_ams_iii_s','1',NULL,66,NULL,'Total annual passengers transported'),(NULL,NULL,NULL,NULL,0,795,'Consumption of fuel - Petrol-Bus - ',0,NULL,0,1,0,0,'Bus','Petrol','','','t/y','t/y','8','8',2020,NULL,0,2022,NULL,'fc','cdm_ams_iii_s','1',NULL,66,NULL,'Consumption of fuel'),(NULL,NULL,NULL,NULL,0,796,'Fuel efficiency - Petrol-Bus - ',1,NULL,0,1,0,0,'Bus','Petrol','','','fuel/km','fuel/km',NULL,NULL,2020,NULL,0,2022,NULL,'n','cdm_ams_iii_s','1',NULL,66,NULL,'Fuel efficiency'),(NULL,NULL,NULL,NULL,0,797,'CO2 emission factor - Petrol',0,NULL,0,1,0,0,'','Petrol','','','t-CO2/TJ','t-CO2/TJ','21','21',2020,NULL,0,2022,NULL,'ef','cdm_ams_iii_s','1',NULL,66,NULL,'CO2 emission factor'),(NULL,NULL,NULL,NULL,0,798,'Net calorific value - Petrol',0,NULL,0,1,0,0,'','Petrol','','','TJ/t','TJ/t','45','45',2020,NULL,0,2022,NULL,'ncv','cdm_ams_iii_s','1',NULL,66,NULL,'Net calorific value'),(NULL,NULL,NULL,NULL,0,799,'The annual average distance of transportation per person - Petrol-Jeepneys - ',1,NULL,0,1,0,0,'Jeepneys','Petrol','','','km','km',NULL,NULL,2020,NULL,0,2022,NULL,'dp','cdm_ams_iii_s','1',NULL,67,NULL,'The annual average distance of transportation per person'),(NULL,NULL,NULL,NULL,0,800,'The annual average distance of transportation per person - Diesel-Jeepneys - ',0,NULL,1,0,0,0,'Jeepneys','Diesel','','','km','km','1','1',2020,NULL,0,2022,NULL,'dp','cdm_ams_iii_s','1',NULL,67,NULL,'The annual average distance of transportation per person'),(NULL,NULL,NULL,NULL,0,801,'Total annual passengers transported - Diesel-Jeepneys - ',1,NULL,1,0,0,0,'Jeepneys','Diesel','','','passengers','passengers',NULL,NULL,2020,NULL,0,2022,NULL,'p','cdm_ams_iii_s','1',NULL,67,NULL,'Total annual passengers transported'),(NULL,NULL,NULL,NULL,0,802,'Total annual distance - Diesel-Jeepneys - ',1,NULL,1,0,0,0,'Jeepneys','Diesel','','','km','km',NULL,NULL,2020,NULL,0,2022,NULL,'d','cdm_ams_iii_s','1',NULL,67,NULL,'Total annual distance'),(NULL,NULL,NULL,NULL,0,803,'Fuel efficiency - Diesel-Jeepneys - ',0,NULL,1,0,0,0,'Jeepneys','Diesel','','','fuel/km','fuel/km','1','1',2020,NULL,0,2022,NULL,'n','cdm_ams_iii_s','1',NULL,67,NULL,'Fuel efficiency'),(NULL,NULL,NULL,NULL,0,804,'CO2 emission factor - Diesel',0,NULL,1,0,0,0,'','Diesel','','','t-CO2/TJ','t-CO2/TJ','2','2',2020,NULL,0,2022,NULL,'ef','cdm_ams_iii_s','1',NULL,67,NULL,'CO2 emission factor'),(NULL,NULL,NULL,NULL,0,805,'Net calorific value - Diesel',0,NULL,1,0,0,0,'','Diesel','','','TJ/t','TJ/t','2','2',2020,NULL,0,2022,NULL,'ncv','cdm_ams_iii_s','1',NULL,67,NULL,'Net calorific value'),(NULL,NULL,NULL,NULL,0,806,'Total annual distance - Petrol-Jeepneys - ',0,NULL,0,1,0,0,'Jeepneys','Petrol','','','km','km','2','2',2020,NULL,0,2022,NULL,'d','cdm_ams_iii_s','1',NULL,67,NULL,'Total annual distance'),(NULL,NULL,NULL,NULL,0,807,'Total annual passengers transported - Petrol-Jeepneys - ',0,NULL,0,1,0,0,'Jeepneys','Petrol','','','passengers','passengers','2','2',2020,NULL,0,2022,NULL,'p','cdm_ams_iii_s','1',NULL,67,NULL,'Total annual passengers transported'),(NULL,NULL,NULL,NULL,0,808,'Consumption of fuel - Petrol-Jeepneys - ',0,NULL,0,1,0,0,'Jeepneys','Petrol','','','t/y','t/y','2','2',2020,NULL,0,2022,NULL,'fc','cdm_ams_iii_s','1',NULL,67,NULL,'Consumption of fuel'),(NULL,NULL,NULL,NULL,0,809,'CO2 emission factor - Petrol',0,NULL,0,1,0,0,'','Petrol','','','t-CO2/TJ','t-CO2/TJ','3','3',2020,NULL,0,2022,NULL,'ef','cdm_ams_iii_s','1',NULL,67,NULL,'CO2 emission factor'),(NULL,NULL,NULL,NULL,0,810,'Net calorific value - Petrol',0,NULL,0,1,0,0,'','Petrol','','','TJ/t','TJ/t','3','3',2020,NULL,0,2022,NULL,'ncv','cdm_ams_iii_s','1',NULL,67,NULL,'Net calorific value'),(NULL,NULL,NULL,NULL,0,811,'Fuel efficiency - Petrol-Jeepneys - ',1,NULL,0,1,0,0,'Jeepneys','Petrol','','','fuel/km','fuel/km',NULL,NULL,2020,NULL,0,2022,NULL,'n','cdm_ams_iii_s','1',NULL,67,NULL,'Fuel efficiency'),(NULL,NULL,NULL,NULL,0,812,'The annual average distance of transportation per person - Petrol-Jeepneys - ',1,NULL,0,1,0,0,'Jeepneys','Petrol','','','km','km',NULL,NULL,2022,NULL,0,2028,NULL,'dp','cdm_ams_iii_s','1',NULL,68,NULL,'The annual average distance of transportation per person'),(NULL,NULL,NULL,NULL,0,813,'The annual average distance of transportation per person - Diesel-Jeepneys - ',0,NULL,1,0,0,0,'Jeepneys','Diesel','','','km','km',NULL,NULL,2022,NULL,0,2028,NULL,'dp','cdm_ams_iii_s','1',NULL,68,NULL,'The annual average distance of transportation per person'),(NULL,NULL,NULL,NULL,0,814,'Total annual passengers transported - Diesel-Jeepneys - ',1,NULL,1,0,0,0,'Jeepneys','Diesel','','','passengers','passengers','1','1',2022,NULL,0,2028,NULL,'p','cdm_ams_iii_s','1',NULL,68,NULL,'Total annual passengers transported'),(NULL,NULL,NULL,NULL,0,815,'Total annual distance - Diesel-Jeepneys - ',1,NULL,1,0,0,0,'Jeepneys','Diesel','','','km','km','1','1',2022,NULL,0,2028,NULL,'d','cdm_ams_iii_s','1',NULL,68,NULL,'Total annual distance'),(NULL,NULL,NULL,NULL,0,816,'Fuel efficiency - Diesel-Jeepneys - ',0,NULL,1,0,0,0,'Jeepneys','Diesel','','','fuel/km','fuel/km','2','2',2022,NULL,0,2028,NULL,'n','cdm_ams_iii_s','1',NULL,68,NULL,'Fuel efficiency'),(NULL,NULL,NULL,NULL,0,817,'CO2 emission factor - Diesel',0,NULL,1,0,0,0,'','Diesel','','','t-CO2/TJ','t-CO2/TJ','2','2',2022,NULL,0,2028,NULL,'ef','cdm_ams_iii_s','1',NULL,68,NULL,'CO2 emission factor'),(NULL,NULL,NULL,NULL,0,818,'Net calorific value - Diesel',0,NULL,1,0,0,0,'','Diesel','','','TJ/t','TJ/t','2','2',2022,NULL,0,2028,NULL,'ncv','cdm_ams_iii_s','1',NULL,68,NULL,'Net calorific value'),(NULL,NULL,NULL,NULL,0,819,'Total annual distance - Petrol-Jeepneys - ',0,NULL,0,1,0,0,'Jeepneys','Petrol','','','km','km','3','3',2022,NULL,0,2028,NULL,'d','cdm_ams_iii_s','1',NULL,68,NULL,'Total annual distance'),(NULL,NULL,NULL,NULL,0,820,'Total annual passengers transported - Petrol-Jeepneys - ',0,NULL,0,1,0,0,'Jeepneys','Petrol','','','passengers','passengers','3','3',2022,NULL,0,2028,NULL,'p','cdm_ams_iii_s','1',NULL,68,NULL,'Total annual passengers transported'),(NULL,NULL,NULL,NULL,0,821,'Consumption of fuel - Petrol-Jeepneys - ',0,NULL,0,1,0,0,'Jeepneys','Petrol','','','t/y','t/y','3','3',2022,NULL,0,2028,NULL,'fc','cdm_ams_iii_s','1',NULL,68,NULL,'Consumption of fuel'),(NULL,NULL,NULL,NULL,0,822,'Fuel efficiency - Petrol-Jeepneys - ',1,NULL,0,1,0,0,'Jeepneys','Petrol','','','fuel/km','fuel/km',NULL,NULL,2022,NULL,0,2028,NULL,'n','cdm_ams_iii_s','1',NULL,68,NULL,'Fuel efficiency'),(NULL,NULL,NULL,NULL,0,823,'CO2 emission factor - Petrol',0,NULL,0,1,0,0,'','Petrol','','','t-CO2/TJ','t-CO2/TJ','4','4',2022,NULL,0,2028,NULL,'ef','cdm_ams_iii_s','1',NULL,68,NULL,'CO2 emission factor'),(NULL,NULL,NULL,NULL,0,824,'Net calorific value - Petrol',0,NULL,0,1,0,0,'','Petrol','','','TJ/t','TJ/t','4','4',2022,NULL,0,2028,NULL,'ncv','cdm_ams_iii_s','1',NULL,68,NULL,'Net calorific value'),(NULL,NULL,NULL,NULL,0,825,'The annual average distance of transportation per person - Petrol-Bus - ',1,NULL,0,1,0,0,'Bus','Petrol','','','km','km',NULL,NULL,2020,NULL,0,2022,NULL,'dp','cdm_ams_iii_s','1',NULL,69,NULL,'The annual average distance of transportation per person'),(NULL,NULL,NULL,NULL,0,826,'The annual average distance of transportation per person - Diesel-Bus - ',0,NULL,1,0,0,0,'Bus','Diesel','','','km','km',NULL,NULL,2020,NULL,0,2022,NULL,'dp','cdm_ams_iii_s','1',NULL,69,NULL,'The annual average distance of transportation per person'),(NULL,NULL,NULL,NULL,0,827,'Total annual passengers transported - Diesel-Bus - ',1,NULL,1,0,0,0,'Bus','Diesel','','','passengers','passengers','1','1',2020,NULL,0,2022,NULL,'p','cdm_ams_iii_s','1',NULL,69,NULL,'Total annual passengers transported'),(NULL,NULL,NULL,NULL,0,828,'Total annual distance - Diesel-Bus - ',1,NULL,1,0,0,0,'Bus','Diesel','','','km','km','1','1',2020,NULL,0,2022,NULL,'d','cdm_ams_iii_s','1',NULL,69,NULL,'Total annual distance'),(NULL,NULL,NULL,NULL,0,829,'Fuel efficiency - Diesel-Bus - ',0,NULL,1,0,0,0,'Bus','Diesel','','','fuel/km','fuel/km','5','5',2020,NULL,0,2022,NULL,'n','cdm_ams_iii_s','1',NULL,69,NULL,'Fuel efficiency'),(NULL,NULL,NULL,NULL,0,830,'CO2 emission factor - Diesel',0,NULL,1,0,0,0,'','Diesel','','','t-CO2/TJ','t-CO2/TJ','4','4',2020,NULL,0,2022,NULL,'ef','cdm_ams_iii_s','1',NULL,69,NULL,'CO2 emission factor'),(NULL,NULL,NULL,NULL,0,831,'Net calorific value - Diesel',0,NULL,1,0,0,0,'','Diesel','','','TJ/t','TJ/t','4','4',2020,NULL,0,2022,NULL,'ncv','cdm_ams_iii_s','1',NULL,69,NULL,'Net calorific value'),(NULL,NULL,NULL,NULL,0,832,'Total annual distance - Petrol-Bus - ',0,NULL,0,1,0,0,'Bus','Petrol','','','km','km','1','1',2020,NULL,0,2022,NULL,'d','cdm_ams_iii_s','1',NULL,69,NULL,'Total annual distance'),(NULL,NULL,NULL,NULL,0,833,'Total annual passengers transported - Petrol-Bus - ',0,NULL,0,1,0,0,'Bus','Petrol','','','passengers','passengers','1','1',2020,NULL,0,2022,NULL,'p','cdm_ams_iii_s','1',NULL,69,NULL,'Total annual passengers transported'),(NULL,NULL,NULL,NULL,0,834,'Consumption of fuel - Petrol-Bus - ',0,NULL,0,1,0,0,'Bus','Petrol','','','t/y','t/y','1','1',2020,NULL,0,2022,NULL,'fc','cdm_ams_iii_s','1',NULL,69,NULL,'Consumption of fuel'),(NULL,NULL,NULL,NULL,0,835,'Fuel efficiency - Petrol-Bus - ',1,NULL,0,1,0,0,'Bus','Petrol','','','fuel/km','fuel/km',NULL,NULL,2020,NULL,0,2022,NULL,'n','cdm_ams_iii_s','1',NULL,69,NULL,'Fuel efficiency'),(NULL,NULL,NULL,NULL,0,836,'CO2 emission factor - Petrol',0,NULL,0,1,0,0,'','Petrol','','','t-CO2/TJ','t-CO2/TJ','6','6',2020,NULL,0,2022,NULL,'ef','cdm_ams_iii_s','1',NULL,69,NULL,'CO2 emission factor'),(NULL,NULL,NULL,NULL,0,837,'Net calorific value - Petrol',0,NULL,0,1,0,0,'','Petrol','','','TJ/t','TJ/t','6','6',2020,NULL,0,2022,NULL,'ncv','cdm_ams_iii_s','1',NULL,69,NULL,'Net calorific value'),(NULL,NULL,NULL,NULL,0,838,'The annual average distance of transportation per person - CNG-Van - ',1,NULL,0,1,0,0,'Van','CNG','','','km','km','1','1',2020,NULL,0,2024,NULL,'dp','cdm_ams_iii_s','1',NULL,70,NULL,'The annual average distance of transportation per person'),(NULL,NULL,NULL,NULL,0,839,'The annual average distance of transportation per person - Diesel-Bus - ',0,NULL,1,0,0,0,'Bus','Diesel','','','km','km','','',2020,NULL,0,2024,NULL,'dp','cdm_ams_iii_s','1',NULL,70,NULL,'The annual average distance of transportation per person'),(NULL,NULL,NULL,NULL,0,840,'Total annual passengers transported - Diesel-Bus - ',1,NULL,1,0,0,0,'Bus','Diesel','','','passengers','passengers','1','1',2020,NULL,0,2024,NULL,'p','cdm_ams_iii_s','1',NULL,70,NULL,'Total annual passengers transported'),(NULL,NULL,NULL,NULL,0,841,'Total annual distance - Diesel-Bus - ',1,NULL,1,0,0,0,'Bus','Diesel','','','km','km','1','1',2020,NULL,0,2024,NULL,'d','cdm_ams_iii_s','1',NULL,70,NULL,'Total annual distance'),(NULL,NULL,NULL,NULL,0,842,'Fuel efficiency - Diesel-Bus - ',0,NULL,1,0,0,0,'Bus','Diesel','','','fuel/km','fuel/km','3','3',2020,NULL,0,2024,NULL,'n','cdm_ams_iii_s','1',NULL,70,NULL,'Fuel efficiency'),(NULL,NULL,NULL,NULL,0,843,'CO2 emission factor - Diesel',0,NULL,1,0,0,0,'','Diesel','','','t-CO2/TJ','t-CO2/TJ','5','5',2020,NULL,0,2024,NULL,'ef','cdm_ams_iii_s','1',NULL,70,NULL,'CO2 emission factor'),(NULL,NULL,NULL,NULL,0,844,'Net calorific value - Diesel',0,NULL,1,0,0,0,'','Diesel','','','TJ/t','TJ/t','5','5',2020,NULL,0,2024,NULL,'ncv','cdm_ams_iii_s','1',NULL,70,NULL,'Net calorific value'),(NULL,NULL,NULL,NULL,0,845,'Total annual distance - CNG-Van - ',0,NULL,0,1,0,0,'Van','CNG','','','km','km',NULL,NULL,2020,NULL,0,2024,NULL,'d','cdm_ams_iii_s','1',NULL,70,NULL,'Total annual distance'),(NULL,NULL,NULL,NULL,0,846,'Total annual passengers transported - CNG-Van - ',0,NULL,0,1,0,0,'Van','CNG','','','passengers','passengers','3','3',2020,NULL,0,2024,NULL,'p','cdm_ams_iii_s','1',NULL,70,NULL,'Total annual passengers transported'),(NULL,NULL,NULL,NULL,0,847,'Consumption of fuel - CNG-Van - ',0,NULL,0,1,0,0,'Van','CNG','','','t/y','t/y','6','6',2020,NULL,0,2024,NULL,'fc','cdm_ams_iii_s','1',NULL,70,NULL,'Consumption of fuel'),(NULL,NULL,NULL,NULL,0,848,'Fuel efficiency - CNG-Van - ',1,NULL,0,1,0,0,'Van','CNG','','','fuel/km','fuel/km',NULL,NULL,2020,NULL,0,2024,NULL,'n','cdm_ams_iii_s','1',NULL,70,NULL,'Fuel efficiency'),(NULL,NULL,NULL,NULL,0,849,'CO2 emission factor - CNG',0,NULL,0,1,0,0,'','CNG','','','t-CO2/TJ','t-CO2/TJ','6','6',2020,NULL,0,2024,NULL,'ef','cdm_ams_iii_s','1',NULL,70,NULL,'CO2 emission factor'),(NULL,NULL,NULL,NULL,0,850,'Net calorific value - CNG',0,NULL,0,1,0,0,'','CNG','','','TJ/t','TJ/t','6','6',2020,NULL,0,2024,NULL,'ncv','cdm_ams_iii_s','1',NULL,70,NULL,'Net calorific value'),(NULL,NULL,NULL,NULL,0,851,'The annual average distance of transportation per person - Petrol-Bus - ',1,NULL,0,1,0,0,'Bus','Petrol','','','km','km',NULL,NULL,2022,NULL,0,2024,NULL,'dp','cdm_ams_iii_s','1',NULL,71,NULL,'The annual average distance of transportation per person'),(NULL,NULL,NULL,NULL,0,852,'The annual average distance of transportation per person - Diesel-Jeepneys - ',0,NULL,1,0,0,0,'Jeepneys','Diesel','','','km','km',NULL,NULL,2022,NULL,0,2024,NULL,'dp','cdm_ams_iii_s','1',NULL,71,NULL,'The annual average distance of transportation per person'),(NULL,NULL,NULL,NULL,0,853,'Total annual passengers transported - Diesel-Jeepneys - ',1,NULL,1,0,0,0,'Jeepneys','Diesel','','','passengers','passengers','1','1',2022,NULL,0,2024,NULL,'p','cdm_ams_iii_s','1',NULL,71,NULL,'Total annual passengers transported'),(NULL,NULL,NULL,NULL,0,854,'Total annual distance - Diesel-Jeepneys - ',1,NULL,1,0,0,0,'Jeepneys','Diesel','','','km','km','1','1',2022,NULL,0,2024,NULL,'d','cdm_ams_iii_s','1',NULL,71,NULL,'Total annual distance'),(NULL,NULL,NULL,NULL,0,855,'Fuel efficiency - Diesel-Jeepneys - ',0,NULL,1,0,0,0,'Jeepneys','Diesel','','','fuel/km','fuel/km','2','2',2022,NULL,0,2024,NULL,'n','cdm_ams_iii_s','1',NULL,71,NULL,'Fuel efficiency'),(NULL,NULL,NULL,NULL,0,856,'CO2 emission factor - Diesel',0,NULL,1,0,0,0,'','Diesel','','','t-CO2/TJ','t-CO2/TJ','3','3',2022,NULL,0,2024,NULL,'ef','cdm_ams_iii_s','1',NULL,71,NULL,'CO2 emission factor'),(NULL,NULL,NULL,NULL,0,857,'Net calorific value - Diesel',0,NULL,1,0,0,0,'','Diesel','','','TJ/t','TJ/t','3','3',2022,NULL,0,2024,NULL,'ncv','cdm_ams_iii_s','1',NULL,71,NULL,'Net calorific value'),(NULL,NULL,NULL,NULL,0,858,'Total annual distance - Petrol-Bus - ',0,NULL,0,1,0,0,'Bus','Petrol','','','km','km','4','4',2022,NULL,0,2024,NULL,'d','cdm_ams_iii_s','1',NULL,71,NULL,'Total annual distance'),(NULL,NULL,NULL,NULL,0,859,'Total annual passengers transported - Petrol-Bus - ',0,NULL,0,1,0,0,'Bus','Petrol','','','passengers','passengers','5','5',2022,NULL,0,2024,NULL,'p','cdm_ams_iii_s','1',NULL,71,NULL,'Total annual passengers transported'),(NULL,NULL,NULL,NULL,0,860,'Consumption of fuel - Petrol-Bus - ',0,NULL,0,1,0,0,'Bus','Petrol','','','t/y','t/y','6','6',2022,NULL,0,2024,NULL,'fc','cdm_ams_iii_s','1',NULL,71,NULL,'Consumption of fuel'),(NULL,NULL,NULL,NULL,0,861,'Fuel efficiency - Petrol-Bus - ',1,NULL,0,1,0,0,'Bus','Petrol','','','fuel/km','fuel/km',NULL,NULL,2022,NULL,0,2024,NULL,'n','cdm_ams_iii_s','1',NULL,71,NULL,'Fuel efficiency'),(NULL,NULL,NULL,NULL,0,862,'CO2 emission factor - Petrol',0,NULL,0,1,0,0,'','Petrol','','','t-CO2/TJ','t-CO2/TJ','2','2',2022,NULL,0,2024,NULL,'ef','cdm_ams_iii_s','1',NULL,71,NULL,'CO2 emission factor'),(NULL,NULL,NULL,NULL,0,863,'Net calorific value - Petrol',0,NULL,0,1,0,0,'','Petrol','','','TJ/t','TJ/t','2','2',2022,NULL,0,2024,NULL,'ncv','cdm_ams_iii_s','1',NULL,71,NULL,'Net calorific value'),(NULL,NULL,NULL,NULL,0,864,'The annual average distance of transportation per person - Petrol-Bus - ',1,NULL,0,1,0,0,'Bus','Petrol','','','km','km','0.54','0.54',2020,NULL,0,2024,NULL,'dp','cdm_ams_iii_s','1',NULL,72,NULL,'The annual average distance of transportation per person'),(NULL,NULL,NULL,NULL,0,865,'The annual average distance of transportation per person - Diesel-Jeepneys - ',0,NULL,1,0,0,0,'Jeepneys','Diesel','','','km','km',NULL,NULL,2020,NULL,0,2024,NULL,'dp','cdm_ams_iii_s','1',NULL,72,NULL,'The annual average distance of transportation per person'),(NULL,NULL,NULL,NULL,0,866,'Total annual passengers transported - Diesel-Jeepneys - ',1,NULL,1,0,0,0,'Jeepneys','Diesel','','','passengers','passengers','65687','65687',2020,NULL,0,2024,NULL,'p','cdm_ams_iii_s','1',NULL,72,NULL,'Total annual passengers transported'),(NULL,NULL,NULL,NULL,0,867,'Total annual distance - Diesel-Jeepneys - ',1,NULL,1,0,0,0,'Jeepneys','Diesel','','','km','km','25638','25638',2020,NULL,0,2024,NULL,'d','cdm_ams_iii_s','1',NULL,72,NULL,'Total annual distance'),(NULL,NULL,NULL,NULL,0,868,'Fuel efficiency - Diesel-Jeepneys - ',0,NULL,1,0,0,0,'Jeepneys','Diesel','','','fuel/km','fuel/km','0.00336','0.00336',2020,NULL,0,2024,NULL,'n','cdm_ams_iii_s','1',NULL,72,NULL,'Fuel efficiency'),(NULL,NULL,NULL,NULL,0,869,'CO2 emission factor - Diesel',0,NULL,1,0,0,0,'','Diesel','','','t-CO2/TJ','t-CO2/TJ','75.243','75.243',2020,NULL,0,2024,NULL,'ef','cdm_ams_iii_s','1',NULL,72,NULL,'CO2 emission factor'),(NULL,NULL,NULL,NULL,0,870,'Net calorific value - Diesel',0,NULL,1,0,0,0,'','Diesel','','','TJ/t','TJ/t','0.043','0.043',2020,NULL,0,2024,NULL,'ncv','cdm_ams_iii_s','1',NULL,72,NULL,'Net calorific value'),(NULL,NULL,NULL,NULL,0,871,'Total annual distance - Petrol-Bus - ',0,NULL,0,1,0,0,'Bus','Petrol','','','km','km',NULL,NULL,2020,NULL,0,2024,NULL,'d','cdm_ams_iii_s','1',NULL,72,NULL,'Total annual distance'),(NULL,NULL,NULL,NULL,0,872,'Total annual passengers transported - Petrol-Bus - ',0,NULL,0,1,0,0,'Bus','Petrol','','','passengers','passengers','63000','63000',2020,NULL,0,2024,NULL,'p','cdm_ams_iii_s','1',NULL,72,NULL,'Total annual passengers transported'),(NULL,NULL,NULL,NULL,0,873,'Consumption of fuel - Petrol-Bus - ',0,NULL,0,1,0,0,'Bus','Petrol','','','t/y','t/y','77.17','77.17',2020,NULL,0,2024,NULL,'fc','cdm_ams_iii_s','1',NULL,72,NULL,'Consumption of fuel'),(NULL,NULL,NULL,NULL,0,874,'Fuel efficiency - Petrol-Bus - ',1,NULL,0,1,0,0,'Bus','Petrol','','','fuel/km','fuel/km',NULL,NULL,2020,NULL,0,2024,NULL,'n','cdm_ams_iii_s','1',NULL,72,NULL,'Fuel efficiency'),(NULL,NULL,NULL,NULL,0,875,'CO2 emission factor - Petrol',0,NULL,0,1,0,0,'','Petrol','','','t-CO2/TJ','t-CO2/TJ','59.471','59.471',2020,NULL,0,2024,NULL,'ef','cdm_ams_iii_s','1',NULL,72,NULL,'CO2 emission factor'),(NULL,NULL,NULL,NULL,0,876,'Net calorific value - Petrol',0,NULL,0,1,0,0,'','Petrol','','','TJ/t','TJ/t','0.048','0.048',2020,NULL,0,2024,NULL,'ncv','cdm_ams_iii_s','1',NULL,72,NULL,'Net calorific value'),(NULL,NULL,NULL,NULL,0,877,'The annual average distance of transportation per person - Petrol-Van - ',1,NULL,0,1,0,0,'Van','Petrol','','','km','km','0.54','0.54',2020,NULL,0,2028,NULL,'dp','cdm_ams_iii_s','1',NULL,73,NULL,'The annual average distance of transportation per person'),(NULL,NULL,NULL,NULL,0,878,'The annual average distance of transportation per person - Petrol-Tricycles - ',0,NULL,1,0,0,0,'Tricycles','Petrol','','','km','km',NULL,NULL,2020,NULL,0,2028,NULL,'dp','cdm_ams_iii_s','1',NULL,73,NULL,'The annual average distance of transportation per person'),(NULL,NULL,NULL,NULL,0,879,'Total annual passengers transported - Petrol-Tricycles - ',1,NULL,1,0,0,0,'Tricycles','Petrol','','','passengers','passengers','65687','65687',2020,NULL,0,2028,NULL,'p','cdm_ams_iii_s','1',NULL,73,NULL,'Total annual passengers transported'),(NULL,NULL,NULL,NULL,0,880,'Total annual distance - Petrol-Tricycles - ',1,NULL,1,0,0,0,'Tricycles','Petrol','','','km','km','25638','25638',2020,NULL,0,2028,NULL,'d','cdm_ams_iii_s','1',NULL,73,NULL,'Total annual distance'),(NULL,NULL,NULL,NULL,0,881,'CO2 emission factor - Petrol',0,NULL,1,0,0,0,'','Petrol','','','t-CO2/TJ','t-CO2/TJ','75.243','75.243',2020,NULL,0,2028,NULL,'ef','cdm_ams_iii_s','1',NULL,73,NULL,'CO2 emission factor'),(NULL,NULL,NULL,NULL,0,882,'Net calorific value - Petrol',0,NULL,1,0,0,0,'','Petrol','','','TJ/t','TJ/t','0.043','0.043',2020,NULL,0,2028,NULL,'ncv','cdm_ams_iii_s','1',NULL,73,NULL,'Net calorific value'),(NULL,NULL,NULL,NULL,0,883,'Total annual distance - Petrol-Van - ',0,NULL,0,1,0,0,'Van','Petrol','','','km','km',NULL,NULL,2020,NULL,0,2028,NULL,'d','cdm_ams_iii_s','1',NULL,73,NULL,'Total annual distance'),(NULL,NULL,NULL,NULL,0,884,'Fuel efficiency - Petrol-Tricycles - ',0,NULL,1,0,0,0,'Tricycles','Petrol','','','fuel/km','fuel/km','0.00336','0.00336',2020,NULL,0,2028,NULL,'n','cdm_ams_iii_s','1',NULL,73,NULL,'Fuel efficiency'),(NULL,NULL,NULL,NULL,0,885,'Total annual passengers transported - Petrol-Van - ',0,NULL,0,1,0,0,'Van','Petrol','','','passengers','passengers','63000','63000',2020,NULL,0,2028,NULL,'p','cdm_ams_iii_s','1',NULL,73,NULL,'Total annual passengers transported'),(NULL,NULL,NULL,NULL,0,886,'Consumption of fuel - Petrol-Van - ',0,NULL,0,1,0,0,'Van','Petrol','','','t/y','t/y','77.17','77.17',2020,NULL,0,2028,NULL,'fc','cdm_ams_iii_s','1',NULL,73,NULL,'Consumption of fuel'),(NULL,NULL,NULL,NULL,0,887,'Fuel efficiency - Petrol-Van - ',1,NULL,0,1,0,0,'Van','Petrol','','','fuel/km','fuel/km',NULL,NULL,2020,NULL,0,2028,NULL,'n','cdm_ams_iii_s','1',NULL,73,NULL,'Fuel efficiency'),(NULL,NULL,NULL,NULL,0,888,'CO2 emission factor - Petrol',0,NULL,0,1,0,0,'','Petrol','','','t-CO2/TJ','t-CO2/TJ','59.471','59.471',2020,NULL,0,2028,NULL,'ef','cdm_ams_iii_s','1',NULL,73,NULL,'CO2 emission factor'),(NULL,NULL,NULL,NULL,0,889,'Net calorific value - Petrol',0,NULL,0,1,0,0,'','Petrol','','','TJ/t','TJ/t','0.048','0.048',2020,NULL,0,2028,NULL,'ncv','cdm_ams_iii_s','1',NULL,73,NULL,'Net calorific value'),(NULL,NULL,NULL,NULL,0,890,'Fuel efficiency - Diesel-Jeepneys - A27',0,NULL,1,0,0,0,'Jeepneys','Diesel','A27','','fuel/km',NULL,NULL,NULL,2020,NULL,0,1993,NULL,'n','cdm_ams_iii_s','1',3,74,NULL,'Fuel efficiency'),(NULL,NULL,NULL,NULL,0,891,'The annual average distance of transportation per person - Diesel-Jeepneys - A27',0,NULL,1,0,0,0,'Jeepneys','Diesel','A27','','km',NULL,NULL,NULL,2020,NULL,0,1993,NULL,'dp','cdm_ams_iii_s','1',3,74,NULL,'The annual average distance of transportation per person'),(NULL,NULL,NULL,NULL,0,892,'Total annual passengers transported - Diesel-Jeepneys - A27',1,NULL,1,0,0,0,'Jeepneys','Diesel','A27','','passengers',NULL,NULL,NULL,2020,NULL,0,1993,NULL,'p','cdm_ams_iii_s','1',3,74,NULL,'Total annual passengers transported'),(NULL,NULL,NULL,NULL,0,893,'Total annual distance - Diesel-Jeepneys - A27',1,NULL,1,0,0,0,'Jeepneys','Diesel','A27','','km',NULL,NULL,NULL,2020,NULL,0,1993,NULL,'d','cdm_ams_iii_s','1',3,74,NULL,'Total annual distance'),(NULL,NULL,NULL,NULL,0,894,'The annual average distance of transportation per person - Electricity-Jeepneys - A27',1,NULL,0,1,0,0,'Jeepneys','Electricity','A27','','km',NULL,NULL,NULL,2020,NULL,0,1993,NULL,'dp','cdm_ams_iii_s','1',3,74,NULL,'The annual average distance of transportation per person'),(NULL,NULL,NULL,NULL,0,895,'Total annual distance - Electricity-Jeepneys - A27',0,NULL,0,1,0,0,'Jeepneys','Electricity','A27','','km',NULL,NULL,NULL,2020,NULL,0,1993,NULL,'d','cdm_ams_iii_s','1',3,74,NULL,'Total annual distance'),(NULL,NULL,NULL,NULL,0,896,'CO2 emission factor - Diesel',0,NULL,1,0,0,0,'','Diesel','','','t-CO2/TJ',NULL,NULL,NULL,2020,NULL,0,1993,NULL,'ef','cdm_ams_iii_s','1',3,74,NULL,'CO2 emission factor'),(NULL,NULL,NULL,NULL,0,897,'Net calorific value - Diesel',0,NULL,1,0,0,0,'','Diesel','','','TJ/t',NULL,NULL,NULL,2020,NULL,0,1993,NULL,'ncv','cdm_ams_iii_s','1',3,74,NULL,'Net calorific value'),(NULL,NULL,NULL,NULL,0,898,'Consumption of fuel - Electricity-Jeepneys - A27',0,NULL,0,1,0,0,'Jeepneys','Electricity','A27','','t/y',NULL,NULL,NULL,2020,NULL,0,1993,NULL,'fc','cdm_ams_iii_s','1',3,74,NULL,'Consumption of fuel'),(NULL,NULL,NULL,NULL,0,899,'Total annual distance - Petrol-Jeepneys - A27',0,NULL,0,1,0,0,'Jeepneys','Petrol','A27','','km',NULL,NULL,NULL,2020,NULL,0,1993,NULL,'d','cdm_ams_iii_s','1',3,74,NULL,'Total annual distance'),(NULL,NULL,NULL,NULL,0,900,'The annual average distance of transportation per person - Petrol-Jeepneys - A27',1,NULL,0,1,0,0,'Jeepneys','Petrol','A27','','km',NULL,NULL,NULL,2020,NULL,0,1993,NULL,'dp','cdm_ams_iii_s','1',3,74,NULL,'The annual average distance of transportation per person'),(NULL,NULL,NULL,NULL,0,901,'Total annual passengers transported - Petrol-Jeepneys - A27',0,NULL,0,1,0,0,'Jeepneys','Petrol','A27','','passengers',NULL,NULL,NULL,2020,NULL,0,1993,NULL,'p','cdm_ams_iii_s','1',3,74,NULL,'Total annual passengers transported'),(NULL,NULL,NULL,NULL,0,902,'Total annual passengers transported - Electricity-Jeepneys - A27',0,NULL,0,1,0,0,'Jeepneys','Electricity','A27','','passengers',NULL,NULL,NULL,2020,NULL,0,1993,NULL,'p','cdm_ams_iii_s','1',3,74,NULL,'Total annual passengers transported'),(NULL,NULL,NULL,NULL,0,903,'Fuel efficiency - Electricity-Jeepneys - A27',1,NULL,0,1,0,0,'Jeepneys','Electricity','A27','','fuel/km',NULL,NULL,NULL,2020,NULL,0,1993,NULL,'n','cdm_ams_iii_s','1',3,74,NULL,'Fuel efficiency'),(NULL,NULL,NULL,NULL,0,904,'Consumption of fuel - Petrol-Jeepneys - A27',0,NULL,0,1,0,0,'Jeepneys','Petrol','A27','','t/y',NULL,NULL,NULL,2020,NULL,0,1993,NULL,'fc','cdm_ams_iii_s','1',3,74,NULL,'Consumption of fuel'),(NULL,NULL,NULL,NULL,0,905,'Fuel efficiency - Petrol-Jeepneys - A27',1,NULL,0,1,0,0,'Jeepneys','Petrol','A27','','fuel/km',NULL,NULL,NULL,2020,NULL,0,1993,NULL,'n','cdm_ams_iii_s','1',3,74,NULL,'Fuel efficiency'),(NULL,NULL,NULL,NULL,0,906,'Total annual distance - Diesel-Jeepneys - A27',0,NULL,0,1,0,0,'Jeepneys','Diesel','A27','','km',NULL,NULL,NULL,2020,NULL,0,1993,NULL,'d','cdm_ams_iii_s','1',3,74,NULL,'Total annual distance'),(NULL,NULL,NULL,NULL,0,907,'The annual average distance of transportation per person - Diesel-Jeepneys - A27',1,NULL,0,1,0,0,'Jeepneys','Diesel','A27','','km',NULL,NULL,NULL,2020,NULL,0,1993,NULL,'dp','cdm_ams_iii_s','1',3,74,NULL,'The annual average distance of transportation per person'),(NULL,NULL,NULL,NULL,0,908,'Total annual passengers transported - Diesel-Jeepneys - A27',0,NULL,0,1,0,0,'Jeepneys','Diesel','A27','','passengers',NULL,NULL,NULL,2020,NULL,0,1993,NULL,'p','cdm_ams_iii_s','1',3,74,NULL,'Total annual passengers transported'),(NULL,NULL,NULL,NULL,0,909,'Consumption of fuel - Diesel-Jeepneys - A27',0,NULL,0,1,0,0,'Jeepneys','Diesel','A27','','t/y',NULL,NULL,NULL,2020,NULL,0,1993,NULL,'fc','cdm_ams_iii_s','1',3,74,NULL,'Consumption of fuel'),(NULL,NULL,NULL,NULL,0,910,'Fuel efficiency - Diesel-Jeepneys - A27',1,NULL,0,1,0,0,'Jeepneys','Diesel','A27','','fuel/km',NULL,NULL,NULL,2020,NULL,0,1993,NULL,'n','cdm_ams_iii_s','1',3,74,NULL,'Fuel efficiency'),(NULL,NULL,NULL,NULL,0,911,'CO2 emission factor - Electricity',0,NULL,0,1,0,0,'','Electricity','','','t-CO2/TJ',NULL,NULL,NULL,2020,NULL,0,1993,NULL,'ef','cdm_ams_iii_s','1',3,74,NULL,'CO2 emission factor'),(NULL,NULL,NULL,NULL,0,912,'CO2 emission factor - Petrol',0,NULL,0,1,0,0,'','Petrol','','','t-CO2/TJ',NULL,NULL,NULL,2020,NULL,0,1993,NULL,'ef','cdm_ams_iii_s','1',3,74,NULL,'CO2 emission factor'),(NULL,NULL,NULL,NULL,0,913,'Net calorific value - Petrol',0,NULL,0,1,0,0,'','Petrol','','','TJ/t',NULL,NULL,NULL,2020,NULL,0,1993,NULL,'ncv','cdm_ams_iii_s','1',3,74,NULL,'Net calorific value'),(NULL,NULL,NULL,NULL,0,914,'CO2 emission factor - Diesel',0,NULL,0,1,0,0,'','Diesel','','','t-CO2/TJ',NULL,NULL,NULL,2020,NULL,0,1993,NULL,'ef','cdm_ams_iii_s','1',3,74,NULL,'CO2 emission factor'),(NULL,NULL,NULL,NULL,0,915,'Net calorific value - Diesel',0,NULL,0,1,0,0,'','Diesel','','','TJ/t',NULL,NULL,NULL,2020,NULL,0,1993,NULL,'ncv','cdm_ams_iii_s','1',3,74,NULL,'Net calorific value');
/*!40000 ALTER TABLE `parameter` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `parameter_history`
--

DROP TABLE IF EXISTS `parameter_history`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `parameter_history` (
  `createdBy` varchar(255) DEFAULT NULL,
  `createdOn` datetime DEFAULT NULL,
  `editedBy` varchar(255) DEFAULT NULL,
  `editedOn` datetime DEFAULT NULL,
  `status` int NOT NULL DEFAULT '0',
  `id` int NOT NULL AUTO_INCREMENT,
  `parameterName` varchar(255) DEFAULT NULL,
  `Action` int NOT NULL,
  `parameterId` int NOT NULL,
  `parameterStatus` varchar(255) NOT NULL,
  `parameterStatusPrevious` varchar(255) DEFAULT NULL,
  `comment` varchar(255) DEFAULT NULL,
  `description` varchar(255) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=776 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `parameter_history`
--

LOCK TABLES `parameter_history` WRITE;
/*!40000 ALTER TABLE `parameter_history` DISABLE KEYS */;
INSERT INTO `parameter_history` VALUES ('','2022-03-03 11:13:01','','2022-03-03 11:13:01',0,764,'Share of fuel type Petrol - Fuel Mix',1,615,'Pass',NULL,'','Quality Check Status Updated to Pass'),('','2022-03-03 11:13:20','','2022-03-03 11:13:20',0,765,'Total fuel used for ground transport(Fuel mix) - Fuel Mix',1,616,'Pass',NULL,'Fine','Quality Check Status Updated to Pass'),('','2022-03-03 11:13:32','','2022-03-03 11:13:32',0,766,'Share of fuel type Diesel - Fuel Mix',1,617,'Pass',NULL,'Fine','Quality Check Status Updated to Pass'),('','2022-03-03 11:13:56','','2022-03-03 11:13:56',0,767,'CO2 emission factor of Diesel - Fuel Mix',1,618,'Pass',NULL,'Fine','Quality Check Status Updated to Pass'),('','2022-03-03 11:14:07','','2022-03-03 11:14:07',0,768,'CO2 emission factor of Petrol - Fuel Mix',1,620,'Pass',NULL,'Fine','Quality Check Status Updated to Pass'),('','2022-03-03 11:14:23','','2022-03-03 11:14:23',0,769,'Actual per capita income in local currency for the assessment year - Fuel Mix',1,619,'Pass',NULL,'','Quality Check Status Updated to Pass'),('','2022-03-03 11:14:36','','2022-03-03 11:14:36',0,770,'Fuel mix own - price elasticity - Fuel Mix',1,621,'Pass',NULL,'','Quality Check Status Updated to Pass'),('','2022-03-03 11:14:42','','2022-03-03 11:14:42',0,771,'Country Code - Fuel Mix',1,622,'Pass',NULL,'','Quality Check Status Updated to Pass'),('','2022-03-03 11:14:54','','2022-03-03 11:14:54',0,772,'Actual fuel mix price in local currency for the assessment year - Fuel Mix',1,623,'Pass',NULL,'','Quality Check Status Updated to Pass'),('','2022-03-03 11:14:58','','2022-03-03 11:14:58',0,773,'Relative fuel mix price increase - Fuel Mix',1,624,'Pass',NULL,'','Quality Check Status Updated to Pass'),('','2022-03-03 11:16:09','','2022-03-03 11:16:09',0,774,'Projection Year POP 2025',1,626,'Pass',NULL,'','Quality Check Status Updated to Pass'),('','2022-03-03 11:55:38','','2022-03-03 11:55:38',0,775,'Projection Base Year 2025',1,625,'Pass',NULL,'','Quality Check Status Updated to Pass');
/*!40000 ALTER TABLE `parameter_history` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `project_approval_status`
--

DROP TABLE IF EXISTS `project_approval_status`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `project_approval_status` (
  `createdBy` varchar(255) DEFAULT NULL,
  `createdOn` datetime DEFAULT NULL,
  `editedBy` varchar(255) DEFAULT NULL,
  `editedOn` datetime DEFAULT NULL,
  `status` int NOT NULL DEFAULT '0',
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) DEFAULT NULL,
  `description` varchar(2500) DEFAULT NULL,
  `sortOrder` int NOT NULL DEFAULT '1',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `project_approval_status`
--

LOCK TABLES `project_approval_status` WRITE;
/*!40000 ALTER TABLE `project_approval_status` DISABLE KEYS */;
INSERT INTO `project_approval_status` VALUES (NULL,NULL,NULL,NULL,0,1,'Accept','Accept',1),(NULL,NULL,NULL,NULL,0,2,'Reject','Reject',1),(NULL,NULL,NULL,NULL,0,3,'Data Request','Data Request',1),(NULL,NULL,NULL,NULL,0,4,'Propose','Propose',1),(NULL,NULL,NULL,NULL,0,5,'Active','Active',1);
/*!40000 ALTER TABLE `project_approval_status` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `project_owner`
--

DROP TABLE IF EXISTS `project_owner`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `project_owner` (
  `createdBy` varchar(255) DEFAULT NULL,
  `createdOn` datetime DEFAULT NULL,
  `editedBy` varchar(255) DEFAULT NULL,
  `editedOn` datetime DEFAULT NULL,
  `status` int NOT NULL DEFAULT '0',
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) DEFAULT NULL,
  `description` varchar(2500) DEFAULT NULL,
  `sortOrder` int NOT NULL DEFAULT '1',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `project_owner`
--

LOCK TABLES `project_owner` WRITE;
/*!40000 ALTER TABLE `project_owner` DISABLE KEYS */;
INSERT INTO `project_owner` VALUES (NULL,NULL,NULL,NULL,0,1,'Private','Private',1),(NULL,NULL,NULL,NULL,0,2,'Government','Government',1),(NULL,NULL,NULL,NULL,0,3,'Public Privet Partnership','Public Privet Partnership',1),(NULL,NULL,NULL,NULL,0,4,'NGO','NGO',1),(NULL,NULL,NULL,NULL,0,5,'International','International',1);
/*!40000 ALTER TABLE `project_owner` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `projectionResult`
--

DROP TABLE IF EXISTS `projectionResult`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `projectionResult` (
  `createdBy` varchar(255) DEFAULT NULL,
  `createdOn` datetime DEFAULT NULL,
  `editedBy` varchar(255) DEFAULT NULL,
  `editedOn` datetime DEFAULT NULL,
  `status` int NOT NULL DEFAULT '0',
  `id` int NOT NULL AUTO_INCREMENT,
  `projectionYear` int NOT NULL,
  `baselineResult` int DEFAULT NULL,
  `baselineResultUnit` varchar(255) DEFAULT NULL,
  `projectResult` int DEFAULT NULL,
  `projectResultUnit` varchar(255) DEFAULT NULL,
  `leakageResult` int DEFAULT NULL,
  `leakageResultUnit` varchar(255) DEFAULT NULL,
  `emissionReduction` int DEFAULT NULL,
  `emissionReductionUnit` varchar(255) DEFAULT NULL,
  `qcStatus` int DEFAULT NULL,
  `qcComment` varchar(255) DEFAULT NULL,
  `projectionResult` int NOT NULL,
  `assessmentResultId` int DEFAULT NULL,
  `assessmentId` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FK_5365358a3ff956ef2aa1a3f5cbc` (`assessmentResultId`),
  KEY `FK_b405923865f5ae43237538e0c0d` (`assessmentId`),
  CONSTRAINT `FK_5365358a3ff956ef2aa1a3f5cbc` FOREIGN KEY (`assessmentResultId`) REFERENCES `assessment` (`id`),
  CONSTRAINT `FK_b405923865f5ae43237538e0c0d` FOREIGN KEY (`assessmentId`) REFERENCES `assessment` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `projectionResult`
--

LOCK TABLES `projectionResult` WRITE;
/*!40000 ALTER TABLE `projectionResult` DISABLE KEYS */;
/*!40000 ALTER TABLE `projectionResult` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `projectionYear`
--

DROP TABLE IF EXISTS `projectionYear`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `projectionYear` (
  `createdBy` varchar(255) DEFAULT NULL,
  `createdOn` datetime DEFAULT NULL,
  `editedBy` varchar(255) DEFAULT NULL,
  `editedOn` datetime DEFAULT NULL,
  `status` int NOT NULL DEFAULT '0',
  `id` int NOT NULL AUTO_INCREMENT,
  `year` int NOT NULL,
  `assessmentId` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FK_e958cca2567ef32db2242601100` (`assessmentId`),
  CONSTRAINT `FK_e958cca2567ef32db2242601100` FOREIGN KEY (`assessmentId`) REFERENCES `assessment` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `projectionYear`
--

LOCK TABLES `projectionYear` WRITE;
/*!40000 ALTER TABLE `projectionYear` DISABLE KEYS */;
INSERT INTO `projectionYear` VALUES (NULL,NULL,NULL,NULL,0,9,2025,55),(NULL,NULL,NULL,NULL,0,10,2020,60);
/*!40000 ALTER TABLE `projectionYear` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `projectstatus`
--

DROP TABLE IF EXISTS `projectstatus`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `projectstatus` (
  `createdBy` varchar(255) DEFAULT NULL,
  `createdOn` datetime DEFAULT NULL,
  `editedBy` varchar(255) DEFAULT NULL,
  `editedOn` datetime DEFAULT NULL,
  `status` int NOT NULL DEFAULT '0',
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) DEFAULT NULL,
  `description` varchar(2500) DEFAULT NULL,
  `sortOrder` int NOT NULL DEFAULT '1',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `projectstatus`
--

LOCK TABLES `projectstatus` WRITE;
/*!40000 ALTER TABLE `projectstatus` DISABLE KEYS */;
INSERT INTO `projectstatus` VALUES (NULL,NULL,NULL,NULL,0,1,'Planned','Planned',1),(NULL,NULL,NULL,NULL,0,2,'Adopted','Adopted',1),(NULL,NULL,NULL,NULL,0,3,'Implemented','Implemented',1);
/*!40000 ALTER TABLE `projectstatus` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `report`
--

DROP TABLE IF EXISTS `report`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `report` (
  `createdBy` varchar(255) DEFAULT NULL,
  `createdOn` datetime DEFAULT NULL,
  `editedBy` varchar(255) DEFAULT NULL,
  `editedOn` datetime DEFAULT NULL,
  `status` int NOT NULL DEFAULT '0',
  `id` int NOT NULL AUTO_INCREMENT,
  `reportName` varchar(255) NOT NULL,
  `savedLocation` varchar(255) NOT NULL,
  `description` varchar(255) DEFAULT NULL,
  `isPublish` int DEFAULT NULL,
  `thumbnail` varchar(255) NOT NULL DEFAULT 'https://act.campaign.gov.uk/wp-content/uploads/sites/25/2017/02/form_icon-1.jpg',
  `countryId` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FK_4573f1195dcb7fce0638e5ec239` (`countryId`),
  CONSTRAINT `FK_4573f1195dcb7fce0638e5ec239` FOREIGN KEY (`countryId`) REFERENCES `country` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `report`
--

LOCK TABLES `report` WRITE;
/*!40000 ALTER TABLE `report` DISABLE KEYS */;
/*!40000 ALTER TABLE `report` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `reportNdc`
--

DROP TABLE IF EXISTS `reportNdc`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `reportNdc` (
  `createdBy` varchar(255) DEFAULT NULL,
  `createdOn` datetime DEFAULT NULL,
  `editedBy` varchar(255) DEFAULT NULL,
  `editedOn` datetime DEFAULT NULL,
  `status` int NOT NULL DEFAULT '0',
  `id` int NOT NULL AUTO_INCREMENT,
  `reportId` int DEFAULT NULL,
  `ndcId` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FK_43ce546ecc5241d8c38d41aec5a` (`reportId`),
  KEY `FK_02b2a43c28a22e3b351587301a6` (`ndcId`),
  CONSTRAINT `FK_02b2a43c28a22e3b351587301a6` FOREIGN KEY (`ndcId`) REFERENCES `ndc` (`id`),
  CONSTRAINT `FK_43ce546ecc5241d8c38d41aec5a` FOREIGN KEY (`reportId`) REFERENCES `report` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `reportNdc`
--

LOCK TABLES `reportNdc` WRITE;
/*!40000 ALTER TABLE `reportNdc` DISABLE KEYS */;
/*!40000 ALTER TABLE `reportNdc` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `reportProject`
--

DROP TABLE IF EXISTS `reportProject`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `reportProject` (
  `createdBy` varchar(255) DEFAULT NULL,
  `createdOn` datetime DEFAULT NULL,
  `editedBy` varchar(255) DEFAULT NULL,
  `editedOn` datetime DEFAULT NULL,
  `status` int NOT NULL DEFAULT '0',
  `id` int NOT NULL AUTO_INCREMENT,
  `reportId` int DEFAULT NULL,
  `projectId` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FK_1615ee91999fd44da5cb1610142` (`reportId`),
  KEY `FK_3761f44e3888c5dd5b1ccabf3a1` (`projectId`),
  CONSTRAINT `FK_1615ee91999fd44da5cb1610142` FOREIGN KEY (`reportId`) REFERENCES `report` (`id`),
  CONSTRAINT `FK_3761f44e3888c5dd5b1ccabf3a1` FOREIGN KEY (`projectId`) REFERENCES `climateAction` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `reportProject`
--

LOCK TABLES `reportProject` WRITE;
/*!40000 ALTER TABLE `reportProject` DISABLE KEYS */;
/*!40000 ALTER TABLE `reportProject` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `reportSector`
--

DROP TABLE IF EXISTS `reportSector`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `reportSector` (
  `createdBy` varchar(255) DEFAULT NULL,
  `createdOn` datetime DEFAULT NULL,
  `editedBy` varchar(255) DEFAULT NULL,
  `editedOn` datetime DEFAULT NULL,
  `status` int NOT NULL DEFAULT '0',
  `id` int NOT NULL AUTO_INCREMENT,
  `reportId` int DEFAULT NULL,
  `sectorId` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FK_87154fc20105ab308522047e9dc` (`reportId`),
  KEY `FK_ab294ea2344b51c8195d0264bab` (`sectorId`),
  CONSTRAINT `FK_87154fc20105ab308522047e9dc` FOREIGN KEY (`reportId`) REFERENCES `report` (`id`),
  CONSTRAINT `FK_ab294ea2344b51c8195d0264bab` FOREIGN KEY (`sectorId`) REFERENCES `sector` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `reportSector`
--

LOCK TABLES `reportSector` WRITE;
/*!40000 ALTER TABLE `reportSector` DISABLE KEYS */;
/*!40000 ALTER TABLE `reportSector` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `report_assessment`
--

DROP TABLE IF EXISTS `report_assessment`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `report_assessment` (
  `createdBy` varchar(255) DEFAULT NULL,
  `createdOn` datetime DEFAULT NULL,
  `editedBy` varchar(255) DEFAULT NULL,
  `editedOn` datetime DEFAULT NULL,
  `status` int NOT NULL DEFAULT '0',
  `id` int NOT NULL AUTO_INCREMENT,
  `reportId` int DEFAULT NULL,
  `assessmentId` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FK_21bf6ee02e608c1ee1705683833` (`reportId`),
  KEY `FK_c444bfdcc0cd5177ac741a3c5e5` (`assessmentId`),
  CONSTRAINT `FK_21bf6ee02e608c1ee1705683833` FOREIGN KEY (`reportId`) REFERENCES `report` (`id`),
  CONSTRAINT `FK_c444bfdcc0cd5177ac741a3c5e5` FOREIGN KEY (`assessmentId`) REFERENCES `assessment` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `report_assessment`
--

LOCK TABLES `report_assessment` WRITE;
/*!40000 ALTER TABLE `report_assessment` DISABLE KEYS */;
/*!40000 ALTER TABLE `report_assessment` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `sector`
--

DROP TABLE IF EXISTS `sector`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `sector` (
  `createdBy` varchar(255) DEFAULT NULL,
  `createdOn` datetime DEFAULT NULL,
  `editedBy` varchar(255) DEFAULT NULL,
  `editedOn` datetime DEFAULT NULL,
  `status` int NOT NULL DEFAULT '0',
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) DEFAULT NULL,
  `description` varchar(300) DEFAULT NULL,
  `sortOrder` int NOT NULL DEFAULT '1',
  `emissionSummary` varchar(255) NOT NULL,
  `ndcDocuments` varchar(255) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sector`
--

LOCK TABLES `sector` WRITE;
/*!40000 ALTER TABLE `sector` DISABLE KEYS */;
INSERT INTO `sector` VALUES (NULL,NULL,NULL,NULL,0,1,'Transport','Transport',1,'0','0');
/*!40000 ALTER TABLE `sector` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `sub-sector`
--

DROP TABLE IF EXISTS `sub-sector`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `sub-sector` (
  `createdBy` varchar(255) DEFAULT NULL,
  `createdOn` datetime DEFAULT NULL,
  `editedBy` varchar(255) DEFAULT NULL,
  `editedOn` datetime DEFAULT NULL,
  `status` int NOT NULL DEFAULT '0',
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) DEFAULT NULL,
  `description` varchar(300) DEFAULT NULL,
  `sortOrder` int NOT NULL DEFAULT '1',
  `sectorId` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FK_ac74d5f5215ab743bc498899c2c` (`sectorId`),
  CONSTRAINT `FK_ac74d5f5215ab743bc498899c2c` FOREIGN KEY (`sectorId`) REFERENCES `sector` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sub-sector`
--

LOCK TABLES `sub-sector` WRITE;
/*!40000 ALTER TABLE `sub-sector` DISABLE KEYS */;
/*!40000 ALTER TABLE `sub-sector` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `sub_ndc`
--

DROP TABLE IF EXISTS `sub_ndc`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `sub_ndc` (
  `createdBy` varchar(255) DEFAULT NULL,
  `createdOn` datetime DEFAULT NULL,
  `editedBy` varchar(255) DEFAULT NULL,
  `editedOn` datetime DEFAULT NULL,
  `status` int NOT NULL DEFAULT '0',
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) DEFAULT NULL,
  `description` varchar(2500) DEFAULT NULL,
  `sortOrder` int NOT NULL DEFAULT '1',
  `ndcId` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FK_743d909fa9717fcd224725adc85` (`ndcId`),
  CONSTRAINT `FK_743d909fa9717fcd224725adc85` FOREIGN KEY (`ndcId`) REFERENCES `ndc` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sub_ndc`
--

LOCK TABLES `sub_ndc` WRITE;
/*!40000 ALTER TABLE `sub_ndc` DISABLE KEYS */;
INSERT INTO `sub_ndc` VALUES ('-','2022-02-24 18:32:15','-','2022-02-24 18:32:28',1,1,'sub NDC 1','des',1,1),('-','2022-02-24 18:32:15','-','2022-02-24 18:32:28',1,2,'sub NDC 2','des',1,2),('-','2022-02-28 11:31:18','-','2022-02-28 11:31:18',0,3,'Introduce fuel-based tax',NULL,1,NULL),('-','2022-03-03 07:23:58','-','2022-03-03 07:23:58',0,4,'ndc',NULL,1,NULL),('-','2022-03-03 07:48:26','-','2022-03-03 07:48:47',0,7,' Increase tax concessions for electric & hybrid vehicles','des',1,4),('-','2022-03-03 08:40:49','-','2022-03-03 08:40:49',0,8,'Tax & Duty concessions for batteries used for electric and hybrid vehicles after introducing a specific HS code',NULL,1,4);
/*!40000 ALTER TABLE `sub_ndc` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `trackClimateAction`
--

DROP TABLE IF EXISTS `trackClimateAction`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `trackClimateAction` (
  `createdBy` varchar(255) DEFAULT NULL,
  `createdOn` datetime DEFAULT NULL,
  `editedBy` varchar(255) DEFAULT NULL,
  `editedOn` datetime DEFAULT NULL,
  `status` int NOT NULL DEFAULT '0',
  `id` int NOT NULL AUTO_INCREMENT,
  `climateActionName` varchar(255) NOT NULL,
  `description` varchar(255) DEFAULT NULL,
  `objective` varchar(500) DEFAULT NULL,
  `trackcaStatus` varchar(255) DEFAULT NULL,
  `sector` varchar(255) DEFAULT NULL,
  `gassesAffected` varchar(255) DEFAULT NULL,
  `startYearImplementation` int DEFAULT NULL,
  `achieved` int DEFAULT NULL,
  `expected` int DEFAULT NULL,
  `years` varchar(255) DEFAULT NULL,
  `instrument` varchar(255) DEFAULT NULL,
  `implementingEntities` varchar(255) DEFAULT NULL,
  `climateActionId` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `REL_6baac9e88dcf6baf3a0e39c8c0` (`climateActionId`),
  CONSTRAINT `FK_6baac9e88dcf6baf3a0e39c8c0d` FOREIGN KEY (`climateActionId`) REFERENCES `climateAction` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `trackClimateAction`
--

LOCK TABLES `trackClimateAction` WRITE;
/*!40000 ALTER TABLE `trackClimateAction` DISABLE KEYS */;
INSERT INTO `trackClimateAction` VALUES ('','2022-03-03 06:50:09','','2022-03-03 06:50:09',0,1,'Purchase 50 LNG buses to the SLTB',NULL,'1. To reduce the tail pipe emission\n2. Promote public  transportation system\n','planned','Transport','CO2',2020,0,0,'2024','regulatory','-',3);
/*!40000 ALTER TABLE `trackClimateAction` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `unit_conversion`
--

DROP TABLE IF EXISTS `unit_conversion`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `unit_conversion` (
  `createdBy` varchar(255) DEFAULT NULL,
  `createdOn` datetime DEFAULT NULL,
  `editedBy` varchar(255) DEFAULT NULL,
  `editedOn` datetime DEFAULT NULL,
  `status` int NOT NULL DEFAULT '0',
  `id` int NOT NULL AUTO_INCREMENT,
  `fromUnit` varchar(255) NOT NULL,
  `toUnit` varchar(255) NOT NULL,
  `conversionFactor` decimal(10,6) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `unit_conversion`
--

LOCK TABLES `unit_conversion` WRITE;
/*!40000 ALTER TABLE `unit_conversion` DISABLE KEYS */;
INSERT INTO `unit_conversion` VALUES (NULL,NULL,NULL,NULL,0,1,'TJ','TJ',1.000000),(NULL,NULL,NULL,NULL,0,2,'%','%',1.000000),(NULL,NULL,NULL,NULL,0,3,'t-CO2/TJ','t-CO2/TJ',1.000000),(NULL,NULL,NULL,NULL,0,4,'km','km',1.000000),(NULL,NULL,NULL,NULL,0,5,'fuel/km','fuel/km',1.000000),(NULL,NULL,NULL,NULL,0,6,'t/y','t/y',1.000000),(NULL,NULL,NULL,NULL,0,7,'passengers or tons','passengers or tons',1.000000),(NULL,NULL,NULL,NULL,0,8,'TJ/t','TJ/t',1.000000),(NULL,NULL,NULL,NULL,0,9,'population','population',1.000000),(NULL,NULL,NULL,NULL,0,10,'$','$',1.000000),(NULL,NULL,NULL,NULL,0,11,'passengers','passengers',1.000000),(NULL,NULL,NULL,NULL,0,12,'t-CO2/MWh','t-CO2/MWh',1.000000);
/*!40000 ALTER TABLE `unit_conversion` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user`
--

DROP TABLE IF EXISTS `user`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user` (
  `createdBy` varchar(255) DEFAULT NULL,
  `createdOn` datetime DEFAULT NULL,
  `editedBy` varchar(255) DEFAULT NULL,
  `editedOn` datetime DEFAULT NULL,
  `status` int NOT NULL DEFAULT '0',
  `id` int NOT NULL AUTO_INCREMENT,
  `firstName` varchar(255) NOT NULL,
  `lastName` varchar(255) NOT NULL,
  `username` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `telephone` varchar(255) NOT NULL,
  `mobile` varchar(255) NOT NULL,
  `designation` varchar(255) DEFAULT NULL,
  `salt` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `resetToken` varchar(255) NOT NULL,
  `deletedAt` datetime(6) DEFAULT NULL,
  `canNotDelete` tinyint NOT NULL DEFAULT '0',
  `userTypeId` int DEFAULT NULL,
  `institutionId` int DEFAULT NULL,
  `countryId` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `IDX_78a916df40e02a9deb1c4b75ed` (`username`),
  UNIQUE KEY `IDX_e12875dfb3b1d92d7d7c5377e2` (`email`),
  KEY `FK_29f29dffce2845a1abc901d4e85` (`userTypeId`),
  KEY `FK_ca0de218397aed2409d865d1580` (`institutionId`),
  KEY `FK_4aaf6d02199282eb8d3931bff31` (`countryId`),
  CONSTRAINT `FK_29f29dffce2845a1abc901d4e85` FOREIGN KEY (`userTypeId`) REFERENCES `user_type` (`id`),
  CONSTRAINT `FK_4aaf6d02199282eb8d3931bff31` FOREIGN KEY (`countryId`) REFERENCES `country` (`id`),
  CONSTRAINT `FK_ca0de218397aed2409d865d1580` FOREIGN KEY (`institutionId`) REFERENCES `institution` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=37 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user`
--

LOCK TABLES `user` WRITE;
/*!40000 ALTER TABLE `user` DISABLE KEYS */;
INSERT INTO `user` VALUES ('-','2022-02-22 13:51:07','-','2022-02-22 13:51:07',0,1,'Buddika','Hemashantha','country_admin1@climatesi.com','country_admin1@climatesi.com','+23 45-678-9345','+23 45-678-9456',NULL,'$2b$10$YOm.2THiexcF7sLVHUwkxO','$2b$10$YOm.2THiexcF7sLVHUwkxOFFe.l4EMOx9h65k0ZqHVU0J9iQp8lFG','',NULL,0,1,1,1),('-','2022-02-22 16:04:49','-','2022-02-22 16:04:49',0,4,'Anuradha','Dissanayake','verifier1@climatesi.com','verifier1@climatesi.com','+23 45-678-9345','+23 45-678-9456',NULL,'$2b$10$XoFj3pENnnZo1EHh38jpxu','$2b$10$XoFj3pENnnZo1EHh38jpxukeP590KwiE0wjZQm1ZCE4TxospJMi3W','',NULL,0,2,1,1),('-','2022-02-22 16:05:37','-','2022-02-22 16:05:37',0,5,'Indike','Dassanayake','verifier2@climatesi.com','verifier2@climatesi.com','+23 45-678-9345','+23 45-678-9456',NULL,'$2b$10$x8nh274vVj0XmBwqNOZXMO','$2b$10$x8nh274vVj0XmBwqNOZXMO4u1AVwbRZFmX5obNOaeEkafYeG2gOA6','',NULL,0,2,1,1),('-','2022-02-22 16:06:37','-','2022-02-22 16:06:37',0,6,'Ovindu','Wijethunga','sectoradmin1@climatesi.com','sectoradmin1@climatesi.com','+23 45-678-9345','+23 45-678-9456',NULL,'$2b$10$lYSw5TFJSsz4em2f97HZ9.','$2b$10$lYSw5TFJSsz4em2f97HZ9.x1jneMX7zIJPC45wooB8MhXfHcJtrxy','',NULL,0,3,2,1),('-','2022-02-22 16:08:04','-','2022-02-22 16:08:04',0,7,'Wasundara','Samarawickrama','insadmin1@climatesi.com','insadmin1@climatesi.com','+23 45-678-9345','+23 45-678-9456',NULL,'$2b$10$Zx/kARiLvE/Um8NciFT0Y.','$2b$10$Zx/kARiLvE/Um8NciFT0Y.1NfgOUIl6dTyHvtnd88Xq9K..ZlnAzu','',NULL,0,8,3,1),('-','2022-02-22 16:09:16','-','2022-02-22 16:09:16',0,8,'Nilni','Malsha','dataentry1@climatesi.com','dataentry1@climatesi.com','+23 45-678-9345','+23 45-678-9456',NULL,'$2b$10$kOOcsseml.5kQngwy0i32O','$2b$10$kOOcsseml.5kQngwy0i32O5xhqeRCbGnZJXv.pP5PHw8hMJab5ALq','',NULL,0,9,3,1),('-','2022-02-22 16:10:32','-','2022-02-22 16:10:32',0,9,'Pasindu','Jayasinghe','mrvadmin1@climatesi.com','mrvadmin1@climatesi.com','+23 45-678-9345','+23 45-678-9456',NULL,'$2b$10$6CTWEelDu.IS9AUP1B1J8O','$2b$10$6CTWEelDu.IS9AUP1B1J8OMYLdJwKSFNycQvIWzk6Gd8ENCZdvtVe','',NULL,0,4,2,1),('-','2022-02-22 16:11:26','-','2022-02-22 16:11:26',0,10,'Sivabalan','Piriyanthan','datacollect1@climatesi.com','datacollect1@climatesi.com','+23 45-678-9345','+23 45-678-9456',NULL,'$2b$10$ecXNqeVx5K.K2BwVjLIOve','$2b$10$ecXNqeVx5K.K2BwVjLIOve2nG.znFDtjIkrP/rqCCQvjZ3p2nwUj6','',NULL,0,6,7,1),('-','2022-02-22 16:12:00','-','2022-02-22 16:12:00',0,11,'Kashul','Hindagoda','qcteam@climatesi.com','qcteam@climatesi.com','+23 45-678-9345','+23 45-678-9456',NULL,'$2b$10$Qb2oSQhs4HGoWT9SbwZDw.','$2b$10$Qb2oSQhs4HGoWT9SbwZDw.qnPFbE23HqYgB0DNlrb8Zte4rveIF2C','',NULL,0,7,8,1),('-','2022-02-22 16:12:42','-','2022-02-22 16:12:42',0,12,'Pradeep','Ranasinghe','technicalteam@climatesi.com','technicalteam@climatesi.com','+23 45-678-9345','+23 45-678-9456',NULL,'$2b$10$8fbwaI76P5sGZR5ZyhPFae','$2b$10$8fbwaI76P5sGZR5ZyhPFae4e6xpeSjL0VGPw1CmgZVbo6V2LPwh2.','',NULL,0,5,6,1),('-','2022-02-25 14:36:32','-','2022-02-25 14:36:32',0,13,'Nimal','Siripala','nimal@gmail.com','nimal@gmail.com','+94 41-222-0356','+94 71-404-7715',NULL,'$2b$10$qBcMhiOvMgmxiz5TO2dgZe','$2b$10$qBcMhiOvMgmxiz5TO2dgZe86pFck6bqZTE9kzAe2eb5.YBYC6t0Wy','',NULL,0,8,10,1),('-','2022-02-25 14:39:57','-','2022-02-25 14:39:57',0,14,'Saman','Perera','saman@gmail.com','saman@gmail.com','+94 11-203-5654','+94 71-381-3586',NULL,'$2b$10$vFcd/3c.2Za4qfs6uq9FiO','$2b$10$vFcd/3c.2Za4qfs6uq9FiOth80PCIsKhlgWnOFzQJrvVjruPu.NsC','',NULL,0,9,10,1),('-','2022-02-26 04:36:14','-','2022-02-26 04:36:14',0,15,'Petroleum','Corporation','PC@gmail.com','PC@gmail.com','+94 71-564-2990','+94 71-564-2990',NULL,'$2b$10$b23xwtyqZtDg8n9Q73OZX.','$2b$10$b23xwtyqZtDg8n9Q73OZX.2zy4ey7l8.cF/SyZtdeqGa83EGZ4wlu','',NULL,0,8,11,1),('-','2022-02-26 04:37:55','-','2022-02-26 04:37:55',0,16,'Petroleum DEO','Corporation','pcdeo@gmail.com','pcdeo@gmail.com','+94 71-564-2990','+94 71-564-2990',NULL,'$2b$10$YOm.2THiexcF7sLVHUwkxO','$10$YOm.2THiexcF7sLVHUwkxOFFe.l4EMOx9h65k0ZqHVU0J9iQp8lFG','',NULL,0,9,11,1),('-','2022-02-26 04:38:33','-','2022-02-26 04:38:33',0,17,'Road','Authority','RDA@gmail.com','RDA@gmail.com','+94 71-562-5990','+94 71-562-5990',NULL,'$2b$10$XD48C1hfVLCgAshzJvYZcO','$2b$10$XD48C1hfVLCgAshzJvYZcOxP0TP4PFtTky1kcK3Juh0vV24B9t4PC','',NULL,0,8,12,1),('-','2022-02-26 04:39:24','-','2022-02-26 04:39:24',0,18,'Road DEO','Authority','RDAdeo@gmail.com','RDAdeo@gmail.com','+94 71-562-5990','+94 71-562-5990',NULL,'$2b$10$G/Mg4965VQw7SzgqGF0HWO','$2b$10$G/Mg4965VQw7SzgqGF0HWO/X9Eu/XEGEv9iHUnNpi1IwyDZCdSaii','',NULL,0,9,12,1),('-','2022-02-27 06:07:04','-','2022-02-27 06:07:04',0,19,'Kithsiri',' Bulathgama','kithsiri@energy.gov.lk','kithsiri@energy.gov.lk','+94 11-257-5114','+94 70-354-8874',NULL,'$2b$10$TEFOe1w60cA6QG8.cgTMlu','$2b$10$TEFOe1w60cA6QG8.cgTMluKo5rCmJOHW/VQUzV7RlBKvjcJ.Y7LWG','',NULL,0,9,13,1),('-','2022-02-27 13:08:18','-','2022-02-27 13:08:18',0,20,'Sahan ','Bandara','Sahan@ngr.com','Sahan@ngr.com','+25 63-458-9632','+58 96-325-4782',NULL,'$2b$10$Y.eE/uNmKez0eZd6tDYPXu','$2b$10$Y.eE/uNmKez0eZd6tDYPXu.nJvhldOh2jRfLarl4ELZ4zhmR/CaVy','',NULL,0,9,14,1),('-','2022-02-27 13:09:23','-','2022-02-27 13:09:23',0,21,'Lasan ','Lakshitha','Lasan@ngr.com','Lasan@ngr.com','+45 63-289-3214','+47 58-963-2558',NULL,'$2b$10$/o4oWg/PXQSPhrM1pZxEzO','$2b$10$/o4oWg/PXQSPhrM1pZxEzOv3aUrU.HmCYMPKMQbydOQdGBpT3DXZi','',NULL,0,6,18,1),('-','2022-02-27 13:10:15','-','2022-02-27 13:10:15',0,22,'Lakshi ','Dineshi','Lakshi@ngr.com','Lakshi@ngr.com','+52 63-985-6324','+56 89-325-4872',NULL,'$2b$10$OMNDiqNd5TBKgKUFvWLPYe','$2b$10$OMNDiqNd5TBKgKUFvWLPYeTa7VK2/nR205uc7xPGBdRYElq0/RU2i','',NULL,0,3,17,1),('-','2022-02-27 13:11:12','-','2022-02-27 13:11:12',0,23,'Chathu','Bandara','Chathu@ngr.com','Chathu@ngr.com','+25 36-987-5412','+25 63-987-4125',NULL,'$2b$10$cUjsQ5uIBMvGtXiUzDd22O','$2b$10$cUjsQ5uIBMvGtXiUzDd22O1RBjPn6gd49OT3bzAdqZr7DayvVj952','',NULL,0,9,16,1),('-','2022-02-28 15:35:41','-','2022-02-28 15:35:41',0,24,'Nimesh','rashmika','nimesh@ngr.com','nimesh@ngr.com','+25 36-987-4235','+36 59-874-5336',NULL,'$2b$10$.G1Izeh3RWvEh7eMqbW8au','$2b$10$.G1Izeh3RWvEh7eMqbW8auqY38l2FTDvxXMZln8OFHXHZb2J.27h.','',NULL,0,9,16,1),('-','2022-03-03 06:46:27','-','2022-03-03 06:46:27',0,25,'fname','lname','joe@gm.com','joe@gm.com','+94 12-345-6789','+94 12-345-6789',NULL,'$2b$10$9udOmX8uMpknLGg7qeGYve','$2b$10$9udOmX8uMpknLGg7qeGYve6Rdia78I29Z0Qe5gKjkFiCf9mMKxdni','',NULL,0,6,7,1),('-','2022-03-03 07:57:41','-','2022-03-03 07:57:41',0,26,'Poorna ','Perera','poorna@ngr.com','poorna@ngr.com','+25 36-987-4523','+52 63-987-4125',NULL,'$2b$10$Y.eE/uNmKez0eZd6tDYPXu','$2b$10$Y.eE/uNmKez0eZd6tDYPXu.nJvhldOh2jRfLarl4ELZ4zhmR/CaVy','',NULL,0,9,14,1),('-','2022-03-03 08:12:36','-','2022-03-03 08:12:36',0,27,'Praneeth','Withana','Praneeth@ngr.com','Praneeth@ngr.com','+36 98-524-4788','+56 98-745-6324',NULL,'$2b$10$viwUeHjikq1fLVy5XTBb0.','$2b$10$viwUeHjikq1fLVy5XTBb0.fxZ24M0Zyjk17psTJXq5zkJ6GRDw6.m','',NULL,0,6,18,1),('-','2022-03-03 08:16:22','-','2022-03-03 08:16:22',0,28,'Madhawi','Wasana','madhawi@ngr.com','madhawi@ngr.com','+56 98-745-2368','+56 98-745-6325',NULL,'$2b$10$GFw1In7KBChB5avqv8IDVu','$2b$10$GFw1In7KBChB5avqv8IDVucGcoR3Z86FvhKb.F1zbap0P4qfg0aYa','',NULL,0,4,17,1),('-','2022-03-03 08:17:33','-','2022-03-03 08:17:33',0,29,'Anusha','Dilhani','anusha@ngr.com','anusha@ngr.com','+45 69-874-5236','+56 98-745-6321',NULL,'$2b$10$N2UyJq.mGolIgBn8ACZGFO','$2b$10$N2UyJq.mGolIgBn8ACZGFOnjM02AlbN4mqsGmc1OtpND5Keqw6f0C','',NULL,0,8,16,1),('-','2022-03-03 08:53:39','-','2022-03-03 08:53:39',0,30,'Pasan','Anushanga','pasan@climatesi.com','pasan@climatesi.com','+07 10-892-1901','+07 10-892-1901',NULL,'$2b$10$xcXSRUB7rrrtCxw5.Y83pu','$2b$10$xcXSRUB7rrrtCxw5.Y83pu4.uRFGsX5f.0kV7HqmJK0eRXH.PIr56','',NULL,0,9,13,1),('-','2022-03-03 09:01:28','-','2022-03-03 09:01:28',0,31,'Admin','SEA','adminsea@gov.lk','adminsea@gov.lk','+12 21-129-0991','+72 21-129-0991',NULL,'$2b$10$RFzwiMh5qH5gblHAQgU4Ee','$2b$10$RFzwiMh5qH5gblHAQgU4Eezud2ORGYCB5VtiRxNPmk8DqeYqTh2gC','',NULL,0,8,13,1),('-','2022-03-03 09:14:21','-','2022-03-03 09:14:21',0,32,'Admin','Finance_Data provider 3','admindataprovider3@gov.lk','admindataprovider3@gov.lk','+11 33-290-9912','+78 33-290-9912',NULL,'$2b$10$iXX6nmoF.Ua.RTosx1sIJO','$2b$10$iXX6nmoF.Ua.RTosx1sIJOh9nwZlekuhAUPKuXqpQJMel7rI91JK2','',NULL,0,8,5,1),('-','2022-03-03 09:17:58','-','2022-03-03 09:17:58',0,33,'DEO','Data Provider 3','deodataprovider3@gov.lk','deodataprovider3@gov.lk','+94 38-300-9988','+94 29-300-9988',NULL,'$2b$10$o4//81RRLQhr7C7X0oIXmO','$2b$10$o4//81RRLQhr7C7X0oIXmOHLkz1Rrpfg94yBcykhj/CJT.TmObYTG','',NULL,0,9,5,1),('-','2022-03-03 10:10:54','-','2022-03-03 10:10:54',0,34,'Sunimal','Perera','sunimal@gmail.com','sunimal@gmail.com','+94 71-404-7715','+94 71-404-7715',NULL,'$2b$10$GOrtkkIEA9fzDUPdmxLug.','$2b$10$GOrtkkIEA9fzDUPdmxLug.tOOgugRAq8VcwQcoG.iY22E0hcHcTSm','',NULL,0,2,1,1),('-','2022-03-03 11:02:05','-','2022-03-03 11:02:05',0,35,'Nirman ','Perera','nirman@ngr.com','nirman@ngr.com','+25 63-896-3255','+68 95-321-4563',NULL,'$2b$10$wal1aSXjehqGbWuVbK4B9O','$2b$10$wal1aSXjehqGbWuVbK4B9OkLB/ANQk/ks2I/YXAr5NFnCf1H/n1/y','',NULL,0,8,14,1),('-','2022-03-03 11:03:27','-','2022-03-03 11:03:27',0,36,'Sepali','Wijesinghe','sepali@ngr.com','sepali@ngr.com','+52 63-548-9253','+25 39-874-5625',NULL,'$2b$10$XRqzD/l1mHMZiXOrM0ZYFe','$2b$10$XRqzD/l1mHMZiXOrM0ZYFepownk10qKVPsBnI.buAXVX.o6eaLecK','',NULL,0,9,16,1);
/*!40000 ALTER TABLE `user` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user_type`
--

DROP TABLE IF EXISTS `user_type`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user_type` (
  `createdBy` varchar(255) DEFAULT NULL,
  `createdOn` datetime DEFAULT NULL,
  `editedBy` varchar(255) DEFAULT NULL,
  `editedOn` datetime DEFAULT NULL,
  `status` int NOT NULL DEFAULT '0',
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) DEFAULT NULL,
  `description` varchar(2500) DEFAULT NULL,
  `sortOrder` int NOT NULL DEFAULT '1',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user_type`
--

LOCK TABLES `user_type` WRITE;
/*!40000 ALTER TABLE `user_type` DISABLE KEYS */;
INSERT INTO `user_type` VALUES (NULL,NULL,NULL,NULL,0,1,'Country Admin','Country Admin',1),(NULL,NULL,NULL,NULL,0,2,'Verifier','Verifier',2),(NULL,NULL,NULL,NULL,0,3,'Sector Admin','Sector Admin',3),(NULL,NULL,NULL,NULL,0,4,'MRV Admin','MRV Admin',4),(NULL,NULL,NULL,NULL,0,5,'Technical Team','Technical Team',5),(NULL,NULL,NULL,NULL,0,6,'Data Collection Team','Data Collection Team',6),(NULL,NULL,NULL,NULL,0,7,'QC Team','QC Team',7),(NULL,NULL,NULL,NULL,0,8,'Institution Admin','Institution Admin',8),(NULL,NULL,NULL,NULL,0,9,'Data Entry Operator','Data Entry Operator',9);
/*!40000 ALTER TABLE `user_type` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `verificationDetail`
--

DROP TABLE IF EXISTS `verificationDetail`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `verificationDetail` (
  `createdBy` varchar(255) DEFAULT NULL,
  `createdOn` datetime DEFAULT NULL,
  `editedBy` varchar(255) DEFAULT NULL,
  `editedOn` datetime DEFAULT NULL,
  `status` int NOT NULL DEFAULT '0',
  `id` int NOT NULL AUTO_INCREMENT,
  `year` int NOT NULL,
  `assessmentId` int NOT NULL,
  `updatedDate` datetime DEFAULT NULL,
  `rootCause` varchar(255) DEFAULT NULL,
  `explanation` varchar(255) DEFAULT NULL,
  `correctiveAction` varchar(255) DEFAULT NULL,
  `action` varchar(255) DEFAULT NULL,
  `isAccepted` tinyint NOT NULL,
  `isNDC` tinyint NOT NULL DEFAULT '0',
  `isMethodology` tinyint NOT NULL DEFAULT '0',
  `isBaseline` tinyint NOT NULL DEFAULT '0',
  `isProject` tinyint NOT NULL DEFAULT '0',
  `isLekage` tinyint NOT NULL DEFAULT '0',
  `isProjection` tinyint NOT NULL DEFAULT '0',
  `isResult` tinyint NOT NULL DEFAULT '0',
  `isDataRequested` tinyint NOT NULL DEFAULT '0',
  `verificationStatus` int DEFAULT NULL,
  `verificationStage` int NOT NULL DEFAULT '1',
  `userVerifier` int DEFAULT NULL,
  `assessmentYearId` int DEFAULT NULL,
  `parameterId` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FK_3f44853a3143c25338eac826b20` (`assessmentYearId`),
  KEY `FK_a43b0a788bdea978049ff34837a` (`parameterId`),
  CONSTRAINT `FK_3f44853a3143c25338eac826b20` FOREIGN KEY (`assessmentYearId`) REFERENCES `assessmentYear` (`id`),
  CONSTRAINT `FK_a43b0a788bdea978049ff34837a` FOREIGN KEY (`parameterId`) REFERENCES `parameter` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=63 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `verificationDetail`
--

LOCK TABLES `verificationDetail` WRITE;
/*!40000 ALTER TABLE `verificationDetail` DISABLE KEYS */;
/*!40000 ALTER TABLE `verificationDetail` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2022-03-03 19:30:58
