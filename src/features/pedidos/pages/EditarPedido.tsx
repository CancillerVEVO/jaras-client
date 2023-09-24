/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMutation, useQuery } from "@tanstack/react-query";
import jarasApi from "../../../api";
import { Estados, Lugares } from "../interfaces";
import {
  Button,
  DatePicker,
  Form,
  Input,
  Select,
  Switch,
  Typography,
  Upload,
  UploadFile,
  UploadProps,
} from "antd";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import ImgCrop from "antd-img-crop";
import { RcFile } from "antd/es/upload";
import { BASE_URL } from "../../../api/jaras.api";

export default function EditarPedido() {
  const lugares = useQuery<Lugares[]>({
    queryKey: ["lugares"],
    queryFn: async () => {
      const res = await jarasApi.get("/pedidos/estados");
      return res.data.data.lugares;
    },
  });

  const estados = useQuery<Estados[]>({
    queryKey: ["estados"],
    queryFn: async () => {
      const res = await jarasApi.get("/pedidos/estados");
      return res.data.data.estados;
    },
  });

  const id = useParams().id as string;

  const pedido = useQuery<any>({
    queryKey: ["pedido", id],
    queryFn: async () => {
      const res = await jarasApi.get(`/pedidos/${id}`);
      return res.data.data.pedido;
    },
  });

  const editarPedido = useMutation<any, Error>({
    cacheTime: 0,
    mutationFn: async (values: any) => {
      const fechaEstimada = dayjs(values.fechaEstimada).toISOString();
      const precio = parseFloat(values.precio);
      const estadoId = parseInt(values.estadoId, 10);
      const res = await jarasApi.put(`/pedidos/${id}`, {
        ...values,
        fechaEstimada,
        precio,
        estadoId,
      });

      return res.data.data;
    },
  });

  const eliminarReferencia = useMutation({
    cacheTime: 0,
    mutationFn: async (id: string) => {
      const res = await jarasApi.delete(`/referencias/${id}`);
      return res.data.data;
    },
  });

  const [fileList, setFileList] = useState<UploadFile[]>([]);

  useEffect(() => {
    setFileList(
      pedido.data
        ? pedido.data.referencias.map((r: any) => ({
            uid: r.id,
            name: r.id,
            status: "done",
            url: r.referenciaUrl,
          }))
        : []
    );
  }, [pedido.data]);

  const onChange: UploadProps["onChange"] = ({
    fileList: newFileList,
    file,
  }) => {
    if (file.response) {
      const fileUid = file.uid;
      const fileIndex = newFileList.findIndex((f) => f.uid === fileUid);
      // update file
      newFileList[fileIndex] = {
        ...newFileList[fileIndex],
        status: "done",
        url: file.response.data.referenciaUrl,
        name: file.response.data.id,
        uid: file.response.data.id,
      };
      setFileList(newFileList);
    } else {
      setFileList(newFileList);
    }
  };

  const onPreview = async (file: UploadFile) => {
    let src = file.url as string;
    if (!src) {
      src = await new Promise((resolve) => {
        const reader = new FileReader();
        reader.readAsDataURL(file.originFileObj as RcFile);
        reader.onload = () => resolve(reader.result as string);
      });
    }
    const image = new Image();
    image.src = src;
    const imgWindow = window.open(src);
    imgWindow?.document.write(image.outerHTML);
  };

  const navigate = useNavigate();

  useEffect(() => {
    if (editarPedido.data) {
      navigate(`/pedidos?status=${editarPedido.data.estadoId}`);
    }
  }, [editarPedido.data, navigate]);

  const dateFormatStr = "YYYY-MM-DD";

  const [form] = Form.useForm();

  useEffect(() => {
    form.setFieldsValue({
      titulo: pedido.data?.titulo,
      descripcion: pedido.data?.descripcion,
      cliente: pedido.data?.cliente,
      lugarEntregaId: pedido.data?.lugarEntregaId,
      anticipoPagado: pedido.data?.anticipoPagado,
      fechaEstimada: pedido.data
        ? dayjs(pedido.data?.fechaEstimada)
        : undefined,
      precio: pedido.data?.precio,
      estadoId: pedido.data?.estadoPedidoId,
    });
  }, [pedido.data, form]);

  return (
    <>
      <Typography.Title
        style={{
          margin: "0",
          marginBottom: "1rem",
        }}
        level={2}
      >
        Editar Pedido
      </Typography.Title>

      <Form
        disabled={pedido.isLoading}
        form={form}
        onFinish={editarPedido.mutate}
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

        {/* estadoId select */}

        <Form.Item
          label="Estado"
          name="estadoId"
          rules={[{ required: true, message: "Este campo es requerido." }]}
        >
          <Select
            loading={estados.isLoading}
            placeholder="Seleccione un estado"
            allowClear
          >
            {estados.data?.map((e) => (
              <Select.Option key={e.id} value={e.id}>
                {e.estado}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>

        <ImgCrop rotationSlider>
          <Upload
            action={BASE_URL + "/referencias/" + id}
            listType="picture-card"
            fileList={fileList}
            onChange={onChange}
            onPreview={onPreview}
            onRemove={async (file) => {
              eliminarReferencia.mutate(file.uid);
            }}
          >
            {fileList.length < 5 && "+ Upload"}
          </Upload>
        </ImgCrop>

        {editarPedido.isError && (
          <div
            style={{
              marginBottom: "1rem",
            }}
          >
            <Typography.Text type="danger">
              {editarPedido.error?.message}
            </Typography.Text>
          </div>
        )}

        <Button
          loading={editarPedido.isLoading}
          type="primary"
          htmlType="submit"
        >
          Guardar
        </Button>
      </Form>
    </>
  );
}
