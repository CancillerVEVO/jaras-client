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
  let lugarEntrega = parseInt(searchParams.get("lugarEntrega") ?? "1", 10);
  lugarEntrega = isNaN(lugarEntrega) ? 1 : lugarEntrega;
  let status = parseInt(searchParams.get("status") ?? "1", 10);
  status = isNaN(status) ? 1 : status;
  let precio = searchParams.get("precio") ?? "default";
  precio = precio === "default" ? precio : precio === "asc" ? "asc" : "desc";
  let anticipoPagado = searchParams.get("anticipoPagado") ?? true;
  anticipoPagado = anticipoPagado === "true" ? true : false;
  let fechaCreacion = searchParams.get("fechaCreacion") ?? "default";
  fechaCreacion =
    fechaCreacion === "asc"
      ? fechaCreacion
      : fechaCreacion === "asc"
      ? "asc"
      : "desc";

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
            precio: precio,
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
      {/* FILTRO PRECIO */}
      <Typography.Text style={{ marginRight: 8 }}>Precio:</Typography.Text>
      <Select
        value={searchParams.get("precio")}
        style={{ marginRight: 10, width: 150 }}
        onChange={(value) => {
          setSearchParams({
            status: status.toString(),
            lugarEntrega: lugarEntrega.toString(),
            precio: value,
            anticipoPagado: anticipoPagado.toString(),
          });
        }}
      >
        <Select.Option value="asc">De menor a mayor</Select.Option>
        <Select.Option value="desc">De mayor a menor</Select.Option>
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
            precio: precio,
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
            precio: precio,
            anticipoPagado: value.toString(),
          });
        }}
      >
        <Select.Option value={true}>Si</Select.Option>
        <Select.Option value={false}>No</Select.Option>
      </Select>

      {
        <Typography.Text style={{ marginRight: 8 }}>
          Fecha de creacion:
        </Typography.Text>
      }

      <Select
        value={fechaCreacion}
        style={{ width: 150, marginRight: 10 }}
        onChange={(value) => {
          setSearchParams({
            status: status.toString(),
            lugarEntrega: lugarEntrega.toString(),
            precio: precio,
            anticipoPagado: anticipoPagado.toString(),
            fechaCreacion: value.toString(),
          });
        }}
      >
        <Select.Option value="asc">recientes primero</Select.Option>
        <Select.Option value="desc">antiguas primero</Select.Option>
      </Select>

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
            if (precio === "asc") {
              return a.precio - b.precio;
            }
            if (precio === "desc") {
              return b.precio - a.precio;
            }
            return 0;
          })
          .sort((a, b) => {
            if (fechaCreacion === "asc") {
              return (
                parseISO(a.fechaCreacion).getTime() -
                parseISO(b.fechaCreacion).getTime()
              );
            }
            if (fechaCreacion === "desc") {
              return (
                parseISO(b.fechaCreacion).getTime() -
                parseISO(a.fechaCreacion).getTime()
              );
            }
            return 0;
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
