import "@tanstack/react-query";
import { useQuery } from "@tanstack/react-query";
import jarasApi from "../../../api";
import { DashboardResponse } from "../interfaces";
import { PieChart } from "../components/PieChart";
import { SalesChart } from "../components/SalesChart";
import { Link } from "react-router-dom";
import { parseISO, format } from "date-fns";

export default function Dashboard() {
  const { isLoading, data } = useQuery({
    queryKey: ["dashboard"],
    queryFn: async () => {
      const { data } = await jarasApi.get<DashboardResponse>("/dashboard");

      return data.data;
    },
  });

  console.log(data);

  const chartCard: React.CSSProperties = {
    boxShadow: "0 0 2px rgba(0,0,0,0.5)",
    borderRadius: "0.5rem",
    padding: "2rem",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    gap: "1rem",
    gridColumn: "span 3",
  };

  const nextPaymentCard: React.CSSProperties = {
    boxShadow: "0 0 2px rgba(0,0,0,0.5)",
    borderRadius: "0.5rem",
    padding: "2rem",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    gap: "1rem",
    gridColumn: "span 3",
  };

  return (
    <div
      style={{
        //width: "500px",
        display: "grid",
        gridTemplateColumns: "repeat(6, minmax(0, 1fr))",
        gap: "3rem",
      }}
    >
      <Card1 label="En proceso" value={data?.count.enProceso} />
      <Card1 label="Entregado" value={data?.count.entregados} />
      <Card1 label="Cancelado" value={data?.count.cancelados} />
      <div style={chartCard}>
        {isLoading ? (
          <div>Loading...</div>
        ) : (
          <PieChart data={data?.pieChart || []} />
        )}
      </div>
      <div style={chartCard}>
        {isLoading ? (
          <div>Loading...</div>
        ) : (
          <SalesChart data={data?.saleByDate || []} />
        )}
      </div>
      <h1>Tu siguiente pedido es: </h1>
      <Link to={"/pedidos/" + data?.nextPayment[0].id} style={nextPaymentCard}>
        <span
          style={{
            fontWeight: "bold",
            fontSize: "1.5rem",
            padding: 0,
            margin: 0,
          }}
        ></span>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "0.5rem",
            color: "black",
          }}
        >
          <h1
            style={{
              fontSize: "1.2rem",
              margin: 0,
            }}
          >
            {data?.nextPayment[0].titulo}
          </h1>
          <p
            style={{
              fontSize: "1.2rem",
              margin: 0,
            }}
          >
            {data?.nextPayment[0].descripcion}
          </p>
          <p
            style={{
              fontSize: "1.5rem",
              margin: 0,
              color: "green",
            }}
          >
            $ {data?.nextPayment[0].precio}
          </p>
          <p>
            {parseISO(
              data?.nextPayment[0].fechaEstimada || ""
            ).toLocaleString()}
          </p>
        </div>
      </Link>
      <Card1
        label="Total de ventas"
        value={
          <div>
            <span style={{ fontSize: "4rem" }}>{`$ ${data?.totalSales}`}</span>
          </div>
        }
      />
    </div>
  );
}

function Card1({ label, value }: { label: string; value?: React.ReactNode }) {
  return (
    <div
      style={{
        // add shadow:
        boxShadow: "0 0 2px rgba(0,0,0,0.5)",
        borderRadius: "0.5rem",
        padding: "2rem",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        gap: "1rem",
        gridColumn: "span 2",
      }}
    >
      <span
        style={{
          fontWeight: "bold",
          fontSize: "1.5rem",
          padding: 0,
          margin: 0,
        }}
      >
        {label}
      </span>
      <span
        style={{
          fontSize: "4rem",
          overflow: "hidden",
        }}
      >
        {value}
      </span>
    </div>
  );
}
