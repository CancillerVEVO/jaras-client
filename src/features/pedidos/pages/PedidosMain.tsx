import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Menu,
  Typography,
  List,
  Skeleton,
  FloatButton,
  Col,
  Row,
  Tag,
  Button,
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

  let status = parseInt(searchParams.get("status") ?? "1", 10);
  status = isNaN(status) ? 1 : status;

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

      <FloatButton onClick={() => navigate("crear")} />
      <Menu
        style={{
          margin: 0,
          padding: 0,
        }}
        theme="light"
        mode="horizontal"
        onClick={(e) => {
          setSearchParams({ status: e.key });
        }}
        activeKey={String(status)}
      >
        {data?.estados.map((option) => {
          return (
            <Menu.Item
              key={option.id}
              style={{ margin: "0 1rem 0 0", padding: 0 }}
            >
              {option.estado}
            </Menu.Item>
          );
        })}
      </Menu>

      <List
        dataSource={data?.pedidos.filter(
          (pedido) => pedido.estadoPedido === status
        )}
        loading={isLoading}
        renderItem={(item) => (
          <List.Item
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
                description={`Cliente: ${item.cliente} - Lugar de entrega: ${item.lugarEntrega} - precio: ${item.precio} `}
              />
            </Skeleton>

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
            {
              <Tag
                color={
                  item.estadoPedido === 3
                    ? "red"
                    : item.estadoPedido === 1
                    ? "orange"
                    : "green"
                }
              >
                {
                  data?.estados.find(
                    (estado) => estado.id === item.estadoPedido
                  )?.estado
                }
              </Tag>
            }
            {`fecha creacion: ${parseISO(
              item.fechaCreacion
            ).toLocaleString()} - fecha estimada: ${parseISO(
              item.fechaEstimada
            ).toLocaleDateString()}`}
          </List.Item>
        )}
      />
    </div>
  );
}

export default PedidosMain;
