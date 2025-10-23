-- Migration script to add ProductType lookup table and update existing products
-- Run this script after updating the code to ensure data consistency

-- Step 1: Create ProductTypes table (if not exists from EF migration)
IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='ProductTypes' AND xtype='U')
BEGIN
    CREATE TABLE ProductTypes (
        ProductTypeId int IDENTITY(1,1) PRIMARY KEY,
        TypeName nvarchar(100) NOT NULL,
        Description nvarchar(500) NULL,
        IsActive bit NOT NULL DEFAULT 1,
        DisplayOrder int NOT NULL DEFAULT 0,
        CreatedAt datetime2 NOT NULL DEFAULT SYSUTCDATETIME()
    );
    
    CREATE UNIQUE INDEX IDX_ProductTypes_TypeName ON ProductTypes(TypeName);
    CREATE INDEX IDX_ProductTypes_IsActive ON ProductTypes(IsActive);
END

-- Step 2: Insert ProductType seed data (if not exists)
IF NOT EXISTS (SELECT * FROM ProductTypes)
BEGIN
    INSERT INTO ProductTypes (TypeName, Description, IsActive, DisplayOrder, CreatedAt) VALUES
    ('Auto Insurance', 'Automobile insurance products', 1, 1, SYSUTCDATETIME()),
    ('Health Insurance', 'Health insurance products', 1, 2, SYSUTCDATETIME()),
    ('Life Insurance', 'Life insurance products', 1, 3, SYSUTCDATETIME()),
    ('Property Insurance', 'Property insurance products', 1, 4, SYSUTCDATETIME()),
    ('Travel Insurance', 'Travel insurance products', 1, 5, SYSUTCDATETIME()),
    ('Home Insurance', 'Home insurance products', 1, 6, SYSUTCDATETIME());
END

-- Step 3: Add ProductTypeId column to Products table (if not exists)
IF NOT EXISTS (SELECT * FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = 'Products' AND COLUMN_NAME = 'ProductTypeId')
BEGIN
    ALTER TABLE Products ADD ProductTypeId int NULL;
    ALTER TABLE Products ADD Description nvarchar(1000) NULL;
END

-- Step 4: Create foreign key constraint (if not exists)
IF NOT EXISTS (SELECT * FROM INFORMATION_SCHEMA.REFERENTIAL_CONSTRAINTS WHERE CONSTRAINT_NAME = 'FK_Products_ProductTypes')
BEGIN
    ALTER TABLE Products 
    ADD CONSTRAINT FK_Products_ProductTypes 
    FOREIGN KEY (ProductTypeId) REFERENCES ProductTypes(ProductTypeId);
END

-- Step 5: Create index on ProductTypeId (if not exists)
IF NOT EXISTS (SELECT * FROM sys.indexes WHERE name = 'IDX_Products_ProductTypeId')
BEGIN
    CREATE INDEX IDX_Products_ProductTypeId ON Products(ProductTypeId);
END

-- Step 6: Update existing products to map to ProductTypes
-- This assumes you might have some products with productType data in a different field
-- Adjust this section based on your actual data structure

-- Example: If you have existing products, you can map them like this:
-- UPDATE Products SET ProductTypeId = 1 WHERE SomeField LIKE '%Auto%';
-- UPDATE Products SET ProductTypeId = 2 WHERE SomeField LIKE '%Health%';
-- etc.

PRINT 'ProductType migration completed successfully';