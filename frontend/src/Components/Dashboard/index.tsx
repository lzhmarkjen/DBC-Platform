import React from "react";
import {Card, Icon} from "antd";

export interface ICardProp {
    messages: any[]
}

const {Meta} = Card;
export const ICardPanel = (props: ICardProp) => {
    const items = props.messages.map((e) => <Card hoverable>
        <Meta avatar={<Icon type="user"/>} title={`${e.admin_id}号管理员`} description={e.work_mess_info}/>
    </Card>);
    return (<Card title={"最近消息"} type={"inner"} style={{height: "500px"}}>
        {items}
    </Card>)
};

export const getOption = (occupy: string, capacity: string, repository_name: string) => {
    return ({
        color: ["#ff7d00", "#b2c9de"],
        title: {
            text: repository_name,
            x: 'center'
        },
        tooltip: {
            trigger: 'item',
            formatter: "{a} <br/>{b} : {c} ({d}%)"
        },
        series: [
            {
                name: repository_name,
                type: 'pie',
                radius: '50%',
                center: ['50%', '50%'],
                data: [
                    {value: parseInt(occupy), name: '占用'},
                    {value: parseInt(capacity) - parseInt(occupy), name: '空闲'}
                ],
                itemStyle: {
                    emphasis: {
                        shadowBlur: 10,
                        shadowOffsetX: 0,
                        shadowColor: 'rgba(0, 0, 0, 0.5)'
                    }
                }
            }
        ]
    });
};

export const getGraph = (cust_name: string[], cust_orders: string[]) => {
    return ({
        title: {
            text: '客户合作订单图',
            subtext: '数据自动生成',
            x: 'center'
        },
        color: ['#3398DB'],
        tooltip: {
            trigger: 'axis',
            axisPointer: {
                type: 'shadow'
            }
        },
        toolbox: {
            feature: {
                saveAsImage: {}
            }
        },
        grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
        },
        xAxis: [
            {
                type: 'category',
                data: cust_name,
                axisTick: {
                    alignWithLabel: true
                }
            }
        ],
        yAxis: [
            {
                type: 'value'
            }
        ],
        series: [
            {
                name: '合作订单数',
                type: 'bar',
                barWidth: '60%',
                data: cust_orders
            }
        ]
    });
};