// src/QuestionForm.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";
import Sidebar from "../components/Sidebar";
import Select from "react-select";
import "./questionForm.css";

export default function QuestionForm() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    device_type: "",
    item: "",
    quantity: "",
    region: "",
    district: "",
    reason: "",
    description: "",
  });

  const regionDistrictMap = {
    "HEAD OFFICE": ["PROJECT OFFICE", "SU TOWERS", "ELECTROVOLTA"],
    "ACCRA WEST": [
      "Achimota",
      "Korle-Bu",
      "Nsawam",
      "Amasaman",
      "Kaneshie",
      "Bortianor",
      "Ablekuma",
    ],
    "ACCRA EAST": [
      "Legon",
      "Adenta",
      "Roman Ridge",
      "Teshie",
      "Dodowa",
      "Kwabenya",
      "Mampong",
    ],
    "ASHANTI EAST": [
      "Dunkwa",
      "Obuasi",
      "Bekwai",
      "Suame",
      "Danyame",
      "Abuakwa",
      "Offinso",
      "New Edubiase",
      "Effiduase",
      "Ejisu",
      "Mampong",
      "Asokwa",
      "Ayigya",
      "Boadi WH",
      "Kokoben",
      "Adum WS",
      "Kwabre",
    ],
    CENTRAL: [
      "Cape Coast Dist",
      "Twifo Praso",
      "Assin Fosu",
      "Saltpond",
      "Ajumako",
      "Breman-Asikuma",
      "Swedru",
      "Kasoa North",
      "Winneba",
      "Kasoa South",
    ],
    EASTERN: [
      "Nkawkaw",
      "Donkorkrom",
      "Mpraeso",
      "Tafo",
      "Koforidua",
      "Suhum",
      "Kibi",
      "New Abirem",
      "Kade",
      "Akwatia",
      "Assesewa",
      "Akim Oda",
      "Begoro",
    ],
    TEMA: [
      "Tema South",
      "Tema North",
      "Somanya (Krobo)",
      "Prampram",
      "Juapong",
      "Noaso",
      "Ada",
      "Sege",
      "Nungua",
      "Afienya",
      "Ashaiman",
    ],
    WESTERN: [
      "Sekondi",
      "Enchi",
      "Bibiani",
      "Half Assini",
      "Sefwi Wiaso",
      "Bogoso_New office",
      "Juabeso",
      "Agona Nkwanta",
      "Asankragua",
      "Tarkwa",
      "Axim Dist",
    ],
    VOLTA: [
      "Akatsi",
      "Keta",
      "Denu",
      "Kpeve",
      "Kpando",
      "Hohoe",
      "Sogakope",
      "Jasikan",
      "Nkwanta",
      "Dambai",
    ],
  };

  const lanOptions = [
    "24PORT Managed",
    "16 PORT",
    "48PORT Managed",
    "24PORT non-managed",
    "CAT6 305M CABLES",
    "D-LINK OUTDOOR",
    "EXCEL",
    "KUWES",
    "UPS",
    "3KVA",
    "5M EXCEL CAT6e PATCH CORDS",
    "1M EXCEL CAT6e PATCH CORDS",
    "RJ45 CONNECTORS",
    "48-PORT EXCEL CAT6E PATCH PANEL",
    "24-PORT EXCEL CAT6E PATCH PANEL",
    "42U RACK",
    "27U RACK",
    "12U RACK",
    "9U RACK",
    "TRENDNET 8-PORT SWITCH",
    "TRENDNET 16-PORT SWITCH",
    "TRENDNET 24-PORT SWITCH",
    "TRENDNET 28-PORT SWITCH",
    "TRENDNET 48-PORT  SWITCH",
    "TRENDNET 52-PORT SWITCH",
    "EXCEL CAT 6E FACEPLATE (TWIN)",
    "EXCEL CAT 6E FACEPLATE (SINGLE)",
    "KUWES CAT 6E FACEPLATE",
    "KUWES CAT 6E CABLE (305M)",
    "EXCEL CAT 6E CABLE (305m)",
    "UPS 3KVA",
    "EXTENSION BOARDS",
  ];
  const wanOptions = [
    "QRT",
    "BASEBOX_5 (Radio)",
    "NETBOX_5 (Advanced of basebox_5)",
    "NETPOWER (outdoor PoE switch normally for base stations)",
    "MANT (Sector Antenna)",
    "CAP LITE (2.4Hz small wifi device)",
    "CAP AC (wifi device)",
    "CAP XL (advanced CAP AC)",
    "HEX LITE (normally used for IPSec..)",
    "LHG XL (Mesh Antenna)***",
    "CRS112 (Router Ethernet switch PoE normally used for server rooms)",
    "BASEBOX_2 (Radio)***",
    "HEX S",
    "SLEEVE (Parabolic Antenna)",
    "PoE ADAPTER SMALL WHITE(without power cable)",
    "PoE ADAPTER BIG BLACK (for netpower)",
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => {
      if (name === "region") {
        return { ...prevData, [name]: value, district: "" };
      }
      return { ...prevData, [name]: value };
    });
  };

  const handleSelectChange = (name, value) => {
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    const userRole = user?.user_metadata?.role || "";
    const userEmail = user?.email || "";

    let item = "";
    if (formData.device_type === "LAN") {
      item = formData.lanItem;
    } else if (formData.device_type === "WAN") {
      item = formData.wanItem;
    }

    const { data, error } = await supabase.from("Requests").insert([
      {
        device_type: formData.device_type,
        item: item,
        quantity: formData.quantity,
        region: formData.region,
        district: formData.district,
        reason: formData.reason,
        description: formData.description,
        created_at: new Date().toISOString(),
        status: "pending",
        user_role: userRole,
        user_email: userEmail,
      },
    ]);
    if (error) {
      alert("Error submitting request: " + error.message);
    } else {
      alert("Request submitted successfully!");
      setFormData({
        device_type: "",
        item: "",
        quantity: "",
        region: "",
        district: "",
        reason: "",
        description: "",
      });
      navigate("/dashboard");
    }
  };

  return (
    <div className="dashboard-root">
      <Sidebar />
      <div className="dashboard-main">
        <form className="question-form" onSubmit={handleSubmit}>
          <label>Device Type</label>
          <select
            name="device_type"
            value={formData.device_type}
            onChange={handleChange}
            required
          >
            <option value="">Select device type</option>
            <option value="LAN">LAN</option>
            <option value="WAN">WAN</option>
          </select>

          {formData.device_type === "LAN" && (
            <>
              <label>LAN Item</label>
              <Select
                name="lanItem"
                options={lanOptions.map((item) => ({
                  value: item,
                  label: item,
                }))}
                value={
                  formData.lanItem
                    ? { value: formData.lanItem, label: formData.lanItem }
                    : null
                }
                onChange={(option) =>
                  handleSelectChange("lanItem", option ? option.value : "")
                }
                placeholder="Search or select LAN item"
                isClearable
                required
              />
            </>
          )}

          {formData.device_type === "WAN" && (
            <>
              <label>WAN Item</label>
              <Select
                name="wanItem"
                options={wanOptions.map((item) => ({
                  value: item,
                  label: item,
                }))}
                value={
                  formData.wanItem
                    ? { value: formData.wanItem, label: formData.wanItem }
                    : null
                }
                onChange={(option) =>
                  handleSelectChange("wanItem", option ? option.value : "")
                }
                placeholder="Search or select WAN item"
                isClearable
                required
              />
            </>
          )}

          <label>Quantity</label>
          <input
            type="number"
            name="quantity"
            value={formData.quantity}
            onChange={handleChange}
            required
          />

          <label>Region</label>
          <select
            name="region"
            value={formData.region}
            onChange={handleChange}
            required
          >
            <option value="">Select a region</option>
            {Object.keys(regionDistrictMap).map((region) => (
              <option key={region} value={region}>
                {region}
              </option>
            ))}
          </select>

          <label>District</label>
          <select
            name="district"
            value={formData.district}
            onChange={handleChange}
            required
            disabled={!formData.region}
          >
            <option value="">Select a district</option>
            {formData.region &&
              regionDistrictMap[formData.region]?.map((district) => (
                <option key={district} value={district}>
                  {district}
                </option>
              ))}
          </select>

          <label>Description</label>
          <textarea
            name="description"
            rows="4"
            value={formData.description}
            onChange={handleChange}
            required
            placeholder="Describe the purpose of your request"
          ></textarea>

          <label>Reason</label>
          <textarea
            name="reason"
            rows="4"
            value={formData.reason}
            onChange={handleChange}
            required
          ></textarea>

          <button type="submit" className="submit-btn">
            Submit Request
          </button>
        </form>
      </div>
    </div>
  );
}
