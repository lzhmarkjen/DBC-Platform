import React, {useState, ReactElement} from "react"
import {Layout, Button, Modal} from 'antd';
import styles from "./index.module.scss"
import Avatar from "../../Assets/logo.jpeg"
import './index.css'
import SideMenu from "../SideMenu";
import {Redirect} from "react-router";

const {Header, Content, Sider} = Layout;

const MainLayout = (props: { children: ReactElement }) => {
    const [loginState, setLoginState] = useState(true);
    const [collapsed, setCollapsed] = useState(false);
    const [logout, setLogout] = useState(false);

    return (
        <Layout style={{minHeight: '100vh'}}>
            <Sider collapsible collapsed={collapsed} theme="light"
                   onCollapse={() => setCollapsed(!collapsed)}>
                <div className={styles.logo}>
                    BUAA
                </div>
                <SideMenu/>
            </Sider>

            <Layout>
                <Header className={styles.header}>
                    <div className={styles.title}>
                        打作业
                    </div>
                    <div className={styles.loginControl}>
                        <div className={styles.avatar}>
                            <img src={Avatar} alt={"avatar"}/>
                        </div>
                        <div>
                            <span>曲硕nb</span>
                        </div>
                        <div>
                            <Button icon={"logout"} ghost onClick={() => setLogout(true)}/>
                        </div>
                    </div>
                </Header>
                <Content className={styles.content}>
                    {props.children}
                </Content>
                <Modal title=""
                       visible={logout}
                       onCancel={() => {
                           setLogout(false);
                       }}
                       onOk={() => {
                           console.log("正在退出");
                           setLogout(false);
                           setLoginState(false);
                       }}
                       okText="退出"
                       cancelText="取消"
                       okType="danger">
                    <h3>
                        确认退出系统
                    </h3>
                </Modal>
            </Layout>
        </Layout>
    )
};
export default MainLayout;