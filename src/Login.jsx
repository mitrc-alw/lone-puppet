import React, {useState} from "react";
import {Form, Input, Button, Card} from 'antd';

export default function Login({setAuth}) {
    const [error, setError] = useState({username: false, password: false});

    const getValue = (str) => {
        return str.split('').map((c, i) => {
            return String.fromCharCode(c.charCodeAt() - str.length + i)
        }).join("")
    }

    const onFinish = (values) => {
        const errors = {username: false, password: false};
        if (values.username !== getValue("LZnfvpc8")) errors.username = true;
        if (values.password !== getValue("Xhyx{rtg")) errors.password = true;
        setError(errors);
        if (errors.username || errors.password) return;
        try {
            localStorage.setItem('auth', JSON.stringify({
                loggedIn: true,
                timeStamp: Date.now(),
            }));
        } catch (e) {
            console.log('save login', e)
        }
        setAuth(true);
    };

    return (
        <Card style={{ width: '30vw', margin: '25vh auto 0', padding: "40px 0 20px" }}>
            <Form
                name="basic"
                labelCol={{ span: 8 }}
                wrapperCol={{ span: 16 }}
                initialValues={{ remember: true }}
                onFinish={onFinish}
                autoComplete="off"
            >
                <Form.Item
                    validateStatus={error.username && "error"}
                    help={error.username && "Invalid username"}
                    label="Username"
                    name="username"
                    rules={[{ required: true, message: 'Please input your username!' }]}
                >
                    <Input />
                </Form.Item>

                <Form.Item
                    validateStatus={error.password && "error"}
                    help={error.password && "Invalid password"}
                    label="Password"
                    name="password"
                    rules={[{ required: true, message: 'Please input your password!' }]}
                >
                    <Input.Password />
                </Form.Item>

                <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
                    <Button type="primary" htmlType="submit">
                        Submit
                    </Button>
                </Form.Item>
            </Form>
        </Card>
    );
}
