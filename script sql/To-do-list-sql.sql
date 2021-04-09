-- phpMyAdmin SQL Dump
-- version 4.9.0.1
-- https://www.phpmyadmin.net/
--
-- Hôte : gigondas
-- Généré le :  mar. 30 mars 2021 à 09:39
-- Version du serveur :  10.3.27-MariaDB-0+deb10u1
-- Version de PHP :  7.3.27-1~deb10u1

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de données :  `pjtodo`
--

-- --------------------------------------------------------

--
-- Structure de la table `category`
--

CREATE TABLE `category` (
  `nameCategory` varchar(50) NOT NULL,
  `categoryColor` varchar(20) DEFAULT NULL,
  `userId` int(11) NOT NULL,
  `creation_date` date NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Structure de la table `comment`
--

CREATE TABLE `comment` (
  `id` int(11) NOT NULL,
  `commentBody` varchar(250) DEFAULT NULL,
  `taskName` varchar(100) DEFAULT NULL,
  `date_comment` date NOT NULL,
  `nameCategory` varchar(20) DEFAULT NULL,
  `userId` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Structure de la table `step`
--

CREATE TABLE `step` (
  `stepText` varchar(100) NOT NULL,
  `nameCategory` varchar(25) NOT NULL,
  `taskName` varchar(100) NOT NULL,
  `userId` int(11) NOT NULL,
  `stateStep` tinyint(1) NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Structure de la table `task`
--

CREATE TABLE `task` (
  `taskName` varchar(100) NOT NULL,
  `starting_date` date DEFAULT NULL,
  `due_date` date DEFAULT NULL,
  `taskDescription` varchar(400) DEFAULT NULL,
  `progressTask` varchar(25) DEFAULT NULL,
  `nameCategory` varchar(25) NOT NULL,
  `userId` int(11) NOT NULL,
  `isDisplayed` tinyint(1) DEFAULT 1,
  `isArchived` tinyint(1) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Structure de la table `user`
--

CREATE TABLE `user` (
  `id` int(11) NOT NULL,
  `username` varchar(25) NOT NULL,
  `password` varchar(200) NOT NULL,
  `email` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Structure de la table `userSettings`
--

CREATE TABLE `userSettings` (
  `id` int(11) NOT NULL,
  `pushNotif` int(1) DEFAULT NULL,
  `emailNotif` int(1) DEFAULT NULL,
  `filterByCreationDate` int(1) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Index pour les tables déchargées
--

--
-- Index pour la table `category`
--
ALTER TABLE `category`
  ADD PRIMARY KEY (`nameCategory`,`userId`),
  ADD KEY `userId` (`userId`);

--
-- Index pour la table `comment`
--
ALTER TABLE `comment`
  ADD PRIMARY KEY (`id`),
  ADD KEY `taskName` (`taskName`),
  ADD KEY `nameCategory` (`nameCategory`),
  ADD KEY `userId` (`userId`);

--
-- Index pour la table `step`
--
ALTER TABLE `step`
  ADD PRIMARY KEY (`stepText`,`taskName`,`nameCategory`,`userId`),
  ADD KEY `nameCategory` (`nameCategory`),
  ADD KEY `userId` (`userId`),
  ADD KEY `taskName` (`taskName`);

--
-- Index pour la table `task`
--
ALTER TABLE `task`
  ADD PRIMARY KEY (`taskName`,`nameCategory`,`userId`),
  ADD KEY `nameCategory` (`nameCategory`),
  ADD KEY `userId` (`userId`);

--
-- Index pour la table `user`
--
ALTER TABLE `user`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `username` (`username`);

--
-- Index pour la table `userSettings`
--
ALTER TABLE `userSettings`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT pour les tables déchargées
--

--
-- AUTO_INCREMENT pour la table `comment`
--
ALTER TABLE `comment`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=269;

--
-- AUTO_INCREMENT pour la table `user`
--
ALTER TABLE `user`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=60;

--
-- Contraintes pour les tables déchargées
--

--
-- Contraintes pour la table `category`
--
ALTER TABLE `category`
  ADD CONSTRAINT `category_ibfk_1` FOREIGN KEY (`userId`) REFERENCES `user` (`id`) ON DELETE CASCADE;

--
-- Contraintes pour la table `comment`
--
ALTER TABLE `comment`
  ADD CONSTRAINT `comment_ibfk_1` FOREIGN KEY (`taskName`) REFERENCES `task` (`taskName`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `comment_ibfk_2` FOREIGN KEY (`nameCategory`) REFERENCES `category` (`nameCategory`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `comment_ibfk_3` FOREIGN KEY (`userId`) REFERENCES `user` (`id`) ON DELETE CASCADE;

--
-- Contraintes pour la table `step`
--
ALTER TABLE `step`
  ADD CONSTRAINT `step_ibfk_1` FOREIGN KEY (`nameCategory`) REFERENCES `category` (`nameCategory`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `step_ibfk_2` FOREIGN KEY (`taskName`) REFERENCES `task` (`taskName`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `step_ibfk_3` FOREIGN KEY (`userId`) REFERENCES `user` (`id`) ON DELETE CASCADE;

--
-- Contraintes pour la table `task`
--
ALTER TABLE `task`
  ADD CONSTRAINT `task_ibfk_1` FOREIGN KEY (`nameCategory`) REFERENCES `category` (`nameCategory`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `task_ibfk_2` FOREIGN KEY (`userId`) REFERENCES `user` (`id`) ON DELETE CASCADE;

--
-- Contraintes pour la table `userSettings`
--
ALTER TABLE `userSettings`
  ADD CONSTRAINT `userSettings_ibfk_1` FOREIGN KEY (`id`) REFERENCES `user` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
