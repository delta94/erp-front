import React from 'react';
import NextHead from 'next/head';
import { string } from 'prop-types';

const Head = ({ title, description }) => (
  <NextHead>
    <title>{title}</title>
    <meta charSet='UTF-8' />
    <meta name='description' content={description} />
    <meta name='viewport' content='width=device-width, initial-scale=1.0' />
    <meta httpEquiv='X-UA-Compatible' content='IE=edge' />
  </NextHead>
);

Head.propTypes = {
  title: string,
  description: string,
};

Head.defaultProps = {
  title: 'dygit',
  description: 'ERP System',
};

export default Head;
