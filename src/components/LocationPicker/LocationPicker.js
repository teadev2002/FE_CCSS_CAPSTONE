// src/components/LocationPicker.js
import React, { useState, useEffect, useCallback } from "react";
import { Select, Flex, Spin } from "antd";
import { toast } from "react-toastify";
import LocationPickerService from "./LocationPickerService";

const { Option } = Select;

const LocationPicker = ({ value, onChange, required = true }) => {
  const [districts, setDistricts] = useState([]);
  const [streets, setStreets] = useState([]);
  const [selectedDistrict, setSelectedDistrict] = useState(null);
  const [selectedStreet, setSelectedStreet] = useState(null);
  const [loading, setLoading] = useState(false);
  const [hasUserInteracted, setHasUserInteracted] = useState(false);

  // Fetch districts on mount
  useEffect(() => {
    const fetchDistricts = async () => {
      setLoading(true);
      try {
        const data = await LocationPickerService.getDistricts();
        setDistricts(data);
        if (data.length === 0) {
          toast.warn("No districts available. Please try again later.");
        }
      } catch (error) {
        setDistricts([]);
        toast.error("Failed to load districts.");
      } finally {
        setLoading(false);
      }
    };
    fetchDistricts();
  }, []);

  // Fetch streets when district changes
  useEffect(() => {
    if (selectedDistrict) {
      const fetchStreets = async () => {
        setLoading(true);
        try {
          const data = await LocationPickerService.getStreets(selectedDistrict);
          setStreets(data);
          setSelectedStreet(null); // Reset street selection
          console.log("Streets state:", data);
        } catch (error) {
          setStreets([]);
          setSelectedStreet(null);
          toast.error("Failed to load streets.");
        } finally {
          setLoading(false);
        }
      };
      fetchStreets();
    } else {
      setStreets([]);
      setSelectedStreet(null);
    }
  }, [selectedDistrict]);

  // Update parent with formatted location
  useEffect(() => {
    if (selectedDistrict && selectedStreet) {
      const district = districts.find((d) => d.id === selectedDistrict);
      const street = streets.find((s) => s.id === selectedStreet);
      if (district?.name && street?.name) {
        const location = `${street.name}, ${district.name}, TP.HCM`;
        console.log("Location updated:", location, {
          districtId: selectedDistrict,
          streetId: selectedStreet,
        });
        onChange?.(location);
      } else {
        console.warn("Invalid district or street:", { district, street });
      }
    } else if (!required) {
      onChange?.("");
    }
  }, [
    selectedDistrict,
    selectedStreet,
    districts,
    streets,
    onChange,
    required,
  ]);

  // Parse initial value (only if no user interaction)
  const parseInitialValue = useCallback(() => {
    if (value && districts.length && !hasUserInteracted) {
      const parts = value.split(", ");
      if (parts.length === 3 && parts[2] === "TP.HCM") {
        const districtName = parts[1];
        const districtMatch = districts.find((d) => d.name === districtName);
        if (districtMatch && selectedDistrict !== districtMatch.id) {
          setSelectedDistrict(districtMatch.id);
          console.log("Pre-filled district:", districtMatch.id);
        }
      }
    }
  }, [value, districts, hasUserInteracted, selectedDistrict]);

  useEffect(() => {
    parseInitialValue();
  }, [parseInitialValue]);

  useEffect(() => {
    if (
      value &&
      selectedDistrict &&
      streets.length &&
      !selectedStreet &&
      !hasUserInteracted
    ) {
      const parts = value.split(", ");
      if (parts.length === 3 && parts[2] === "TP.HCM") {
        const streetName = parts[0];
        const currentDistrict = districts.find(
          (d) => d.id === selectedDistrict
        );
        if (currentDistrict?.name === parts[1]) {
          const streetMatch = streets.find((s) => s.name === streetName);
          if (streetMatch) {
            setSelectedStreet(streetMatch.id);
            console.log("Pre-filled street:", streetMatch.id);
          } else {
            console.log("Invalid street in value:", streetName);
          }
        }
      }
    }
  }, [value, selectedDistrict, streets, hasUserInteracted]);

  return (
    <Flex>
      <Select
        style={{ width: "50%", minWidth: 150 }}
        placeholder="Select district"
        value={selectedDistrict}
        onChange={(value) => {
          console.log("Selected district:", value);
          setSelectedDistrict(value);
          setHasUserInteracted(true);
        }}
        loading={loading}
        disabled={loading}
        // showSearch
        filterOption={(input, option) =>
          option.children.toLowerCase().includes(input.toLowerCase())
        }
        notFoundContent={loading ? <Spin size="small" /> : "No districts found"}
      >
        {districts.map((district) => (
          <Option key={district.id} value={district.id}>
            {district.name}
          </Option>
        ))}
      </Select>{" "}
      &nbsp;&nbsp; &nbsp;&nbsp;
      <Select
        style={{ width: "50%", minWidth: 150 }}
        placeholder="Select street"
        value={selectedStreet}
        onChange={(value) => {
          console.log("Selected street:", {
            id: value,
            name: streets.find((s) => s.id === value)?.name,
          });
          setSelectedStreet(value);
          setHasUserInteracted(true);
        }}
        loading={loading}
        disabled={loading || !selectedDistrict || streets.length === 0}
        showSearch
        filterOption={(input, option) =>
          option.children.toLowerCase().includes(input.toLowerCase())
        }
        notFoundContent={loading ? <Spin size="small" /> : "No streets found"}
      >
        {streets.map((street) => (
          <Option key={street.id} value={street.id}>
            {street.name}
          </Option>
        ))}
      </Select>
    </Flex>
  );
};

export default LocationPicker;
