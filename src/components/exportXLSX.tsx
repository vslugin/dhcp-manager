import React from "react";

export default function MyCustomAction() {
    return (
      <button onClick={() => window.open("http://" + window.location.host + "/api/users/export")}>
        Export to XLSX
      </button>
    )
  }

export function ExportDHCPConfig() {
    return (
      <button onClick={() => window.open("http://" + window.location.host + "/api/users/dhcp-config")}>
        Export to DHCP
      </button>
    )
  }