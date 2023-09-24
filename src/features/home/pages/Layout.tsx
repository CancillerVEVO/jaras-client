import { useState } from "react";
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  HomeOutlined,
  ScissorOutlined,
} from "@ant-design/icons";
import { Layout, Menu, Button, theme } from "antd";
import { Outlet, useLocation, useNavigate } from "react-router-dom";

const { Header, Sider, Content } = Layout;

const MainLayout: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  const {
    token: { colorBgContainer },
  } = theme.useToken();

  const navigate = useNavigate();
  const navigateSection = (key: string) => {
    navigate(key);
  };

  const location = useLocation();

  const parentPath = "/" + location.pathname.split("/")[1];
  const selectedKeys = location.pathname === parentPath ? [parentPath] : [];

  return (
    <Layout
      style={{
        margin: 0,
        height: "100vh",
      }}
    >
      <Sider trigger={null} collapsible collapsed={collapsed}>
        <div className="demo-logo-vertical" />
        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={selectedKeys}
          onSelect={({ key }) => navigateSection(key)}
          items={[
            {
              key: "/",
              icon: <HomeOutlined />,
              label: "Principal",
            },
            {
              key: "/pedidos",
              icon: <ScissorOutlined />,
              label: "Pedidos",
            },
          ]}
        />
      </Sider>
      <Layout>
        <Header style={{ padding: 0, background: colorBgContainer }}>
          <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => setCollapsed(!collapsed)}
            style={{
              fontSize: "16px",
              width: 64,
              height: 64,
            }}
          />
          Las Jaras
        </Header>
        <Content
          style={{
            margin: "2rem 16px",
            padding: 24,
            background: colorBgContainer,
            overflow: "auto",
          }}
        >
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
};
export default MainLayout;
