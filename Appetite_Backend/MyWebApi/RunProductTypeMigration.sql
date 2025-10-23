-- Run this script in SSMS to create ProductType table and update Products table
-- This is equivalent to running the EF migration

-- Step 1: Create ProductTypes table
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
    
    PRINT 'ProductTypes table created successfully';
END
ELSE
BEGIN
    PRINT 'ProductTypes table already exists';
END

-- Step 2: Insert seed data
IF NOT EXISTS (SELECT * FROM ProductTypes)
BEGIN
    INSERT INTO ProductTypes (TypeName, Description, IsActive, DisplayOrder, CreatedAt) VALUES
    ('Auto Insurance', 'Automobile insurance products', 1, 1, SYSUTCDATETIME()),
    ('Health Insurance', 'Health insurance products', 1, 2, SYSUTCDATETIME()),
    ('Life Insurance', 'Life insurance products', 1, 3, SYSUTCDATETIME()),
    ('Property Insurance', 'Property insurance products', 1, 4, SYSUTCDATETIME()),
    ('Travel Insurance', 'Travel insurance products', 1, 5, SYSUTCDATETIME()),
    ('Home Insurance', 'Home insurance products', 1, 6, SYSUTCDATETIME());
    
    PRINT 'ProductTypes seed data inserted successfully';
END
ELSE
BEGIN
    PRINT 'ProductTypes seed data already exists';
END

-- Step 3: Add columns to Products table if they don't exist
IF NOT EXISTS (SELECT * FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = 'Products' AND COLUMN_NAME = 'ProductTypeId')
BEGIN
    ALTER TABLE Products ADD ProductTypeId int NULL;
    PRINT 'ProductTypeId column added to Products table';
END
ELSE
BEGIN
    PRINT 'ProductTypeId column already exists in Products table';
END

IF NOT EXISTS (SELECT * FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = 'Products' AND COLUMN_NAME = 'Description')
BEGIN
    ALTER TABLE Products ADD Description nvarchar(1000) NULL;
    PRINT 'Description column added to Products table';
END
ELSE
BEGIN
    PRINT 'Description column already exists in Products table';
END

-- Step 4: Create foreign key constraint
IF NOT EXISTS (SELECT * FROM INFORMATION_SCHEMA.REFERENTIAL_CONSTRAINTS WHERE CONSTRAINT_NAME = 'FK_Products_ProductTypes_ProductTypeId')
BEGIN
    ALTER TABLE Products 
    ADD CONSTRAINT FK_Products_ProductTypes_ProductTypeId 
    FOREIGN KEY (ProductTypeId) REFERENCES ProductTypes(ProductTypeId) ON DELETE SET NULL;
    
    PRINT 'Foreign key constraint created successfully';
END
ELSE
BEGIN
    PRINT 'Foreign key constraint already exists';
END

-- Step 5: Create index
IF NOT EXISTS (SELECT * FROM sys.indexes WHERE name = 'IDX_Products_ProductTypeId')
BEGIN
    CREATE INDEX IDX_Products_ProductTypeId ON Products(ProductTypeId);
    PRINT 'Index on ProductTypeId created successfully';
END
ELSE
BEGIN
    PRINT 'Index on ProductTypeId already exists';
END

-- Step 6: Update __EFMigrationsHistory table
IF NOT EXISTS (SELECT * FROM __EFMigrationsHistory WHERE MigrationId = '20241218000000_AddProductTypeTable')
BEGIN
    INSERT INTO __EFMigrationsHistory (MigrationId, ProductVersion) 
    VALUES ('20241218000000_AddProductTypeTable', '8.0.0');
    PRINT 'Migration history updated';
END

PRINT 'ProductType migration completed successfully!';

-- Verify the setup
SELECT 'ProductTypes Count' as TableInfo, COUNT(*) as RecordCount FROM ProductTypes
UNION ALL
SELECT 'Products Count', COUNT(*) FROM Products;

SELECT * FROM ProductTypes ORDER BY DisplayOrder;