import React, { useEffect, useState } from "react";
import axios from "axios";
import { APP_ENV } from "../../../env";

interface NovaposhtaProps {
  onCityWarehouseSelect: (combinedValue: string) => void;
}

const Novaposhta: React.FC<NovaposhtaProps> = ({ onCityWarehouseSelect }) => {
  const NP_API_KEY = APP_ENV.NOVAPOSHTA_KEY;
  const [cities, setCities] = useState<{ Ref: string; Description: string }[]>([]);
  const [selectedCity, setSelectedCity] = useState<string | null>(null);

  const [warehouses, setWarehouses] = useState<{ Ref: string; Description: string }[]>([]);
  const [selectedWarehouse, setSelectedWarehouse] = useState<string | null>(null);

  const requestCityData = {
    apiKey: NP_API_KEY,
    modelName: "Address",
    calledMethod: "getCities",
    methodProperties: {
    },
  };

  const requestWarehouseData = {
    apiKey: NP_API_KEY,
    modelName: "Address",
    calledMethod: "getWarehouses",
    methodProperties: {
      CityRef: selectedCity || "",
    },
  };

  useEffect(() => {
    axios
      .post("https://api.novaposhta.ua/v2.0/json/", requestCityData)
      .then((response) => {
        const cityData = response.data.data.map((city: { Ref: string; Description: string }) => city);
        setCities(cityData);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  useEffect(() => {
    if (selectedCity) {
      axios
        .post("https://api.novaposhta.ua/v2.0/json/", requestWarehouseData)
        .then((response) => {
          const warehouseData = response.data.data.map((warehouse: { Ref: string; Description: string }) => warehouse);
          setWarehouses(warehouseData);
        })
        .catch((error) => {
          console.error(error);
        });
    }
  }, [selectedCity]);

  useEffect(() => {
    if (onCityWarehouseSelect) {
      onCityWarehouseSelect(`${selectedCity || ""} ${selectedWarehouse || ""}`);
    }
  }, [selectedCity, selectedWarehouse, onCityWarehouseSelect]);

  return (
    <>
      <div className="d-flex flex-column justify-content-center align-items-center">

        <label htmlFor="citySelect" hidden></label>
        <select
          id="citySelect"
          value={selectedCity || ""}
          onChange={(e) => {
            setSelectedCity(e.target.value);
            setSelectedWarehouse(null);
          }}
        >
          <option value="">Населений пункт:</option>
          {cities.map((city, index) => (
            <option key={index} value={city.Ref}>
              {city.Description}
            </option>
          ))}
        </select>

        <label htmlFor="warehouseSelect" hidden></label>
        <select
          id="warehouseSelect"
          value={selectedWarehouse || ""}
          onChange={(e) => setSelectedWarehouse(e.target.value)}
          disabled={!selectedCity}
        >
          <option value="">Відділення:</option>
          {warehouses.map((warehouse, index) => (
            <option key={index} value={warehouse.Ref}>
              {warehouse.Description}
            </option>
          ))}
        </select>
      </div>



    </>
  );
};

export default Novaposhta;
