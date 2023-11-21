import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Typography,
  List,
  Skeleton,
  FloatButton,
  Col,
  Row,
  Tag,
  Button,
  Select,
} from "antd";
import { Link, useNavigate, useSearchParams } from "react-router-dom";

import jarasApi from "../../../api";

import { OptionsResponse } from "../interfaces";
import { parseISO } from "date-fns";
import { useState } from "react";
import CsvDownloader from "../components/CsvDownloader";

function PedidosMain() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { isLoading, data } = useQuery({
    queryKey: ["pedidos"],
    queryFn: async () => {
      const { data } = await jarasApi.get<OptionsResponse>("/pedidos");

      return data.data;
    },
  });

  const [orderBy, setOrderBy] = useState({
    property: null,
    direction: "asc",
  });

  const queryClient = useQueryClient();

  const deletePedido = useMutation({
    cacheTime: 0,
    mutationFn: async (id: number) => {
      await queryClient.cancelQueries(["pedidos"]);
      const res = await jarasApi.delete(`/pedidos/${id}`);

      queryClient.invalidateQueries(["pedidos"]);

      return res.data.data;
    },
  });
  let lugarEntrega = parseInt(searchParams.get("lugarEntrega") ?? "4", 10);
  lugarEntrega = isNaN(lugarEntrega) ? 1 : lugarEntrega;
  let status = parseInt(searchParams.get("status") ?? "4", 10);
  status = isNaN(status) ? 1 : status;
  let anticipoPagado = searchParams.get("anticipoPagado") ?? true;
  anticipoPagado = anticipoPagado === "true" ? true : false;

  return (
    <div>
      <Row>
        <Col span={6}>
          <Typography.Title
            style={{
              margin: "0",
            }}
            level={2}
          >
            Pedidos
          </Typography.Title>
        </Col>
        <Col></Col>
      </Row>
      <br />
      <br />
      <CsvDownloader
        data={data?.pedidos
          .filter((pedido) => {
            const lugarFilter =
              lugarEntrega === 4 ||
              pedido.lugarEntrega === data.lugares[lugarEntrega - 1].lugar;
            const statusFilter = pedido.estadoPedido === status || status === 4;

            const anticipoFilter = anticipoPagado === pedido.anticipoPagado;

            return lugarFilter && statusFilter && anticipoFilter;
          })
          .sort((a, b) => {
            if (orderBy.property === null) {
              return 0;
            }
            if (orderBy.direction === "asc") {
              return a[orderBy.property] > b[orderBy.property] ? 1 : -1;
            } else {
              return a[orderBy.property] < b[orderBy.property] ? 1 : -1;
            }
          })}
        filename="pedidos.csv"
      />
      <br />
      <br />
      {/* LUGAR DE ENTREGA */}
      <Typography.Text style={{ marginRight: 8 }}>
        Lugar de Entrega:
      </Typography.Text>
      <Select
        value={lugarEntrega}
        style={{ width: 150, marginRight: 10 }}
        onChange={(value) => {
          setSearchParams({
            status: status.toString(),
            lugarEntrega: `${value}`,
            anticipoPagado: anticipoPagado.toString(),
          });
        }}
      >
        <Select.Option value={4}>Todos</Select.Option>
        {data?.lugares.map((option) => (
          <Select.Option key={option.id} value={option.id}>
            {option.lugar}
          </Select.Option>
        ))}
      </Select>
      <FloatButton onClick={() => navigate("crear")} />
      {/* FILTRO STATUS */}
      <Typography.Text style={{ marginRight: 8 }}>Status:</Typography.Text>
      <Select
        value={status}
        style={{ width: 150, marginRight: 10 }}
        onChange={(value) => {
          setSearchParams({
            status: `${value}`,
            lugarEntrega: lugarEntrega.toString(),
            anticipoPagado: anticipoPagado.toString(),
          });
        }}
      >
        <Select.Option value={4}>Todos</Select.Option>
        <Select.Option value={1}>En proceso</Select.Option>
        <Select.Option value={2}>Completado</Select.Option>
        <Select.Option value={3}>Cancelado</Select.Option>
      </Select>

      {/* FILTRO ANTICIPO PAGADO */}
      <Typography.Text style={{ marginRight: 8 }}>
        Anticipo Pagado:
      </Typography.Text>
      <Select
        value={anticipoPagado}
        style={{ width: 150, marginRight: 10 }}
        onChange={(value) => {
          setSearchParams({
            status: status.toString(),
            lugarEntrega: lugarEntrega.toString(),

            anticipoPagado: value.toString(),
          });
        }}
      >
        <Select.Option value={true}>Si</Select.Option>
        <Select.Option value={false}>No</Select.Option>
      </Select>

      <br />
      <br />
      {
        <Typography.Text style={{ marginRight: 8 }}>
          Ordenar por:
        </Typography.Text>
      }

      {/* ORDENAR POR */}
      <Select
        value={orderBy.property}
        style={{ width: 150, marginRight: 10 }}
        onChange={(value) => {
          setOrderBy({
            property: value,
            direction: orderBy.direction,
          });
        }}
      >
        <Select.Option value="precio">precio</Select.Option>
        <Select.Option value="fechaCreacion">fecha de creacion</Select.Option>
      </Select>

      {/* DIRECCION */}
      <Select
        value={orderBy.direction}
        style={{ width: 150, marginRight: 10 }}
        onChange={(value) => {
          setOrderBy({
            property: orderBy.property,
            direction: value,
          });
        }}
      >
        <Select.Option value="asc">los mas bajos primero</Select.Option>
        <Select.Option value="desc">los mas grandes primero</Select.Option>
      </Select>

      <br />
      <br />

      <List
        dataSource={data?.pedidos
          .filter((pedido) => {
            const lugarFilter =
              lugarEntrega === 4 ||
              pedido.lugarEntrega === data.lugares[lugarEntrega - 1].lugar;
            const statusFilter = pedido.estadoPedido === status || status === 4;

            const anticipoFilter = anticipoPagado === pedido.anticipoPagado;

            return lugarFilter && statusFilter && anticipoFilter;
          })
          .sort((a, b) => {
            if (orderBy.property === null) {
              return 0;
            }
            if (orderBy.direction === "asc") {
              return a[orderBy.property] > b[orderBy.property] ? 1 : -1;
            } else {
              return a[orderBy.property] < b[orderBy.property] ? 1 : -1;
            }
          })}
        loading={isLoading}
        renderItem={(item) => (
          <List.Item
            style={{
              padding: "1rem ",
              height: "210px",
              border: "1px solid #e8e8e8",
            }}
            actions={[
              <Link to={item.id.toString()} key={"list-edit"}>
                Editar
              </Link>,
              <Button
                onClick={() => {
                  deletePedido.mutate(item.id);
                }}
                style={{
                  color: "red",
                }}
                key={"list-delete"}
                loading={
                  deletePedido.variables === item.id && deletePedido.isLoading
                }
              >
                Eliminar
              </Button>,
            ]}
          >
            <Skeleton avatar title={false} loading={isLoading} active>
              <List.Item.Meta
                key={item.id}
                title={<a>{item.titulo}</a>}
                description={`Cliente: ${item.cliente} - Lugar de entrega: ${item.lugarEntrega} `}
              />
            </Skeleton>
            {
              <Row>
                <Tag
                  color={
                    item.estadoPedido === 1
                      ? "orange"
                      : item.estadoPedido === 2
                      ? "green"
                      : "red"
                  }
                >
                  {item.estadoPedido == 1
                    ? "En proceso"
                    : item.estadoPedido == 2
                    ? "Completado"
                    : item.estadoPedido == 3 && "Cancelado"}
                </Tag>
              </Row>
            }
            {
              <Row>
                <Col span={8}>
                  {
                    <Typography.Paragraph>
                      {item.descripcion}
                    </Typography.Paragraph>
                  }
                </Col>
              </Row>
            }
            {`fecha creacion: ${parseISO(
              item.fechaCreacion
            ).toLocaleString()} - fecha estimada: ${parseISO(
              item.fechaEstimada
            ).toLocaleDateString()}`}

            {
              <Row style={{ marginTop: 12 }}>
                <Typography.Text style={{ marginRight: 8 }}>
                  Anticipo:
                </Typography.Text>
                <Tag
                  color={item.anticipoPagado ? "green-inverse" : "red-inverse"}
                >
                  {item.anticipoPagado ? "Pagado" : "No pagado"}
                </Tag>
                <Typography.Text style={{ marginRight: 8 }}>
                  Precio:
                </Typography.Text>
                <Tag color="blue">{`$${item.precio}`}</Tag>
              </Row>
            }
          </List.Item>
        )}
      />
    </div>
  );
}

export default PedidosMain;
