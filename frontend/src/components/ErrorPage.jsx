import React from 'react';
import NotFound from './NotFound';
import ServerError from './ServerError';

const ErrorPage = ({ errorCode }) => {
  switch (errorCode) {
    case 404:
      return <NotFound />;
    case 500:
      return <ServerError />;
    default:
      return <div>An unexpected error occurred.</div>;
  }
};

export default ErrorPage;
