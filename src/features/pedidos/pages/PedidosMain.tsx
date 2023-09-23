import { useQuery } from "@tanstack/react-query";
import { Menu, Typography, List, Skeleton, Tag } from "antd";
import { useSearchParams } from "react-router-dom";
import jarasApi from "../../../api";

import { OptionsResponse } from "../interfaces";

function PedidosMain() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { isLoading, data } = useQuery({
    queryKey: ["options"],
    queryFn: async () => {
      const { data } = await jarasApi.get<OptionsResponse>("/pedidos");

      return data.data;
    },
  });

  console.log(data);
  return (
    <div>
      <Typography.Title
        style={{
          margin: 0,
          padding: 0,
        }}
        level={1}
      >
        Mis pedidos
      </Typography.Title>

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
        activeKey={searchParams.get("status") || data?.estados[0].id.toString()}
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
        dataSource={data?.pedidos}
        loading={isLoading}
        renderItem={(item) => (
          <List.Item
            actions={[
              <a key={"list-edit"}>Editar</a>,
              <a
                style={{
                  color: "red",
                }}
                key={"list-delete"}
              >
                Eliminar
              </a>,
            ]}
          >
            <Skeleton avatar title={false} loading={isLoading} active>
              <List.Item.Meta
                key={item.id}
                title={<a>{item.titulo}</a>}
                description={item.descripcion}
                children={item.cliente}
              />
              <Tag>{item.estadoPedido}</Tag>
            </Skeleton>
          </List.Item>
        )}
      />
    </div>
  );
}

export default PedidosMain;
