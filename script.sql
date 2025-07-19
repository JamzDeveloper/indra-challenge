CREATE TABLE
    appointments (
        id CHAR(36) PRIMARY KEY, -- UUID (appointmentId) 
        schedule_id INT UNSIGNED NOT NULL, -- ID numérico 
        country_iso ENUM ('PE', 'CL') NOT NULL, -- solo se permiten estos dos países 
        insured_id CHAR(5) NOT NULL,
        created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        description TEXT,
        status VARCHAR(50)
    );