import React, {useState} from "react";
import {FormComponentProps} from "antd/lib/form";
import {Button, Form, Input} from "antd";

import styles from '../../Containers/Account/index.module.scss'

export interface IFormPayload {
    admin_id: string,
    name: string,
    password: string
}

export interface IFormProps extends FormComponentProps {
    onSubmit: (payload: IFormPayload) => void,
    userData: { admin_id: string, identity: string, name: string }
}

const IForm = (props: IFormProps) => {
    const [editName, setEditName] = useState(false);
    const [editPasswd, setEditPasswd] = useState(false);

    const compareToFirstPassword = (rule: any, value: any, callback: any) => {
        const form = props.form;
        if (value !== form.getFieldValue('password')) {
            if (!value) {
                callback("请确认密码");
            } else {
                callback('两次密码不一致');
            }
        } else {
            callback();
        }
    };

    const validateToNextPassword = (rule: any, value: any, callback: any) => {
        const form = props.form;
        if (value) {
            form.validateFields(['confirm'], {force: true});
        }
        callback();
    };

    const handleSubmit = (e: any) => {
        e.preventDefault();
        props.form.validateFields((err, value: any) => {
            if (err)
                return;
            props.onSubmit(value);
        })
    };
    const {getFieldDecorator} = props.form;
    return (
        <div>
            <h1><strong>个人资料修改</strong></h1>
            <div className={styles.root}>
                <Form style={{background: "white"}} className={styles.hbox}>
                    <Form.Item label="用户id">
                        {getFieldDecorator('admin_id', {
                            rules: [{type: "string", required: true, message: "请输入用户id"}],
                            initialValue: props.userData.admin_id
                        })(<Input style={{width: "90%"}} disabled={true}/>)}
                    </Form.Item>
                    <Form.Item label="身份标志">
                        {getFieldDecorator('identity', {
                            rules: [{type: "string", required: true, message: "请输入用户标志"}],
                            initialValue: props.userData.identity
                        })(<Input style={{width: "90%"}} disabled={true}/>)}
                    </Form.Item>
                    <Form.Item label="用户名">
                        <Button onClick={() => setEditName(!editName)} icon={"lock"}/>
                        {getFieldDecorator('name', {
                            rules: [{type: "string", required: true, message: "请输入用户名"}],
                            initialValue: props.userData.name
                        })(<Input placeholder={"请输入用户名"} style={{width: "90%"}} disabled={!editName}/>)}
                    </Form.Item>
                    <Form.Item label="修改密码" hasFeedback>
                        <Button onClick={() => setEditPasswd(!editPasswd)} icon={"lock"}/>
                        {getFieldDecorator('password', {
                            rules: [
                                {pattern: /^(\S){6,15}$/, message: "密码长度不符合规范"},
                                {validator: validateToNextPassword},
                            ],
                            initialValue: undefined
                        })(<Input.Password style={{width: "90%"}} disabled={!editPasswd}/>)}
                    </Form.Item>
                    <Form.Item label="确认密码" hasFeedback>
                        <Button onClick={() => setEditPasswd(!editPasswd)} icon={"lock"}/>
                        {getFieldDecorator('confirm', {
                            rules: [
                                {validator: compareToFirstPassword},
                            ],
                            initialValue: undefined
                        })(<Input.Password style={{width: "90%"}} disabled={!editPasswd}/>)}
                    </Form.Item>
                    <Form.Item>
                        <Button onClick={handleSubmit} icon={"plus-circle"} type={"primary"}>确认修改</Button>
                    </Form.Item>
                </Form>
            </div>
        </div>
    )
};

const IAccountForm = Form.create<IFormProps>()(IForm);

export default IAccountForm;