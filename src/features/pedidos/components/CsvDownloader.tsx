import React from "react";
import { pedidos } from "../interfaces";
interface CsvDownloaderProps {
  data?: pedidos[];
  filename?: string;
}

const CsvDownloader: React.FC<CsvDownloaderProps> = ({
  data = [],
  filename,
}) => {
  const downloadCsv = () => {
    // Crear el contenido del CSV
    const csvContent = convertToCsv(data);

    // Crear un Blob con el contenido CSV
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });

    // Crear un enlace para descargar el archivo CSV
    const link = document.createElement("a");
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute("href", url);
      link.setAttribute("download", filename || "data.csv");
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const convertToCsv = (data: pedidos[]) => {
    const csvRows = [];

    // Obtener las cabeceras del CSV
    const headers = Object.keys(data[0]);
    csvRows.push(headers.join(","));

    // Convertir los datos en filas CSV
    for (const row of data) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      const values = headers.map((header) => escapeCsvValue(row[header]));
      csvRows.push(values.join(","));
    }

    // Unir todas las filas en un solo string
    return csvRows.join("\n");
  };

  const escapeCsvValue = (value: string | number) => {
    // Si el valor contiene comas, envolverlo entre comillas
    if (typeof value === "string" && value.includes(",")) {
      return `"${value}"`;
    }
    return String(value);
  };

  return <button onClick={downloadCsv}>Descargar CSV</button>;
};

export default CsvDownloader;
