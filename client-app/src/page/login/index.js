import React from 'react';
import { Form, Input, Button, Divider, Typography } from 'antd';
import style from './index.less';
const { Title, Text } = Typography;
import Img from 'assets/img/camera/back.JPG';
import { useDispatch } from 'react-redux';
import { SessionModel } from 'models';
const layout = {
    wrapperCol: {
        span: 24,
    },
};
const tailLayout = {
    wrapperCol: {
        offset: 8,
        span: 16,
    },
};
const Login = () => {
    const dispatch = useDispatch();
    const {
        actions: { login },
    } = SessionModel;
    const onFinish = (values) => {
        dispatch(login(values));
    };
    const onFinishFailed = (errorInfo) => {
        console.log('Failed:', errorInfo);
    };
    return (
        <div className={style.login_wrapper}>
            <div className={style.login_back_left}>
                <img src={Img} />
            </div>
            <Form
                {...layout}
                name='basic'
                initialValues={{ remember: true }}
                onFinish={onFinish}
                onFinishFailed={onFinishFailed}
                className={style.login_wrapper_inner}
            >
                <Title level={4} className={style.login_title}>
                    Sign In
                </Title>
                <Text level={5} type='secondary'>
                    USER
                </Text>
                <Form.Item name='username' colon={false}>
                    <Input
                        autoComplete='off'
                        bordered={false}
                        placeholder='user'
                        size='large'
                    />
                </Form.Item>
                <Divider />
                <Text level={5} type='secondary'>
                    PASSWORD
                </Text>
                <Form.Item name='password' colon={false}>
                    <Input.Password
                        autoComplete='off'
                        bordered={false}
                        placeholder='password'
                        size='large'
                    />
                </Form.Item>
                <Divider />
                <Form.Item {...tailLayout}>
                    <Button type='primary' htmlType='submit' className={style.login_btn}>
                        Start
                    </Button>
                </Form.Item>
            </Form>
        </div>
    );
};
export default Login;
