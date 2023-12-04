-- MySQL dump 10.13  Distrib 8.0.34, for Win64 (x86_64)
--
-- Host: 34.159.80.10    Database: icat_country
-- ------------------------------------------------------
-- Server version	8.0.31-google

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
SET @MYSQLDUMP_TEMP_LOG_BIN = @@SESSION.SQL_LOG_BIN;
SET @@SESSION.SQL_LOG_BIN= 0;

--
-- GTID state at the beginning of the backup 
--

SET @@GLOBAL.GTID_PURGED=/*!80000 '+'*/ '5717ce23-36b0-11ee-8e76-42010a400006:1-1982606';

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
) ENGINE=InnoDB AUTO_INCREMENT=39 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

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
  `uniqueIdentification` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=18 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `assesment_applicability_applicability`
--

DROP TABLE IF EXISTS `assesment_applicability_applicability`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `assesment_applicability_applicability` (
  `assesmentId` int NOT NULL,
  `applicabilityId` int NOT NULL,
  PRIMARY KEY (`assesmentId`,`applicabilityId`),
  KEY `IDX_2b1d8641b4ac0095f5c4a1acb8` (`assesmentId`),
  KEY `IDX_899cf5b6ae66de5a2f715f2c98` (`applicabilityId`),
  CONSTRAINT `FK_899cf5b6ae66de5a2f715f2c987` FOREIGN KEY (`applicabilityId`) REFERENCES `applicability` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

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
  `assessmentStatus` int NOT NULL DEFAULT '0',
  `assessmentType` varchar(255) DEFAULT NULL,
  `emmisionReductionValue` int DEFAULT NULL,
  `macValue` int DEFAULT NULL,
  `baselineScenario` text,
  `projectScenario` text,
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
  `ghgAssessTypeForMac` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FK_931a485488275ee306fde6f089c` (`countryId`),
  KEY `FK_6195d7baa268a1a0df1d8890b4d` (`methodologyId`),
  KEY `FK_95c69761e5ad360968c52a4c6af` (`userId`),
  KEY `FK_ba63a30d14e147471a76b8650a1` (`ndcId`),
  KEY `FK_2866c64bc8d4a949fe1953246bc` (`subNdcId`)
) ENGINE=InnoDB AUTO_INCREMENT=1659 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

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
) ENGINE=InnoDB AUTO_INCREMENT=1582 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

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
  `baselineResult` bigint DEFAULT NULL,
  `baselineResultUnit` varchar(255) DEFAULT NULL,
  `projectResult` bigint DEFAULT NULL,
  `projectResultUnit` varchar(255) DEFAULT NULL,
  `lekageResult` bigint DEFAULT NULL,
  `lekageResultUnit` varchar(255) DEFAULT NULL,
  `totalEmission` bigint DEFAULT NULL,
  `totalEmissionUnit` varchar(255) DEFAULT NULL,
  `bsTotalAnnualCost` int DEFAULT NULL,
  `psTotalAnnualCost` int DEFAULT NULL,
  `costDifference` int DEFAULT NULL,
  `macResult` int DEFAULT NULL,
  `qcComment` varchar(255) DEFAULT NULL,
  `qcStatusBaselineResult` bigint DEFAULT NULL,
  `qcStatuProjectResult` bigint DEFAULT NULL,
  `qcStatusLekageResult` bigint DEFAULT NULL,
  `qcStatusTotalEmission` bigint DEFAULT NULL,
  `assessmentYearId` int DEFAULT NULL,
  `assessmentId` int DEFAULT NULL,
  `qcStatusmacResult` int DEFAULT NULL,
  `qcStatuscostDifference` int DEFAULT NULL,
  `qcStatuspsTotalAnnualCost` int DEFAULT NULL,
  `qcStatusbsTotalAnnualCost` int DEFAULT NULL,
  `isResultupdated` tinyint DEFAULT NULL,
  `isResultRecalculating` tinyint DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `REL_2abaf0b68ee7cb1c55a5d51551` (`assessmentYearId`),
  KEY `FK_1df0eedfacc4a46a3811bf3de78` (`assessmentId`),
  CONSTRAINT `FK_1df0eedfacc4a46a3811bf3de78` FOREIGN KEY (`assessmentId`) REFERENCES `assessment` (`id`),
  CONSTRAINT `FK_2abaf0b68ee7cb1c55a5d515513` FOREIGN KEY (`assessmentYearId`) REFERENCES `assessmentYear` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=1081 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

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
  `assessmentAssumption` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FK_4ae20ec4ff6ca5b478ac31269a2` (`assessmentId`),
  CONSTRAINT `FK_4ae20ec4ff6ca5b478ac31269a2` FOREIGN KEY (`assessmentId`) REFERENCES `assessment` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=1624 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `assessment_assessment_objective_assessment_objective`
--

DROP TABLE IF EXISTS `assessment_assessment_objective_assessment_objective`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `assessment_assessment_objective_assessment_objective` (
  `assessmentId` int NOT NULL,
  `assessmentObjectiveId` int NOT NULL,
  PRIMARY KEY (`assessmentId`,`assessmentObjectiveId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

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
) ENGINE=InnoDB AUTO_INCREMENT=31940 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `caActionHistory`
--

DROP TABLE IF EXISTS `caActionHistory`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `caActionHistory` (
  `createdBy` varchar(255) DEFAULT NULL,
  `createdOn` datetime DEFAULT NULL,
  `editedBy` varchar(255) DEFAULT NULL,
  `editedOn` datetime DEFAULT NULL,
  `status` int NOT NULL DEFAULT '0',
  `id` int NOT NULL AUTO_INCREMENT,
  `isNdcAndSubNdc` int DEFAULT NULL,
  `isApprovalAction` int DEFAULT NULL,
  `previousNdcs` varchar(255) DEFAULT NULL,
  `currentNdcs` varchar(255) DEFAULT NULL,
  `previousSubNdcs` varchar(255) DEFAULT NULL,
  `currentSubNdcs` varchar(255) DEFAULT NULL,
  `previousAction` varchar(255) DEFAULT NULL,
  `currentAction` varchar(255) DEFAULT NULL,
  `projectId` int DEFAULT NULL,
  `actionUser` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=333 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

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
  `description` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci,
  `contactPersoFullName` varchar(50) DEFAULT NULL,
  `email` varchar(100) DEFAULT NULL,
  `contactPersonDesignation` varchar(30) DEFAULT NULL,
  `telephoneNumber` varchar(255) NOT NULL,
  `mobileNumber` varchar(255) DEFAULT NULL,
  `institution` varchar(50) DEFAULT NULL,
  `projectScope` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci,
  `acceptedDate` datetime DEFAULT NULL,
  `proposeDateofCommence` datetime NOT NULL,
  `duration` double NOT NULL DEFAULT '0',
  `baseScenarioProjectLife` int NOT NULL DEFAULT '0',
  `projectScenarioTotalInvestment` int NOT NULL DEFAULT '0',
  `baseScenarioTotalInvestment` int NOT NULL DEFAULT '0',
  `objective` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci,
  `subNationalLevl1` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci,
  `subNationalLevl2` varchar(255) DEFAULT NULL,
  `subNationalLevl3` varchar(255) DEFAULT NULL,
  `longitude` decimal(10,6) DEFAULT '0.000000',
  `latitude` decimal(10,6) DEFAULT '0.000000',
  `outcome` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci,
  `currentProgress` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci,
  `chgEmissions` varchar(255) DEFAULT NULL,
  `adaptationBenefits` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci,
  `directSDBenefit` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci,
  `indirectSDBenefit` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci,
  `implementingEntity` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci,
  `executingEntity` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci,
  `partiesInvolved` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci,
  `beneficiaries` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci,
  `donors` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci,
  `investors` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci,
  `fundingOrganization` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci,
  `initialInvestment` decimal(10,2) DEFAULT NULL,
  `annualFunding` decimal(10,2) DEFAULT NULL,
  `annualRevenue` decimal(10,2) DEFAULT NULL,
  `expectedRecurrentExpenditure` decimal(10,2) DEFAULT NULL,
  `projectRejectComment` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci,
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
  `methodology` varchar(255) DEFAULT NULL,
  `gdp` varchar(255) DEFAULT NULL,
  `assumption` varchar(255) DEFAULT NULL,
  `endDateofCommence` datetime NOT NULL,
  `currentNdc` varchar(255) DEFAULT NULL,
  `previousNdc` varchar(255) DEFAULT NULL,
  `currentSubNdc` varchar(255) DEFAULT NULL,
  `previousSubNdc` varchar(255) DEFAULT NULL,
  `likelyhood` int DEFAULT NULL,
  `politicalPreference` int DEFAULT NULL,
  `financialFecialbility` int DEFAULT NULL,
  `availabilityOfTechnology` int DEFAULT NULL,
  `actionJustification` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci,
  `isMappedCorrectly` int DEFAULT NULL,
  `climateActionCreatedData` datetime DEFAULT NULL,
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
) ENGINE=InnoDB AUTO_INCREMENT=1138 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

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
  `uniqueIdentification` varchar(255) DEFAULT NULL,
  `climateActionModule` tinyint DEFAULT NULL,
  `ghgModule` tinyint DEFAULT NULL,
  `macModule` tinyint DEFAULT NULL,
  `dataCollectionModule` tinyint DEFAULT NULL,
  `dataCollectionGhgModule` tinyint DEFAULT NULL,
  `hasExelTem` tinyint DEFAULT NULL,
  `telephoneLength` int DEFAULT NULL,
  `uniqtelephone` int DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=72 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `country_sector`
--

DROP TABLE IF EXISTS `country_sector`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `country_sector` (
  `sectorId` int NOT NULL,
  `countryId` int DEFAULT NULL,
  `createdBy` varchar(255) DEFAULT NULL,
  `createdOn` datetime DEFAULT NULL,
  `editedBy` varchar(255) DEFAULT NULL,
  `editedOn` datetime DEFAULT NULL,
  `status` int NOT NULL DEFAULT '0',
  `uniqueIdentification` varchar(255) DEFAULT NULL,
  `id` int NOT NULL AUTO_INCREMENT,
  PRIMARY KEY (`id`),
  KEY `FK_876a3a24e621b0c8037ca4cf113` (`countryId`),
  KEY `FK_ac9fae572f4d56580da4c77da0e` (`sectorId`),
  CONSTRAINT `FK_876a3a24e621b0c8037ca4cf113` FOREIGN KEY (`countryId`) REFERENCES `country` (`id`),
  CONSTRAINT `FK_ac9fae572f4d56580da4c77da0e` FOREIGN KEY (`sectorId`) REFERENCES `sector` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=83 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

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
  `notedataRequest` varchar(255) DEFAULT NULL,
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
  `qcUserName` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `REL_49a33ee0f7fd132bb3bf9f43a8` (`ParameterId`),
  CONSTRAINT `FK_49a33ee0f7fd132bb3bf9f43a8b` FOREIGN KEY (`ParameterId`) REFERENCES `parameter` (`id`) ON UPDATE RESTRICT
) ENGINE=InnoDB AUTO_INCREMENT=8626 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

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
  `parameterName` varchar(255) DEFAULT NULL,
  `unit` varchar(255) DEFAULT NULL,
  `administrationLevel` varchar(255) DEFAULT NULL,
  `source` varchar(255) DEFAULT NULL,
  `year` int DEFAULT NULL,
  `value` varchar(255) DEFAULT NULL,
  `parentId` int DEFAULT NULL,
  `uniqueIdentification` varchar(255) DEFAULT NULL,
  `countryId` int DEFAULT NULL,
  `isMac` int DEFAULT NULL,
  `scenario` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FK_67ec03944679db10b0bf78476d5` (`countryId`),
  CONSTRAINT `FK_67ec03944679db10b0bf78476d5` FOREIGN KEY (`countryId`) REFERENCES `country` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=274 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `default_value`
--

LOCK TABLES `default_value` WRITE;
/*!40000 ALTER TABLE `default_value` DISABLE KEYS */;
INSERT INTO `default_value` VALUES (NULL,'2022-03-24 07:42:08',NULL,'2022-03-24 07:42:08',0,1,'CO₂ emission factor','t-CO₂/TJ','Diesel','IPCC',2006,'74.1',NULL,NULL,NULL,NULL,NULL),(NULL,'2022-03-24 07:42:08',NULL,'2022-03-24 07:42:08',0,2,'Net calorific value','TJ/t','Diesel','IPCC',2006,'0.043',NULL,NULL,NULL,NULL,NULL),(NULL,'2022-03-24 07:42:08',NULL,'2022-03-24 07:42:08',0,3,'CO₂ emission factor','t-CO₂/TJ','Diesel','IPCC',2006,'69.3',NULL,NULL,NULL,NULL,NULL),(NULL,'2022-03-24 07:42:08',NULL,'2022-03-24 07:42:08',0,5,'Net calorific value','TJ/t','LPG','IPCC',2006,'0.0473',NULL,NULL,NULL,NULL,NULL),(NULL,NULL,NULL,NULL,0,9,'Project Life',NULL,'Electric cars (1000 cars) ','-',NULL,'15',NULL,NULL,NULL,1,'baseLine'),(NULL,NULL,NULL,NULL,0,10,'Project Life',NULL,'Electric cars (1000 cars) ','-',NULL,'15',NULL,NULL,NULL,1,'project'),(NULL,NULL,NULL,NULL,0,11,'Annual O&M',NULL,'Electric 18m buses articulated (1000 buses) ','-',NULL,'0.5',NULL,NULL,NULL,1,'project'),(NULL,NULL,NULL,NULL,0,12,'Annual O&M',NULL,'Electric 18m buses articulated (1000 buses) ','-',NULL,'1',NULL,NULL,NULL,1,'baseLine'),(NULL,NULL,NULL,NULL,0,13,'Annual Fuel Cost',NULL,'Electric cars (1000 cars)','-',NULL,'265200',NULL,NULL,NULL,1,'project'),(NULL,NULL,NULL,NULL,0,14,'Annual Fuel Cost',NULL,'Electric cars (1000 cars)','-',NULL,'301887',NULL,NULL,NULL,1,'baseLine'),(NULL,NULL,NULL,NULL,0,15,'Discount Rate','%','7%','-',NULL,'7',NULL,NULL,NULL,1,NULL),(NULL,NULL,NULL,NULL,0,19,'Share of passengers by transport mode','%','car','National transport commission',NULL,'26',NULL,NULL,NULL,NULL,NULL),(NULL,NULL,NULL,NULL,0,20,'Average occupation rate of transport mode','Passengers/ car','cars','National transport commission',NULL,'1.5',NULL,NULL,NULL,NULL,NULL),(NULL,NULL,NULL,NULL,0,25,'Share of passengers by transport mode','%','motorbikes','National transport commission',NULL,'74',NULL,NULL,NULL,NULL,NULL),(NULL,NULL,NULL,NULL,0,26,'Average occupation rate of transport mode','Passengers/ motorbikes','motorbikes','GACMO',NULL,'1.2',NULL,NULL,NULL,NULL,NULL),(NULL,NULL,NULL,NULL,0,27,'Fuel consumption rate of transportation','Tonnes/km','cars','GACMO',NULL,'0.0000531',NULL,NULL,NULL,NULL,NULL),(NULL,NULL,NULL,NULL,0,28,'Fuel consumption rate of transportation','litres/km','motorbikes','GACMO',NULL,'0.0000181',NULL,NULL,NULL,NULL,NULL),(NULL,NULL,NULL,NULL,0,29,'Fuel consumption rate of transportation','litres/km','bus','Parking Lot Survey in Cambodia, Lao PDR and Myanmar',NULL,'0.00243',NULL,NULL,NULL,NULL,NULL),(NULL,NULL,NULL,NULL,0,30,'Baseline emission factor(EFBL)','gCO₂','truck','Methodology',NULL,'83',NULL,NULL,NULL,NULL,NULL),(NULL,NULL,NULL,NULL,0,31,'Baseline emission factor(EFBL)','gCO₂','truck','Methodology',NULL,'61',NULL,NULL,NULL,NULL,NULL),(NULL,NULL,NULL,NULL,0,32,'Baseline emission factor(EFBL)','gCO₂','truck','Methodology',NULL,'76',NULL,NULL,NULL,NULL,NULL),(NULL,NULL,NULL,NULL,0,33,'Baseline emission factor(EFBL)','gCO₂','truck','Methodology',NULL,'94',NULL,NULL,NULL,NULL,NULL),(NULL,NULL,NULL,NULL,0,34,'Baseline emission factor(EFBL)','gCO₂','truck','Methodology',NULL,'74',NULL,NULL,NULL,NULL,NULL),(NULL,NULL,NULL,NULL,0,35,'Baseline emission factor(EFBL)','gCO₂','truck','Methodology',NULL,'76',NULL,NULL,NULL,NULL,NULL),(NULL,NULL,NULL,NULL,0,36,'Baseline emission factor(EFBL)','gCO₂','truck','Methodology',NULL,'90',NULL,NULL,NULL,NULL,NULL),(NULL,NULL,NULL,NULL,0,37,'Baseline emission factor(EFBL)','gCO₂','truck','Methodology',NULL,'80',NULL,NULL,NULL,NULL,NULL),(NULL,NULL,NULL,NULL,0,38,'Baseline emission factor(EFBL)','gCO₂','truck','Methodology',NULL,'83',NULL,NULL,NULL,NULL,NULL),(NULL,NULL,NULL,NULL,0,39,'Baseline emission factor(EFBL)','gCO₂','truck','Methodology',NULL,'70',NULL,NULL,NULL,NULL,NULL),(NULL,NULL,NULL,NULL,0,40,'Baseline emission factor(EFBL)','gCO₂','truck','Methodology',NULL,'76',NULL,NULL,NULL,NULL,NULL),(NULL,NULL,NULL,NULL,0,41,'Baseline emission factor(EFBL)','gCO₂','truck','Methodology',NULL,'70',NULL,NULL,NULL,NULL,NULL),(NULL,NULL,NULL,NULL,0,42,'Baseline emission factor(EFBL)','gCO₂','truck','Methodology',NULL,'100',NULL,NULL,NULL,NULL,NULL),(NULL,NULL,NULL,NULL,0,43,'Baseline emission factor(EFBL)','gCO₂','truck','Methodology',NULL,'119',NULL,NULL,NULL,NULL,NULL),(NULL,NULL,NULL,NULL,0,44,'Baseline emission factor(EFBL)','gCO₂','truck','Methodology',NULL,'84',NULL,NULL,NULL,NULL,NULL),(NULL,NULL,NULL,NULL,0,45,'Baseline emission factor(EFBL)','gCO₂','truck','Methodology',NULL,'94',NULL,NULL,NULL,NULL,NULL),(NULL,NULL,NULL,NULL,0,46,'Baseline emission factor(EFBL)','gCO₂','truck','Methodology',NULL,'119',NULL,NULL,NULL,NULL,NULL),(NULL,NULL,NULL,NULL,0,47,'Net calorific value (cambodia)','TJ/t','Diesel','MME (NCSD)',2020,'0.042',2,NULL,NULL,NULL,NULL),(NULL,NULL,NULL,NULL,0,48,'Net calorific value (cambodia)','TJ/t','Petrol','MME (NCSD)',2020,'0.043',2,NULL,NULL,NULL,NULL),(NULL,NULL,NULL,NULL,0,49,'CO₂ emission factor of Diesel ','TJ/t','Diesel','MME (NCSD)',NULL,'74.1',NULL,NULL,NULL,NULL,NULL),('-','2022-08-08 07:07:22','-','2022-08-08 07:07:22',0,56,'Net calorific value',NULL,'CNG',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),('-','2022-08-08 07:07:22','-','2022-08-08 07:07:22',0,57,'CO₂ emission factor',NULL,'CNG',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),('-','2022-08-08 11:44:53','-','2022-08-08 11:44:53',0,58,'Technology improvement factor ',NULL,'Common',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),('-','2022-08-08 11:44:53','-','2022-08-08 11:44:53',0,59,'CO₂ emission factor',NULL,'Electricity',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),('-','2022-08-08 11:48:43','-','2022-08-08 11:48:43',0,60,'Technology improvement factor ',NULL,'Common',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),('-','2022-08-08 11:48:43','-','2022-08-08 11:48:43',0,61,'CO₂ emission factor',NULL,'Electricity',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),('-','2022-08-09 07:08:06','-','2022-08-09 07:08:06',0,62,'Net calorific value of Diesel ',NULL,'Diesel',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),('-','2022-08-09 11:27:58','-','2022-08-09 11:27:58',0,63,'Net calorific value of Gasolin',NULL,'Gasolin',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),('-','2022-08-09 11:27:58','-','2022-08-09 11:27:58',0,64,'CO₂ emission factor of Gasolin',NULL,'Gasolin',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),('-','2022-08-10 04:38:39','-','2022-08-10 04:38:39',0,65,'Density',NULL,'Diesel',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),('-','2022-08-10 10:41:26','-','2022-08-10 10:41:26',0,67,'Actual fuel price (annual average) in local currency for the assessment year',NULL,'Diesel',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),('-','2022-08-10 10:41:26','-','2022-08-10 10:41:26',0,68,'Diesel Vehicle travel elasticity',NULL,'Diesel',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),('-','2022-08-10 10:41:26','-','2022-08-10 10:41:26',0,69,'Actual per capita income in local currency for the assessment year',NULL,'Diesel',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),('-','2022-08-10 14:20:57','-','2022-08-10 14:20:57',0,70,'CO₂ emission factor',NULL,'Petrol',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),('-','2022-08-10 14:20:57','-','2022-08-10 14:20:57',0,71,'Fuel mix own - price elasticity',NULL,'Fuel Mix',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),('-','2022-08-10 14:20:57','-','2022-08-10 14:20:57',0,72,'Actual per capita income in local currency for the assessment year',NULL,'Fuel Mix',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),('-','2022-08-10 14:20:57','-','2022-08-10 14:20:57',0,73,'Actual fuel mix price in local currency for the assessment year',NULL,'Fuel Mix',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),('-','2022-08-10 18:04:13','-','2022-08-10 18:04:13',0,74,'Net calorific value',NULL,'Petrol',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),('-','2022-08-10 18:04:14','-','2022-08-10 18:04:14',0,75,'Relative fuel price increase ',NULL,'Petrol',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),('-','2022-08-10 18:04:14','-','2022-08-10 18:04:14',0,76,'Relative fuel price increase ',NULL,'Diesel',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),('-','2022-08-10 18:04:14','-','2022-08-10 18:04:14',0,77,'Diesel own-price elasticity',NULL,'Diesel',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),('-','2022-08-10 18:04:14','-','2022-08-10 18:04:14',0,78,'Petrol own-price elasticity',NULL,'Petrol',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),('-','2022-08-10 18:04:14','-','2022-08-10 18:04:14',0,79,'Actual fuel price (annual average) in local currency for the assessment year',NULL,'Petrol',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),('-','2022-08-10 18:04:14','-','2022-08-10 18:04:14',0,80,'Actual per capita income in local currency for the assessment year',NULL,'Petrol',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),('-','2022-08-11 11:27:34','-','2022-08-11 11:27:34',0,81,'Density',NULL,'Petrol',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),('-','2022-08-11 11:27:34','-','2022-08-11 11:27:34',0,82,'Cross-price elasticity',NULL,'Petrol',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),('-','2022-08-11 11:27:34','-','2022-08-11 11:27:34',0,83,'Net calorific value ',NULL,'Diesel',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),('-','2022-08-11 11:27:34','-','2022-08-11 11:27:34',0,84,'Cross-price elasticity',NULL,'Diesel',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),('-','2022-08-12 04:20:51','-','2022-08-12 04:20:51',0,85,'Net calorific value of biofuel produced in year',NULL,'q',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),('-','2022-08-12 04:20:51','-','2022-08-12 04:20:51',0,86,'Production of biofuel',NULL,'q',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),('-','2022-08-12 04:20:51','-','2022-08-12 04:20:51',0,87,'Quantity of biofuel consumed',NULL,'q',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),('-','2022-08-12 04:20:51','-','2022-08-12 04:20:51',0,88,'Quantity of biofuel produced with other alcohols',NULL,'q',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),('-','2022-08-12 04:20:51','-','2022-08-12 04:20:51',0,89,'Consumption of (blended) biofuel',NULL,'q',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),('-','2022-08-12 04:20:51','-','2022-08-12 04:20:51',0,90,'Fraction of blending',NULL,'q',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),('-','2022-08-12 04:20:52','-','2022-08-12 04:20:52',0,91,'Blending fraction of fuel',NULL,'q',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),('-','2022-08-12 04:20:52','-','2022-08-12 04:20:52',0,92,'Project emissions from combustion ',NULL,'Diesel',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),('-','2022-08-12 04:20:52','-','2022-08-12 04:20:52',0,94,' Net calorific value of biofuel produced in year',NULL,'Common',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),('-','2022-08-12 04:20:52','-','2022-08-12 04:20:52',0,95,'CO₂ emission factor for most carbon intensive fossil fuel','','Common',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),('-','2022-08-12 04:20:52','-','2022-08-12 04:20:52',0,96,'Emission factor',NULL,'Diesel',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),('-','2022-08-12 04:20:52','-','2022-08-12 04:20:52',0,97,'NCV of the biomass residues',NULL,'Agricultural crop residues',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),('-','2022-08-12 04:20:52','-','2022-08-12 04:20:52',0,98,'Quantity of biomass residues',NULL,'Agricultural crop residues',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),('-','2022-08-12 08:33:41','-','2022-08-12 08:33:41',0,99,'Average occupation rate of transport mode',NULL,'car',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),('-','2022-08-12 09:05:30','-','2022-08-12 09:05:30',0,100,'Average occupation rate of transport mode',NULL,'Motor Cycle',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),('-','2022-08-12 09:05:31','-','2022-08-12 09:05:31',0,101,'Share of passengers by transport mode',NULL,'Motor Cycle',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),('-','2022-08-12 12:10:22','-','2022-08-12 12:10:22',0,102,'CO2 emission coefficient',NULL,'Diesel',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),('-','2022-08-12 12:10:22','-','2022-08-12 12:10:22',0,103,'CO2 emission factor',NULL,'Diesel',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),('-','2022-08-12 12:10:22','-','2022-08-12 12:10:22',0,104,'Weighted avarage density',NULL,'Diesel',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),('-','2022-08-12 12:10:22','-','2022-08-12 12:10:22',0,105,'CO2 emission factor',NULL,'Electricity',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),('-','2022-08-12 12:10:22','-','2022-08-12 12:10:22',0,106,'Weighted avarage mass fraction',NULL,'Diesel',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),('-','2022-08-12 12:10:22','-','2022-08-12 12:10:22',0,107,'Average technical transmission and distribution losses',NULL,'Electricity',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),('-','2022-08-29 07:15:24','-','2022-08-29 07:15:24',0,108,'Net calorific value','TJ/t','Diesel','IPCC',2020,'0.043',2,NULL,NULL,NULL,NULL),('-','2022-09-03 16:53:41','-','2022-09-03 16:53:41',0,114,'Net calorific value of Petrol','MJ/g','Petrol',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),('-','2022-09-03 16:53:41','-','2022-09-03 16:53:41',0,115,'CO₂ emission factor of Petrol','gCO₂/MJ','Petrol',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),('-','2022-09-03 16:53:41','-','2022-09-03 16:53:41',0,116,'Global warming potential of the CH4','tCO₂/tCH4','Common',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),('-','2022-09-03 16:53:41','-','2022-09-03 16:53:41',0,117,'Total number of passengers transported in indirect','passenger','Common',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),('-','2022-09-03 16:53:41','-','2022-09-03 16:53:41',0,118,'Net calorific value of Diesel','TJ/Gg','Diesel',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),('-','2022-09-03 16:53:41','-','2022-09-03 16:53:41',0,119,'CO₂ emission factor of Diesel','tCO₂/TJ','Diesel',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),('-','2022-09-03 16:53:41','-','2022-09-03 16:53:41',0,120,'Weighted average mass fraction of carbon in Diesel','tc/mass unit','Diesel',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),('-','2022-09-03 16:53:41','-','2022-09-03 16:53:41',0,121,'Density of Diesel','mass unit','Diesel',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),('-','2022-09-04 11:48:35','-','2022-09-04 11:48:35',0,122,'Average occupation rate of transport mode','passenger/vehicle','car',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),('-','2022-09-04 11:48:35','-','2022-09-04 11:48:35',0,123,'Share of passengers by transport mode','%','car',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),('-','2022-09-04 11:48:35','-','2022-09-04 11:48:35',0,124,'CO₂ emission factor','t-CO₂/TJ','Diesel',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),('-','2022-09-04 12:09:32','-','2022-09-04 12:09:32',0,125,'CO₂ emission factor','t-CO₂/TJ','Petrol','IPCC',2016,'69.3',6,NULL,NULL,NULL,NULL),('-','2022-09-04 12:13:17','-','2022-09-04 12:13:17',0,126,'Average occupation rate of transport mode','passenger/vehicle','Motor Cycle',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),('-','2022-09-04 12:13:17','-','2022-09-04 12:13:17',0,127,'Share of passengers by transport mode','%','Motor Cycle',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),('-','2022-09-04 12:13:17','-','2022-09-04 12:13:17',0,128,'CO₂ emission factor','t-CO₂/TJ','Petrol',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),('-','2022-09-04 12:13:17','-','2022-09-04 12:13:17',0,129,'Net calorific value','TJ/t','Petrol',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),('-','2022-09-04 12:35:37','-','2022-09-04 12:35:37',0,131,'Average occupation rate of transport mode','Passengers/ car','cars','National transport commission',2016,'1.5',20,NULL,28,NULL,NULL),('-','2022-09-04 12:49:26','-','2022-09-04 12:49:26',0,132,'CO₂ emission factor','t-CO₂/TJ','Petrol','IPCC',2016,'69.3',6,NULL,28,NULL,NULL),('-','2022-09-05 06:12:43','-','2022-09-05 06:12:43',0,133,'Net calorific value','TJ/t','Diesel','IPCC',2016,'0.043',2,NULL,28,NULL,NULL),('-','2022-09-05 06:47:04','-','2022-09-05 06:47:04',0,136,'Emission factor for electricity generation','tCO₂/MWh','Electricity',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),('-','2022-09-05 06:47:04','-','2022-09-05 06:47:04',0,137,'Average technical transmission and distribution losses','unit','Electricity',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),('-','2022-09-05 06:57:08','-','2022-09-05 06:57:08',0,138,'Average occupation rate of transport mode','Passengers/ car','cars','National transport commission',2016,'1.5',20,NULL,NULL,NULL,NULL),('-','2022-09-05 07:22:08','-','2022-09-05 07:22:08',0,139,'Share of passengers by transport mode','%','car','National transport commission',2016,'26',19,NULL,28,NULL,NULL),('-','2022-09-05 07:24:05','-','2022-09-05 07:24:05',0,140,'CO₂ emission factor','t-CO₂/TJ','Diesel','IPCC',2016,'74.1',1,NULL,28,NULL,NULL),('-','2022-09-05 07:24:41','-','2022-09-05 07:24:41',0,141,'Net calorific value','TJ/t','Petrol','IPCC',2016,'0.0443',74,NULL,28,NULL,NULL),('-','2022-09-05 07:37:20','-','2022-09-05 07:37:20',0,142,'Share of passengers by transport mode','%','car','National transport commission',2016,'26',19,NULL,NULL,NULL,NULL),('-','2022-09-05 07:38:23','-','2022-09-05 07:38:23',0,143,'CO₂ emission factor','t-CO₂/TJ','Diesel','IPCC',2016,'74.1',1,NULL,NULL,NULL,NULL),('-','2022-09-05 07:39:30','-','2022-09-05 07:39:30',0,144,'Net calorific value','TJ/t','Petrol','IPCC',2016,'0.0443',74,NULL,NULL,NULL,NULL),('-','2022-09-06 07:38:44','-','2022-09-06 07:38:44',0,145,'Average occupation rate of transport mode','passenger/vehicle','Motor Cycle',NULL,NULL,NULL,NULL,NULL,28,NULL,NULL),('-','2022-09-06 07:38:44','-','2022-09-06 07:38:44',0,146,'Share of passengers by transport mode','%','Motor Cycle',NULL,NULL,NULL,NULL,NULL,28,NULL,NULL),('-','2022-09-08 04:52:51','-','2022-09-08 04:52:51',0,150,'CO₂ emission factor of the electric grid','tCO₂e/MWh','Electricity',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),('-','2022-09-15 11:34:42','-','2022-09-15 11:34:42',0,151,'Fuel mix own - price elasticity','-','Fuel Mix',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),('-','2022-09-15 11:34:43','-','2022-09-15 11:34:43',0,152,'Actual fuel mix price in local currency for the assessment year','-','Fuel Mix',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),('-','2022-09-15 11:34:43','-','2022-09-15 11:34:43',0,153,'Actual per capita income in local currency for the assessment year','-','Fuel Mix',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),('-','2022-09-29 11:21:06','-','2022-09-29 11:21:06',0,157,'Average occupation rate of transport mode','passenger/vehicle','car',NULL,NULL,NULL,NULL,NULL,28,NULL,NULL),('-','2022-10-04 09:06:19','-','2022-10-04 09:06:19',0,158,'Average occupation rate of transport mode','passenger/vehicle','car',NULL,NULL,NULL,NULL,NULL,29,NULL,NULL),('-','2022-10-04 09:06:19','-','2022-10-04 09:06:19',0,159,'Net calorific value','TJ/t','Diesel','IPCC',2016,'0.043',NULL,NULL,29,NULL,NULL),('-','2022-10-04 09:06:19','-','2022-10-04 09:06:19',0,160,'CO₂ emission factor','t-CO₂/TJ','Diesel','IPCC',2016,'74.1',NULL,NULL,29,NULL,NULL),('-','2022-10-04 09:06:19','-','2022-10-04 09:06:19',0,161,'CO₂ emission factor','t-CO₂/TJ','Petrol','IPCC',2016,'69.3',NULL,NULL,29,NULL,NULL),('-','2022-10-04 09:06:19','-','2022-10-04 09:06:19',0,162,'Net calorific value','TJ/t','Petrol','IPCC',2016,'0.0443',NULL,NULL,29,NULL,NULL),('-','2022-10-04 09:06:19','-','2022-10-04 09:06:19',0,163,'Share of passengers by transport mode','%','car',NULL,NULL,NULL,NULL,NULL,29,NULL,NULL),('-','2022-09-02 06:39:02','-','2022-09-02 06:39:02',0,164,'Net calorific value','TJ/t','Diesel','IPCC',2016,'43',2,NULL,32,NULL,NULL),('-','2022-09-02 06:39:03','-','2022-09-02 06:39:03',0,165,'CO₂ emission factor','t-CO₂/TJ','Diesel','IPCC',2016,'74.1',1,NULL,32,NULL,NULL),('-','2022-09-02 06:39:03','-','2022-09-02 06:39:03',0,166,'CO₂ emission factor','t-CO₂/TJ','Petrol','IPCC',2016,'69.3',1,NULL,32,NULL,NULL),('-','2022-09-02 06:39:02','-','2022-09-02 06:39:02',0,167,'Net calorific value','TJ/t','Petrol','IPCC',2016,'0.0443',2,NULL,32,NULL,NULL),('-','2022-10-11 04:41:07','-','2022-10-11 04:41:07',0,168,'Density of Petrol','Kg/m3','Petrol',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),('-','2022-10-11 04:41:07','-','2022-10-11 04:41:07',0,169,'Default Beta Value','-','Common',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),('-','2022-10-11 04:41:07','-','2022-10-11 04:41:07',0,170,'CO₂ emission factor','tCO₂/TJ','Electricity',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),('-','2022-10-12 14:31:25','-','2022-10-12 14:31:25',0,171,'Average Occupancy rate of transport mode','passenger/vehicle','car',NULL,NULL,NULL,NULL,NULL,32,NULL,NULL),('-','2022-10-12 14:31:25','-','2022-10-12 14:31:25',0,172,'Share of passengers by transport mode','%','car',NULL,NULL,NULL,NULL,NULL,32,NULL,NULL),('-','2022-11-11 06:25:57','-','2022-11-11 06:25:57',0,173,'Average Occupancy rate of transport mode','passenger/vehicle','car',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),('-','2022-12-14 06:56:50','-','2022-12-14 06:56:50',0,174,'Average occupation rate of transport mode','passenger/vehicle','car',NULL,NULL,NULL,NULL,NULL,32,NULL,NULL),('-','2023-04-03 07:42:11','-','2023-04-03 07:42:11',0,175,'Share of passengers by transport mode','%','bus',NULL,NULL,NULL,NULL,NULL,28,NULL,NULL),('-','2023-04-03 07:42:11','-','2023-04-03 07:42:11',0,176,'Average occupation rate of transport mode','passenger/vehicle','bus',NULL,NULL,NULL,NULL,NULL,28,NULL,NULL),('-','2023-05-11 11:19:19','-','2023-05-11 11:19:19',0,178,'Net calorific value of Petrol','TJ/Gg','Petrol',NULL,NULL,NULL,NULL,NULL,32,NULL,NULL),('-','2023-05-11 11:19:19','-','2023-05-11 11:19:19',0,179,'Density of Petrol','Kg/m3','Petrol',NULL,NULL,NULL,NULL,NULL,32,NULL,NULL),('-','2023-05-11 11:19:19','-','2023-05-11 11:19:19',0,180,'CO₂ emission factor','KgCO₂/KWh','Electricity','A&B',2022,'0.62',NULL,NULL,32,NULL,NULL),('-','2023-05-11 11:19:19','-','2023-05-11 11:19:19',0,181,'Default Beta Value','-','Common',NULL,NULL,NULL,NULL,NULL,32,NULL,NULL),('-','2023-05-12 05:57:01','-','2023-05-12 05:57:01',0,182,'Technology improvement factor','-','Common',NULL,NULL,NULL,NULL,NULL,32,NULL,NULL),('-','2023-05-15 09:32:12','-','2023-05-15 09:32:12',0,183,'Actual fuel mix price in local currency for the assessment year','-','Fuel Mix',NULL,NULL,NULL,NULL,NULL,32,NULL,NULL),('-','2023-05-15 09:32:12','-','2023-05-15 09:32:12',0,184,'Fuel mix own - price elasticity','-','Fuel Mix',NULL,NULL,NULL,NULL,NULL,32,NULL,NULL),('-','2023-05-15 09:32:12','-','2023-05-15 09:32:12',0,185,'Actual per capita income in local currency for the assessment year','-','Fuel Mix',NULL,NULL,NULL,NULL,NULL,32,NULL,NULL),('-','2023-05-24 01:51:02','-','2023-05-24 01:51:02',0,186,'Net calorific value','TJ/t','LPG','Research Institute for Transport Science and Technology',2000,NULL,5,NULL,32,NULL,NULL),('-','2023-05-26 01:31:56','-','2023-05-26 01:31:56',0,187,'Net calorific value','TJ/t','Diesel','Research Institute for Transport Science and Technology',2000,NULL,2,NULL,32,NULL,NULL),('-','2023-05-30 05:53:32','-','2023-05-30 05:53:32',0,188,'Share of passengers by transport mode','%','car','General Department of Land Transport',2005,NULL,19,NULL,32,NULL,NULL),('-','2023-06-09 07:08:36','-','2023-06-09 07:08:36',0,189,'Density of Petrol','Kg/m3','Petrol',NULL,NULL,NULL,NULL,NULL,29,NULL,NULL),('-','2023-06-09 07:08:36','-','2023-06-09 07:08:36',0,190,'CO₂ emission factor','KgCO₂/KWh','Electricity','A&B',2022,'0.62',NULL,NULL,29,NULL,NULL),('-','2023-06-09 07:08:36','-','2023-06-09 07:08:36',0,191,'Default Beta Value','-','Common',NULL,NULL,NULL,NULL,NULL,29,NULL,NULL),('-','2023-06-09 07:30:23','-','2023-06-09 07:30:23',0,192,'CO₂ emission factor','t-CO₂/TJ','Diesel',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),('-','2023-06-09 07:30:23','-','2023-06-09 07:30:23',0,193,'Net calorific value','TJ/t','Diesel',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),('-','2023-06-09 07:30:23','-','2023-06-09 07:30:23',0,194,'Net calorific value','TJ/t','Petrol',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),('-','2023-06-09 07:30:23','-','2023-06-09 07:30:23',0,195,'CO₂ emission factor','t-CO₂/TJ','Petrol',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),('-','2023-06-09 07:44:40','-','2023-06-09 07:44:40',0,196,'Fuel mix own - price elasticity','-','Fuel Mix',NULL,NULL,NULL,NULL,NULL,29,NULL,NULL),('-','2023-06-09 07:44:40','-','2023-06-09 07:44:40',0,197,'Actual fuel mix price in local currency for the assessment year','-','Fuel Mix',NULL,NULL,NULL,NULL,NULL,29,NULL,NULL),('-','2023-06-09 07:44:40','-','2023-06-09 07:44:40',0,198,'Actual per capita income in local currency for the assessment year','-','Fuel Mix',NULL,NULL,NULL,NULL,NULL,29,NULL,NULL),('-','2023-06-09 07:48:30','-','2023-06-09 07:48:30',0,199,'CO₂ emission factor','t-CO₂/MWh','Electricity',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),('-','2023-06-09 11:14:44','-','2023-06-09 11:14:44',0,200,'Net calorific value','MJ/g','Gasolin',NULL,NULL,NULL,NULL,NULL,32,NULL,NULL),('-','2023-06-09 11:14:44','-','2023-06-09 11:14:44',0,201,'CO₂ emission factor','gCO₂/MJ','Gasolin',NULL,NULL,NULL,NULL,NULL,32,NULL,NULL),('-','2023-06-09 11:14:44','-','2023-06-09 11:14:44',0,203,'CO₂ emission factor','KgCO₂/KWh','Electricity','DEFRA',2021,'0.212',NULL,NULL,32,NULL,NULL),('-','2023-06-09 11:14:44','-','2023-06-09 11:14:44',0,204,'CO₂ emission factor','KgCO₂/KWh','Electricity','DEFRA',2021,'0.212',NULL,NULL,29,NULL,NULL),('-','2023-06-14 14:27:35','-','2023-06-14 14:27:35',0,205,'Density',NULL,'Diesel','General Department of Land Transport',2022,NULL,65,NULL,32,NULL,NULL),('-','2023-06-27 05:33:01','-','2023-06-27 05:33:01',0,206,'Average occupation rate of transport mode','passenger/vehicle',NULL,NULL,NULL,NULL,NULL,NULL,28,NULL,NULL),('-','2023-06-27 05:33:02','-','2023-06-27 05:33:02',0,207,'Share of passengers by transport mode','%',NULL,NULL,NULL,NULL,NULL,NULL,28,NULL,NULL),('-','2023-06-27 05:51:54','-','2023-06-27 05:51:54',0,208,'CO₂ emission factor','t-CO₂/MWh','Electricity',NULL,NULL,NULL,NULL,NULL,28,NULL,NULL),('-','2023-07-06 06:55:02','-','2023-07-06 06:55:02',0,209,'Production of biofuel',NULL,'q','City Bus Authority',2000,NULL,86,NULL,32,NULL,NULL),('-','2023-07-06 06:59:10','-','2023-07-06 06:59:10',0,210,'CO₂ emission factor','t-CO₂/TJ','Diesel','City Bus Authority',2000,NULL,1,NULL,32,NULL,NULL),('-','2023-07-14 09:38:26','-','2023-07-14 09:38:26',0,211,'Own-price elasticity','-','Petrol',NULL,NULL,NULL,NULL,NULL,32,NULL,NULL),('-','2023-07-14 09:38:26','-','2023-07-14 09:38:26',0,212,'Actual fuel price (annual average) in local currency for the assessment year','-','Petrol',NULL,NULL,NULL,NULL,NULL,32,NULL,NULL),('-','2023-07-14 09:38:26','-','2023-07-14 09:38:26',0,213,'Actual per capita income in local currency for the assessment year','-','Petrol',NULL,NULL,NULL,NULL,NULL,32,NULL,NULL),('-','2023-07-14 09:38:26','-','2023-07-14 09:38:26',0,214,'Relative fuel price increase ','%','Petrol',NULL,NULL,NULL,NULL,NULL,32,NULL,NULL),('-','2023-07-17 04:36:51','-','2023-07-17 04:36:51',0,215,'CO₂ emission factor','t-CO₂/TJ','Petrol',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),('-','2023-07-17 04:36:51','-','2023-07-17 04:36:51',0,216,'Fuel mix own - price elasticity','-','Fuel Mix',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),('-','2023-07-17 04:36:51','-','2023-07-17 04:36:51',0,217,'Actual fuel mix price in local currency for the assessment year','-','Fuel Mix',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),('-','2023-07-17 04:36:51','-','2023-07-17 04:36:51',0,218,'Actual per capita income in local currency for the assessment year','-','Fuel Mix',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),('-','2023-07-17 07:56:28','-','2023-07-17 07:56:28',0,219,'Density','Kg/m3','Petrol',NULL,NULL,NULL,NULL,NULL,32,NULL,NULL),('-','2023-07-19 08:24:53','-','2023-07-19 08:24:53',0,220,'Density',NULL,'Diesel','City Bus Authority',2006,NULL,65,NULL,32,NULL,NULL),('-','2023-08-08 05:15:50','-','2023-08-08 05:15:50',0,221,'Technology improvement factor','-','Common',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),('-','2023-08-08 05:15:50','-','2023-08-08 05:15:50',0,222,'Net calorific value','J/g','Diesel',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),('-','2023-08-08 05:15:50','-','2023-08-08 05:15:50',0,223,'CO₂ emission factor','gCO₂/J','Diesel',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),('-','2023-08-08 05:15:50','-','2023-08-08 05:15:50',0,224,'Net calorific value','J/g','Petrol',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),('-','2023-08-08 05:27:35','-','2023-08-08 05:27:35',0,225,'CO₂ emission factor','kgCO₂/kwh','Electricity',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),('-','2023-09-04 04:23:26','-','2023-09-04 04:23:26',0,226,'Density',NULL,'Petrol','Sri Lanka Sustainable Energy Authority',2016,NULL,81,NULL,1,NULL,NULL),('-','2023-09-20 04:10:54','-','2023-09-20 04:10:54',0,235,'CO₂ emission factor','tCO₂/TJ','Petrol',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),('-','2023-09-20 04:10:54','-','2023-09-20 04:10:54',0,236,'Net calorific value of Petrol','TJ/Gg','Petrol',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),('-','2023-09-20 04:10:54','-','2023-09-20 04:10:54',0,237,'CO₂ emission factor','tCO₂/TJ','Electricity',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),('-','2023-09-20 04:10:54','-','2023-09-20 04:10:54',0,238,'Density of Petrol','Kg/m3','Petrol',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),('-','2023-09-20 04:10:54','-','2023-09-20 04:10:54',0,239,'Default Beta Value','-','Common',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),('-','2023-09-20 04:17:39','-','2023-09-20 04:17:39',0,240,'CO₂ emission factor','t-CO₂/MWh','Diesel',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),('-','2023-09-20 04:17:39','-','2023-09-20 04:17:39',0,241,'Share of passengers by transport mode','%','car',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),('-','2023-09-20 04:17:39','-','2023-09-20 04:17:39',0,242,'Net calorific value','TJ/t','Diesel',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),('-','2023-09-20 04:17:39','-','2023-09-20 04:17:39',0,243,'Average occupation rate of transport mode','passenger/vehicle','car',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),('-','2023-09-20 04:17:39','-','2023-09-20 04:17:39',0,244,'Net calorific value','TJ/t','Petrol',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),('-','2023-09-20 06:40:53','-','2023-09-20 06:40:53',0,245,'CO₂ emission factor',NULL,'Electricity','General Department of Land Transport',2016,'0.57',59,NULL,NULL,NULL,NULL),('-','2023-09-20 06:41:22','-','2023-09-20 06:41:22',0,246,'CO₂ emission factor',NULL,'Petrol','General Department of Land Transport',2015,'69.3',70,NULL,NULL,NULL,NULL),('-','2023-09-20 10:42:24','-','2023-09-20 10:42:24',0,247,'CO₂ emission factor','t-CO₂/TJ','Diesel','General Department of Land Transport',2015,'74.1',1,NULL,NULL,NULL,NULL),('-','2023-10-19 21:15:35','-','2023-10-19 21:15:35',0,262,'CO₂ emission factor','t-CO₂/TJ','Diesel',NULL,NULL,NULL,NULL,NULL,71,NULL,NULL),('-','2023-10-19 21:15:35','-','2023-10-19 21:15:35',0,263,'CO₂ emission factor','t-CO₂/TJ','Petrol',NULL,NULL,NULL,NULL,NULL,71,NULL,NULL),('-','2023-10-27 19:24:13','-','2023-10-27 19:24:13',0,264,'Net calorific value','TJ/t','Diesel',NULL,NULL,NULL,NULL,NULL,71,NULL,NULL),('-','2023-10-27 19:24:13','-','2023-10-27 19:24:13',0,265,'CO₂ emission factor','t-CO₂/MWh','Electricity',NULL,NULL,NULL,NULL,NULL,71,NULL,NULL),('-','2023-10-27 19:24:13','-','2023-10-27 19:24:13',0,266,'Net calorific value','TJ/t','Petrol',NULL,NULL,NULL,NULL,NULL,71,NULL,NULL),('-','2023-10-30 17:28:33','-','2023-10-30 17:28:33',0,267,'Default Beta Value','-','Common',NULL,NULL,NULL,NULL,NULL,71,NULL,NULL),('-','2023-10-30 17:28:33','-','2023-10-30 17:28:33',0,268,'Density of Petrol','Kg/m3','Petrol',NULL,NULL,NULL,NULL,NULL,71,NULL,NULL),('-','2023-10-30 17:28:33','-','2023-10-30 17:28:33',0,269,'Net calorific value of Petrol','TJ/Gg','Petrol',NULL,NULL,NULL,NULL,NULL,71,NULL,NULL),('-','2023-10-31 19:00:02','-','2023-10-31 19:00:02',0,270,'Technology improvement factor','-','Common',NULL,NULL,NULL,NULL,NULL,71,NULL,NULL),('-','2023-11-02 04:46:32','-','2023-11-02 04:46:32',0,271,'Density of Diesel','Kg/m3','Diesel',NULL,NULL,NULL,NULL,NULL,71,NULL,NULL),('-','2023-11-13 14:37:51','-','2023-11-13 14:37:51',0,272,'Net calorific value','MJ/g','Gasolin',NULL,NULL,NULL,NULL,NULL,71,NULL,NULL),('-','2023-11-13 14:37:51','-','2023-11-13 14:37:51',0,273,'CO₂ emission factor','gCO₂/MJ','Gasolin',NULL,NULL,NULL,NULL,NULL,71,NULL,NULL);
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
  `countryId` int DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=180 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

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
  `uniqueIdentification` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FK_624b822b4a45197c6f0b88051bc` (`categoryId`),
  KEY `FK_4893e540d687978250eb88fa2dc` (`typeId`),
  KEY `FK_3ca64cf0f964345e07b4c469bbe` (`parentInstitutionId`),
  KEY `FK_44ff376c15f8ecc9e2290605050` (`countryId`),
  CONSTRAINT `FK_3ca64cf0f964345e07b4c469bbe` FOREIGN KEY (`parentInstitutionId`) REFERENCES `institution` (`id`),
  CONSTRAINT `FK_44ff376c15f8ecc9e2290605050` FOREIGN KEY (`countryId`) REFERENCES `country` (`id`),
  CONSTRAINT `FK_4893e540d687978250eb88fa2dc` FOREIGN KEY (`typeId`) REFERENCES `institution_type` (`id`),
  CONSTRAINT `FK_624b822b4a45197c6f0b88051bc` FOREIGN KEY (`categoryId`) REFERENCES `institution_category` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=368 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

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
INSERT INTO `institution_type` VALUES (NULL,NULL,NULL,NULL,0,1,'UNFCCC Focal Point','UNFCCC Focal Point',1),(NULL,NULL,NULL,NULL,0,2,'NDC Unit','NDC Unit',1),(NULL,NULL,NULL,NULL,0,3,'Data provider','Data provider institution',1),(NULL,NULL,NULL,NULL,0,4,'Technical Team','Technical Team',1),(NULL,NULL,NULL,NULL,0,5,'Data Collection Team','Data Collection Team',1),(NULL,NULL,NULL,NULL,0,6,'QC Team','QC Team',1);
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
INSERT INTO `instype_usertype` VALUES (1,2),(2,3),(2,4),(2,5),(2,6),(2,7),(3,8),(3,9),(4,5),(5,6),(6,7);
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
  `thumbnail` varchar(255) NOT NULL DEFAULT 'https://icon-library.com/images/document-icon-image/document-icon-image-1.jpg',
  `isPublish` int DEFAULT NULL,
  `deletedAt` datetime(6) DEFAULT NULL,
  `uniqueIdentification` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=94 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `learning_material`
--

LOCK TABLES `learning_material` WRITE;
/*!40000 ALTER TABLE `learning_material` DISABLE KEYS */;
INSERT INTO `learning_material` VALUES ('','2022-04-22 13:11:37','','2022-04-22 13:11:37',0,7,'User Guidence','Introduction to the ICAT Assessment Guides','https://climateactiontransparency.org/wp-content/uploads/2020/04/Introduction-to-the-ICAT-Assessment-Guides.pdf','https://icon-library.com/images/document-icon-image/document-icon-image-1.jpg',1,NULL,'7f47edd0-e53e-4ff0-9cfe-992506523ed3'),('','2022-05-26 06:45:02','','2022-05-26 06:45:02',0,13,'User Guidence','GACMO tool','https://unepccc.org/gacmo-tool/','https://icon-library.com/images/document-icon-image/document-icon-image-1.jpg',0,NULL,'697c5319-0f04-4d0b-a318-25117418bf69'),('','2022-05-26 06:48:37','','2022-05-26 06:48:37',0,14,'Learning Material','CAAT tool','https://climateactiontransparency.org/resources/the-caat/','https://icon-library.com/images/document-icon-image/document-icon-image-1.jpg',0,NULL,'e3c3544e-eb8e-4609-aeb5-0f4466c9313b'),('','2022-06-08 08:02:56','','2022-06-08 08:02:56',0,20,'Learning Material','Transport-Pricing-Assessment-Guide.pdf','https://climateactiontransparency.org/wp-content/uploads/2020/04/Introduction-to-the-ICAT-Assessment-Guides.pdf','https://icon-library.com/images/document-icon-image/document-icon-image-1.jpg',1,NULL,'037d48b5-2245-424e-87e1-931c4b7cee09'),('','2022-06-08 08:04:08','','2022-06-08 08:04:08',0,21,'Learning Material','GACMO.xlsm','https://unepccc.org/wp-content/uploads/2023/03/gacmo-country-x.xlsm','https://icon-library.com/images/document-icon-image/document-icon-image-1.jpg',1,NULL,'b1c0e289-72e4-4118-a1eb-9f91fb7317e1'),('','2023-06-23 12:06:04','','2023-06-23 12:06:04',0,39,'Learning Material','Assign verifier .mp4','https://storage.googleapis.com/tracad-public-files/LearningMaterial/CountryAdmin/Assign%20verifier%20.mp4','https://www.pngkey.com/png/detail/342-3428680_document-clipart.png',1,NULL,'40af4c9b-6d2e-4d47-88bf-04d4704a970a'),('','2023-06-23 12:14:00','','2023-06-23 12:14:00',0,40,'Learning Material','Data request status and approval.mp4','https://storage.googleapis.com/tracad-public-files/LearningMaterial/DataCollectionTeam/Data%20request%20status%20and%20approval.mp4','https://www.pngkey.com/png/detail/342-3428680_document-clipart.png',1,NULL,'b28082cc-fba2-4dbe-8f9b-11b01a56cdd6'),('','2023-06-23 12:15:24','','2023-06-23 12:15:24',0,41,'Learning Material','Send data request to institutions.mp4','https://storage.googleapis.com/tracad-public-files/LearningMaterial/DataCollectionTeam/Send%20data%20request%20to%20institutions.mp4','https://www.pngkey.com/png/detail/342-3428680_document-clipart.png',1,NULL,'a2809c02-6feb-436e-b454-9bfe71e59bae'),('','2023-06-23 12:17:11','','2023-06-23 12:17:11',0,42,'Learning Material','Quality Control.mp4','https://storage.googleapis.com/tracad-public-files/LearningMaterial/QCTeam/Quality%20Control.mp4','https://www.pngkey.com/png/detail/342-3428680_document-clipart.png',1,NULL,'5bb1b974-414a-43a3-9287-b3e53e986946'),('','2023-06-23 12:18:05','','2023-06-23 12:18:05',0,43,'Learning Material','Review data.mp4','https://storage.googleapis.com/tracad-public-files/LearningMaterial/InstitutionAdmin/Review%20data.mp4','https://www.pngkey.com/png/detail/342-3428680_document-clipart.png',1,NULL,'0514cfcc-9a73-4041-a489-89beb1e7deca'),('','2023-06-23 12:18:48','','2023-06-23 12:18:48',0,44,'Learning Material','Enter data.mp4','https://storage.googleapis.com/tracad-public-files/LearningMaterial/InstitutionAdmin/Enter%20data.mp4','https://www.pngkey.com/png/detail/342-3428680_document-clipart.png',1,NULL,'85c1f261-f19e-45d1-9fc2-b626e9b8b2dc'),('','2023-06-23 12:19:22','','2023-06-23 12:19:22',0,45,'Learning Material','Assign data requests.mp4','https://storage.googleapis.com/tracad-public-files/LearningMaterial/InstitutionAdmin/Assign%20data%20requests.mp4','https://www.pngkey.com/png/detail/342-3428680_document-clipart.png',1,NULL,'cea7d284-2113-4165-ae43-548df6f8188f'),('','2023-06-23 12:20:29','','2023-06-23 12:20:29',0,46,'Learning Material','Enter data.mp4','https://storage.googleapis.com/tracad-public-files/LearningMaterial/DataEntryOperator/Enter%20data.mp4','https://www.pngkey.com/png/detail/342-3428680_document-clipart.png',1,NULL,'820ca52d-8457-42bc-8ce2-886bd4a602ec'),('','2023-06-23 12:32:22','','2023-06-23 12:32:22',0,47,'Learning Material','Propose a climate action & accept a proposed climate action.mp4','https://storage.googleapis.com/tracad-public-files/LearningMaterial/SectorAdmin/Propose%20a%20climate%20action%20&%20accept%20a%20proposed%20climate%20action.mp4','https://www.pngkey.com/png/detail/342-3428680_document-clipart.png',1,NULL,'98f355d5-2c5d-44f5-84eb-ad213349203b'),('','2023-06-23 12:33:08','','2023-06-23 12:33:08',0,48,'Learning Material','Sent to assign verifiers.mp4','https://storage.googleapis.com/tracad-public-files/LearningMaterial/SectorAdmin/Sent%20to%20assign%20verifiers.mp4','https://www.pngkey.com/png/detail/342-3428680_document-clipart.png',1,NULL,'adaa6ba0-e43e-4ff1-94ff-188d813301b7'),('','2023-06-23 12:33:45','','2023-06-23 12:33:45',0,49,'Learning Material','Report generation.mp4','https://storage.googleapis.com/tracad-public-files/LearningMaterial/SectorAdmin/Report%20generation.mp4','https://www.pngkey.com/png/detail/342-3428680_document-clipart.png',1,NULL,'74d1fee5-935e-408e-8879-7405506d392c'),('','2023-06-23 12:37:41','','2023-06-23 12:37:41',0,50,'Learning Material','Quality control team.mp4','https://storage.googleapis.com/tracad-public-files/LearningMaterial/QCTeam/Quality%20control%20team.mp4','https://www.pngkey.com/png/detail/342-3428680_document-clipart.png',1,NULL,'ac2fad0b-3fa9-4344-b43b-b1fa7e39091a'),('','2023-06-23 13:05:41','','2023-06-23 13:05:41',0,51,'Learning Material','Reset password option & forget password option.mp4','https://storage.googleapis.com/tracad-public-files/LearningMaterial/CountryAdmin/Reset%20password%20option%20&%20forget%20password%20option.mp4','https://www.pngkey.com/png/detail/342-3428680_document-clipart.png',1,NULL,'6ffe5982-843f-4c49-b5a0-43539048b22d'),('','2023-06-23 13:08:47','','2023-06-23 13:08:47',0,52,'Learning Material','Propose a climate action in detail (Rv).mp4','https://storage.googleapis.com/tracad-public-files/LearningMaterial/CountryAdmin/Propose%20a%20climate%20action%20in%20detail%20(Rv).mp4','https://www.pngkey.com/png/detail/342-3428680_document-clipart.png',1,NULL,'4a313062-bfa5-455b-b8cf-36f18fd30d8a'),('','2023-06-23 13:11:19','','2023-06-23 13:11:19',0,53,'Learning Material','Create an institution in detail.mp4','https://storage.googleapis.com/tracad-public-files/LearningMaterial/SectorAdmin/Create%20an%20institution%20in%20detail.mp4','https://www.pngkey.com/png/detail/342-3428680_document-clipart.png',1,NULL,'47929781-2b39-47a1-9ab0-92df876e9241'),('','2023-06-23 13:11:42','','2023-06-23 13:11:42',0,54,'Learning Material','Create user in detail (Rv).mp4','https://storage.googleapis.com/tracad-public-files/LearningMaterial/SectorAdmin/Create%20user%20in%20detail%20(Rv).mp4','https://www.pngkey.com/png/detail/342-3428680_document-clipart.png',1,NULL,'81933cf4-a8b1-426b-a119-636aa765cab5'),('','2023-06-23 13:16:36','','2023-06-23 13:16:36',0,55,'Learning Material','Reset password option & forget password option.mp4','https://storage.googleapis.com/tracad-public-files/LearningMaterial/SectorAdmin/Reset%20password%20option%20&%20forget%20password%20option.mp4','https://www.pngkey.com/png/detail/342-3428680_document-clipart.png',1,NULL,'bbb0da7f-05ba-45d9-ae1d-d9c8dc8e75cc'),('','2023-06-23 13:18:17','','2023-06-23 13:18:17',0,56,'Learning Material','Propose a climate action in detail (Rv).mp4','https://storage.googleapis.com/tracad-public-files/LearningMaterial/TechnicalTeam/Propose%20a%20climate%20action%20%26%20accept%20a%20proposed%20climate%20action.mp4','https://www.pngkey.com/png/detail/342-3428680_document-clipart.png',1,NULL,'af32acc8-2a42-4b14-ac7e-31f41b3f7e06'),('','2023-06-23 13:18:44','','2023-06-23 13:18:44',0,57,'Learning Material','Create user in detail (Rv).mp4','https://storage.googleapis.com/tracad-public-files/LearningMaterial/TechnicalTeam/Create%20user%20in%20detail%20(Rv).mp4','https://www.pngkey.com/png/detail/342-3428680_document-clipart.png',1,NULL,'0b6bb569-9a83-4267-b124-033483faca66'),('','2023-06-23 13:19:25','','2023-06-23 13:19:25',0,58,'Learning Material','Reset password option & forget password option.mp4','https://storage.googleapis.com/tracad-public-files/LearningMaterial/TechnicalTeam/Reset%20password%20option%20&%20forget%20password%20option.mp4','https://www.pngkey.com/png/detail/342-3428680_document-clipart.png',1,NULL,'26d1a60b-8ffd-4779-9c5f-d9f70f2cfaf5'),('','2023-06-23 13:19:55','','2023-06-23 13:19:55',0,59,'Learning Material','Create an institution in detail.mp4','https://storage.googleapis.com/tracad-public-files/LearningMaterial/TechnicalTeam/Create%20an%20institution%20in%20detail.mp4','https://www.pngkey.com/png/detail/342-3428680_document-clipart.png',1,NULL,'7c01bdad-1e55-4de8-8613-766fa3059838'),('','2023-06-23 13:44:24','','2023-06-23 13:44:24',0,60,'Learning Material','Additional steps need to take when concerns are raised (New).mp4','https://storage.googleapis.com/tracad-public-files/LearningMaterial/TechnicalTeam/Additional%20steps%20need%20to%20take%20when%20concerns%20are%20raised%20(New).mp4','https://www.pngkey.com/png/detail/342-3428680_document-clipart.png',1,NULL,'9fb397f1-c4ab-4876-9e69-703f4bc9d008'),('','2023-06-23 13:52:09','','2023-06-23 13:52:09',0,61,'Learning Material','Sent to assign verifiers.mp4','https://storage.googleapis.com/tracad-public-files/LearningMaterial/TechnicalTeam/Sent%20to%20assign%20verifiers.mp4','https://www.pngkey.com/png/detail/342-3428680_document-clipart.png',1,NULL,'17cd42b5-8fae-4d11-9521-e2688529a695'),('','2023-06-23 13:56:02','','2023-06-23 13:56:02',0,62,'Learning Material','Report generation.mp4','https://storage.googleapis.com/tracad-public-files/LearningMaterial/TechnicalTeam/Report%20generation.mp4','https://www.pngkey.com/png/detail/342-3428680_document-clipart.png',1,NULL,'45fedca8-2423-412c-9e3f-2c76c75f1372'),('','2023-06-23 14:39:57','','2023-06-23 14:39:57',0,63,'Learning Material','Sent to assign verifiers.mp4','https://storage.googleapis.com/tracad-public-files/LearningMaterial/MRVAdmin/Sent%20to%20assign%20verifiers.mp4','https://www.pngkey.com/png/detail/342-3428680_document-clipart.png',1,NULL,'41ec96a3-f84d-4c6f-b98e-62abb2036d8b'),('','2023-06-23 14:43:28','','2023-06-23 14:43:28',0,64,'Learning Material','Report generation.mp4','https://storage.googleapis.com/tracad-public-files/LearningMaterial/MRVAdmin/Report%20generation.mp4','https://www.pngkey.com/png/detail/342-3428680_document-clipart.png',1,NULL,'34154279-00e0-4c5f-b24d-461dfc945ca5'),('','2023-06-23 15:09:54','','2023-06-23 15:09:54',0,65,'Learning Material','Quality Control.mp4','https://storage.googleapis.com/tracad-public-files/LearningMaterial/MRVAdmin/Quality%20Control.mp4','https://www.pngkey.com/png/detail/342-3428680_document-clipart.png',1,NULL,'9f9325ad-b1d3-485c-9d2c-f40521f4082b'),('','2023-06-23 15:12:44','','2023-06-23 15:12:44',0,66,'Learning Material','Data request status and approval.mp4','https://storage.googleapis.com/tracad-public-files/LearningMaterial/MRVAdmin/Data%20request%20status%20and%20approval.mp4','https://www.pngkey.com/png/detail/342-3428680_document-clipart.png',1,NULL,'6f735631-8839-431c-aca7-f7cc0a5d0e0d'),('','2023-06-23 15:16:10','','2023-06-23 15:16:10',0,67,'Learning Material','Send data request to institutions.mp4','https://storage.googleapis.com/tracad-public-files/LearningMaterial/MRVAdmin/Send%20data%20request%20to%20institutions.mp4','https://www.pngkey.com/png/detail/342-3428680_document-clipart.png',1,NULL,'6ea040cb-6bff-477d-8242-2e449b3072ea'),('','2023-06-23 15:24:48','','2023-06-23 15:24:48',0,68,'Learning Material','Propose a climate action & accept a proposed climate action.mp4','https://storage.googleapis.com/tracad-public-files/LearningMaterial/MRVAdmin/Propose%20a%20climate%20action%20&%20accept%20a%20proposed%20climate%20action.mp4','https://www.pngkey.com/png/detail/342-3428680_document-clipart.png',1,NULL,'a4f0f897-322c-4721-8cfa-9e5d702466e6'),('','2023-06-25 14:16:18','','2023-06-25 14:16:18',0,69,'Learning Material','ICAT TranCAD_User Manual_v1.2_ClimateSI.pdf','https://storage.googleapis.com/tracad-public-files/LearningMaterial/CountryAdmin/ICAT%20TranCAD_User%20Manual_v1.2_ClimateSI.pdf','https://www.pngkey.com/png/detail/342-3428680_document-clipart.png',1,NULL,'0f24cd8b-78a0-4895-bf7a-9c2b1ee3a138'),('','2023-06-25 14:19:02','','2023-06-25 14:19:02',0,70,'Learning Material','ICAT TranCAD_User Manual_v1.2_ClimateSI.pdf','https://storage.googleapis.com/tracad-public-files/LearningMaterial/Verifier/ICAT%20TranCAD_User%20Manual_v1.2_ClimateSI.pdf','https://www.pngkey.com/png/detail/342-3428680_document-clipart.png',1,NULL,'99603c5c-c30f-4b6e-8d14-13db84b3f4ef'),('','2023-06-25 14:20:52','','2023-06-25 14:20:52',0,71,'Learning Material','ICAT TranCAD_User Manual_v1.2_ClimateSI.pdf','https://storage.googleapis.com/tracad-public-files/LearningMaterial/MRVAdmin/ICAT%20TranCAD_User%20Manual_v1.2_ClimateSI.pdf','https://www.pngkey.com/png/detail/342-3428680_document-clipart.png',1,NULL,'f1d88b6b-fed9-445d-a6db-980de00ae699'),('','2023-06-25 14:24:34','','2023-06-25 14:24:34',0,72,'Learning Material','ICAT TranCAD_User Manual_v1.2_ClimateSI.pdf','https://storage.googleapis.com/tracad-public-files/LearningMaterial/SectorAdmin/ICAT%20TranCAD_User%20Manual_v1.2_ClimateSI.pdf','https://www.pngkey.com/png/detail/342-3428680_document-clipart.png',1,NULL,'709ddf26-6817-48f1-aad3-07a5798245be'),('','2023-06-25 14:25:38','','2023-06-25 14:25:38',0,73,'Learning Material','ICAT TranCAD_User Manual_v1.2_ClimateSI.pdf','https://storage.googleapis.com/tracad-public-files/LearningMaterial/TechnicalTeam/ICAT%20TranCAD_User%20Manual_v1.2_ClimateSI.pdf','https://www.pngkey.com/png/detail/342-3428680_document-clipart.png',1,NULL,'3df2196f-c212-4ade-9d6a-00be526ef8bc'),('','2023-06-25 14:26:56','','2023-06-25 14:26:56',0,74,'Learning Material','ICAT TranCAD_User Manual_v1.2_ClimateSI.pdf','https://storage.googleapis.com/tracad-public-files/LearningMaterial/DataCollectionTeam/ICAT%20TranCAD_User%20Manual_v1.2_ClimateSI.pdf','https://www.pngkey.com/png/detail/342-3428680_document-clipart.png',1,NULL,'41deaccd-5ada-4005-a6f9-58dd410da5ee'),('','2023-06-25 14:27:46','','2023-06-25 14:27:46',0,75,'Learning Material','ICAT TranCAD_User Manual_v1.2_ClimateSI.pdf','https://storage.googleapis.com/tracad-public-files/LearningMaterial/QCTeam/ICAT%20TranCAD_User%20Manual_v1.2_ClimateSI.pdf','https://www.pngkey.com/png/detail/342-3428680_document-clipart.png',1,NULL,'921cee68-10ba-4a6e-8f94-327922455a17'),('','2023-06-25 14:28:35','','2023-06-25 14:28:35',0,76,'Learning Material','ICAT TranCAD_User Manual_v1.2_ClimateSI.pdf','https://storage.googleapis.com/tracad-public-files/LearningMaterial/InstitutionAdmin/ICAT%20TranCAD_User%20Manual_v1.2_ClimateSI.pdf','https://www.pngkey.com/png/detail/342-3428680_document-clipart.png',1,NULL,'dfa60a6f-0f0b-4118-908e-3f044d6d1263'),('','2023-06-25 14:30:03','','2023-06-25 14:30:03',0,77,'Learning Material','ICAT TranCAD_User Manual_v1.2_ClimateSI.pdf','https://storage.googleapis.com/tracad-public-files/LearningMaterial/DataEntryOperator/ICAT%20TranCAD_User%20Manual_v1.2_ClimateSI.pdf','https://www.pngkey.com/png/detail/342-3428680_document-clipart.png',1,NULL,'205b9335-83d1-42c3-8b54-0305ff2f4413'),('','2023-06-25 15:20:06','','2023-06-25 15:20:06',0,78,'Learning Material','Verification.mp4','https://storage.googleapis.com/tracad-public-files/LearningMaterial/Verifier/Verification.mp4','https://www.pngkey.com/png/detail/342-3428680_document-clipart.png',1,NULL,'fe822555-114a-4cf2-bb40-bc8ca63e71b8'),('','2023-06-26 04:52:07','','2023-06-26 04:52:07',0,79,'Learning Material','Data Entry Operator (Rv).mp4','https://storage.googleapis.com/tracad-public-files/LearningMaterial/DataEntryOperator/Data%20Entry%20Operator%20(Rv).mp4','https://www.pngkey.com/png/detail/342-3428680_document-clipart.png',1,NULL,'243d4787-d60c-4215-b5ef-834ac2f1ed31'),('','2023-06-28 07:47:02','','2023-06-28 07:47:02',0,80,'Learning Material','Reset password option & forget password option.mp4','https://storage.googleapis.com/tracad-public-files/LearningMaterial/DataCollectionTeam/Reset%20password%20option%20&%20forget%20password%20option.mp4','https://www.pngkey.com/png/detail/342-3428680_document-clipart.png',1,NULL,'f94e42b0-3252-407e-9d86-c657d4c94733'),('','2023-06-28 07:53:14','','2023-06-28 07:53:14',0,81,'Learning Material','Create user in detail (Rv).mp4','https://storage.googleapis.com/tracad-public-files/LearningMaterial/MRVAdmin/Create%20user%20in%20detail%20(Rv).mp4','https://www.pngkey.com/png/detail/342-3428680_document-clipart.png',1,NULL,'ad0648e0-01b6-4919-8953-b175cfb3fed5'),('','2023-06-28 08:31:02','','2023-06-28 08:31:02',0,82,'Learning Material','Report generation.mp4','https://storage.googleapis.com/tracad-public-files/LearningMaterial/CountryAdmin/Report%20generation.mp4','https://www.pngkey.com/png/detail/342-3428680_document-clipart.png',1,NULL,'a9cead35-80ee-4718-80bf-7a336ef66856'),('','2023-06-28 08:53:48','','2023-06-28 08:53:48',0,83,'Learning Material','Reset password option & forget password option.mp4','https://storage.googleapis.com/tracad-public-files/LearningMaterial/MRVAdmin/Reset%20password%20option%20&%20forget%20password%20option.mp4','https://www.pngkey.com/png/detail/342-3428680_document-clipart.png',1,NULL,'51089e0d-8031-4b79-b84b-74a2a14c94f6'),('','2023-07-05 07:42:54','','2023-07-05 07:42:54',0,84,'Learning Material','Assessing a climate action .mp4','https://storage.googleapis.com/tracad-public-files/LearningMaterial/SectorAdmin/Assessing%20a%20climate%20action%20.mp4','https://www.pngkey.com/png/detail/342-3428680_document-clipart.png',1,NULL,'f4685c45-c12c-49ec-b8b3-05c47e91cd6c'),('','2023-07-06 22:10:48','','2023-07-06 22:10:48',0,85,'Learning Material','Technical team.mp4','https://storage.googleapis.com/tracad-public-files/LearningMaterial/TechnicalTeam/Technical%20team.mp4','https://www.pngkey.com/png/detail/342-3428680_document-clipart.png',1,NULL,'6702f984-d595-4741-a99b-661e4eb63965'),('','2023-07-10 03:09:57','','2023-07-10 03:09:57',0,86,'Learning Material','Data Entry Operator.mp4','https://storage.googleapis.com/tracad-public-files/LearningMaterial/DataEntryOperator/Data%20Entry%20Operator.mp4','https://www.pngkey.com/png/detail/342-3428680_document-clipart.png',1,NULL,'9bcc175d-6d69-417b-82f8-732be667f2e4'),('','2023-07-14 08:48:42','','2023-07-14 08:48:42',0,87,'Learning Material','Assessing a climate action .mp4','https://storage.googleapis.com/tracad-public-files/LearningMaterial/MRVAdmin/Assessing%20a%20climate%20action%20.mp4','https://www.pngkey.com/png/detail/342-3428680_document-clipart.png',1,NULL,'e074f7f0-4a8b-423d-9d60-0b37c2dc1e42'),('','2023-07-14 08:56:06','','2023-07-14 08:56:06',0,88,'Learning Material','Assessing a climate action .mp4','https://storage.googleapis.com/tracad-public-files/LearningMaterial/TechnicalTeam/Assessing%20a%20climate%20action%20.mp4','https://www.pngkey.com/png/detail/342-3428680_document-clipart.png',1,NULL,'b454376e-ff88-4f94-9c9d-a05f421d7a98'),('','2023-07-14 09:24:44','','2023-07-14 09:24:44',0,89,'Learning Material','Country admin.mp4','https://storage.googleapis.com/tracad-public-files/LearningMaterial/CountryAdmin/Country%20admin.mp4','https://www.pngkey.com/png/detail/342-3428680_document-clipart.png',1,NULL,'2ea31773-6b2c-4fb0-8572-cad9ebfaf269'),('','2023-07-14 09:37:01','','2023-07-14 09:37:01',0,90,'Learning Material','Institution admin (Rv).mp4','https://storage.googleapis.com/tracad-public-files/LearningMaterial/InstitutionAdmin/Institution%20admin%20(Rv).mp4','https://www.pngkey.com/png/detail/342-3428680_document-clipart.png',1,NULL,'ad0845de-6986-4ad0-b075-331ca501bb4b'),('','2023-07-14 09:47:33','','2023-07-14 09:47:33',0,91,'Learning Material','Data Entry Operator.mp4','https://storage.googleapis.com/tracad-public-files/LearningMaterial/DataEntryOperator/Data%20Entry%20Operator.mp4','https://www.pngkey.com/png/detail/342-3428680_document-clipart.png',1,NULL,'ac890b4c-f9f4-4df9-b4f5-d8460df99ef3'),('','2023-07-14 10:05:10','','2023-07-14 10:05:10',0,92,'Learning Material','Data collection team (Rv).mp4','https://storage.googleapis.com/tracad-public-files/LearningMaterial/DataCollectionTeam/Data%20collection%20team%20(Rv).mp4','https://www.pngkey.com/png/detail/342-3428680_document-clipart.png',1,NULL,'05d82fd2-3a26-4208-b1ff-efd7188c02ef'),(' ','2023-07-14 10:05:10',' ','2023-07-14 10:05:10',0,93,'User Guidence','COMPASS Tool Box','https://climateactiontransparency.org/our-work/icat-toolbox/compass-toolbox/','https://climateactiontransparency.org/our-work/icat-toolbox/compass-toolbox/',1,NULL,'05d82fd2-3a26-4208-b1ff-efd7188c02gdg');
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
  `uniqueIdentification` varchar(255) DEFAULT NULL,
  `learningMaterial2Id` int DEFAULT NULL,
  `sectorId` int DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=85 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `learning_material_sector`
--

LOCK TABLES `learning_material_sector` WRITE;
/*!40000 ALTER TABLE `learning_material_sector` DISABLE KEYS */;
INSERT INTO `learning_material_sector` VALUES (NULL,NULL,NULL,NULL,0,2,'946549e2-bdee-4990-9978-5e5537032a56',10,1),(NULL,NULL,NULL,NULL,0,3,'45935ee7-08ae-4fcc-a71e-86a2a3d20414',11,1),(NULL,NULL,NULL,NULL,0,4,'0e2eb16a-43fc-4a59-b2f7-9e0836f7d5cd',12,1),(NULL,NULL,NULL,NULL,0,5,'f8fd41d6-ee27-4086-9ba9-9bbfbbd392c7',13,1),(NULL,NULL,NULL,NULL,0,6,'f4e67ede-e5fd-41f4-9169-5a9c3d83a1fe',14,1),(NULL,NULL,NULL,NULL,0,7,'4fe1883d-b6bd-403a-9293-76b835a2c765',15,1),(NULL,NULL,NULL,NULL,0,8,'172c7454-cb83-434e-8a62-3a09feb7ae3a',16,1),(NULL,NULL,NULL,NULL,0,9,'ce57fa9d-18ef-4f93-b740-3bc29d60f748',17,1),(NULL,NULL,NULL,NULL,0,10,'935c6e3b-1655-4e9a-af41-19874424b6ea',18,1),(NULL,NULL,NULL,NULL,0,11,'f5381c5b-512c-4265-a5c7-a7ccaa02f6a0',7,1),(NULL,NULL,NULL,NULL,0,12,'cb25dccf-c162-4656-a0ac-0aa6e6b1c5c5',20,1),(NULL,NULL,NULL,NULL,0,13,'fb18ff7a-861b-42a1-bac7-c45fc1d568cf',21,1),(NULL,NULL,NULL,NULL,0,14,'f94fb79e-5a02-4365-b46e-7fbad2245c83',22,1),(NULL,NULL,NULL,NULL,0,16,'',13,1),(NULL,NULL,NULL,NULL,0,17,'',13,1),(NULL,NULL,NULL,NULL,0,18,'',13,1),(NULL,NULL,NULL,NULL,0,31,'30d0ad57-d6de-4f74-b4d1-cf04ea1d9fe5',39,1),(NULL,NULL,NULL,NULL,0,32,'5b550f31-fbfe-4b91-9e77-b1ba7e0cbd2d',40,1),(NULL,NULL,NULL,NULL,0,33,'d3482cd1-9235-4620-aa07-4045ca623034',41,1),(NULL,NULL,NULL,NULL,0,34,'c5f8cf8d-aff8-491a-8565-3f5151a54ec6',42,1),(NULL,NULL,NULL,NULL,0,35,'cca5d2b8-192f-46d1-9fab-acc47429c6a6',43,1),(NULL,NULL,NULL,NULL,0,36,'5104cfe4-ab60-4c75-90d7-1073012dc89f',44,1),(NULL,NULL,NULL,NULL,0,37,'e08d5d75-eb59-4b53-b1c6-b2c59c7e5e35',45,1),(NULL,NULL,NULL,NULL,0,38,'43697412-3741-4bf1-965f-65392733e672',46,1),(NULL,NULL,NULL,NULL,0,39,'27a372cd-b847-4b16-a63e-74caf44986fe',47,1),(NULL,NULL,NULL,NULL,0,40,'93559990-ac0a-4b4e-8115-23d3c33b5de2',48,1),(NULL,NULL,NULL,NULL,0,41,'f2bf9161-de2f-446e-b089-34a120408767',49,1),(NULL,NULL,NULL,NULL,0,42,'7ada07a0-52a8-4f24-b37d-a87b5318d0a6',50,1),(NULL,NULL,NULL,NULL,0,43,'367d7c5e-8152-4c53-a642-6a515f06e531',51,1),(NULL,NULL,NULL,NULL,0,44,'349c4d66-3ddb-4a4c-9ef1-4cb2e6d773ca',52,1),(NULL,NULL,NULL,NULL,0,45,'c6089701-d7fd-4c58-b700-dbbfa7ffe470',53,1),(NULL,NULL,NULL,NULL,0,46,'44b59e68-035a-43a5-99e4-3a4cfdccb508',54,1),(NULL,NULL,NULL,NULL,0,47,'1e49b946-bdef-4a47-9c8d-d9c30f63a76e',55,1),(NULL,NULL,NULL,NULL,0,48,'5bad2737-f0ad-4fbe-8f08-d6cf571afde3',56,1),(NULL,NULL,NULL,NULL,0,49,'f3aa88fa-ecda-461d-8018-d0476c63036b',57,1),(NULL,NULL,NULL,NULL,0,50,'585ee18d-376a-4bbb-99cc-3da3496bc64b',58,1),(NULL,NULL,NULL,NULL,0,51,'ea5cfc4a-c32c-4f99-b71e-b3201b05843d',59,1),(NULL,NULL,NULL,NULL,0,52,'b907f570-6f0c-41a6-bc70-eff5931842d0',60,1),(NULL,NULL,NULL,NULL,0,53,'c2152b84-d7b6-4322-af8c-e2432982724c',61,1),(NULL,NULL,NULL,NULL,0,54,'a0c016ef-62b7-45e5-aedc-8d8671effaff',62,1),(NULL,NULL,NULL,NULL,0,55,'88f03088-3785-4038-9def-99fa29071783',63,1),(NULL,NULL,NULL,NULL,0,56,'db1ea2f1-6367-4695-b4a3-f090a0c0f395',64,1),(NULL,NULL,NULL,NULL,0,57,'5cdd4cdb-baf7-4eac-a180-6db282174cfa',65,1),(NULL,NULL,NULL,NULL,0,58,'a73700b0-2ff9-4d4a-a0e6-fdba50977f58',66,1),(NULL,NULL,NULL,NULL,0,59,'fa97f3fd-b061-41f6-b687-fa3f584ecec3',67,1),(NULL,NULL,NULL,NULL,0,60,'3597ba12-a857-435c-a91b-5447c2c39641',68,1),(NULL,NULL,NULL,NULL,0,61,'6c031bf9-5707-4960-affb-902c2098ba9a',69,1),(NULL,NULL,NULL,NULL,0,62,'1c8c470b-fbf5-40e7-bc7f-f99155a49647',70,1),(NULL,NULL,NULL,NULL,0,63,'51c24f1c-ab87-4f24-9ced-b20f443b2b32',71,1),(NULL,NULL,NULL,NULL,0,64,'0e0f6be0-9257-4c11-9077-ac0e9defa9ff',72,1),(NULL,NULL,NULL,NULL,0,65,'0ba2ba4e-525e-4833-834b-48531f2b681f',73,1),(NULL,NULL,NULL,NULL,0,66,'00ac5f0e-b841-4591-9f05-ac226ea8f62a',74,1),(NULL,NULL,NULL,NULL,0,67,'189ff25d-3f77-4034-836c-9c3aea896107',75,1),(NULL,NULL,NULL,NULL,0,68,'700ac812-eefd-4d26-a75b-2af2d0fad547',76,1),(NULL,NULL,NULL,NULL,0,69,'c7e5c5fa-ac10-4731-b2b6-7bd839b5ecdd',77,1),(NULL,NULL,NULL,NULL,0,70,'233ed39b-889c-4a73-ae0a-7cbab54ad38c',78,1),(NULL,NULL,NULL,NULL,0,71,'4f3ed769-7d42-4fa8-bfca-b3d75e2b13ee',79,1),(NULL,NULL,NULL,NULL,0,72,'011c1dfe-cf82-4dda-ab63-15bff95da9e6',80,1),(NULL,NULL,NULL,NULL,0,73,'0d0202e8-68fe-437c-a453-d1271064c131',81,1),(NULL,NULL,NULL,NULL,0,74,'7e4420e1-37de-4758-9f25-404f71f84f37',82,1),(NULL,NULL,NULL,NULL,0,75,'0896872c-191c-4224-8287-e0523299dcbd',83,1),(NULL,NULL,NULL,NULL,0,76,'04470765-b6ff-4f6b-b370-98855622d1da',84,1),(NULL,NULL,NULL,NULL,0,77,'4f446c3b-4dc4-4662-80d2-4c1c14c097ca',85,1),(NULL,NULL,NULL,NULL,0,78,'b8ba31a8-7edc-4661-ae08-4b2eec6cffdb',86,1),(NULL,NULL,NULL,NULL,0,79,'3b990e96-f155-437c-aa1c-5b3b163d7e50',87,1),(NULL,NULL,NULL,NULL,0,80,'83b4ee90-f9d0-47b9-b3b6-65b4518841dd',88,1),(NULL,NULL,NULL,NULL,0,81,'e3571f9f-5845-4957-9e44-b5cd27ba13f6',89,1),(NULL,NULL,NULL,NULL,0,82,'b3b891f9-f31a-474e-baa5-3af0d1d3237b',90,1),(NULL,NULL,NULL,NULL,0,83,'a07efe4d-1ebf-41b7-afaf-b613eec51cd8',91,1),(NULL,NULL,NULL,NULL,0,84,'6c4d1cd3-8cc1-4d20-b8c7-54deadeb5191',92,1);
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
  `uniqueIdentification` varchar(255) DEFAULT NULL,
  `learningMaterialId` int DEFAULT NULL,
  `userTypeId` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FK_67aeae28f6be57ee476b6b68178` (`userTypeId`),
  CONSTRAINT `FK_67aeae28f6be57ee476b6b68178` FOREIGN KEY (`userTypeId`) REFERENCES `user_type` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=107 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `learning_material_user_type`
--

LOCK TABLES `learning_material_user_type` WRITE;
/*!40000 ALTER TABLE `learning_material_user_type` DISABLE KEYS */;
INSERT INTO `learning_material_user_type` VALUES (NULL,NULL,NULL,NULL,0,2,'f479b3c5-9c45-461d-a308-643277498630',10,4),(NULL,NULL,NULL,NULL,0,3,'14b5780a-1139-4311-9966-c4eb22d1055f',11,4),(NULL,NULL,NULL,NULL,0,4,'36a60d37-d7a1-4942-bbf1-3711eb529304',12,4),(NULL,NULL,NULL,NULL,0,5,'9f440772-8d7f-4b6f-86bb-1e48296fa291',13,1),(NULL,NULL,NULL,NULL,0,6,'80591614-6dd4-4f66-a96d-7a36cbac0578',14,1),(NULL,NULL,NULL,NULL,0,7,'fb0d63c0-ea08-4207-8de2-ff71ae674bf3',15,4),(NULL,NULL,NULL,NULL,0,8,'9ce5ae83-7714-452c-8b9d-aaa5c5885927',16,4),(NULL,NULL,NULL,NULL,0,9,'f05063c1-9eb0-4631-b371-d906756b02bc',17,4),(NULL,NULL,NULL,NULL,0,10,'116050de-4f2f-4e0f-906b-415fa7d06ad5',18,4),(NULL,NULL,NULL,NULL,0,11,'6f87a4bd-0faa-49bc-8da5-d347f42b0997',7,1),(NULL,NULL,NULL,NULL,0,12,'2a664558-f4af-49ad-acbb-4d5d0b4b621a',20,1),(NULL,NULL,NULL,NULL,0,13,'8c3a8cf2-ae52-4a4a-b64e-18b0fa832515',21,1),(NULL,NULL,NULL,NULL,0,14,'c1122ef3-0da5-45ec-ae26-2d4eb4718056',22,2),(NULL,NULL,NULL,NULL,0,16,'',13,6),(NULL,NULL,NULL,NULL,0,17,'',13,7),(NULL,NULL,NULL,NULL,0,18,' ',7,2),(NULL,NULL,NULL,NULL,0,31,'7e622c1b-e808-4c14-8489-50f8556c24d4',39,1),(NULL,NULL,NULL,NULL,0,32,'6c5dc693-1728-498e-a264-87c2ffbfe240',40,6),(NULL,NULL,NULL,NULL,0,33,'c8b44116-ab3e-402b-8201-e10fa768b6f1',41,6),(NULL,NULL,NULL,NULL,0,34,'333a56e5-45e6-4396-b25f-b595bf812dd4',42,7),(NULL,NULL,NULL,NULL,0,35,'17f058bf-8258-44aa-ba19-6b3b2337c4f0',43,8),(NULL,NULL,NULL,NULL,0,36,'87f66ba4-f459-4c45-bb4c-ab9c761b533f',44,8),(NULL,NULL,NULL,NULL,0,37,'5dc539d3-a335-4b5e-a9f5-abc3917294e8',45,8),(NULL,NULL,NULL,NULL,0,38,'f53d8d9b-905c-453f-b8dc-d1ccb38a9cb5',46,9),(NULL,NULL,NULL,NULL,0,39,'75442df5-ce68-421b-b3dc-53c72ccf132a',47,3),(NULL,NULL,NULL,NULL,0,40,'324174e1-c1d1-4a4b-a522-c02242ecf0b7',48,3),(NULL,NULL,NULL,NULL,0,41,'843d4109-1bf0-4a46-84b8-52cc106dc018',49,3),(NULL,NULL,NULL,NULL,0,42,'f3d4aaf4-396f-45f7-bd5a-73d5d8171eaf',50,7),(NULL,NULL,NULL,NULL,0,43,'a4153fff-9278-4c73-b61b-86fa0914610c',51,1),(NULL,NULL,NULL,NULL,0,44,'be48da29-29cc-4fdc-bcb5-4cdf723d455f',52,1),(NULL,NULL,NULL,NULL,0,45,'af9f7390-6af6-4aee-9a8d-9953332c7801',53,3),(NULL,NULL,NULL,NULL,0,46,'ed70e1bd-0e01-4739-bb64-5ea4984f0728',54,3),(NULL,NULL,NULL,NULL,0,47,'e81fc8cb-2b66-4271-bec3-84f6f332a1b4',55,3),(NULL,NULL,NULL,NULL,0,48,'6200e6c8-89dd-4473-974e-dc0335cf51e1',56,5),(NULL,NULL,NULL,NULL,0,49,'c73460a9-4e76-41d7-9f28-0ed9f0fb80d7',57,5),(NULL,NULL,NULL,NULL,0,50,'9890fa39-7737-4333-a4d4-6208872deae2',58,5),(NULL,NULL,NULL,NULL,0,51,'5179dafd-9f5d-4a65-9507-165422dba220',59,5),(NULL,NULL,NULL,NULL,0,52,'b2e1b5e2-aa14-482c-a1eb-f3bdce3efd40',60,5),(NULL,NULL,NULL,NULL,0,53,'19b0e112-f8d1-444e-9aa1-e4c31245c3f7',61,5),(NULL,NULL,NULL,NULL,0,54,'aed57c5f-29a5-4d38-a033-d8cd081e978c',62,5),(NULL,NULL,NULL,NULL,0,55,'ec6c152f-2b23-4fbd-a882-665ddec01e94',63,4),(NULL,NULL,NULL,NULL,0,56,'a29128a2-e953-4dba-886f-416421b49f60',64,4),(NULL,NULL,NULL,NULL,0,57,'86bc0eb2-60c2-49e8-9b9f-3cc988608589',65,4),(NULL,NULL,NULL,NULL,0,58,'943baa10-129f-4ccf-9975-f53775b32a8e',66,4),(NULL,NULL,NULL,NULL,0,59,'c248b063-94f0-4dca-868a-3955b878bbb2',67,4),(NULL,NULL,NULL,NULL,0,60,'211d545d-211a-46bb-9465-afc7493c27fa',68,4),(NULL,NULL,NULL,NULL,0,61,'f7672c90-1aef-41b0-9f96-a5cc3b1e6f18',69,1),(NULL,NULL,NULL,NULL,0,62,'9e9437da-8ad8-449b-bb24-52834486795f',70,2),(NULL,NULL,NULL,NULL,0,63,'69f55102-8904-4b8c-b188-4066fa99a64f',71,4),(NULL,NULL,NULL,NULL,0,64,'12864d0a-c327-432d-95f3-a82e3e192aa6',72,3),(NULL,NULL,NULL,NULL,0,65,'71de447d-099b-42d3-80b2-9449417238a3',73,5),(NULL,NULL,NULL,NULL,0,66,'291577de-4247-4d59-a4c0-ad7be1b24f4e',74,6),(NULL,NULL,NULL,NULL,0,67,'c74d4573-c3eb-4823-8179-14ddb6628feb',75,7),(NULL,NULL,NULL,NULL,0,68,'e2e5d698-6088-4157-ada8-dd9681cb3c7e',76,8),(NULL,NULL,NULL,NULL,0,69,'25677956-d40b-46c8-bdf3-0cf006092e52',77,9),(NULL,NULL,NULL,NULL,0,70,'6a4136cd-d77a-4856-a1e9-8bb78198ddd1',78,2),(NULL,NULL,NULL,NULL,0,71,'d2a4708f-d766-4952-8080-7c3176971af6',79,9),(NULL,NULL,NULL,NULL,0,72,'90286dd5-fc0f-4330-b618-a54215121d95',80,6),(NULL,NULL,NULL,NULL,0,73,'97c58efc-7639-425a-a136-e286ba0b0b8e',81,4),(NULL,NULL,NULL,NULL,0,74,'64f80464-d5c5-43c1-835f-cd1734524fe6',82,1),(NULL,NULL,NULL,NULL,0,75,'f3e2d0f2-685b-4b2c-9b2a-ace169b1fd71',83,4),(NULL,NULL,NULL,NULL,0,76,'806ae39a-3b20-4ba2-99ec-9082904352b9',84,3),(NULL,NULL,NULL,NULL,0,77,'8a16d5e8-b193-41d4-92bd-7df087e27180',85,5),(NULL,NULL,NULL,NULL,0,78,'ef8998f4-1ca7-4f48-91ae-c388e6111520',86,9),(NULL,NULL,NULL,NULL,0,79,'9f160334-7b50-4f28-963c-5ef048423bce',87,4),(NULL,NULL,NULL,NULL,0,80,'35932c5b-9347-4230-b9d0-d351dc73f3ef',88,5),(NULL,NULL,NULL,NULL,0,81,'bc61c389-3ea9-437d-818a-84fac802fe0d',89,1),(NULL,NULL,NULL,NULL,0,82,'f88a8721-0999-477e-b949-8fedf098874c',90,8),(NULL,NULL,NULL,NULL,0,83,'e0b7f80a-0d08-48c8-a827-649b3bff624d',91,9),(NULL,NULL,NULL,NULL,0,84,'70b5a3a9-7590-4cfc-ada1-ea4fd3cbe9e1',92,6),(NULL,NULL,NULL,NULL,0,85,'70b5a3a9-7590-4cfc-ada1-ea4fd3cbe911',93,1),(NULL,NULL,NULL,NULL,0,86,'70b5a3a9-7590-4cfc-ada1-ea4fd3cbe922',93,2),(NULL,NULL,NULL,NULL,0,87,'70b5a3a9-7590-4cfc-ada1-ea4fd3cbe933',93,3),(NULL,NULL,NULL,NULL,0,88,'70b5a3a9-7590-4cfc-ada1-ea4fd3cbe944',93,4),(NULL,NULL,NULL,NULL,0,89,'70b5a3a9-7590-4cfc-ada1-ea4fd3cbe955',93,5),(NULL,NULL,NULL,NULL,0,90,'70b5a3a9-7590-4cfc-ada1-ea4fd3cbe966',93,6),(NULL,NULL,NULL,NULL,0,91,'70b5a3a9-7590-4cfc-ada1-ea4fd3cbe977',93,7),(NULL,NULL,NULL,NULL,0,92,'70b5a3a9-7590-4cfc-ada1-ea4fd3cbe988',93,8),(NULL,NULL,NULL,NULL,0,93,'70b5a3a9-7590-4cfc-ada1-ea4fd3cbe999',93,9),(NULL,NULL,NULL,NULL,0,94,' ',13,2),(NULL,NULL,NULL,NULL,0,95,' ',13,3),(NULL,NULL,NULL,NULL,0,96,' ',13,4),(NULL,NULL,NULL,NULL,0,97,' ',13,5),(NULL,NULL,NULL,NULL,0,98,' ',13,8),(NULL,NULL,NULL,NULL,0,99,' ',3,9),(NULL,NULL,NULL,NULL,0,100,' ',7,3),(NULL,NULL,NULL,NULL,0,101,' ',7,4),(NULL,NULL,NULL,NULL,0,102,' ',7,5),(NULL,NULL,NULL,NULL,0,103,' ',7,6),(NULL,NULL,NULL,NULL,0,104,' ',7,7),(NULL,NULL,NULL,NULL,0,105,' ',7,8),(NULL,NULL,NULL,NULL,0,106,' ',7,9);
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
  `documents` varchar(255) DEFAULT NULL,
  `easenessOfDataCollection` varchar(255) DEFAULT NULL,
  `countryId` int DEFAULT NULL,
  `sectorId` int DEFAULT NULL,
  `mitigationActionTypeId` int DEFAULT NULL,
  `applicabilityId` int DEFAULT NULL,
  `displayName` varchar(255) DEFAULT NULL,
  `uniqueIdentification` varchar(255) DEFAULT NULL,
  `isActive` int NOT NULL DEFAULT '0',
  `transportSubSector` varchar(255) DEFAULT NULL,
  `upstream_downstream` varchar(255) DEFAULT NULL,
  `ghgIncluded` varchar(255) DEFAULT NULL,
  `baselineImage` varchar(255) DEFAULT NULL,
  `projectImage` varchar(255) DEFAULT NULL,
  `projectionImage` varchar(255) DEFAULT NULL,
  `leakageImage` varchar(255) DEFAULT NULL,
  `resultImage` varchar(255) DEFAULT NULL,
  `methodId` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FK_233d133d9992c1191c613a9b345` (`countryId`),
  KEY `FK_115ce1bdd3f8dbb2e36d49ff71f` (`sectorId`),
  KEY `FK_8db0e9afc027c589d41bea7e56d` (`applicabilityId`),
  CONSTRAINT `FK_115ce1bdd3f8dbb2e36d49ff71f` FOREIGN KEY (`sectorId`) REFERENCES `sector` (`id`),
  CONSTRAINT `FK_233d133d9992c1191c613a9b345` FOREIGN KEY (`countryId`) REFERENCES `country` (`id`),
  CONSTRAINT `FK_8db0e9afc027c589d41bea7e56d` FOREIGN KEY (`applicabilityId`) REFERENCES `applicability` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=331 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `methodology`
--

LOCK TABLES `methodology` WRITE;
/*!40000 ALTER TABLE `methodology` DISABLE KEYS */;
INSERT INTO `methodology` VALUES ('-','2022-02-25 14:41:46','-','2022-02-25 14:41:46',0,1,'V 4.0','AMS-iii-S_person','CDM',0,'Transport','https://storage.googleapis.com/tracad-public-files/DOC/EB70_repan29_AMS-III.S_ver04.0.pdf','Moderately Resource and Data Intensive',1,1,3,4,'AMS-III.S - Introduction of low-emission vehicles/technologies to commercial vehicle fleets (Passenger)','0dc49d7e-b03c-406f-a40a-8a61cc186633',1,'Passenger','No','Only CO2','https://storage.googleapis.com/tracad-public-files/PNG/Baseline_AMS IIIS_Passenger.PNG','https://storage.googleapis.com/tracad-public-files/PNG/Project_AMS IIIS_Passenger.PNG',NULL,NULL,'https://storage.googleapis.com/tracad-public-files/PNG/ER.PNG',1),('-','2022-02-25 14:41:46','-','2022-02-25 14:41:46',0,2,'V 4.0','AMS-iii-S_freight','CDM',0,'Transport','https://storage.googleapis.com/tracad-public-files/DOC/EB70_repan29_AMS-III.S_ver04.0.pdf','Moderately Resource and Data Intensive',1,1,3,4,'AMS-III.S - Introduction of low-emission vehicles/technologies to commercial vehicle fleets (Freight)','0e35fb2d-e434-48d8-8c54-6cfb74f78e2e',1,'Frieght','No','Only CO2','https://storage.googleapis.com/tracad-public-files/PNG/Baseline_AMS IIIS_Freight.PNG','https://storage.googleapis.com/tracad-public-files/PNG/Project_AMS IIIS_Freight.PNG',NULL,NULL,'https://storage.googleapis.com/tracad-public-files/PNG/ER.PNG',2),('-','2022-02-25 14:41:46','-','2022-02-25 14:41:46',0,3,'V 1.0','ICAT_TPM_FSR_2020_A','ICAT',0,'Transport','https://climateactiontransparency.org/wp-content/uploads/2020/04/Transport-Pricing-Assessment-Guide.pdf','Highly Resource and Data intensive',1,1,1,1,'ICAT methodology for fuel subsidy removal and increased fuel tax or levy Approach A (top-down energy-use data_Fuel mix)','1f1a6b7b-b31c-4739-8a0c-9e84c94064fa',1,'Not specified','No','Only CO2','https://storage.googleapis.com/tracad-public-files/PNG/Approch A - Baseline.png','https://storage.googleapis.com/tracad-public-files/PNG/Approch A - PE.PNG',NULL,NULL,'https://storage.googleapis.com/tracad-public-files/PNG/ER.PNG',3),('-','2022-02-25 14:41:46','-','2022-02-25 14:41:46',0,4,'V 1.0','ICAT_TPM_FSR_2020_B','ICAT',0,'Transport','https://climateactiontransparency.org/wp-content/uploads/2020/04/Transport-Pricing-Assessment-Guide.pdf','Highly Resource and Data intensive',1,1,1,1,'ICAT methodology for fuel subsidy removal and increased fuel tax or levy _Approach B (top-down energy-use data_Gasoline & Diesel)','6666819d-85b8-4d8e-90ac-f5a4c0be60d4',1,'Not specified','No','Only CO2','https://storage.googleapis.com/tracad-public-files/PNG/Approch B - Baseline.PNG','https://storage.googleapis.com/tracad-public-files/PNG/Approch B - PE.PNG',NULL,NULL,'https://storage.googleapis.com/tracad-public-files/PNG/ER.PNG',4),('-','2022-02-25 14:41:46','-','2022-02-25 14:41:46',0,5,'V 1.0','ICAT_TPM_FSR_2020_C','ICAT',0,'Transport','https://climateactiontransparency.org/wp-content/uploads/2020/04/Transport-Pricing-Assessment-Guide.pdf','Highly Resource and Data intensive',1,1,1,1,'ICAT methodology for fuel subsidy removal and increased fuel tax or levy _Approach C (top-down energy-use data & bottom-up travel activity data )','7d18884b-2c6b-47f0-83b2-b6237e667222',2,'Not specified','No','Only CO2','https://storage.googleapis.com/tracad-public-files/PNG/Approch C - Baseline.PNG',NULL,NULL,NULL,'https://storage.googleapis.com/tracad-public-files/PNG/ER.PNG',5),('-','2022-02-25 14:41:46','-','2022-02-25 14:41:46',0,6,'V 1.0','ICAT_TPM_RP_2020_Toll_roads','ICAT',0,'Transport','https://climateactiontransparency.org/wp-content/uploads/2020/04/Transport-Pricing-Assessment-Guide.pdf','Highly Resource and Data intensive',1,1,1,1,'ICAT methodology for toll roads and distance-based charges','b5a2c27f-e1a8-4756-9287-cdd66b892835',2,'Not specified','No','Only CO2','https://storage.googleapis.com/tracad-public-files/PNG/Toll roads and distance-based charges BE1.PNG','https://storage.googleapis.com/tracad-public-files/PNG/Toll roads and distance-based charges PE 1.PNG',NULL,NULL,'https://storage.googleapis.com/tracad-public-files/PNG/ER.PNG',6),('-','2022-02-25 14:41:46','-','2022-02-25 14:41:46',0,7,'V 1.0','ICAT_TPM_RP_2020_cordon','ICAT',0,'Transport','https://climateactiontransparency.org/wp-content/uploads/2020/04/Transport-Pricing-Assessment-Guide.pdf','Highly Resource and Data intensive',1,1,1,1,'ICAT methodology for cordon pricing','2069be08-ad62-434c-bb7e-34c613319aba',2,'Not specified','No','Only CO2','https://storage.googleapis.com/tracad-public-files/PNG/Cordon pricing BE 1.PNG','https://storage.googleapis.com/tracad-public-files/PNG/Cordon pricing PE 1.PNG',NULL,NULL,'https://storage.googleapis.com/tracad-public-files/PNG/ER.PNG',7),('-','2022-02-25 14:41:46','-','2022-02-25 14:41:46',0,8,'V 3.0','JICA_TCM_MS_P_V - trafic','JICA',0,'Transport','https://storage.googleapis.com/tracad-public-files/DOC/estimation_03_M03_Model shift_2019.pdf','Moderate to low',1,1,2,13,'JICA_Traffic Congestion (Passenger)','75020287-a231-48ab-941c-457ad1f0b726',2,'Passenger','No','Only CO2','https://storage.googleapis.com/tracad-public-files/PNG/Baseline_JICA_Traffic Cogestion.PNG','https://storage.googleapis.com/tracad-public-files/PNG/Project_JICA_Traffic Congestion.PNG',NULL,NULL,'https://storage.googleapis.com/tracad-public-files/PNG/ER.PNG',9),('-','2022-02-25 14:41:46','-','2022-02-25 14:41:46',0,9,'V 3.0','JICA_TCM_MS_P_V','JICA',NULL,'Transport','https://storage.googleapis.com/tracad-public-files/DOC/estimation_03_M03_Model shift_2019.pdf','Moderate to low',1,1,2,14,'JICA_Modal Shift (Passenger)','61f08f63-0147-45e6-910e-b7de593f7c1e',2,'Passenger','No','Only CO2','https://storage.googleapis.com/tracad-public-files/PNG/Baseline_JICA_Modal shift.PNG','https://storage.googleapis.com/tracad-public-files/PNG/Project_JICA_Modal Shift.PNG',NULL,NULL,'https://storage.googleapis.com/tracad-public-files/PNG/ER.PNG',10),('-','2022-02-25 14:41:46','-','2022-02-25 14:41:46',0,10,'V 15.0','AMS-iii-C','CDM',NULL,'Transport','https://storage.googleapis.com/tracad-public-files/DOC/EB83_repan09_AMS-III.C_ver 15.0.pdf','Moderately Resource and Data Intensive',1,1,4,5,'AMS-iii-C - Emission reductions by electric and hybrid vehicles ','43404ed2-0ba2-421b-835c-8ec04301bb6b',2,'Passenger and Freight','No','Only CO2','https://storage.googleapis.com/tracad-public-files/PNG/Emission reductions by electric and hybrid vehicles 1.PNG','https://storage.googleapis.com/tracad-public-files/PNG/Emission reductions by electric and hybrid vehicles PE 1.PNG',NULL,NULL,'https://storage.googleapis.com/tracad-public-files/PNG/ER.PNG',15),('-','2022-02-25 14:41:46','-','2022-02-25 14:41:46',0,11,'V 1.1.0','UNFCCC_AM0090','CDM',NULL,'Transport','https://storage.googleapis.com/tracad-public-files/DOC/Modal shift in transportation of cargo from road transportation to water or rail transportation.pdf','Highly Resource and Data intensive',1,1,6,6,'UNFCCC_AM0090 - Modal shift in transportation of cargo from road transportation to water or rail transportation','496e45e6fad2430c8235789bd9b5d584',2,'Freight','No','Only CO2','https://storage.googleapis.com/tracad-public-files/PNG/Baseline_AM0090.PNG','https://storage.googleapis.com/tracad-public-files/PNG/Project_AM0090.PNG',NULL,NULL,'https://storage.googleapis.com/tracad-public-files/PNG/ER.PNG',17),('-','2022-02-25 14:41:46','-','2022-02-25 14:41:46',0,12,'V 1.0','ICAT_TPM_VPI_2020','ICAT',NULL,'Transport','https://climateactiontransparency.org/wp-content/uploads/2020/04/Transport-Pricing-Assessment-Guide.pdf','Highly Resource and Data intensive',1,1,1,1,'ICAT Methodology for Vehicle Purchase Incentives for More Efficient Vehicles','80fd1155-a134-4546-9130-fabee5951816',2,'Not specified','No','Only CO2','https://storage.googleapis.com/tracad-public-files/PNG/Purchase incentives for low-GHG vehicles.PNG','https://storage.googleapis.com/tracad-public-files/PNG/icat.png',NULL,NULL,'https://storage.googleapis.com/tracad-public-files/PNG/ER.PNG',8),(NULL,'2023-08-15 03:48:30',NULL,'2023-08-15 03:48:30',0,13,'V 2.0','UNFCCC_AMS_III_BC','CDM',NULL,'Transport','https://storage.googleapis.com/tracad-public-files/DOC/EB 75_repan24_AMS-III.BC_ver 02.0.pdf','Moderately Resource and Data Intensive',1,1,4,8,'UNFCCC_AMS_III_BC - Emission reductions through improved efficiency of vehicle fleets','67a00d4f-7256-42b3-becb-7467edf40c6e',2,'Not specified','No','Only CO2','https://storage.googleapis.com/tracad-public-files/PNG/Baseline_Parameters.PNG','https://storage.googleapis.com/tracad-public-files/PNG/Project_Emission_Equation.PNG',NULL,NULL,'https://storage.googleapis.com/tracad-public-files/PNG/ER.PNG',16),('-','2022-02-25 14:41:46','-','2022-02-25 14:41:46',0,14,'V 3.0','JICA_TCM_MS_P_V','JICA',NULL,'Transport','https://storage.googleapis.com/tracad-public-files/DOC/estimation_03_M03_Model shift_2019.pdf','Moderate to low',28,1,2,14,'JICA_Modal Shift (Passenger)','9c516b9a-89f6-419c-a043-eb5fffc5fb6c',1,'Passenger','No','Only CO2','https://storage.googleapis.com/tracad-public-files/PNG/Baseline_JICA_Modal shift.PNG','https://storage.googleapis.com/tracad-public-files/PNG/Project_JICA_Modal Shift.PNG',NULL,NULL,'https://storage.googleapis.com/tracad-public-files/PNG/ER.PNG',10),('-','2022-02-25 14:41:46','-','2022-02-25 14:41:46',0,15,'V 2.0','UNFCCC_AMS_III_BC','CDM',0,'Transport','https://storage.googleapis.com/tracad-public-files/DOC/EB 75_repan24_AMS-III.BC_ver 02.0.pdf','Moderately Resource and Data Intensive',28,1,4,8,'UNFCCC_AMS_III_BC - Emission reductions through improved efficiency of vehicle fleets','d5c7f06d-09ad-4a2b-8f44-65cfd6b369b5',1,'Not specified','No','Only CO2','https://storage.googleapis.com/tracad-public-files/PNG/Baseline_Parameters.PNG','https://storage.googleapis.com/tracad-public-files/PNG/Project_Emission_Equation.PNG',NULL,NULL,'https://storage.googleapis.com/tracad-public-files/PNG/ER.PNG',16),('-','2022-02-25 14:41:46','-','2022-02-25 14:41:46',0,16,'V 1.1.0','UNFCCC_AM0090','CDM',NULL,'Transport','https://storage.googleapis.com/tracad-public-files/DOC/Modal shift in transportation of cargo from road transportation to water or rail transportation.pdf','Highly Resource and Data intensive',28,1,6,6,'UNFCCC_AM0090 - Modal shift in transportation of cargo from road transportation to water or rail transportation','20b5f3f8-cdaf-44b2-a0fa-ff1fc96d0834',1,'Freight','No','Only CO2','https://storage.googleapis.com/tracad-public-files/PNG/Baseline_AM0090.PNG','https://storage.googleapis.com/tracad-public-files/PNG/Project_AM0090.PNG',NULL,NULL,'https://storage.googleapis.com/tracad-public-files/PNG/ER.PNG',17),('-','2022-02-25 14:41:46','-','2022-02-25 14:41:46',0,17,'V 3.0','JICA_RAIWAY_FR_ELECTRI','JICA',NULL,'Transport','https://storage.googleapis.com/tracad-public-files/DOC/estimation_06.pdf','Moderate to low',1,1,2,3,'JICA_Railway_Electrification (Freight)','f1782769-d843-4f9f-b0fc-86e005ae9b86',2,'Freight','No','Only CO2','https://storage.googleapis.com/tracad-public-files/PNG/JICA freight - Baseline - Elecrification.png','https://storage.googleapis.com/tracad-public-files/PNG/JICA Freight - Project Emission.png',NULL,NULL,'https://storage.googleapis.com/tracad-public-files/PNG/JICA freight - Emission Reduction.png',11),('-','2022-02-25 14:41:46','-','2022-02-25 14:41:46',0,18,'V 3.0','JICA_RAIWAY_FR_MODEL','JICA',NULL,'Transport','https://storage.googleapis.com/tracad-public-files/DOC/JICA_Modal shift_Freight.pdf','Moderate to low',1,1,2,3,'JICA_Railway_Modal Shift (Freight)','8db8d400-11ae-40a5-ac7e-ea50c281a3d8',2,'Freight','No','Only CO2','https://storage.googleapis.com/tracad-public-files/PNG/JICA Freight - Baseline Modal shift.png','https://storage.googleapis.com/tracad-public-files/PNG/JICA Freight - Project Emission.png',NULL,NULL,'https://storage.googleapis.com/tracad-public-files/PNG/JICA freight - Emission Reduction copy.png',12),('-','2022-02-25 14:41:46','-','2022-02-25 14:41:46',0,19,'V 3.0','JICA_RAIWAY_PASS_ELECTRI','JICA',NULL,'Transport','https://storage.googleapis.com/tracad-public-files/DOC/estimation_06.pdf','Moderate to low',1,1,2,3,'JICA_Railway_Electrification (Passenger)','9131df7f-75b4-4945-a543-fe905fe24ffc',2,'Passenger','No','Only CO2','https://storage.googleapis.com/tracad-public-files/PNG/JICA passenger - Electrification - Baseline.png','https://storage.googleapis.com/tracad-public-files/PNG/JICA Passenger - Project .png',NULL,NULL,'https://storage.googleapis.com/tracad-public-files/PNG/JICA freight - Emission Reduction copy.png',13),('-','2022-02-25 14:41:46','-','2022-02-25 14:41:46',0,20,'V 3.0','JICA_RAIWAY_PASS_MODEL','JICA',NULL,'Transport','https://storage.googleapis.com/tracad-public-files/DOC/M03_Railway_Passenger_MS_E_2013.pdf','Moderate to low',1,1,2,3,'JICA_Railway_Modal Shift(Passenger)','9cdb209e-b2b6-4f2a-855b-ffcbc73a6065',2,'Passenger','No','Only CO2','https://storage.googleapis.com/tracad-public-files/PNG/Jica Passenger - Modal shift - Baseline.png','https://storage.googleapis.com/tracad-public-files/PNG/JICA Passenger - Project .png',NULL,NULL,'https://storage.googleapis.com/tracad-public-files/PNG/JICA Passenger - Project .png',14),('-','2022-02-25 14:41:46','-','2022-02-25 14:41:46',0,21,'V 15.0','AMS-iii-C','CDM',NULL,'Transport','https://storage.googleapis.com/tracad-public-files/DOC/EB83_repan09_AMS-III.C_ver 15.0.pdf','Moderately Resource and Data Intensive',29,1,4,5,'AMS-iii-C - Emission reductions by electric and hybrid vehicles ','facba004-e573-479f-88e2-da55546f3200',1,'Passenger and Freight','No','Only CO2','https://storage.googleapis.com/tracad-public-files/PNG/Emission reductions by electric and hybrid vehicles 1.PNG','https://storage.googleapis.com/tracad-public-files/PNG/Emission reductions by electric and hybrid vehicles PE 1.PNG',NULL,NULL,'https://storage.googleapis.com/tracad-public-files/PNG/ER.PNG',15),('-','2022-02-25 14:41:46','-','2022-02-25 14:41:46',0,22,'V 1.0','ICAT_TPM_FSR_2020_A','ICAT',0,'Transport','https://climateactiontransparency.org/wp-content/uploads/2020/04/Transport-Pricing-Assessment-Guide.pdf','Highly Resource and Data intensive',29,1,1,1,'ICAT methodology for fuel subsidy removal and increased fuel tax or levy Approach A (top-down energy-use data_Fuel mix)','8d746d4f-7ace-4674-be84-b6221d9fd9be',1,'Not specified','No','Only CO2','https://storage.googleapis.com/tracad-public-files/PNG/Approch A - Baseline.png','https://storage.googleapis.com/tracad-public-files/PNG/Approch A - PE.PNG',NULL,NULL,'https://storage.googleapis.com/tracad-public-files/PNG/ER.PNG',3),('-','2022-02-25 14:41:46','-','2022-02-25 14:41:46',0,23,'V 1.0','ICAT_TPM_FSR_2020_B','ICAT',0,'Transport','https://climateactiontransparency.org/wp-content/uploads/2020/04/Transport-Pricing-Assessment-Guide.pdf','Highly Resource and Data intensive',29,1,1,1,'ICAT methodology for fuel subsidy removal and increased fuel tax or levy _Approach B (top-down energy-use data_Gasoline & Diesel)','4a6ba96b-9f40-4ad2-9b55-ba36a3cedae0',1,'Not specified','No','Only CO2','https://storage.googleapis.com/tracad-public-files/PNG/Approch B - Baseline.PNG','https://storage.googleapis.com/tracad-public-files/PNG/Approch B - PE.PNG',NULL,NULL,'https://storage.googleapis.com/tracad-public-files/PNG/ER.PNG',4),('-','2022-02-25 14:41:46','-','2022-02-25 14:41:46',0,24,'V 1.0','ICAT_TPM_FSR_2020_C','ICAT',0,'Transport','https://climateactiontransparency.org/wp-content/uploads/2020/04/Transport-Pricing-Assessment-Guide.pdf','Highly Resource and Data intensive',29,1,1,1,'ICAT methodology for fuel subsidy removal and increased fuel tax or levy _Approach C (top-down energy-use data & bottom-up travel activity data )','f84290fc-33f1-4c2e-94bb-8b3dca9a7ca7',1,'Not specified','No','Only CO2','https://storage.googleapis.com/tracad-public-files/PNG/Approch C - Baseline.PNG',NULL,NULL,NULL,'https://storage.googleapis.com/tracad-public-files/PNG/ER.PNG',5),('-','2022-02-25 14:41:46','-','2022-02-25 14:41:46',0,25,'V 1.0','ICAT_TPM_RP_2020_Toll_roads','ICAT',0,'Transport','https://climateactiontransparency.org/wp-content/uploads/2020/04/Transport-Pricing-Assessment-Guide.pdf','Highly Resource and Data intensive',29,1,1,1,'ICAT methodology for toll roads and distance-based charges','c7ebadb9-de96-4a19-9791-d38a57f09602',1,'Not specified','No','Only CO2','https://storage.googleapis.com/tracad-public-files/PNG/Toll roads and distance-based charges BE1.PNG','https://storage.googleapis.com/tracad-public-files/PNG/Toll roads and distance-based charges PE 1.PNG',NULL,NULL,'https://storage.googleapis.com/tracad-public-files/PNG/ER.PNG',6),('-','2022-02-25 14:41:46','-','2022-02-25 14:41:46',0,26,'V 1.0','ICAT_TPM_RP_2020_cordon','ICAT',0,'Transport','https://climateactiontransparency.org/wp-content/uploads/2020/04/Transport-Pricing-Assessment-Guide.pdf','Highly Resource and Data intensive',29,1,1,1,'ICAT methodology for cordon pricing','bbb5df0a-3e73-40cd-9fe9-da363cdc96c8',1,'Not specified','No','Only CO2','https://storage.googleapis.com/tracad-public-files/PNG/Cordon pricing BE 1.PNG','https://storage.googleapis.com/tracad-public-files/PNG/Cordon pricing PE 1.PNG',NULL,NULL,'https://storage.googleapis.com/tracad-public-files/PNG/ER.PNG',7),('-','2022-02-25 14:41:46','-','2022-02-25 14:41:46',0,27,'V 1.0','ICAT_TPM_VPI_2020','ICAT',NULL,'Transport','https://climateactiontransparency.org/wp-content/uploads/2020/04/Transport-Pricing-Assessment-Guide.pdf','Highly Resource and Data intensive',29,1,1,1,'ICAT Methodology for Vehicle Purchase Incentives for More Efficient Vehicles','11c95573-2365-4c6f-8ef9-9376fd71c2f9',1,'Not specified','No','Only CO2','https://storage.googleapis.com/tracad-public-files/PNG/Purchase incentives for low-GHG vehicles.PNG','https://storage.googleapis.com/tracad-public-files/PNG/icat.png',NULL,NULL,'https://storage.googleapis.com/tracad-public-files/PNG/ER.PNG',8),('-','2022-02-25 14:41:46','-','2022-02-25 14:41:46',0,28,'V 2.0','AM0110_V_2','CDM',NULL,'Transport','https://storage.googleapis.com/tracad-public-files/DOC/EB83_repan05_AM0110_ver02.0.pdf','Highly Resource and Data intensive',1,1,5,10,'AM0110_V_-Modal shift in transportation of liquid fuels','20e33da9-aa2c-40f7-812c-92e994910108',2,'Freight','No','Only CO2','https://storage.googleapis.com/tracad-public-files/PNG/AM 0110 BE.png','https://storage.googleapis.com/tracad-public-files/PNG/AM 0110 project.png',NULL,NULL,'https://storage.googleapis.com/tracad-public-files/PNG/AM 0110 ER.png',18),('-','2022-02-25 14:41:46','-','2022-02-25 14:41:46',0,29,'V 1.0','CDM_AMS_III_AK_A','CDM',NULL,'Transport','https://storage.googleapis.com/tracad-public-files/DOC/EB98_repan07_AMS-III.AK.pdf','Moderate to low',1,1,3,11,'CDM_AMS_III_AK_ Biodiesel production and use for transport applications-Used defualt emission factor','9f751398-0359-48b0-b8ae-e79f49e8bbfc',2,'Freight','No','Only CO2','https://storage.googleapis.com/tracad-public-files/PNG/AMS IIIAK - Baseline.PNG','https://storage.googleapis.com/tracad-public-files/PNG/AMS IIIAK - Project .png',NULL,'https://storage.googleapis.com/tracad-public-files/PNG/AMS IIIAK - Leakage.png','https://storage.googleapis.com/tracad-public-files/PNG/AMS IIIAK - Emission Reduction.png',19),('-','2022-02-25 14:41:46','-','2022-02-25 14:41:46',0,30,'V 1.0','CDM_AMS_III_AK_B','CDM',NULL,'Transport','https://storage.googleapis.com/tracad-public-files/DOC/EB98_repan07_AMS-III.AK.pdf','Moderate to low',1,1,3,11,'CDM_AMS_III_AK_Biodiesel production and use for transport applications-Used methodological tool','77c16c64-e05c-4431-bcae-0c74ae32c3e8',2,'Freight','No','Only CO2','https://storage.googleapis.com/tracad-public-files/PNG/AMS IIIAK - Baseline.PNG','https://storage.googleapis.com/tracad-public-files/PNG/AMS IIIAK - Project .png',NULL,'https://storage.googleapis.com/tracad-public-files/PNG/AMS IIIAK - Leakage.png','https://storage.googleapis.com/tracad-public-files/PNG/AMS IIIAK - Emission Reduction.png',20),('','2022-08-15 12:17:47','-','2022-02-25 14:41:46',0,52,'V 1.0','UNFCCC_AM0016_V_5_new','CDM',NULL,'Transport','https://storage.googleapis.com/tracad-public-files/DOC/EB110_repan02_ACM0016_(v05.0).pdf','Moderate to low',1,1,1,9,'ACM0016: Mass Rapid Transit Projects','e0bd0013-4292-45fb-b784-2a357bef7e1f',2,'Passenger','No','Only CO2','https://storage.googleapis.com/tracad-public-files/PNG/ACM0016-be.png','https://storage.googleapis.com/tracad-public-files/PNG/ACM0016-pe.png',NULL,'https://storage.googleapis.com/tracad-public-files/PNG/ACM0016-le.png','https://storage.googleapis.com/tracad-public-files/PNG/ER.PNG',21),('','2022-08-18 04:21:32','-','2022-08-18 14:41:46',0,53,'V 4.0','CDM_ACM0017','CDM',NULL,'Transport','https://storage.googleapis.com/tracad-public-files/DOC/EB113_repan15_ACM0017_ver04.pdf','Moderate',1,1,3,12,'ACM0017: Production of biofuel ','fc5d563c-3db7-4e96-aa29-7bcb6767754e',2,'Freight','No','Only CO2','https://storage.googleapis.com/tracad-public-files/PNG/Baseline equation ACM0017.png','https://storage.googleapis.com/tracad-public-files/PNG/Project equation ACM0017.png',NULL,'https://storage.googleapis.com/tracad-public-files/PNG/Leakage equation ACM0017.png','https://storage.googleapis.com/tracad-public-files/PNG/Emission reduction equation ACM0017.png',22),('','2022-08-29 11:47:16','-','2022-08-18 14:41:46',0,54,'V 1.0','CDM_AMS_III_AT','CDM',NULL,'Transport','https://storage.googleapis.com/tracad-public-files/DOC/EB66_repan57_Revison of AMS-III.AT_ver02_.pdf','Moderate',1,1,4,15,'AMS-III.AT.: Transportation energy efficiency activities installing digital tachograph systems to commercial freight transport fleets','a27bf347-126b-4005-8209-d8a924180f6a',2,'Passenger and Freight','No','Only CO2','https://storage.googleapis.com/tracad-public-files/PNG/Baseline equation AMS III AT.png','https://storage.googleapis.com/tracad-public-files/PNG/Project equation AMS III AT.png',NULL,NULL,'https://storage.googleapis.com/tracad-public-files/PNG/ER.PNG',23),('','2022-08-31 09:50:41','-','2022-02-25 14:41:46',0,56,'V 4.0','AMS-iii-S_person','CDM',0,'Transport','https://storage.googleapis.com/tracad-public-files/DOC/EB70_repan29_AMS-III.S_ver04.0.pdf','Moderately Resource and Data Intensive',28,1,3,4,'AMS-III.S - Introduction of low-emission vehicles/technologies to commercial vehicle fleets (Passenger)','171ba448-eefa-4711-9a5c-526dcc4735c0',1,'Passenger',NULL,'Only CO2','https://storage.googleapis.com/tracad-public-files/PNG/Baseline_AMS IIIS_Passenger.PNG','https://storage.googleapis.com/tracad-public-files/PNG/Project_AMS IIIS_Passenger.PNG',NULL,NULL,'https://storage.googleapis.com/tracad-public-files/PNG/ER.PNG',1),('','2022-08-31 09:50:41','-','2022-02-25 14:41:46',0,57,'V 4.0','AMS-iii-S_freight','CDM',0,'Transport','https://storage.googleapis.com/tracad-public-files/DOC/EB70_repan29_AMS-III.S_ver04.0.pdf','Moderately Resource and Data Intensive',28,1,3,4,'AMS-III.S - Introduction of low-emission vehicles/technologies to commercial vehicle fleets (Freight)','1a376cb8-ee25-4b9e-8df2-344e4f878dec',1,'Frieght',NULL,'Only CO2','https://storage.googleapis.com/tracad-public-files/PNG/Baseline_AMS IIIS_Freight.PNG','https://storage.googleapis.com/tracad-public-files/PNG/Project_AMS IIIS_Freight.PNG',NULL,NULL,'https://storage.googleapis.com/tracad-public-files/PNG/ER.PNG',2),('','2022-08-31 09:50:41','-','2022-02-25 14:41:46',0,58,'V 1.0','ICAT_TPM_FSR_2020_A','ICAT',0,'Transport','https://climateactiontransparency.org/wp-content/uploads/2020/04/Transport-Pricing-Assessment-Guide.pdf','Highly Resource and Data intensive',28,1,1,1,'ICAT methodology for fuel subsidy removal and increased fuel tax or levy Approach A (top-down energy-use data_Fuel mix)','dd3a418a-2c10-4c16-95cb-75115172549d',1,'Not specified','No','Only CO2','https://storage.googleapis.com/tracad-public-files/PNG/Approch A - Baseline.png','https://storage.googleapis.com/tracad-public-files/PNG/Approch A - PE.PNG',NULL,NULL,'https://storage.googleapis.com/tracad-public-files/PNG/ER.PNG',3),('','2022-08-31 09:50:41','-','2022-02-25 14:41:46',0,59,'V 1.0','ICAT_TPM_FSR_2020_B','ICAT',0,'Transport','https://climateactiontransparency.org/wp-content/uploads/2020/04/Transport-Pricing-Assessment-Guide.pdf','Highly Resource and Data intensive',28,1,1,1,'ICAT methodology for fuel subsidy removal and increased fuel tax or levy _Approach B (top-down energy-use data_Gasoline & Diesel)','7087bbd7-2e55-4bbc-ac52-374f1e98f9e1',1,'Not specified','No','Only CO2','https://storage.googleapis.com/tracad-public-files/PNG/Approch B - Baseline.PNG','https://storage.googleapis.com/tracad-public-files/PNG/Approch B - PE.PNG',NULL,NULL,'https://storage.googleapis.com/tracad-public-files/PNG/ER.PNG',4),('','2022-08-31 09:50:41','-','2022-02-25 14:41:46',0,60,'V 1.0','ICAT_TPM_FSR_2020_C','ICAT',0,'Transport','https://climateactiontransparency.org/wp-content/uploads/2020/04/Transport-Pricing-Assessment-Guide.pdf','Highly Resource and Data intensive',28,1,1,1,'ICAT methodology for fuel subsidy removal and increased fuel tax or levy _Approach C (top-down energy-use data & bottom-up travel activity data )','8e980874-ccef-4d79-ae84-7fe1f06775e4',1,'Not specified','No','Only CO2','https://storage.googleapis.com/tracad-public-files/PNG/Approch C - Baseline.PNG',NULL,NULL,NULL,'https://storage.googleapis.com/tracad-public-files/PNG/ER.PNG',5),('','2022-08-31 09:50:41','-','2022-02-25 14:41:46',0,61,'V 1.0','ICAT_TPM_RP_2020_Toll_roads','ICAT',0,'Transport','https://climateactiontransparency.org/wp-content/uploads/2020/04/Transport-Pricing-Assessment-Guide.pdf','Highly Resource and Data intensive',28,1,1,1,'ICAT methodology for toll roads and distance-based charges','ca0eb25c-4bf7-4516-8fd5-30b408617713',1,'Not specified','No','Only CO2','https://storage.googleapis.com/tracad-public-files/PNG/Toll roads and distance-based charges BE1.PNG','https://storage.googleapis.com/tracad-public-files/PNG/Toll roads and distance-based charges PE 1.PNG',NULL,NULL,'https://storage.googleapis.com/tracad-public-files/PNG/ER.PNG',6),('','2022-08-31 09:50:41','-','2022-02-25 14:41:46',0,62,'V 1.0','ICAT_TPM_RP_2020_cordon','ICAT',0,'Transport','https://climateactiontransparency.org/wp-content/uploads/2020/04/Transport-Pricing-Assessment-Guide.pdf','Highly Resource and Data intensive',28,1,1,1,'ICAT methodology for cordon pricing','c81af764-414e-44c3-a2cb-86225199d6b8',1,'Not specified','No','Only CO2','https://storage.googleapis.com/tracad-public-files/PNG/Cordon pricing BE 1.PNG','https://storage.googleapis.com/tracad-public-files/PNG/Cordon pricing PE 1.PNG',NULL,NULL,'https://storage.googleapis.com/tracad-public-files/PNG/ER.PNG',7),('','2022-08-31 09:50:41','-','2022-02-25 14:41:46',0,63,'V 1.0','ICAT_TPM_VPI_2020','ICAT',0,'Transport','https://climateactiontransparency.org/wp-content/uploads/2020/04/Transport-Pricing-Assessment-Guide.pdf','Highly Resource and Data intensive',28,1,1,1,'ICAT Methodology for Vehicle Purchase Incentives for More Efficient Vehicles','341d4916-8532-45d7-adc6-c26a4a28f004',1,'Not specified','No','Only CO2','https://storage.googleapis.com/tracad-public-files/PNG/Purchase incentives for low-GHG vehicles.PNG','https://storage.googleapis.com/tracad-public-files/PNG/icat.png',NULL,NULL,'https://storage.googleapis.com/tracad-public-files/PNG/ER.PNG',8),('','2022-08-31 09:50:41','-','2022-02-25 14:41:46',0,64,'V 3.0','JICA_TCM_MS_P_V - trafic','JICA',NULL,'Transport','https://storage.googleapis.com/tracad-public-files/DOC/estimation_03_M03_Model shift_2019.pdf','Moderate to low',28,1,2,13,'JICA_Traffic Congestion (Passenger)','29bdbd05-679c-49d5-a53e-e3b70acaf92a',1,'Passenger','No','Only CO2','https://storage.googleapis.com/tracad-public-files/PNG/Baseline_JICA_Traffic Cogestion.PNG','https://storage.googleapis.com/tracad-public-files/PNG/Project_JICA_Traffic Congestion.PNG',NULL,NULL,'https://storage.googleapis.com/tracad-public-files/PNG/ER.PNG',9),('','2022-08-31 09:50:41','-','2022-02-25 14:41:46',0,65,'V 3.0','JICA_RAIWAY_FR_ELECTRI','JICA',NULL,'Transport','https://storage.googleapis.com/tracad-public-files/DOC/estimation_06.pdf','Moderate to low',28,1,2,3,'JICA_Railway_Electrification (Freight)','e69e1d74-da4b-49c7-88b0-ea994c6d72d2',1,'Frieght','No','Only CO2','https://storage.googleapis.com/tracad-public-files/PNG/JICA freight - Baseline - Elecrification.png','https://storage.googleapis.com/tracad-public-files/PNG/JICA Freight - Project Emission.png',NULL,NULL,'https://storage.googleapis.com/tracad-public-files/PNG/JICA freight - Emission Reduction.png',11),('','2022-08-31 09:50:41','-','2022-02-25 14:41:46',0,66,'V 3.0','JICA_RAIWAY_FR_MODEL','JICA',NULL,'Transport','https://storage.googleapis.com/tracad-public-files/DOC/JICA_Modal shift_Freight.pdf','Moderate to low',28,1,2,3,'JICA_Railway_Modal Shift (Freight)','a65ada4f-1263-462a-aff4-7caf24885a0f',1,'Frieght','No','Only CO2','https://storage.googleapis.com/tracad-public-files/PNG/JICA Freight - Baseline Modal shift.png','https://storage.googleapis.com/tracad-public-files/PNG/JICA Freight - Project Emission.png',NULL,NULL,'https://storage.googleapis.com/tracad-public-files/PNG/JICA freight - Emission Reduction copy.png',12),('','2022-08-31 09:50:41','-','2022-02-25 14:41:46',0,67,'V 3.0','JICA_RAIWAY_PASS_ELECTRI','JICA',NULL,'Transport','https://storage.googleapis.com/tracad-public-files/DOC/estimation_06.pdf','Moderate to low',28,1,2,3,'JICA_Railway_Electrification (Passenger)','0c54d61e-2891-4377-a7c9-0fb0a34b3b2e',1,'Passenger','No','Only CO2','https://storage.googleapis.com/tracad-public-files/PNG/JICA passenger - Electrification - Baseline.png','https://storage.googleapis.com/tracad-public-files/PNG/JICA Passenger - Project .png',NULL,NULL,'https://storage.googleapis.com/tracad-public-files/PNG/JICA freight - Emission Reduction copy.png',13),('','2022-08-31 09:50:41','-','2022-02-25 14:41:46',0,68,'V 3.0','JICA_RAIWAY_PASS_MODEL','JICA',NULL,'Transport','https://storage.googleapis.com/tracad-public-files/DOC/M03_Railway_Passenger_MS_E_2013.pdf','Moderate to low',28,1,2,3,'JICA_Railway_Modal Shift(Passenger)','faccea76-8d21-438b-85b4-92a4defe2e1f',1,'Passenger','No','Only CO2','https://storage.googleapis.com/tracad-public-files/PNG/Jica Passenger - Modal shift - Baseline.png','https://storage.googleapis.com/tracad-public-files/PNG/JICA Passenger - Project .png',NULL,NULL,'https://storage.googleapis.com/tracad-public-files/PNG/JICA Passenger - Project .png',14),('','2022-08-31 09:50:42','-','2022-02-25 14:41:46',0,69,'V 15.0','AMS-iii-C','CDM',NULL,'Transport','https://storage.googleapis.com/tracad-public-files/DOC/EB83_repan09_AMS-III.C_ver 15.0.pdf','Moderately Resource and Data Intensive',28,1,4,5,'AMS-iii-C - Emission reductions by electric and hybrid vehicles ','aa9f080f-234e-4082-93c2-5128033f1de6',1,'Passenger and Freight','No','Only CO2','https://storage.googleapis.com/tracad-public-files/PNG/Emission reductions by electric and hybrid vehicles 1.PNG','https://storage.googleapis.com/tracad-public-files/PNG/Emission reductions by electric and hybrid vehicles PE 1.PNG',NULL,NULL,'https://storage.googleapis.com/tracad-public-files/PNG/ER.PNG',15),('','2022-08-31 09:50:42','-','2022-02-25 14:41:46',0,70,'V 2.0','AM0110_V_2','CDM',NULL,'Transport','https://storage.googleapis.com/tracad-public-files/DOC/EB83_repan05_AM0110_ver02.0.pdf','Highly Resource and Data intensive',28,1,5,10,'AM0110_V_-Modal shift in transportation of liquid fuels','4bc9ce78-ddd0-4c42-8391-ef3969ff1768',1,'Freight','No','Only CO2','https://storage.googleapis.com/tracad-public-files/PNG/AM 0110 BE.png','https://storage.googleapis.com/tracad-public-files/PNG/AM 0110 project.png',NULL,NULL,'https://storage.googleapis.com/tracad-public-files/PNG/AM 0110 ER.png',18),('','2022-08-31 09:50:42','-','2022-02-25 14:41:46',0,71,'V 1.0','CDM_AMS_III_AK_A','CDM',NULL,'Transport','https://storage.googleapis.com/tracad-public-files/DOC/EB98_repan07_AMS-III.AK.pdf','Moderate to low',28,1,3,11,'CDM_AMS_III_AK_ Biodiesel production and use for transport applications-Used defualt emission factor','0cdeeb61-2c20-46e6-9e7e-d3b4aa5b591c',1,'Freight','No','Only CO2','https://storage.googleapis.com/tracad-public-files/PNG/AMS IIIAK - Baseline.PNG','https://storage.googleapis.com/tracad-public-files/PNG/AMS IIIAK - Project .png',NULL,'https://storage.googleapis.com/tracad-public-files/PNG/AMS IIIAK - Leakage.png','https://storage.googleapis.com/tracad-public-files/PNG/AMS IIIAK - Emission Reduction.png',19),('','2022-08-31 09:50:42','-','2022-02-25 14:41:46',0,72,'V 1.0','CDM_AMS_III_AK_B','CDM',NULL,'Transport','https://storage.googleapis.com/tracad-public-files/DOC/EB98_repan07_AMS-III.AK.pdf','Moderate to low',28,1,3,11,'CDM_AMS_III_AK_Biodiesel production and use for transport applications-Used methodological tool','2ec621b8-5041-4a1a-978f-e9cebe8c959c',1,'Freight','No','Only CO2','https://storage.googleapis.com/tracad-public-files/PNG/AMS IIIAK - Baseline.PNG','https://storage.googleapis.com/tracad-public-files/PNG/AMS IIIAK - Project .png',NULL,'https://storage.googleapis.com/tracad-public-files/PNG/AMS IIIAK - Leakage.png','https://storage.googleapis.com/tracad-public-files/PNG/AMS IIIAK - Emission Reduction.png',20),('','2022-08-31 09:50:42','-','2022-08-18 14:41:46',0,73,'V 4.0','CDM_ACM0017','CDM',NULL,'Transport','https://storage.googleapis.com/tracad-public-files/DOC/EB113_repan15_ACM0017_ver04.pdf','Moderate',28,1,3,12,'ACM0017: Production of biofuel ','845bbef4-36e4-484a-8aff-10a2f939d41f',1,'Freight','No','Only CO2','https://storage.googleapis.com/tracad-public-files/PNG/Baseline equation ACM0017.png','https://storage.googleapis.com/tracad-public-files/PNG/Project equation ACM0017.png',NULL,'https://storage.googleapis.com/tracad-public-files/PNG/Leakage equation ACM0017.png','https://storage.googleapis.com/tracad-public-files/PNG/Emission reduction equation ACM0017.png',22),('','2022-08-31 10:02:20','-','2022-08-18 14:41:46',0,74,'V 8.0','AM0031','CDM',NULL,'Transport','https://storage.googleapis.com/tracad-public-files/DOC/EB110_repan03_AM0031 (v08.0).pdf','Moderately resource and data intensive',1,1,6,16,'AM0031-Bus rapid transit projects','66d959c1-0169-40d8-b090-0ad18f8623cf',2,'Passenger','No','Only CO2','https://storage.googleapis.com/tracad-public-files/PNG/Baseline equation AM0031.png','https://storage.googleapis.com/tracad-public-files/PNG/Leakage equation AM0031.png',NULL,'https://storage.googleapis.com/tracad-public-files/PNG/Leakage equation AM0031.png','https://storage.googleapis.com/tracad-public-files/PNG/Emission reduction equation AM0031.png',24),('','2022-09-01 03:48:52','-','2022-08-18 14:41:46',0,76,'V 1.0','CDM_AMS_III_AT','CDM',NULL,'Transport','https://storage.googleapis.com/tracad-public-files/DOC/EB66_repan57_Revison of AMS-III.AT_ver02_.pdf','Moderate',28,1,4,15,'AMS-III.AT.: Transportation energy efficiency activities installing digital tachograph systems to commercial freight transport fleets','04f1f27c-4a4a-42d6-8d00-b9dcbc96eb85',1,'Passenger and Freight','No','Only CO2','https://storage.googleapis.com/tracad-public-files/PNG/Baseline equation AMS III AT.png','https://storage.googleapis.com/tracad-public-files/PNG/Project equation AMS III AT.png',NULL,NULL,'https://storage.googleapis.com/tracad-public-files/PNG/ER.PNG',23),('','2022-09-06 11:00:22','-','2022-08-18 14:41:46',0,78,'V 1.0','CDM_AMS_III_BN','CDM',NULL,'Transport','','Moderate to low',1,1,4,17,'CDM_AMS_III_BN-Efficient operation of public transportation','90a396db-b6d8-43e8-8860-9a79d9c5a686',2,'Passenger','No','Only CO2','https://storage.googleapis.com/tracad-public-files/PNG/Baseline equation AMS III BN.png','https://storage.googleapis.com/tracad-public-files/PNG/Project equation AMS III BN.png',NULL,NULL,'https://storage.googleapis.com/tracad-public-files/PNG/Emission reduction equation AMS III BN.png',25),('','2022-10-04 09:01:25','-','2022-02-25 14:41:46',0,79,'V 4.0','AMS-iii-S_person','CDM',0,'Transport','https://storage.googleapis.com/tracad-public-files/DOC/EB70_repan29_AMS-III.S_ver04.0.pdf','Moderately Resource and Data Intensive',29,1,3,4,'AMS-III.S - Introduction of low-emission vehicles/technologies to commercial vehicle fleets (Passenger)','d81e5999-0e1a-4de4-bbce-0810115580fe',1,'Passenger',NULL,'Only CO2','https://storage.googleapis.com/tracad-public-files/PNG/Baseline_AMS IIIS_Passenger.PNG','https://storage.googleapis.com/tracad-public-files/PNG/Project_AMS IIIS_Passenger.PNG',NULL,NULL,'https://storage.googleapis.com/tracad-public-files/PNG/ER.PNG',1),('','2022-10-04 09:01:25','-','2022-02-25 14:41:46',0,80,'V 4.0','AMS-iii-S_freight','CDM',0,'Transport','https://storage.googleapis.com/tracad-public-files/DOC/EB70_repan29_AMS-III.S_ver04.0.pdf','Moderately Resource and Data Intensive',29,1,3,4,'AMS-III.S - Introduction of low-emission vehicles/technologies to commercial vehicle fleets (Freight)','64a52aef-2679-4059-ace5-549125022360',1,'Frieght',NULL,'Only CO2','https://storage.googleapis.com/tracad-public-files/PNG/Baseline_AMS IIIS_Freight.PNG','https://storage.googleapis.com/tracad-public-files/PNG/Project_AMS IIIS_Freight.PNG',NULL,NULL,'https://storage.googleapis.com/tracad-public-files/PNG/ER.PNG',2),('','2022-10-04 09:01:25','-','2022-02-25 14:41:46',0,81,'V 3.0','JICA_TCM_MS_P_V - trafic','JICA',NULL,'Transport','https://storage.googleapis.com/tracad-public-files/DOC/estimation_03_M03_Model shift_2019.pdf','Moderate to low',29,1,2,13,'JICA_Traffic Congestion (Passenger)','8a8ec1fe-454a-416f-9725-9538e4bb240f',1,'Passenger','No','Only CO2','https://storage.googleapis.com/tracad-public-files/PNG/Baseline_JICA_Traffic Cogestion.PNG','https://storage.googleapis.com/tracad-public-files/PNG/Project_JICA_Traffic Congestion.PNG',NULL,NULL,'https://storage.googleapis.com/tracad-public-files/PNG/ER.PNG',9),('','2022-10-04 09:01:25','-','2022-02-25 14:41:46',0,82,'V 3.0','JICA_TCM_MS_P_V','JICA',NULL,'Transport','https://storage.googleapis.com/tracad-public-files/DOC/estimation_03_M03_Model shift_2019.pdf','Moderate to low',29,1,2,14,'JICA_Modal Shift (Passenger)','45f92c12-c0c6-4cef-a28f-47c914567926',1,'Passenger','No','Only CO2','https://storage.googleapis.com/tracad-public-files/PNG/Baseline_JICA_Modal shift.PNG','https://storage.googleapis.com/tracad-public-files/PNG/Project_JICA_Modal Shift.PNG',NULL,NULL,'https://storage.googleapis.com/tracad-public-files/PNG/ER.PNG',10),('','2022-10-04 09:01:25','-','2022-02-25 14:41:46',0,83,'V 3.0','JICA_RAIWAY_FR_ELECTRI','JICA',NULL,'Transport','https://storage.googleapis.com/tracad-public-files/DOC/estimation_06.pdf','Moderate to low',29,1,2,3,'JICA_Railway_Electrification (Freight)','acb97f85-2991-4e77-bdc9-9ca0e9fb346a',1,'Frieght','No','Only CO2','https://storage.googleapis.com/tracad-public-files/PNG/JICA freight - Baseline - Elecrification.png','https://storage.googleapis.com/tracad-public-files/PNG/JICA Freight - Project Emission.png',NULL,NULL,'https://storage.googleapis.com/tracad-public-files/PNG/JICA freight - Emission Reduction.png',11),('','2022-10-04 09:01:25','-','2022-02-25 14:41:46',0,84,'V 3.0','JICA_RAIWAY_FR_MODEL','JICA',NULL,'Transport','https://storage.googleapis.com/tracad-public-files/DOC/JICA_Modal shift_Freight.pdf','Moderate to low',29,1,2,3,'JICA_Railway_Modal Shift (Freight)','1be7b0e7-5e74-4489-9cc3-4f9a034cd193',1,'Frieght','No','Only CO2','https://storage.googleapis.com/tracad-public-files/PNG/JICA Freight - Baseline Modal shift.png','https://storage.googleapis.com/tracad-public-files/PNG/JICA Freight - Project Emission.png',NULL,NULL,'https://storage.googleapis.com/tracad-public-files/PNG/JICA freight - Emission Reduction copy.png',12),('','2022-10-04 09:01:25','-','2022-02-25 14:41:46',0,85,'V 3.0','JICA_RAIWAY_PASS_ELECTRI','JICA',NULL,'Transport','https://storage.googleapis.com/tracad-public-files/DOC/estimation_06.pdf','Moderate to low',29,1,2,3,'JICA_Railway_Electrification (Passenger)','3c19bff5-a99b-4cf3-96fa-0be023953492',1,'Passenger','No','Only CO2','https://storage.googleapis.com/tracad-public-files/PNG/JICA passenger - Electrification - Baseline.png','https://storage.googleapis.com/tracad-public-files/PNG/JICA Passenger - Project .png',NULL,NULL,'https://storage.googleapis.com/tracad-public-files/PNG/JICA freight - Emission Reduction copy.png',13),('','2022-10-04 09:01:25','-','2022-02-25 14:41:46',0,86,'V 3.0','JICA_RAIWAY_PASS_MODEL','JICA',NULL,'Transport','https://storage.googleapis.com/tracad-public-files/DOC/M03_Railway_Passenger_MS_E_2013.pdf','Moderate to low',29,1,2,3,'JICA_Railway_Modal Shift(Passenger)','6f1f1c11-630e-4976-93a4-817afae1e6fb',1,'Passenger','No','Only CO2','https://storage.googleapis.com/tracad-public-files/PNG/Jica Passenger - Modal shift - Baseline.png','https://storage.googleapis.com/tracad-public-files/PNG/JICA Passenger - Project .png',NULL,NULL,'https://storage.googleapis.com/tracad-public-files/PNG/JICA Passenger - Project .png',14),('','2022-10-04 09:01:25','-','2022-02-25 14:41:46',0,87,'V 2.0','UNFCCC_AMS_III_BC','CDM',NULL,'Transport','https://storage.googleapis.com/tracad-public-files/DOC/EB 75_repan24_AMS-III.BC_ver 02.0.pdf','Moderately Resource and Data Intensive',29,1,4,8,'UNFCCC_AMS_III_BC - Emission reductions through improved efficiency of vehicle fleets','91018ad1-18ba-43fa-b98b-cdb872df804a',1,'Not specified','No','Only CO2','https://storage.googleapis.com/tracad-public-files/PNG/Baseline_Parameters.PNG','https://storage.googleapis.com/tracad-public-files/PNG/Project_Emission_Equation.PNG',NULL,NULL,'https://storage.googleapis.com/tracad-public-files/PNG/ER.PNG',16),('','2022-10-04 09:01:26','-','2022-02-25 14:41:46',0,88,'V 1.1.0','UNFCCC_AM0090','CDM',NULL,'Transport','https://storage.googleapis.com/tracad-public-files/DOC/Modal shift in transportation of cargo from road transportation to water or rail transportation.pdf','Highly Resource and Data intensive',29,1,6,6,'UNFCCC_AM0090 - Modal shift in transportation of cargo from road transportation to water or rail transportation','c07af74a-7c28-40f0-af78-34aa08e994b5',1,'Freight','No','Only CO2','https://storage.googleapis.com/tracad-public-files/PNG/Baseline_AM0090.PNG','https://storage.googleapis.com/tracad-public-files/PNG/Project_AM0090.PNG',NULL,NULL,'https://storage.googleapis.com/tracad-public-files/PNG/ER.PNG',17),('','2022-10-04 09:01:26','-','2022-02-25 14:41:46',0,89,'V 2.0','AM0110_V_2','CDM',NULL,'Transport','https://storage.googleapis.com/tracad-public-files/DOC/EB83_repan05_AM0110_ver02.0.pdf','Highly Resource and Data intensive',29,1,5,10,'AM0110_V_-Modal shift in transportation of liquid fuels','c29d4ce3-86f5-4be5-82d6-46d7f95a3b3a',1,'Freight','No','Only CO2','https://storage.googleapis.com/tracad-public-files/PNG/AM 0110 BE.png','https://storage.googleapis.com/tracad-public-files/PNG/AM 0110 project.png',NULL,NULL,'https://storage.googleapis.com/tracad-public-files/PNG/AM 0110 ER.png',18),('','2022-10-04 09:01:26','-','2022-02-25 14:41:46',0,90,'V 1.0','CDM_AMS_III_AK_A','CDM',NULL,'Transport','https://storage.googleapis.com/tracad-public-files/DOC/EB98_repan07_AMS-III.AK.pdf','Moderate to low',29,1,3,11,'CDM_AMS_III_AK_ Biodiesel production and use for transport applications-Used defualt emission factor','e8375cf5-2abc-491a-99c8-c4eacbdfebb6',1,'Freight','No','Only CO2','https://storage.googleapis.com/tracad-public-files/PNG/AMS IIIAK - Baseline.PNG','https://storage.googleapis.com/tracad-public-files/PNG/AMS IIIAK - Project .png',NULL,'https://storage.googleapis.com/tracad-public-files/PNG/AMS IIIAK - Leakage.png','https://storage.googleapis.com/tracad-public-files/PNG/AMS IIIAK - Emission Reduction.png',19),('','2022-10-04 09:01:26','-','2022-02-25 14:41:46',0,91,'V 1.0','CDM_AMS_III_AK_B','CDM',NULL,'Transport','https://storage.googleapis.com/tracad-public-files/DOC/EB98_repan07_AMS-III.AK.pdf','Moderate to low',29,1,3,11,'CDM_AMS_III_AK_Biodiesel production and use for transport applications-Used methodological tool','1a2fb63d-00f7-4002-b9ac-7b050ec4323f',1,'Freight','No','Only CO2','https://storage.googleapis.com/tracad-public-files/PNG/AMS IIIAK - Baseline.PNG','https://storage.googleapis.com/tracad-public-files/PNG/AMS IIIAK - Project .png',NULL,'https://storage.googleapis.com/tracad-public-files/PNG/AMS IIIAK - Leakage.png','https://storage.googleapis.com/tracad-public-files/PNG/AMS IIIAK - Emission Reduction.png',20),('','2022-10-04 09:01:26','-','2022-02-25 14:41:46',0,92,'V 1.0','UNFCCC_AM0016_V_5_new','CDM',NULL,'Transport','https://storage.googleapis.com/tracad-public-files/DOC/EB110_repan02_ACM0016_(v05.0).pdf','Moderate to low',29,1,1,9,'ACM0016: Mass Rapid Transit Projects','3187e33b-2f46-452d-b7f0-7a1d547b9e8f',1,'Passenger','No','Only CO2','https://storage.googleapis.com/tracad-public-files/PNG/ACM0016-be.png','https://storage.googleapis.com/tracad-public-files/PNG/ACM0016-pe.png',NULL,'https://storage.googleapis.com/tracad-public-files/PNG/ACM0016-le.png','https://storage.googleapis.com/tracad-public-files/PNG/ER.PNG',21),('','2022-10-04 09:01:26','-','2022-08-18 14:41:46',0,93,'V 4.0','CDM_ACM0017','CDM',NULL,'Transport','https://storage.googleapis.com/tracad-public-files/DOC/EB113_repan15_ACM0017_ver04.pdf','Moderate',29,1,3,12,'ACM0017: Production of biofuel ','f4e0c165-bedb-4447-b0e5-45582d36cb47',1,'Freight','No','Only CO2','https://storage.googleapis.com/tracad-public-files/PNG/Baseline equation ACM0017.png','https://storage.googleapis.com/tracad-public-files/PNG/Project equation ACM0017.png',NULL,'https://storage.googleapis.com/tracad-public-files/PNG/Leakage equation ACM0017.png','https://storage.googleapis.com/tracad-public-files/PNG/Emission reduction equation ACM0017.png',22),('','2022-10-04 09:01:26','-','2022-08-18 14:41:46',0,94,'V 1.0','CDM_AMS_III_AT','CDM',NULL,'Transport','https://storage.googleapis.com/tracad-public-files/DOC/EB66_repan57_Revison of AMS-III.AT_ver02_.pdf','Moderate',29,1,4,15,'AMS-III.AT.: Transportation energy efficiency activities installing digital tachograph systems to commercial freight transport fleets','5741021a-6f8d-47a3-a24a-65555ec05ac8',1,'Passenger and Freight','No','Only CO2','https://storage.googleapis.com/tracad-public-files/PNG/Baseline equation AMS III AT.png','https://storage.googleapis.com/tracad-public-files/PNG/Project equation AMS III AT.png',NULL,NULL,'https://storage.googleapis.com/tracad-public-files/PNG/ER.PNG',23),('','2022-10-04 09:01:26','-','2022-08-18 14:41:46',0,95,'V 8.0','AM0031','CDM',NULL,'Transport','https://storage.googleapis.com/tracad-public-files/DOC/EB110_repan03_AM0031 (v08.0).pdf','Moderately resource and data intensive',29,1,6,16,'AM0031-Bus rapid transit projects','189f8d8e-54d5-4c9b-a2ec-4c3117b9e42a',1,'Passenger','No','Only CO2','https://storage.googleapis.com/tracad-public-files/PNG/Baseline equation AM0031.png','https://storage.googleapis.com/tracad-public-files/PNG/Leakage equation AM0031.png',NULL,'https://storage.googleapis.com/tracad-public-files/PNG/Leakage equation AM0031.png','https://storage.googleapis.com/tracad-public-files/PNG/Emission reduction equation AM0031.png',24),('','2022-10-04 09:01:26','-','2022-08-18 14:41:46',0,96,'V 1.0','CDM_AMS_III_BN','CDM',NULL,'Transport','','Moderate to low',29,1,4,17,'CDM_AMS_III_BN-Efficient operation of public transportation','c295f0af-5ba1-496f-b548-709c7f6bcb74',1,'Passenger','No','Only CO2','https://storage.googleapis.com/tracad-public-files/PNG/Baseline equation AMS III BN.png','https://storage.googleapis.com/tracad-public-files/PNG/Project equation AMS III BN.png',NULL,NULL,'https://storage.googleapis.com/tracad-public-files/PNG/Emission reduction equation AMS III BN.png',25),('','2022-10-11 03:07:46','-','2022-02-25 14:41:46',0,97,'V 4.0','AMS-iii-S_person','CDM',0,'Transport','https://storage.googleapis.com/tracad-public-files/DOC/EB70_repan29_AMS-III.S_ver04.0.pdf','Moderately Resource and Data Intensive',32,1,3,4,'AMS-III.S - Introduction of low-emission vehicles/technologies to commercial vehicle fleets (Passenger)','169c4305-5bbf-4077-a371-f698f5111e76',1,'Passenger',NULL,'Only CO2','https://storage.googleapis.com/tracad-public-files/PNG/Baseline_AMS IIIS_Passenger.PNG','https://storage.googleapis.com/tracad-public-files/PNG/Project_AMS IIIS_Passenger.PNG',NULL,NULL,'https://storage.googleapis.com/tracad-public-files/PNG/ER.PNG',1),('','2022-10-11 03:07:46','-','2022-02-25 14:41:46',0,98,'V 4.0','AMS-iii-S_freight','CDM',0,'Transport','https://storage.googleapis.com/tracad-public-files/DOC/EB70_repan29_AMS-III.S_ver04.0.pdf','Moderately Resource and Data Intensive',32,1,3,4,'AMS-III.S - Introduction of low-emission vehicles/technologies to commercial vehicle fleets (Freight)','ce577770-5821-436a-90af-47cce61ff67e',1,'Frieght',NULL,'Only CO2','https://storage.googleapis.com/tracad-public-files/PNG/Baseline_AMS IIIS_Freight.PNG','https://storage.googleapis.com/tracad-public-files/PNG/Project_AMS IIIS_Freight.PNG',NULL,NULL,'https://storage.googleapis.com/tracad-public-files/PNG/ER.PNG',2),('','2022-10-11 03:07:46','-','2022-02-25 14:41:46',0,99,'V 1.0','ICAT_TPM_FSR_2020_A','ICAT',0,'Transport','https://climateactiontransparency.org/wp-content/uploads/2020/04/Transport-Pricing-Assessment-Guide.pdf','Highly Resource and Data intensive',32,1,1,1,'ICAT methodology for fuel subsidy removal and increased fuel tax or levy Approach A (top-down energy-use data_Fuel mix)','20e7f6f9-e7f3-4281-bda7-f49e95c29004',1,'Not specified','No','Only CO2','https://storage.googleapis.com/tracad-public-files/PNG/Approch A - Baseline.png','https://storage.googleapis.com/tracad-public-files/PNG/Approch A - PE.PNG',NULL,NULL,'https://storage.googleapis.com/tracad-public-files/PNG/ER.PNG',3),('','2022-10-11 03:07:46','-','2022-02-25 14:41:46',0,100,'V 1.0','ICAT_TPM_RP_2020_cordon','ICAT',0,'Transport','https://climateactiontransparency.org/wp-content/uploads/2020/04/Transport-Pricing-Assessment-Guide.pdf','Highly Resource and Data intensive',32,1,1,1,'ICAT methodology for cordon pricing','eabcf1bd-2a04-4d25-81cb-a148364d8828',1,'Not specified','No','Only CO2','https://storage.googleapis.com/tracad-public-files/PNG/Cordon pricing BE 1.PNG','https://storage.googleapis.com/tracad-public-files/PNG/Cordon pricing PE 1.PNG',NULL,NULL,'https://storage.googleapis.com/tracad-public-files/PNG/ER.PNG',7),('','2022-10-11 03:07:46','-','2022-02-25 14:41:46',0,101,'V 1.0','ICAT_TPM_FSR_2020_B','ICAT',0,'Transport','https://climateactiontransparency.org/wp-content/uploads/2020/04/Transport-Pricing-Assessment-Guide.pdf','Highly Resource and Data intensive',32,1,1,1,'ICAT methodology for fuel subsidy removal and increased fuel tax or levy _Approach B (top-down energy-use data_Gasoline & Diesel)','4ea0e079-3a8b-4e37-a72b-114e9905320a',1,'Not specified','No','Only CO2','https://storage.googleapis.com/tracad-public-files/PNG/Approch B - Baseline.PNG','https://storage.googleapis.com/tracad-public-files/PNG/Approch B - PE.PNG',NULL,NULL,'https://storage.googleapis.com/tracad-public-files/PNG/ER.PNG',4),('','2022-10-11 03:07:46','-','2022-02-25 14:41:46',0,102,'V 1.0','ICAT_TPM_RP_2020_Toll_roads','ICAT',0,'Transport','https://climateactiontransparency.org/wp-content/uploads/2020/04/Transport-Pricing-Assessment-Guide.pdf','Highly Resource and Data intensive',32,1,1,1,'ICAT methodology for toll roads and distance-based charges','2c427fba-36c2-4f4d-9b85-67d196e6d960',1,'Not specified','No','Only CO2','https://storage.googleapis.com/tracad-public-files/PNG/Toll roads and distance-based charges BE1.PNG','https://storage.googleapis.com/tracad-public-files/PNG/Toll roads and distance-based charges PE 1.PNG',NULL,NULL,'https://storage.googleapis.com/tracad-public-files/PNG/ER.PNG',6),('','2022-10-11 03:07:46','-','2022-02-25 14:41:46',0,103,'V 1.0','ICAT_TPM_VPI_2020','ICAT',0,'Transport','https://climateactiontransparency.org/wp-content/uploads/2020/04/Transport-Pricing-Assessment-Guide.pdf','Highly Resource and Data intensive',32,1,1,1,'ICAT Methodology for Vehicle Purchase Incentives for More Efficient Vehicles','946fe4b6-c92a-4000-8746-ca10663d974d',1,'Not specified','No','Only CO2','https://storage.googleapis.com/tracad-public-files/PNG/Purchase incentives for low-GHG vehicles.PNG','https://storage.googleapis.com/tracad-public-files/PNG/icat.png',NULL,NULL,'https://storage.googleapis.com/tracad-public-files/PNG/ER.PNG',8),('','2022-10-11 03:07:46','-','2022-02-25 14:41:46',0,104,'V 3.0','JICA_TCM_MS_P_V - trafic','JICA',NULL,'Transport','https://storage.googleapis.com/tracad-public-files/DOC/estimation_03_M03_Model shift_2019.pdf','Moderate to low',32,1,2,13,'JICA_Traffic Congestion (Passenger)','862fae49-49df-4084-8557-5ab07cc6744f',1,'Passenger','No','Only CO2','https://storage.googleapis.com/tracad-public-files/PNG/Baseline_JICA_Traffic Cogestion.PNG','https://storage.googleapis.com/tracad-public-files/PNG/Project_JICA_Traffic Congestion.PNG',NULL,NULL,'https://storage.googleapis.com/tracad-public-files/PNG/ER.PNG',9),('','2022-10-11 03:07:46','-','2022-02-25 14:41:46',0,105,'V 3.0','JICA_TCM_MS_P_V','JICA',NULL,'Transport','https://storage.googleapis.com/tracad-public-files/DOC/estimation_03_M03_Model shift_2019.pdf','Moderate to low',32,1,2,14,'JICA_Modal Shift (Passenger)','aabbb547-18c8-4d4c-a205-98ce468e394f',1,'Passenger','No','Only CO2','https://storage.googleapis.com/tracad-public-files/PNG/Baseline_JICA_Modal shift.PNG','https://storage.googleapis.com/tracad-public-files/PNG/Project_JICA_Modal Shift.PNG',NULL,NULL,'https://storage.googleapis.com/tracad-public-files/PNG/ER.PNG',10),('','2022-10-11 03:07:46','-','2022-02-25 14:41:46',0,106,'V 1.0','ICAT_TPM_FSR_2020_C','ICAT',0,'Transport','https://climateactiontransparency.org/wp-content/uploads/2020/04/Transport-Pricing-Assessment-Guide.pdf','Highly Resource and Data intensive',32,1,1,1,'ICAT methodology for fuel subsidy removal and increased fuel tax or levy _Approach C (top-down energy-use data & bottom-up travel activity data )','b8b3f93b-64fd-4415-a0db-743840a0e0e7',1,'Not specified','No','Only CO2','https://storage.googleapis.com/tracad-public-files/PNG/Approch C - Baseline.PNG',NULL,NULL,NULL,'https://storage.googleapis.com/tracad-public-files/PNG/ER.PNG',5),('','2022-10-11 03:07:46','-','2022-02-25 14:41:46',0,107,'V 3.0','JICA_RAIWAY_FR_MODEL','JICA',NULL,'Transport','https://storage.googleapis.com/tracad-public-files/DOC/JICA_Modal shift_Freight.pdf','Moderate to low',32,1,2,3,'JICA_Railway_Modal Shift (Freight)','4f0981fd-dc79-4112-8ce2-e1672129ba0a',1,'Frieght','No','Only CO2','https://storage.googleapis.com/tracad-public-files/PNG/JICA Freight - Baseline Modal shift.png','https://storage.googleapis.com/tracad-public-files/PNG/JICA Freight - Project Emission.png',NULL,NULL,'https://storage.googleapis.com/tracad-public-files/PNG/JICA freight - Emission Reduction copy.png',12),('','2022-10-11 03:07:46','-','2022-02-25 14:41:46',0,108,'V 3.0','JICA_RAIWAY_FR_ELECTRI','JICA',NULL,'Transport','https://storage.googleapis.com/tracad-public-files/DOC/estimation_06.pdf','Moderate to low',32,1,2,3,'JICA_Railway_Electrification (Freight)','75a7630e-6490-44c3-9f98-b7e020d05385',1,'Frieght','No','Only CO2','https://storage.googleapis.com/tracad-public-files/PNG/JICA freight - Baseline - Elecrification.png','https://storage.googleapis.com/tracad-public-files/PNG/JICA Freight - Project Emission.png',NULL,NULL,'https://storage.googleapis.com/tracad-public-files/PNG/JICA freight - Emission Reduction.png',11),('','2022-10-11 03:07:47','-','2022-02-25 14:41:46',0,109,'V 3.0','JICA_RAIWAY_PASS_ELECTRI','JICA',NULL,'Transport','https://storage.googleapis.com/tracad-public-files/DOC/estimation_06.pdf','Moderate to low',32,1,2,3,'JICA_Railway_Electrification (Passenger)','5eb6908d-b200-4065-b510-6984e38e1f60',1,'Passenger','No','Only CO2','https://storage.googleapis.com/tracad-public-files/PNG/JICA passenger - Electrification - Baseline.png','https://storage.googleapis.com/tracad-public-files/PNG/JICA Passenger - Project .png',NULL,NULL,'https://storage.googleapis.com/tracad-public-files/PNG/JICA freight - Emission Reduction copy.png',13),('','2022-10-11 03:07:47','-','2022-02-25 14:41:46',0,110,'V 3.0','JICA_RAIWAY_PASS_MODEL','JICA',NULL,'Transport','https://storage.googleapis.com/tracad-public-files/DOC/M03_Railway_Passenger_MS_E_2013.pdf','Moderate to low',32,1,2,3,'JICA_Railway_Modal Shift(Passenger)','70de69a9-f117-4867-8fb8-fc78e05024f1',1,'Passenger','No','Only CO2','https://storage.googleapis.com/tracad-public-files/PNG/Jica Passenger - Modal shift - Baseline.png','https://storage.googleapis.com/tracad-public-files/PNG/JICA Passenger - Project .png',NULL,NULL,'https://storage.googleapis.com/tracad-public-files/PNG/JICA Passenger - Project .png',14),('','2022-10-11 03:07:47','-','2022-02-25 14:41:46',0,111,'V 15.0','AMS-iii-C','CDM',NULL,'Transport','https://storage.googleapis.com/tracad-public-files/DOC/EB83_repan09_AMS-III.C_ver 15.0.pdf','Moderately Resource and Data Intensive',32,1,4,5,'AMS-iii-C - Emission reductions by electric and hybrid vehicles ','fcf8e4f2-5b33-4285-87d2-3244bee5c755',1,'Passenger and Freight','No','Only CO2','https://storage.googleapis.com/tracad-public-files/PNG/Emission reductions by electric and hybrid vehicles 1.PNG','https://storage.googleapis.com/tracad-public-files/PNG/Emission reductions by electric and hybrid vehicles PE 1.PNG',NULL,NULL,'https://storage.googleapis.com/tracad-public-files/PNG/ER.PNG',15),('','2022-10-11 03:07:47','-','2022-02-25 14:41:46',0,112,'V 2.0','UNFCCC_AMS_III_BC','CDM',NULL,'Transport','https://storage.googleapis.com/tracad-public-files/DOC/EB 75_repan24_AMS-III.BC_ver 02.0.pdf','Moderately Resource and Data Intensive',32,1,4,8,'UNFCCC_AMS_III_BC - Emission reductions through improved efficiency of vehicle fleets','621d5b43-5126-4650-81ea-69f0eccd0c21',1,'Not specified','No','Only CO2','https://storage.googleapis.com/tracad-public-files/PNG/Baseline_Parameters.PNG','https://storage.googleapis.com/tracad-public-files/PNG/Project_Emission_Equation.PNG',NULL,NULL,'https://storage.googleapis.com/tracad-public-files/PNG/ER.PNG',16),('','2022-10-11 03:07:47','-','2022-02-25 14:41:46',0,113,'V 1.1.0','UNFCCC_AM0090','CDM',NULL,'Transport','https://storage.googleapis.com/tracad-public-files/DOC/Modal shift in transportation of cargo from road transportation to water or rail transportation.pdf','Highly Resource and Data intensive',32,1,6,6,'UNFCCC_AM0090 - Modal shift in transportation of cargo from road transportation to water or rail transportation','b8a68cef-7c95-41e1-b92f-be30af953aa5',1,'Freight','No','Only CO2','https://storage.googleapis.com/tracad-public-files/PNG/Baseline_AM0090.PNG','https://storage.googleapis.com/tracad-public-files/PNG/Project_AM0090.PNG',NULL,NULL,'https://storage.googleapis.com/tracad-public-files/PNG/ER.PNG',17),('','2022-10-11 03:07:47','-','2022-02-25 14:41:46',0,114,'V 2.0','AM0110_V_2','CDM',NULL,'Transport','https://storage.googleapis.com/tracad-public-files/DOC/EB83_repan05_AM0110_ver02.0.pdf','Highly Resource and Data intensive',32,1,5,10,'AM0110_V_-Modal shift in transportation of liquid fuels','3838653d-68d1-469e-a289-6f24203e97d9',1,'Freight','No','Only CO2','https://storage.googleapis.com/tracad-public-files/PNG/AM 0110 BE.png','https://storage.googleapis.com/tracad-public-files/PNG/AM 0110 project.png',NULL,NULL,'https://storage.googleapis.com/tracad-public-files/PNG/AM 0110 ER.png',18),('','2022-10-11 03:07:47','-','2022-02-25 14:41:46',0,115,'V 1.0','CDM_AMS_III_AK_A','CDM',NULL,'Transport','https://storage.googleapis.com/tracad-public-files/DOC/EB98_repan07_AMS-III.AK.pdf','Moderate to low',32,1,3,11,'CDM_AMS_III_AK_ Biodiesel production and use for transport applications-Used defualt emission factor','a167e715-3700-4ffa-b791-6f55363ce01b',1,'Freight','No','Only CO2','https://storage.googleapis.com/tracad-public-files/PNG/AMS IIIAK - Baseline.PNG','https://storage.googleapis.com/tracad-public-files/PNG/AMS IIIAK - Project .png',NULL,'https://storage.googleapis.com/tracad-public-files/PNG/AMS IIIAK - Leakage.png','https://storage.googleapis.com/tracad-public-files/PNG/AMS IIIAK - Emission Reduction.png',19),('','2022-10-11 03:07:47','-','2022-02-25 14:41:46',0,116,'V 1.0','CDM_AMS_III_AK_B','CDM',NULL,'Transport','https://storage.googleapis.com/tracad-public-files/DOC/EB98_repan07_AMS-III.AK.pdf','Moderate to low',32,1,3,11,'CDM_AMS_III_AK_Biodiesel production and use for transport applications-Used methodological tool','0e1d32a4-338c-4cb1-9aa9-fab92392ed13',1,'Freight','No','Only CO2','https://storage.googleapis.com/tracad-public-files/PNG/AMS IIIAK - Baseline.PNG','https://storage.googleapis.com/tracad-public-files/PNG/AMS IIIAK - Project .png',NULL,'https://storage.googleapis.com/tracad-public-files/PNG/AMS IIIAK - Leakage.png','https://storage.googleapis.com/tracad-public-files/PNG/AMS IIIAK - Emission Reduction.png',20),('','2022-10-11 03:07:47','-','2022-02-25 14:41:46',0,117,'V 1.0','UNFCCC_AM0016_V_5_new','CDM',NULL,'Transport','https://storage.googleapis.com/tracad-public-files/DOC/EB110_repan02_ACM0016_(v05.0).pdf','Moderate to low',32,1,1,9,'ACM0016: Mass Rapid Transit Projects','bf6ba480-15cf-490c-8676-e0753fe17385',1,'Passenger','No','Only CO2','https://storage.googleapis.com/tracad-public-files/PNG/ACM0016-be.png','https://storage.googleapis.com/tracad-public-files/PNG/ACM0016-pe.png',NULL,'https://storage.googleapis.com/tracad-public-files/PNG/ACM0016-le.png','https://storage.googleapis.com/tracad-public-files/PNG/ER.PNG',21),('','2022-10-11 03:07:47','-','2022-08-18 14:41:46',0,118,'V 4.0','CDM_ACM0017','CDM',NULL,'Transport','https://storage.googleapis.com/tracad-public-files/DOC/EB113_repan15_ACM0017_ver04.pdf','Moderate',32,1,3,12,'ACM0017: Production of biofuel ','06dde21b-15fd-49cf-96d8-b9cef9dffa97',1,'Freight','No','Only CO2','https://storage.googleapis.com/tracad-public-files/PNG/Baseline equation ACM0017.png','https://storage.googleapis.com/tracad-public-files/PNG/Project equation ACM0017.png',NULL,'https://storage.googleapis.com/tracad-public-files/PNG/Leakage equation ACM0017.png','https://storage.googleapis.com/tracad-public-files/PNG/Emission reduction equation ACM0017.png',22),('','2022-10-11 03:07:47','-','2022-08-18 14:41:46',0,119,'V 1.0','CDM_AMS_III_AT','CDM',NULL,'Transport','https://storage.googleapis.com/tracad-public-files/DOC/EB66_repan57_Revison of AMS-III.AT_ver02_.pdf','Moderate',32,1,4,15,'AMS-III.AT.: Transportation energy efficiency activities installing digital tachograph systems to commercial freight transport fleets','609b7a49-26a6-4419-bf6b-2c8c857a88ac',1,'Passenger and Freight','No','Only CO2','https://storage.googleapis.com/tracad-public-files/PNG/Baseline equation AMS III AT.png','https://storage.googleapis.com/tracad-public-files/PNG/Project equation AMS III AT.png',NULL,NULL,'https://storage.googleapis.com/tracad-public-files/PNG/ER.PNG',23),('','2022-10-11 03:07:47','-','2022-08-18 14:41:46',0,120,'V 8.0','AM0031','CDM',NULL,'Transport','https://storage.googleapis.com/tracad-public-files/DOC/EB110_repan03_AM0031 (v08.0).pdf','Moderately resource and data intensive',32,1,6,16,'AM0031-Bus rapid transit projects','3195be96-7bef-498e-bdcd-0c29ad4bd862',1,'Passenger','No','Only CO2','https://storage.googleapis.com/tracad-public-files/PNG/Baseline equation AM0031.png','https://storage.googleapis.com/tracad-public-files/PNG/Leakage equation AM0031.png',NULL,'https://storage.googleapis.com/tracad-public-files/PNG/Leakage equation AM0031.png','https://storage.googleapis.com/tracad-public-files/PNG/Emission reduction equation AM0031.png',24),('','2022-10-11 03:07:48','-','2022-08-18 14:41:46',0,121,'V 1.0','CDM_AMS_III_BN','CDM',NULL,'Transport','','Moderate to low',32,1,4,17,'CDM_AMS_III_BN-Efficient operation of public transportation','135a8317-94df-45d7-9b25-3757094a5983',1,'Passenger','No','Only CO2','https://storage.googleapis.com/tracad-public-files/PNG/Baseline equation AMS III BN.png','https://storage.googleapis.com/tracad-public-files/PNG/Project equation AMS III BN.png',NULL,NULL,'https://storage.googleapis.com/tracad-public-files/PNG/Emission reduction equation AMS III BN.png',25),('','2022-11-08 06:01:47','-','2022-02-25 14:41:46',0,122,'V 4.0','AMS-iii-S_person','CDM',0,'Transport','https://storage.googleapis.com/tracad-public-files/DOC/EB70_repan29_AMS-III.S_ver04.0.pdf','Moderately Resource and Data Intensive',33,1,3,4,'AMS-III.S - Introduction of low-emission vehicles/technologies to commercial vehicle fleets (Passenger)','c88d2548-41e4-4992-800d-864ab45f459f',1,'Passenger',NULL,'Only CO2','https://storage.googleapis.com/tracad-public-files/PNG/Baseline_AMS IIIS_Passenger.PNG','https://storage.googleapis.com/tracad-public-files/PNG/Project_AMS IIIS_Passenger.PNG',NULL,NULL,'https://storage.googleapis.com/tracad-public-files/PNG/ER.PNG',1),('','2022-11-08 06:01:47','-','2022-02-25 14:41:46',0,123,'V 4.0','AMS-iii-S_freight','CDM',0,'Transport','https://storage.googleapis.com/tracad-public-files/DOC/EB70_repan29_AMS-III.S_ver04.0.pdf','Moderately Resource and Data Intensive',33,1,3,4,'AMS-III.S - Introduction of low-emission vehicles/technologies to commercial vehicle fleets (Freight)','9717e307-fa4c-49d3-818b-f60585d4c085',2,'Frieght',NULL,'Only CO2','https://storage.googleapis.com/tracad-public-files/PNG/Baseline_AMS IIIS_Freight.PNG','https://storage.googleapis.com/tracad-public-files/PNG/Project_AMS IIIS_Freight.PNG',NULL,NULL,'https://storage.googleapis.com/tracad-public-files/PNG/ER.PNG',2),('','2022-11-08 06:01:47','-','2022-02-25 14:41:46',0,124,'V 1.0','ICAT_TPM_FSR_2020_A','ICAT',0,'Transport','https://climateactiontransparency.org/wp-content/uploads/2020/04/Transport-Pricing-Assessment-Guide.pdf','Highly Resource and Data intensive',33,1,1,1,'ICAT methodology for fuel subsidy removal and increased fuel tax or levy Approach A (top-down energy-use data_Fuel mix)','e970a1a5-c545-4bdb-b777-b120f1f087bc',2,'Not specified','No','Only CO2','https://storage.googleapis.com/tracad-public-files/PNG/Approch A - Baseline.png','https://storage.googleapis.com/tracad-public-files/PNG/Approch A - PE.PNG',NULL,NULL,'https://storage.googleapis.com/tracad-public-files/PNG/ER.PNG',3),('','2022-11-08 06:01:47','-','2022-02-25 14:41:46',0,125,'V 1.0','ICAT_TPM_FSR_2020_B','ICAT',0,'Transport','https://climateactiontransparency.org/wp-content/uploads/2020/04/Transport-Pricing-Assessment-Guide.pdf','Highly Resource and Data intensive',33,1,1,1,'ICAT methodology for fuel subsidy removal and increased fuel tax or levy _Approach B (top-down energy-use data_Gasoline & Diesel)','a12371ba-86ab-424c-91ee-1882f9a42880',2,'Not specified','No','Only CO2','https://storage.googleapis.com/tracad-public-files/PNG/Approch B - Baseline.PNG','https://storage.googleapis.com/tracad-public-files/PNG/Approch B - PE.PNG',NULL,NULL,'https://storage.googleapis.com/tracad-public-files/PNG/ER.PNG',4),('','2022-11-08 06:01:47','-','2022-02-25 14:41:46',0,126,'V 1.0','ICAT_TPM_FSR_2020_C','ICAT',0,'Transport','https://climateactiontransparency.org/wp-content/uploads/2020/04/Transport-Pricing-Assessment-Guide.pdf','Highly Resource and Data intensive',33,1,1,1,'ICAT methodology for fuel subsidy removal and increased fuel tax or levy _Approach C (top-down energy-use data & bottom-up travel activity data )','377972d6-b2e1-46fa-b396-e876aa39bc3b',2,'Not specified','No','Only CO2','https://storage.googleapis.com/tracad-public-files/PNG/Approch C - Baseline.PNG',NULL,NULL,NULL,'https://storage.googleapis.com/tracad-public-files/PNG/ER.PNG',5),('','2022-11-08 06:01:48','-','2022-02-25 14:41:46',0,127,'V 1.0','ICAT_TPM_RP_2020_cordon','ICAT',0,'Transport','https://climateactiontransparency.org/wp-content/uploads/2020/04/Transport-Pricing-Assessment-Guide.pdf','Highly Resource and Data intensive',33,1,1,1,'ICAT methodology for cordon pricing','0d87eca7-9af6-4d40-8855-753fbd8f461b',2,'Not specified','No','Only CO2','https://storage.googleapis.com/tracad-public-files/PNG/Cordon pricing BE 1.PNG','https://storage.googleapis.com/tracad-public-files/PNG/Cordon pricing PE 1.PNG',NULL,NULL,'https://storage.googleapis.com/tracad-public-files/PNG/ER.PNG',7),('','2022-11-08 06:01:48','-','2022-02-25 14:41:46',0,128,'V 1.0','ICAT_TPM_VPI_2020','ICAT',0,'Transport','https://climateactiontransparency.org/wp-content/uploads/2020/04/Transport-Pricing-Assessment-Guide.pdf','Highly Resource and Data intensive',33,1,1,1,'ICAT Methodology for Vehicle Purchase Incentives for More Efficient Vehicles','595741f0-dd2b-41f7-bb66-79e1e0a79181',2,'Not specified','No','Only CO2','https://storage.googleapis.com/tracad-public-files/PNG/Purchase incentives for low-GHG vehicles.PNG','https://storage.googleapis.com/tracad-public-files/PNG/icat.png',NULL,NULL,'https://storage.googleapis.com/tracad-public-files/PNG/ER.PNG',8),('','2022-11-08 06:01:48','-','2022-02-25 14:41:46',0,129,'V 3.0','JICA_TCM_MS_P_V - trafic','JICA',NULL,'Transport','https://storage.googleapis.com/tracad-public-files/DOC/estimation_03_M03_Model shift_2019.pdf','Moderate to low',33,1,2,13,'JICA_Traffic Congestion (Passenger)','384a4e24-be01-4e2f-85bb-65790b3cba05',2,'Passenger','No','Only CO2','https://storage.googleapis.com/tracad-public-files/PNG/Baseline_JICA_Traffic Cogestion.PNG','https://storage.googleapis.com/tracad-public-files/PNG/Project_JICA_Traffic Congestion.PNG',NULL,NULL,'https://storage.googleapis.com/tracad-public-files/PNG/ER.PNG',9),('','2022-11-08 06:01:48','-','2022-02-25 14:41:46',0,130,'V 3.0','JICA_TCM_MS_P_V','JICA',NULL,'Transport','https://storage.googleapis.com/tracad-public-files/DOC/estimation_03_M03_Model shift_2019.pdf','Moderate to low',33,1,2,14,'JICA_Modal Shift (Passenger)','bb9ba647-6eda-4108-9e80-7fccab304242',2,'Passenger','No','Only CO2','https://storage.googleapis.com/tracad-public-files/PNG/Baseline_JICA_Modal shift.PNG','https://storage.googleapis.com/tracad-public-files/PNG/Project_JICA_Modal Shift.PNG',NULL,NULL,'https://storage.googleapis.com/tracad-public-files/PNG/ER.PNG',10),('','2022-11-08 06:01:48','-','2022-02-25 14:41:46',0,131,'V 3.0','JICA_RAIWAY_FR_ELECTRI','JICA',NULL,'Transport','https://storage.googleapis.com/tracad-public-files/DOC/estimation_06.pdf','Moderate to low',33,1,2,3,'JICA_Railway_Electrification (Freight)','ef67c939-6460-43e7-b251-229dba7f68b9',2,'Frieght','No','Only CO2','https://storage.googleapis.com/tracad-public-files/PNG/JICA freight - Baseline - Elecrification.png','https://storage.googleapis.com/tracad-public-files/PNG/JICA Freight - Project Emission.png',NULL,NULL,'https://storage.googleapis.com/tracad-public-files/PNG/JICA freight - Emission Reduction.png',11),('','2022-11-08 06:01:48','-','2022-02-25 14:41:46',0,132,'V 1.0','ICAT_TPM_RP_2020_Toll_roads','ICAT',0,'Transport','https://climateactiontransparency.org/wp-content/uploads/2020/04/Transport-Pricing-Assessment-Guide.pdf','Highly Resource and Data intensive',33,1,1,1,'ICAT methodology for toll roads and distance-based charges','186f4b30-2933-4aa2-ba95-42bd61fbddda',2,'Not specified','No','Only CO2','https://storage.googleapis.com/tracad-public-files/PNG/Toll roads and distance-based charges BE1.PNG','https://storage.googleapis.com/tracad-public-files/PNG/Toll roads and distance-based charges PE 1.PNG',NULL,NULL,'https://storage.googleapis.com/tracad-public-files/PNG/ER.PNG',6),('','2022-11-08 06:01:48','-','2022-02-25 14:41:46',0,133,'V 3.0','JICA_RAIWAY_FR_MODEL','JICA',NULL,'Transport','https://storage.googleapis.com/tracad-public-files/DOC/JICA_Modal shift_Freight.pdf','Moderate to low',33,1,2,3,'JICA_Railway_Modal Shift (Freight)','b8e4352e-7326-4f55-93d7-c2a3e56ca335',2,'Frieght','No','Only CO2','https://storage.googleapis.com/tracad-public-files/PNG/JICA Freight - Baseline Modal shift.png','https://storage.googleapis.com/tracad-public-files/PNG/JICA Freight - Project Emission.png',NULL,NULL,'https://storage.googleapis.com/tracad-public-files/PNG/JICA freight - Emission Reduction copy.png',12),('','2022-11-08 06:01:49','-','2022-02-25 14:41:46',0,134,'V 3.0','JICA_RAIWAY_PASS_ELECTRI','JICA',NULL,'Transport','https://storage.googleapis.com/tracad-public-files/DOC/estimation_06.pdf','Moderate to low',33,1,2,3,'JICA_Railway_Electrification (Passenger)','1d69e1d7-8d40-4582-a696-19987f85394d',2,'Passenger','No','Only CO2','https://storage.googleapis.com/tracad-public-files/PNG/JICA passenger - Electrification - Baseline.png','https://storage.googleapis.com/tracad-public-files/PNG/JICA Passenger - Project .png',NULL,NULL,'https://storage.googleapis.com/tracad-public-files/PNG/JICA freight - Emission Reduction copy.png',13),('','2022-11-08 06:01:49','-','2022-02-25 14:41:46',0,135,'V 3.0','JICA_RAIWAY_PASS_MODEL','JICA',NULL,'Transport','https://storage.googleapis.com/tracad-public-files/DOC/M03_Railway_Passenger_MS_E_2013.pdf','Moderate to low',33,1,2,3,'JICA_Railway_Modal Shift(Passenger)','c4b75557-e2c5-4d3e-a0ce-362faaa5b776',2,'Passenger','No','Only CO2','https://storage.googleapis.com/tracad-public-files/PNG/Jica Passenger - Modal shift - Baseline.png','https://storage.googleapis.com/tracad-public-files/PNG/JICA Passenger - Project .png',NULL,NULL,'https://storage.googleapis.com/tracad-public-files/PNG/JICA Passenger - Project .png',14),('','2022-11-08 06:01:49','-','2022-02-25 14:41:46',0,136,'V 15.0','AMS-iii-C','CDM',NULL,'Transport','https://storage.googleapis.com/tracad-public-files/DOC/EB83_repan09_AMS-III.C_ver 15.0.pdf','Moderately Resource and Data Intensive',33,1,4,5,'AMS-iii-C - Emission reductions by electric and hybrid vehicles ','effaad2e-3c2b-4634-99a7-bf2c69d987bd',2,'Passenger and Freight','No','Only CO2','https://storage.googleapis.com/tracad-public-files/PNG/Emission reductions by electric and hybrid vehicles 1.PNG','https://storage.googleapis.com/tracad-public-files/PNG/Emission reductions by electric and hybrid vehicles PE 1.PNG',NULL,NULL,'https://storage.googleapis.com/tracad-public-files/PNG/ER.PNG',15),('','2022-11-08 06:01:49','-','2022-02-25 14:41:46',0,137,'V 2.0','UNFCCC_AMS_III_BC','CDM',NULL,'Transport','https://storage.googleapis.com/tracad-public-files/DOC/EB 75_repan24_AMS-III.BC_ver 02.0.pdf','Moderately Resource and Data Intensive',33,1,4,8,'UNFCCC_AMS_III_BC - Emission reductions through improved efficiency of vehicle fleets','af2e0272-3a06-4e29-8de4-091e604c72fe',2,'Not specified','No','Only CO2','https://storage.googleapis.com/tracad-public-files/PNG/Baseline_Parameters.PNG','https://storage.googleapis.com/tracad-public-files/PNG/Project_Emission_Equation.PNG',NULL,NULL,'https://storage.googleapis.com/tracad-public-files/PNG/ER.PNG',16),('','2022-11-08 06:01:49','-','2022-02-25 14:41:46',0,138,'V 1.1.0','UNFCCC_AM0090','CDM',NULL,'Transport','https://storage.googleapis.com/tracad-public-files/DOC/Modal shift in transportation of cargo from road transportation to water or rail transportation.pdf','Highly Resource and Data intensive',33,1,6,6,'UNFCCC_AM0090 - Modal shift in transportation of cargo from road transportation to water or rail transportation','3d861d69-70f3-41c8-8f4b-c10ef18a04a4',2,'Freight','No','Only CO2','https://storage.googleapis.com/tracad-public-files/PNG/Baseline_AM0090.PNG','https://storage.googleapis.com/tracad-public-files/PNG/Project_AM0090.PNG',NULL,NULL,'https://storage.googleapis.com/tracad-public-files/PNG/ER.PNG',17),('','2022-11-08 06:01:49','-','2022-02-25 14:41:46',0,139,'V 2.0','AM0110_V_2','CDM',NULL,'Transport','https://storage.googleapis.com/tracad-public-files/DOC/EB83_repan05_AM0110_ver02.0.pdf','Highly Resource and Data intensive',33,1,5,10,'AM0110_V_-Modal shift in transportation of liquid fuels','7d78eff4-f01b-418d-810f-0428749b3bfd',2,'Freight','No','Only CO2','https://storage.googleapis.com/tracad-public-files/PNG/AM 0110 BE.png','https://storage.googleapis.com/tracad-public-files/PNG/AM 0110 project.png',NULL,NULL,'https://storage.googleapis.com/tracad-public-files/PNG/AM 0110 ER.png',18),('','2022-11-08 06:01:49','-','2022-02-25 14:41:46',0,140,'V 1.0','CDM_AMS_III_AK_A','CDM',NULL,'Transport','https://storage.googleapis.com/tracad-public-files/DOC/EB98_repan07_AMS-III.AK.pdf','Moderate to low',33,1,3,11,'CDM_AMS_III_AK_ Biodiesel production and use for transport applications-Used defualt emission factor','8122d385-6e97-47ec-aa3d-a57d609a782c',2,'Freight','No','Only CO2','https://storage.googleapis.com/tracad-public-files/PNG/AMS IIIAK - Baseline.PNG','https://storage.googleapis.com/tracad-public-files/PNG/AMS IIIAK - Project .png',NULL,'https://storage.googleapis.com/tracad-public-files/PNG/AMS IIIAK - Leakage.png','https://storage.googleapis.com/tracad-public-files/PNG/AMS IIIAK - Emission Reduction.png',19),('','2022-11-08 06:01:49','-','2022-02-25 14:41:46',0,141,'V 1.0','CDM_AMS_III_AK_B','CDM',NULL,'Transport','https://storage.googleapis.com/tracad-public-files/DOC/EB98_repan07_AMS-III.AK.pdf','Moderate to low',33,1,3,11,'CDM_AMS_III_AK_Biodiesel production and use for transport applications-Used methodological tool','f580eb7b-7e4e-4bee-b59b-95f307c599f9',2,'Freight','No','Only CO2','https://storage.googleapis.com/tracad-public-files/PNG/AMS IIIAK - Baseline.PNG','https://storage.googleapis.com/tracad-public-files/PNG/AMS IIIAK - Project .png',NULL,'https://storage.googleapis.com/tracad-public-files/PNG/AMS IIIAK - Leakage.png','https://storage.googleapis.com/tracad-public-files/PNG/AMS IIIAK - Emission Reduction.png',20),('','2022-11-08 06:01:49','-','2022-02-25 14:41:46',0,142,'V 1.0','UNFCCC_AM0016_V_5_new','CDM',NULL,'Transport','https://storage.googleapis.com/tracad-public-files/DOC/EB110_repan02_ACM0016_(v05.0).pdf','Moderate to low',33,1,1,9,'ACM0016: Mass Rapid Transit Projects','ef13bcef-2c42-4b99-9f8a-cdfa089b9ded',2,'Passenger','No','Only CO2','https://storage.googleapis.com/tracad-public-files/PNG/ACM0016-be.png','https://storage.googleapis.com/tracad-public-files/PNG/ACM0016-pe.png',NULL,'https://storage.googleapis.com/tracad-public-files/PNG/ACM0016-le.png','https://storage.googleapis.com/tracad-public-files/PNG/ER.PNG',21),('','2022-11-08 06:01:49','-','2022-08-18 14:41:46',0,143,'V 4.0','CDM_ACM0017','CDM',NULL,'Transport','https://storage.googleapis.com/tracad-public-files/DOC/EB113_repan15_ACM0017_ver04.pdf','Moderate',33,1,3,12,'ACM0017: Production of biofuel ','43a7b103-1641-4d4b-965e-2ef8daa65a9b',2,'Freight','No','Only CO2','https://storage.googleapis.com/tracad-public-files/PNG/Baseline equation ACM0017.png','https://storage.googleapis.com/tracad-public-files/PNG/Project equation ACM0017.png',NULL,'https://storage.googleapis.com/tracad-public-files/PNG/Leakage equation ACM0017.png','https://storage.googleapis.com/tracad-public-files/PNG/Emission reduction equation ACM0017.png',22),('','2022-11-08 06:01:50','-','2022-08-18 14:41:46',0,144,'V 1.0','CDM_AMS_III_AT','CDM',NULL,'Transport','https://storage.googleapis.com/tracad-public-files/DOC/EB66_repan57_Revison of AMS-III.AT_ver02_.pdf','Moderate',33,1,4,15,'AMS-III.AT.: Transportation energy efficiency activities installing digital tachograph systems to commercial freight transport fleets','887f65bb-de39-47b6-9575-8e4260ba4c2d',2,'Passenger and Freight','No','Only CO2','https://storage.googleapis.com/tracad-public-files/PNG/Baseline equation AMS III AT.png','https://storage.googleapis.com/tracad-public-files/PNG/Project equation AMS III AT.png',NULL,NULL,'https://storage.googleapis.com/tracad-public-files/PNG/ER.PNG',23),('','2022-11-08 06:01:50','-','2022-08-18 14:41:46',0,145,'V 8.0','AM0031','CDM',NULL,'Transport','https://storage.googleapis.com/tracad-public-files/DOC/EB110_repan03_AM0031 (v08.0).pdf','Moderately resource and data intensive',33,1,6,16,'AM0031-Bus rapid transit projects','46d52a71-2a5f-4636-8703-272948f79da5',2,'Passenger','No','Only CO2','https://storage.googleapis.com/tracad-public-files/PNG/Baseline equation AM0031.png','https://storage.googleapis.com/tracad-public-files/PNG/Leakage equation AM0031.png',NULL,'https://storage.googleapis.com/tracad-public-files/PNG/Leakage equation AM0031.png','https://storage.googleapis.com/tracad-public-files/PNG/Emission reduction equation AM0031.png',24),('','2022-11-08 06:01:50','-','2022-08-18 14:41:46',0,146,'V 1.0','CDM_AMS_III_BN','CDM',NULL,'Transport','','Moderate to low',33,1,4,17,'CDM_AMS_III_BN-Efficient operation of public transportation','d4996184-cfb7-4448-aabb-1eb62f5ad909',2,'Passenger','No','Only CO2','https://storage.googleapis.com/tracad-public-files/PNG/Baseline equation AMS III BN.png','https://storage.googleapis.com/tracad-public-files/PNG/Project equation AMS III BN.png',NULL,NULL,'https://storage.googleapis.com/tracad-public-files/PNG/Emission reduction equation AMS III BN.png',25),('','2023-05-15 01:50:02','-','2022-02-25 14:41:46',0,147,'V 4.0','AMS-iii-S_person','CDM',0,'Transport','https://storage.googleapis.com/tracad-public-files/DOC/EB70_repan29_AMS-III.S_ver04.0.pdf','Moderately Resource and Data Intensive',34,1,3,4,'AMS-III.S - Introduction of low-emission vehicles/technologies to commercial vehicle fleets (Passenger)','7b1a8f31-aec6-4f53-9d23-741d2e5387e6',1,'Passenger',NULL,'Only CO2','https://storage.googleapis.com/tracad-public-files/PNG/Baseline_AMS IIIS_Passenger.PNG','https://storage.googleapis.com/tracad-public-files/PNG/Project_AMS IIIS_Passenger.PNG',NULL,NULL,'https://storage.googleapis.com/tracad-public-files/PNG/ER.PNG',1),('','2023-05-15 01:50:02','-','2022-02-25 14:41:46',0,148,'V 4.0','AMS-iii-S_freight','CDM',0,'Transport','https://storage.googleapis.com/tracad-public-files/DOC/EB70_repan29_AMS-III.S_ver04.0.pdf','Moderately Resource and Data Intensive',34,1,3,4,'AMS-III.S - Introduction of low-emission vehicles/technologies to commercial vehicle fleets (Freight)','51edefae-6cdc-4a6a-8cdf-ec849928d205',1,'Frieght',NULL,'Only CO2','https://storage.googleapis.com/tracad-public-files/PNG/Baseline_AMS IIIS_Freight.PNG','https://storage.googleapis.com/tracad-public-files/PNG/Project_AMS IIIS_Freight.PNG',NULL,NULL,'https://storage.googleapis.com/tracad-public-files/PNG/ER.PNG',2),('','2023-05-15 01:50:02','-','2022-02-25 14:41:46',0,149,'V 1.0','ICAT_TPM_FSR_2020_A','ICAT',0,'Transport','https://climateactiontransparency.org/wp-content/uploads/2020/04/Transport-Pricing-Assessment-Guide.pdf','Highly Resource and Data intensive',34,1,1,1,'ICAT methodology for fuel subsidy removal and increased fuel tax or levy Approach A (top-down energy-use data_Fuel mix)','8c7c58bd-3652-479a-bc94-8baa49e7bdec',1,'Not specified','No','Only CO2','https://storage.googleapis.com/tracad-public-files/PNG/Approch A - Baseline.png','https://storage.googleapis.com/tracad-public-files/PNG/Approch A - PE.PNG',NULL,NULL,'https://storage.googleapis.com/tracad-public-files/PNG/ER.PNG',3),('','2023-05-15 01:50:02','-','2022-02-25 14:41:46',0,150,'V 1.0','ICAT_TPM_FSR_2020_B','ICAT',0,'Transport','https://climateactiontransparency.org/wp-content/uploads/2020/04/Transport-Pricing-Assessment-Guide.pdf','Highly Resource and Data intensive',34,1,1,1,'ICAT methodology for fuel subsidy removal and increased fuel tax or levy _Approach B (top-down energy-use data_Gasoline & Diesel)','adece05b-b8ea-4012-901f-3faad117c3c1',1,'Not specified','No','Only CO2','https://storage.googleapis.com/tracad-public-files/PNG/Approch B - Baseline.PNG','https://storage.googleapis.com/tracad-public-files/PNG/Approch B - PE.PNG',NULL,NULL,'https://storage.googleapis.com/tracad-public-files/PNG/ER.PNG',4),('','2023-05-15 01:50:02','-','2022-02-25 14:41:46',0,151,'V 1.0','ICAT_TPM_FSR_2020_C','ICAT',0,'Transport','https://climateactiontransparency.org/wp-content/uploads/2020/04/Transport-Pricing-Assessment-Guide.pdf','Highly Resource and Data intensive',34,1,1,1,'ICAT methodology for fuel subsidy removal and increased fuel tax or levy _Approach C (top-down energy-use data & bottom-up travel activity data )','c4d2f615-86ad-4194-8c60-93c9ca8b6354',1,'Not specified','No','Only CO2','https://storage.googleapis.com/tracad-public-files/PNG/Approch C - Baseline.PNG',NULL,NULL,NULL,'https://storage.googleapis.com/tracad-public-files/PNG/ER.PNG',5),('','2023-05-15 01:50:02','-','2022-02-25 14:41:46',0,152,'V 1.0','ICAT_TPM_RP_2020_Toll_roads','ICAT',0,'Transport','https://climateactiontransparency.org/wp-content/uploads/2020/04/Transport-Pricing-Assessment-Guide.pdf','Highly Resource and Data intensive',34,1,1,1,'ICAT methodology for toll roads and distance-based charges','ddb3fd85-5a70-444c-a81e-6afaf64ee8c6',1,'Not specified','No','Only CO2','https://storage.googleapis.com/tracad-public-files/PNG/Toll roads and distance-based charges BE1.PNG','https://storage.googleapis.com/tracad-public-files/PNG/Toll roads and distance-based charges PE 1.PNG',NULL,NULL,'https://storage.googleapis.com/tracad-public-files/PNG/ER.PNG',6),('','2023-05-15 01:50:02','-','2022-02-25 14:41:46',0,153,'V 1.0','ICAT_TPM_RP_2020_cordon','ICAT',0,'Transport','https://climateactiontransparency.org/wp-content/uploads/2020/04/Transport-Pricing-Assessment-Guide.pdf','Highly Resource and Data intensive',34,1,1,1,'ICAT methodology for cordon pricing','2aa536c0-1ab7-437c-8759-66cfdecc1746',1,'Not specified','No','Only CO2','https://storage.googleapis.com/tracad-public-files/PNG/Cordon pricing BE 1.PNG','https://storage.googleapis.com/tracad-public-files/PNG/Cordon pricing PE 1.PNG',NULL,NULL,'https://storage.googleapis.com/tracad-public-files/PNG/ER.PNG',7),('','2023-05-15 01:50:03','-','2022-02-25 14:41:46',0,154,'V 1.0','ICAT_TPM_VPI_2020','ICAT',0,'Transport','https://climateactiontransparency.org/wp-content/uploads/2020/04/Transport-Pricing-Assessment-Guide.pdf','Highly Resource and Data intensive',34,1,1,1,'ICAT Methodology for Vehicle Purchase Incentives for More Efficient Vehicles','4fb3d401-fbec-4068-ad16-617f27a1f4de',1,'Not specified','No','Only CO2','https://storage.googleapis.com/tracad-public-files/PNG/Purchase incentives for low-GHG vehicles.PNG','https://storage.googleapis.com/tracad-public-files/PNG/icat.png',NULL,NULL,'https://storage.googleapis.com/tracad-public-files/PNG/ER.PNG',8),('','2023-05-15 01:50:03','-','2022-02-25 14:41:46',0,155,'V 3.0','JICA_TCM_MS_P_V - trafic','JICA',NULL,'Transport','https://www.jica.go.jp/english/our_work/climate_change/c8h0vm0000f7klc7-att/estimation_03.pdf','Moderate to low',34,1,2,13,'JICA_Traffic Congestion (Passenger)','1ac84915-43e2-4ef3-86d2-cfff9adccb35',1,'Passenger','No','Only CO2','https://storage.googleapis.com/tracad-public-files/PNG/Baseline_JICA_Traffic Cogestion.PNG','https://storage.googleapis.com/tracad-public-files/PNG/Project_JICA_Traffic Congestion.PNG',NULL,NULL,'https://storage.googleapis.com/tracad-public-files/PNG/ER.PNG',9),('','2023-05-15 01:50:03','-','2022-02-25 14:41:46',0,156,'V 3.0','JICA_TCM_MS_P_V','JICA',NULL,'Transport','https://www.jica.go.jp/english/our_work/climate_change/c8h0vm0000f7klc7-att/estimation_04.pdf','Moderate to low',34,1,2,14,'JICA_Modal Shift (Passenger)','087b0676-b68a-4717-a333-75f9c983db1f',1,'Passenger','No','Only CO2','https://storage.googleapis.com/tracad-public-files/PNG/Baseline_JICA_Modal shift.PNG','https://storage.googleapis.com/tracad-public-files/PNG/Project_JICA_Modal Shift.PNG',NULL,NULL,'https://storage.googleapis.com/tracad-public-files/PNG/ER.PNG',10),('','2023-05-15 01:50:03','-','2022-02-25 14:41:46',0,157,'V 3.0','JICA_RAIWAY_FR_MODEL','JICA',NULL,'Transport','https://storage.googleapis.com/tracad-public-files/DOC/JICA_Modal shift_Freight.pdf','Moderate to low',34,1,2,3,'JICA_Railway_Modal Shift (Freight)','8b879044-dbfd-4f84-b743-29d5e37d4bb6',1,'Frieght','No','Only CO2','https://storage.googleapis.com/tracad-public-files/PNG/JICA Freight - Baseline Modal shift.png','https://storage.googleapis.com/tracad-public-files/PNG/JICA Freight - Project Emission.png',NULL,NULL,'https://storage.googleapis.com/tracad-public-files/PNG/JICA freight - Emission Reduction copy.png',12),('','2023-05-15 01:50:03','-','2022-02-25 14:41:46',0,158,'V 3.0','JICA_RAIWAY_FR_ELECTRI','JICA',NULL,'Transport','https://storage.googleapis.com/tracad-public-files/DOC/estimation_06.pdf','Moderate to low',34,1,2,3,'JICA_Railway_Electrification (Freight)','7bcd3c99-66ca-49cd-a26f-1e2a545ecf67',1,'Frieght','No','Only CO2','https://storage.googleapis.com/tracad-public-files/PNG/JICA freight - Baseline - Elecrification.png','https://storage.googleapis.com/tracad-public-files/PNG/JICA Freight - Project Emission.png',NULL,NULL,'https://storage.googleapis.com/tracad-public-files/PNG/JICA freight - Emission Reduction.png',11),('','2023-05-15 01:50:03','-','2022-02-25 14:41:46',0,159,'V 3.0','JICA_RAIWAY_PASS_ELECTRI','JICA',NULL,'Transport','https://storage.googleapis.com/tracad-public-files/DOC/estimation_06.pdf','Moderate to low',34,1,2,3,'JICA_Railway_Electrification (Passenger)','7c9e5f42-3800-4008-bee8-0cf587002adc',1,'Passenger','No','Only CO2','https://storage.googleapis.com/tracad-public-files/PNG/JICA passenger - Electrification - Baseline.png','https://storage.googleapis.com/tracad-public-files/PNG/JICA Passenger - Project .png',NULL,NULL,'https://storage.googleapis.com/tracad-public-files/PNG/JICA freight - Emission Reduction copy.png',13),('','2023-05-15 01:50:03','-','2022-02-25 14:41:46',0,160,'V 3.0','JICA_RAIWAY_PASS_MODEL','JICA',NULL,'Transport','https://storage.googleapis.com/tracad-public-files/DOC/M03_Railway_Passenger_MS_E_2013.pdf','Moderate to low',34,1,2,3,'JICA_Railway_Modal Shift(Passenger)','57cd9f4c-f81d-48bc-ba59-b7c099fd25de',1,'Passenger','No','Only CO2','https://storage.googleapis.com/tracad-public-files/PNG/Jica Passenger - Modal shift - Baseline.png','https://storage.googleapis.com/tracad-public-files/PNG/JICA Passenger - Project .png',NULL,NULL,'https://storage.googleapis.com/tracad-public-files/PNG/JICA Passenger - Project .png',14),('','2023-05-15 01:50:03','-','2022-02-25 14:41:46',0,161,'V 15.0','AMS-iii-C','CDM',NULL,'Transport','https://storage.googleapis.com/tracad-public-files/DOC/EB83_repan09_AMS-III.C_ver 15.0.pdf','Moderately Resource and Data Intensive',34,1,4,5,'AMS-iii-C - Emission reductions by electric and hybrid vehicles ','c55ecfac-4223-40c4-bc71-125658d9294e',1,'Passenger and Freight','No','Only CO2','https://storage.googleapis.com/tracad-public-files/PNG/Emission reductions by electric and hybrid vehicles 1.PNG','https://storage.googleapis.com/tracad-public-files/PNG/Emission reductions by electric and hybrid vehicles PE 1.PNG',NULL,NULL,'https://storage.googleapis.com/tracad-public-files/PNG/ER.PNG',15),('','2023-05-15 01:50:03','-','2022-02-25 14:41:46',0,162,'V 2.0','UNFCCC_AMS_III_BC','CDM',NULL,'Transport','https://storage.googleapis.com/tracad-public-files/DOC/EB 75_repan24_AMS-III.BC_ver 02.0.pdf','Moderately Resource and Data Intensive',34,1,4,8,'UNFCCC_AMS_III_BC - Emission reductions through improved efficiency of vehicle fleets','b4a0f699-1544-4287-996f-2ff04e626cfa',1,'Not specified','No','Only CO2','https://storage.googleapis.com/tracad-public-files/PNG/Baseline_Parameters.PNG','https://storage.googleapis.com/tracad-public-files/PNG/Project_Emission_Equation.PNG',NULL,NULL,'https://storage.googleapis.com/tracad-public-files/PNG/ER.PNG',16),('','2023-05-15 01:50:03','-','2022-02-25 14:41:46',0,163,'V 1.1.0','UNFCCC_AM0090','CDM',NULL,'Transport','https://storage.googleapis.com/tracad-public-files/DOC/Modal shift in transportation of cargo from road transportation to water or rail transportation.pdf','Highly Resource and Data intensive',34,1,6,6,'UNFCCC_AM0090 - Modal shift in transportation of cargo from road transportation to water or rail transportation','fc2d9f6d-2f68-4793-8b12-cb6abd2c87fd',1,'Freight','No','Only CO2','https://storage.googleapis.com/tracad-public-files/PNG/Baseline_AM0090.PNG','https://storage.googleapis.com/tracad-public-files/PNG/Project_AM0090.PNG',NULL,NULL,'https://storage.googleapis.com/tracad-public-files/PNG/ER.PNG',17),('','2023-05-15 01:50:03','-','2022-02-25 14:41:46',0,164,'V 2.0','AM0110_V_2','CDM',NULL,'Transport','https://storage.googleapis.com/tracad-public-files/DOC/EB83_repan05_AM0110_ver02.0.pdf','Highly Resource and Data intensive',34,1,5,10,'AM0110_V_-Modal shift in transportation of liquid fuels','93a42ece-50d6-4e25-aa7a-bd41f7daab3d',1,'Freight','No','Only CO2','https://storage.googleapis.com/tracad-public-files/PNG/AM 0110 BE.png','https://storage.googleapis.com/tracad-public-files/PNG/AM 0110 project.png',NULL,NULL,'https://storage.googleapis.com/tracad-public-files/PNG/AM 0110 ER.png',18),('','2023-05-15 01:50:03','-','2022-02-25 14:41:46',0,165,'V 1.0','CDM_AMS_III_AK_A','CDM',NULL,'Transport','https://storage.googleapis.com/tracad-public-files/DOC/EB98_repan07_AMS-III.AK.pdf','Moderate to low',34,1,3,11,'CDM_AMS_III_AK_ Biodiesel production and use for transport applications-Used defualt emission factor','b820169c-fae5-4e69-9a3c-12654eabf8b5',1,'Freight','No','Only CO2','https://storage.googleapis.com/tracad-public-files/PNG/AMS IIIAK - Baseline.PNG','https://storage.googleapis.com/tracad-public-files/PNG/AMS IIIAK - Project .png',NULL,'https://storage.googleapis.com/tracad-public-files/PNG/AMS IIIAK - Leakage.png','https://storage.googleapis.com/tracad-public-files/PNG/AMS IIIAK - Emission Reduction.png',19),('','2023-05-15 01:50:03','-','2022-02-25 14:41:46',0,166,'V 1.0','CDM_AMS_III_AK_B','CDM',NULL,'Transport','https://storage.googleapis.com/tracad-public-files/DOC/EB98_repan07_AMS-III.AK.pdf','Moderate to low',34,1,3,11,'CDM_AMS_III_AK_Biodiesel production and use for transport applications-Used methodological tool','7db0c017-d550-41b7-8fe6-e5992619c63a',1,'Freight','No','Only CO2','https://storage.googleapis.com/tracad-public-files/PNG/AMS IIIAK - Baseline.PNG','https://storage.googleapis.com/tracad-public-files/PNG/AMS IIIAK - Project .png',NULL,'https://storage.googleapis.com/tracad-public-files/PNG/AMS IIIAK - Leakage.png','https://storage.googleapis.com/tracad-public-files/PNG/AMS IIIAK - Emission Reduction.png',20),('','2023-05-15 01:50:03','-','2022-02-25 14:41:46',0,167,'V 1.0','UNFCCC_AM0016_V_5_new','CDM',NULL,'Transport','https://storage.googleapis.com/tracad-public-files/DOC/EB110_repan02_ACM0016_(v05.0).pdf','Moderate to low',34,1,1,9,'ACM0016: Mass Rapid Transit Projects','d370c6d6-bbbe-4118-aa64-32df5d420128',1,'Passenger','No','Only CO2','https://storage.googleapis.com/tracad-public-files/PNG/ACM0016-be.png','https://storage.googleapis.com/tracad-public-files/PNG/ACM0016-pe.png',NULL,'https://storage.googleapis.com/tracad-public-files/PNG/ACM0016-le.png','https://storage.googleapis.com/tracad-public-files/PNG/ER.PNG',21),('','2023-05-15 01:50:03','-','2022-08-18 14:41:46',0,168,'V 4.0','CDM_ACM0017','CDM',NULL,'Transport','https://storage.googleapis.com/tracad-public-files/DOC/EB113_repan15_ACM0017_ver04.pdf','Moderate',34,1,3,12,'ACM0017: Production of biofuel ','98acd938-2230-47d5-8a9e-74c09b571dad',1,'Freight','No','Only CO2','https://storage.googleapis.com/tracad-public-files/PNG/Baseline equation ACM0017.png','https://storage.googleapis.com/tracad-public-files/PNG/Project equation ACM0017.png',NULL,'https://storage.googleapis.com/tracad-public-files/PNG/Leakage equation ACM0017.png','https://storage.googleapis.com/tracad-public-files/PNG/Emission reduction equation ACM0017.png',22),('','2023-05-15 01:50:03','-','2022-08-18 14:41:46',0,169,'V 1.0','CDM_AMS_III_AT','CDM',NULL,'Transport','https://storage.googleapis.com/tracad-public-files/DOC/EB66_repan57_Revison of AMS-III.AT_ver02_.pdf','Moderate',34,1,4,15,'AMS-III.AT.: Transportation energy efficiency activities installing digital tachograph systems to commercial freight transport fleets','9ae88f23-d29b-4339-ac78-d1e2f40c51c0',1,'Passenger and Freight','No','Only CO2','https://storage.googleapis.com/tracad-public-files/PNG/Baseline equation AMS III AT.png','https://storage.googleapis.com/tracad-public-files/PNG/Project equation AMS III AT.png',NULL,NULL,'https://storage.googleapis.com/tracad-public-files/PNG/ER.PNG',23),('','2023-05-15 01:50:03','-','2022-08-18 14:41:46',0,170,'V 8.0','AM0031','CDM',NULL,'Transport','https://storage.googleapis.com/tracad-public-files/DOC/EB110_repan03_AM0031 (v08.0).pdf','Moderately resource and data intensive',34,1,6,16,'AM0031-Bus rapid transit projects','5197bf3b-93b8-43d1-a83c-8c96b028027a',1,'Passenger','No','Only CO2','https://storage.googleapis.com/tracad-public-files/PNG/Baseline equation AM0031.png','https://storage.googleapis.com/tracad-public-files/PNG/Leakage equation AM0031.png',NULL,'https://storage.googleapis.com/tracad-public-files/PNG/Leakage equation AM0031.png','https://storage.googleapis.com/tracad-public-files/PNG/Emission reduction equation AM0031.png',24),('','2023-05-15 01:50:03','-','2022-08-18 14:41:46',0,171,'V 1.0','CDM_AMS_III_BN','CDM',NULL,'Transport','','Moderate to low',34,1,4,17,'CDM_AMS_III_BN-Efficient operation of public transportation','abe45673-57d3-45b4-ab19-a5682012b36a',1,'Passenger','No','Only CO2','https://storage.googleapis.com/tracad-public-files/PNG/Baseline equation AMS III BN.png','https://storage.googleapis.com/tracad-public-files/PNG/Project equation AMS III BN.png',NULL,NULL,'https://storage.googleapis.com/tracad-public-files/PNG/Emission reduction equation AMS III BN.png',25),('','2023-10-17 11:44:11','-','2022-02-25 14:41:46',0,326,'V 2.0','UNFCCC_AMS_III_BC','CDM',NULL,'Transport','https://storage.googleapis.com/tracad-public-files/DOC/EB 75_repan24_AMS-III.BC_ver 02.0.pdf','Moderately Resource and Data Intensive',71,1,4,8,'UNFCCC_AMS_III_BC - Emission reductions through improved efficiency of vehicle fleets','24e3c4c2-857b-45c3-9883-39c1282ae67d',1,'Not specified','No','Only CO2','https://storage.googleapis.com/tracad-public-files/PNG/Baseline_Parameters.PNG','https://storage.googleapis.com/tracad-public-files/PNG/Project_Emission_Equation.PNG',NULL,NULL,'https://storage.googleapis.com/tracad-public-files/PNG/ER.PNG',16),('','2023-10-17 11:44:11','-','2022-02-25 14:41:46',0,327,'V 1.0','ICAT_TPM_FSR_2020_A','ICAT',0,'Transport','https://climateactiontransparency.org/wp-content/uploads/2020/04/Transport-Pricing-Assessment-Guide.pdf','Highly Resource and Data intensive',71,1,1,1,'ICAT methodology for fuel subsidy removal and increased fuel tax or levy Approach A (top-down energy-use data_Fuel mix)','d07ed54a-e51b-4250-b773-aad5f8e9be81',1,'Not specified','No','Only CO2','https://storage.googleapis.com/tracad-public-files/PNG/Approch A - Baseline.png','https://storage.googleapis.com/tracad-public-files/PNG/Approch A - PE.PNG',NULL,NULL,'https://storage.googleapis.com/tracad-public-files/PNG/ER.PNG',3),('','2023-10-17 11:44:11','-','2022-02-25 14:41:46',0,328,'V 15.0','AMS-iii-C','CDM',NULL,'Transport','https://storage.googleapis.com/tracad-public-files/DOC/EB83_repan09_AMS-III.C_ver 15.0.pdf','Moderately Resource and Data Intensive',71,1,4,5,'AMS-iii-C - Emission reductions by electric and hybrid vehicles ','c753f9fc-e2a3-4033-a55c-9f183dee56d0',1,'Passenger and Freight','No','Only CO2','https://storage.googleapis.com/tracad-public-files/PNG/Emission reductions by electric and hybrid vehicles 1.PNG','https://storage.googleapis.com/tracad-public-files/PNG/Emission reductions by electric and hybrid vehicles PE 1.PNG',NULL,NULL,'https://storage.googleapis.com/tracad-public-files/PNG/ER.PNG',15),('','2023-10-17 11:44:11','-','2022-02-25 14:41:46',0,329,'V 1.0','ICAT_TPM_VPI_2020','ICAT',0,'Transport','https://climateactiontransparency.org/wp-content/uploads/2020/04/Transport-Pricing-Assessment-Guide.pdf','Highly Resource and Data intensive',71,1,1,1,'ICAT Methodology for Vehicle Purchase Incentives for More Efficient Vehicles','9f07a7bb-55ed-4c23-a951-73163a117efb',1,'Not specified','No','Only CO2','https://storage.googleapis.com/tracad-public-files/PNG/Purchase incentives for low-GHG vehicles.PNG','https://storage.googleapis.com/tracad-public-files/PNG/icat.png',NULL,NULL,'https://storage.googleapis.com/tracad-public-files/PNG/ER.PNG',8),('','2023-10-17 11:44:12','-','2022-02-25 14:41:46',0,330,'V 4.0','AMS-iii-S_person','CDM',0,'Transport','https://storage.googleapis.com/tracad-public-files/DOC/EB70_repan29_AMS-III.S_ver04.0.pdf','Moderately Resource and Data Intensive',71,1,3,4,'AMS-III.S - Introduction of low-emission vehicles/technologies to commercial vehicle fleets (Passenger)','59b327a6-d9a7-4fce-992c-67df403c4f58',1,'Passenger',NULL,'Only CO2','https://storage.googleapis.com/tracad-public-files/PNG/Baseline_AMS IIIS_Passenger.PNG','https://storage.googleapis.com/tracad-public-files/PNG/Project_AMS IIIS_Passenger.PNG',NULL,NULL,'https://storage.googleapis.com/tracad-public-files/PNG/ER.PNG',1);
/*!40000 ALTER TABLE `methodology` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `methodology_data`
--

DROP TABLE IF EXISTS `methodology_data`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `methodology_data` (
  `createdBy` varchar(255) DEFAULT NULL,
  `createdOn` datetime DEFAULT NULL,
  `editedBy` varchar(255) DEFAULT NULL,
  `editedOn` datetime DEFAULT NULL,
  `status` int NOT NULL DEFAULT '0',
  `id` int NOT NULL AUTO_INCREMENT,
  `version` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `displayName` varchar(255) DEFAULT NULL,
  `developedBy` varchar(255) NOT NULL,
  `parentId` int DEFAULT NULL,
  `applicableSector` varchar(255) DEFAULT NULL,
  `documents` varchar(255) NOT NULL,
  `easenessOfDataCollection` varchar(255) DEFAULT NULL,
  `transportSubSector` varchar(255) DEFAULT NULL,
  `upstream_downstream` varchar(255) DEFAULT NULL,
  `ghgIncluded` varchar(255) DEFAULT NULL,
  `uniqueIdentification` varchar(255) DEFAULT NULL,
  `sectorId` int DEFAULT NULL,
  `mitigationActionTypeId` int DEFAULT NULL,
  `applicabilityId` int DEFAULT NULL,
  `baselineImage` varchar(255) DEFAULT NULL,
  `projectImage` varchar(255) DEFAULT NULL,
  `projectionImage` varchar(255) DEFAULT NULL,
  `leakageImage` varchar(255) DEFAULT NULL,
  `resultImage` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=26 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `methodology_data`
--

LOCK TABLES `methodology_data` WRITE;
/*!40000 ALTER TABLE `methodology_data` DISABLE KEYS */;
INSERT INTO `methodology_data` VALUES ('-','2022-02-25 14:41:46','-','2022-02-25 14:41:46',0,1,'V 4.0','AMS-iii-S_person','AMS-III.S - Introduction of low-emission vehicles/technologies to commercial vehicle fleets (Passenger)','CDM',0,'Transport','https://storage.googleapis.com/tracad-public-files/DOC/EB70_repan29_AMS-III.S_ver04.0.pdf','Moderately Resource and Data Intensive','Passenger',NULL,'Only CO2','924c167a-a1ef-42d4-b844-a5be942eb483',1,3,4,'https://storage.googleapis.com/tracad-public-files/PNG/Baseline_AMS IIIS_Passenger.PNG','https://storage.googleapis.com/tracad-public-files/PNG/Project_AMS IIIS_Passenger.PNG',NULL,NULL,'https://storage.googleapis.com/tracad-public-files/PNG/ER.PNG'),('-','2022-02-25 14:41:46','-','2022-02-25 14:41:46',0,2,'V 4.0','AMS-iii-S_freight','AMS-III.S - Introduction of low-emission vehicles/technologies to commercial vehicle fleets (Freight)','CDM',0,'Transport','https://storage.googleapis.com/tracad-public-files/DOC/EB70_repan29_AMS-III.S_ver04.0.pdf','Moderately Resource and Data Intensive','Frieght',NULL,'Only CO2','72647361-ffea-4b8c-9120-289a5f9a8c71',1,3,4,'https://storage.googleapis.com/tracad-public-files/PNG/Baseline_AMS IIIS_Freight.PNG','https://storage.googleapis.com/tracad-public-files/PNG/Project_AMS IIIS_Freight.PNG',NULL,NULL,'https://storage.googleapis.com/tracad-public-files/PNG/ER.PNG'),('-','2022-02-25 14:41:46','-','2022-02-25 14:41:46',0,3,'V 1.0','ICAT_TPM_FSR_2020_A','ICAT methodology for fuel subsidy removal and increased fuel tax or levy Approach A (top-down energy-use data_Fuel mix)','ICAT',0,'Transport','https://climateactiontransparency.org/wp-content/uploads/2020/04/Transport-Pricing-Assessment-Guide.pdf','Highly Resource and Data intensive','Not specified','No','Only CO2','68776aba-6b2f-4a7e-9bb2-99eb0120bf6b',1,1,1,'https://storage.googleapis.com/tracad-public-files/PNG/Approch A - Baseline.png','https://storage.googleapis.com/tracad-public-files/PNG/Approch A - PE.PNG',NULL,NULL,'https://storage.googleapis.com/tracad-public-files/PNG/ER.PNG'),('-','2022-02-25 14:41:46','-','2022-02-25 14:41:46',0,4,'V 1.0','ICAT_TPM_FSR_2020_B','ICAT methodology for fuel subsidy removal and increased fuel tax or levy _Approach B (top-down energy-use data_Gasoline & Diesel)','ICAT',0,'Transport','https://climateactiontransparency.org/wp-content/uploads/2020/04/Transport-Pricing-Assessment-Guide.pdf','Highly Resource and Data intensive','Not specified','No','Only CO2','423cff3e-7571-4acc-af90-4212b352d31e',1,1,1,'https://storage.googleapis.com/tracad-public-files/PNG/Approch B - Baseline.PNG','https://storage.googleapis.com/tracad-public-files/PNG/Approch B - PE.PNG',NULL,NULL,'https://storage.googleapis.com/tracad-public-files/PNG/ER.PNG'),('-','2022-02-25 14:41:46','-','2022-02-25 14:41:46',0,5,'V 1.0','ICAT_TPM_FSR_2020_C','ICAT methodology for fuel subsidy removal and increased fuel tax or levy _Approach C (top-down energy-use data & bottom-up travel activity data )','ICAT',0,'Transport','https://climateactiontransparency.org/wp-content/uploads/2020/04/Transport-Pricing-Assessment-Guide.pdf','Highly Resource and Data intensive','Not specified','No','Only CO2','aaef4e0c-dbae-492d-82af-8b74b6ccb93d',1,1,1,'https://storage.googleapis.com/tracad-public-files/PNG/Approch C - Baseline.PNG',NULL,NULL,NULL,'https://storage.googleapis.com/tracad-public-files/PNG/ER.PNG'),('-','2022-02-25 14:41:46','-','2022-02-25 14:41:46',0,6,'V 1.0','ICAT_TPM_RP_2020_Toll_roads','ICAT methodology for toll roads and distance-based charges','ICAT',0,'Transport','https://climateactiontransparency.org/wp-content/uploads/2020/04/Transport-Pricing-Assessment-Guide.pdf','Highly Resource and Data intensive','Not specified','No','Only CO2','9bee1a99-b84b-4615-9bc3-b5e0b6ce42fe',1,1,1,'https://storage.googleapis.com/tracad-public-files/PNG/Toll roads and distance-based charges BE1.PNG','https://storage.googleapis.com/tracad-public-files/PNG/Toll roads and distance-based charges PE 1.PNG',NULL,NULL,'https://storage.googleapis.com/tracad-public-files/PNG/ER.PNG'),('-','2022-02-25 14:41:46','-','2022-02-25 14:41:46',0,7,'V 1.0','ICAT_TPM_RP_2020_cordon','ICAT methodology for cordon pricing','ICAT',0,'Transport','https://climateactiontransparency.org/wp-content/uploads/2020/04/Transport-Pricing-Assessment-Guide.pdf','Highly Resource and Data intensive','Not specified','No','Only CO2','b196bfa3-3deb-4b27-b354-a4f8a50b0afc',1,1,1,'https://storage.googleapis.com/tracad-public-files/PNG/Cordon pricing BE 1.PNG','https://storage.googleapis.com/tracad-public-files/PNG/Cordon pricing PE 1.PNG',NULL,NULL,'https://storage.googleapis.com/tracad-public-files/PNG/ER.PNG'),('-','2022-02-25 14:41:46','-','2022-02-25 14:41:46',0,8,'V 1.0','ICAT_TPM_VPI_2020','ICAT Methodology for Vehicle Purchase Incentives for More Efficient Vehicles','ICAT',0,'Transport','https://climateactiontransparency.org/wp-content/uploads/2020/04/Transport-Pricing-Assessment-Guide.pdf','Highly Resource and Data intensive','Not specified','No','Only CO2','3f69da2a-abff-4510-873f-b27ec09b27b5',1,1,1,'https://storage.googleapis.com/tracad-public-files/PNG/Purchase incentives for low-GHG vehicles.PNG','https://storage.googleapis.com/tracad-public-files/PNG/icat.png',NULL,NULL,'https://storage.googleapis.com/tracad-public-files/PNG/ER.PNG'),('-','2022-02-25 14:41:46','-','2022-02-25 14:41:46',0,9,'V 3.0','JICA_TCM_MS_P_V - trafic','JICA_Traffic Congestion (Passenger)','JICA',NULL,'Transport','https://storage.googleapis.com/tracad-public-files/DOC/estimation_03_M03_Model shift_2019.pdf','Moderate to low','Passenger','No','Only CO2','49cc9372-d402-471f-bae4-5618ed22197f',1,2,13,'https://storage.googleapis.com/tracad-public-files/PNG/Baseline_JICA_Traffic Cogestion.PNG','https://storage.googleapis.com/tracad-public-files/PNG/Project_JICA_Traffic Congestion.PNG',NULL,NULL,'https://storage.googleapis.com/tracad-public-files/PNG/ER.PNG'),('-','2022-02-25 14:41:46','-','2022-02-25 14:41:46',0,10,'V 3.0','JICA_TCM_MS_P_V','JICA_Modal Shift (Passenger)','JICA',NULL,'Transport','https://storage.googleapis.com/tracad-public-files/DOC/estimation_03_M03_Model shift_2019.pdf','Moderate to low','Passenger','No','Only CO2','517036d0-d9b1-4b7c-8e8d-12d4fd0b844d',1,2,14,'https://storage.googleapis.com/tracad-public-files/PNG/Baseline_JICA_Modal shift.PNG','https://storage.googleapis.com/tracad-public-files/PNG/Project_JICA_Modal Shift.PNG',NULL,NULL,'https://storage.googleapis.com/tracad-public-files/PNG/ER.PNG'),('-','2022-02-25 14:41:46','-','2022-02-25 14:41:46',0,11,'V 3.0','JICA_RAIWAY_FR_ELECTRI','JICA_Railway_Electrification (Freight)','JICA',NULL,'Transport','https://storage.googleapis.com/tracad-public-files/DOC/M03_Railway_Passenger_MS_E_2013.pdf','Moderate to low','Frieght','No','Only CO2','d77cdd78-e43b-4cca-84df-7acbd7c0079c',1,2,3,'https://storage.googleapis.com/tracad-public-files/PNG/JICA freight - Baseline - Elecrification.png','https://storage.googleapis.com/tracad-public-files/PNG/JICA Freight - Project Emission.png',NULL,NULL,'https://storage.googleapis.com/tracad-public-files/PNG/JICA freight - Emission Reduction.png'),('-','2022-02-25 14:41:46','-','2022-02-25 14:41:46',0,12,'V 3.0','JICA_RAIWAY_FR_MODEL','JICA_Railway_Modal Shift (Freight)','JICA',NULL,'Transport','https://storage.googleapis.com/tracad-public-files/DOC/M03_Railway_Passenger_MS_E_2013.pdf','Moderate to low','Frieght','No','Only CO2','f944e878-ccc4-45eb-b055-d21bb5a4686f',1,2,3,'https://storage.googleapis.com/tracad-public-files/PNG/JICA Freight - Baseline Modal shift.png','https://storage.googleapis.com/tracad-public-files/PNG/JICA Freight - Project Emission.png',NULL,NULL,'https://storage.googleapis.com/tracad-public-files/PNG/JICA freight - Emission Reduction copy.png'),('-','2022-02-25 14:41:46','-','2022-02-25 14:41:46',0,13,'V 3.0','JICA_RAIWAY_PASS_ELECTRI','JICA_Railway_Electrification (Passenger)','JICA',NULL,'Transport','https://storage.googleapis.com/tracad-public-files/DOC/M03_Railway_Passenger_MS_E_2013.pdf','Moderate to low','Passenger','No','Only CO2','56a24339-68a9-484b-ae6b-75d3c4e4b128',1,2,3,'https://storage.googleapis.com/tracad-public-files/PNG/JICA passenger - Electrification - Baseline.png','https://storage.googleapis.com/tracad-public-files/PNG/JICA Passenger - Project .png',NULL,NULL,'https://storage.googleapis.com/tracad-public-files/PNG/JICA freight - Emission Reduction copy.png'),('-','2022-02-25 14:41:46','-','2022-02-25 14:41:46',0,14,'V 3.0','JICA_RAIWAY_PASS_MODEL','JICA_Railway_Modal Shift(Passenger)','JICA',NULL,'Transport','https://storage.googleapis.com/tracad-public-files/DOC/M03_Railway_Passenger_MS_E_2013.pdf','Moderate to low','Passenger','No','Only CO2','0af995ba-8201-4042-b032-cf660cfaea55',1,2,3,'https://storage.googleapis.com/tracad-public-files/PNG/Jica Passenger - Modal shift - Baseline.png','https://storage.googleapis.com/tracad-public-files/PNG/JICA Passenger - Project .png',NULL,NULL,'https://storage.googleapis.com/tracad-public-files/PNG/JICA Passenger - Project .png'),('-','2022-02-25 14:41:46','-','2022-02-25 14:41:46',0,15,'V 15.0','AMS-iii-C','AMS-iii-C - Emission reductions by electric and hybrid vehicles ','CDM',NULL,'Transport','https://storage.googleapis.com/tracad-public-files/DOC/EB83_repan09_AMS-III.C_ver 15.0.pdf','Moderately Resource and Data Intensive','Passenger and Freight','No','Only CO2','6fe2cefe-a4e3-4ffb-95a1-16a403eb244f',1,4,5,'https://storage.googleapis.com/tracad-public-files/PNG/Emission reductions by electric and hybrid vehicles 1.PNG','https://storage.googleapis.com/tracad-public-files/PNG/Emission reductions by electric and hybrid vehicles PE 1.PNG',NULL,NULL,'https://storage.googleapis.com/tracad-public-files/PNG/ER.PNG'),('-','2022-02-25 14:41:46','-','2022-02-25 14:41:46',0,16,'V 2.0','UNFCCC_AMS_III_BC','UNFCCC_AMS_III_BC - Emission reductions through improved efficiency of vehicle fleets','CDM',NULL,'Transport','https://storage.googleapis.com/tracad-public-files/DOC/EB 75_repan24_AMS-III.BC_ver 02.0.pdf','Moderately Resource and Data Intensive','Not specified','No','Only CO2','5d6469dd-817d-4d44-a110-80c472de402f',1,4,8,'https://storage.googleapis.com/tracad-public-files/PNG/Baseline_Parameters.PNG','https://storage.googleapis.com/tracad-public-files/PNG/Project_Emission_Equation.PNG',NULL,NULL,'https://storage.googleapis.com/tracad-public-files/PNG/ER.PNG'),('-','2022-02-25 14:41:46','-','2022-02-25 14:41:46',0,17,'V 1.1.0','UNFCCC_AM0090','UNFCCC_AM0090 - Modal shift in transportation of cargo from road transportation to water or rail transportation','CDM',NULL,'Transport','https://storage.googleapis.com/tracad-public-files/DOC/Modal shift in transportation of cargo from road transportation to water or rail transportation.pdf','Highly Resource and Data intensive','Freight','No','Only CO2','cab3a62e-1827-4344-ae1d-58a6b74a737f',1,6,6,'https://storage.googleapis.com/tracad-public-files/PNG/Baseline_AM0090.PNG','https://storage.googleapis.com/tracad-public-files/PNG/Project_AM0090.PNG',NULL,NULL,'https://storage.googleapis.com/tracad-public-files/PNG/ER.PNG'),('-','2022-02-25 14:41:46','-','2022-02-25 14:41:46',0,18,'V 2.0','AM0110_V_2','AM0110_V_-Modal shift in transportation of liquid fuels','CDM',NULL,'Transport','https://storage.googleapis.com/tracad-public-files/DOC/EB83_repan05_AM0110_ver02.0.pdf','Highly Resource and Data intensive','Freight','No','Only CO2','f825e902-d25d-4589-8880-0242e91d1589',1,5,10,'https://storage.googleapis.com/tracad-public-files/PNG/AM 0110 BE.png','https://storage.googleapis.com/tracad-public-files/PNG/AM 0110 project.png',NULL,NULL,'https://storage.googleapis.com/tracad-public-files/PNG/AM 0110 ER.png'),('-','2022-02-25 14:41:46','-','2022-02-25 14:41:46',0,19,'V 1.0','CDM_AMS_III_AK_A','CDM_AMS_III_AK_ Biodiesel production and use for transport applications-Used defualt emission factor','CDM',NULL,'Transport','https://storage.googleapis.com/tracad-public-files/DOC/EB98_repan07_AMS-III.AK.pdf','Moderate to low','Freight','No','Only CO2','071301ea-87b3-4a53-89f2-b58cde084fef',1,3,11,'https://storage.googleapis.com/tracad-public-files/PNG/AMS IIIAK - Baseline.PNG','https://storage.googleapis.com/tracad-public-files/PNG/AMS IIIAK - Project .png',NULL,'https://storage.googleapis.com/tracad-public-files/PNG/AMS IIIAK - Leakage.png','https://storage.googleapis.com/tracad-public-files/PNG/AMS IIIAK - Emission Reduction.png'),('-','2022-02-25 14:41:46','-','2022-02-25 14:41:46',0,20,'V 1.0','CDM_AMS_III_AK_B','CDM_AMS_III_AK_Biodiesel production and use for transport applications-Used methodological tool','CDM',NULL,'Transport','https://storage.googleapis.com/tracad-public-files/DOC/EB98_repan07_AMS-III.AK.pdf','Moderate to low','Freight','No','Only CO2','fd2ddee8-3065-4e3a-8eb4-3b1f2b9c9430',1,3,11,'https://storage.googleapis.com/tracad-public-files/PNG/AMS IIIAK - Baseline.PNG','https://storage.googleapis.com/tracad-public-files/PNG/AMS IIIAK - Project .png',NULL,'https://storage.googleapis.com/tracad-public-files/PNG/AMS IIIAK - Leakage.png','https://storage.googleapis.com/tracad-public-files/PNG/AMS IIIAK - Emission Reduction.png'),('-','2022-02-25 14:41:46','-','2022-02-25 14:41:46',0,21,'V 1.0','UNFCCC_AM0016_V_5_new','ACM0016: Mass Rapid Transit Projects','CDM',NULL,'Transport','https://storage.googleapis.com/tracad-public-files/DOC/EB110_repan02_ACM0016_(v05.0).pdf','Moderate to low','Passenger','No','Only CO2','9fcee0bb-fb65-4fe6-ad40-9b1c052c249d',1,1,9,'https://storage.googleapis.com/tracad-public-files/PNG/ACM0016-be.png','https://storage.googleapis.com/tracad-public-files/PNG/ACM0016-pe.png',NULL,'https://storage.googleapis.com/tracad-public-files/PNG/ACM0016-le.png','https://storage.googleapis.com/tracad-public-files/PNG/ER.PNG'),('-','2022-08-18 14:41:46','-','2022-08-18 14:41:46',0,22,'V 4.0','CDM_ACM0017','ACM0017: Production of biofuel ','CDM',NULL,'Transport','https://storage.googleapis.com/tracad-public-files/DOC/EB113_repan15_ACM0017_ver04.pdf','Moderate','Passenger and Freight','No','Only CO2','da8c7ca3-3bce-44d0-a2cd-e286e5f1d882',1,3,12,'https://storage.googleapis.com/tracad-public-files/PNG/Baseline equation ACM0017.png','https://storage.googleapis.com/tracad-public-files/PNG/Project equation ACM0017.png',NULL,'https://storage.googleapis.com/tracad-public-files/PNG/Leakage equation ACM0017.png','https://storage.googleapis.com/tracad-public-files/PNG/Emission reduction equation ACM0017.png'),('-','2022-08-18 14:41:46','-','2022-08-18 14:41:46',0,23,'V 1.0','CDM_AMS_III_AT','AMS-III.AT.: Transportation energy efficiency activities installing digital tachograph systems to commercial freight transport fleets','CDM',NULL,'Transport','https://storage.googleapis.com/tracad-public-files/DOC/EB66_repan57_Revison of AMS-III.AT_ver02_.pdf','Moderate','Passenger and Freight','No','Only CO2','f33ac249-f2a1-4bb6-bce9-5426cfde33c0',1,4,15,'https://storage.googleapis.com/tracad-public-files/PNG/Baseline equation AMS III AT.png','https://storage.googleapis.com/tracad-public-files/PNG/Project equation AMS III AT.png',NULL,NULL,'https://storage.googleapis.com/tracad-public-files/PNG/ER.PNG'),('-','2022-08-18 14:41:46','-','2022-08-18 14:41:46',0,24,'V 8.0','AM0031','AM0031-Bus rapid transit projects','CDM',NULL,'Transport','https://storage.googleapis.com/tracad-public-files/DOC/EB110_repan03_AM0031 (v08.0).pdf','Moderately resource and data intensive','Passenger','No','Only CO2','3867952c-14d0-4460-be92-c3b9aea28be1',1,6,16,'https://storage.googleapis.com/tracad-public-files/PNG/Baseline equation AM0031.png','https://storage.googleapis.com/tracad-public-files/PNG/Leakage equation AM0031.png',NULL,'https://storage.googleapis.com/tracad-public-files/PNG/Leakage equation AM0031.png','https://storage.googleapis.com/tracad-public-files/PNG/Emission reduction equation AM0031.png'),('-','2022-08-18 14:41:46','-','2022-08-18 14:41:46',0,25,'V 1.0','CDM_AMS_III_BN','CDM_AMS_III_BN-Efficient operation of public transportation','CDM',NULL,'Transport','','Moderate to low','Passenger','No','Only CO2','8540c8b0-e25e-4715-850f-a911683bf953',1,4,17,'https://storage.googleapis.com/tracad-public-files/PNG/Baseline equation AMS III BN.png','https://storage.googleapis.com/tracad-public-files/PNG/Project equation AMS III BN.png',NULL,NULL,'https://storage.googleapis.com/tracad-public-files/PNG/Emission reduction equation AMS III BN.png');
/*!40000 ALTER TABLE `methodology_data` ENABLE KEYS */;
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
  `uniqueIdentification` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `mitigationActionType`
--

LOCK TABLES `mitigationActionType` WRITE;
/*!40000 ALTER TABLE `mitigationActionType` DISABLE KEYS */;
INSERT INTO `mitigationActionType` VALUES ('','2022-02-24 18:32:27','','2022-02-24 18:32:27',0,1,'Fuel Pricing Policices','Fuel Pricing Policices',1,'4ac9f5f5-9d99-44a4-afd2-3dcefd261ba4'),('','2022-02-24 18:32:27','','2022-02-24 18:32:27',0,2,'Inter Urban Transport Infrastructure','Inter Urban Rail Infrastructure',2,'537b09fb-a262-4929-a7ba-eab911dedf39'),('','2022-02-24 18:32:27','','2022-02-24 18:32:27',0,3,'Alternative Fuels Incentives,Regulation and Production ','Alternative Fuels Incentives,Regulation and Production ',3,'15477995-a7d6-4e59-b21a-584bcfb7825d'),('1','2022-02-24 18:32:27','1','2022-02-24 18:32:27',0,4,'Vehicle Efficiency Improvement Programmes ','Alternative Fuels Incentives,Regulation and Production',4,'03e6d6717f794432b8be65842b05f182'),('1','2022-02-24 18:32:27','1','2022-02-24 18:32:27',0,5,'Shift Mode of Freight Transport from Road to Rail, Water or pipeline','Shift Mode of Freight Transport from Road to Rail, Water or pipeline',5,'f17bca44efd8426e85bff3a4d387aa6a'),('1','0000-00-00 00:00:00','1','0000-00-00 00:00:00',0,6,'Mass  Transit Investment','Mass  Transit Investment',6,'84d1566a-cab9-4507-bfd9-828979e127d9');
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
) ENGINE=InnoDB AUTO_INCREMENT=58 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

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
) ENGINE=InnoDB AUTO_INCREMENT=29 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

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
  `uomdataRequest` varchar(255) DEFAULT NULL,
  `uomDataEntry` varchar(255) DEFAULT NULL,
  `value` varchar(255) DEFAULT NULL,
  `conversionValue` varchar(255) DEFAULT NULL,
  `baseYear` int DEFAULT NULL,
  `projectionBaseYear` int DEFAULT NULL,
  `useDefaultValue` tinyint DEFAULT NULL,
  `assessmentYear` int DEFAULT NULL,
  `projectionYear` int DEFAULT NULL,
  `code` varchar(255) DEFAULT NULL,
  `methodologyCode` varchar(255) DEFAULT NULL,
  `methodologyVersion` varchar(255) DEFAULT NULL,
  `institutionId` int DEFAULT NULL,
  `assessmentId` int DEFAULT NULL,
  `defaultValueId` int DEFAULT NULL,
  `originalName` varchar(255) DEFAULT NULL,
  `isDefault` tinyint DEFAULT NULL,
  `isEnabledAlternative` tinyint NOT NULL DEFAULT '0',
  `countryCodeExtended` varchar(255) DEFAULT NULL,
  `enterDataAssumption` varchar(255) DEFAULT NULL,
  `hasChild` tinyint NOT NULL DEFAULT '0',
  `isAcceptedByVerifier` int DEFAULT NULL,
  `feedstock` varchar(255) DEFAULT NULL,
  `soil` varchar(255) DEFAULT NULL,
  `stratum` varchar(255) DEFAULT NULL,
  `residue` varchar(255) DEFAULT NULL,
  `landClearance` varchar(255) DEFAULT NULL,
  `isHistorical` tinyint DEFAULT NULL,
  `verifierAcceptance` varchar(255) NOT NULL DEFAULT 'PENDING',
  `verifierConcern` varchar(255) DEFAULT NULL,
  `previouseParameterId` int DEFAULT NULL,
  `historicalParaID` int DEFAULT NULL,
  `canActiveAction` tinyint DEFAULT NULL,
  `isConcernRaised` tinyint DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FK_c584a0d5a74c7cfb5bcc3ecf9f0` (`institutionId`),
  CONSTRAINT `FK_c584a0d5a74c7cfb5bcc3ecf9f0` FOREIGN KEY (`institutionId`) REFERENCES `institution` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE=InnoDB AUTO_INCREMENT=22552 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

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
  `Action` int DEFAULT NULL,
  `parameterId` int DEFAULT NULL,
  `parameterStatus` varchar(255) DEFAULT NULL,
  `parameterStatusPrevious` varchar(255) DEFAULT NULL,
  `comment` varchar(255) DEFAULT NULL,
  `description` varchar(255) DEFAULT NULL,
  `parameterCreatedDate` datetime DEFAULT NULL,
  `parameterAllocatedDate` datetime DEFAULT NULL,
  `parameterAssignDateByIA` datetime DEFAULT NULL,
  `parameterRejectDateByIA` datetime DEFAULT NULL,
  `deoAssumption` varchar(255) DEFAULT NULL,
  `qcAssumption` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=27908 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

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
INSERT INTO `project_approval_status` VALUES (NULL,NULL,NULL,NULL,0,1,'Accept','Accepted',1),(NULL,NULL,NULL,NULL,0,2,'Reject','Rejected',1),(NULL,NULL,NULL,NULL,0,3,'Data Request','Data Requested',1),(NULL,NULL,NULL,NULL,0,4,'Propose','Proposed',1),(NULL,NULL,NULL,NULL,0,5,'Active','Activated',1);
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
INSERT INTO `project_owner` VALUES (NULL,NULL,NULL,NULL,0,1,'Private','Private',1),(NULL,NULL,NULL,NULL,0,2,'Government','Government',1),(NULL,NULL,NULL,NULL,0,3,'Public Private Partnership','Public Private Partnership',1),(NULL,NULL,NULL,NULL,0,4,'NGO','NGO',1),(NULL,NULL,NULL,NULL,0,5,'International','International',1);
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
  KEY `FK_b405923865f5ae43237538e0c0d` (`assessmentId`),
  CONSTRAINT `FK_b405923865f5ae43237538e0c0d` FOREIGN KEY (`assessmentId`) REFERENCES `assessment` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=257 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

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
) ENGINE=InnoDB AUTO_INCREMENT=424 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

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
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `report`
--

LOCK TABLES `report` WRITE;
/*!40000 ALTER TABLE `report` DISABLE KEYS */;
INSERT INTO `report` VALUES (NULL,NULL,NULL,NULL,0,1,'COP26 Catalyst for Climate Action','https://climateactiontransparency.org/cop26-catalyst-for-climate-action-action-recommendations-for-capacity-building/','ICAT supported the COP26 Catalyst for Climate Action as a Technical Partner for the Transparency and Reporting Action Group',1,'https://act.campaign.gov.uk/wp-content/uploads/sites/25/2017/02/form_icon-1.jpg',NULL),(NULL,NULL,NULL,NULL,0,2,'Enhancing transparency systems in Africa’s largest economy: Lessons from Nigeria','https://climateactiontransparency.org/enhancing-transparency-systems-in-africas-largest-economy-lessons-from-nigeria/','As Africa’s leading oil producer, and with a rapidly increasing population...',1,'https://act.campaign.gov.uk/wp-content/uploads/sites/25/2017/02/form_icon-1.jpg',NULL),(NULL,NULL,NULL,NULL,0,5,'E-learning course engages government officials and practitioners from the Asia-Pacific region on climate transparency and the Enhanced Transparency Framework','https://climateactiontransparency.org/e-learning-course-engages-government-officials-and-practitioners-from-the-asia-pacific-region-on-climate-transparency-and-the-enhanced-transparency-framework/',NULL,1,'https://act.campaign.gov.uk/wp-content/uploads/sites/25/2017/02/form_icon-1.jpg',NULL),(NULL,NULL,NULL,NULL,0,6,'Regional climate transparency hub launches in Central Africa','https://climateactiontransparency.org/regional-climate-transparency-hub-launches-in-central-africa/',NULL,1,'https://act.campaign.gov.uk/wp-content/uploads/sites/25/2017/02/form_icon-1.jpg',NULL);
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
  CONSTRAINT `FK_21bf6ee02e608c1ee1705683833` FOREIGN KEY (`reportId`) REFERENCES `report` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `report_pdf_file_data`
--

DROP TABLE IF EXISTS `report_pdf_file_data`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `report_pdf_file_data` (
  `createdBy` varchar(255) DEFAULT NULL,
  `createdOn` datetime DEFAULT NULL,
  `editedBy` varchar(255) DEFAULT NULL,
  `editedOn` datetime DEFAULT NULL,
  `status` int NOT NULL DEFAULT '0',
  `id` int NOT NULL AUTO_INCREMENT,
  `sectorName` varchar(255) NOT NULL,
  `ndcName` varchar(255) NOT NULL,
  `climateAction` varchar(255) NOT NULL,
  `reportName` varchar(255) NOT NULL,
  `countryId` int NOT NULL,
  `assessmentType` varchar(255) DEFAULT NULL,
  `generateReportName` varchar(255) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=352 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

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
  `uniqueIdentification` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sector`
--

LOCK TABLES `sector` WRITE;
/*!40000 ALTER TABLE `sector` DISABLE KEYS */;
INSERT INTO `sector` VALUES ('','2022-02-24 18:32:15','','2022-02-24 18:32:15',0,1,'Transport','Transport',1,'0','0','af488820-5439-46f5-8b54-3a38bf583fb9');
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
) ENGINE=InnoDB AUTO_INCREMENT=69 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sub_ndc`
--

LOCK TABLES `sub_ndc` WRITE;
/*!40000 ALTER TABLE `sub_ndc` DISABLE KEYS */;
INSERT INTO `sub_ndc` VALUES ('-','2022-02-24 18:32:15','-','2022-02-24 18:32:28',1,1,'sub NDC 1','des',1,1),('-','2022-02-24 18:32:15','-','2022-02-24 18:32:28',1,2,'sub NDC 2','des',1,2),('-','2022-02-28 11:31:18','-','2022-02-28 11:31:18',0,3,'Introduce fuel-based tax',NULL,1,NULL),('-','2022-03-03 07:23:58','-','2022-03-03 07:23:58',0,4,'ndc',NULL,1,NULL),('-','2022-03-03 16:02:46','-','2022-03-03 16:03:21',1,10,'Restrict the entry of individual modes of transport to sensitive areas','des',1,5),('-','2022-03-03 16:06:04','-','2022-03-03 16:07:11',1,12,'Introduce new national policy or make amendments to relevant existing policies','des',1,6),('-','2022-03-03 16:06:22','-','2022-03-03 16:07:11',1,13,' Introduce fuel-based carbon tax','des',1,6),('-','2022-03-03 16:07:03','-','2022-03-03 16:07:11',1,14,'Include climate change measures in maritime policy making','des',1,6),('-','2022-03-04 07:42:25','-','2022-03-04 07:42:51',1,15,'Integrate transport modes','des',1,7),('-','2022-03-04 07:42:46','-','2022-03-04 07:42:51',1,16,'Improve public road transport for reliability, affordability, accessibility, availability, comfort and safety','des',1,7),('-','2022-05-26 10:28:29','-','2022-05-26 10:28:29',1,29,'test',NULL,1,5),('-','2022-05-26 10:29:36','-','2022-05-26 10:29:36',1,31,'test',NULL,1,8),('-','2022-05-26 10:29:49','-','2022-05-26 10:29:49',1,32,'yyy',NULL,1,8),('-','2022-10-12 04:03:17','-','2022-10-12 04:03:17',1,33,'Shift passengers from cars to public buses',NULL,1,28),('-','2022-10-12 04:03:17','-','2022-10-12 04:03:17',1,34,'Shift passengers from cars to railway',NULL,1,28),('-','2022-10-12 04:03:17','-','2022-10-12 04:03:17',1,35,'Shift passengers from bikes to public buses',NULL,1,28),('-','2022-10-12 04:12:10','-','2022-10-12 04:12:10',0,36,'Shifting passengers from fuel based buses to Bio fuel buses',NULL,1,26),('-','2022-10-12 08:10:46','-','2022-10-12 08:10:46',0,37,'Shift passengers from fuel based buses to bio fuel based buses',NULL,1,26),('-','2022-10-12 08:10:46','-','2022-10-12 08:10:46',0,38,'Shift passengers from diesel trains to electric trains',NULL,1,26),('-','2022-10-12 08:11:49','-','2022-10-12 08:11:49',1,39,'Shift freight transport from truck to railway',NULL,1,27),('-','2022-10-12 08:11:49','-','2022-10-12 08:11:49',1,40,'Shift freight transport from lorries to railway',NULL,1,27),('-','2022-10-12 08:11:49','-','2022-10-12 08:11:49',1,41,'Shift freight transport from trucks to ships',NULL,1,27),('-','2023-05-11 05:24:36','-','2023-05-11 05:24:43',1,42,NULL,'des',1,29),('-','2023-06-13 14:23:35','-','2023-06-13 14:24:16',1,44,'Integrate transport modes_HI','des',1,34),('-','2023-06-13 14:41:16','-','2023-06-13 14:41:16',0,45,'Action 1 ',NULL,1,35),('-','2023-06-14 04:31:09','-','2023-06-14 04:31:13',0,46,'test','des',1,36),('-','2023-06-14 04:32:13','-','2023-06-14 04:32:17',0,47,'test','des',1,37),('-','2023-06-26 01:51:10','-','2023-06-26 01:52:41',0,48,NULL,'des',1,40),('-','2023-09-01 18:04:28','-','2023-09-01 18:04:40',0,49,'Sub NDC 1','des',1,44),('-','2023-09-08 05:27:01','-','2023-09-08 05:27:01',0,53,'Shifting from private to public buses',NULL,1,NULL),('-','2023-10-11 14:25:08','-','2023-10-11 14:28:56',0,68,NULL,'des',1,57);
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
  `description` varchar(2000) DEFAULT NULL,
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
  `flag` int DEFAULT NULL,
  `projectId` int DEFAULT NULL,
  `ndcs` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=150 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

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
  `uniqueIdentification` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=27 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `unit_conversion`
--

LOCK TABLES `unit_conversion` WRITE;
/*!40000 ALTER TABLE `unit_conversion` DISABLE KEYS */;
INSERT INTO `unit_conversion` VALUES (NULL,NULL,NULL,NULL,0,1,'TJ','TJ',1.000000,NULL),(NULL,NULL,NULL,NULL,0,2,'%','%',1.000000,NULL),(NULL,NULL,NULL,NULL,0,3,'t-CO2/TJ','t-CO2/TJ',1.000000,NULL),(NULL,NULL,NULL,NULL,0,4,'km','km',1.000000,NULL),(NULL,NULL,NULL,NULL,0,5,'fuel/km','fuel/km',1.000000,NULL),(NULL,NULL,NULL,NULL,0,6,'t/y','t/y',1.000000,NULL),(NULL,NULL,NULL,NULL,0,7,'passengers or tons','passengers or tons',1.000000,NULL),(NULL,NULL,NULL,NULL,0,8,'TJ/t','TJ/t',1.000000,NULL),(NULL,NULL,NULL,NULL,0,9,'population','population',1.000000,NULL),(NULL,NULL,NULL,NULL,0,10,'$','$',1.000000,NULL),(NULL,NULL,NULL,NULL,0,11,'passengers','passengers',1.000000,NULL),(NULL,NULL,NULL,NULL,0,12,'t-CO2/MWh','t-CO2/MWh',1.000000,NULL),(NULL,NULL,NULL,NULL,0,13,'L per VKT','L per VKT',1.000000,NULL),(NULL,NULL,NULL,NULL,0,14,'VKT','VKT',1.000000,NULL),(NULL,NULL,NULL,NULL,0,15,'Kg/m3','Kg/m3',1.000000,NULL),(NULL,NULL,NULL,NULL,0,16,'TJ/Gg','TJ/Gg',1.000000,NULL),(NULL,NULL,NULL,NULL,0,17,'tons','tons',1.000000,NULL),(NULL,NULL,NULL,NULL,0,18,'t/km','t/km',1.000000,NULL),(NULL,NULL,NULL,NULL,0,19,'passenger/y','passenger/y',1.000000,NULL),(NULL,NULL,NULL,NULL,0,20,'passenger/vehicle)','passenger/vehicle)',1.000000,NULL),(NULL,NULL,NULL,NULL,0,21,'t-CO2/km','t-CO2/km',1.000000,NULL),(NULL,NULL,NULL,NULL,0,22,'tonne','MWH/yr',1.000000,NULL),(NULL,NULL,NULL,NULL,0,23,'MWH/yr','tonne',1.000000,NULL),(NULL,NULL,NULL,NULL,0,24,'tonne','tonne',1.000000,NULL),(NULL,NULL,NULL,NULL,0,25,'t-CO2/TJ','t-CO₂/MWh',1.000000,NULL),(NULL,NULL,NULL,NULL,0,26,'t-CO₂/MWh','t-CO2/TJ',1.000000,NULL);
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
  `resetToken` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `deletedAt` datetime(6) DEFAULT NULL,
  `canNotDelete` tinyint NOT NULL DEFAULT '0',
  `userTypeId` int NOT NULL,
  `institutionId` int DEFAULT NULL,
  `countryId` int DEFAULT NULL,
  `uniqueIdentification` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `IDX_78a916df40e02a9deb1c4b75ed` (`username`),
  UNIQUE KEY `IDX_e12875dfb3b1d92d7d7c5377e2` (`email`),
  KEY `FK_ca0de218397aed2409d865d1580` (`institutionId`),
  KEY `FK_4aaf6d02199282eb8d3931bff31` (`countryId`),
  CONSTRAINT `FK_4aaf6d02199282eb8d3931bff31` FOREIGN KEY (`countryId`) REFERENCES `country` (`id`),
  CONSTRAINT `FK_ca0de218397aed2409d865d1580` FOREIGN KEY (`institutionId`) REFERENCES `institution` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=430 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user`
--

LOCK TABLES `user` WRITE;
/*!40000 ALTER TABLE `user` DISABLE KEYS */;
INSERT INTO `user` VALUES (NULL,'2023-04-12 12:23:02',NULL,'2023-04-12 12:23:02',0,300,'Country Admin','Test','country_admin','country_admin@fake_email','','',NULL,'$2a$10$.1h.Wdt64EgtARK/MvT5ye','$2a$10$.1h.Wdt64EgtARK/MvT5yeR4WAMtI6nIbmNwmy4F632VV.0o46xam','',NULL,0,1,1,1,NULL),
(NULL,'2023-04-12 12:24:46',NULL,'2023-04-12 12:24:46',0,301,'Country Data Collection Team','Test','country_dct','country_dct@fake_email','','',NULL,'$2a$10$.1h.Wdt64EgtARK/MvT5ye','$2a$10$.1h.Wdt64EgtARK/MvT5yeR4WAMtI6nIbmNwmy4F632VV.0o46xam','',NULL,0,6,1,1,NULL);
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
  `isdataRequested` tinyint NOT NULL DEFAULT '0',
  `verificationStatus` int DEFAULT NULL,
  `verificationStage` int NOT NULL DEFAULT '1',
  `userVerifier` int DEFAULT NULL,
  `assessmentYearId` int DEFAULT NULL,
  `parameterId` int DEFAULT NULL,
  `isAssumption` tinyint DEFAULT NULL,
  `assumption` varchar(255) DEFAULT NULL,
  `isTotal` tinyint NOT NULL DEFAULT '0',
  `isMac` tinyint NOT NULL DEFAULT '0',
  `isDifference` tinyint NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`),
  KEY `FK_3f44853a3143c25338eac826b20` (`assessmentYearId`),
  KEY `FK_a43b0a788bdea978049ff34837a` (`parameterId`),
  CONSTRAINT `FK_3f44853a3143c25338eac826b20` FOREIGN KEY (`assessmentYearId`) REFERENCES `assessmentYear` (`id`),
  CONSTRAINT `FK_a43b0a788bdea978049ff34837a` FOREIGN KEY (`parameterId`) REFERENCES `parameter` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3623 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

SET @@SESSION.SQL_LOG_BIN = @MYSQLDUMP_TEMP_LOG_BIN;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2023-12-01 15:52:36
