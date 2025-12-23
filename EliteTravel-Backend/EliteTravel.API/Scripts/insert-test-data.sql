-- Test Verilerini Eklemek İçin SQL Script
-- Önce Users ekle
INSERT INTO [Users] (FirstName, LastName, Email, PasswordHash, IsActive, IsDeleted, CreatedDate)
VALUES 
('Ahmet', 'Yılmaz', 'ahmet@example.com', 'hash123', 1, 0, GETDATE()),
('Fatma', 'Kaya', 'fatma@example.com', 'hash123', 1, 0, GETDATE()),
('Mehmet', 'Demir', 'mehmet@example.com', 'hash123', 1, 0, GETDATE());

-- Guides ekle
INSERT INTO [Guides] (Name, Specialization, PhoneNumber, IsActive, IsDeleted, CreatedDate)
VALUES 
('Dr. Ahmet Anapalı', 'Osmanlı Tarihi', '+905051234567', 1, 0, GETDATE()),
('Mimar Murat', 'Mimarisi', '+905067890123', 1, 0, GETDATE());

-- Categories ekle
INSERT INTO [Categories] (Name, Description, IsActive, IsDeleted, CreatedDate)
VALUES 
('Osmanlı Başkentleri', 'Osmanlı Devletinin başkent şehirlerini ziyaret eden turlar', 1, 0, GETDATE()),
('Kültür Turizmi', 'Kültür ve tarih odaklı turlar', 1, 0, GETDATE()),
('Doğa Turizmi', 'Doğa ve macera turizmi', 1, 0, GETDATE());

-- Tours ekle
INSERT INTO [Tours] (Title, Slug, Description, Price, Currency, Capacity, MainImage, Thumbnail, IsActive, GuideId, IsDeleted, CreatedDate)
VALUES 
('Dr. Ahmet Anapalı ile Osmanlı Başkentleri: Bursa & Söğüt', 'osmanli-baskentleri-kasim-2025', 'Sultanların izinde, Düsseldorf çıkışlı, tarih ve maneviyat dolu 6 günlük eşsiz bir bakış açısı yolculuğu.', 850, 'EUR', 20, 'https://images.unsplash.com/photo-1541432901042-2d8bd64b4a6b?w=1920&q=80', 'https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?w=800&q=80', 1, 1, 0, GETDATE()),
('Mimar Sinan''ın İzinde: Edirne & İstanbul', 'serhat-sehri-edirne-aralik-2025', 'Osmanlı''nın Avrupa''ya açılan kapısı Edirne ve Mimar Sinan''ın ustalık eseri Selimiye''nin gölgesinde bir yolculuk.', 790, 'EUR', 18, 'https://images.unsplash.com/photo-1469022563149-aa64dbd37dae?w=1920&q=80', 'https://images.unsplash.com/photo-1469022563149-aa64dbd37dae?w=800&q=80', 1, 2, 0, GETDATE()),
('Kapadokya Macerası', 'kapadokya-macerasi', 'Peri bacalarının arasında balon turu ve ünü yerli ev deneyimi', 650, 'EUR', 30, 'https://images.unsplash.com/photo-1509803874d7a75ad144641044d32b7d7e7d6eb5?w=1920&q=80', 'https://images.unsplash.com/photo-1509803874d7a75ad144641044d32b7d7e7d6eb5?w=800&q=80', 1, 1, 0, GETDATE());

-- TourCategory ilişkilerini ekle
INSERT INTO [TourCategories] (TourId, CategoryId)
VALUES 
(1, 1), -- Bursa & Söğüt = Osmanlı Başkentleri
(2, 1), -- Edirne = Osmanlı Başkentleri
(3, 3); -- Kapadokya = Doğa Turizmi
