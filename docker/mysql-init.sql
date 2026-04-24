-- Dev: grant CREATE for prisma migrate dev shadow database
GRANT ALL PRIVILEGES ON `hackathon_dev`.* TO 'hackathon'@'%';
GRANT CREATE ON *.* TO 'hackathon'@'%';
FLUSH PRIVILEGES;
