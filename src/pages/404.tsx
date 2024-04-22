import { Button, Result } from 'antd';
import React from 'react';
// import { history } from '@umijs/max';
import { history } from '@umijs/max'

const NoFoundPage: React.FC = () => {
  // 如果是开发环境，走本地的404，如果是生产环境，走统一的404
  if (process.env.NODE_ENV !== 'development') location.href = window.location.origin + '/404';

  return (
    <Result
      status="404"
      title="404"
      subTitle="Sorry, the page you visited does not exist."
      extra={
        <Button type="primary" onClick={() => history.push('/')}>
          Back Home
        </Button>
      }
    />
  );
};

export default NoFoundPage;
