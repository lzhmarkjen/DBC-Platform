import React from "react";
import {IDetailData} from "../../../../Containers/Repository/Dashboard";
import {IRepoMess, IWorkMess} from "../../interface";
import {Table} from "antd";
import GenColumns from "../../out";

interface IProps {
    data: IDetailData
}

const MessagesShow = 5;
const RepoMessOut = (props: IProps) => {
    const data: IRepoMess[] = props.data.RepoMessOut.slice(0, MessagesShow);
    const columns = GenColumns((props: { record: any }) => <React.Fragment> </React.Fragment>).slice(0, 7);

    return (
        <Table pagination={false}
               columns={columns}
               dataSource={data}
               rowKey={data => data.repo_mess_id}
        />)
};
export default RepoMessOut