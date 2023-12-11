import React, { useEffect, useState } from "react";
import axios from "axios";
import { APP_ENV } from "../../../env";

interface NovaposhtaProps {
  onCitySelect: (selectedCity: string | null) => void;
}
interface NovaposhtaProps {
  onWarehouseSelect: ( selectedWarehouse: string | null) => void;
}


const Novaposhta: React.FC<NovaposhtaProps> = ({ onCitySelect, onWarehouseSelect }) => {
  const NP_API_KEY = APP_ENV.NOVAPOSHTA_KEY;
  const [cities, setCities] = useState<{ Ref: string; Description: string }[]>([]);
  const [selectedCity, setSelectedCity] = useState<{ Ref: string; Description: string } | null>(null);

  const [warehouses, setWarehouses] = useState<{ Ref: string; Description: string }[]>([]);
  const [selectedWarehouse, setSelectedWarehouse] = useState<{ Ref: string; Description: string } | null>(null);

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
      CityRef: selectedCity?.Ref || "",
    },
  };

  useEffect(() => {
    console.log("use effect");
    axios
      .post("https://api.novaposhta.ua/v2.0/json/", requestCityData)
      .then((response) => {
        console.log("response", response);

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
    if (onCitySelect) {
      onCitySelect(selectedCity?.Description || "");
    }
    if (onWarehouseSelect) {
      onWarehouseSelect(selectedWarehouse?.Description || "");
    }
  }, [selectedCity, selectedWarehouse, onCitySelect, onWarehouseSelect]);

  return (
    <>
    <div className="d-flex flex-column justify-content-center align-items-center">

      <label htmlFor="citySelect" hidden></label>
      <select
        id="citySelect"
        value={selectedCity?.Ref || ""}
        onChange={(e) => {
          setSelectedCity({
            Ref: e.target.value,
            Description: e.target.options[e.target.selectedIndex].text,
          });
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
        value={selectedWarehouse?.Ref || ""}
        onChange={(e) => setSelectedWarehouse({
          Ref: e.target.value,
          Description: e.target.options[e.target.selectedIndex].text,
        })}
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