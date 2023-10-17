CREATE TABLE "CA_housing_prices" (
    "Mon_Yr" DATE   NOT NULL,
    "CA" FLOAT   NOT NULL,
    "Alameda" FLOAT   NOT NULL,
    "Amador" FLOAT   NOT NULL,
    "Butte" FLOAT   NOT NULL,
    "Calaveras" FLOAT   NOT NULL,
    "Contra-Costa" FLOAT   NOT NULL,
    "Del_Norte" FLOAT   NOT NULL,
    "El_Dorado" FLOAT   NOT NULL,
    "Fresno" FLOAT   NOT NULL,
    "Glenn" FLOAT   NOT NULL,
    "Humboldt" FLOAT   NOT NULL,
    "Kern" FLOAT   NOT NULL,
    "Kings" FLOAT   NOT NULL,
    "Lake" FLOAT   NOT NULL,
    "Lassen" FLOAT   NOT NULL,
    "Los_Angeles" FLOAT   NOT NULL,
    "Madera" FLOAT   NOT NULL,
    "Marin" FLOAT   NOT NULL,
    "Mariposa" FLOAT   NOT NULL,
    "Mendocino" FLOAT   NOT NULL,
    "Merced" FLOAT   NOT NULL,
    "Mono" FLOAT   NOT NULL,
    "Monterey" FLOAT   NOT NULL,
    "Napa" FLOAT   NOT NULL,
    "Nevada" FLOAT   NOT NULL,
    "Orange" FLOAT   NOT NULL,
    "Placer" FLOAT   NOT NULL,
    "Plumas" FLOAT   NOT NULL,
    "Riverside" FLOAT   NOT NULL,
    "Sacramento" FLOAT   NOT NULL,
    "San_Benito" FLOAT   NOT NULL,
    "San_Bernardino" FLOAT   NOT NULL,
    "San_Diego" FLOAT   NOT NULL,
    "San_Francisco" FLOAT   NOT NULL,
    "San_Joaquin" FLOAT   NOT NULL,
    "San_Luis_Obispo" FLOAT   NOT NULL,
    "San_Mateo" FLOAT   NOT NULL,
    "Santa_Barbara" FLOAT   NOT NULL,
    "Santa_Clara" FLOAT   NOT NULL,
    "Santa_Cruz" FLOAT   NOT NULL,
    "Shasta" FLOAT   NOT NULL,
    "Siskiyou" FLOAT   NOT NULL,
    "Solano" FLOAT   NOT NULL,
    "Sonoma" FLOAT   NOT NULL,
    "Stanislaus" FLOAT   NOT NULL,
    "Sutter" FLOAT   NOT NULL,
    "Tehama" FLOAT   NOT NULL,
    "Trinity" FLOAT   NOT NULL,
    "Tulare" FLOAT   NOT NULL,
    "Tuolumne" FLOAT   NOT NULL,
    "Ventura" FLOAT   NOT NULL,
    "Yolo" FLOAT   NOT NULL,
    "Yuba" FLOAT   NOT NULL,
    CONSTRAINT "pk_CA_housing_prices" PRIMARY KEY (
        "Mon_Yr"
     )
);

CREATE TABLE "GDP" (
    "Date" DATE   NOT NULL,
    "GDP" FLOAT   NOT NULL,
    CONSTRAINT "pk_GDP" PRIMARY KEY (
        "Date"
     )
);

CREATE TABLE "Interest_Rate" (
    "Date" DATE   NOT NULL,
    "FEDFUNDS" FLOAT   NOT NULL,
    CONSTRAINT "pk_Interest_Rate" PRIMARY KEY (
        "Date"
     )
);

CREATE TABLE "Unemployment_Rates" (
    "Date" DATE   NOT NULL,
    "UNRATE" FLOAT   NOT NULL,
    CONSTRAINT "pk_Unemployment_Rates" PRIMARY KEY (
        "Date"
     )
);

ALTER TABLE "GDP" ADD CONSTRAINT "fk_GDP_Date" FOREIGN KEY("Date")
REFERENCES "CA_housing_prices" ("Mon_Yr");

ALTER TABLE "Interest_Rate" ADD CONSTRAINT "fk_Interest_Rate_Date" FOREIGN KEY("Date")
REFERENCES "CA_housing_prices" ("Mon_Yr");

ALTER TABLE "Unemployment_Rates" ADD CONSTRAINT "fk_Unemployment_Rates_Date" FOREIGN KEY("Date")
REFERENCES "CA_housing_prices" ("Mon_Yr");


-- Import CSV files into corresponding SQL table 
-- (Change each path to corresponding file paths.)
copy "CA_housing_prices" from '/Users/andreaaguilar/project_3/CA_housing_prices.csv' delimiter ',' csv header;

copy "GDP" from '/Users/andreaaguilar/project_3/GDP.csv' delimiter ',' csv header;

copy "Interest_Rate" from '/Users/andreaaguilar/project_3/FEDFUNDS.csv' delimiter ',' csv header;

copy "Unemployment_Rates" from '/Users/andreaaguilar/project_3/UNRATE.csv' delimiter ',' csv header


-- Verify data import
select * from "CA_housing_prices";

select * from "GDP";

select * from "Unemployment_Rates";

select * from "Interest_Rate";