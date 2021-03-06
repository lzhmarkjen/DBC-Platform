import React, {useEffect, useState} from 'react'
import ISearchPanel from "../../../Components/SearchPanel";
import INewRepoInPanel, {IFormPayload} from "../../../Components/Repository/in/form";
import styles from "../index.module.scss"
import {Table, Button, Drawer, message, Spin} from 'antd';
import GenColumns from "../../../Components/Repository/in";
import inApiData from "../../../Assets/mockingApiData/Repository/in";
import Axios from "axios";
import {APIList} from "../../../API";
import IEditMessModel from "../../../Components/Repository";

const PageRepositoryIn = () => {
    const [apiData, setApiData] = useState(inApiData);
    const [listData, setListData] = useState(apiData.RepoMessIn);
    const [modelOpen, setModelOpen] = useState(false);
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [curRepoMess, setCurRepoMess] = useState(undefined);
    const [loading, setLoading] = useState(true);

    const handlePost = (prop: any) => {
        Axios.post(APIList.repoIn, prop, {withCredentials: true})
            .then(res => {
                console.log(res);
                update();
            })
            .catch(() => message.error("入库信息新建失败"));
    };
    const handlePut = (prop: any) => {
        Axios.put(APIList.repoIn, prop, {withCredentials: true})
            .then(res => {
                console.log(res);
                update();
            })
            .catch(() => message.error("入库状态修改失败"));
    };
    const update = () => {
        setLoading(true);
        Axios.get(APIList.repoIn, {withCredentials: true})
            .then(res => {
                setApiData(res.data);
                setListData(res.data.RepoMessIn);
                console.log("入库信息", res.data);
                setLoading(false);
            })
            .catch(() => message.error("入库信息获取失败"))
    };

    useEffect(update, []);

    const Action = (props: { record: any }) => <div className={styles.hbox}>
        <Button onClick={() => {
            setCurRepoMess(props.record);
            setModelOpen(true);
        }}
                icon={'edit'}
                type={'primary'}>
            修改状态
        </Button>
    </div>;
    const columns = GenColumns(Action);
    const content = (
        <div>
            <div className={styles.ControlPanel}>
                <ISearchPanel
                    field={{
                        "repo_mess_id": "转入编号",
                        "repo_mess_info": "转入详情",
                        "repo_name": "仓库名",
                        "prod_name": "产品名",
                        "order_id": "订单号",
                    }}
                    onSearch={(e) => !e.content ? setListData(listData) :
                        setListData(listData.filter((k: any) => (k[e.field] as string).indexOf(e.content) !== -1))}
                    onClear={() => setListData(listData)}
                />
                <Button icon={"plus-circle"} type={"primary"} onClick={() => setDrawerOpen(true)}>新增转入</Button>
            </div>
            <Table
                columns={columns}
                dataSource={listData}
                rowKey={listData => listData.repo_mess_id}
            />

            <IEditMessModel
                modelOpen={modelOpen}
                onCancel={() => {
                    setModelOpen(false);
                    setCurRepoMess(undefined);
                }}
                onOk={() => {
                    setModelOpen(false);
                    setCurRepoMess(undefined);
                }}
                curRepoMess={curRepoMess}
                onSubmit={(e) => {
                    const editRepoMess = {
                        "type": "EDIT_MESS_IN",
                        "data": {
                            "repo_mess_id": e.repo_mess_id,
                            "state": e.state
                        }
                    };
                    console.log("修改数据");
                    console.log(editRepoMess);
                    handlePut(editRepoMess);
                }}/>

            <Drawer title={"新建转入记录"}
                    width={720}
                    onClose={() => setDrawerOpen(false)}
                    visible={drawerOpen}>

                <INewRepoInPanel prods={apiData.Prod.map(e => ({"key": e.prod_id, "value": e.prod_name}))}
                                 repos={apiData.Repo.map(e => ({"key": e.repo_id, "value": e.repo_name}))}
                                 orders={apiData.Order.map(e => ({"key": e.order_id, "value": e.order_id}))}
                                 onSubmit={(e: IFormPayload) => {
                                     setDrawerOpen(false);
                                     const newRepoMess = {
                                         "type": "NEW_MESS_IN",
                                         "data": {
                                             "repo_mess_info": e.repo_mess_info,
                                             "prod_id": e.prod_id,
                                             "quantity": e.quantity,
                                             "repo_id": e.repo_id,
                                             "order_id": e.order_id
                                         }
                                     };
                                     console.log("表单数据");
                                     console.log(newRepoMess);
                                     handlePost(newRepoMess);
                                 }}/>
            </Drawer>
        </div>
    );
    return loading ? <Spin/> : content;
};
export default PageRepositoryIn;