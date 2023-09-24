/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMutation, useQuery } from "@tanstack/react-query";
import jarasApi from "../../../api";
import { Lugares } from "../interfaces";
import {
  Button,
  DatePicker,
  Form,
  Input,
  Select,
  Switch,
  Typography,
} from "antd";
import dayjs from "dayjs";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function CrearPedido() {
  const lugares = useQuery<Lugares[]>({
    queryKey: ["lugares"],
    queryFn: async () => {
      const res = await jarasApi.get("/pedidos/estados");
      return res.data.data.lugares;
    },
  });

  const crearPedido = useMutation<any, Error>({
    cacheTime: 0,
    mutationFn: async (values: any) => {
      const fechaEstimada = dayjs(values.fechaEstimada).toISOString();
      const precio = parseFloat(values.precio);
      const res = await jarasApi.post("/pedidos", {
        ...values,
        fechaEstimada,
        precio,
      });

      return res.data.data;
    },
  });

  const navigate = useNavigate();

  useEffect(() => {
    if (crearPedido.data) {
      navigate(`/pedidos/${crearPedido.data.id}`);
    }
  }, [crearPedido.data, navigate]);

  const dateFormatStr = "YYYY-MM-DD";

  return (
    <>
      <Typography.Title
        style={{
          margin: "0",
          marginBottom: "1rem",
        }}
        level={2}
      >
        Crear Pedido
      </Typography.Title>
      <Form
        //layout="vertical"
        onFinish={crearPedido.mutate}
        initialValues={{
          titulo: "",
          descripcion: "",
          cliente: "",
          lugarEntregaId: 1,
          anticipoPagado: false,
          fechaEstimada: dayjs(new Date().toISOString(), dateFormatStr),
          precio: "",
        }}
      >
        {/* Titulo */}
        <Form.Item
          label="Titulo"
          name="titulo"
          rules={[{ required: true, message: "Este campo es requerido." }]}
        >
          <Input placeholder="Titulo" />
        </Form.Item>

        {/* Descripcion */}
        <Form.Item
          label="Descripcion"
          name="descripcion"
          rules={[{ required: true, message: "Este campo es requerido." }]}
        >
          <Input placeholder="Descripcion" />
        </Form.Item>

        {/* Cliente */}
        <Form.Item
          label="Cliente"
          name="cliente"
          rules={[{ required: true, message: "Este campo es requerido." }]}
        >
          <Input placeholder="Ciente" />
        </Form.Item>
        <Form.Item
          label="Lugar"
          name="lugarEntregaId"
          rules={[{ required: true, message: "Este campo es requerido." }]}
        >
          <Select
            loading={lugares.isLoading}
            placeholder="Seleccione un lugar"
            allowClear
          >
            {lugares.data?.map((e) => (
              <Select.Option key={e.id} value={e.id}>
                {e.lugar}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>

        {/* anticipoPagado switch */}
        <Form.Item
          label="Anticipo"
          name="anticipoPagado"
          valuePropName="checked"
        >
          <Switch />
        </Form.Item>

        {/* fechaEstimada datePicker */}

        <Form.Item
          label="Fecha estimada"
          name="fechaEstimada"
          rules={[{ required: true, message: "Este campo es requerido." }]}
        >
          <DatePicker format={dateFormatStr} />
        </Form.Item>

        {/* precio */}

        <Form.Item
          label="Precio"
          name="precio"
          rules={[
            {
              required: true,
              message: "Este campo es requerido.",
            },
            // regex money
            {
              pattern: /^[0-9]+(\.[0-9]{1,2})?$/,
              message: "El precio es invalido.",
            },
          ]}
        >
          <Input placeholder="Precio" />
        </Form.Item>

        {crearPedido.isError && (
          <div
            style={{
              marginBottom: "1rem",
            }}
          >
            <Typography.Text type="danger">
              {crearPedido.error?.message}
            </Typography.Text>
          </div>
        )}

        <Button
          loading={crearPedido.isLoading}
          type="primary"
          htmlType="submit"
        >
          Crear
        </Button>
      </Form>
    </>
  );
}
