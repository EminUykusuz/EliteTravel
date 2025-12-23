-- Demo Admin Kullanıcısı Ekleme
-- Password: admin123 (SHA256 hashed: LMZA5N4kCqCEkXQ3/IqzqZsGMnQ1GxL7xsNPPMDMqo0=)

INSERT INTO [Users] ([FirstName], [LastName], [Email], [PasswordHash], [Role], [CreatedDate], [IsDeleted])
VALUES 
(
  N'Admin', 
  N'User', 
  N'admin@elite.com', 
  'LMZA5N4kCqCEkXQ3/IqzqZsGMnQ1GxL7xsNPPMDMqo0=',
  N'Admin',
  GETDATE(),
  0
);

-- Regular User Demo
-- Password: user123
INSERT INTO [Users] ([FirstName], [LastName], [Email], [PasswordHash], [Role], [CreatedDate], [IsDeleted])
VALUES 
(
  N'Test', 
  N'User', 
  N'user@elite.com', 
  'G8NG8FpWYtXTu5h5MV5n8P0b8T3z5C9b1K4c7D8e5F0',
  N'User',
  GETDATE(),
  0
);
